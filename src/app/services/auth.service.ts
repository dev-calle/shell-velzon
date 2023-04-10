import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { STORAGE_TOKEN } from '../constants/storage.constants';
import { LocalStorageService } from './local-storage.service';
import { ILoginRes } from '../interfaces/login.interfaces';

const { timesheet_server: URI } = environment;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private storageService: LocalStorageService) { }

  login(body: any) {
    return this.http.post<ILoginRes>(`${URI}/auth`, body);
  }

  setToken(token: string) {
    this.storageService.setItem(STORAGE_TOKEN, token);
  }

  getToken() {
    return this.storageService.getItem<string>(STORAGE_TOKEN);
  }  

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
