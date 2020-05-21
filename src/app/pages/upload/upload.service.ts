import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';

const makeID = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

@Injectable({providedIn: 'root'})
export class UploadService {
  private uploads: UploadState[] = [];
  uploadsChanged = new BehaviorSubject<UploadState[]>(this.uploads);

  constructor(
    private http: HttpClient,
    private fireStorage: AngularFireStorage
  ) {}

  uploadFiles(files) {
    for (const file of files) {
      const id = makeID(5);
      const filePath = `tracks/${file.name}${id}`;
      const storageRef = this.fireStorage.ref(filePath);
      const storageTask = storageRef.put(file);

      this.uploads.push({
        id,
        file,
        storageRef,
        storageTask,
        loadPercentage: 0,
        status: UploadStatus.Loading
      });

      this.uploadsChanged.next(this.uploads);

      const index = this.uploads.length - 1;
      storageTask.percentageChanges().subscribe(percents => {
        this.uploads[index].loadPercentage = percents;
      });
      storageTask.then(() => {
        this.uploads[index].status = UploadStatus.Preloaded;
      }, () => {
        // this.uploads[index].status = UploadStatus.Error;
      });
    }
  }

  deleteUploadedFile(index) {
    if (this.uploads[index].status === UploadStatus.Preloaded) {
      this.uploads[index].storageRef.delete().subscribe(() => {
        this.uploads.splice(index, 1);
        this.uploadsChanged.next(this.uploads);
      });
    } else if (this.uploads[index].status === UploadStatus.Cancelled) {
      this.uploads.splice(index, 1);
      this.uploadsChanged.next(this.uploads);
    } else {
      this.uploads[index].status = UploadStatus.Cancelled;
      this.uploads[index].storageTask.cancel();
    }
  }

  confirmFile(data: { artist: string, name: string }, index: number) {
    this.uploads[index].storageRef.getDownloadURL().subscribe(url => {
      this.http.post(
        `https://wibe-network.firebaseio.com/public-tracks.json`,
        JSON.stringify({
          url,
          name: data.name,
          artist: data.artist
        })
      ).subscribe(() => {
        this.uploads[index].status = UploadStatus.Saved;
      }, () => {
        this.uploads[index].status = UploadStatus.Error;
      });
    });
  }
}

export interface UploadState {
  id: string;
  file: File;
  storageRef: AngularFireStorageReference;
  storageTask: AngularFireUploadTask;
  loadPercentage: number;
  status: UploadStatus;
}

export enum UploadStatus {
  Loading = 'Loading',
  Preloaded = 'Preloaded',
  Saved = 'Saved',
  Error = 'Error',
  Cancelled = 'Cancelled'
}
