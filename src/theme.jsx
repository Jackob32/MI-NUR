import {createMuiTheme,} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import 'typeface-roboto';

// A styles with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
    palette: {
        primary: purple,
        secondary: green,
    },
    typography: {
        useNextVariants: true,
    },
});

export default theme;
