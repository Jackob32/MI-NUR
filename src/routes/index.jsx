import Manager from '../views/manager/manager';
import Employee from '../views/employee/employee';
let indexRoutes = [
    { path: '/manager', name: 'Index', component: Manager },
    { path: '/employee', name: 'Index', component: Employee },
];

export default indexRoutes;
