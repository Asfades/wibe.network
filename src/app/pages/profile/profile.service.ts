import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const usersEndpoint = 'http://localhost:3000/users';
const avatarsEndpoint = 'http://localhost:3000/users/avatars';

export interface ProfileData {
  avatar: string;
}

@Injectable({providedIn: 'root'})
export class ProfileService {
  profileData = new BehaviorSubject<ProfileData>(null);

  constructor(
    private http: HttpClient
  ) {}

  getUser(name: string) {
    return this.http.get<ProfileData>(`${usersEndpoint}/${name}`).pipe(
      map(profile => {
        return {
          avatar: `${avatarsEndpoint}/${profile.avatar}`
        };
      }),
      tap(profile => {
        this.profileData.next(profile);
      })
    );
  }
}
