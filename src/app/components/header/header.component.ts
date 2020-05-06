import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

// import { DataService } from '@src/app/services/data.service';
import * as fromApp from '@store/app.reducer';
import * as AuthActions from '../../pages/auth/store/auth.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '@src/environments/environment';

const refreshTokenAPIURL = 'https://securetoken.googleapis.com/v1/token?key=' + environment.firebaseAPIKey;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    // private dataService: DataService,
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

  fetchData() {
    // this.dataService.fetchPlaylist().subscribe(data => {
    //   console.log(data);
    // });
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
  }

}
