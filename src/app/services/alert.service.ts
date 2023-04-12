import { Injectable } from "@angular/core";
import Swal, { SweetAlertOptions } from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    
    constructor() { }

    show(options: SweetAlertOptions) {
        return Swal.fire({
            ...options,
            confirmButtonColor: '#364574',
            position: 'top',
            width: '400px',
            showCloseButton: true
        })
    }
}