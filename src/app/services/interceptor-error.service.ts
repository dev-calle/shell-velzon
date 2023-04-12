import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2'
import { ErrorHttp } from '../constants/error.constan';

@Injectable()
export class InterceptorError implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const { error: errorApi } = error;
        const status = parseInt(error.status.toString());
        this.showModalError(errorApi?.apiMensaje ?? this.getMessageError(status));
        return throwError(error);
      })
    );
  }

  showModalError(text: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: text,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#364574',
      position: 'top',
      width: '400px',
      showCloseButton: true
    })
  }

  getMessageError(status: number) {
    return ErrorHttp[status as keyof typeof ErrorHttp ]
  }
}
