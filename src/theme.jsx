import React from 'react';
import 'typeface-roboto';
import { fade } from '@material-ui/core/styles/colorManipulator';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';

const styles = theme => ({

    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        width: 200,
    },
    root: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit,
fontFamily:"Roboto",
            display: 'center',

    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    grow: {
        flexGrow: 1,
    },

    growlittle: {
        flexGrow: 0.3,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },

    formControl: {

        padding: theme.spacing.unit * 2,

    },
    avatar: {
        fontSize: '75%',
        width: 25,
        marginTop: -4,
        height: 25,
    },

    greenAvatar: {
        fontSize: '75%',
        width: 25,
        marginTop: -4,
        height: 25,
        color: '#fff',
        backgroundColor: green[500],
    },
    orangeAvatar: {
        fontSize: '75%',
        width: 25,
        marginTop: -4,
        height: 25,
        color: '#fff',
        backgroundColor: orange[500],
    },
    redAvatar: {
        fontSize: '75%',
        width: 25,
        marginTop: -4,
        height: 25,
        color: '#fff',
        backgroundColor: red[500],
    },
        bigAvatar: {
        width: 60,
        height: 60,
    },

});

export default styles;
