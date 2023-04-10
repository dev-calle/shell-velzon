import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LoaderService } from './loader.service';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private _authService: AuthService, private _loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this._loaderService.show();
    const authToken = this._authService.getToken();
    let authRequest = request;
    if (authToken) {
      authRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + authToken)
      });
    }
    return next.handle(authRequest).pipe(
      catchError((error) => {
        this._loaderService.hide();
        throw error;
      }),
      finalize(() => {
        this._loaderService.hide();
      })
    );
  }
}
