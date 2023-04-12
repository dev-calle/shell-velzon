import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { STORAGE_REMEMBER_ME, STORAGE_TOKEN, STORAGE_USER_DATA } from '../constants/storage.constants';
import { LocalStorageService } from './local-storage.service';
import { ILoginRes } from '../interfaces/login.interfaces';
import { User } from '../redux/interfaces/auth.interface';

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

  setUserData(user: User) {
    this.storageService.setItem(STORAGE_USER_DATA, user);
  }

  getUserData() {
    return this.storageService.getItem<User>(STORAGE_USER_DATA);
  }  

  setRememberMe(token: string) {
    this.storageService.setItem(STORAGE_REMEMBER_ME, token);
  }

  getRememberMe() {
    return this.storageService.getItem<string>(STORAGE_REMEMBER_ME);
  }  

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
