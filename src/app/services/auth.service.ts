import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const { timesheet_server: URI } = environment;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(body: any) {
    return this.http.post(`${URI}/auth`, body);
  }
}
