const axios = require('axios');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN non configurato');

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const userData = {};

// ============ LINK ============

const SITO = {
    home: 'https://www.wineworldweb.it',
    vini: 'https://www.wineworldweb.it/wine',
    mondovino: 'https://www.wineworldweb.it/wineworld',
    blog: 'https://www.wineworldweb.it/blog',
    docg: 'https://www.wineworldweb.it/docg'
};

const SOCIAL = {
    instagram: 'https://www.instagram.com/wineworldweb.it/',
    facebook: 'https://www.facebook.com/profile.php?id=61583979324726',
    linkedin: 'https://www.linkedin.com/in/daniele-picone-9218122b2/',
    pinterest: 'https://www.pinterest.com/wineworldwebit/',
    x: 'https://x.com/wineworldweb'
};

// ============ DATABASE VINI ============

const VINI = [
    {
        nome: "Barolo", tipo: "Rosso", regione: "Piemonte", gradazione: "13-15%",
        temperatura: "18°C", bicchiere: "Borgogna",
        descrizione: "Un vino nobile e complesso, perfetto per cene importanti",
        abbinamento: "Carni rosse, formaggi stagionati, tartufo",
        cibi: ["carne", "manzo", "bistecca", "brasato", "tartufo", "formaggio stagionato", "selvaggina"],
        curiosita: "Viene chiamato il 'Re dei vini, vino dei Re' per il legame storico con i Savoia",
        battuta: "Il Barolo è come me: elegante, sofisticato e un po' altezzoso! 🍷",
        emoji: "👑"
    },
    {
        nome: "Prosecco", tipo: "Bianco Frizzante", regione: "Veneto", gradazione: "11%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "Fresco, vivace e sempre pronto a festeggiare",
        abbinamento: "Aperitivi, frutti di mare, dolci, affettati",
        cibi: ["aperitivo", "gamberi", "frutti di mare", "antipasto", "dolce", "torta", "speck", "prosciutto"],
        curiosita: "Le colline di Conegliano e Valdobbiadene, sua patria, sono Patrimonio UNESCO",
        battuta: "Il Prosecco è il mio migliore amico - sempre allegro e festaiolo! 🎉",
        emoji: "🥂"
    },
    {
        nome: "Chianti", tipo: "Rosso", regione: "Toscana", gradazione: "12-13%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Versatile e amichevole, il compagno perfetto di ogni pasto",
        abbinamento: "Pasta, pizza, carni, bistecca fiorentina",
        cibi: ["pasta", "pizza", "bistecca", "pollo", "maiale", "ragù", "lasagne", "carne"],
        curiosita: "Il simbolo del Chianti Classico è il Gallo Nero, presente già nel XIII secolo",
        battuta: "Il Chianti? È come me: accessibile a tutti ma con una profondità sorprendente! 😉",
        emoji: "🐓"
    },
    {
        nome: "Amarone", tipo: "Rosso", regione: "Veneto", gradazione: "15-17%",
        temperatura: "18-20°C", bicchiere: "Borgogna grande",
        descrizione: "Intenso e passionale, per chi ama le emozioni forti",
        abbinamento: "Carni in umido, formaggi blu, cioccolato fondente",
        cibi: ["stufato", "brasato", "ossobuco", "gorgonzola", "cioccolato", "selvaggina", "cinghiale"],
        curiosita: "Nasce dall'appassimento delle uve per mesi su graticci, che ne concentra zuccheri e aromi",
        battuta: "L'Amarone è il vino più drammatico che conosco - sempre con storie da raccontare! 🎭",
        emoji: "🌹"
    },
    {
        nome: "Moscato d'Asti", tipo: "Bianco Dolce", regione: "Piemonte", gradazione: "5%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "Dolce, fresco e leggermente frizzante - la felicità in un bicchiere",
        abbinamento: "Dolci, frutta, formaggi freschi, pasticceria",
        cibi: ["torta", "dolce", "frutta", "panettone", "croissant", "dessert", "gelato", "tiramisù"],
        curiosita: "Ha una gradazione alcolica molto bassa, spesso intorno al 5%",
        battuta: "Il Moscato d'Asti è come una giornata di sole - ti fa sempre sorridere! ☀️",
        emoji: "🍑"
    },
    {
        nome: "Nero d'Avola", tipo: "Rosso", regione: "Sicilia", gradazione: "13-14%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Caldo, avvolgente e pieno di sole siciliano",
        abbinamento: "Arrosticini, pasta alla norma, pesce spada, melanzane",
        cibi: ["melanzane", "pesce spada", "tonno", "pasta", "arancini", "salsiccia", "agnello"],
        curiosita: "Prende il nome da Avola, cittadina in provincia di Siracusa",
        battuta: "Il Nero d'Avola è il vino più caloroso che conosca - ti abbraccia come un amico! 🤗",
        emoji: "☀️"
    },
    {
        nome: "Vermentino", tipo: "Bianco", regione: "Sardegna", gradazione: "12-13%",
        temperatura: "8-10°C", bicchiere: "Tulipano",
        descrizione: "Fresco come una brezza marina, perfetto per l'estate",
        abbinamento: "Pesce, frutti di mare, insalate, antipasti leggeri",
        cibi: ["pesce", "branzino", "orata", "salmone", "insalata", "gamberi", "calamari", "polpo"],
        curiosita: "Il Vermentino di Gallura è l'unica DOCG bianca della Sardegna",
        battuta: "Il Vermentino è il mio compagno di vacanza preferito - sempre rinfrescante! 🏖️",
        emoji: "🌊"
    },
    {
        nome: "Brunello di Montalcino", tipo: "Rosso", regione: "Toscana", gradazione: "13-15%",
        temperatura: "18-20°C", bicchiere: "Borgogna grande",
        descrizione: "Potente e longevo, uno dei grandi rossi italiani da invecchiamento",
        abbinamento: "Selvaggina, brasati, formaggi stagionati, tartufo nero",
        cibi: ["selvaggina", "cinghiale", "capriolo", "brasato", "tartufo", "pecorino stagionato"],
        curiosita: "Deve invecchiare per legge almeno 5 anni prima di essere venduto",
        battuta: "Il Brunello non ha fretta: come i grandi capolavori, ha bisogno di tempo! ⏳",
        emoji: "⏳"
    },
    {
        nome: "Franciacorta", tipo: "Spumante", regione: "Lombardia", gradazione: "12%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "Le bollicine italiane per eccellenza, eleganti e raffinate",
        abbinamento: "Aperitivi, pesce, risotti, tutto il pasto",
        cibi: ["risotto", "pesce", "antipasto", "aperitivo", "sushi", "ostriche", "capesante"],
        curiosita: "È prodotto con lo stesso metodo classico dello Champagne, la rifermentazione in bottiglia",
        battuta: "Il Franciacorta fa le bollicine ma prende sul serio se stesso, proprio come un vero gentiluomo! 🥂",
        emoji: "✨"
    },
    {
        nome: "Primitivo di Manduria", tipo: "Rosso", regione: "Puglia", gradazione: "14-16%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Corposo, caldo e ricco di frutto maturo",
        abbinamento: "Carni alla griglia, formaggi piccanti, salumi",
        cibi: ["grigliata", "salsiccia", "agnello", "costine", "formaggio piccante", "salumi", "hamburger"],
        curiosita: "È geneticamente lo stesso vitigno dello Zinfandel californiano",
        battuta: "Il Primitivo è il vino che non fa mai le cose a metà! 💪",
        emoji: "🔥"
    },
    {
        nome: "Aglianico del Vulture", tipo: "Rosso", regione: "Basilicata", gradazione: "13-14%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Strutturato e minerale, cresciuto sui suoli vulcanici del Vulture",
        abbinamento: "Carni rosse, salumi, formaggi stagionati",
        cibi: ["agnello", "capretto", "salsiccia", "pecorino", "salumi", "maiale"],
        curiosita: "Viene chiamato il 'Barolo del Sud' per la sua grande capacità di invecchiamento",
        battuta: "L'Aglianico è tosto fuori ma sorprendente dentro, un po' come i migliori amici! 🌋",
        emoji: "🌋"
    },
    {
        nome: "Verdicchio dei Castelli di Jesi", tipo: "Bianco", regione: "Marche", gradazione: "12-13%",
        temperatura: "8-10°C", bicchiere: "Tulipano",
        descrizione: "Sapido e minerale, con una piacevole nota di mandorla",
        abbinamento: "Pesce, brodetto, frutti di mare, mozzarella",
        cibi: ["pesce", "brodetto", "vongole", "cozze", "mozzarella", "frittura di pesce"],
        curiosita: "Cresce in vigneti che si affacciano sull'Adriatico, da cui prende sapidità",
        battuta: "Il Verdicchio è discreto ma quando lo assaggi non lo dimentichi più! 🐟",
        emoji: "🐟"
    },
    {
        nome: "Lagrein", tipo: "Rosso", regione: "Alto Adige", gradazione: "13-14%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Profondo, fruttato e con un caratteristico tannino vellutato",
        abbinamento: "Speck, canederli, carni di montagna, cervo",
        cibi: ["speck", "canederli", "cervo", "cinghiale", "stinco", "wurstel", "crauti"],
        curiosita: "È un vitigno autoctono coltivato quasi esclusivamente in Alto Adige",
        battuta: "Il Lagrein arriva dalla montagna ma ha l'animo di un vino da grande occasione! ⛰️",
        emoji: "⛰️"
    },
    {
        nome: "Cannonau di Sardegna", tipo: "Rosso", regione: "Sardegna", gradazione: "13-15%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Robusto e generoso, vino simbolo della longevità sarda",
        abbinamento: "Carne di pecora, salumi, formaggi sardi, porceddu",
        cibi: ["pecora", "agnello", "porceddu", "pecorino", "salumi", "salsiccia sarda"],
        curiosita: "Alcuni studi lo collegano alla straordinaria longevità degli abitanti della Barbagia",
        battuta: "Si dice che il Cannonau aiuti a vivere più a lungo... ma con moderazione, mi raccomando! 🧓",
        emoji: "🌿"
    },
    {
        nome: "Greco di Tufo", tipo: "Bianco", regione: "Campania", gradazione: "12-13%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Elegante e strutturato, uno dei grandi bianchi del Sud Italia",
        abbinamento: "Pesce, crostacei, formaggi freschi, mozzarella di bufala",
        cibi: ["pesce", "crostacei", "astice", "gamberi", "mozzarella", "bufala", "frittura"],
        curiosita: "Cresce su terreni di origine vulcanica vicino al Vesuvio",
        battuta: "Il Greco di Tufo non è semplice, è un bianco con la testa di un grande rosso! 🏛️",
        emoji: "🏛️"
    },
    {
        nome: "Cerasuolo d'Abruzzo", tipo: "Rosato", regione: "Abruzzo", gradazione: "12-13%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Vivace e dal colore intenso, molto più di un semplice rosato",
        abbinamento: "Antipasti, pesce saporito, arrosticini, porchetta",
        cibi: ["arrosticini", "porchetta", "pesce", "antipasto", "pizza", "verdure grigliate"],
        curiosita: "Il nome deriva dal colore che ricorda la ciliegia (cerasa, in dialetto abruzzese)",
        battuta: "Il Cerasuolo non è un rosato qualunque, ha la grinta di un vino rosso! 🍒",
        emoji: "🍒"
    },
    {
        nome: "Soave", tipo: "Bianco", regione: "Veneto", gradazione: "11-12%",
        temperatura: "8-10°C", bicchiere: "Tulipano",
        descrizione: "Delicato e floreale, con un finale leggermente ammandorlato",
        abbinamento: "Antipasti, risotti, pesce di lago, formaggi freschi",
        cibi: ["risotto", "pesce di lago", "trota", "carpaccio", "antipasto", "verdure"],
        curiosita: "Prende il nome dall'omonima cittadina fortificata vicino Verona",
        battuta: "Il Soave è discreto come il nome suggerisce, ma sa farsi notare nel bicchiere! 🏰",
        emoji: "🏰"
    },
    {
        nome: "Lambrusco", tipo: "Rosso Frizzante", regione: "Emilia-Romagna", gradazione: "10-11%",
        temperatura: "12-14°C", bicchiere: "Bordeaux",
        descrizione: "Allegro e dissetante, perfetto compagno della cucina emiliana",
        abbinamento: "Salumi, tortellini, parmigiano, gnocco fritto",
        cibi: ["tortellini", "salumi", "mortadella", "parmigiano", "gnocco fritto", "pasta ripiena", "lasagne"],
        curiosita: "Esistono decine di varietà di Lambrusco, dal secco al dolce",
        battuta: "Il Lambrusco non si prende mai troppo sul serio, è il vino della convivialità! 🎈",
        emoji: "🎈"
    }
];

