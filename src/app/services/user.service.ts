import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUserRes } from '../interfaces/users.interface';

const { timesheet_server: URI } = environment;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  getUsers(limit: string, page: string, filter: string) {
    let params = new HttpParams();
    params = params.set('limit', limit);
    params = params.set('page', page);
    params = params.set('filter', filter);
    return this._http.get<IUserRes>(`${URI}/user`, { params });
  }
}
