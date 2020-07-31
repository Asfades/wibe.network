import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '@store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const {
      email,
      username,
      password
    } = form.form.value;

    this.isLoading = true;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({username: email, password}));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email, username, password}));
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

}
