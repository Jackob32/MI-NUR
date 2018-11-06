import Manager from '../views/manager/manager';
import Employee from '../views/employee/employee';
import login from '../pages/login';




var indexRoutes = [
    { path: '/manager', name: 'Index', component: Manager },
    { path: '/employee', name: 'Index', component: Employee },
    { path: '/login', name: 'Login', component: login }
];

export default indexRoutes;
