const axios = require('axios');

// Token del bot
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN non configurato');
}

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// Database temporaneo in memoria
// ATTENZIONE: su Vercel si resetta ad ogni nuova istanza (cold start).
// Per dati persistenti usa Vercel KV, Upstash Redis o un database vero.
const userData = {};

// ============ LINK AL SITO WINEWORLD ============

const SITO = {
    home: 'https://www.wineworldweb.it',
    vini: 'https://www.wineworldweb.it/wine',
    mondovino: 'https://www.wineworldweb.it/wineworld',
    docg: 'https://www.wineworldweb.it/docg'
};

const SOCIAL = {
    instagram: 'https://www.instagram.com/wineworldweb.it/',
    facebook: 'https://www.facebook.com/profile.php?id=61583979324726',
    
};

// ============ DATI WEWINO ============

const VINI = [
    {
        nome: "Barolo",
        tipo: "Rosso",
        regione: "Piemonte",
        descrizione: "Un vino nobile e complesso, perfetto per cene importanti",
        abbinamento: "Carni rosse, formaggi stagionati",
        curiosita: "Viene chiamato il 'Re dei vini, vino dei Re' per il legame storico con i Savoia",
        battuta: "Il Barolo è come me: elegante, sofisticato e un po' altezzoso! 🍷"
    },
    {
        nome: "Prosecco",
        tipo: "Bianco Frizzante",
        regione: "Veneto",
        descrizione: "Fresco, vivace e sempre pronto a festeggiare",
        abbinamento: "Aperitivi, frutti di mare, dolci",
        curiosita: "Le colline di Conegliano e Valdobbiadene, sua patria, sono Patrimonio UNESCO",
        battuta: "Il Prosecco è il mio migliore amico - sempre allegro e festaiolo! 🎉"
    },
    {
        nome: "Chianti",
        tipo: "Rosso",
        regione: "Toscana",
        descrizione: "Versatile e amichevole, il compagno perfetto di ogni pasto",
        abbinamento: "Pasta, pizza, carni",
        curiosita: "Il simbolo del Chianti Classico è il Gallo Nero, presente già nel XIII secolo",
        battuta: "Il Chianti? È come me: accessibile a tutti ma con una profondità sorprendente! 😉"
    },
    {
        nome: "Amarone",
        tipo: "Rosso",
        regione: "Veneto",
        descrizione: "Intenso e passionale, per chi ama le emozioni forti",
        abbinamento: "Carni in umido, formaggi blu, cioccolato",
        curiosita: "Nasce dall'appassimento delle uve per mesi su graticci, che ne concentra zuccheri e aromi",
        battuta: "L'Amarone è il vino più drammatico che conosco - sempre con storie da raccontare! 🎭"
    },
    {
        nome: "Moscato d'Asti",
        tipo: "Bianco Dolce",
        regione: "Piemonte",
        descrizione: "Dolce, fresco e leggermente frizzante - la felicità in un bicchiere",
        abbinamento: "Dolci, frutta, formaggi freschi",
        curiosita: "Ha una gradazione alcolica molto bassa, spesso intorno al 5%",
        battuta: "Il Moscato d'Asti è come una giornata di sole - ti fa sempre sorridere! ☀️"
    },
    {
        nome: "Nero d'Avola",
        tipo: "Rosso",
        regione: "Sicilia",
        descrizione: "Caldo, avvolgente e pieno di sole siciliano",
        abbinamento: "Arrosticini, pasta alla norma, pesce",
        curiosita: "Prende il nome da Avola, cittadina in provincia di Siracusa",
        battuta: "Il Nero d'Avola è il vino più caloroso che conosca - ti abbraccia come un amico! 🤗"
    },
    {
        nome: "Vermentino",
        tipo: "Bianco",
        regione: "Sardegna",
        descrizione: "Fresco come una brezza marina, perfetto per l'estate",
        abbinamento: "Pesce, frutti di mare, insalate",
        curiosita: "Il Vermentino di Gallura è l'unica DOCG bianca della Sardegna",
        battuta: "Il Vermentino è il mio compagno di vacanza preferito - sempre rinfrescante! 🏖️"
    },
    {
        nome: "Brunello di Montalcino",
        tipo: "Rosso",
        regione: "Toscana",
        descrizione: "Potente e longevo, uno dei grandi rossi italiani da invecchiamento",
        abbinamento: "Selvaggina, brasati, formaggi stagionati",
        curiosita: "Deve invecchiare per legge almeno 5 anni prima di essere venduto",
        battuta: "Il Brunello non ha fretta: come i grandi capolavori, ha bisogno di tempo! ⏳"
    },
    {
        nome: "Franciacorta",
        tipo: "Spumante",
        regione: "Lombardia",
        descrizione: "Le bollicine italiane per eccellenza, eleganti e raffinate",
        abbinamento: "Aperitivi, pesce, risotti, tutto il pasto",
        curiosita: "È prodotto con lo stesso metodo classico dello Champagne, la rifermentazione in bottiglia",
        battuta: "Il Franciacorta fa le bollicine ma prende sul serio se stesso, proprio come un vero gentiluomo! 🥂"
    },
    {
        nome: "Primitivo di Manduria",
        tipo: "Rosso",
        regione: "Puglia",
        descrizione: "Corposo, caldo e ricco di frutto maturo",
        abbinamento: "Carni alla griglia, formaggi piccanti, salumi",
        curiosita: "È geneticamente lo stesso vitigno dello Zinfandel californiano",
        battuta: "Il Primitivo è il vino che non fa mai le cose a metà! 💪"
    },
    {
        nome: "Aglianico del Vulture",
        tipo: "Rosso",
        regione: "Basilicata",
        descrizione: "Strutturato e minerale, cresciuto sui suoli vulcanici del Vulture",
        abbinamento: "Carni rosse, salumi, formaggi stagionati",
        curiosita: "Viene chiamato il 'Barolo del Sud' per la sua grande capacità di invecchiamento",
        battuta: "L'Aglianico è tosto fuori ma sorprendente dentro, un po' come i migliori amici! 🌋"
    },
    {
        nome: "Verdicchio dei Castelli di Jesi",
        tipo: "Bianco",
        regione: "Marche",
        descrizione: "Sapido e minerale, con una piacevole nota di mandorla",
        abbinamento: "Pesce, brodetto, frutti di mare",
        curiosita: "Cresce in vigneti che si affacciano sull'Adriatico, da cui prende sapidità",
        battuta: "Il Verdicchio è discreto ma quando lo assaggi non lo dimentichi più! 🐟"
    },
    {
        nome: "Lagrein",
        tipo: "Rosso",
        regione: "Alto Adige",
        descrizione: "Profondo, fruttato e con un caratteristico tannino vellutato",
        abbinamento: "Speck, canederli, carni di montagna",
        curiosita: "È un vitigno autoctono coltivato quasi esclusivamente in Alto Adige",
        battuta: "Il Lagrein arriva dalla montagna ma ha l'animo di un vino da grande occasione! ⛰️"
    },
    {
        nome: "Cannonau di Sardegna",
        tipo: "Rosso",
        regione: "Sardegna",
        descrizione: "Robusto e generoso, vino simbolo della longevità sarda",
        abbinamento: "Carne di pecora, salumi, formaggi sardi",
        curiosita: "Alcuni studi lo collegano alla straordinaria longevità degli abitanti della Barbagia",
        battuta: "Si dice che il Cannonau aiuti a vivere più a lungo... ma con moderazione, mi raccomando! 🧓"
    },
    {
        nome: "Greco di Tufo",
        tipo: "Bianco",
        regione: "Campania",
        descrizione: "Elegante e strutturato, uno dei grandi bianchi del Sud Italia",
        abbinamento: "Pesce, crostacei, formaggi freschi",
        curiosita: "Cresce su terreni di origine vulcanica vicino al Vesuvio",
        battuta: "Il Greco di Tufo non è semplice, è un bianco con la testa di un grande rosso! 🏛️"
    },
    {
        nome: "Cerasuolo d'Abruzzo",
        tipo: "Rosato",
        regione: "Abruzzo",
        descrizione: "Vivace e dal colore intenso, molto più di un semplice rosato",
        abbinamento: "Antipasti, pesce saporito, primi piatti estivi",
        curiosita: "Il nome deriva dal colore che ricorda la ciliegia (cerasa, in dialetto abruzzese)",
        battuta: "Il Cerasuolo non è un rosato qualunque, ha la grinta di un vino rosso! 🍒"
    },
    {
        nome: "Soave",
        tipo: "Bianco",
        regione: "Veneto",
        descrizione: "Delicato e floreale, con un finale leggermente ammandorlato",
        abbinamento: "Antipasti, risotti, pesce di lago",
        curiosita: "Prende il nome dall'omonima cittadina fortificata vicino Verona",
        battuta: "Il Soave è discreto come il nome suggerisce, ma sa farsi notare nel bicchiere! 🏰"
    },
    {
        nome: "Lambrusco",
        tipo: "Rosso Frizzante",
        regione: "Emilia-Romagna",
        descrizione: "Allegro e dissetante, perfetto compagno della cucina emiliana",
        abbinamento: "Salumi, tortellini, parmigiano",
        curiosita: "Esistono decine di varietà di Lambrusco, dal secco al dolce",
        battuta: "Il Lambrusco non si prende mai troppo sul serio, è il vino della convivialità! 🎈"
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
    { situazione: "Primo appuntamento", consiglio: "Prosecco - fresco, elegante e non troppo impegnativo" },
    { situazione: "Cena romantica", consiglio: "Barolo - nobile, sofisticato e indimenticabile" },
    { situazione: "Festa con amici", consiglio: "Chianti - allegro, versatile e sempre benvenuto" },
    { situazione: "Dopo una brutta giornata", consiglio: "Amarone - intenso e consolante" },
    { situazione: "Dolce serata", consiglio: "Moscato d'Asti - dolce come i tuoi pensieri" },
    { situazione: "Pranzo estivo", consiglio: "Vermentino - fresco come una brezza marina" },
    { situazione: "Cena di famiglia", consiglio: "Nero d'Avola - caloroso e accogliente" },
    { situazione: "Celebrazione importante", consiglio: "Franciacorta - bollicine eleganti per i grandi traguardi" },
    { situazione: "Grigliata tra amici", consiglio: "Primitivo di Manduria - corposo e generoso come la compagnia" },
    { situazione: "Aperitivo in spiaggia", consiglio: "Cerasuolo d'Abruzzo - fresco, vivace, perfetto col sole" },
    { situazione: "Cena di pesce importante", consiglio: "Greco di Tufo - elegante e strutturato" },
    { situazione: "Serata di tortellini e salumi", consiglio: "Lambrusco - allegro e dissetante" }
];

const DOMANDE_QUIZ = [
    { domanda: "Quale regione è famosa per il Barolo?", opzioni: ["Piemonte", "Toscana", "Veneto"], risposta: 0 },
    { domanda: "Il Prosecco è un vino rosso o bianco?", opzioni: ["Rosso", "Bianco", "Rosato"], risposta: 1 },
    { domanda: "Quale vino viene dalla Sicilia?", opzioni: ["Chianti", "Nero d'Avola", "Amarone"], risposta: 1 },
    { domanda: "Quanti anni minimo deve invecchiare il Brunello di Montalcino prima della vendita?", opzioni: ["2 anni", "5 anni", "10 anni"], risposta: 1 },
    { domanda: "Il Franciacorta è prodotto con lo stesso metodo di quale vino francese?", opzioni: ["Bordeaux", "Champagne", "Beaujolais"], risposta: 1 },
    { domanda: "Il Primitivo è geneticamente lo stesso vitigno di quale vino americano?", opzioni: ["Zinfandel", "Merlot", "Syrah"], risposta: 0 },
    { domanda: "Da dove deriva il nome del Cerasuolo d'Abruzzo?", opzioni: ["Da una città", "Dal colore della ciliegia", "Da un vitigno francese"], risposta: 1 },
    { domanda: "Quale vino è chiamato il 'Barolo del Sud'?", opzioni: ["Aglianico del Vulture", "Cannonau", "Verdicchio"], risposta: 0 },
    { domanda: "Il Lagrein è un vitigno autoctono di quale regione?", opzioni: ["Alto Adige", "Calabria", "Marche"], risposta: 0 },
    { domanda: "Il Vermentino di Gallura è l'unica DOCG bianca di quale regione?", opzioni: ["Sardegna", "Liguria", "Sicilia"], risposta: 0 },
    { domanda: "Le colline patrimonio UNESCO legate al Prosecco si trovano tra Conegliano e...?", opzioni: ["Valdobbiadene", "Montalcino", "Asti"], risposta: 0 },
    { domanda: "Quale vino è prodotto con uve appassite su graticci per mesi?", opzioni: ["Soave", "Amarone", "Lambrusco"], risposta: 1 }
];

const VERO_FALSO = [
    { affermazione: "Lo Champagne e il Franciacorta usano lo stesso metodo di produzione (rifermentazione in bottiglia).", vero: true, spiegazione: "Esatto! Entrambi usano il Metodo Classico." },
    { affermazione: "Più un vino rosso è vecchio, più è automaticamente buono.", vero: false, spiegazione: "Falso: non tutti i vini sono fatti per invecchiare, dipende dalla struttura e dal vitigno." },
    { affermazione: "Il Prosecco può essere prodotto solo in Veneto e Friuli Venezia Giulia.", vero: true, spiegazione: "Vero, la denominazione copre queste due regioni." },
    { affermazione: "Il colore del vino rosato si ottiene mescolando vino bianco e vino rosso.", vero: false, spiegazione: "Falso: nella maggior parte dei casi nasce da una breve macerazione delle bucce di uve rosse." },
    { affermazione: "Il Primitivo di Manduria è coltivato in Puglia.", vero: true, spiegazione: "Esatto, è uno dei vitigni simbolo del Salento." },
    { affermazione: "Tutti i vini bianchi vanno serviti molto freddi, sotto i 6°C.", vero: false, spiegazione: "Falso: i bianchi strutturati si servono spesso tra 10-12°C per esprimere meglio gli aromi." },
    { affermazione: "Il Cannonau è spesso associato alla longevità delle popolazioni della Sardegna.", vero: true, spiegazione: "Vero, alcuni studi lo collegano alle 'zone blu' di longevità." },
    { affermazione: "Il tappo a vite è sempre sinonimo di vino di bassa qualità.", vero: false, spiegazione: "Falso: oggi viene usato anche su vini di alta qualità per preservarne la freschezza." }
];

const VERO_FALSO_VALIDE = VERO_FALSO.filter(v => v.affermazione);

// ============ FUNZIONI HELPER ============

function oggiStringa() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
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

    if (user.ultimaAttivita === oggi) {
        return; // già attivo oggi, non cambiare lo streak
    }

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

    if (user.punti >= 50 && !user.badge.includes("sommelier_novizio")) {
        user.badge.push("sommelier_novizio");
    }
    if (user.punti >= 200 && !user.badge.includes("sommelier_esperto")) {
        user.badge.push("sommelier_esperto");
    }
    if (user.punti >= 500 && !user.badge.includes("sommelier_maestro")) {
        user.badge.push("sommelier_maestro");
    }
    if (user.viniProvati.length >= VINI.length && !user.badge.includes("esploratore_completo")) {
        user.badge.push("esploratore_completo");
    }
}

