import Component from '../component';
import chatModel from '../../models/chatModel';

class Chat extends Component {
    static async getData() {
        return await chatModel.getMessages(document.getElementsByClassName('message').length);
    }

    static async render() {
        return `<div class="chat">
            <div class="messages">
                ${await this.renderMessages()}
            </div>
            <form class="rules" name="message">
                <textarea name="textMessage" id="textMessage" placeholder="Введите сообщение..."></textarea><button id="sendMessage" type="submit" disabled></button>
            </form>
        </div>`
    }

    static afterRender() {
        this.setActions();
    }

    static async setActions() {
        const messageForm = document.forms.message,
            textMessage = messageForm.textMessage,
            buttonSend = document.getElementById('sendMessage'),
            messagesList = document.getElementsByClassName('messages')[0],
            messages = document.getElementsByClassName('message');

        messageForm.onkeyup = () => buttonSend.disabled = !textMessage.value.trim()

        messageForm.onsubmit = async event => {
            event.preventDefault();

            await chatModel.sendMessage(JSON.parse(localStorage.getItem('UserData')).name, textMessage.value);
            messageForm.reset();
            buttonSend.disabled = true;
        };

        messagesList.onscroll = async () => {
            if (messagesList.scrollTop + 1 === messages[messages.length - 1].offsetTop - messages[messages.length - 1].offsetHeight) {
                let messagesHTML = await this.renderMessages();

                if (messagesHTML) {
                    messagesList.insertAdjacentHTML('beforeend', messagesHTML);
                } else {
                    messagesList.onscroll = null;
                }
            }
        }
    }

    static getMessageHTML(message) {
        return `
            <div class="message ${JSON.parse(localStorage.getItem('UserData')).name === message.author ? 'myMessage' : ''}">
                <h6>${message.author}</h6>
                <p>${message.text}</p>
            </div>
        `
    }

    static async renderMessages() {
        let messages = await this.getData();

        if (messages[0]) {
            return messages.map(element => this.getMessageHTML(element)).reverse().join('\n');
        } else {
            return false;
        }
    }

    static async messageListener() {
        const messagesEventSource = new EventSource('http://localhost:3000/chatConnect');

        messagesEventSource.onmessage = event => {

            if (location.hash === '#/chat') {
                const message = JSON.parse(event.data),
                    messageList = document.getElementsByClassName('messages')[0];

                let messageForRender = this.getMessageHTML(message);

                messageList.insertAdjacentHTML('afterbegin', `${messageForRender}`);
                messageList.scrollTop = 0;

            } else {
                const chatLink = document.getElementById('chat');
                if (!chatLink.classList.contains('newMessage')) {
                    chatLink.classList.add('newMessage');
                }

                chatLink.onclick = () => chatLink.classList.remove('newMessage');
            }
        }

        window.addEventListener('hashchange', () => messagesEventSource.onmessage = null);
    }
}

export default Chat;