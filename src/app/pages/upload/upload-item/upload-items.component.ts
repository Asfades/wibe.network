import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UploadStatus, UploadState } from '../upload.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-items',
  templateUrl: './upload-items.component.html',
  styleUrls: ['./upload-items.component.scss']
})
export class UploadItemsComponent implements OnInit {
  @Input() uploads: Observable<UploadState>[];
  @Output() confirm = new EventEmitter<{
      artist: string,
      name: string,
      index: number
    }>();
  @Output() delete = new EventEmitter<{ index: number, upload: UploadState }>();

  constructor() { }

  ngOnInit(): void {
  }

  deleteItem(index: number, upload: UploadState) {
    this.delete.emit({ index, upload });
  }

  onSubmit(form: NgForm, uploadState: UploadState, index: number) {
    this.confirm.emit({ ...form.value, uploadState, index });
  }

  getIconColor(status: UploadStatus): string {
    switch (status) {
      case UploadStatus.Preloaded:
        return 'blue';
      case UploadStatus.Saved:
        return 'green';
      case UploadStatus.Error:
        return 'red';
      case UploadStatus.Loading:
        return 'blue';
      case UploadStatus.Cancelled:
        return 'orange';
      default:
        return '';
    }
  }

  // get iconColor(): string {
  //   return '';
  //   // switch (this.fileInfo.status) {
  //   //   case UploadStatus.Preloaded:
  //   //   case UploadStatus.Saved:
  //   //     return 'green';
  //   //   case UploadStatus.Error:
  //   //     return 'red';
  //   //   case UploadStatus.Loading:
  //   //     return 'blue';
  //   //   case UploadStatus.Cancelled:
  //   //     return 'orange';
  //   //   default:
  //   //     return '';
  //   // }
  // }

  public getIconLigature(status: UploadStatus): string {
    return status === UploadStatus.Error ? 'error' : 'check_circle';
  }

  // get iconLigature(): string {
  //   // return this.fileInfo.status === UploadStatus.Error ? 'error' : 'check_circle';
  //   return '';
  // }

  getCancelButtonText(status: UploadStatus): string {
    return status === UploadStatus.Preloaded
    || status === UploadStatus.Cancelled ? 'Delete' : 'Cancel';
  }

  // get cancelButtonText(): string {
  //   // return this.fileInfo.status === UploadStatus.Preloaded
  //   // || this.fileInfo.status === UploadStatus.Cancelled ? 'Delete' : 'Cancel';
  //   return '';
  // }

  public getStatusText(status: UploadStatus): string {
    return status === UploadStatus.Saved && 'Saved'
      || status === UploadStatus.Preloaded && 'Preloaded'
      || status === UploadStatus.Error && 'Error occured'
      || status === UploadStatus.Cancelled && 'Upload cancelled'
      || '';
  }

  // get statusText(): string {
  //   // return this.fileInfo.status === UploadStatus.Saved && 'Saved'
  //   //   || this.fileInfo.status === UploadStatus.Preloaded && 'Preloaded'
  //   //   || this.fileInfo.status === UploadStatus.Error && 'Error occured'
  //   //   || this.fileInfo.status === UploadStatus.Cancelled && 'Upload cancelled'
  //   //   || '';
  //   return '';
  // }

  getSubmitDisabled(status: UploadStatus): boolean {
    return status !== UploadStatus.Preloaded;
  }

  // get submitDisabled(): boolean {
  //   // return this.form.invalid
  //   //   || this.fileInfo.status !== UploadStatus.Preloaded;
  //   return true;
  // }

  getCancelDisabled(status: UploadStatus): boolean {
    return status === UploadStatus.Saved
      || status === UploadStatus.Error;
  }

  // get cancelDisabled(): boolean {
  //   // return this.fileInfo.status === UploadStatus.Saved
  //   //   || this.fileInfo.status === UploadStatus.Error;
  //   return true;
  // }

  getInputsDisabled(status: UploadStatus): boolean {
    return status === UploadStatus.Saved
      || status === UploadStatus.Error
      || status === UploadStatus.Cancelled;
  }

}
