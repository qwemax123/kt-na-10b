const chatArea = document.getElementById("chat-area")
const textInput = document.getElementById("text-input")
const sendBtn = document.getElementById("send-btn")

const WS = new WebSocket("ws://localhost:9000")
const events = new EventSource("http://localhost:9000/events")
const userId = Math.floor(Math.random() * 1000)
const messages = []

WS.onopen = () => {
    console.log("Подключились к серверу")
}
events.onopen = () => {
    console.log("Подключились к sse")
}

events.onerror = () => {
    console.log("ошиюка sse подключения")
}

events.addEventListener('connected', (event) => {
    const data = JSON.parse(event.data)
    console.log('пришло sse сообщенеи:', data)
})

sendBtn.onclick = () => {
    let message = textInput.value;
    if (message?.lenght < 1) {
        alert("сообщение не может быть пустым")
        return
    }
    let jsonMessage = {
        userId,
        message
    }
    WS.send(JSON.stringify(jsonMessage))
    console.log("Отправили на сервер")
    console.log(jsonMessage)
    messages.push(jsonMessage)
    renderChat()
}

WS.onmessage = (message) => {
    console.log(message)
    const jsonData = JSON.parse(message.data)
    messages.push(jsonData)
    renderChat()
}

function renderChat() {
    chatArea.innerHTML = ""
    messages.forEach(m => {
        chatArea.innerHTML +=
            `
        <span><b>Пользователь ${m.userId}</b>: ${m.message}</span><br>
        `
    })
}