// ===============================
// bot.js - інтеграція з chat.html
// ===============================

// ------------------------------
// Підключення DOM елементів
// ------------------------------
const inputEl = document.getElementById("messageInput"); // поле вводу
const sendBtn = document.getElementById("sendBtn");      // кнопка надсилання
const messagesEl = document.getElementById("messages");  // контейнер повідомлень
const endBtn = document.getElementById("endChatBtn");    // кнопка завершити чат
const nextBtn = document.getElementById("nextChatBtn");  // кнопка наступного співрозмовника

// Додамо елемент typing для "співрозмовник пише"
let typingEl = document.getElementById("typing");
if(!typingEl){
    typingEl = document.createElement("div");
    typingEl.id = "typing";
    typingEl.className = "typing";
    typingEl.textContent = "Співрозмовник пише...";
    typingEl.style.display = "none";
    messagesEl.appendChild(typingEl);
}

// ------------------------------
// Функції для роботи з чатом
// ------------------------------
function addMessage(text, className=""){
    const msg = document.createElement("div");
    msg.className = "message " + className;
    msg.textContent = text;
    messagesEl.insertBefore(msg, typingEl); // вставляємо перед "typing"
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping(){
    typingEl.style.display = "block";
}

function hideTyping(){
    typingEl.style.display = "none";
}

function sendMessage(){
    const text = inputEl.value.trim();
    if(text === "") return;
    addMessage(text, "my-message");
    inputEl.value = "";
    botRespond(text);
}

// ------------------------------
// Події чату
// ------------------------------
sendBtn.addEventListener('click', sendMessage);
inputEl.addEventListener('keypress', e => {
    if(e.key === 'Enter') sendMessage();
});

endBtn.addEventListener('click', ()=>{
    addMessage("Чат завершено.", "system-message");
    setTimeout(()=>{ window.location.href="menu.html"; }, 1000);
});

nextBtn.addEventListener('click', ()=>{
    addMessage("Пошук нового співрозмовника...", "system-message");
    setTimeout(()=>{
        addMessage("Співрозмовник знайдений!", "system-message");
    },1500);
});

// ------------------------------
// Початкове повідомлення
// ------------------------------
setTimeout(()=>{
    addMessage("Співрозмовник знайдений!", "system-message");
},1500);

// ===============================
// Параметри користувача
// ===============================
let userGender = "чоловік";
let userAge = 18;

// ===============================
// Параметри співрозмовника (бот)
// ===============================
let partnerGender = "жінка";
let partnerAgeRange = "18-23";
let botName = partnerGender === "жінка" ? "Аліса" : "Максим";
let botAge = getRandomAge(partnerAgeRange);

// ===============================
// Контекст діалогу
// ===============================
let context = {
    lastTopic: null,
    lastQuestion: null,
    lastAnswer: null,
    askedAbout: {},
    userAge: userAge,
    userGender: userGender
};

// ===============================
// Функція для випадкового віку
// ===============================
function getRandomAge(range){
    switch(range){
        case "менше 18": return Math.floor(Math.random()*8)+10;
        case "18-23": return Math.floor(Math.random()*6)+18;
        case "24-29": return Math.floor(Math.random()*6)+24;
        case "30-40": return Math.floor(Math.random()*11)+30;
        case "40+": return Math.floor(Math.random()*20)+40;
        default: return 25;
    }
}

// ===============================
// Словник категорій
// ===============================
const dictionary = {
    greetings: {
        words: ["привіт","хай","здрастуй","hello","hi"],
        fragments: ["Привіт!","Хай, радий бачити!","Hello 🙂","Привіт-привіт!"]
    },
    name: {
        words: ["ім'я","звати","як тебе","твій ім'я"],
        fragments: [`Мене звати ${botName}`]
    },
    age: {
        words: ["вік","скільки","років"],
        fragments: [`Мені ${botAge} років`]
    },
    hobbies: {
        words: ["хобі","захоплення","цікаво","любиш","що робиш"],
        fragments: [
            "Я люблю читати книги",
            "Моє хобі — спорт",
            "Обожнюю подорожувати",
            "Мені подобається музика",
            "Люблю проводити час на природі"
        ]
    },
    feelings: {
        words: ["настрій","як","почуваєшся","емоції","почуття"],
        fragments: [
            "В мене гарний настрій 🙂",
            "Трохи втомлений, але все ок",
            "Весело та позитивно",
            "Сьогодні чудовий день"
        ]
    },
    food: {
        words: ["їжа","смачно","кухня","готую","обід","вечеря"],
        fragments: [
            "Я люблю піцу 🍕",
            "Обожнюю суші 🍣",
            "Моє улюблене — борщ",
            "Люблю солодке"
        ]
    },
    smalltalk: {
        words: ["погода","день","сонце","кіно","музика","серіал"],
        fragments: [
            "Який твій улюблений фільм?",
            "Обожнюю музику, слухаєш щось зараз?",
            "Сьогодні чудова погода, правда?",
            "Мені подобається дивитися серіали",
            "Який твій улюблений серіал?"
        ]
    },
    questions: {
        words: ["питання","запитати","розкажи","хочеш"],
        fragments: [
            "Розкажи трохи про себе 🙂",
            "Яке твоє улюблене хобі?",
            "Що любиш їсти?",
            "Який твій улюблений фільм або серіал?",
            "Як почуваєшся сьогодні?"
        ]
    }
};

// ===============================
// Допоміжні функції для відповіді
// ===============================

// Перевірка, чи користувач задає уточнення
function isFollowUp(words){
    const followUpWords = ["які","який","що","як саме"];
    return words.some(w=>followUpWords.includes(w));
}

// Вибір відповіді по темі
function getReplyForTopic(topic){
    let possibleReplies = dictionary[topic].fragments.filter(f=>f!==context.askedAbout[topic]);
    if(possibleReplies.length===0) possibleReplies = dictionary[topic].fragments;
    const reply = possibleReplies[Math.floor(Math.random()*possibleReplies.length)];
    context.askedAbout[topic] = reply;
    return reply;
}

// ===============================
// Логіка відповіді бота
// ===============================
function botRespond(userText){
    showTyping();
    const delay = 800 + Math.random()*1200;

    setTimeout(()=>{
        hideTyping();

        const text = userText.toLowerCase();
        const words = text.split(/[\s,!.?]+/);

        let reply = "";
        let topicFound = null;

        // --- Якщо це уточнення по останній темі ---
        if(context.lastTopic && isFollowUp(words)){
            topicFound = context.lastTopic;
            reply = getReplyForTopic(topicFound);
        } else {
            // --- Вибір теми по ключових словах ---
            for(let cat in dictionary){
                if(words.some(w => dictionary[cat].words.includes(w))){
                    topicFound = cat;
                    break;
                }
            }

            if(topicFound){
                reply = getReplyForTopic(topicFound);
            } else {
                // --- невідоме питання -> маленький smalltalk ---
                const smalltalk = dictionary.smalltalk.fragments.filter(f=>f!==context.askedAbout["smalltalk"]);
                reply = smalltalk[Math.floor(Math.random()*smalltalk.length)];
                context.askedAbout["smalltalk"] = reply;
            }
        }

        context.lastTopic = topicFound;
        context.lastAnswer = reply;

        addMessage(reply,"bot-message");

        // --- Бот іноді ставить своє питання ---
        if(Math.random()<0.25){
            const questions = dictionary.questions.fragments;
            const q = questions[Math.floor(Math.random()*questions.length)];
            setTimeout(()=>addMessage(q,"bot-message"), 1500 + Math.random()*1500);
        }

    }, delay);
}

// ===============================
// Допоміжні функції для чату
// ===============================
function addMessage(text,className){
    const messagesDiv = document.getElementById("messages");
    const msgDiv = document.createElement("div");
    msgDiv.className = "message " + className;
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showTyping(){
    const messagesDiv = document.getElementById("messages");
    const typingDiv = document.createElement("div");
    typingDiv.className = "typing";
    typingDiv.id = "typingIndicator";
    typingDiv.textContent = "Співрозмовник пише...";
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function hideTyping(){
    const typingDiv = document.getElementById("typingIndicator");
    if(typingDiv) typingDiv.remove();
}