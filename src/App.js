import logo from './logo.svg';
import './App.css';

import Main from './components/Main';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

let primary = process.env.REACT_APP_PALETTE_PRIMARY || '#b779ff';
let secondary = process.env.REACT_APP_PALETTE_SECONDARY || '#d6219c';

const theme = () => {
  return createTheme({
    palette: {
      type: 'light',
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      bodyBackground: {
        black: '#131415',
      },
      callBackground: {
        main: '#20262D',
      },
      toolbarBackground: {
        main: '#41464D',
      },
      activeButtons: {
        green: '#1C8731',
        red: '#D50F2C',
      },
    },
  });
};

function App() {
  return (
    <ThemeProvider theme={theme()}>
      <Router>
        <Switch>
          <Route path="/room/:roomName/">
            <div className="wrapper">
              <Main />
            </div>
          </Route>
          <Route path="*">
            <Redirect
              to={{
                pathname: '/room/test',
              }}
            />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
