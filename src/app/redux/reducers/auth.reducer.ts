import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../interfaces/auth.interface';
import { addMenus, addRoles, loginSuccess, logout } from '../actions/auth.action';

export const initialState: AuthState = {
  token: null,
  user: null,
  menus: [],
  roles: []
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user
  })),
  on(logout, () => initialState),
  on(addRoles, (state, { roles }) => ({
    ...state,
    roles
  })),
  on(addMenus, (state, { menus }) => ({
    ...state,
    menus
  })) 
);
