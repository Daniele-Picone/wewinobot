const axios = require('axios');
module.exports = async (req, res) => {
  console.log("=== WEBHOOK HIT ===");
  console.log("METHOD:", req.method);
  console.log("BODY:", JSON.stringify(req.body));

  return res.status(200).json({ ok: true });
};
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

// ============ DATI WEWINO ============

const VINI = [
    {
        nome: "Barolo",
        tipo: "Rosso",
        regione: "Piemonte",
        descrizione: "Un vino nobile e complesso, perfetto per cene importanti",
        abbinamento: "Carni rosse, formaggi stagionati",
        battuta: "Il Barolo è come me: elegante, sofisticato e un po' altezzoso! 🍷"
    },
    {
        nome: "Prosecco",
        tipo: "Bianco Frizzante",
        regione: "Veneto",
        descrizione: "Fresco, vivace e sempre pronto a festeggiare",
        abbinamento: "Aperitivi, frutti di mare, dolci",
        battuta: "Il Prosecco è il mio migliore amico - sempre allegro e festaiolo! 🎉"
    },
    {
        nome: "Chianti",
        tipo: "Rosso",
        regione: "Toscana",
        descrizione: "Versatile e amichevole, il compagno perfetto di ogni pasto",
        abbinamento: "Pasta, pizza, carni",
        battuta: "Il Chianti? È come me: accessibile a tutti ma con una profondità sorprendente! 😉"
    },
    {
        nome: "Amarone",
        tipo: "Rosso",
        regione: "Veneto",
        descrizione: "Intenso e passionale, per chi ama le emozioni forti",
        abbinamento: "Carni in umido, formaggi blu, cioccolato",
        battuta: "L'Amarone è il vino più drammatico che conosco - sempre con storie da raccontare! 🎭"
    },
    {
        nome: "Moscato d'Asti",
        tipo: "Bianco Dolce",
        regione: "Piemonte",
        descrizione: "Dolce, fresco e leggermente frizzante - la felicità in un bicchiere",
        abbinamento: "Dolci, frutta, formaggi freschi",
        battuta: "Il Moscato d'Asti è come una giornata di sole - ti fa sempre sorridere! ☀️"
    },
    {
        nome: "Nero d'Avola",
        tipo: "Rosso",
        regione: "Sicilia",
        descrizione: "Caldo, avvolgente e pieno di sole siciliano",
        abbinamento: "Arrosticini, pasta alla norma, pesce",
        battuta: "Il Nero d'Avola è il vino più caloroso che conosca - ti abbraccia come un amico! 🤗"
    },
    {
        nome: "Vermentino",
        tipo: "Bianco",
        regione: "Sardegna",
        descrizione: "Fresco come una brezza marina, perfetto per l'estate",
        abbinamento: "Pesce, frutti di mare, insalate",
        battuta: "Il Vermentino è il mio compagno di vacanza preferito - sempre rinfrescante! 🏖️"
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
    "Il vino è la prova che Dio ci ama e vuole che siamo felici! 😇"
];

const SITUAZIONI = [
    { situazione: "Primo appuntamento", consiglio: "Prosecco - fresco, elegante e non troppo impegnativo" },
    { situazione: "Cena romantica", consiglio: "Barolo - nobile, sofisticato e indimenticabile" },
    { situazione: "Festa con amici", consiglio: "Chianti - allegro, versatile e sempre benvenuto" },
    { situazione: "Dopo una brutta giornata", consiglio: "Amarone - intenso e consolante" },
    { situazione: "Dolce serata", consiglio: "Moscato d'Asti - dolce come i tuoi pensieri" },
    { situazione: "Pranzo estivo", consiglio: "Vermentino - fresco come una brezza marina" },
    { situazione: "Cena di famiglia", consiglio: "Nero d'Avola - caloroso e accogliente" },
    { situazione: "Celebrazione importante", consiglio: "Prosecco - sempre pronto a festeggiare" }
];

// ============ FUNZIONI HELPER ============

function getUserData(userId) {
    if (!userData[userId]) {
        userData[userId] = {
            nome: null,
            punti: 0,
            viniProvati: [],
            livello: 1,
            badge: []
        };
    }
    return userData[userId];
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
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error('Errore modifica messaggio:', error?.response?.data || error.message);
    }
}

// ============ GESTIONE COMANDI ============

