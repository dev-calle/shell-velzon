import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private _authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const authToken = this._authService.getToken();
    if (authToken) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + authToken)
      });
      return next.handle(authRequest);
    } else {
      return next.handle(request);
    }
  }
}
