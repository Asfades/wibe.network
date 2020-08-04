import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '@store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponceData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  tokenExpirationTimer: any;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  setRefreshTimer(expirationDate: Date) { // ms
    this.clearRefreshTimer();
    const expirationDuration = expirationDate.getTime() - new Date().getTime();
    const enoughTimeBuffer = (expirationDuration - 300000) > 0; // less then 5 mins
    if (!enoughTimeBuffer) {
      this.store.dispatch(new AuthActions.RefreshSessionStart());
      return;
    }
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.RefreshSessionStart());
    }, expirationDuration);
  }

  clearRefreshTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