const BATTUTE = [
    "Perché i vini rossi vanno sempre a cena? Perché hanno il corpo! 🍷",
    "Qual è il vino più fedele? Il Barolo - rimane sempre nella cantina! 😄",
    "Un vino bianco entra in un bar... esce ubriaco! 🍾",
    "Perché il vino non va mai a scuola? Perché è già invecchiato! 📚",
    "L'amore è come il vino: migliore quando è condiviso! ❤️",
    "Io non bevo per dimenticare... bevo per ricordare meglio! 🧠",
    "Un bicchiere di vino al giorno toglie il medico di torno... ma io sono un bot! 🤖",
    "Il vino è la prova che Dio ci ama e vuole che siamo felici! 😇",
    "Perché il sommelier non si perde mai? Perché ha sempre il naso fine! 👃",
    "Cosa dice un grappolo d'uva quando viene pigiato? Ahi, che pressione! 🍇",
    "Il mio vino preferito? Quello che è già stato versato! 🥂",
    "Perché lo Champagne è sempre allegro? Perché ha le bollicine al posto dei pensieri! ✨"
];

const SITUAZIONI = [
    { situazione: "💑 Primo appuntamento", consiglio: "Prosecco", motivo: "fresco, elegante e non troppo impegnativo" },
    { situazione: "🕯️ Cena romantica", consiglio: "Barolo", motivo: "nobile, sofisticato e indimenticabile" },
    { situazione: "🎉 Festa con amici", consiglio: "Chianti", motivo: "allegro, versatile e sempre benvenuto" },
    { situazione: "😞 Dopo una brutta giornata", consiglio: "Amarone", motivo: "intenso e consolante" },
    { situazione: "🍰 Dolce serata", consiglio: "Moscato d'Asti", motivo: "dolce come i tuoi pensieri" },
    { situazione: "☀️ Pranzo estivo", consiglio: "Vermentino", motivo: "fresco come una brezza marina" },
    { situazione: "👨‍👩‍👧 Cena di famiglia", consiglio: "Nero d'Avola", motivo: "caloroso e accogliente" },
    { situazione: "🏆 Celebrazione importante", consiglio: "Franciacorta", motivo: "bollicine eleganti per i grandi traguardi" },
    { situazione: "🔥 Grigliata tra amici", consiglio: "Primitivo di Manduria", motivo: "corposo e generoso come la compagnia" },
    { situazione: "🏖️ Aperitivo in spiaggia", consiglio: "Cerasuolo d'Abruzzo", motivo: "fresco, vivace, perfetto col sole" },
    { situazione: "🦞 Cena di pesce importante", consiglio: "Greco di Tufo", motivo: "elegante e strutturato" },
    { situazione: "🍝 Serata di tortellini e salumi", consiglio: "Lambrusco", motivo: "allegro e dissetante" }
];

