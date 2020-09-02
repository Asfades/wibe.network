import { Injectable } from '@angular/core';
import {
  CanActivate,
  UrlTree,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotFoundService } from '../not-found/not-found.service';
import { ProfileService } from './profile.service';

@Injectable({providedIn: 'root'})
export class ActivateProfileGuard implements CanActivate {
  constructor(
    private router: Router,
    private notFoundService: NotFoundService,
    private profileService: ProfileService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    routerSnapshot: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const name = route.params.name;
    return this.profileService.getUser(name)
      .pipe(map(res => {
        if (res) {
          return true;
        } else {
          this.notFoundService.setUsername(name);
          return this.router.createUrlTree(['/not-found']);
        }
      }));
  }
}
