// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { AuthService } from '../pages/auth/auth.service';
// import { take, switchMap, map } from 'rxjs/operators';
// import { Track } from '@entities/track.model';

// @Injectable({ providedIn: 'root' })
// export class DataService {
//   constructor(
//     private http: HttpClient,
//     private authService: AuthService
//   ) {}

//   fetchPlaylist() {
//     return this.authService.user.pipe(take(1), switchMap(user => {
//       return this.http.get<Track[]>(
//         'https://wibe-network.firebaseio.com/playlist.json'
//       );
//     }));
//   }
// }