const DOMANDE_QUIZ = [
    { domanda: "Quale regione è famosa per il Barolo?", opzioni: ["Piemonte", "Toscana", "Veneto"], risposta: 0 },
    { domanda: "Il Prosecco è un vino rosso o bianco frizzante?", opzioni: ["Rosso", "Bianco Frizzante", "Rosato"], risposta: 1 },
    { domanda: "Quale vino viene dalla Sicilia?", opzioni: ["Chianti", "Nero d'Avola", "Amarone"], risposta: 1 },
    { domanda: "Quanti anni minimo deve invecchiare il Brunello di Montalcino?", opzioni: ["2 anni", "5 anni", "10 anni"], risposta: 1 },
    { domanda: "Il Franciacorta usa lo stesso metodo di quale vino francese?", opzioni: ["Bordeaux", "Champagne", "Beaujolais"], risposta: 1 },
    { domanda: "Il Primitivo è lo stesso vitigno di quale vino americano?", opzioni: ["Zinfandel", "Merlot", "Syrah"], risposta: 0 },
    { domanda: "Da dove deriva il nome 'Cerasuolo'?", opzioni: ["Da una città", "Dal colore della ciliegia", "Da un vitigno francese"], risposta: 1 },
    { domanda: "Quale vino è chiamato il 'Barolo del Sud'?", opzioni: ["Aglianico del Vulture", "Cannonau", "Verdicchio"], risposta: 0 },
    { domanda: "Il Lagrein è autoctono di quale regione?", opzioni: ["Alto Adige", "Calabria", "Marche"], risposta: 0 },
    { domanda: "Il Vermentino di Gallura è l'unica DOCG bianca di quale regione?", opzioni: ["Sardegna", "Liguria", "Sicilia"], risposta: 0 },
    { domanda: "Il Prosecco Patrimonio UNESCO nasce tra Conegliano e...?", opzioni: ["Valdobbiadene", "Montalcino", "Asti"], risposta: 0 },
    { domanda: "Quale vino nasce dall'appassimento delle uve su graticci?", opzioni: ["Soave", "Amarone", "Lambrusco"], risposta: 1 },
    { domanda: "A che temperatura si serve il Barolo?", opzioni: ["8-10°C", "12-14°C", "18°C"], risposta: 2 },
    { domanda: "Quale vino ha la gradazione alcolica più bassa?", opzioni: ["Moscato d'Asti (~5%)", "Soave (~11%)", "Chianti (~12%)"], risposta: 0 },
    { domanda: "In quale bicchiere si serve il Prosecco?", opzioni: ["Borgogna", "Flute", "Coppa"], risposta: 1 }
];

const VERO_FALSO = [
    { affermazione: "Champagne e Franciacorta usano lo stesso metodo di produzione.", vero: true, spiegazione: "✅ Esatto! Entrambi usano il Metodo Classico con rifermentazione in bottiglia." },
    { affermazione: "Più un vino rosso è vecchio, più è automaticamente buono.", vero: false, spiegazione: "❌ Falso: non tutti i vini sono fatti per invecchiare. Dipende dalla struttura del vitigno." },
    { affermazione: "Il Prosecco può essere prodotto solo in Veneto e Friuli Venezia Giulia.", vero: true, spiegazione: "✅ Vero, la denominazione DOC copre queste due regioni." },
    { affermazione: "Il rosato si ottiene mescolando vino bianco e rosso.", vero: false, spiegazione: "❌ Falso: nasce da una breve macerazione delle bucce di uve rosse. Mescolare è vietato per i vini fermi." },
    { affermazione: "Il Primitivo di Manduria è coltivato in Puglia.", vero: true, spiegazione: "✅ Esatto, è uno dei vitigni simbolo del Salento." },
    { affermazione: "Tutti i vini bianchi si servono sotto i 6°C.", vero: false, spiegazione: "❌ Falso: i bianchi strutturati si servono tra 10-12°C per esprimere meglio gli aromi." },
    { affermazione: "Il Cannonau è associato alla longevità delle popolazioni sarde.", vero: true, spiegazione: "✅ Vero, alcuni studi lo collegano alle 'zone blu' della Barbagia." },
    { affermazione: "Il tappo a vite indica sempre un vino di bassa qualità.", vero: false, spiegazione: "❌ Falso: oggi è usato anche su vini di alta qualità per preservarne la freschezza." },
    { affermazione: "Il Brunello di Montalcino è prodotto con uva Sangiovese.", vero: true, spiegazione: "✅ Esatto! È prodotto al 100% con Sangiovese Grosso, detto localmente Brunello." },
    { affermazione: "L'Amarone è un vino da dessert per via della sua dolcezza.", vero: false, spiegazione: "❌ Falso: nonostante nasca da uve appassite, l'Amarone è un vino secco e potente." }
];

const VERO_FALSO_VALIDE = VERO_FALSO.filter(v => v.affermazione);

// ============ KEYWORD MAP per ricerca intelligente ============

