import '../styles/variable';
import '../styles/style';
import '../styles/media';

import {parseCurrentURL} from './helpers/utils';

import HeaderAndRule from './views/partials/HeaderAndRule';

import Error404 from './views/pages/error404';
import Autorization from './views/pages/autorization';
import BoardWithTasks from './views/pages/board';
import NewTask from './views/pages/addNewTask';
import CurrentTasks from './views/pages/currentTasks';
import Calendar from './views/pages/calendar';
import Info from './views/pages/taskInfo';
import Chat from './views/pages/chat';

const Routes = {
    '/': Autorization,
    '/board': BoardWithTasks,
    '/newTask': NewTask,
    '/currentTasks': CurrentTasks,
    '/task/:id': Info,
    '/calendar': Calendar,
    '/chat': Chat
};

const router = async() => {
    const container = document.getElementsByClassName('content')[0];    
    
    container.innerHTML = await HeaderAndRule.render();

    const urlParts = parseCurrentURL(),
        pagePath = `/${urlParts.page || ''}${urlParts.id ? '/:id' : ''}`,
        Page = Routes[pagePath] ? Routes[pagePath] : Error404;

    if(localStorage.getItem('UserData') && pagePath !== '/') {
        Autorization.renderHeader(); 
        Chat.messageListener();
    } else {
        location.hash = '/';
    }
    
    const workZone = document.getElementsByClassName('workZone')[0];

    workZone.innerHTML = await Page.render();
    Page.afterRender();
};

window.addEventListener('load', router);

window.onhashchange = router;