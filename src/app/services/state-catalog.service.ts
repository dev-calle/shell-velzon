import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IStatesCatalogRes } from '../interfaces/states-catalog.interface';
import { IItemStateCatalogRes } from '../interfaces/item-state-catalog.interface';

const { timesheet_server: URI } = environment;

@Injectable({
    providedIn: 'root'
})
export class StateCatalogService {

    constructor(private _http: HttpClient) { }

    getStatesCatalog(limit: string, page: string, filter: string, order: string) {
        let params = new HttpParams();
        params = params.set('limit', limit);
        params = params.set('page', page);
        params = params.set('filter', filter);
        params = params.set('order', order);
        return this._http.get<IStatesCatalogRes>(`${URI}/states-catalog`, { params });
    }

    addStateCatalog(body: any) {
        return this._http.post<any>(`${URI}/states-catalog`, body);
    }

    getStateCatalog(id: string) {
        return this._http.get<IItemStateCatalogRes>(`${URI}/states-catalog/${id}`);
    }

    editStateCatalog(id: string, body: any) {
        return this._http.patch<any>(`${URI}/states-catalog/${id}`, body);
    }

    deleteStateCatalog(id: string) {
        return this._http.delete<any>(`${URI}/states-catalog/${id}`);
    }
}