const KEYWORD_CIBO = {
    "pasta": ["Chianti", "Lambrusco", "Nero d'Avola"],
    "pizza": ["Chianti", "Cerasuolo d'Abruzzo", "Primitivo di Manduria"],
    "pesce": ["Vermentino", "Verdicchio dei Castelli di Jesi", "Greco di Tufo", "Soave"],
    "carne": ["Barolo", "Chianti", "Brunello di Montalcino", "Primitivo di Manduria"],
    "bistecca": ["Barolo", "Chianti", "Brunello di Montalcino"],
    "salmone": ["Vermentino", "Franciacorta", "Soave"],
    "gamberi": ["Prosecco", "Vermentino", "Franciacorta"],
    "formaggi": ["Barolo", "Amarone", "Lambrusco"],
    "dolce": ["Moscato d'Asti", "Prosecco"],
    "grigliata": ["Primitivo di Manduria", "Chianti", "Aglianico del Vulture"],
    "aperitivo": ["Prosecco", "Franciacorta", "Cerasuolo d'Abruzzo"],
    "tartufo": ["Barolo", "Brunello di Montalcino"],
    "risotto": ["Soave", "Franciacorta", "Verdicchio dei Castelli di Jesi"],
    "tortellini": ["Lambrusco", "Chianti"],
    "salumi": ["Lambrusco", "Primitivo di Manduria", "Prosecco"],
    "cioccolato": ["Amarone", "Primitivo di Manduria"],
    "sushi": ["Franciacorta", "Vermentino", "Soave"],
    "selvaggina": ["Barolo", "Brunello di Montalcino", "Amarone"]
};

// ============ FUNZIONI HELPER ============

function oggiStringa() {
    return new Date().toISOString().slice(0, 10);
}

function ieriStringa() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}

function getUserData(userId, fromObj) {
    if (!userData[userId]) {
        userData[userId] = {
            nome: fromObj ? (fromObj.first_name || fromObj.username || null) : null,
            punti: 0,
            viniProvati: [],
            livello: 1,
            badge: [],
            streak: 0,
            ultimaAttivita: null,
            ultimoVinoDelGiorno: null
        };
    } else if (fromObj && !userData[userId].nome) {
        userData[userId].nome = fromObj.first_name || fromObj.username || null;
    }
    return userData[userId];
}

function aggiornaStreak(userId) {
    const user = getUserData(userId);
    const oggi = oggiStringa();
    if (user.ultimaAttivita === oggi) return;
    if (user.ultimaAttivita === ieriStringa()) {
        user.streak += 1;
    } else {
        user.streak = 1;
    }
    user.ultimaAttivita = oggi;
    if (user.streak >= 7 && !user.badge.includes("fedelissimo")) {
        user.badge.push("fedelissimo");
    }
}

function addPunti(userId, punti) {
    const user = getUserData(userId);
    user.punti += punti;
    user.livello = Math.floor(user.punti / 100) + 1;
    if (user.punti >= 50 && !user.badge.includes("sommelier_novizio")) user.badge.push("sommelier_novizio");
    if (user.punti >= 200 && !user.badge.includes("sommelier_esperto")) user.badge.push("sommelier_esperto");
    if (user.punti >= 500 && !user.badge.includes("sommelier_maestro")) user.badge.push("sommelier_maestro");
    if (user.viniProvati.length >= VINI.length && !user.badge.includes("esploratore_completo")) user.badge.push("esploratore_completo");
}

const NOMI_BADGE = {
    sommelier_novizio: "🥉 Sommelier Novizio",
    sommelier_esperto: "🥈 Sommelier Esperto",
    sommelier_maestro: "🥇 Sommelier Maestro",
    fedelissimo: "🔥 Fedelissimo (7 giorni di fila)",
    esploratore_completo: "🗺️ Esploratore Completo"
};

function formattaBadge(badgeArray) {
    if (!badgeArray || badgeArray.length === 0) return "Nessun badge ancora — inizia a giocare!";
    return badgeArray.map(b => NOMI_BADGE[b] || b).join("\n");
}

function barraProgresso(punti, livello) {
    const puntiInLivello = punti - (livello - 1) * 100;
    const filled = Math.min(Math.floor(puntiInLivello / 10), 10);
    const empty = 10 - filled;
    return '▓'.repeat(filled) + '░'.repeat(empty);
}

// ============ TELEGRAM HELPERS ============

async function sendMessage(chatId, text, parseMode = 'HTML') {
    try {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: parseMode,
            disable_web_page_preview: true
        });
    } catch (error) {
        console.error('Errore invio messaggio:', error?.response?.data || error.message);
    }
}

function validaBottoni(buttons) {
    return buttons.map(riga =>
        riga.filter(b => b && (b.url || b.callback_data))
    ).filter(riga => riga.length > 0);
}

async function sendMessageWithButtons(chatId, text, buttons) {
    const bottoniValidi = validaBottoni(buttons);
    try {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: { inline_keyboard: bottoniValidi }
        });
    } catch (error) {
        const dettaglio = error?.response?.data?.description || error.message;
        console.error('Errore bottoni:', dettaglio);
        try { await sendMessage(chatId, text); } catch (_) {}
    }
}

async function editMessage(chatId, messageId, text, buttons = null) {
    try {
        const payload = {
            chat_id: chatId,
            message_id: messageId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        };
        if (buttons) {
            payload.reply_markup = { inline_keyboard: validaBottoni(buttons) };
        }
        await axios.post(`${TELEGRAM_API}/editMessageText`, payload);
    } catch (error) {
        console.error('Errore modifica messaggio:', error?.response?.data || error.message);
    }
}

async function answerCallback(callbackQueryId, text = '') {
    try {
        await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
            callback_query_id: callbackQueryId,
            text: text,
            show_alert: false
        });
    } catch (error) {
        console.error('Errore callback:', error?.response?.data || error.message);
    }
}

async function sendTyping(chatId) {
    try {
        await axios.post(`${TELEGRAM_API}/sendChatAction`, { chat_id: chatId, action: 'typing' });
    } catch (_) {}
}

// ============ SCHEDA VINO ============

function schedaVino(vino, puntiMsg = '') {
    return `${vino.emoji} <b>${vino.nome}</b>
━━━━━━━━━━━━━━━━━━━
🍇 <b>Tipo:</b> ${vino.tipo}
📍 <b>Regione:</b> ${vino.regione}
🌡️ <b>Temperatura:</b> ${vino.temperatura}
🍾 <b>Bicchiere:</b> ${vino.bicchiere}
🔢 <b>Gradazione:</b> ${vino.gradazione}
━━━━━━━━━━━━━━━━━━━
📝 ${vino.descrizione}

🍽️ <b>Abbinamenti:</b> ${vino.abbinamento}

💡 <b>Lo sapevi?</b> ${vino.curiosita}

💬 <i>${vino.battuta}</i>${puntiMsg ? '\n\n' + puntiMsg : ''}`;
}

// ============ MENU ============

function menuPrincipaleButtons() {
    return [
        [{ text: "🍇 Vino casuale", callback_data: "menu_vino" }, { text: "📅 Vino del giorno", callback_data: "menu_vinodelgiorno" }],
        [{ text: "🔍 Cerca vino", callback_data: "menu_cerca" }, { text: "🍽️ Per cibo", callback_data: "menu_cibo" }],
        [{ text: "🎯 Indovina", callback_data: "menu_indovina" }, { text: "🎮 Quiz", callback_data: "menu_quiz" }],
        [{ text: "✅❌ Vero o Falso", callback_data: "menu_verofalso" }, { text: "😄 Battuta", callback_data: "menu_battuta" }],
        [{ text: "💰 I miei punti", callback_data: "menu_punti" }, { text: "🏆 Classifica", callback_data: "menu_classifica" }],
        [{ text: "🌐 WineWorld", url: SITO.home }]
    ];
}

