const socket = io();

const sendMessage = () => {
    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;
    socket.emit('new-message', { user, message });
    document.getElementById('message').value = "";
}

const createMessageHtml = (message) => {
    return `
    <li class="flex justify-between gap-x-6 py-5">
        <div class="flex min-w-0 gap-x-4">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://i.pinimg.com/originals/a8/8e/46/a88e4663a54e7fea22c7a88661c738e2.jpg" alt="">
            <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-gray-900">${message.user}</p>
                <p class="mt-1 truncate text-xs leading-5 text-gray-700">${message.message}</p>
            </div>
        </div>
    </li>
    `
}

const updateChatHtml = (messages) => {
    const html = messages.map(m => createMessageHtml(m)).join(" ");
    document.getElementById('messagesContainer').innerHTML = html;
}

const initializeChat = async () => {
    let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if(!user) {
        user = await getCurrentUser();
    }

    if(user && user.email) {
        document.getElementById('user').value = user.email;
    }

    document.getElementById("messageForm").addEventListener("submit", function(e) {
        e.preventDefault();
        sendMessage();
    });    
}

document.addEventListener('DOMContentLoaded', async () => {
    await initializeChat();
});

socket.on('messages', (messages) => updateChatHtml(messages));