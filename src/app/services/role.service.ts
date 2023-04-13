import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAddUserRes } from '../interfaces/add-user.interface';
import { IRoleRes } from '../interfaces/roles.interface';
import { IItemRoleRes } from '../interfaces/item-role.interface';

const { timesheet_server: URI } = environment;

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    constructor(private _http: HttpClient) { }

    getRoles(limit: string, page: string, filter: string) {
        let params = new HttpParams();
        params = params.set('limit', limit);
        params = params.set('page', page);
        params = params.set('filter', filter);
        return this._http.get<IRoleRes>(`${URI}/role`, { params });
    }

    addRole(body: any) {
        return this._http.post<IAddUserRes>(`${URI}/role`, body);
    }

    getRole(id: string) {
        return this._http.get<IItemRoleRes>(`${URI}/role/${id}`);
    }

    editRole(id: string, body: any) {
        return this._http.patch<any>(`${URI}/role/${id}`, body);
    }

    deleteRole(id: string) {
        return this._http.delete<any>(`${URI}/role/${id}`);
    }
}
