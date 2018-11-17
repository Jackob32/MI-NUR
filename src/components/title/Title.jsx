import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import styles from '../../styles';

class Title extends React.Component {
       render() {
        return (
                <Grid container spacing={16}>
                    <Grid item xs={8} sm={4}>
                        <Typography variant="h4" gutterBottom>
                            {this.props.title}
                        </Typography>
                    </Grid>
                </Grid>
        );
    }
}

Title.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Title));