async function handleCommand(chatId, userId, command) {
    if (command === '/start') {
        const welcomeText = `
🍷 <b>Benvenuto in Wewino - Il Sommelier Divertente!</b> 🤖

Ciao! Sono Wewino, un assistente AI sommelier simpatico e informativo!
Sono qui per aiutarti a scoprire il meraviglioso mondo dei vini con consigli, giochi e tanta simpatia.

<b>Ecco cosa posso fare per te:</b>

🍇 /vino - Ricevi un consiglio su un vino casuale
🎯 /indovina - Gioca a "Indovina il Vino"
😄 /battuta - Ascolta una battuta su vini
🎮 /quiz - Rispondi a un quiz su vini
💰 /punti - Vedi i tuoi punti e il tuo livello
🏆 /profilo - Visualizza il tuo profilo
❓ /aiuto - Mostra tutti i comandi

Iniziamo? Scegli un comando! 🚀
        `;
        await sendMessage(chatId, welcomeText);
    }

    else if (command === '/aiuto') {
        const helpText = `
📖 <b>Comandi Disponibili:</b>

🍇 /vino - Ricevi un consiglio su un vino casuale
🎯 /indovina - Gioca a "Indovina il Vino"
😄 /battuta - Ascolta una battuta divertente su vini
🎮 /quiz - Rispondi a domande su vini
💰 /punti - Vedi i tuoi punti, livello e badge
🏆 /profilo - Visualizza il tuo profilo completo
❓ /aiuto - Mostra questo messaggio

<b>Come funziona il sistema di punti:</b>
- Ogni azione corretta: +10 punti
- Ogni vino provato: +5 punti
- Livello: aumenta ogni 100 punti
- Badge: sbloccati raggiungendo certi punti

Buon divertimento! 🍷
        `;
        await sendMessage(chatId, helpText);
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

💭 <i>${vinoRandom.battuta}</i>

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
            {
                text: s.situazione,
                callback_data: `indovina_${i}`
            }
        ]);

        await sendMessageWithButtons(chatId, '🎯 <b>Indovina il Vino!</b>\n\nScegli una situazione e io ti consiglierò il vino perfetto:', buttons);
    }

    else if (command === '/quiz') {
        const domande = [
            {
                domanda: "Quale regione è famosa per il Barolo?",
                opzioni: ["Piemonte", "Toscana", "Veneto"],
                risposta: 0
            },
            {
                domanda: "Il Prosecco è un vino rosso o bianco?",
                opzioni: ["Rosso", "Bianco", "Rosato"],
                risposta: 1
            },
            {
                domanda: "Quale vino viene dalla Sicilia?",
                opzioni: ["Chianti", "Nero d'Avola", "Amarone"],
                risposta: 1
            }
        ];

        const domanda = domande[Math.floor(Math.random() * domande.length)];

        const buttons = domanda.opzioni.map((o, i) => [
            {
                text: o,
                callback_data: `quiz_${i}_${domanda.risposta}`
            }
        ]);

        await sendMessageWithButtons(chatId, `🎮 <b>Quiz!</b>\n\n${domanda.domanda}`, buttons);
    }

    else if (command === '/punti') {
        const user = getUserData(userId);
        const badgeText = user.badge.length > 0 ? user.badge.join(", ") : "Nessun badge ancora";

        const response = `
💰 <b>I Tuoi Punti</b>

<b>Punti Totali:</b> ${user.punti} 🎯
<b>Livello:</b> ${user.livello} ⭐
<b>Vini Provati:</b> ${user.viniProvati.length} 🍷
<b>Badge:</b> ${badgeText}

Continua a giocare per sbloccare nuovi badge! 🚀
        `;
        await sendMessage(chatId, response);
    }

    else if (command === '/profilo') {
        const user = getUserData(userId);
        const viniList = user.viniProvati.length > 0 ? user.viniProvati.join(", ") : "Nessuno ancora";

        const response = `
🏆 <b>Il Tuo Profilo Wewino</b>

<b>ID Utente:</b> ${userId}
<b>Livello:</b> ${user.livello} ⭐
<b>Punti:</b> ${user.punti} 💰
<b>Vini Provati:</b> ${user.viniProvati.length}
<b>Vini:</b> ${viniList}

<b>Badge Sbloccati:</b>
- 50 punti: Sommelier Novizio
- 200 punti: Sommelier Esperto
- 500 punti: Sommelier Maestro

Continua a scoprire vini e sblocca tutti i badge! 🎉
        `;
        await sendMessage(chatId, response);
    }

    else {
        await sendMessage(chatId, '🤔 Non conosco questo comando. Usa /aiuto per vedere tutti i comandi disponibili!');
    }
}

// ============ GESTIONE CALLBACK ============

async function handleCallback(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data;

    if (data.startsWith('indovina_')) {
        const index = parseInt(data.split('_')[1]);
        const situazione = SITUAZIONI[index];
        addPunti(userId, 10);

        const response = `
✅ <b>Perfetto!</b>

<b>Situazione:</b> ${situazione.situazione}
<b>Consiglio:</b> ${situazione.consiglio}

(+10 punti! 🎉)
        `;

        await editMessage(chatId, messageId, response);
    }

    if (data.startsWith('quiz_')) {
        const parts = data.split('_');
        const risposta = parseInt(parts[1]);
        const corretta = parseInt(parts[2]);

        let response;
        if (risposta === corretta) {
            addPunti(userId, 15);
            response = "✅ <b>Corretto!</b> (+15 punti! 🎉)";
        } else {
            response = "❌ <b>Sbagliato!</b> Prova di nuovo con /quiz";
        }

        await editMessage(chatId, messageId, response);
    }

    // Rispondi al callback query (toglie il "caricamento" sul bottone in Telegram)
    try {
        await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
            callback_query_id: callbackQuery.id
        });
    } catch (error) {
        console.error('Errore risposta callback:', error?.response?.data || error.message);
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

            const command = text.split(' ')[0];

            if (command.startsWith('/')) {
                await handleCommand(chatId, userId, command);
            } else {
                await sendMessage(chatId, '👋 Ciao! Usa /aiuto per vedere i comandi disponibili!');
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