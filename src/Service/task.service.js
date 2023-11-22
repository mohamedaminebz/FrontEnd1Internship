import { API_URL } from "../Config/config";
import axios from  '../Config/interceptor';


export function getAllTasks() {
    return axios.get(`${API_URL}/task`)
        .then(response => {
            return response.data;
        });
}

export function getTask(id) {
    return axios.get(`${API_URL}/task/${id}`)
        .then(response => {
            return response.data;
        });
}

export function createTask(task) {
    return axios.post(`${API_URL}/task`, task)
        .then(response => {
            return response.data;
        });
}

export function updateTask(task) {
    const { _id, ...taskData } = task;
    return axios.put(`${API_URL}/task/${task.id}`, taskData)
        .then(response => {
            return response.data;
        });
}

export function deleteTask(id) {
    return axios.delete(`${API_URL}/task/${id}`)
        .then(response => {
            return response.data;
        });
}

export function getTasksByUser() {
    return axios.get(`${API_URL}/task/person`)
        .then(response => {
            return response.data;
        });
}

export function GetTasksByDepartment() {
    return axios.get(`${API_URL}/department/tasks/`)
        .then(response => {
            return response.data;
        });
}
