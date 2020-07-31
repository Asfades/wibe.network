import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams, HttpHeaders } from '@angular/common/http';
import { exhaustMap, take, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import * as fromApp from '@store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      exhaustMap((user: User) => {
        if (!user || !user.accessToken) {
          return next.handle(req);
        }
        // const params = new HttpParams()
        //                       .append('auth', user.accessToken);
                              // .append('shallow', req.params.get('shallow'));
        const headers = new HttpHeaders({
          Authorization: `Bearer ${user.accessToken}`
        });
        const modifiedReq = req.clone({ headers });
        return next.handle(modifiedReq);
      })
    );
  }
}
