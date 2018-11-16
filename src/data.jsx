import React from 'react';

import { fade } from '@material-ui/core/styles/colorManipulator';

function random(x){
    return Math.floor(Math.random()*x) + 1;

}

let counter = -1;
function createData(firstname, lastname, ex, email, phone) {
    counter += 1;
    return { id: counter, firstname,lastname,worktime:random(5)*5,email,phone};

}

let cnt = -1;
function createEvent(title, st, en, cap) {


    let initcap=2+random(6);
    let employ=[];
    for(let i=0;i<(initcap-cap);i++)
        employ.push(i);

    cnt += 1;
    return { id: cnt,
        title,
        start: new Date(new Date().setHours(new Date().getHours() - st - random(3))),
        end: new Date(new Date().setHours(new Date().getHours() - en + random(3))),
        capacity: 2+random(8),
        note: "",
        employees:employ
    };

}

let rows=[
    createData('Petr', 'Novakčič',40, 'Petr.Novakcic@gmail.com', '+420721007440'),
    createData('Filip', 'Dobře',20, 'Filip.Dobre@gmail.com', '+420721007440'),
    createData('Petr', 'Neposlecha',10, 'Petr.Neposlecha@gmail.com', '+420721007440'),
    createData('Honza', 'Správně',25, 'Spavnak@gmail.com', '+420721007440'),
    createData('Pepa', 'Novak',25, 'Pepa.Novak@gmail.com', '+420721007440'),
    createData('Filip', 'Dobře',40, 'Petr.Novakcic@gmail.com', '+420721007440'),
    createData('Petr', 'Neposlecha',30, 'Petr.Neposlecha@gmail.com', '+420721007440'),
    createData('Tomáš', 'Chrian',25, 'PChrianic@gmail.com', '+420721007440'),
    createData('Filip', 'Dobře',20, 'Filip.Dob@gmail.com', '+420721007440'),
    createData('Ondra', 'Neposlecha',30, 'Ondra.Novakcic@gmail.com', '+420721007440'),
];

let events=[
    createEvent('Volne1', -80, -80, 10),
    createEvent('Plne1', -50,-50, 0),
    createEvent('Castecne plne1', -20,-20,2),
    createEvent('Plne2', 0,0,0),
    createEvent('Volne3', 20,20,10),
    createEvent('Plne3', 48,48,0),
    createEvent('Castecne plne2', 85,85,3),
    createEvent('Plne', 100,100,0),

];
for (let i in events) {
    let tmp = [];
    for (let p in events[i].employees) {
        tmp.push(rows[events[i].employees[p]])

    }
    events[i].employees = tmp;
}

export {events,rows};
