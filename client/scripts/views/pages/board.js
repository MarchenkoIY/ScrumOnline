import Component from '../component';
import hbsBoard from '../../../templates/pages/board';
import Tasks from '../../models/tasks';
import {getRandomInt} from '../../helpers/random';

class BoardWithTasks extends Component {
    static async getData() {
        return await Tasks.getTasks(JSON.parse(localStorage.getItem('UserData')).stack);
    }

    static async render() {
        return await hbsBoard();
    }

    static async afterRender() {
        await this.renderTasks();
        this.setActions();
    }

    static setActions() {
        const boardWithTasks = document.getElementsByClassName('tasks')[0],
            tasksArea = document.getElementsByClassName('tasks')[0],
            tasksEventSource = new EventSource('http://localhost:3000/tasksConnect');

        boardWithTasks.onmousedown = event => {
            let target = event.target.closest('.task');

            if(target && !target.classList.contains('someoneTask')) {
                target.classList.add('dragable');

                let startPosition = [target.style.left, target.style.top];

                document.onmousemove = event => {
                    this.moveTask(event, target);
                }

                boardWithTasks.onmouseup = () => {
                    this.chargeTaskStatus(target, startPosition, tasksArea);

                    document.onmousemove = null;
                    target.onmouseup = null;

                    target.classList.remove('dragable');
                }
            }
        }   

        boardWithTasks.ondblclick = event => {
            let target = event.target.closest('.task');

            if(target) {
                location.hash = `#/task/${target.dataset.id}`;
            }
        }

        tasksEventSource.onmessage = event => {
            if(location.hash === '#/board') {
                const task = JSON.parse(event.data);

                this.renderChanges(task);
            } else {
                tasksEventSource.onmessage = null;
            }
        }
    }

    static async renderTasks() {
        const tasksData = await this.getData();

        for(let task of tasksData) {
            this.renderOneTask(task);
        }
    }

    static getTaskHTML(task) {
        return `
            <h6>${task.taskName}</h6>
            <p>${(task.timeleft / 3600000).toFixed(2)}ч</p>
        `;
    }

    static generateTaskXCoord(task, tasksArea) {
        switch(task.status) {
            case 'New':
                return getRandomInt(0, tasksArea.clientWidth * 0.33 - 150);
            case 'In Progress':
                return getRandomInt(tasksArea.clientWidth * 0.33, tasksArea.clientWidth * 0.66 - 150);
            case 'Done':
                return getRandomInt(tasksArea.clientWidth * 0.66, tasksArea.clientWidth - 150);
        }
    }

    static async chargeTaskStatus(task, startPosition, tasksArea) {
        let assignee = JSON.parse(localStorage.getItem('UserData'))._id,
            msNow = Date.now();
        if(task.dataset.status === 'New' && parseInt(task.style.left) > 0 && parseInt(task.style.left) < tasksArea.clientWidth * 0.66) {
            if(parseInt(task.style.left) > tasksArea.clientWidth * 0.33 && parseInt(task.style.left) < tasksArea.clientWidth * 0.66) {
                await Tasks.changeTaskStatus({id: task.dataset.id, status: 'In Progress', assignee: assignee, deadline: msNow + +task.dataset.timeleft});
                task.dataset.status = 'In Progress';
            }
        } else if(task.dataset.status === 'In Progress' && parseInt(task.style.left) > tasksArea.clientWidth * 0.33 && parseInt(task.style.left) < tasksArea.clientWidth) {
            if (parseInt(task.style.left) > tasksArea.clientWidth * 0.66 && parseInt(task.style.left) < tasksArea.clientWidth) {
                await Tasks.changeTaskStatus({id: task.dataset.id, status: 'Done', assignee: assignee, closed: msNow});
                task.dataset.status = 'Done';
                task.classList.remove('myTask');
                task.classList.add('someoneTask');
            }
        } else {
            [task.style.left, task.style.top] = startPosition;
        }
    }

    static moveTask(event, task) {
        task.style.left = `${event.pageX - task.parentNode.offsetLeft}px`;
        task.style.top = `${event.pageY - task.parentNode.offsetTop}px`;
    }

    static renderOneTask(task) {
        const taskDiv = document.createElement('div'),
            tasksArea = document.getElementsByClassName('tasks')[0];

        tasksArea.append(taskDiv);

        taskDiv.classList.add('task');
        taskDiv.classList.add(`task${getRandomInt(1, 5)}`);
        taskDiv.dataset.id = task._id;
        taskDiv.dataset.status = task.status;
        taskDiv.dataset.timeleft = task.timeleft;

        if(task.status === 'In Progress') {
            if(JSON.parse(localStorage.getItem('UserData'))._id === task.assignee) {
                taskDiv.classList.add('myTask');
            } else {
                taskDiv.classList.add('someoneTask');
            }
        } else if(task.status === 'Done'){
            taskDiv.classList.add('someoneTask');
        }
        taskDiv.innerHTML = this.getTaskHTML(task);

        taskDiv.style.height = `${taskDiv.offsetWidth}px`;

        taskDiv.style.top = `${getRandomInt(35, tasksArea.offsetHeight - 150)}px`;
        taskDiv.style.left = `${this.generateTaskXCoord(task, tasksArea)}px`;
    }

    static async renderChanges(task) {
        if(JSON.parse(localStorage.getItem('UserData')).stack === task.stack || JSON.parse(localStorage.getItem('UserData')).stack === 'manager') {
            if(!task.assignee) {              
                this.renderOneTask(task);

            } else if(task.assignee !== JSON.parse(localStorage.getItem('UserData'))._id) {
                let taskElement = document.querySelector(`.task[data-id="${task._id}"]`);

                taskElement.remove();

                this.renderOneTask(task);
            }
        }
    }
}

export default BoardWithTasks;