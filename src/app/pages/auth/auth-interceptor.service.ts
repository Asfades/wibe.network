import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
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
        if (!user) {
          return next.handle(req);
        }
        const params = new HttpParams()
                              .append('auth', user.token)
                              .append('shallow', req.params.get('shallow'));
        const modifiedReq = req.clone({ params });
        return next.handle(modifiedReq);
      })
    );
  }
}
