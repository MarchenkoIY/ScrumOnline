import Component from '../component';
import taskInfo from '../../../templates/pages/taskInfo';
import Tasks from '../../models/tasks';
import Error404 from './error404';

class Info extends Component {
    static async getData() {
        return await Tasks.getTask(this.urlParts.id)
    }

    static async render() {
        let task = await this.getData();

        if(task) {
            return await taskInfo({task});
        } else {
            return Error404.render();
        }
    }

    static afterRender() {
        this.setActions();
    }

    static async setActions() {
        const workZone = document.getElementsByClassName('workZone')[0], 
            toWorkButton = document.getElementById('toWork'),
            toCloseButton = document.getElementById('toClose'),
            tasksEventSource = new EventSource('http://localhost:3000/tasksConnect');

        if(toWorkButton) {
            toWorkButton.onclick = async () => {
                await Tasks.changeTaskStatus({id: toWorkButton.dataset.id, status: 'In Progress', assignee: JSON.parse(localStorage.getItem('UserData'))._id, deadline: Date.now() + +toWorkButton.dataset.timeleft});
            }
        }

        if(toCloseButton) {
            toCloseButton.onclick = async () => {
                await Tasks.changeTaskStatus({id: toCloseButton.dataset.id, status: 'Done', assignee: JSON.parse(localStorage.getItem('UserData'))._id, closed: Date.now()});
            }
        }

        tasksEventSource.onmessage = async () => {
            workZone.innerHTML = await this.render();
            this.afterRender();
        }
    }
}

export default Info;