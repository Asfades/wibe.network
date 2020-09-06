import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const usersEndpoint = 'http://localhost:3000/users';
const avatarsEndpoint = 'http://localhost:3000/users/avatars';
const backgroundsEndpoint = 'http://localhost:3000/users/backgrounds';

export interface ProfileData {
  avatar: string;
  background: string;
}

@Injectable({providedIn: 'root'})
export class ProfileService {
  profileData = new BehaviorSubject<ProfileData>(null);
  username: string;

  constructor(
    private http: HttpClient
  ) {}

  getUser(name: string) {
    this.username = name;
    return this.http.get<ProfileData>(`${usersEndpoint}/${name}`).pipe(
      map(profile => {
        return {
          avatar: `${avatarsEndpoint}/${profile.avatar}`,
          background: `url(${backgroundsEndpoint}/${profile.background})` // for background style
        };
      }),
      tap(profile => {
        this.profileData.next(profile);
      })
    );
  }

  saveAvatar(base64Image: string) {
    const data = new FormData();
    data.set('image', makeblob(base64Image));

    return this.http.post(`http://localhost:3000/users/${this.username}/avatar`, data, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });
  }

  saveBackground(base64Image: string) {
    const data = new FormData();
    data.set('image', makeblob(base64Image));

    return this.http.post(`http://localhost:3000/users/${this.username}/background`, data, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });
  }
}


function makeblob(dataURL) {
  const BASE64_MARKER = ';base64,';
  let raw;
  let contentType;
  let parts;

  if (dataURL.indexOf(BASE64_MARKER) === -1) {
      parts = dataURL.split(',');
      contentType = parts[0].split(':')[1];
      raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
  }

  parts = dataURL.split(BASE64_MARKER);
  contentType = parts[0].split(':')[1];
  raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}