function filtraButtons() {
    return [
        [{ text: "🔴 Rossi", callback_data: "filtra_Rosso" }, { text: "⚪ Bianchi", callback_data: "filtra_Bianco" }],
        [{ text: "🌸 Rosati", callback_data: "filtra_Rosato" }, { text: "🫧 Bollicine", callback_data: "filtra_bollicine" }],
        [{ text: "📍 Per regione", callback_data: "filtra_regione_menu" }],
        [{ text: "« Torna al menu", callback_data: "torna_menu" }]
    ];
}

function regioniButtons() {
    const regioni = [...new Set(VINI.map(v => v.regione))].sort();
    const rows = [];
    for (let i = 0; i < regioni.length; i += 2) {
        const row = [{ text: "📍 " + regioni[i], callback_data: `regione_${regioni[i]}` }];
        if (regioni[i + 1]) row.push({ text: "📍 " + regioni[i + 1], callback_data: `regione_${regioni[i + 1]}` });
        rows.push(row);
    }
    rows.push([{ text: "« Indietro", callback_data: "menu_cerca" }]);
    return rows;
}

function cibiPopolariButtons() {
    const cibi = ["pesce", "carne", "pasta", "pizza", "grigliata", "aperitivo", "dolce", "sushi", "risotto", "salumi", "formaggi", "salmone"];
    const rows = [];
    for (let i = 0; i < cibi.length; i += 3) {
        const row = cibi.slice(i, i + 3).map(c => ({ text: c, callback_data: `cibo_${c}` }));
        rows.push(row);
    }
    rows.push([{ text: "✏️ Scrivi il cibo", callback_data: "cibo_scrivi" }]);
    rows.push([{ text: "« Torna al menu", callback_data: "torna_menu" }]);
    return rows;
}

// ============ RICERCA VINO PER CIBO ============

function trovaViniPerCibo(ciboInput) {
    const cibo = ciboInput.toLowerCase().trim();

    // Cerca nelle keyword map
    for (const [keyword, viniNomi] of Object.entries(KEYWORD_CIBO)) {
        if (cibo.includes(keyword)) {
            return viniNomi.map(nome => VINI.find(v => v.nome === nome)).filter(Boolean);
        }
    }

    // Cerca direttamente nei campi cibi di ogni vino
    const risultati = VINI.filter(v =>
        v.cibi && v.cibi.some(c => cibo.includes(c) || c.includes(cibo))
    );

    return risultati.length > 0 ? risultati.slice(0, 3) : null;
}

// ============ GESTIONE TESTO LIBERO ============

async function handleFreeText(chatId, userId, text, fromObj) {
    getUserData(userId, fromObj);
    aggiornaStreak(userId);
    await sendTyping(chatId);

    const t = text.toLowerCase().trim();

    // Cerca vino per nome
    const vinoTrovato = VINI.find(v => t.includes(v.nome.toLowerCase()));
    if (vinoTrovato) {
        const user = getUserData(userId);
        let puntiMsg = '';
        if (!user.viniProvati.includes(vinoTrovato.nome)) {
            user.viniProvati.push(vinoTrovato.nome);
            addPunti(userId, 5);
            puntiMsg = '🎉 <i>Nuovo vino scoperto! +5 punti</i>';
        }
        await sendMessageWithButtons(chatId, schedaVino(vinoTrovato, puntiMsg), [
            [{ text: "🍷 Scopri sul sito", url: SITO.vini }, { text: "🎮 Quiz", callback_data: "menu_quiz" }],
            [{ text: "« Menu principale", callback_data: "torna_menu" }]
        ]);
        return;
    }

    // Abbinamento cibo
    const paroleCibo = ["mangio", "abbina", "abbinamento", "cibo", "piatto", "cucino", "ho cucinato", "stasera", "pranzo", "cena"];
    const isCibo = paroleCibo.some(p => t.includes(p));
    if (isCibo) {
        const viniSuggeriti = trovaViniPerCibo(t);
        if (viniSuggeriti && viniSuggeriti.length > 0) {
            const buttons = viniSuggeriti.map(v => [{ text: `${v.emoji} ${v.nome}`, callback_data: `scheda_${v.nome}` }]);
            buttons.push([{ text: "🍽️ Cerca per cibo", callback_data: "menu_cibo" }]);
            buttons.push([{ text: "« Menu principale", callback_data: "torna_menu" }]);
            await sendMessageWithButtons(chatId,
                `🍽️ <b>Abbinamento consigliato!</b>\n\nHo trovato ${viniSuggeriti.length} vino/i perfetti per te:\n\nTocca un vino per vedere la scheda completa:`,
                buttons
            );
            return;
        }
    }

    // Intento quiz/gioco
    if (t.includes("quiz") || t.includes("gioca") || t.includes("gioco") || t.includes("indovina")) {
        await sendMessageWithButtons(chatId, "🎮 <b>Vuoi giocare?</b> Scegli:", [
            [{ text: "🎮 Quiz", callback_data: "menu_quiz" }, { text: "🎯 Indovina il Vino", callback_data: "menu_indovina" }],
            [{ text: "✅❌ Vero o Falso", callback_data: "menu_verofalso" }],
            [{ text: "« Menu principale", callback_data: "torna_menu" }]
        ]);
        return;
    }

    // Intento punti/classifica
    if (t.includes("punti") || t.includes("livello") || t.includes("badge") || t.includes("classifica")) {
        await handleCommand(chatId, userId, t.includes("classifica") ? "/classifica" : "/punti", fromObj);
        return;
    }

    // Intento filtro tipo
    if (t.includes("rosso") || t.includes("rossi")) {
        await mostraViniFiltrati(chatId, "Rosso");
        return;
    }
    if (t.includes("bianco") || t.includes("bianchi")) {
        await mostraViniFiltrati(chatId, "Bianco");
        return;
    }
    if (t.includes("bollicin") || t.includes("spumante") || t.includes("prosecco") || t.includes("frizzante")) {
        await mostraViniFiltrati(chatId, "bollicine");
        return;
    }

    // Fallback con suggerimento intelligente
    await sendMessageWithButtons(chatId,
        `🤔 <b>Non ho capito bene, ma posso aiutarti!</b>\n\nProva a scrivere:\n• Il nome di un vino (es: <i>"barolo"</i>)\n• Un cibo (es: <i>"stasera mangio pesce"</i>)\n• Oppure usa il menu qui sotto 👇`,
        menuPrincipaleButtons()
    );
}

// ============ MOSTRA VINI FILTRATI ============

