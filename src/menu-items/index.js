// project import
import pages from './pages';
import dashboard from './dashboard';
import utilities from './utilities';
import support from './support';
import {connectedUser} from "../Service/auth.service";
import pagesManager from "./pagesManager";
import pagesWorker from "./pagesWorker";

// ==============================|| MENU ITEMS ||============================== //
let menuItems = { items: [] };
console.log(connectedUser())
const userRole = connectedUser()?.type; // Example user role, replace with your own logic
if (userRole === 'ceo') {
    menuItems = {

        items: [dashboard]
    };
}else if (userRole === 'admin') {
     menuItems = {

        items: [pages]
    };
}else if (userRole === 'manager') {
     menuItems = {

        items: [pagesManager]
    };
}else if (userRole === 'worker') {
     menuItems = {
        items: [pagesWorker]
    }

}

export default menuItems;
