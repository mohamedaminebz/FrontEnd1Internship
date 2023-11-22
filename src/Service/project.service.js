import { API_URL } from "../Config/config";
import axios from  '../Config/interceptor';


export function getAllProjects() {
    return axios.get(`${API_URL}/project`)
        .then(response => {
            return response.data;
        });
}

export function getProject(id) {
    return axios.get(`${API_URL}/project/${id}`)
        .then(response => {
            return response.data;
        });
}

export function createProject(project) {
    return axios.post(`${API_URL}/project`, project)
        .then(response => {
            return response.data;
        });
}

export function updateProject(project) {
    const { id, ...projectData } = project;
    return axios.put(`${API_URL}/project/${project.id}`, projectData)
        .then(response => {
            return response.data;
        });
}

export function deleteProject(id) {
    return axios.delete(`${API_URL}/project/${id}`)
        .then(response => {
            return response.data;
        });
}

export function getProjectbyUser(){
    return axios.get(`${API_URL}/project/person`)
        .then(response => {
            return response.data;
        });
}