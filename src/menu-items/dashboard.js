// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
    DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'Dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'Company_Overview_Dashboard',
            title: 'Company Overview',
            type: 'item',
            url: '/',
            icon: icons.ProfileOutlined,
        },
        {
            id: 'Department_specific_Dashboard',
            title: 'Department specific',
            type: 'item',
            url: '/Department_specific_Dashboard',
            icon: icons.ProfileOutlined,
        },
        {
            id: 'Project_specific_Dashboard',
            title: 'Project specific',
            type: 'item',
            url: '/Project_specific_Dashboard',
            icon: icons.ProfileOutlined,
        },
        ]
};

export default dashboard;
