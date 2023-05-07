import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { addMenus, addRoles, logout } from 'src/app/redux/actions/auth.action';
import { MenuService } from '../services/menu.service';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  auth$?: Subscription;
  // menu$?: Subscription;

  constructor(
    private _menuService: MenuService,
    private _router: Router,
    private _store: Store<AppState>,
    private _authService: AuthService,
    private _storageService: LocalStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    return new Promise( (resolve) => {

      this.auth$?.unsubscribe();

      this.auth$ = this._menuService.getMenuValidUser()
      .subscribe( {
        next: (res) => {

          let url = state.url;

          const { data: { roles, menus } } = res;

          let arrUrl = url.split('/');

          let newUrl = arrUrl.join('/');

          if(arrUrl.length > 3) {
            newUrl = arrUrl.slice(0, 3).join('/');
          }

          if(!menus.includes(newUrl)) {
            this.logout();
          }

          this._store.dispatch(addRoles({ roles }));
          this._store.dispatch(addMenus({ menus }));

          this.auth$?.unsubscribe();
          return resolve(true);

        },
        error: () => {
          this.auth$?.unsubscribe();
          this.logout();
          return resolve(true);
        },
        complete: () => {
          this.auth$?.unsubscribe();
          return resolve(true);
        }
      })

    });
  }

  logout() {
    const rememberMe = this._authService.getRememberMe();
    const user = this._authService.getUserData();
    this._storageService.clear();
    if(rememberMe && user) {
      this._authService.setUserData(user);
      this._authService.setRememberMe(rememberMe);
    }
    this._store.dispatch(logout());
    this._router.navigate(['/auth']);
  }
}
