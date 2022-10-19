import Component from '../../views/component';
import NewTaskForm from '../../../templates/pages/addNewTask';
import Tasks from '../../models/tasks';


class NewTask extends Component {
    static async render() {
        return await NewTaskForm();
    }

    static afterRender() {
        this.setActions();  
    }

    static async setActions() {
        const formAddTask = document.forms.addNewTask,
            taskName = formAddTask.taskName,
            taskDescription = formAddTask.taskDescription,
            selectStack = formAddTask.select,
            timeleft = formAddTask.timeleft,
            button = document.getElementsByClassName('submitButton')[0];

        formAddTask.onkeyup = () => button.disabled = (!taskName.value.trim() || !taskDescription.value.trim() || !timeleft.value);

        formAddTask.onsubmit = async event => {
            event.preventDefault();

            await Tasks.addTask(this.getTaskData(taskName, taskDescription, selectStack, timeleft))
            .then(formAddTask.reset());
        }
    }

    static getTaskData(taskName, taskDescription, selectStack, timeleft) {
        return {taskName: taskName.value, taskDescription: taskDescription.value, stack: selectStack.value, status: 'New', timeleft: +timeleft.value * 3600000};
    }
}

export default NewTask;