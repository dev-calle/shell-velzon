import { ActionReducerMap } from '@ngrx/store';
import { AuthState } from './redux/interfaces/auth.interface';
import { authReducer } from './redux/reducers/auth.reducer';

export interface AppState {
    auth: AuthState
};

export const appReducer: ActionReducerMap<AppState> = {
    auth: authReducer
};
