import React from 'react';
import PropTypes from 'prop-types';
import Cal from '../../../components/calendar/Calendar';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../../withRoot';
import styles from '../../../styles';
import Autocomplete from '../../../components/autocomplete/Autocomplete';
import { UserOptions } from '../../../data';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';
import { loadSettings } from '../../../storage';

class Home extends React.Component {
  state = {
    freeshifts: true,
    partialshifts: true,
    fullshifts: true,
    searchEmployee: '',
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleSearchChange = (value) => {
    const email =
      value && value.value && value.value.email ? value.value.email : '';
    this.setState({ searchEmployee: email });
  };

  render() {
    const { classes } = this.props;
    const { freeshifts, partialshifts, fullshifts } = this.state;
    const noneSelected = ![freeshifts, partialshifts, fullshifts].some(Boolean);
    const interestMode = loadSettings('manager_global', {
      interestMode: false,
    }).interestMode;

    return (
      <div className={classes.pageRoot}>
        <Paper style={{ padding: '16px 24px', marginBottom: 16 }} elevation={1}>
          <Grid container spacing={16} alignItems='center'>
            <Grid item xs={12} sm={6}>
              <Typography
                variant='subtitle2'
                color='textSecondary'
                gutterBottom
              >
                Filtrovat směny
              </Typography>
              {noneSelected && (
                <Typography variant='caption' color='error'>
                  Vyberte nejméně jednu kategorii
                </Typography>
              )}
              <FormControl component='fieldset'>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={freeshifts}
                        onChange={this.handleChange('freeshifts')}
                        value='freeshifts'
                      />
                    }
                    label={
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 3,
                            backgroundColor: red[500],
                            display: 'inline-block',
                            flexShrink: 0,
                          }}
                        />
                        Volné směny
                      </span>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={partialshifts}
                        onChange={this.handleChange('partialshifts')}
                        value='partialshifts'
                      />
                    }
                    label={
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 3,
                            backgroundColor: orange[500],
                            display: 'inline-block',
                            flexShrink: 0,
                          }}
                        />
                        Částečně obsazené
                      </span>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={fullshifts}
                        onChange={this.handleChange('fullshifts')}
                        value='fullshifts'
                      />
                    }
                    label={
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 3,
                            backgroundColor: green[500],
                            display: 'inline-block',
                            flexShrink: 0,
                          }}
                        />
                        Plně obsazené
                      </span>
                    }
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={1}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Divider orientation='vertical' style={{ height: 60 }} />
            </Grid>

            <Grid item xs={12} sm={5}>
              <Typography
                variant='subtitle2'
                color='textSecondary'
                gutterBottom
              >
                Hledat zaměstnance
              </Typography>
              <Autocomplete
                onChange={this.handleSearchChange}
                onSubmit={this.handleSearchChange}
                id='manager-employee-search'
                label='Hledat zaměstnance'
                options={UserOptions}
              />
            </Grid>
          </Grid>
        </Paper>

        <Cal
          freeshifts={this.state.freeshifts}
          partialshifts={this.state.partialshifts}
          fullshifts={this.state.fullshifts}
          searchEmployee={this.state.searchEmployee}
          auth='manager'
          interestMode={interestMode}
        />
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Home));
