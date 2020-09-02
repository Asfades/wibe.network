import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from '@store/app.reducer';
import * as AuthActions from '../../pages/auth/store/auth.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  $username: Observable<string>;
  profileMenuOpened = false;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.$username = this.store.select('auth').pipe(
      map(auth => auth.user && auth.user.username || '')
    );
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  toggleProfileMenu() {
    this.profileMenuOpened = !this.profileMenuOpened;
  }
}
