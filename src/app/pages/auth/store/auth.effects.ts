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

const signupAPIURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebase.apiKey;
const signinAPIURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebase.apiKey;
const refreshTokenAPIURL = 'http://localhost:3000/auth/refresh-access-token';

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
      return this.http.post<AuthResponseData>('http://localhost:3000/auth/signup', {
        email: signupAction.payload.email,
        username: signupAction.payload.username,
        password: signupAction.payload.password,
      }).pipe(
        tap((resData) => this.authService.setRefreshTimer(new Date(resData.expirationDate))),
        map(resData => handleAuthentication(resData)),
        catchError(errorRes => handleError(errorRes))
      );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((signinAction: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>('http://localhost:3000/auth/signin', {
        username: signinAction.payload.username,
        password: signinAction.payload.password,
      }).pipe(
        tap(resData => this.authService.setRefreshTimer(new Date(resData.expirationDate))),
        map(resData =>  handleAuthentication(resData)),
        catchError(errorRes => handleError(errorRes))
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
      if (!userData) {
        return { type: 'DUMMY' };
      } else if (!userData._accessToken || new Date(userData._tokenExpirationDate) < new Date()) {
        return new AuthActions.RefreshSessionStart();
      }

      this.authService.setRefreshTimer(new Date(userData._tokenExpirationDate));
      return new AuthActions.AuthenticateSuccess({
        username: userData.username,
        refreshToken: userData.refreshToken,
        accessToken: userData._accessToken,
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
      const userData: UserData = JSON.parse(localStorage.getItem('userData'));
      if (!userData.refreshToken) {
        return of({ type: 'DUMMY' });
      }

      return this.http.post<RefreshResponseData>(refreshTokenAPIURL,
        {
          username: userData.username,
          refreshToken: userData.refreshToken
        }
      ).pipe(
        tap(resData => {
          this.authService.setRefreshTimer(new Date(resData.expirationDate));
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

export interface AuthResponseData {
  username: string;
  accessToken: string;
  expirationDate: string;
  refreshToken: string;
}

interface RefreshResponseData {
  username: string;
  accessToken: string;
  expirationDate: string;
  refreshToken: string;
}

interface UserData {
  username: string;
  refreshToken: string;
  _accessToken: string;
  _tokenExpirationDate: string;
}

function handleAuthentication(resData: AuthResponseData) {
  const expirationDate = new Date(resData.expirationDate);
  const user = new User(
    resData.username,
    resData.refreshToken,
    resData.accessToken,
    expirationDate,
  );
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({
    username: resData.username,
    refreshToken: resData.refreshToken,
    accessToken: resData.accessToken,
    expirationDate,
    redirect: true
  });
}

function handleError(errorRes) {
  let errorMessage = 'Unexpected error occured.';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  errorMessage = errorRes.error.message;
  // switch (errorRes.error.error.message) {
  //   case 'INVALID_EMAIL':
  //     errorMessage = 'Email is invalid.';
  //     break;
  //   case 'EMAIL_NOT_FOUND':
  //     errorMessage = `There is no account for given email address.`;
  //     break;
  //   case 'EMAIL_EXISTS':
  //     errorMessage = 'Email already exists.';
  //     break;
  //   case 'INVALID_PASSWORD':
  //     errorMessage = 'Invalid password.';
  //     break;
  // }
  return of(new AuthActions.AuthenticateFail(errorMessage));
}

function handleIdTokenRefresh(resData: RefreshResponseData) {
  const expirationDate = new Date(resData.expirationDate);
  const user = new User(
    resData.username,
    resData.refreshToken,
    resData.accessToken,
    expirationDate
  );
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({
    username: resData.username,
    refreshToken: resData.refreshToken,
    accessToken: resData.accessToken,
    expirationDate: new Date(),
    redirect: false
  });
}

function handleIdTokenRefreshError(errorRes) {
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
}
