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
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableHead from '@material-ui/core/TableHead';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

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

const TablePaginationActionsWrapped = withStyles(paginationStyles, {
  withTheme: true,
})(TablePaginationActions);

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

function RoleBadge({ type }) {
  const isManager = type === 'manager';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        background: isManager
          ? 'rgba(26,115,232,0.08)'
          : 'rgba(52,168,83,0.08)',
        color: isManager ? '#1A73E8' : '#34A853',
        border: isManager
          ? '1px solid rgba(26,115,232,0.2)'
          : '1px solid rgba(52,168,83,0.2)',
      }}
    >
      {isManager ? 'Vedoucí' : 'Zaměstnanec'}
    </span>
  );
}

function HoursBar({ contracted, scheduled }) {
  const pct =
    contracted > 0
      ? Math.min(100, Math.round((scheduled / contracted) * 100))
      : 0;
  const color = pct >= 100 ? '#EA4335' : pct >= 75 ? '#FBBC04' : '#34A853';
  return (
    <div style={{ minWidth: 70 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          marginBottom: 2,
        }}
      >
        <span style={{ color: '#0F172A', fontWeight: 600 }}>
          {contracted} h
        </span>
        {scheduled > 0 && (
          <span style={{ color: '#94A3B8', fontSize: '0.65rem' }}>
            {Math.round(scheduled)}h plán.
          </span>
        )}
      </div>
      <div
        style={{
          height: 4,
          borderRadius: 4,
          background: '#E2E8F0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 4,
            transition: 'width 0.3s',
          }}
        />
      </div>
    </div>
  );
}

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
                <TableRow key={row.id} hover>
                  {!compact && <TableCell numeric>{row.id}</TableCell>}
                  <TableCell>{row.firstname}</TableCell>
                  <TableCell>{row.lastname}</TableCell>
                  {!compact && (
                    <TableCell>
                      {row.type && <RoleBadge type={row.type} />}
                    </TableCell>
                  )}
                  <TableCell numeric>
                    <HoursBar
                      contracted={Number(row.worktime) || 0}
                      scheduled={scheduledHours[row.email] || 0}
                    />
                  </TableCell>
                  <TableCell
                    style={{
                      maxWidth: compact ? 160 : undefined,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.email}
                  </TableCell>
                  <TableCell className={classes.actionCell}>
                    {this.props.onEdit && (
                      <Tooltip title='Upravit uživatele'>
                        <IconButton
                          aria-label='Upravit uživatele'
                          color='primary'
                          onClick={() => this.props.onEdit(row.id)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title='Odstranit uživatele'>
                      <IconButton
                        aria-label='Odstranit uživatele'
                        className={classes.deleteButton}
                        onClick={() => this.props.onDelete(row.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
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
                  ActionsComponent={TablePaginationActionsWrapped}
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