async function mostraViniFiltrati(chatId, filtro) {
    let viniRisultati;
    let titolo;

    if (filtro === "bollicine") {
        viniRisultati = VINI.filter(v => v.tipo.includes("Frizzante") || v.tipo === "Spumante");
        titolo = "🫧 <b>Vini con bollicine</b>";
    } else if (filtro.startsWith("📍")) {
        const regione = filtro.replace("📍 ", "");
        viniRisultati = VINI.filter(v => v.regione === regione);
        titolo = `📍 <b>Vini della ${regione}</b>`;
    } else {
        viniRisultati = VINI.filter(v => v.tipo.startsWith(filtro));
        const emoji = filtro === "Rosso" ? "🔴" : filtro === "Bianco" ? "⚪" : "🌸";
        titolo = `${emoji} <b>Vini ${filtro}i</b>`;
    }

    if (viniRisultati.length === 0) {
        await sendMessage(chatId, "Nessun vino trovato per questo filtro.");
        return;
    }

    const buttons = viniRisultati.map(v => [{ text: `${v.emoji} ${v.nome} — ${v.regione}`, callback_data: `scheda_${v.nome}` }]);
    buttons.push([{ text: "🔍 Cambia filtro", callback_data: "menu_cerca" }, { text: "« Menu", callback_data: "torna_menu" }]);

    await sendMessageWithButtons(chatId, `${titolo}\n\nTrovo <b>${viniRisultati.length} vini</b>. Tocca per vedere la scheda completa:`, buttons);
}

// ============ GESTIONE COMANDI ============

