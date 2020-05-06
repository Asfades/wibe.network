import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '@src/environments/environment';
import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

const signupAPIURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey;
const signinAPIURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey;
const refreshTokenAPIURL = 'https://securetoken.googleapis.com/v1/token?key=' + environment.firebaseAPIKey;

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

interface RefreshResponseData {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
}

interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

const handleAuthentication = (resData: AuthResponseData) => {
  const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
  const user = new User(
    resData.email,
    resData.localId,
    resData.idToken,
    expirationDate
  );
  localStorage.setItem('userData', JSON.stringify(user));
  localStorage.setItem('refreshToken', resData.refreshToken);

  return new AuthActions.AuthenticateSuccess({
    email: resData.email,
    userId: resData.localId,
    token: resData.idToken,
    expirationDate,
    redirect: true
  });
};

const handleError = (errorRes) => {
  let errorMessage = 'Unexpected error occured.';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'INVALID_EMAIL':
      errorMessage = 'Email is invalid.';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = `There is no account for given email address.`;
      break;
    case 'EMAIL_EXISTS':
      errorMessage = 'Email already exists.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Invalid password.';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

const handleIdTokenRefresh = (resData: RefreshResponseData) => {
  const userData: UserData = JSON.parse(localStorage.getItem('userData'));
  const expirationDate = new Date(new Date().getTime() + +resData.expires_in * 1000);
  const user = new User(
    userData.email,
    resData.user_id,
    resData.id_token,
    expirationDate
  );
  localStorage.setItem('userData', JSON.stringify(user));
  localStorage.setItem('refreshToken', resData.refresh_token);

  return new AuthActions.AuthenticateSuccess({
    email: userData.email,
    userId: resData.user_id,
    token: resData.id_token,
    expirationDate,
    redirect: false
  });
};

const handleIdTokenRefreshError = (errorRes) => {
  let errorMessage = 'Unexpected error occured.';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'TOKEN_EXPIRED':
      errorMessage = 'The user\'s credential is no longer valid.';
      break;
    case 'USER_DISABLED':
      errorMessage = 'The user account has been disabled by an administrator.';
      break;
    case 'USER_NOT_FOUND':
      errorMessage = 'The user corresponding to the refresh token was not found.';
      break;
    case 'INVALID_REFRESH_TOKEN':
      errorMessage = 'An invalid refresh token is provided.';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(signupAPIURL, {
        email: signupAction.payload.email,
        password: signupAction.payload.password,
        returnSecureToken: true
      }).pipe(
        tap(resData => {
          this.authService.setRefreshTimer(+resData.expiresIn * 1000);
        }),
        map(resData => {
          return handleAuthentication(resData);
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(signinAPIURL, {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(
        tap(resData => {
          this.authService.setRefreshTimer(+resData.expiresIn * 1000);
        }),
        map(resData => {
          return handleAuthentication(resData);
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authRedrectAction: AuthActions.AuthenticateSuccess) => {
      if (authRedrectAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: UserData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData._token) {
        return { type: 'DUMMY' };
      }

      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.authService.setRefreshTimer(expirationDuration);
      return new AuthActions.AuthenticateSuccess({
        email: userData.email,
        userId: userData.id,
        token: userData._token,
        expirationDate: new Date(userData._tokenExpirationDate),
        redirect: false
      });
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearRefreshTimer();
      localStorage.removeItem('userData');
      localStorage.removeItem('refreshToken');
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  refreshAuthSession = this.actions$.pipe(
    ofType(AuthActions.REFRESH_SESSION_START),
    switchMap(() => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return of({ type: 'DUMMY' });
      }
      return this.http.post<RefreshResponseData>(refreshTokenAPIURL,
        `grant_type=refresh_token&refresh_token=${refreshToken}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      ).pipe(
        tap(resData => {
          this.authService.setRefreshTimer(+resData.expires_in * 1000);
        }),
        map(resData => {
          return handleIdTokenRefresh(resData);
        }),
        catchError(err => {
          return handleIdTokenRefreshError(err);
        })
      );
    })
  );
}
