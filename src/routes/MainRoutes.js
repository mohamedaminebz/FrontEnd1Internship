import MainLayout from 'layout/MainLayout';
import ListPerson from "../pages/ListPerson/ListPerson";
import ListDepartment from "../pages/ListDepartment/ListDepartment";
import {connectedUser} from "../Service/auth.service";
import Worker from "../pages/Accueil/worker";
import Manager from "../pages/Accueil/manager";
import ManagerListTasks from "../pages/ManagerListTasks/ManagerListTasks";
import Company_Overview_Dashboard from "../pages/Dashoard/Company_Overview_Dashboard";
import Department_specific_Dashboard from "../pages/Dashoard/Department_specific_Dashboard";
import Project_specific_Dashboard from "../pages/Dashoard/Project_specific_Dashboard";

const userRole = connectedUser()?.type; // Example user role, replace with your own logic
// Define the routes for different user roles
import { Navigate } from 'react-router-dom';
import {TOKEN_KEY} from "../Config/config";

// Check if token exists
const isAuthenticated = () => {
    const token = localStorage.getItem(TOKEN_KEY); // Assuming you store the token in localStorage
    return !!token;
};

const PrivateRoute = ({ element, redirectPath }) => {
    if (isAuthenticated()) {
        return element;
    } else {
        return <Navigate to={redirectPath} replace />;
    }
};


let routes = null;

if (userRole === 'admin') {
    routes = {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <PrivateRoute
                    element={<ListPerson />}
                    redirectPath="/login" // Redirect to login if token doesn't exist
                />
            },
            {
                path: 'listdepartment',
                element: <PrivateRoute
                    element={<ListDepartment />}
                    redirectPath="/login"
                />
            }
        ]
    };
} else if (userRole === 'manager') {
    routes = {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <PrivateRoute
                    element={<Manager />}
                    redirectPath="/login"
                />
            },
            {
                path: '/Suivi_tasks',
                element: <PrivateRoute
                    element={<ManagerListTasks />}
                    redirectPath="/login"
                />
            }
        ]
    };
} else if (userRole === 'ceo') {
    routes = {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <PrivateRoute
                    element={<Company_Overview_Dashboard />}
                    redirectPath="/login"
                />
            },
            {
                path: '/Department_specific_Dashboard',
                element: <PrivateRoute
                    element={<Department_specific_Dashboard />}
                    redirectPath="/login"
                />
            },
            {
                path: '/Project_specific_Dashboard',
                element: <PrivateRoute
                    element={<Project_specific_Dashboard />}
                    redirectPath="/login"
                />
            }
        ]
    };
} else {
    routes = {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <PrivateRoute
                    element={<Worker />}
                    redirectPath="/login"
                />
            }
        ]
    };
}

export default routes;
