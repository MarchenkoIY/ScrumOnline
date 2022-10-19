import Component from '../component';
import Tasks from '../../models/tasks';

class Calendar extends Component {
    static async getData() {
        return await Tasks.getTasks('manager');
    }

    static async render() {
        return `
            <h1 class="page-title"></h1>
            <div class="calendarsDay">
                <div><p>ПН<p></div>
                <div><p>ВТ<p></div>
                <div><p>СР<p></div>
                <div><p>ЧТ<p></div>
                <div><p>ПТ<p></div>
                <div><p>СБ<p></div>
                <div><p>ВС<p></div>
            </div>
            <div class="calendarsDay">
                ${this.renderDays()}
            </div>
        `;
    }

    static afterRender() {
        this.setActions();
        this.renderInfo();
    }

    static setActions() {
        const calendar = document.getElementsByClassName('calendarsDay')[1];        

        calendar.onclick = event => {
            const clickedDay = document.getElementsByClassName('clicked')[0];

            let target = event.target.closest('.day');

            if(clickedDay) {
                clickedDay.style.margin = 0;
                clickedDay.classList.remove('clicked');
            }

            if(target && target.childNodes.length > 1) {
                if(!target.classList.contains('clicked')) {
                    target.classList.add('clicked');
                    target.style.marginBottom = `${-target.offsetHeight + 100}px`;
                    target.style.marginLeft = `${-target.offsetWidth / 4}px`;
                }

                target.onclick = event => {
                    let target = event.target;

                    if(target.tagName === 'P' && target.dataset.id) {
                        location.hash = `#/task/${target.dataset.id}`;
                    }
                }
            }
        }
    }

    static renderInfo() {
        const header = document.getElementsByTagName('h1')[0];
        let today = new Date();

            this.getDaysCount(today, header); 
    }

    static renderDays() {
        let daysHTML = '';

        for (let i = 0; i < 35; i++) {
            daysHTML += '<div class="day"></div>';
        }

        return daysHTML;
    }

    static async renderDate(amountDays, today) {
        let firstDay = new Date(today.getFullYear(), today.getMonth(), 1),
            daysPlace = document.getElementsByClassName('day'),
            dayNumber = 1,
            tasks = await this.getData();

        if (firstDay.getDay() === 0) {
            for (let i = 6; i <= 6 + amountDays; i++) {
                daysPlace[i].innerHTML = `<p>${dayNumber}</p>${this.renderTasks(dayNumber, tasks)}`;

                if (i === today.getDate() + firstDay.getDay() - 2) {
                    daysPlace[i].classList.add('today');
                }

                dayNumber++;
            } 
        } else {
            for (let i = firstDay.getDay() - 1; i < firstDay.getDay() + amountDays - 1; i++) {
                if(i > daysPlace.length - 1) {
                    daysPlace[0].parentNode.innerHTML += '<div class="day"></div>';
                }

                daysPlace[i].innerHTML = `<h6>${dayNumber}</h6>${this.renderTasks(dayNumber, tasks)}`;

                if (i === today.getDate() + firstDay.getDay() - 2) {
                    daysPlace[i].classList.add('today');
                }

                dayNumber++;
            }
        }
    }

    static getDaysCount(today, header) {
        switch(today.getMonth()) {
            case 0:  
                header.innerText = `Январь ${today.getFullYear()}`;
                this.renderDate(31, today);
                break;
            case 1:
                header.innerText = `Февраль ${today.getFullYear()}`;
                if (today.getFullYear() % 4 === 0) {
                    this.renderDate(29, today);
                } else {
                    this.renderDate(28, today);
                }
                break;
            case 2:
                header.innerText = `Март ${today.getFullYear()}`;
                this.renderDate(31, today);
                break;
            case 3:
                header.innerText = `Апрель ${today.getFullYear()}`;
                this.renderDate(30, today);
                break;
            case 4:
                header.innerText = `Май ${today.getFullYear()}`;
                this.renderDate(31, today);
                break;
            case 5:
                header.innerText = `Июнь ${today.getFullYear()}`;
                this.renderDate(30, today);
                break;
            case 6:
                header.innerText = `Июль ${today.getFullYear()}`;
                this.renderDate(31, today);
                break;
            case 7:
                header.innerText = `Август ${today.getFullYear()}`;
                this.renderDate(31, today);
                break;
            case 8:
                header.innerText = `Сентябрь ${today.getFullYear()}`;
                this.renderDate(30, today);
                break;
            case 9:
                header.innerText = `Октябрь ${today.getFullYear()}`;
                this.renderDate(31, today);
                break;
            case 10:
                header.innerText = `Ноябрь ${today.getFullYear()}`;
                this.renderDate(30, today);
                break;
            case 11:
                header.innerText = `Декабрь ${today.getFullYear()}`;
                this.renderDate(31, today);
                break;
        }
    }

    static renderTasks(dayNumber, tasks) {
        let date = new Date(),
            month = date.getMonth();

        let tasksForRender = tasks.filter(element => new Date(element.deadline).getMonth() === month);

        return tasksForRender.filter(element => new Date(element.deadline).getDate() === dayNumber)
        .map(element => `<p data-id="${element._id}" class="${element.stack} ${localStorage.getItem('UserData')._id === element.assignee ? '' : 'someoneTask'}">${element.taskName}</p>`)
        . join('\n');
    }
}

export default Calendar;