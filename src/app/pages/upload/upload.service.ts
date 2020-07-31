import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { concat, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UploadService {
  uploads: Observable<UploadState>[] = [];

  constructor(
    private http: HttpClient
  ) {}

  uploadFiles(files) {
    for (const file of files) {
      const formData = new FormData();
      formData.set('audio', file);

      const filename = file.name;
      const id = makeID(5);
      const uploadState: UploadState = {
        filename,
        status: UploadStatus.Loading,
        loadPercentage: 0,
        id
      };

      // const request = new XMLHttpRequest();
      // request.

      const upload = this.http.post<{ filename: string, trackId: string }>(
        'http://localhost:3000/audio/preload',
        formData, {
          reportProgress: true,
          observe: 'events'
        }
      ).pipe(
        map(event => parseUploadEvents(event, uploadState)),
        tap((val) => console.log(val))
      );

      this.uploads.push(upload);
    }
  }

  deleteUploadedFile(index) {
    this.uploads.splice(index, 1);
    // if (this.uploads[index].status === UploadStatus.Preloaded) {
    //   this.uploads[index].storageRef.delete().subscribe(() => {
    //     this.uploads.splice(index, 1);
    //     this.uploadsChanged.next(this.uploads);
    //   });
    // } else if (this.uploads[index].status === UploadStatus.Cancelled) {
    //   this.uploads.splice(index, 1);
    //   this.uploadsChanged.next(this.uploads);
    // } else {
    //   this.uploads[index].status = UploadStatus.Cancelled;
    //   this.uploads[index].storageTask.cancel();
    // }
  }

  confirmFile(data: { artist: string, name: string, uploadState: UploadState }, index: number) {
    const { artist, name, uploadState } = data;
    const payload = {
      name: `${artist} - ${name}`,
      genres: ['rap', 'hip-hop']
    };

    this.uploads[index] = concat(
      of(uploadState),
      this.http.patch(
        `http://localhost:3000/audio/confirm/${uploadState.trackId}`, payload, {
          observe: 'response'
        }
      ).pipe(
        tap((response) => console.log(response)),
        map(() => ({ ...uploadState, status: UploadStatus.Saved }))
      )
    );
  }
}

function parseUploadEvents(event, initialState: UploadState) {
  let uploadState = initialState;

  switch (event.type) {
    case HttpEventType.Sent:
      return uploadState;
    case HttpEventType.UploadProgress:
      const loadPercentage = Math.round(100 * event.loaded / event.total);
      uploadState = { ...uploadState, loadPercentage };
      return uploadState;
    case HttpEventType.ResponseHeader:
      return uploadState;
    case HttpEventType.Response:
      uploadState = { ...uploadState, status: UploadStatus.Preloaded, trackId: event.body.trackId };
      return uploadState;
    case HttpEventType.User:
      console.log('user event');
      console.log(event);
      return uploadState;
    default:
      return uploadState;
  }
}

function makeID(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export interface UploadState {
  id: string;
  filename: File;
  loadPercentage: number;
  status: UploadStatus;
  trackId?: string;
}

export enum UploadStatus {
  Loading = 'Loading',
  Preloaded = 'Preloaded',
  Saved = 'Saved',
  Error = 'Error',
  Cancelled = 'Cancelled'
}
