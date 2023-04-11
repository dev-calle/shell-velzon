import { Component, OnInit } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { AuthService } from './services/auth.service';
import { AuthState } from './redux/interfaces/auth.interface';
import { Store } from '@ngrx/store';
import { loginSuccess } from './redux/actions/auth.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading$ = this._loaderService.loading$;

  constructor(
    private _loaderService: LoaderService, 
    private _authService: AuthService,
    private _store: Store<AuthState>
  ) {}

  ngOnInit(): void {
    this.loadDataStorage();
  }

  loadDataStorage() {
    const token = this._authService.getToken();
    const user = this._authService.getUserData();
    if(token && user) {
      this._store.dispatch(loginSuccess({ token, user }));
    }
  }

  showLoader() {
    this._loaderService.show();
  }

  hideLoader() {
    this._loaderService.hide();
  }
}
