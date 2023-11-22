import { API_URL } from "../Config/config";
import axios from  '../Config/interceptor';
import {connectedUser} from "./auth.service";


export function GetAllDepartment() {

            return axios.get(`${API_URL}/department`)
                .then(response => {
                    const allDepartment = response.data;
                    return  allDepartment;

                });
}


export function CreateDepartment(department) {
    return axios.post(`${API_URL}/department`, department)
        .then(response => {
            return response.data;
        });
}

export function UpdateDepartment(department) {

    const { id, ...departmentData } = department;
    return axios.put(`${API_URL}/department/${department.id}`, departmentData)
        .then(response => {
            return response.data;
        });
}

export function DeleteDepartment(id) {
    return axios.delete(`${API_URL}/department/${id}`)
        .then(response => {
            return response.data;
        });
}

export function GetdepartmentIdforconnectedUser(){

    return axios.get(`${API_URL}/person/`+connectedUser()?._id)
        .then(response => {

            return response.data.department.id;
        });
}