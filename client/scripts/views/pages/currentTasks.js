import Component from '../component';
import hbsTasks from '../../../templates/pages/currentTasks';
import Tasks from '../../models/tasks';

class CurrentTasks extends Component {
    static async getData() {
        return await Tasks.getCurrentTasks({assignee: JSON.parse(localStorage.getItem('UserData'))._id})
    }

    static async render() {
        return await this.renderTasks();
    }

    static afterRender() {
        this.setActions();
    }

    static setActions() {
        const tasksArea = document.getElementsByClassName('currentTasks')[0];

        tasksArea.onclick = event => {
            let target = event.target.closest('.currentTask');

            if(target) {
                event.stopPropagation();

                location.hash = `#/task/${target.dataset.id}`;
            }
        }
    }

    static async renderTasks() {
        const tasks = await this.getData();

        return await hbsTasks({tasks});
    }
}

export default CurrentTasks;