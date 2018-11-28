import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import {fade} from '@material-ui/core/styles/colorManipulator';
import Badge from '@material-ui/core/Badge';

import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';


function TabContainer({children, dir}) {
    return (
        <Typography component="div" dir={dir} style={{padding: 8 * 3}}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {

        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
});

class Navigation extends React.Component {

    state = {
        value: 0,
    };
    handleProfileMenuOpen = event => {
        this.setState({anchorEl: event.currentTarget});
    };
    handleMobileMenuOpen = event => {
        this.setState({mobileMoreAnchorEl: event.currentTarget});
    };
    handleChange = (event, value) => {
        this.setState({value});
    };

    constructor(props) {
        super(props);

        if (this.props.bell === true) this.bell = true;

    };

    render() {
        const {classes} = this.props;
        const {anchorEl} = this.state;
        const isMenuOpen = Boolean(anchorEl);

        return (
            <div className={classes.root}>

                <Grid container spacing={8}>
                    <Grid item xs={12} sm={6} align={"left"}>

                        <Typography variant="subtitle1">
                            Jste přihlášen jako : {this.props.data.login.firstname}
                            {" "}
                            {this.props.data.login.lastname}
                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6} align={"right"}>


                        <Button href="#text-buttons" component={Link} to={this.props.data.logout}
                                className={classes.button}>
                            Odhlásit se
                        </Button>

                        {false &&
                        <Button href="#text-buttons" component={Link} to={this.props.data.switch}
                                className={classes.button}>
                            Prepnout roli
                        </Button>
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <AppBar position="static" color="default">

                            <Toolbar>

                                <Tabs
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered
                                >
                                    {this.props.data.tabs.map(i =>
                                        <Tab value={i.value} label={i.label} key={i.value} component={Link} to={i.to}/>
                                    )}
                                </Tabs>

                                <div className={classes.grow}/>

                                <div className={classes.sectionDesktop}>

                                    {this.bell && false &&
                                    <div>

                                        <IconButton color="inherit">
                                            <Badge badgeContent={4} color="secondary">
                                                <MailIcon/>
                                            </Badge>
                                        </IconButton>

                                        <IconButton color="inherit">
                                            <Badge badgeContent={17} color="secondary">
                                                <NotificationsIcon/>
                                            </Badge>
                                        </IconButton>
                                        {false &&
                                        <IconButton
                                            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                            aria-haspopup="true"
                                            onClick={this.handleProfileMenuOpen}
                                            color="inherit"
                                        >
                                            <AccountCircle/>
                                        </IconButton>
                                        }
                                    </div>}
                                </div>
                                <div className={classes.sectionMobile}>
                                    <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen}
                                                color="inherit">
                                        <MoreIcon/>
                                    </IconButton>

                                </div>

                            </Toolbar>
                        </AppBar>

                    </Grid>
                </Grid>
            </div>
        );
    }
}

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Navigation);