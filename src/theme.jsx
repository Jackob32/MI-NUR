import { createMuiTheme } from '@material-ui/core/styles';
import 'typeface-roboto';

/* ── Google Material colour tokens ─────────────────────────────────────────── */
const G = {
  blue: '#1A73E8',
  blueDk: '#1557B0',
  blueLt: '#4285F4',
  green: '#34A853',
  greenDk: '#1E8E3E',
  red: '#EA4335',
  yellow: '#FBBC04',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  border: '#DADCE0',
  ink1: '#202124',
  ink2: '#5F6368',
  ink3: '#80868B',
};

const R = 8; /* global border-radius in px */

const theme = createMuiTheme({
  palette: {
    primary: {
      light: G.blueLt,
      main: G.blue,
      dark: G.blueDk,
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#57BB6A',
      main: G.green,
      dark: G.greenDk,
      contrastText: '#ffffff',
    },
    background: {
      default: G.bg,
      paper: G.surface,
    },
    text: {
      primary: G.ink1,
      secondary: G.ink2,
    },
    error: { main: G.red },
    divider: G.border,
  },
  typography: {
    useNextVariants: true,
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: R },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          background: G.bg,
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        '*': {
          fontFamily: 'inherit',
        },
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em',
        borderRadius: R,
        transition: 'background 0.15s, box-shadow 0.15s',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': { boxShadow: '0 1px 3px rgba(0,0,0,0.18)' },
        '&:active': { boxShadow: 'none' },
      },
      containedPrimary: {
        background: G.blue,
        '&:hover': { background: G.blueDk },
      },
      containedSecondary: {
        background: G.green,
        '&:hover': { background: G.greenDk },
      },
      outlined: {
        borderRadius: R,
        fontWeight: 600,
        borderColor: G.border,
        color: G.ink2,
        '&:hover': { borderColor: '#BDC1C6', background: G.bg },
      },
      outlinedPrimary: {
        borderColor: G.blue,
        color: G.blue,
        '&:hover': { background: 'rgba(26,115,232,0.06)', borderColor: G.blue },
      },
    },
    MuiAppBar: {
      root: { boxShadow: '0 1px 2px rgba(0,0,0,0.18)' },
      colorPrimary: { background: '#1C2333' },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        letterSpacing: '0.01em',
        fontSize: '0.85rem',
        minWidth: 'auto',
        '&$selected': { fontWeight: 700 },
      },
    },
    MuiTabs: {
      indicator: {
        height: 3,
        borderRadius: '3px 3px 0 0',
        backgroundColor: '#ffffff',
      },
    },
    MuiPaper: {
      rounded: { borderRadius: R },
      elevation1: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
      },
      elevation2: {
        boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
      },
      elevation12: {
        boxShadow: '0 8px 24px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.04)',
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: 12,
        boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
      },
    },
    MuiDialogTitle: {
      root: {
        paddingBottom: 4,
        '& h6': { fontWeight: 700, color: G.ink1, fontSize: '1.05rem' },
      },
    },
    MuiInput: {
      underline: {
        '&:after': { borderBottomColor: G.blue, borderBottomWidth: 2 },
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: R,
        '&$focused $notchedOutline': { borderColor: G.blue },
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: G.ink2,
        '&$focused': { color: G.blue },
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: '#3C4043',
        fontSize: '0.72rem',
        fontWeight: 500,
        borderRadius: 4,
        padding: '5px 10px',
      },
    },
    MuiCheckbox: {
      colorPrimary: { '&$checked': { color: G.blue } },
      colorSecondary: { '&$checked': { color: G.blue } },
    },
    MuiSwitch: {
      colorPrimary: { '&$checked': { color: G.blue } },
    },
    MuiAvatar: {
      colorDefault: {
        background: G.green,
        color: '#fff',
      },
    },
    MuiSnackbarContent: {
      root: { borderRadius: R, fontWeight: 500 },
    },
    MuiTableHead: {
      root: {},
    },
    MuiTableCell: {
      head: { fontWeight: 700 },
    },
    MuiSelect: {
      root: { borderRadius: R },
    },
    MuiChip: {
      root: { borderRadius: 999 },
    },
  },
});

export default theme;
