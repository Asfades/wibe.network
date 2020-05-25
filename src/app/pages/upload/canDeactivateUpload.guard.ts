import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { UploadService, UploadStatus, UploadState } from './upload.service';
import { UploadComponent } from './upload.component';

@Injectable({providedIn: 'root'})
export class CanDeactivateUpload implements CanDeactivate<UploadComponent> {
  constructor(
    private uploadService: UploadService
  ) {}

  canDeactivate(): boolean | Promise<boolean> | Observable<boolean> {
    return this.uploadService.uploadsChanged.pipe(
      take(1),
      map((uploads: UploadState[]) => {
          const unfinishedUploads = uploads.filter((upload: UploadState) => {
            return upload.status === UploadStatus.Loading
              || upload.status === UploadStatus.Preloaded;
          });
          return true; // !unfinishedUploads.length; // || window.confirm();
        }
      )
    );
  }


}
