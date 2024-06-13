import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const paginationStyles = (theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = (e) => this.props.onChangePage(e, 0);
  handleBackButtonClick = (e) =>
    this.props.onChangePage(e, this.props.page - 1);
  handleNextButtonClick = (e) =>
    this.props.onChangePage(e, this.props.page + 1);
  handleLastPageButtonClick = (e) =>
    this.props.onChangePage(
      e,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;
    const lastPage = Math.ceil(count / rowsPerPage) - 1;
    return (
      <div className={classes.root}>
        <Tooltip title='První strana'>
          <span>
            <IconButton
              onClick={this.handleFirstPageButtonClick}
              disabled={page === 0}
              aria-label='První strana'
            >
              {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Předchozí strana'>
          <span>
            <IconButton
              onClick={this.handleBackButtonClick}
              disabled={page === 0}
              aria-label='Předchozí strana'
            >
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Další strana'>
          <span>
            <IconButton
              onClick={this.handleNextButtonClick}
              disabled={page >= lastPage}
              aria-label='Další strana'
            >
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Poslední strana'>
          <span>
            <IconButton
              onClick={this.handleLastPageButtonClick}
              disabled={page >= lastPage}
              aria-label='Poslední strana'
            >
              {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
          </span>
        </Tooltip>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(paginationStyles, { withTheme: true })(
  TablePaginationActions,
);
