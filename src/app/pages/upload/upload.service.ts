import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
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
      let uploadState: UploadState = {
        filename,
        status: UploadStatus.Loading,
        loadPercentage: 0,
      };

      const upload = this.http.post<{ filename: string, trackId: string }>(
        'http://localhost:3000/audio/preload',
        formData, {
          reportProgress: true,
          observe: 'events'
        }
      ).pipe(
        map(event => {
          uploadState = parseUploadEvents(event, uploadState);
          return uploadState;
        }),
        tap((val) => console.log(val))
      );

      this.uploads.push(upload);
    }
  }

  deleteUploadedFile(data: { index: number, upload: UploadState }) {
    this.uploads.splice(data.index, 1);
    this.http.delete(`http://localhost:3000/audio/delete/${data.upload.trackId}`).subscribe();
  }

  confirmFile(data: { artist: string, name: string, uploadState: UploadState, index: number }) {
    const { artist, name, uploadState, index } = data;
    let uploadedState;
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
        map(() => {
          uploadedState = { ...uploadState, status: UploadStatus.Saved };
          return uploadedState;
        }),
        finalize(() => {
          this.uploads[index] = of(uploadedState);
        })
      )
    );
  }
}

function parseUploadEvents(event, previousState: UploadState) {
  switch (event.type) {
    case HttpEventType.UploadProgress:
      const loadPercentage = Math.round(100 * event.loaded / event.total);
      return { ...previousState, loadPercentage };
    case HttpEventType.Response:
      return { ...previousState, status: UploadStatus.Preloaded, trackId: event.body.trackId };
    case HttpEventType.User:
    case HttpEventType.Sent:
    case HttpEventType.ResponseHeader:
    default:
      return previousState;
  }
}

export interface UploadState {
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
