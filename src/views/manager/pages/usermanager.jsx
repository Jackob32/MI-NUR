import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Title from '../../../components/title/Title';
import Usertable from '../../../components/usertable/Usertable';
import {rows} from '../../../data';

import withRoot from '../../../withRoot';
import styles from '../../../theme';

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});

class Usermanager extends React.Component {

    render() {
      return (

            <div>

                <Title title="Správa Uživatelů" />

<Usertable data={rows}/>

            </div>
        );
    }
}

Usermanager.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Usermanager);