import { API_URL } from "../Config/config";
import axios from  '../Config/interceptor';



export function GetAllPerson() {
    return axios.get(`${API_URL}/person`)
        .then(response => {
            return response.data;
        });
}

export function GetAllResponsible() {
    return axios.get(`${API_URL}/person`)
        .then(response => {
            const allPersons = response.data;
            return  allPersons.filter(person => person.type === 'manager');
        });
}

export function GetAllDeveloper() {
    return axios.get(`${API_URL}/person`)
        .then(response => {

            const allPersons = response.data;
            return  allPersons.filter(person => person.type === 'developer');

        });
}

export function GetPerson(id) {
    return axios.get(`${API_URL}/person/${id}`)
        .then(response => {
            return response.data;
        });
}

export function CreatePerson(person) {
    if(person.department == null || person.department == '')
    {
        person.department = ''
    }
    return axios.post(`${API_URL}/person`, person)
        .then(response => {
            return response.data;
        });
}

export function UpdatePerson(person) {

    const { id, ...personData } = person;
    return axios.put(`${API_URL}/person/${person.id}`, personData)
        .then(response => {
            return response.data;
        });
}

export function DeletePerson(id) {
    return axios.delete(`${API_URL}/person/${id}`)
        .then(response => {
            return response.data;
        });
}

export function GetPersonByDepartment() {
    return axios.get(`${API_URL}/department/persons/`)
        .then(response => {
            return response.data;
        });
}