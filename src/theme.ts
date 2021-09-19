import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: '#e2467a',
        },
        secondary: {
            main: '#29b6f6',
        },
        background: {
            paper: '#303030',
            default: '#212121',
        },
        info: {
            main: '#2196f3',
        },
    },
};

const theme = createTheme(themeOptions)

export default theme
