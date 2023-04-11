import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../interfaces/auth.interface';
import { loginSuccess, logout } from '../actions/auth.action';

export const initialState: AuthState = {
  token: null,
  user: null
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user
  })),
  on(logout, () => initialState)
);
