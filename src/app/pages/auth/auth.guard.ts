import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '@store/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
     return this.store.select('auth').pipe(
       take(1),
       map(authState => authState.user),
       map(user => {
         const isAuth = !!user;
         if (isAuth) {
           return true;
         }
         return this.router.createUrlTree(['/auth']);
       })
     );
  }

}

@Injectable({providedIn: 'root'})
export class AlreadySignedGuard implements CanActivate {
  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
     return this.store.select('auth').pipe(
       take(1),
       map(authState => authState.user),
       map(user => {
         return !user || this.router.createUrlTree(['/home']);
       })
     );
  }

}
