import axios from 'axios';
import {API_URL, TOKEN_KEY} from "../Config/config";

export const auth = async (login, password) => {
    try {
        console.log(login, password)
        const response = await axios.post(`${API_URL}/login`, { login, password });
        console.log(response)
        const token = response.data;
        localStorage.setItem(TOKEN_KEY, token);

        console.log( JSON.parse(atob(token.split('.')[1])))
        return token;
    } catch (error) {
        console.log(error);
        throw new Error(error.response.data);
    }
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};
export const isLoggedIn = () => {
    const token = getToken();
    return token !== null && token !== undefined;
};
export const connectedUser = () => {
    if (isLoggedIn()) {
        const token = getToken();

        return  JSON.parse(atob(token.split('.')[1]));


    }
    return null;
}
