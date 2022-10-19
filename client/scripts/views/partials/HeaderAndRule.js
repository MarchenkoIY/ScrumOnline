import Component from '../../views/component.js';

class HeaderAndRule extends Component {
    static async render() {
        const page = this.urlParts.page;

        return `
        <div class="container">
            <ul>
                <li id="board"  class="${location.hash === '#/board' ? 'pushed' : ''}"><a ${JSON.parse(localStorage.getItem('UserData')) ? 'href="#/board"' : ''}">Доска задач</a></li>
                <li id="currentTasks" class="${location.hash === '#/currentTasks' ? 'pushed' : ''}"><a ${JSON.parse(localStorage.getItem('UserData')) ? 'href="#/currentTasks"' : ''}">Текущие задачи</a></li>
                <li id="calendar" class="${location.hash === '#/calendar' ? 'pushed' : ''}"><a ${JSON.parse(localStorage.getItem('UserData')) ? 'href="#/calendar"' : ''}">Календарь</a></li>
                <li id="chat" class="${location.hash === '#/chat' ? 'pushed' : ''}"><a ${JSON.parse(localStorage.getItem('UserData')) ? 'href="#/chat"' : ''}">Чат</a></li>
            </ul>
            <div class="content">
                <div class="header">
                    
                </div>
                <div class="workZone">
                    
                </div>
            </div>
        </div>
        `;
    }
}

export default HeaderAndRule;