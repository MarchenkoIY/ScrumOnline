import {renderInfoMessange} from '../helpers/infoMessages.js';

class Tasks {
    static async getTasks(condition) {
        try {
            const response = await fetch('http://localhost:3000/board');

            if(response.ok) {             
                let tasks = await response.json();

                if(condition === 'manager') {
                    return tasks;
                } else {
                    return tasks.filter(task => task.stack === condition);
                }
            } else {
                renderInfoMessange(`Код ошибки: ${response.status}.<br>Перезагрузите страницу и попробуйте еще раз.`);
            }
        } catch(error) {
            renderInfoMessange(`Код ошибки: ${error}.<br>Перезагрузите страницу.`);
        }
    }

    static async getCurrentTasks(assignee) {
        try {
            const response = await fetch('http://localhost:3000/currentTasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(assignee)
            });

            if(response.ok) {             
                return await response.json();
            } else {
                renderInfoMessange(`Код ошибки: ${response.status}.<br>Перезагрузите страницу и попробуйте еще раз.`);
            }
        } catch(error) {
            renderInfoMessange(`Код ошибки: ${error}.<br>Перезагрузите страницу.`);
        }
    }

    static async addTask(newTask) {
        try {
            const response = await fetch('http://localhost:3000/tasks/newTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });

            if(response.ok) {
                renderInfoMessange('Ваша задача добавлена.');
            } else {
                renderInfoMessange(`Код ошибки: ${response.status}.<br>Перезагрузите страницу и попробуйте еще раз.`);
            }
        } catch(error) {
            renderInfoMessange(`Код ошибки: ${error}.<br>Перезагрузите страницу и попробуйте еще раз.`);
        }
    }

    static async changeTaskStatus(task) {
        try {
            const response = await fetch('http://localhost:3000/tasks/taskStatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            });

            if(response.ok) {
                renderInfoMessange('Статус задачи изменен.');
            } else {
                renderInfoMessange(`Код ошибки: ${response.status}.<br>Перезагрузите страницу и попробуйте еще раз.`);
            }
        } catch(error) {
           renderInfoMessange(`Ошибка: ${error}.<br>Перезагрузите страницу и попробуйте еще раз.`);
        }
    }

    static async getTask(id) {
        try {
            const response = await fetch(`http://localhost:3000/task/${id}`);
            
            if(response.ok) {
                return await response.json();
            } else {
                renderInfoMessange(`Код ошибки: ${response.status}.<br>Перезагрузите страницу и попробуйте еще раз.`);
            }
        } catch(error) {
            renderInfoMessange(`Ошибка: ${error}.<br>Перезагрузите страницу.`);
        }
    }
}

export default Tasks;