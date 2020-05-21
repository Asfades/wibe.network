import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from '@store/app.reducer';
import * as AuthActions from '../../pages/auth/store/auth.actions';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private store: Store<fromApp.AppState>,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.store.select('auth')
    .pipe(
      map(authState => authState.user)
    ).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  test() {
    this.http.get('https://wibe-network.firebaseio.com/playlist.json', {
      params: new HttpParams().set('shallow', 'true')
    }).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    });
    // this.http.put('https://wibe-network.firebaseio.com/playlist/4/altName.json', '"sshhantaram"', {
    //   headers: {
    //     // 'X-Firebase-ETag': 'true',
    //     'if-match': 'fJtJsEdIBMBt7lZ79zYNQFG1NfI='
    //   },
    //   observe: 'response'
    // }).subscribe(res => {
    //   console.log(res);
    //   console.log(res.headers.get('ETag'));
    // }, error => {
    //   console.log(error.headers.get('ETag'));
    // });
    // this.http.patch('https://wibe-network.firebaseio.com/playlist.json', JSON.stringify({
    //   '0/play-count': 45,
    //   '4/playcount': 2
    // })).subscribe(res => {
    //   console.log(res);
    // });
  }
}
