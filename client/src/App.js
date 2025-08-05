import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AuthState from './context/auth/AuthState';
import ExamState from './context/exam/ExamState';
import AlertState from './context/alert/AlertState';
import PrivateRoute from './components/routing/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Alerts from './components/layout/Alerts';
import Navbar from './components/layout/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthState>
        <ExamState>
          <AlertState>
            <Router>
              <Navbar />
              <Alerts />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute component={Dashboard} />} />
              </Routes>
            </Router>
          </AlertState>
        </ExamState>
      </AuthState>
    </ThemeProvider>
  );
}

export default App;