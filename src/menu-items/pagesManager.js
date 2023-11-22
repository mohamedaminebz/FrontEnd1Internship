// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
    LoginOutlined,
    ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pagesManager = {
    id: 'Suivi',
    title: 'Suivi',
    type: 'group',
    children: [
        {
            id: 'Suivi_Project',
            title: 'Suivi_Project',
            type: 'item',
            url: '/',
            icon: icons.ProfileOutlined,
        },
        {
            id: 'Suivi_Tasks',
            title: 'Suivi_Tasks',
            type: 'item',
            url: '/Suivi_Tasks',
            icon: icons.ProfileOutlined,
        },
    ]
};

export default pagesManager;
