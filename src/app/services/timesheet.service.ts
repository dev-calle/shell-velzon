import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ITimeSheetRes } from '../interfaces/timesheets.interface';
import { IItemTimesheetRes } from '../interfaces/item-timesheet.interface';

const { timesheet_server: URI } = environment;

@Injectable({
    providedIn: 'root'
})
export class TimesheetService {

    constructor(private _http: HttpClient) { }

    getTimesheets(limit: string, page: string, filter: string, order: string) {
        let params = new HttpParams();
        params = params.set('limit', limit);
        params = params.set('page', page);
        params = params.set('filter', filter);
        params = params.set('order', order);
        return this._http.get<ITimeSheetRes>(`${URI}/timesheet`, { params });
    }

    addTimesheet(body: any) {
        return this._http.post<any>(`${URI}/timesheet`, body);
    }

    getTimesheet(id: string) {
        return this._http.get<IItemTimesheetRes>(`${URI}/timesheet/${id}`);
    }

    editTimesheet(id: string, body: any) {
        return this._http.patch<any>(`${URI}/timesheet/${id}`, body);
    }

    deleteTimesheet(id: string) {
        return this._http.delete<any>(`${URI}/timesheet/${id}`);
    }
}
