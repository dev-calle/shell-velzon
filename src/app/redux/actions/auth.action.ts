import { createAction, props } from '@ngrx/store';
import { User } from '../interfaces/auth.interface';

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string, user: User }>()
);

export const logout = createAction(
  '[Auth] Logout'
);
