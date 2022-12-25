import { Injectable } from '@angular/core';

const USER_KEY = 'currentUser';

@Injectable({providedIn: 'root'})
export class StorageService {

  constructor() { }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

}
