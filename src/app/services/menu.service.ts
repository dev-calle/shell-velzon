import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAddUserRes } from '../interfaces/add-user.interface';
import { IItemRoleRes } from '../interfaces/item-role.interface';
import { IMenuRes } from '../interfaces/menus.interface';
import { IItemMenuRes } from '../interfaces/item-menu.interface';
import { IMenuValidRes } from '../interfaces/menu-valid.interface';

const { timesheet_server: URI } = environment;

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    constructor(private _http: HttpClient) { }

    getMenus(limit: string, page: string, filter: string, order: string) {
        let params = new HttpParams();
        params = params.set('limit', limit);
        params = params.set('page', page);
        params = params.set('filter', filter);
        params = params.set('order', order);
        return this._http.get<IMenuRes>(`${URI}/menu`, { params });
    }

    addMenu(body: any) {
        return this._http.post<IAddUserRes>(`${URI}/menu`, body);
    }

    getMenu(id: string) {
        return this._http.get<IItemMenuRes>(`${URI}/menu/${id}`);
    }

    editMenu(id: string, body: any) {
        return this._http.patch<any>(`${URI}/menu/${id}`, body);
    }

    deleteMenu(id: string) {
        return this._http.delete<any>(`${URI}/menu/${id}`);
    }

    getMenuValidUser() {
        return this._http.get<IMenuValidRes>(`${URI}/menu/valid/user`);
    }
}
