import React from 'react';
import 'typeface-roboto';
import { emphasize, fade } from '@material-ui/core/styles/colorManipulator';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: { marginTop: 16 },
  menu: { width: 200 },

  root: {
    flexGrow: 1,
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  pageRoot: {
    paddingTop: theme.spacing.unit * 2.5,
    paddingBottom: theme.spacing.unit * 3,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    minHeight: '100vh',
  },

  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  grow: { flexGrow: 1 },
  growlittle: { flexGrow: 0.3 },

  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: { display: 'block' },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': { backgroundColor: fade(theme.palette.common.white, 0.25) },
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
  inputRoot: { color: 'inherit', width: '100%' },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': { width: 200 },
    },
  },

  formControl: { padding: theme.spacing.unit * 2 },

  avatar: {
    fontSize: '70%',
    width: 26,
    height: 26,
    marginTop: -3,
    fontWeight: 700,
  },
  greenAvatar: {
    fontSize: '68%',
    width: 26,
    height: 26,
    marginTop: -3,
    fontWeight: 700,
    color: '#fff',
    backgroundColor: '#059669',
    boxShadow: '0 1px 3px rgba(5,150,105,0.4)',
  },
  orangeAvatar: {
    fontSize: '68%',
    width: 26,
    height: 26,
    marginTop: -3,
    fontWeight: 700,
    color: '#fff',
    backgroundColor: '#D97706',
    boxShadow: '0 1px 3px rgba(217,119,6,0.4)',
  },
  redAvatar: {
    fontSize: '68%',
    width: 26,
    height: 26,
    marginTop: -3,
    fontWeight: 700,
    color: '#fff',
    backgroundColor: '#DC2626',
    boxShadow: '0 1px 3px rgba(220,38,38,0.4)',
  },
  bigAvatar: { width: 60, height: 60 },

  input: { display: 'flex', padding: 0 },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: { fontSize: 16 },
  placeholder: { position: 'absolute', left: 2, fontSize: 16 },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: { height: theme.spacing.unit * 2 },
});

export default styles;
