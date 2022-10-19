import Component from '../component';
import hbsAutorizationForm from '../../../templates/pages/autorization';
import hbsHeaderContent from '../../../templates/partials/header';
import {renderInfoMessange} from '../../helpers/infoMessages';

class Autorization extends Component {
    static async render() {
        if(localStorage.getItem('UserData') && JSON.parse(localStorage.getItem('UserData')).name) {
            this.renderHeader();
            this.redirectToBoard();
        } else {
            return await hbsAutorizationForm();
        }
    }

    static afterRender() {
        if(document.forms.autorise) {
            this.setActions();  
        }
    }

    static setActions() {
        const form = document.forms.autorise,
            login = form.login,
            password = form.password,
            button = form.button;

        form.onkeyup = () => button.disabled = !login.value.trim() || !password.value.trim();
        form.onsubmit = event => this.readDataToLS(login, password, event, button);
    }

    static async submitForm(login, password, event, button) {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/autorise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({login: login.value, password: password.value})
            });

            if(response.ok) {
                renderInfoMessange('Добро пожаловать!');
                return await response.json();
            } else {
                login.value = '';
                password.value = '';
                button.disabled = true;
                renderInfoMessange('Введены неверные данные.<br>Попробуйте еще раз.');
            }
        } catch(error) {
            renderInfoMessange('Введены неверные данные.<br>Попробуйте еще раз.');
        }
    }

    static redirectToBoard() {
        location.hash = '#/board';
    }

    static async readDataToLS(login, password, event) {
        const userData = await this.submitForm(login, password, event);

        if(userData) {
            localStorage.setItem('UserData', JSON.stringify(userData));
            this.renderHeader();
            this.redirectToBoard();
        }
    }

    static async renderHeader() {
        const header = document.getElementsByClassName('header')[0];

        header.innerHTML = await hbsHeaderContent();
    }
}

export default Autorization;