import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import RoleBadge from './RoleBadge';
import HoursBar from './HoursBar';

export default function UserRow({
  row,
  compact,
  scheduledHours,
  onEdit,
  onDelete,
  classes,
}) {
  return (
    <TableRow key={row.id} hover>
      {!compact && <TableCell numeric>{row.id}</TableCell>}
      <TableCell>{row.firstname}</TableCell>
      <TableCell>{row.lastname}</TableCell>
      {!compact && (
        <TableCell>{row.type && <RoleBadge type={row.type} />}</TableCell>
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
        {onEdit && (
          <Tooltip title='Upravit uživatele'>
            <IconButton
              aria-label='Upravit uživatele'
              color='primary'
              onClick={() => onEdit(row.id)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title='Odstranit uživatele'>
          <IconButton
            aria-label='Odstranit uživatele'
            className={classes.deleteButton}
            onClick={() => onDelete(row.id)}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