async function handleCommand(chatId, userId, command, fromObj) {
    getUserData(userId, fromObj);
    aggiornaStreak(userId);

    if (command === '/start') {
        const user = getUserData(userId);
        const nome = user.nome || "amico";
        const welcomeText = `🍷 <b>Benvenuto in Wewino, ${nome}!</b>

Sono il tuo sommelier digitale di <b>WineWorld</b> 🤖
Conosco ${VINI.length} vini italiani e sono pronto ad aiutarti!

<b>Cosa posso fare:</b>
🔍 Cercare vini per nome, tipo o regione
🍽️ Consigliare vini in base al cibo
🎮 Farti giocare con quiz e indovinelli
📅 Dirti il vino del giorno
💰 Tenerti aggiornato su punti e badge

<b>Puoi anche scrivermi direttamente</b>, tipo:
<i>"stasera mangio salmone"</i>
<i>"cercami un vino rosso del Piemonte"</i>
<i>"dimmi qualcosa sul Barolo"</i>

Usa il menu qui sotto per iniziare! 👇`;
        await sendMessageWithButtons(chatId, welcomeText, menuPrincipaleButtons());
    }

    else if (command === '/menu') {
        await sendMessageWithButtons(chatId, '📋 <b>Menu Wewino</b>\n\nCosa vuoi fare?', menuPrincipaleButtons());
    }

    else if (command === '/aiuto') {
        const helpText = `📖 <b>Guida a Wewino</b>
━━━━━━━━━━━━━━━━━━━
<b>🍷 Vini</b>
/vino — Vino casuale
/vinodelgiorno — Il vino speciale di oggi
/cerca — Cerca per nome, tipo o regione
/cibo — Abbinamento vino-cibo

<b>🎮 Giochi</b>
/indovina — Indovina il vino per situazione
/quiz — Domande a risposta multipla
/verofalso — Vero o Falso enologico

<b>🏆 Profilo</b>
/punti — Punti, livello e badge
/profilo — Il tuo profilo completo
/classifica — Top 10 sommelier

<b>🌐 WineWorld</b>
/sito — Link al sito
/social — I nostri social

<b>💡 Consiglio:</b> scrivi direttamente qualcosa come <i>"stasera mangio bistecca"</i> o <i>"dimmi del Barolo"</i>!

<b>Punti per attività:</b>
Quiz corretto +15 · Vero/Falso +10
Indovina +10 · Nuovo vino +5
Vino del giorno +8 · Battuta +2`;
        await sendMessageWithButtons(chatId, helpText, [[{ text: "🚀 Vai al menu", callback_data: "torna_menu" }]]);
    }

    else if (command === '/cerca') {
        await sendMessageWithButtons(chatId, '🔍 <b>Cerca vino</b>\n\nCome vuoi cercare?', filtraButtons());
    }

    else if (command === '/cibo') {
        await sendMessageWithButtons(chatId, '🍽️ <b>Abbinamento Vino-Cibo</b>\n\nScegli un cibo oppure scrivimi cosa mangi:', cibiPopolariButtons());
    }

    else if (command === '/sito') {
        await sendMessageWithButtons(chatId, '🌐 <b>Esplora WineWorld</b>', [
            [{ text: "🏠 Home", url: SITO.home }, { text: "🍷 Tutti i Vini", url: SITO.vini }],
            [{ text: "🌍 Mondo del Vino", url: SITO.mondovino }, { text: "📰 Blog", url: SITO.blog }],
            [{ text: "📜 Denominazioni DOCG", url: SITO.docg }]
        ]);
    }

    else if (command === '/social') {
        await sendMessageWithButtons(chatId, '📱 <b>Seguici sui social!</b>', [
            [{ text: "📸 Instagram", url: SOCIAL.instagram }, { text: "👍 Facebook", url: SOCIAL.facebook }],
            [{ text: "💼 LinkedIn", url: SOCIAL.linkedin }, { text: "📌 Pinterest", url: SOCIAL.pinterest }],
            [{ text: "✖️ X (Twitter)", url: SOCIAL.x }]
        ]);
    }

    else if (command === '/vino') {
        const user = getUserData(userId);
        const vino = VINI[Math.floor(Math.random() * VINI.length)];
        let puntiMsg = '';
        if (!user.viniProvati.includes(vino.nome)) {
            user.viniProvati.push(vino.nome);
            addPunti(userId, 5);
            puntiMsg = '🎉 <i>Nuovo vino scoperto! +5 punti</i>';
        }
        await sendMessageWithButtons(chatId, schedaVino(vino, puntiMsg), [
            [{ text: "🔀 Un altro vino", callback_data: "menu_vino" }, { text: "🍷 Sul sito", url: SITO.vini }],
            [{ text: "« Menu", callback_data: "torna_menu" }]
        ]);
    }

    else if (command === '/vinodelgiorno') {
        const user = getUserData(userId);
        const oggi = oggiStringa();
        const giornoAnno = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const vino = VINI[giornoAnno % VINI.length];
        let bonusMsg = '';
        if (user.ultimoVinoDelGiorno !== oggi) {
            user.ultimoVinoDelGiorno = oggi;
            addPunti(userId, 8);
            bonusMsg = '🎁 <i>Bonus giornaliero riscattato! +8 punti</i>';
            if (!user.viniProvati.includes(vino.nome)) user.viniProvati.push(vino.nome);
        } else {
            bonusMsg = '<i>Hai già riscattato il bonus oggi — torna domani! 📅</i>';
        }
        await sendMessageWithButtons(chatId,
            `📅 <b>Il Vino del Giorno</b>\n\n` + schedaVino(vino, bonusMsg),
            [
                [{ text: "🍷 Scopri sul sito", url: SITO.vini }],
                [{ text: "« Menu", callback_data: "torna_menu" }]
            ]
        );
    }

    else if (command === '/battuta') {
        addPunti(userId, 2);
        const battuta = BATTUTE[Math.floor(Math.random() * BATTUTE.length)];
        await sendMessageWithButtons(chatId,
            `😄 <b>Battuta del sommelier</b>\n\n${battuta}\n\n<i>+2 punti! 🎉</i>`,
            [
                [{ text: "😄 Un'altra", callback_data: "menu_battuta" }, { text: "🎮 Quiz", callback_data: "menu_quiz" }],
                [{ text: "« Menu", callback_data: "torna_menu" }]
            ]
        );
    }

    else if (command === '/indovina') {
        const buttons = SITUAZIONI.map((s, i) => [{ text: s.situazione, callback_data: `indovina_${i}` }]);
        buttons.push([{ text: "« Menu", callback_data: "torna_menu" }]);
        await sendMessageWithButtons(chatId,
            '🎯 <b>Indovina il Vino!</b>\n\nScegli una situazione: ti consiglio il vino perfetto 🍷',
            buttons
        );
    }

    else if (command === '/quiz') {
        const idx = Math.floor(Math.random() * DOMANDE_QUIZ.length);
        const domanda = DOMANDE_QUIZ[idx];
        const buttons = domanda.opzioni.map((o, i) => [{ text: o, callback_data: `quiz_${idx}_${i}` }]);
        buttons.push([{ text: "« Menu", callback_data: "torna_menu" }]);
        await sendMessageWithButtons(chatId,
            `🎮 <b>Quiz Enologico</b>\n━━━━━━━━━━━━━━━━━━━\n\n❓ ${domanda.domanda}`,
            buttons
        );
    }

    else if (command === '/verofalso') {
        const idx = Math.floor(Math.random() * VERO_FALSO_VALIDE.length);
        const item = VERO_FALSO_VALIDE[idx];
        await sendMessageWithButtons(chatId,
            `🤔 <b>Vero o Falso?</b>\n━━━━━━━━━━━━━━━━━━━\n\n"${item.affermazione}"`,
            [
                [{ text: "✅ Vero", callback_data: `vf_${idx}_1` }, { text: "❌ Falso", callback_data: `vf_${idx}_0` }],
                [{ text: "« Menu", callback_data: "torna_menu" }]
            ]
        );
    }

    else if (command === '/punti') {
        const user = getUserData(userId);
        const puntiInLivello = user.punti - (user.livello - 1) * 100;
        const puntiMancanti = user.livello * 100 - user.punti;
        const barra = barraProgresso(user.punti, user.livello);
        const response = `💰 <b>Il tuo profilo sommelier</b>
━━━━━━━━━━━━━━━━━━━
⭐ <b>Livello ${user.livello}</b>
${barra} ${puntiInLivello}/100
<i>ancora ${puntiMancanti} punti al livello ${user.livello + 1}</i>

🎯 <b>Punti totali:</b> ${user.punti}
🔥 <b>Streak:</b> ${user.streak} ${user.streak === 1 ? 'giorno' : 'giorni'} consecutivi
🍷 <b>Vini scoperti:</b> ${user.viniProvati.length}/${VINI.length}
━━━━━━━━━━━━━━━━━━━
🏅 <b>Badge:</b>
${formattaBadge(user.badge)}`;
        await sendMessageWithButtons(chatId, response, [
            [{ text: "🏆 Classifica", callback_data: "menu_classifica" }, { text: "🍷 Scopri vini", callback_data: "menu_vino" }],
            [{ text: "« Menu", callback_data: "torna_menu" }]
        ]);
    }

    else if (command === '/profilo') {
        const user = getUserData(userId);
        const viniList = user.viniProvati.length > 0
            ? user.viniProvati.map(n => { const v = VINI.find(x => x.nome === n); return v ? `${v.emoji} ${n}` : n; }).join(", ")
            : "Nessuno ancora";
        const response = `🧑‍🍳 <b>Profilo di ${user.nome || 'Sommelier'}</b>
━━━━━━━━━━━━━━━━━━━
⭐ Livello: <b>${user.livello}</b>
🎯 Punti: <b>${user.punti}</b>
🔥 Streak: <b>${user.streak} giorni</b>
🍷 Vini scoperti: <b>${user.viniProvati.length}/${VINI.length}</b>
━━━━━━━━━━━━━━━━━━━
🍷 <b>Vini provati:</b>
${viniList}
━━━━━━━━━━━━━━━━━━━
🏅 <b>Badge:</b>
${formattaBadge(user.badge)}`;
        await sendMessageWithButtons(chatId, response, [[{ text: "« Menu", callback_data: "torna_menu" }]]);
    }

    else if (command === '/classifica') {
        const utenti = Object.entries(userData)
            .map(([id, u]) => ({ id, ...u }))
            .sort((a, b) => b.punti - a.punti)
            .slice(0, 10);

        if (utenti.length === 0) {
            await sendMessage(chatId, '🏆 Nessun punteggio ancora. Inizia con /vino o /quiz!');
            return;
        }

        const medaglie = ['🥇', '🥈', '🥉'];
        const righe = utenti.map((u, i) => {
            const pos = medaglie[i] || `${i + 1}.`;
            const nome = u.nome || `Sommelier #${u.id.toString().slice(-4)}`;
            return `${pos} <b>${nome}</b> — ${u.punti} pt · Lv.${u.livello}`;
        });

        await sendMessageWithButtons(chatId,
            `🏆 <b>Classifica Sommelier</b>\n━━━━━━━━━━━━━━━━━━━\n${righe.join('\n')}\n━━━━━━━━━━━━━━━━━━━\n<i>La classifica si resetta ad ogni riavvio del bot.</i>`,
            [
                [{ text: "💰 I miei punti", callback_data: "menu_punti" }],
                [{ text: "« Menu", callback_data: "torna_menu" }]
            ]
        );
    }

    else {
        await sendMessageWithButtons(chatId,
            '🤔 Comando non riconosciuto.\n\nProva a scrivere direttamente il nome di un vino o cosa mangi stasera!',
            menuPrincipaleButtons()
        );
    }
}

// ============ GESTIONE CALLBACK ============

