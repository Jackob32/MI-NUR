import React from 'react';
import {create} from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {createGenerateClassName, jssPreset, MuiThemeProvider,} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './theme';
import 'typeface-roboto';

// Create a JSS instance with the default preset of plugins.
// It's optional.
const jss = create(jssPreset());

// The standard class name generator.
// It's optional.
const generateClassName = createGenerateClassName();

function withRoot(Component) {
    function WithRoot(props) {
        // JssProvider allows customizing the JSS styling solution.
        return (
            <JssProvider jss={jss} generateClassName={generateClassName}>
                {/* MuiThemeProvider makes the styles available down the React tree
          thanks to React context. */}
                <MuiThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline/>
                    <Component {...props} />
                </MuiThemeProvider>
            </JssProvider>
        );
    }

    return WithRoot;
}

export default withRoot;
