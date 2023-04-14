import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUserRes } from '../interfaces/users.interface';
import { IAddUserRes } from '../interfaces/add-user.interface';
import { IItemUserRes } from '../interfaces/item-user.interface';

const { timesheet_server: URI } = environment;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  getUsers(limit: string, page: string, filter: string, order: string) {
    let params = new HttpParams();
    params = params.set('limit', limit);
    params = params.set('page', page);
    params = params.set('filter', filter);
    params = params.set('order', order);
    return this._http.get<IUserRes>(`${URI}/user`, { params });
  }

  addUser(body: any) {
    return this._http.post<IAddUserRes>(`${URI}/user`, body);
  }

  getUser(id: string) {
    return this._http.get<IItemUserRes>(`${URI}/user/${id}`);
  }

  editUser(id: string, body: any) {
    return this._http.patch<IAddUserRes>(`${URI}/user/${id}`, body);
  }

  deleteUser(id: string) {
    return this._http.delete<any>(`${URI}/user/${id}`);
  }
}
