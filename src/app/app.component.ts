import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from './store/app.reducer';
import * as AuthActions from './pages/auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wibe';

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
  }
}
