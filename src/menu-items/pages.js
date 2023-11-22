// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
    LoginOutlined,
    ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
    id: 'Gestion',
    title: 'Gestion',
    type: 'group',
    children: [
        {
            id: 'List_of_Person',
            title: 'List of Person',
            type: 'item',
            url: '/',
            icon: icons.ProfileOutlined,
        },
        {
            id: 'List_of_Department',
            title: 'List of Department',
            type: 'item',
            url: '/listdepartment',
            icon: icons.ProfileOutlined,
        }
        // ,
        // {
        //     id: 'List_of_Project',
        //     title: 'List of Project',
        //     type: 'item',
        //     url: '/listproject',
        //     icon: icons.ProfileOutlined,
        // },
        // {
        //     id: 'List_of_Tasks',
        //     title: 'List of Tasks',
        //     type: 'item',
        //     url: '/listtasks',
        //     icon: icons.ProfileOutlined,
        // }
    ]
};

export default pages;
