// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
    LoginOutlined,
    ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pagesWorker = {
    id: 'Suivi',
    title: 'Suivi',
    type: 'group',
    children: [
        {
            id: 'My_Tasks',
            title: 'My_Tasks',
            type: 'item',
            url: '/',
            icon: icons.ProfileOutlined,
        }
    ]
};

export default pagesWorker;
