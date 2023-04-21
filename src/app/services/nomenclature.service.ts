import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { INomenclatureRes } from '../interfaces/nomenclatures.interface';
import { IItemNomenclatureRes } from '../interfaces/item-nomenclature.interface';

const { timesheet_server: URI } = environment;

@Injectable({
    providedIn: 'root'
})
export class NomenclatureService {

    constructor(private _http: HttpClient) { }

    getNomenclatures(limit: string, page: string, filter: string, order: string) {
        let params = new HttpParams();
        params = params.set('limit', limit);
        params = params.set('page', page);
        params = params.set('filter', filter);
        params = params.set('order', order);
        return this._http.get<INomenclatureRes>(`${URI}/nomenclature`, { params });
    }

    addNomenclature(body: any) {
        return this._http.post<any>(`${URI}/nomenclature`, body);
    }

    getNomenclature(id: string) {
        return this._http.get<IItemNomenclatureRes>(`${URI}/nomenclature/${id}`);
    }

    editNomenclature(id: string, body: any) {
        return this._http.patch<any>(`${URI}/nomenclature/${id}`, body);
    }

    deleteNomenclature(id: string) {
        return this._http.delete<any>(`${URI}/nomenclature/${id}`);
    }
}