const NOMI_BADGE = {
    sommelier_novizio: "🥉 Sommelier Novizio",
    sommelier_esperto: "🥈 Sommelier Esperto",
    sommelier_maestro: "🥇 Sommelier Maestro",
    fedelissimo: "🔥 Fedelissimo (7 giorni di fila)",
    esploratore_completo: "🗺️ Esploratore Completo (tutti i vini provati)"
};

function formattaBadge(badgeArray) {
    if (!badgeArray || badgeArray.length === 0) return "Nessun badge ancora";
    return badgeArray.map(b => NOMI_BADGE[b] || b).join("\n");
}

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

async function sendMessageWithButtons(chatId, text, buttons) {
    try {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: buttons
            }
        });
    } catch (error) {
        console.error('Errore invio messaggio con bottoni:', error?.response?.data || error.message);
    }
}

async function editMessage(chatId, messageId, text) {
    try {
        await axios.post(`${TELEGRAM_API}/editMessageText`, {
            chat_id: chatId,
            message_id: messageId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });
    } catch (error) {
        console.error('Errore modifica messaggio:', error?.response?.data || error.message);
    }
}

async function answerCallback(callbackQueryId, text) {
    try {
        await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
            callback_query_id: callbackQueryId,
            text: text,
            show_alert: false
        });
    } catch (error) {
        console.error('Errore risposta callback:', error?.response?.data || error.message);
    }
}

