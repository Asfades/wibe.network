import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class NotFoundService {
  private _username = '';

  public setUsername(name: string) {
    this._username = name;
  }

  public get username() {
    return this._username;
  }
}
