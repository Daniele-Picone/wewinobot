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

// ============ DATABASE VINI — 77 DOCG ITALIANE ============

const VINI = [
    // ===== PIEMONTE =====
    {
        nome: "Barolo", tipo: "Rosso", regione: "Piemonte", gradazione: "13-15%",
        temperatura: "18°C", bicchiere: "Borgogna",
        descrizione: "Il Re dei vini italiani: potente, complesso, longevo. Nasce dal Nebbiolo nelle Langhe.",
        abbinamento: "Brasato al Barolo, tartufo, selvaggina, formaggi stagionati",
        cibi: ["carne", "manzo", "bistecca", "brasato", "tartufo", "formaggio stagionato", "selvaggina", "cinghiale"],
        curiosita: "Viene chiamato il 'Re dei vini, vino dei Re' per il legame storico con i Savoia. Invecchiamento minimo 3 anni.",
        battuta: "Il Barolo è come me: elegante, sofisticato e un po' altezzoso! 🍷",
        emoji: "👑"
    },
    {
        nome: "Barbaresco", tipo: "Rosso", regione: "Piemonte", gradazione: "12.5-14%",
        temperatura: "17-18°C", bicchiere: "Borgogna",
        descrizione: "Il Barolo più elegante e femminile: nasce sempre dal Nebbiolo ma a Barbaresco, Alba e Treiso.",
        abbinamento: "Arrosti, tartufo bianco, selvaggina, formaggi a pasta dura",
        cibi: ["arrosto", "tartufo", "selvaggina", "cervo", "fagiano", "pecorino"],
        curiosita: "Gaja lo ha reso famoso in tutto il mondo negli anni '70. Invecchiamento minimo 2 anni.",
        battuta: "Il Barbaresco è la sorella elegante del Barolo — stessa famiglia, carattere tutto suo! 🌹",
        emoji: "🌹"
    },
    {
        nome: "Barolo Chinato", tipo: "Aromatizzato", regione: "Piemonte", gradazione: "16%",
        temperatura: "14-16°C", bicchiere: "Calice da liquore",
        descrizione: "Vino aromatizzato al china, erbe e spezie. Un'icona della tradizione piemontese.",
        abbinamento: "Cioccolato fondente, formaggi erborinati, fine pasto",
        cibi: ["cioccolato", "gorgonzola", "dolce", "torrone"],
        curiosita: "Inventato da Carpano nel 1786, è considerato il digestivo piemontese per eccellenza.",
        battuta: "Il Barolo Chinato: quando il vino decide di diventare un'esperienza gastronomica! 🌿",
        emoji: "🌿"
    },
    {
        nome: "Moscato d'Asti", tipo: "Bianco Dolce Frizzante", regione: "Piemonte", gradazione: "5-5.5%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "Dolce, fresco e leggermente frizzante — la felicità in un bicchiere. Bassa gradazione.",
        abbinamento: "Dolci, frutta, panettone, croissant, pasticceria",
        cibi: ["torta", "dolce", "frutta", "panettone", "croissant", "dessert", "gelato", "tiramisù"],
        curiosita: "Ha una gradazione alcolica bassissima (~5%). Le bollicine nascono in autoclave a bassa pressione.",
        battuta: "Il Moscato d'Asti è come una giornata di sole — ti fa sempre sorridere! ☀️",
        emoji: "☀️"
    },
    {
        nome: "Asti Spumante", tipo: "Bianco Spumante Dolce", regione: "Piemonte", gradazione: "7-9%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "Lo spumante dolce italiano più famoso nel mondo, aromi intensi di pesca e fiori.",
        abbinamento: "Dolci, frutta fresca, torte nuziali, fine pasto",
        cibi: ["torta", "frutta", "panna cotta", "dessert", "macaron"],
        curiosita: "È lo spumante dolce più venduto al mondo. Nasce dallo stesso moscato bianco dell'Asti.",
        battuta: "L'Asti Spumante porta le bollicine anche a chi non beve! Perfetto per i brindisi! 🎊",
        emoji: "🎊"
    },
    {
        nome: "Brachetto d'Acqui", tipo: "Rosso Dolce Frizzante", regione: "Piemonte", gradazione: "5.5-6%",
        temperatura: "8-10°C", bicchiere: "Flute",
        descrizione: "Rosso leggero e dolce, con inconfondibile aroma di rosa e fragola.",
        abbinamento: "Fragole, dolci al cioccolato, formaggi freschi, dolci al cucchiaio",
        cibi: ["fragole", "cioccolato", "panna cotta", "tiramisù", "dolci"],
        curiosita: "Perfetto abbinamento con il cioccolato fondente: zucchero contro amaro in equilibrio perfetto.",
        battuta: "Il Brachetto sa di fragola e rosa — è il vino dei romantici! 🌸",
        emoji: "🌸"
    },
    {
        nome: "Gattinara", tipo: "Rosso", regione: "Piemonte", gradazione: "12.5-13.5%",
        temperatura: "17-18°C", bicchiere: "Borgogna",
        descrizione: "Nobile rosso piemontese dal Nebbiolo, con carattere minerale e tannico. Zona del Novarese.",
        abbinamento: "Carni rosse, selvaggina, formaggi stagionati",
        cibi: ["brasato", "cinghiale", "cervo", "formaggio stagionato"],
        curiosita: "È stata la prima DOCG del Piemonte settentrionale. Invecchiamento minimo 3 anni.",
        battuta: "Il Gattinara è il parente nobile del nord — meno famoso del Barolo ma altrettanto fiero! 🏔️",
        emoji: "🏔️"
    },
    {
        nome: "Ghemme", tipo: "Rosso", regione: "Piemonte", gradazione: "12-13%",
        temperatura: "17°C", bicchiere: "Borgogna",
        descrizione: "Vino del Novarese, prodotto con Nebbiolo locale detto Spanna. Elegante e longevo.",
        abbinamento: "Selvaggina, formaggi stagionati, carni rosse",
        cibi: ["selvaggina", "lepre", "coniglio", "formaggio"],
        curiosita: "Prodotto nella zona di Ghemme e Romagnano Sesia, a fianco del Gattinara.",
        battuta: "Il Ghemme: quando il Nebbiolo decide di stare tranquillo nel Novarese! 🍇",
        emoji: "🍇"
    },
    {
        nome: "Dogliani", tipo: "Rosso", regione: "Piemonte", gradazione: "12-13%",
        temperatura: "16°C", bicchiere: "Bordeaux",
        descrizione: "Dolcetto di Dogliani al massimo: fruttato, secco, rotondo. Il più pregiato dei Dolcetto.",
        abbinamento: "Salumi, pasta, carni bianche, formaggi freschi",
        cibi: ["salumi", "pasta", "pollo", "coniglio", "toma"],
        curiosita: "Il Dolcetto di Dogliani è stato elevato a DOCG nel 2005. Il nome 'dolcetto' non indica un vino dolce.",
        battuta: "Il Dogliani si chiama 'dolcetto' ma è secco come un esame di guida! 😄",
        emoji: "🫐"
    },
    {
        nome: "Erbaluce di Caluso", tipo: "Bianco", regione: "Piemonte", gradazione: "11-12%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Bianco del Canavese: fresco, minerale, sapido. Esiste anche nella versione passita.",
        abbinamento: "Pesce, antipasti, risotti, fonduta",
        cibi: ["pesce", "fonduta", "risotto", "antipasto", "fritto"],
        curiosita: "L'Erbaluce è uno dei vitigni autoctoni più antichi del Piemonte, citato già nel '600.",
        battuta: "L'Erbaluce: il bianco piemontese che nessuno conosce ma tutti amano! 🌟",
        emoji: "🌟"
    },
    {
        nome: "Ovada", tipo: "Rosso", regione: "Piemonte", gradazione: "12-13%",
        temperatura: "16°C", bicchiere: "Bordeaux",
        descrizione: "Dolcetto di Ovada: il più tannico e strutturato tra i Dolcetto, con buona longevità.",
        abbinamento: "Carni, salumi, paste ripiene, formaggi semi-stagionati",
        cibi: ["carne", "salumi", "pasta ripiena", "formaggio"],
        curiosita: "Prodotto nell'Ovadese, zona dell'Appennino ligure-piemontese al confine con la Liguria.",
        battuta: "L'Ovada è il Dolcetto con la testa dura — non invecchia, migliora! 💪",
        emoji: "🫐"
    },
    {
        nome: "Ruchè di Castagnole Monferrato", tipo: "Rosso", regione: "Piemonte", gradazione: "13%",
        temperatura: "16°C", bicchiere: "Bordeaux",
        descrizione: "Rarissimo vino aromatico del Monferrato con profumi di rosa, spezie e frutti rossi.",
        abbinamento: "Formaggi erborinati, salumi aromatici, piatti speziati",
        cibi: ["gorgonzola", "salumi", "pasta speziata", "agnello"],
        curiosita: "Prodotto solo in 7 comuni del Monferrato, è uno dei vini più rari d'Italia.",
        battuta: "Il Ruchè è il vino più misterioso del Piemonte — pochissimi lo conoscono, nessuno lo dimentica! 🔮",
        emoji: "🔮"
    },

    // ===== VALLE D'AOSTA =====
    {
        nome: "Blanc de Morgex et de La Salle", tipo: "Bianco", regione: "Valle d'Aosta", gradazione: "11%",
        temperatura: "8-10°C", bicchiere: "Tulipano",
        descrizione: "Il vino più in alta quota d'Europa: vigneti fino a 1200 metri sulle Alpi valdostane.",
        abbinamento: "Fonduta, polenta, pesce di lago, antipasti alpini",
        cibi: ["fonduta", "polenta", "trota", "antipasto", "fontina"],
        curiosita: "Il vitigno Priè Blanc cresce a quote elevatissime — sfugge alla fillossera grazie all'altitudine.",
        battuta: "Il Blanc de Morgex: il vino che si guadagna ogni sorso salendo in quota! 🏔️",
        emoji: "❄️"
    },

    // ===== LOMBARDIA =====
    {
        nome: "Franciacorta", tipo: "Spumante", regione: "Lombardia", gradazione: "12-12.5%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "Le bollicine italiane per eccellenza: metodo classico con lunghi affinamenti in bottiglia.",
        abbinamento: "Aperitivi, pesce, risotti, ostriche, tutto il pasto",
        cibi: ["risotto", "pesce", "antipasto", "aperitivo", "sushi", "ostriche", "capesante"],
        curiosita: "È prodotto con lo stesso metodo classico dello Champagne. La prima DOCG italiana per gli spumanti.",
        battuta: "Il Franciacorta fa le bollicine ma prende sul serio se stesso, proprio come un vero gentiluomo! 🥂",
        emoji: "✨"
    },
    {
        nome: "Sforzato di Valtellina", tipo: "Rosso", regione: "Lombardia", gradazione: "14%",
        temperatura: "17-18°C", bicchiere: "Borgogna",
        descrizione: "Potente vino da uve Nebbiolo appassite in Valtellina. Concentrato e avvolgente.",
        abbinamento: "Selvaggina, brasati, formaggi stagionati di montagna",
        cibi: ["cinghiale", "cervo", "brasato", "bitto", "casera"],
        curiosita: "Lo 'Sfursat' nasce dall'appassimento del Nebbiolo valtellinese, come l'Amarone con il Corvina.",
        battuta: "Lo Sforzato è il Nebbiolo che ha deciso di fare le cose in grande! 🏔️",
        emoji: "🏔️"
    },
    {
        nome: "Valtellina Superiore", tipo: "Rosso", regione: "Lombardia", gradazione: "12-13%",
        temperatura: "16-17°C", bicchiere: "Borgogna",
        descrizione: "Nebbiolo delle Alpi in cinque sottozone: Sassella, Grumello, Inferno, Valgella, Maroggia.",
        abbinamento: "Pizzoccheri, bresaola, carni brasate, formaggi alpini",
        cibi: ["pizzoccheri", "bresaola", "brasato", "bitto", "agnello"],
        curiosita: "I vigneti sono coltivati su terrazzamenti scoscesi a picco sull'Adda — lavoro eroico.",
        battuta: "Il Valtellina Superiore: il Nebbiolo che ha scalato le Alpi! 🧗",
        emoji: "⛰️"
    },
    {
        nome: "Oltrepò Pavese Metodo Classico", tipo: "Spumante", regione: "Lombardia", gradazione: "11.5-12.5%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "Spumante metodo classico dall'Oltrepò Pavese, prodotto prevalentemente con Pinot Nero.",
        abbinamento: "Aperitivi, risotti, pesce, salumi",
        cibi: ["aperitivo", "risotto", "pesce", "salumi", "antipasto"],
        curiosita: "L'Oltrepò Pavese è il maggior produttore italiano di Pinot Nero, spesso destinato alle bollicine.",
        battuta: "L'Oltrepò Pavese: la terra delle bollicine che nessuno sa collocare sulla mappa! 🗺️",
        emoji: "🫧"
    },

    // ===== TRENTINO-ALTO ADIGE =====
    {
        nome: "Trento DOC Metodo Classico", tipo: "Spumante", regione: "Trentino", gradazione: "12%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "Spumante alpino di metodo classico: elegante, sapido, con perlage fine e persistente.",
        abbinamento: "Aperitivi, pesce di lago, prosciutto di Sauris, antipasti",
        cibi: ["pesce", "trota", "aperitivo", "prosciutto", "antipasto"],
        curiosita: "Ferrari Trento è la prima cantina italiana a produrre metodo classico, dal 1902.",
        battuta: "Il Trento DOC: le bollicine che vengono su dai monti, e si sentono! 🏔️",
        emoji: "🫧"
    },

    // ===== VENETO =====
    {
        nome: "Amarone della Valpolicella", tipo: "Rosso", regione: "Veneto", gradazione: "15-17%",
        temperatura: "18-20°C", bicchiere: "Borgogna grande",
        descrizione: "Intenso e passionale, nasce dall'appassimento delle uve per 90-120 giorni su graticci.",
        abbinamento: "Carni in umido, selvaggina, formaggi erborinati, cioccolato fondente",
        cibi: ["stufato", "brasato", "ossobuco", "gorgonzola", "cioccolato", "selvaggina", "cinghiale"],
        curiosita: "La leggenda dice che nacque per errore: un Recioto dimenticato a fermentare fino in fondo.",
        battuta: "L'Amarone è il vino più drammatico che conosco — sempre con storie da raccontare! 🎭",
        emoji: "🌹"
    },
    {
        nome: "Recioto della Valpolicella", tipo: "Rosso Dolce", regione: "Veneto", gradazione: "12-14%",
        temperatura: "14-16°C", bicchiere: "Borgogna",
        descrizione: "Il progenitore dell'Amarone: dolce, vellutato, con sentori di ciliegia sotto spirito e cioccolato.",
        abbinamento: "Cioccolato fondente, dolci alle amarene, formaggi erborinati",
        cibi: ["cioccolato", "amarene", "gorgonzola", "dolci"],
        curiosita: "Il Recioto è il papà dell'Amarone: quando la fermentazione si fermava prima, rimaneva dolce.",
        battuta: "Il Recioto è l'Amarone che si è fermato a metà strada — dolce vita! 🍫",
        emoji: "🍫"
    },
    {
        nome: "Recioto di Soave", tipo: "Bianco Dolce", regione: "Veneto", gradazione: "12-14%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Bianco dolce nobile da uve Garganega appassite. Raro e raffinato.",
        abbinamento: "Dolci delicati, formaggi erborinati, crostate di frutta",
        cibi: ["crostata", "dolce", "formaggi erborinati", "mandorle"],
        curiosita: "È prodotto in quantità limitatissime: meno di 200.000 bottiglie l'anno.",
        battuta: "Il Recioto di Soave: il bianco dolce che non ti aspetti dalla Valpolicella! ✨",
        emoji: "🍯"
    },
    {
        nome: "Soave Superiore", tipo: "Bianco", regione: "Veneto", gradazione: "12-13%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "La versione superiore del classico Soave: più strutturato, minerale, con buon invecchiamento.",
        abbinamento: "Risotto all'Amarone, pesce di lago, baccalà alla vicentina",
        cibi: ["risotto", "pesce", "baccalà", "trota", "carpaccio"],
        curiosita: "Il Soave Superiore nasce solo dalle colline originali, a differenza del DOC pianeggiante.",
        battuta: "Il Soave Superiore: quando il classico decide di fare il salto di qualità! 🏰",
        emoji: "🏰"
    },
    {
        nome: "Bardolino Superiore", tipo: "Rosso", regione: "Veneto", gradazione: "11.5-12.5%",
        temperatura: "14-16°C", bicchiere: "Bordeaux",
        descrizione: "Leggero e beverino dal Lago di Garda: Corvina, Rondinella e Molinara in perfetto equilibrio.",
        abbinamento: "Pesce di lago, pasta, carni bianche, salumi",
        cibi: ["pesce di lago", "pasta", "pollo", "coniglio", "salumi"],
        curiosita: "Il Bardolino nasce sulla sponda veronese del Lago di Garda, terra di turismo e vino.",
        battuta: "Il Bardolino: il vino che si beve guardando il tramonto sul Garda! 🌅",
        emoji: "🌅"
    },
    {
        nome: "Colli Euganei Fior d'Arancio", tipo: "Bianco Dolce", regione: "Veneto", gradazione: "11-13%",
        temperatura: "8-10°C", bicchiere: "Tulipano",
        descrizione: "Dolce e aromatico dai Colli Euganei: profumi intensi di arancio e fiori bianchi.",
        abbinamento: "Dolci alla frutta, pasticceria secca, formaggi freschi",
        cibi: ["dolci", "frutta", "formaggi freschi", "biscotti"],
        curiosita: "Prodotto con Moscato Giallo nei colli vulcanici vicino Padova.",
        battuta: "Il Fior d'Arancio: un sorso e sei già in un giardino fiorito! 🌺",
        emoji: "🌺"
    },
    {
        nome: "Conegliano Valdobbiadene Prosecco Superiore", tipo: "Bianco Frizzante", regione: "Veneto", gradazione: "11%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "Il Prosecco di qualità superiore dalle colline Patrimonio UNESCO tra Conegliano e Valdobbiadene.",
        abbinamento: "Aperitivi, frutti di mare, dolci, prosciutto crudo",
        cibi: ["aperitivo", "gamberi", "frutti di mare", "prosciutto", "dolce"],
        curiosita: "Le colline sono Patrimonio UNESCO dal 2019. Il Cartizze è il cru più pregiato.",
        battuta: "Il Conegliano Valdobbiadene: le bollicine con il passaporto UNESCO! 🌍",
        emoji: "🥂"
    },
    {
        nome: "Asolo Prosecco Superiore", tipo: "Bianco Frizzante", regione: "Veneto", gradazione: "11%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "Prosecco delle colline di Asolo, considerata una delle città più belle d'Italia.",
        abbinamento: "Aperitivi, risotti delicati, antipasti, frutta",
        cibi: ["aperitivo", "risotto", "antipasto", "frutta"],
        curiosita: "Asolo è soprannominata 'la città dei cento orizzonti' per la sua posizione panoramica.",
        battuta: "L'Asolo Prosecco: bollicine con vista su una delle città più belle del Veneto! 🏘️",
        emoji: "🏘️"
    },
    {
        nome: "Lison", tipo: "Bianco", regione: "Veneto/Friuli", gradazione: "11-12%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Bianco secco da Tocai Friulano nelle pianure tra Veneto e Friuli. Sapido e minerale.",
        abbinamento: "Pesce, risotto, antipasti, formaggi freschi",
        cibi: ["pesce", "risotto", "antipasto", "mozzarella"],
        curiosita: "Il vitigno si chiama oggi Friulano dopo la disputa con l'Ungheria per il nome Tocai.",
        battuta: "Il Lison: il vino che attraversa i confini regionali come fosse niente! 🌉",
        emoji: "🌊"
    },

    // ===== FRIULI VENEZIA GIULIA =====
    {
        nome: "Ramandolo", tipo: "Bianco Dolce", regione: "Friuli Venezia Giulia", gradazione: "12-13%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Rarissimo bianco dolce friulano da Verduzzo Giallo appassito nelle Prealpi Carniche.",
        abbinamento: "Dolci secchi, formaggi erborinati, foie gras",
        cibi: ["formaggi erborinati", "dolci secchi", "foie gras"],
        curiosita: "È prodotto solo nel piccolo borgo di Ramandolo, nel comune di Nimis.",
        battuta: "Il Ramandolo: così raro che se lo trovi, compralo subito! 🏆",
        emoji: "💎"
    },
    {
        nome: "Colli Orientali del Friuli Picolit", tipo: "Bianco Dolce", regione: "Friuli Venezia Giulia", gradazione: "13-15%",
        temperatura: "10-12°C", bicchiere: "Calice",
        descrizione: "Il grande vino dolce friulano: dorato, aromatico, prodotto in quantità minime dal Picolit.",
        abbinamento: "Formaggi erborinati, foie gras, dessert raffinati, meditazione",
        cibi: ["foie gras", "gorgonzola", "dolci raffinati"],
        curiosita: "Il Picolit produce pochi acini per grappolo — ogni vite dà pochissimo vino preziosissimo.",
        battuta: "Il Picolit è così raro da bere che merita di essere meditato, non solo bevuto! 🧘",
        emoji: "👑"
    },

    // ===== EMILIA ROMAGNA =====
    {
        nome: "Albana di Romagna", tipo: "Bianco", regione: "Emilia-Romagna", gradazione: "12-14%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Prima DOCG bianca d'Italia (1987). Secco, amabile o passito, sempre con carattere.",
        abbinamento: "Piadina, prosciutto di Parma, pesce all'adriatico, dolci secchi (passito)",
        cibi: ["piadina", "prosciutto", "pesce", "strozzapreti"],
        curiosita: "Fu la prima DOCG per un vino bianco italiano, scelta che all'epoca fece discutere.",
        battuta: "L'Albana fu la prima DOCG bianca d'Italia — pioniera anche lei! 🥇",
        emoji: "🌾"
    },

    // ===== TOSCANA =====
    {
        nome: "Brunello di Montalcino", tipo: "Rosso", regione: "Toscana", gradazione: "13-15%",
        temperatura: "18-20°C", bicchiere: "Borgogna grande",
        descrizione: "Uno dei più grandi vini rossi italiani: Sangiovese Grosso a Montalcino, longevo e potente.",
        abbinamento: "Selvaggina, cinghiale, brasati, tartufo nero, formaggi stagionati",
        cibi: ["selvaggina", "cinghiale", "capriolo", "brasato", "tartufo", "pecorino stagionato"],
        curiosita: "Deve invecchiare almeno 5 anni (6 per la Riserva). Biondi-Santi è la cantina fondatrice.",
        battuta: "Il Brunello non ha fretta: come i grandi capolavori, ha bisogno di tempo! ⏳",
        emoji: "⏳"
    },
    {
        nome: "Chianti", tipo: "Rosso", regione: "Toscana", gradazione: "11.5-13%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Il vino toscano per eccellenza: Sangiovese dominante in un'area vastissima tra Firenze e Siena.",
        abbinamento: "Bistecca fiorentina, pasta al ragù, pizza, salumi toscani",
        cibi: ["pasta", "pizza", "bistecca", "pollo", "maiale", "ragù", "lasagne", "carne"],
        curiosita: "Il simbolo del Chianti Classico è il Gallo Nero, il consorzio più antico del vino italiano.",
        battuta: "Il Chianti? È come me: accessibile a tutti ma con una profondità sorprendente! 😉",
        emoji: "🐓"
    },
    {
        nome: "Chianti Classico", tipo: "Rosso", regione: "Toscana", gradazione: "12-13.5%",
        temperatura: "17-18°C", bicchiere: "Bordeaux",
        descrizione: "Il cuore storico del Chianti: zona tra Firenze e Siena, Sangiovese puro e austero.",
        abbinamento: "Bistecca fiorentina, pappardelle al cinghiale, pecorino, ribollita",
        cibi: ["bistecca", "pappardelle", "cinghiale", "pecorino", "ribollita"],
        curiosita: "Il Gran Selezione è il top della gamma, invecchiato almeno 30 mesi solo da vigne singole.",
        battuta: "Il Chianti Classico ha il Gallo Nero sul collo — e lo porta con orgoglio! 🐓",
        emoji: "🐓"
    },
    {
        nome: "Vino Nobile di Montepulciano", tipo: "Rosso", regione: "Toscana", gradazione: "12.5-13.5%",
        temperatura: "17-18°C", bicchiere: "Bordeaux",
        descrizione: "Il vino 'nobile' della splendida Montepulciano: elegante, speziato, con buon invecchiamento.",
        abbinamento: "Pici all'aglione, carni alla brace, cinghiale, pecorino di Pienza",
        cibi: ["pici", "cinghiale", "bistecca", "pecorino", "carne"],
        curiosita: "Coltivato da almeno il '500 sulle colline di Montepulciano. Prima DOCG italiana nel 1980.",
        battuta: "Il Vino Nobile: quando anche il nome è una promessa di grandezza! 👑",
        emoji: "🏰"
    },
    {
        nome: "Morellino di Scansano", tipo: "Rosso", regione: "Toscana", gradazione: "12-13%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Sangiovese della Maremma: più caldo, morbido e fruttato rispetto ai Chianti settentrionali.",
        abbinamento: "Cinghiale, pecora, acquacotta, pecorino maremmano",
        cibi: ["cinghiale", "pecora", "pappardelle", "pecorino"],
        curiosita: "'Morellino' è il nome locale del Sangiovese in Maremma. Zona costiera e soleggiata.",
        battuta: "Il Morellino: il Sangiovese che prende il sole in Maremma e si rilassa! ☀️",
        emoji: "☀️"
    },
    {
        nome: "Vernaccia di San Gimignano", tipo: "Bianco", regione: "Toscana", gradazione: "11-12%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Storico bianco toscano da vitigno autoctono: secco, amarognolo, piacevolmente sapido.",
        abbinamento: "Pesce, crostini, zuppe di verdura, formaggi freschi",
        cibi: ["pesce", "crostini", "zuppa", "mozzarella", "verdure"],
        curiosita: "Prima DOC italiana (1966) e prima DOCG bianca toscana. La Vernaccia è descritta da Dante.",
        battuta: "La Vernaccia di San Gimignano ha le torri medievali come testimonial! 🏰",
        emoji: "🏛️"
    },
    {
        nome: "Bolgheri Sassicaia", tipo: "Rosso", regione: "Toscana", gradazione: "13-14%",
        temperatura: "17-18°C", bicchiere: "Bordeaux",
        descrizione: "L'unica DOC italiana dedicata a un singolo vino. Cabernet Sauvignon e Franc nella Maremma.",
        abbinamento: "Costata di manzo, agnello, selvaggina, formaggi stagionati",
        cibi: ["bistecca", "agnello", "selvaggina", "formaggio stagionato"],
        curiosita: "Il Sassicaia è stato il primo 'Supertuscan': vinificato fuori dai disciplinari tradizionali negli anni '70.",
        battuta: "Il Sassicaia: il vino che ha convinto il Cabernet a trasferirsi in Toscana! 🌟",
        emoji: "💫"
    },
    {
        nome: "Elba Aleatico Passito", tipo: "Rosso Dolce", regione: "Toscana", gradazione: "12-15%",
        temperatura: "14-16°C", bicchiere: "Calice",
        descrizione: "Vino dolce dell'Isola d'Elba da uve Aleatico appassite. Napoleone lo amava.",
        abbinamento: "Cioccolato fondente, dolci alle amarene, cantucci, formaggi erborinati",
        cibi: ["cioccolato", "cantucci", "dolci", "gorgonzola"],
        curiosita: "Napoleone Bonaparte durante l'esilio all'Elba ne era ghiotto. Lo beveva ogni giorno.",
        battuta: "Il vino preferito di Napoleone all'Elba: anche i grandi imperatori sanno gustare! 🏆",
        emoji: "⚜️"
    },
    {
        nome: "Montecucco Sangiovese", tipo: "Rosso", regione: "Toscana", gradazione: "12.5-13.5%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Sangiovese ai piedi del Monte Amiata: giovane DOCG con grande potenziale.",
        abbinamento: "Carni alla griglia, cinghiale, pasta con ragù",
        cibi: ["grigliata", "cinghiale", "pasta", "salsiccia"],
        curiosita: "Ottenuta la DOCG nel 2011, è una delle denominazioni più giovani della Toscana.",
        battuta: "Il Montecucco: il giovane promettente della Toscana meridionale! 🌱",
        emoji: "🌄"
    },
    {
        nome: "Monteregio di Massa Marittima", tipo: "Rosso", regione: "Toscana", gradazione: "12%",
        temperatura: "16°C", bicchiere: "Bordeaux",
        descrizione: "Vino della Maremma settentrionale, zona collinare tra mare e miniere storiche.",
        abbinamento: "Carni, formaggi maremmani, cinghiale",
        cibi: ["carne", "cinghiale", "formaggio"],
        curiosita: "Massa Marittima era famosa per le miniere d'argento nel Medioevo.",
        battuta: "Il Monteregio viene dalla terra dei minatori — è un vino che non ha paura del buio! ⛏️",
        emoji: "⛏️"
    },
    {
        nome: "Val di Cornia Suvereto", tipo: "Rosso", regione: "Toscana", gradazione: "13%",
        temperatura: "17°C", bicchiere: "Bordeaux",
        descrizione: "Rosso della costa toscana con Sangiovese e Cabernet, zona di eccellenza emergente.",
        abbinamento: "Carni rosse, cinghiale, formaggi stagionati",
        cibi: ["bistecca", "cinghiale", "formaggio stagionato"],
        curiosita: "Suvereto è considerata uno dei borghi più belli d'Italia.",
        battuta: "Il Suvereto: un grande vino in uno dei borghi più belli d'Italia! 🏡",
        emoji: "🏡"
    },

    // ===== UMBRIA =====
    {
        nome: "Sagrantino di Montefalco", tipo: "Rosso", regione: "Umbria", gradazione: "13-14%",
        temperatura: "17-18°C", bicchiere: "Borgogna",
        descrizione: "Il vino con più tannini al mondo: potente, austero, con lunghissimo invecchiamento.",
        abbinamento: "Piccione, agnello, carni rosse al forno, tartufo nero di Norcia",
        cibi: ["piccione", "agnello", "agnello al forno", "tartufo nero", "cinghiale"],
        curiosita: "Il Sagrantino ha la più alta concentrazione di tannini tra tutti i vitigni conosciuti al mondo.",
        battuta: "Il Sagrantino è il vino più tannico al mondo — non è per cuori teneri! 💪",
        emoji: "🏛️"
    },
    {
        nome: "Torgiano Rosso Riserva", tipo: "Rosso", regione: "Umbria", gradazione: "12.5-13%",
        temperatura: "17°C", bicchiere: "Bordeaux",
        descrizione: "Sangiovese umbro dalla famiglia Lungarotti, pionieri del vino di qualità in Umbria.",
        abbinamento: "Piccione arrosto, tartufo, agnello, pasta al ragù",
        cibi: ["piccione", "tartufo", "agnello", "pasta"],
        curiosita: "La famiglia Lungarotti ha letteralmente inventato l'enologia moderna umbra dagli anni '60.",
        battuta: "Il Torgiano Rosso Riserva: quando una famiglia trasforma una regione intera! 🏅",
        emoji: "🏅"
    },

    // ===== MARCHE =====
    {
        nome: "Vernaccia di Serrapetrona", tipo: "Rosso Spumante", regione: "Marche", gradazione: "11.5-12%",
        temperatura: "12-14°C", bicchiere: "Flute",
        descrizione: "Unico spumante rosso DOCG italiano da vitigno autoctono. Dolce o secco, sempre curioso.",
        abbinamento: "Dolci marchigiani, formaggi freschi, torte di carnevale",
        cibi: ["dolci", "ciambella", "formaggi freschi"],
        curiosita: "È il solo spumante rosso DOCG d'Italia, prodotto in un'area ristrettissima delle Marche.",
        battuta: "La Vernaccia di Serrapetrona: l'unico spumante rosso DOCG — un unicum assoluto! 🦄",
        emoji: "🦄"
    },
    {
        nome: "Offida", tipo: "Bianco", regione: "Marche", gradazione: "12-13%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Pecorino e Passerina marchigiani in versione DOCG: bianchi sapidi e floreali.",
        abbinamento: "Pesce dell'Adriatico, antipasti, brodetto, vincisgrassi",
        cibi: ["pesce", "brodetto", "antipasto", "mozzarella"],
        curiosita: "Il Pecorino marchigiano (vitigno, non formaggio!) era quasi estinto. Oggi è rinato.",
        battuta: "L'Offida: il Pecorino che non è il formaggio ma è ugualmente delizioso! 🐑",
        emoji: "🌊"
    },
    {
        nome: "Conero", tipo: "Rosso", regione: "Marche", gradazione: "12.5-13.5%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Montepulciano d'Abruzzo sul promontorio del Monte Conero. Carattere e sapidità marina.",
        abbinamento: "Brodetto di pesce, porchetta, carni alla brace, vincisgrassi",
        cibi: ["brodetto", "porchetta", "grigliata", "pasta"],
        curiosita: "Il Monte Conero è il solo promontorio adriatico d'Italia: vigneti a picco sul mare.",
        battuta: "Il Conero cresce a picco sull'Adriatico — un vino con la schiena dritta! 🌊",
        emoji: "🏔️"
    },

    // ===== ABRUZZO =====
    {
        nome: "Montepulciano d'Abruzzo Colline Teramane", tipo: "Rosso", regione: "Abruzzo", gradazione: "12.5-13%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Il Montepulciano d'Abruzzo nella sua versione più nobile: colline teramane vicino al Gran Sasso.",
        abbinamento: "Arrosticini, agnello alla brace, pasta al ragù, formaggi pecorino",
        cibi: ["arrosticini", "agnello", "pasta al ragù", "pecorino"],
        curiosita: "Prima DOCG abruzzese. Le colline teramane danno vini più eleganti rispetto alla costa.",
        battuta: "Il Montepulciano d'Abruzzo Colline Teramane: l'Abruzzo in tutta la sua potenza! 🏔️",
        emoji: "🏔️"
    },

    // ===== CAMPANIA =====
    {
        nome: "Fiano di Avellino", tipo: "Bianco", regione: "Campania", gradazione: "12-13%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Grande bianco campano da vitigno antichissimo: minerale, elegante, si evolve magnificamente.",
        abbinamento: "Pesce, crostacei, mozzarella di bufala, pasta con le vongole",
        cibi: ["pesce", "vongole", "mozzarella di bufala", "crostacei", "gamberi"],
        curiosita: "Il Fiano era già coltivato dai Romani, che lo chiamavano 'vitis apiana' per i fichi che attira.",
        battuta: "Il Fiano di Avellino: un bianco del Sud che sfida i migliori del Nord! 🏆",
        emoji: "🏺"
    },
    {
        nome: "Greco di Tufo", tipo: "Bianco", regione: "Campania", gradazione: "12-13%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Elegante e strutturato da suoli vulcanici irpini: uno dei grandi bianchi del Sud Italia.",
        abbinamento: "Pesce, crostacei, astice, mozzarella di bufala, frittura di paranza",
        cibi: ["pesce", "crostacei", "astice", "mozzarella", "bufala", "frittura"],
        curiosita: "Cresce su terreni ricchi di tufo (roccia vulcanica) vicino al Vesuvio. Introdotto dai Greci.",
        battuta: "Il Greco di Tufo non è semplice, è un bianco con la testa di un grande rosso! 🏛️",
        emoji: "🏛️"
    },
    {
        nome: "Taurasi", tipo: "Rosso", regione: "Campania", gradazione: "12.5-13.5%",
        temperatura: "17-18°C", bicchiere: "Borgogna",
        descrizione: "Il Barolo del Sud: Aglianico in Irpinia, potente, tannico, con magnifico invecchiamento.",
        abbinamento: "Agnello al forno, ragù napoletano, formaggi stagionati, selvaggina",
        cibi: ["agnello", "ragù", "pasta al ragù", "selvaggina", "pecorino"],
        curiosita: "Invecchiamento minimo 3 anni (4 per la Riserva). Mastroberardino l'ha reso famoso nel mondo.",
        battuta: "Il Taurasi è il Barolo del Sud — stessa potenza, sole diverso! ☀️",
        emoji: "🌋"
    },

    // ===== BASILICATA =====
    {
        nome: "Aglianico del Vulture Superiore", tipo: "Rosso", regione: "Basilicata", gradazione: "13-14%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Strutturato e minerale dai suoli vulcanici del Monte Vulture. Barolo del Sud bis.",
        abbinamento: "Agnello, salsiccia lucana, formaggi stagionati, carni rosse",
        cibi: ["agnello", "capretto", "salsiccia sarda", "pecorino", "salumi", "maiale"],
        curiosita: "Il Vulture è un vulcano estinto: i suoli ricchi di minerali danno complessità unica al vino.",
        battuta: "L'Aglianico del Vulture è tosto fuori ma sorprendente dentro! 🌋",
        emoji: "🌋"
    },

    // ===== CALABRIA =====
    {
        nome: "Greco di Bianco", tipo: "Bianco Dolce", regione: "Calabria", gradazione: "17%",
        temperatura: "10-12°C", bicchiere: "Calice",
        descrizione: "Raro e prezioso vino passito calabrese dalla punta dello stivale. Dorato e aromatico.",
        abbinamento: "Dolci calabresi, formaggi erborinati, meditazione",
        cibi: ["dolci", "fichi", "mandorle", "formaggi erborinati"],
        curiosita: "Prodotto in soli due comuni (Bianco e Casignana) con pochissime bottiglie l'anno.",
        battuta: "Il Greco di Bianco: il tesoro nascosto della punta dello stivale! 💎",
        emoji: "💎"
    },
    {
        nome: "Terre di Cosenza Magliocco", tipo: "Rosso", regione: "Calabria", gradazione: "12.5%",
        temperatura: "16°C", bicchiere: "Bordeaux",
        descrizione: "Rosso calabrese da vitigno autoctono Magliocco: fruttato, speziato, caldo.",
        abbinamento: "Carne di capra, soppressata, formaggi calabresi",
        cibi: ["capra", "soppressata", "nduja", "formaggi"],
        curiosita: "Il Magliocco è il vitigno autoctono calabrese più diffuso, quasi scomparso negli anni '80.",
        battuta: "Il Magliocco: il vitigno calabrese che è tornato dall'oblio! 🌅",
        emoji: "🌅"
    },

    // ===== SICILIA =====
    {
        nome: "Cerasuolo di Vittoria", tipo: "Rosso", regione: "Sicilia", gradazione: "13%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "L'unica DOCG siciliana: Nero d'Avola e Frappato per un rosso elegante e fruttato.",
        abbinamento: "Coniglio alla stimpirata, caponata, formaggi siciliani, pasta alla norma",
        cibi: ["coniglio", "caponata", "pasta alla norma", "arancini", "tuma"],
        curiosita: "L'unica DOCG di tutta la Sicilia. Il Frappato dà freschezza, il Nero d'Avola struttura.",
        battuta: "Il Cerasuolo di Vittoria è l'unica DOCG siciliana — porta il peso dell'isola intera! 🌋",
        emoji: "🌋"
    },

    // ===== SARDEGNA =====
    {
        nome: "Vermentino di Gallura", tipo: "Bianco", regione: "Sardegna", gradazione: "12-14%",
        temperatura: "8-10°C", bicchiere: "Tulipano",
        descrizione: "L'unica DOCG bianca della Sardegna: fresco, sapido, con note di mandorla e fiori bianchi.",
        abbinamento: "Aragosta, pesce fresco, bottarga, antipasti sardi",
        cibi: ["pesce", "aragosta", "bottarga", "insalata", "gamberi", "calamari", "polpo"],
        curiosita: "Il Vermentino di Gallura è l'unica DOCG bianca della Sardegna. La Gallura è nel nord dell'isola.",
        battuta: "Il Vermentino di Gallura: il bianco che profuma di Costa Smeralda! 🏖️",
        emoji: "🌊"
    },

    // ===== PUGLIA =====
    {
        nome: "Primitivo di Manduria Dolce Naturale", tipo: "Rosso Dolce", regione: "Puglia", gradazione: "16-17%",
        temperatura: "14-16°C", bicchiere: "Calice",
        descrizione: "Il Primitivo nella sua versione dolce e concentrata: uve semi-appassite in vendemmia tardiva.",
        abbinamento: "Cioccolato fondente, dolci pugliesi, formaggi erborinati, fichi secchi",
        cibi: ["cioccolato", "fichi", "formaggi erborinati", "dolci"],
        curiosita: "La versione dolce del Primitivo di Manduria è ottenuta da uve raccolte tardivamente.",
        battuta: "Il Primitivo dolce: quando il vino pugliese decide di fare i complimenti ai dessert! 🍫",
        emoji: "🍇"
    },

    // ===== EXTRA — vini DOC iconici che vale aggiungere =====
    {
        nome: "Prosecco", tipo: "Bianco Frizzante", regione: "Veneto/Friuli", gradazione: "11%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "Il vino frizzante più venduto al mondo: fresco, floreale, con perlage delicato.",
        abbinamento: "Aperitivi, frutti di mare, prosciutto crudo, dolci",
        cibi: ["aperitivo", "gamberi", "frutti di mare", "antipasto", "dolce", "torta", "speck", "prosciutto"],
        curiosita: "La DOC Prosecco copre Veneto e Friuli. Il nome viene dal paese istriano di Prosecco.",
        battuta: "Il Prosecco è il mio migliore amico — sempre allegro e festaiolo! 🎉",
        emoji: "🥂"
    },
    {
        nome: "Chianti Classico Gran Selezione", tipo: "Rosso", regione: "Toscana", gradazione: "13.5%",
        temperatura: "18°C", bicchiere: "Borgogna",
        descrizione: "Il vertice assoluto del Chianti Classico: da singola vigna, affinamento minimo 30 mesi.",
        abbinamento: "Bistecca fiorentina, cinghiale, tartufo, formaggi stagionati",
        cibi: ["bistecca", "cinghiale", "tartufo", "pecorino stagionato"],
        curiosita: "Introdotta nel 2014, la Gran Selezione è la tipologia apice del Chianti Classico.",
        battuta: "La Gran Selezione è il Chianti che ha passato più tempo in cantina che fuori! ⏳",
        emoji: "🏆"
    },
    {
        nome: "Nero d'Avola", tipo: "Rosso", regione: "Sicilia", gradazione: "13-14%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Caldo, avvolgente e pieno di sole siciliano. Il re dei vitigni rossi della Sicilia.",
        abbinamento: "Pasta alla norma, arancini, pesce spada, melanzane, salsiccia",
        cibi: ["melanzane", "pesce spada", "tonno", "pasta", "arancini", "salsiccia", "agnello"],
        curiosita: "Prende il nome da Avola, cittadina in provincia di Siracusa. Ottimo anche in blend.",
        battuta: "Il Nero d'Avola è il vino più caloroso che conosca — ti abbraccia come un amico! 🤗",
        emoji: "☀️"
    },
    {
        nome: "Cannonau di Sardegna", tipo: "Rosso", regione: "Sardegna", gradazione: "13-15%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Robusto e generoso, vino simbolo della longevità sarda. Lo stesso vitigno della Garnacha spagnola.",
        abbinamento: "Porceddu, pecora bollita, salsiccia sarda, formaggi sardi",
        cibi: ["pecora", "agnello", "porceddu", "pecorino", "salumi", "salsiccia sarda"],
        curiosita: "Alcuni studi scientifici lo collegano alla straordinaria longevità degli abitanti della Barbagia.",
        battuta: "Si dice che il Cannonau aiuti a vivere più a lungo... con moderazione! 🧓",
        emoji: "🌿"
    },
    {
        nome: "Lambrusco di Sorbara", tipo: "Rosso Frizzante", regione: "Emilia-Romagna", gradazione: "11%",
        temperatura: "12-14°C", bicchiere: "Bordeaux",
        descrizione: "Il più elegante dei Lambrusco: delicato, quasi rosato, con bollicine fine e persistente.",
        abbinamento: "Tortellini in brodo, prosciutto di Modena, gnocco fritto",
        cibi: ["tortellini", "prosciutto", "gnocco fritto", "tigelle", "salumi"],
        curiosita: "Il Sorbara è considerato il cru dei Lambrusco, dall'omonima frazione vicino Modena.",
        battuta: "Il Lambrusco di Sorbara è il Lambrusco per chi dice di non amare il Lambrusco! 😄",
        emoji: "🎈"
    },
    {
        nome: "Cerasuolo d'Abruzzo", tipo: "Rosato", regione: "Abruzzo", gradazione: "12-13%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Vivace e dal colore ciliegia intenso — molto più di un semplice rosato.",
        abbinamento: "Arrosticini, porchetta, brodetto di pesce, pizza",
        cibi: ["arrosticini", "porchetta", "pesce", "antipasto", "pizza", "verdure grigliate"],
        curiosita: "Il nome deriva dalla ciliegia (cerasa) in dialetto abruzzese. È il rosato più strutturato d'Italia.",
        battuta: "Il Cerasuolo non è un rosato qualunque — ha la grinta di un vino rosso! 🍒",
        emoji: "🍒"
    },
    {
        nome: "Vermentino di Sardegna", tipo: "Bianco", regione: "Sardegna", gradazione: "12-13%",
        temperatura: "8-10°C", bicchiere: "Tulipano",
        descrizione: "Fresco come una brezza marina, il bianco sardo più amato fuori dall'isola.",
        abbinamento: "Pesce, frutti di mare, insalate, antipasti di mare",
        cibi: ["pesce", "branzino", "orata", "salmone", "insalata", "gamberi", "calamari", "polpo"],
        curiosita: "Coltivato in tutta la Sardegna, è diverso dal Vermentino di Gallura (DOCG) per zona e carattere.",
        battuta: "Il Vermentino di Sardegna è il mio compagno di vacanza preferito — sempre rinfrescante! 🏖️",
        emoji: "🌊"
    },
    {
        nome: "Pecorino", tipo: "Bianco", regione: "Marche/Abruzzo", gradazione: "13-14%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Il vitigno redivivo delle Marche e Abruzzo: sapido, floreale, con corpo sorprendente.",
        abbinamento: "Pesce dell'Adriatico, brodetto, spaghetti alle vongole, formaggi freschi",
        cibi: ["pesce", "vongole", "brodetto", "antipasto", "mozzarella"],
        curiosita: "Il Pecorino era quasi estinto negli anni '80. Odoardo Dottori ne ha salvato i vecchi ceppi.",
        battuta: "Il Pecorino vitigno è tornato dall'oblio ed è subito diventato una star! ⭐",
        emoji: "🐑"
    },
    {
        nome: "Falanghina del Sannio", tipo: "Bianco", regione: "Campania", gradazione: "12-13%",
        temperatura: "10-12°C", bicchiere: "Tulipano",
        descrizione: "Bianco campano fresco e floreale. Il vitigno potrebbe essere il Falernum degli antichi romani.",
        abbinamento: "Mozzarella di bufala, pesce, pizza fritta, frittura",
        cibi: ["mozzarella di bufala", "pesce", "pizza", "frittura", "antipasto"],
        curiosita: "La Falanghina era il vitigno del Falerno, il vino più famoso dell'antica Roma.",
        battuta: "La Falanghina: il vino che bevevano i Romani e che ancora ci fa sentire imperatori! 🏛️",
        emoji: "🏺"
    },
    {
        nome: "Primitivo di Manduria", tipo: "Rosso", regione: "Puglia", gradazione: "14-16%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Corposo, caldo e ricco di frutto maturo. Il Primitivo nella sua versione secca più famosa.",
        abbinamento: "Carni alla griglia, agnello, formaggi piccanti, orecchiette al ragù",
        cibi: ["grigliata", "salsiccia", "agnello", "costine", "formaggio piccante", "salumi", "hamburger"],
        curiosita: "È geneticamente identico allo Zinfandel californiano. Portato in California dagli emigrati pugliesi.",
        battuta: "Il Primitivo è il vino che non fa mai le cose a metà! 💪",
        emoji: "🔥"
    },
    {
        nome: "Aglianico del Vulture", tipo: "Rosso", regione: "Basilicata", gradazione: "13-14%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Strutturato e minerale dai suoli vulcanici del Monte Vulture. Grande longevità.",
        abbinamento: "Agnello al forno, salsiccia lucana, formaggi stagionati, pasta al ragù",
        cibi: ["agnello", "capretto", "salsiccia", "pecorino", "salumi", "maiale"],
        curiosita: "Viene chiamato il 'Barolo del Sud' per la struttura e la capacità di invecchiamento.",
        battuta: "L'Aglianico del Vulture: tosto fuori ma sorprendente dentro! 🌋",
        emoji: "🌋"
    },
    {
        nome: "Verdicchio dei Castelli di Jesi", tipo: "Bianco", regione: "Marche", gradazione: "12-13%",
        temperatura: "8-10°C", bicchiere: "Tulipano",
        descrizione: "Sapido e minerale con nota di mandorla. Il bianco marchigiano più famoso nel mondo.",
        abbinamento: "Pesce dell'Adriatico, brodetto, vongole, mozzarella",
        cibi: ["pesce", "brodetto", "vongole", "cozze", "mozzarella", "frittura di pesce"],
        curiosita: "Cresce in vigneti affacciati sull'Adriatico da cui prende la sapidità caratteristica.",
        battuta: "Il Verdicchio è discreto ma quando lo assaggi non lo dimentichi più! 🐟",
        emoji: "🐟"
    },
    {
        nome: "Franciacorta Satèn", tipo: "Spumante", regione: "Lombardia", gradazione: "12%",
        temperatura: "6-8°C", bicchiere: "Flute",
        descrizione: "La versione cremosa del Franciacorta: pressione più bassa, bollicine setose, solo bianchi.",
        abbinamento: "Pesce crudo, crostacei, carpaccio, risotto allo zafferano",
        cibi: ["pesce crudo", "crostacei", "carpaccio", "risotto"],
        curiosita: "Il Satèn è prodotto solo in bianco bianco con pressione di 4,5 bar invece dei soliti 6.",
        battuta: "Il Satèn è il Franciacorta in vestito di seta — eleganza al quadrato! 🥂",
        emoji: "🪡"
    },
    {
        nome: "Soave", tipo: "Bianco", regione: "Veneto", gradazione: "11-12%",
        temperatura: "8-10°C", bicchiere: "Tulipano",
        descrizione: "Delicato e floreale, con finale leggermente ammandorlato. Il bianco veronese per eccellenza.",
        abbinamento: "Antipasti, risotto, pesce di lago, formaggi freschi",
        cibi: ["risotto", "pesce di lago", "trota", "carpaccio", "antipasto", "verdure"],
        curiosita: "Prende il nome dall'omonima cittadina medievale vicino Verona. Garganega è il vitigno base.",
        battuta: "Il Soave è discreto come il nome suggerisce, ma sa farsi notare! 🏰",
        emoji: "🏰"
    },
    {
        nome: "Lagrein", tipo: "Rosso", regione: "Alto Adige", gradazione: "13-14%",
        temperatura: "16-18°C", bicchiere: "Bordeaux",
        descrizione: "Profondo, fruttato e vellutato: vitigno autoctono altoatesino quasi unico al mondo.",
        abbinamento: "Speck, canederli, cervo, stinco di maiale, wurstel",
        cibi: ["speck", "canederli", "cervo", "cinghiale", "stinco", "wurstel", "crauti"],
        curiosita: "Coltivato quasi esclusivamente in Alto Adige, è uno dei vitigni autoctoni più rari d'Italia.",
        battuta: "Il Lagrein arriva dalla montagna ma ha l'animo di un grande vino! ⛰️",
        emoji: "⛰️"
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