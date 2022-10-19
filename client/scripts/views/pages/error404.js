import Component from '../../views/component';
import hbsError from '../../../templates/pages/error404'

class Error404 extends Component {
    static async render() {
        return await hbsError();
    }
}

export default Error404;