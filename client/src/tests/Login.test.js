import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Login from '../components/auth/Login';

const mockStore = configureStore([thunk]);

describe('Login Component', () => {
  let store;
  let component;

  beforeEach(() => {
    store = mockStore({
      auth: { isAuthenticated: false },
      alert: []
    });

    component = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
  });

  test('Renders login form', () => {
    expect(component.getByLabelText('Email Address')).toBeInTheDocument();
    expect(component.getByLabelText('Password')).toBeInTheDocument();
    expect(component.getByText('Sign In')).toBeInTheDocument();
  });

  test('Submits login form', async () => {
    fireEvent.change(component.getByLabelText('Email Address'), {
      target: { value: 'teacher@test.com' }
    });
    fireEvent.change(component.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(component.getByText('Sign In'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual('LOGIN_REQUEST');
    });
  });
});