async function handleCallback(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data;

    getUserData(userId, callbackQuery.from);
    aggiornaStreak(userId);
    await answerCallback(callbackQuery.id);

    // Torna al menu principale
    if (data === 'torna_menu') {
        await editMessage(chatId, messageId, '📋 <b>Menu Wewino</b>\n\nCosa vuoi fare?', menuPrincipaleButtons());
        return;
    }

    // Menu bottoni → reindirizza ai comandi
    if (data.startsWith('menu_')) {
        const mappa = {
            menu_vino: '/vino', menu_vinodelgiorno: '/vinodelgiorno',
            menu_indovina: '/indovina', menu_quiz: '/quiz',
            menu_verofalso: '/verofalso', menu_battuta: '/battuta',
            menu_punti: '/punti', menu_classifica: '/classifica',
            menu_cerca: '/cerca', menu_cibo: '/cibo'
        };
        const cmd = mappa[data];
        if (cmd) await handleCommand(chatId, userId, cmd, callbackQuery.from);
        return;
    }

    // Scheda vino diretta
    if (data.startsWith('scheda_')) {
        const nomeVino = data.replace('scheda_', '');
        const vino = VINI.find(v => v.nome === nomeVino);
        if (vino) {
            const user = getUserData(userId);
            let puntiMsg = '';
            if (!user.viniProvati.includes(vino.nome)) {
                user.viniProvati.push(vino.nome);
                addPunti(userId, 5);
                puntiMsg = '🎉 <i>Nuovo vino scoperto! +5 punti</i>';
            }
            await editMessage(chatId, messageId, schedaVino(vino, puntiMsg), [
                [{ text: "🍷 Scopri sul sito", url: SITO.vini }],
                [{ text: "« Indietro", callback_data: "menu_cerca" }, { text: "« Menu", callback_data: "torna_menu" }]
            ]);
        }
        return;
    }

    // Filtro per tipo
    if (data.startsWith('filtra_')) {
        const filtro = data.replace('filtra_', '');
        if (filtro === 'regione_menu') {
            await editMessage(chatId, messageId,
                '📍 <b>Scegli la regione</b>', regioniButtons());
        } else {
            await mostraViniFiltrati(chatId, filtro);
        }
        return;
    }

    // Filtro per regione
    if (data.startsWith('regione_')) {
        const regione = data.replace('regione_', '');
        await mostraViniFiltrati(chatId, `📍 ${regione}`);
        return;
    }

    // Abbinamento cibo da bottone
    if (data.startsWith('cibo_')) {
        const cibo = data.replace('cibo_', '');
        if (cibo === 'scrivi') {
            await editMessage(chatId, messageId,
                '✏️ <b>Scrivi cosa mangi!</b>\n\nMandami un messaggio tipo:\n<i>"stasera mangio salmone"</i>\n<i>"ho cucinato pasta al ragù"</i>',
                [[{ text: "« Indietro", callback_data: "menu_cibo" }]]
            );
            return;
        }
        const viniSuggeriti = trovaViniPerCibo(cibo);
        if (viniSuggeriti && viniSuggeriti.length > 0) {
            const buttons = viniSuggeriti.map(v => [{ text: `${v.emoji} ${v.nome}`, callback_data: `scheda_${v.nome}` }]);
            buttons.push([{ text: "🍽️ Cambia cibo", callback_data: "menu_cibo" }, { text: "« Menu", callback_data: "torna_menu" }]);
            await editMessage(chatId, messageId,
                `🍽️ <b>Vini consigliati per: ${cibo}</b>\n\nTocca un vino per la scheda completa:`,
                buttons
            );
        } else {
            await editMessage(chatId, messageId,
                `😅 Non ho trovato abbinamenti specifici per "<b>${cibo}</b>".\n\nProva a scegliere un altro cibo:`,
                cibiPopolariButtons()
            );
        }
        return;
    }

    // Indovina il vino
    if (data.startsWith('indovina_')) {
        const index = parseInt(data.split('_')[1], 10);
        const situazione = SITUAZIONI[index];
        if (situazione) {
            const vino = VINI.find(v => v.nome === situazione.consiglio);
            addPunti(userId, 10);
            const dettaglio = vino ? `\n\n${schedaVino(vino)}` : '';
            await editMessage(chatId, messageId,
                `🎯 <b>Perfetto abbinamento!</b>\n━━━━━━━━━━━━━━━━━━━\n<b>Situazione:</b> ${situazione.situazione}\n<b>Vino consigliato:</b> ${situazione.consiglio}\n<b>Perché:</b> ${situazione.motivo}\n\n<i>+10 punti! 🎉</i>${dettaglio}`,
                [
                    [{ text: "🎯 Rigioca", callback_data: "menu_indovina" }, { text: "🎮 Quiz", callback_data: "menu_quiz" }],
                    [{ text: "« Menu", callback_data: "torna_menu" }]
                ]
            );
        }
        return;
    }

    // Quiz
    if (data.startsWith('quiz_')) {
        const parts = data.split('_');
        const idx = parseInt(parts[1], 10);
        const risposta = parseInt(parts[2], 10);
        const domanda = DOMANDE_QUIZ[idx];
        if (domanda) {
            let testo, corretto;
            if (risposta === domanda.risposta) {
                addPunti(userId, 15);
                corretto = true;
                testo = `✅ <b>Corretto!</b>\n━━━━━━━━━━━━━━━━━━━\n❓ ${domanda.domanda}\n\n🎯 Risposta: <b>${domanda.opzioni[domanda.risposta]}</b>\n\n<i>+15 punti! 🎉</i>`;
            } else {
                corretto = false;
                testo = `❌ <b>Sbagliato!</b>\n━━━━━━━━━━━━━━━━━━━\n❓ ${domanda.domanda}\n\n✅ Risposta giusta: <b>${domanda.opzioni[domanda.risposta]}</b>\n\nNon arrenderti, riprova!`;
            }
            await editMessage(chatId, messageId, testo, [
                [{ text: "🎮 Prossima domanda", callback_data: "menu_quiz" }, { text: "🎯 Indovina", callback_data: "menu_indovina" }],
                [{ text: "« Menu", callback_data: "torna_menu" }]
            ]);
        }
        return;
    }

    // Vero o Falso
    if (data.startsWith('vf_')) {
        const parts = data.split('_');
        const idx = parseInt(parts[1], 10);
        const scelta = parseInt(parts[2], 10);
        const item = VERO_FALSO_VALIDE[idx];
        if (item) {
            const corretto = (scelta === 1) === item.vero;
            let testo;
            if (corretto) {
                addPunti(userId, 10);
                testo = `✅ <b>Esatto!</b>\n━━━━━━━━━━━━━━━━━━━\n"${item.affermazione}"\n\n${item.spiegazione}\n\n<i>+10 punti! 🎉</i>`;
            } else {
                testo = `❌ <b>Non proprio!</b>\n━━━━━━━━━━━━━━━━━━━\n"${item.affermazione}"\n\n${item.spiegazione}`;
            }
            await editMessage(chatId, messageId, testo, [
                [{ text: "✅❌ Prossima", callback_data: "menu_verofalso" }, { text: "🎮 Quiz", callback_data: "menu_quiz" }],
                [{ text: "« Menu", callback_data: "torna_menu" }]
            ]);
        }
        return;
    }
}

// ============ WEBHOOK HANDLER ============

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(200).json({ ok: true });
    }

    try {
        const { message, callback_query } = req.body;

        if (message) {
            const chatId = message.chat.id;
            const userId = message.from.id;
            const text = message.text || '';
            const command = text.split(' ')[0].split('@')[0].toLowerCase();

            if (command.startsWith('/')) {
                await handleCommand(chatId, userId, command, message.from);
            } else if (text.trim().length > 0) {
                await handleFreeText(chatId, userId, text, message.from);
            }
        }

        if (callback_query) {
            await handleCallback(callback_query);
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Errore webhook:', error);
        res.status(200).json({ ok: true });
    }
};