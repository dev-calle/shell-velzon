import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { IClientRes } from "../interfaces/clients.interface";
import { IAddClientRes } from "../interfaces/add-client.interface";
import { IItemClientRes } from "../interfaces/item-client.interface";

const { timesheet_server: URI } = environment;

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    
    constructor(private _http: HttpClient) { }

    getClients(limit: string, page: string, filter: string, order: string) {
        let params = new HttpParams();
        params = params.set('limit', limit);
        params = params.set('page', page);
        params = params.set('filter', filter);
        params = params.set('order', order);
        return this._http.get<IClientRes>(`${URI}/client`, { params });
    }

    addClient(body: any) {
        return this._http.post<IAddClientRes>(`${URI}/client`, body);
    }

    getClient(id: string) {
        return this._http.get<IItemClientRes>(`${URI}/client/${id}`);
    }

    editClient(id: string, body: any) {
        return this._http.patch<any>(`${URI}/client/${id}`, body);
    }

    deleteClient(id: string) {
        return this._http.delete<any>(`${URI}/client/${id}`);
    }
}