// ============ MENU PRINCIPALE ============

function menuPrincipaleButtons() {
    return [
        [{ text: "🍇 Vino casuale", callback_data: "menu_vino" }, { text: "📅 Vino del giorno", callback_data: "menu_vinodelgiorno" }],
        [{ text: "🎯 Indovina", callback_data: "menu_indovina" }, { text: "🎮 Quiz", callback_data: "menu_quiz" }],
        [{ text: "✅❌ Vero o Falso", callback_data: "menu_verofalso" }, { text: "😄 Battuta", callback_data: "menu_battuta" }],
        [{ text: "💰 Punti", callback_data: "menu_punti" }, { text: "🏆 Classifica", callback_data: "menu_classifica" }],
        [{ text: "🌐 Visita il sito", url: SITO.home }]
    ];
}

// ============ GESTIONE COMANDI ============

async function handleCommand(chatId, userId, command, fromObj) {
    getUserData(userId, fromObj);
    aggiornaStreak(userId);

    if (command === '/start') {
        const welcomeText = `
🍷 <b>Benvenuto in Wewino - Il Sommelier Divertente!</b> 🤖

Ciao! Sono Wewino, il sommelier digitale di <b>WineWorld</b>.
Sono qui per aiutarti a scoprire il meraviglioso mondo dei vini con consigli, giochi e tanta simpatia.

<b>Ecco cosa posso fare per te:</b>

🍇 /vino - Consiglio su un vino casuale
📅 /vinodelgiorno - Il vino speciale di oggi
🎯 /indovina - Gioca a "Indovina il Vino"
🎮 /quiz - Quiz a risposta multipla
✅❌ /verofalso - Vero o Falso sul vino
😄 /battuta - Una battuta sul vino
💰 /punti - I tuoi punti, livello e badge
🏆 /classifica - I migliori sommelier del bot
🌐 /sito - I link al sito WineWorld
📱 /social - Seguici sui social
❓ /aiuto - Tutti i comandi

Oppure usa /menu per i bottoni rapidi! 🚀
        `;
        await sendMessageWithButtons(chatId, welcomeText, menuPrincipaleButtons());
    }

    else if (command === '/menu') {
        await sendMessageWithButtons(chatId, '📋 <b>Menu Wewino</b>\n\nScegli cosa fare:', menuPrincipaleButtons());
    }

    else if (command === '/aiuto') {
        const helpText = `
📖 <b>Comandi Disponibili:</b>

🍇 /vino - Consiglio su un vino casuale
📅 /vinodelgiorno - Il vino speciale di oggi (bonus punti una volta al giorno)
🎯 /indovina - Gioca a "Indovina il Vino" in base alla situazione
🎮 /quiz - Rispondi a domande a risposta multipla
✅❌ /verofalso - Metti alla prova le tue conoscenze
😄 /battuta - Ascolta una battuta divertente sul vino
💰 /punti - Vedi i tuoi punti, livello, streak e badge
🏆 /classifica - I migliori sommelier del bot
🌐 /sito - Esplora WineWorld.it
📱 /social - Seguici sui social
🍽️ /menu - Mostra il menu a bottoni

<b>Come funziona il sistema di punti:</b>
- Quiz corretto: +15 punti
- Vero o Falso corretto: +10 punti
- Indovina la situazione: +10 punti
- Nuovo vino provato: +5 punti
- Vino del giorno: +8 punti (una volta al giorno)
- Battuta: +2 punti
- Streak di 7 giorni consecutivi: badge Fedelissimo 🔥

Buon divertimento! 🍷
        `;
        await sendMessage(chatId, helpText);
    }

    else if (command === '/sito') {
        const buttons = [
            [{ text: "🏠 Home", url: SITO.home }],
            [{ text: "🍷 Tutti i Vini", url: SITO.vini }],
            [{ text: "🌍 Il Mondo del Vino", url: SITO.mondovino }],
            [{ text: "📰 Blog", url: SITO.blog }],
            [{ text: "📜 Denominazioni (DOCG)", url: SITO.docg }]
        ];
        await sendMessageWithButtons(chatId, '🌐 <b>Esplora WineWorld</b>\n\nApprofondisci tutto sul mondo del vino sul nostro sito:', buttons);
    }

    else if (command === '/social') {
        const buttons = [
            [{ text: "📸 Instagram", url: SOCIAL.instagram }, { text: "👍 Facebook", url: SOCIAL.facebook }],
            
        ];
        await sendMessageWithButtons(chatId, '📱 <b>Seguici sui social!</b>\n\nResta aggiornato su WineWorld:', buttons);
    }

    else if (command === '/vino') {
        const user = getUserData(userId);
        const vinoRandom = VINI[Math.floor(Math.random() * VINI.length)];

        let puntiMsg = '';
        if (!user.viniProvati.includes(vinoRandom.nome)) {
            user.viniProvati.push(vinoRandom.nome);
            addPunti(userId, 5);
            puntiMsg = ' (+5 punti! 🎉)';
        }

        const response = `
🍷 <b>${vinoRandom.nome}</b>

<b>Tipo:</b> ${vinoRandom.tipo}
<b>Regione:</b> ${vinoRandom.regione}

<b>Descrizione:</b> ${vinoRandom.descrizione}

<b>Abbinamenti:</b> ${vinoRandom.abbinamento}

💡 <b>Curiosità:</b> ${vinoRandom.curiosita}

💭 <i>${vinoRandom.battuta}</i>
${puntiMsg}
        `;
        await sendMessageWithButtons(chatId, response, [[{ text: "🍷 Scopri di più sul sito", url: SITO.vini }]]);
    }

    else if (command === '/vinodelgiorno') {
        const user = getUserData(userId);
        const oggi = oggiStringa();

        // Vino deterministico: cambia ogni giorno ma è uguale per tutti gli utenti
        const giornoAnno = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const vinoOggi = VINI[giornoAnno % VINI.length];

        let puntiMsg = '';
        if (user.ultimoVinoDelGiorno !== oggi) {
            user.ultimoVinoDelGiorno = oggi;
            addPunti(userId, 8);
            puntiMsg = '\n\n🎁 Bonus giornaliero riscattato: +8 punti!';
            if (!user.viniProvati.includes(vinoOggi.nome)) {
                user.viniProvati.push(vinoOggi.nome);
            }
        } else {
            puntiMsg = '\n\n(Hai già riscattato il bonus di oggi, torna domani per altri punti!)';
        }

        const response = `
📅 <b>Il Vino del Giorno</b>

🍷 <b>${vinoOggi.nome}</b> - ${vinoOggi.tipo} (${vinoOggi.regione})

${vinoOggi.descrizione}

<b>Abbinamenti:</b> ${vinoOggi.abbinamento}
💡 ${vinoOggi.curiosita}
${puntiMsg}
        `;
        await sendMessage(chatId, response);
    }

    else if (command === '/battuta') {
        addPunti(userId, 2);
        const battutaRandom = BATTUTE[Math.floor(Math.random() * BATTUTE.length)];
        const response = `😄 ${battutaRandom}\n\n(+2 punti!)`;
        await sendMessage(chatId, response);
    }

    else if (command === '/indovina') {
        const buttons = SITUAZIONI.map((s, i) => [
            { text: s.situazione, callback_data: `indovina_${i}` }
        ]);

        await sendMessageWithButtons(chatId, '🎯 <b>Indovina il Vino!</b>\n\nScegli una situazione e io ti consiglierò il vino perfetto:', buttons);
    }

    else if (command === '/quiz') {
        const indiceDomanda = Math.floor(Math.random() * DOMANDE_QUIZ.length);
        const domanda = DOMANDE_QUIZ[indiceDomanda];

        const buttons = domanda.opzioni.map((o, i) => [
            { text: o, callback_data: `quiz_${indiceDomanda}_${i}` }
        ]);

        await sendMessageWithButtons(chatId, `🎮 <b>Quiz!</b>\n\n${domanda.domanda}`, buttons);
    }

    else if (command === '/verofalso') {
        const indice = Math.floor(Math.random() * VERO_FALSO_VALIDE.length);
        const affermazione = VERO_FALSO_VALIDE[indice];

        const buttons = [[
            { text: "✅ Vero", callback_data: `vf_${indice}_1` },
            { text: "❌ Falso", callback_data: `vf_${indice}_0` }
        ]];

        await sendMessageWithButtons(chatId, `🤔 <b>Vero o Falso?</b>\n\n"${affermazione.affermazione}"`, buttons);
    }

    else if (command === '/punti') {
        const user = getUserData(userId);
        const puntiProssimoLivello = (user.livello) * 100 - user.punti;

        const response = `
💰 <b>I Tuoi Punti</b>

<b>Punti Totali:</b> ${user.punti} 🎯
<b>Livello:</b> ${user.livello} ⭐ (mancano ${puntiProssimoLivello} punti al prossimo livello)
<b>Streak:</b> ${user.streak} giorni consecutivi 🔥
<b>Vini Provati:</b> ${user.viniProvati.length}/${VINI.length} 🍷

<b>Badge sbloccati:</b>
${formattaBadge(user.badge)}

Continua a giocare per sbloccare nuovi badge! 🚀
        `;
        await sendMessage(chatId, response);
    }

    else if (command === '/profilo') {
        const user = getUserData(userId);
        const viniList = user.viniProvati.length > 0 ? user.viniProvati.join(", ") : "Nessuno ancora";

        const response = `
🏆 <b>Il Tuo Profilo Wewino</b>

<b>Nome:</b> ${user.nome || "Sconosciuto"}
<b>Livello:</b> ${user.livello} ⭐
<b>Punti:</b> ${user.punti} 💰
<b>Streak:</b> ${user.streak} giorni 🔥
<b>Vini Provati:</b> ${user.viniProvati.length}/${VINI.length}
<b>Vini:</b> ${viniList}

<b>Badge Sbloccati:</b>
${formattaBadge(user.badge)}

Continua a scoprire vini e sblocca tutti i badge! 🎉
        `;
        await sendMessage(chatId, response);
    }

    else if (command === '/classifica') {
        const utenti = Object.entries(userData)
            .map(([id, u]) => ({ id, ...u }))
            .sort((a, b) => b.punti - a.punti)
            .slice(0, 10);

        if (utenti.length === 0) {
            await sendMessage(chatId, '🏆 Nessun punteggio ancora registrato. Inizia a giocare con /vino o /quiz!');
            return;
        }

        const medaglie = ['🥇', '🥈', '🥉'];
        const righe = utenti.map((u, i) => {
            const posizione = medaglie[i] || `${i + 1}.`;
            const nome = u.nome || `Sommelier #${u.id.toString().slice(-4)}`;
            return `${posizione} <b>${nome}</b> - ${u.punti} punti (Lv. ${u.livello})`;
        });

        const response = `🏆 <b>Classifica Sommelier</b>\n\n${righe.join('\n')}\n\n<i>Nota: la classifica è temporanea e si resetta in caso di riavvio del bot.</i>`;
        await sendMessage(chatId, response);
    }

    else {
        await sendMessage(chatId, '🤔 Non conosco questo comando. Usa /aiuto o /menu per vedere tutte le opzioni disponibili!');
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

    // Bottoni del menu principale: rieseguono il comando corrispondente
    if (data.startsWith('menu_')) {
        const comandoMappa = {
            menu_vino: '/vino',
            menu_vinodelgiorno: '/vinodelgiorno',
            menu_indovina: '/indovina',
            menu_quiz: '/quiz',
            menu_verofalso: '/verofalso',
            menu_battuta: '/battuta',
            menu_punti: '/punti',
            menu_classifica: '/classifica'
        };
        const comando = comandoMappa[data];
        await answerCallback(callbackQuery.id);
        if (comando) {
            await handleCommand(chatId, userId, comando, callbackQuery.from);
        }
        return;
    }

    if (data.startsWith('indovina_')) {
        const index = parseInt(data.split('_')[1], 10);
        const situazione = SITUAZIONI[index];
        if (situazione) {
            addPunti(userId, 10);
            const response = `
✅ <b>Perfetto!</b>

<b>Situazione:</b> ${situazione.situazione}
<b>Consiglio:</b> ${situazione.consiglio}

(+10 punti! 🎉)
            `;
            await editMessage(chatId, messageId, response);
        }
    }

    else if (data.startsWith('quiz_')) {
        const parts = data.split('_');
        const indiceDomanda = parseInt(parts[1], 10);
        const rispostaScelta = parseInt(parts[2], 10);
        const domanda = DOMANDE_QUIZ[indiceDomanda];

        if (domanda) {
            let response;
            if (rispostaScelta === domanda.risposta) {
                addPunti(userId, 15);
                response = `✅ <b>Corretto!</b>\n\n${domanda.domanda}\nRisposta giusta: <b>${domanda.opzioni[domanda.risposta]}</b>\n\n(+15 punti! 🎉)`;
            } else {
                response = `❌ <b>Sbagliato!</b>\n\nLa risposta giusta era: <b>${domanda.opzioni[domanda.risposta]}</b>\n\nRiprova con /quiz`;
            }
            await editMessage(chatId, messageId, response);
        }
    }

    else if (data.startsWith('vf_')) {
        const parts = data.split('_');
        const indice = parseInt(parts[1], 10);
        const rispostaScelta = parseInt(parts[2], 10); // 1 = vero, 0 = falso
        const affermazione = VERO_FALSO_VALIDE[indice];

        if (affermazione) {
            const corretto = (rispostaScelta === 1) === affermazione.vero;
            let response;
            if (corretto) {
                addPunti(userId, 10);
                response = `✅ <b>Esatto!</b>\n\n${affermazione.spiegazione}\n\n(+10 punti! 🎉)`;
            } else {
                response = `❌ <b>Non proprio.</b>\n\n${affermazione.spiegazione}\n\nRiprova con /verofalso`;
            }
            await editMessage(chatId, messageId, response);
        }
    }

    await answerCallback(callbackQuery.id);
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

            // Gestisce comandi del tipo /vino@NomeDelBot
            const command = text.split(' ')[0].split('@')[0].toLowerCase();

            if (command.startsWith('/')) {
                await handleCommand(chatId, userId, command, message.from);
            } else {
                await sendMessageWithButtons(chatId, '👋 Ciao! Usa /menu o /aiuto per vedere i comandi disponibili!', menuPrincipaleButtons());
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