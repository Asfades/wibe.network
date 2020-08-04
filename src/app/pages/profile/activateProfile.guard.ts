import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CanActivate,
  UrlTree,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
  CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotFoundService } from '../not-found/not-found.service';

const usersEndpoint = 'https://wibe-network.firebaseio.com/users';

@Injectable({providedIn: 'root'})
export class ActivateProfileGuard implements CanActivate {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private notFoundService: NotFoundService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    routerSnapshot: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const name = route.params.name;
    return this.httpClient.get(`${usersEndpoint}/${name}.json`, {
      params: {
        shallow: 'true'
      }
    })
      .pipe(map(res => {
        if (!!res) {
          return true;
        } else {
          this.notFoundService.setUsername(name);
          return this.router.createUrlTree(['/not-found']);
        }
      }));
  }
}
