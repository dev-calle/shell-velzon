import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { IActivityRes } from "../interfaces/activities.interface";
import { IAddActivityRes } from "../interfaces/add-activity.interface";
import { IItemActivityRes } from "../interfaces/item-activity.interface";

const { timesheet_server: URI } = environment;

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    
    constructor(private _http: HttpClient) { }

    getActivities(limit: string, page: string, filter: string, order: string) {
        let params = new HttpParams();
        params = params.set('limit', limit);
        params = params.set('page', page);
        params = params.set('filter', filter);
        params = params.set('order', order);
        return this._http.get<IActivityRes>(`${URI}/activity`, { params });
    }

    addActivity(body: any) {
        return this._http.post<IAddActivityRes>(`${URI}/activity`, body);
    }

    getActivity(id: string) {
        return this._http.get<IItemActivityRes>(`${URI}/activity/${id}`);
    }

    editActivity(id: string, body: any) {
        return this._http.patch<any>(`${URI}/activity/${id}`, body);
    }

    deleteActivity(id: string) {
        return this._http.delete<any>(`${URI}/activity/${id}`);
    }
}