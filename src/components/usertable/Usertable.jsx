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
import Tooltip from '@material-ui/core/Tooltip';
import TablePaginationActions from './TablePaginationActions';
import TableHead from '@material-ui/core/TableHead';

import UserRow from './UserRow';

const styles = (theme) => ({
  root: { width: '100%', marginTop: theme.spacing.unit * 2 },
  table: { minWidth: 500 },
  tableWrapper: { overflowX: 'auto' },
  headerCell: {
    backgroundColor: '#F8F9FA',
    color: '#5F6368',
    fontWeight: 600,
    fontSize: '0.75rem',
    letterSpacing: '0.02em',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid #DADCE0',
  },
  actionCell: { whiteSpace: 'nowrap', paddingRight: theme.spacing.unit },
  deleteButton: {
    color: theme.palette.error.main,
    '&:hover': { backgroundColor: 'rgba(244,67,54,0.08)' },
  },
});

// Subcomponents extracted into separate files: TablePaginationActions, UserRow, RoleBadge, HoursBar

class Usertable extends React.Component {
  state = { page: 0, rowsPerPage: this.props.initialRowsPerPage || 5 };

  handleChangePage = (event, page) => this.setState({ page });
  handleChangeRowsPerPage = (event) =>
    this.setState({ rowsPerPage: Number(event.target.value), page: 0 });

  render() {
    const { classes, scheduledHours = {}, compact = false } = this.props;
    const { rowsPerPage, page } = this.state;
    const rows = [...this.props.data].sort((a, b) => a.id - b.id);
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const pageRows = rows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
    const colSpan = compact ? 4 : 7;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            style={{ minWidth: compact ? 0 : 500 }}
          >
            <TableHead>
              <TableRow>
                {!compact && (
                  <TableCell className={classes.headerCell} numeric>
                    ID
                  </TableCell>
                )}
                <TableCell className={classes.headerCell}>Jméno</TableCell>
                <TableCell className={classes.headerCell}>Příjmení</TableCell>
                {!compact && (
                  <TableCell className={classes.headerCell}>Role</TableCell>
                )}
                <TableCell className={classes.headerCell} numeric>
                  Úvazek
                </TableCell>
                <TableCell className={classes.headerCell}>Email</TableCell>
                <TableCell className={classes.headerCell}>Akce</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((row) => (
                <UserRow
                  key={row.id}
                  row={row}
                  compact={compact}
                  scheduledHours={scheduledHours}
                  onEdit={this.props.onEdit}
                  onDelete={this.props.onDelete}
                  classes={classes}
                />
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={colSpan} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={colSpan}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  labelRowsPerPage='Řádků na stránce:'
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

Usertable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  scheduledHours: PropTypes.object,
  initialRowsPerPage: PropTypes.number,
  compact: PropTypes.bool,
};

export default withStyles(styles)(Usertable);
