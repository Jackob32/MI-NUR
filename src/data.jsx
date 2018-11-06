import React from 'react';

import { fade } from '@material-ui/core/styles/colorManipulator';


let counter = 0;
function createData(firstname, lastname, worktime, email, phone) {
    counter += 1;
    return { id: counter, firstname,lastname,worktime,email,phone};
}

let rows=[
    createData('Petr', 'Novakčič',40, 'Petr.Novakcic@gmail.com', '+420721007440'),
    createData('Filip', 'Dobře',20, 'Filip.Dobre@gmail.com', '+420721007440'),
    createData('Petr', 'Neposlecha',10, 'Petr.Neposlecha@gmail.com', '+420721007440'),
    createData('Honza', 'Správně',25, 'Spavnak@gmail.com', '+420721007440'),
    createData('Filip', 'Dobře',40, 'Petr.Novakcic@gmail.com', '+420721007440'),
    createData('Petr', 'Neposlecha',30, 'Petr.Neposlecha@gmail.com', '+420721007440'),
    createData('Tomáš', 'Chrian',25, 'PChrianic@gmail.com', '+420721007440'),
    createData('Filip', 'Dobře',20, 'Filip.Dob@gmail.com', '+420721007440'),
    createData('Ondra', 'Neposlecha',30, 'Ondra.Novakcic@gmail.com', '+420721007440'),
]

    let events = [
        {
            id: 0,
            title: 'Volne',
            start: new Date(new Date().setHours(new Date().getHours() - 3)),
            end: new Date(new Date().setHours(new Date().getHours() + 3)),
            capacity: 5,
            note: "",
            employees: [],

        },
        {
            id: 1,
            title: 'Plne',
            start: new Date(new Date().setHours(new Date().getHours() - 8)),
            end: new Date(new Date().setHours(new Date().getHours() + 1)),
            capacity: 3,
            note: "",
            employees: [
                {
                    firstname: "Petr",
                    lastname: "Novakcic",
                    worktime: 20,
                    thisweekworktime: 15,
                    email: "Petr.Novakcic@gmail.com"
                },
                {
                    firstname: "Filip",
                    lastname: "Dobře",
                    worktime: 30,
                    thisweekworktime: 33,
                    email: "Filip.Dobro@gmail.com"
                },
                {
                    firstname: "Tomáš",
                    lastname: "Správně",
                    worktime: 40,
                    thisweekworktime: 45,
                    email:  "Tomasspravne@fit.cvut.cz"
                },
            ],
        },
        {
            id: 2,
            title: 'Castecne plne',
            start: new Date(new Date().setHours(new Date().getHours() - 20)),
            end: new Date(new Date().setHours(new Date().getHours() - 25)),
            capacity: 7,
            note: "",
            employees: [
                {
                    firstname: "Petr",
                    lastname: "Novakcic",
                    worktime: 20,
                    thisweekworktime: 15,
                    email: "Petr.Novakcic@gmail.com"
                },
                {
                    firstname: "Marcel",
                    lastname: "Dobře",
                    worktime: 30,
                    thisweekworktime: 33,
                    email: "Filip.Dobro@gmail.com"
                },
                {
                    firstname: "Tomáš",
                    lastname: "Správně",
                    worktime: 40,
                    thisweekworktime: 45,
                    email: "\n" +
                        "Tomasspravne@fit.cvut.cz"
                },
            ],
        },
        {
            id: 3,
            title: 'Preplnene',
            start: new Date(new Date().setHours(new Date().getHours() - 39)),
            end: new Date(new Date().setHours(new Date().getHours() - 34)),
            capacity: 1,
            note: "",
            employees: [
                {
                    firstname: "Petr",
                    lastname: "Novakcic",
                    worktime: 20,
                    thisweekworktime: 15,
                    email: "Petr.Novakcic@gmail.com"
                },
                {
                    firstname: "Správně",
                    lastname: "Dobře",
                    worktime: 30,
                    thisweekworktime: 33,
                    email: "Filip.Dobro@gmail.com"
                },
                {
                    firstname: "Tomáš",
                    lastname: "Správně",
                    worktime: 40,
                    thisweekworktime: 45,
                    email: "\n" +
                        "Tomasspravne@fit.cvut.cz"
                },
            ],
        },
        {
            id: 4,
            title: 'Plne',
            start: new Date(new Date().setHours(new Date().getHours() + 30)),
            end: new Date(new Date().setHours(new Date().getHours() + 35)),
            capacity: 3,
            note: "",
            employees: [
                {
                    firstname: "Petr",
                    lastname: "Pitomec",
                    worktime: 20,
                    thisweekworktime: 15,
                    email: "Petr.Novakcic@gmail.com"
                },
                {
                    firstname: "Filip",
                    lastname: "Nechanic",
                    worktime: 30,
                    thisweekworktime: 33,
                    email: "Filip.Dobro@gmail.com"
                },
                {
                    firstname: "Tomáš",
                    lastname: "Správně",
                    worktime: 40,
                    thisweekworktime: 45,
                    email: "\n" +
                        "Tomasspravne@fit.cvut.cz"
                },
            ],
        },
    ]



export {events,rows};
