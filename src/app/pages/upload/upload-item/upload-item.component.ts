import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UploadStatus } from '../upload.service';

@Component({
  selector: 'app-upload-item',
  templateUrl: './upload-item.component.html',
  styleUrls: ['./upload-item.component.scss']
})
export class UploadItemComponent implements OnInit {
  @ViewChild('uploadForm', { static: true }) form: NgForm;
  @Input() fileInfo: {
      name: string,
      percentage: number,
      status: UploadStatus
    };
  @Output() confirm = new EventEmitter<{
      artist: string,
      name: string
    }>();
  @Output() delete = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  deleteItem() {
    this.delete.emit();
  }

  onSubmit(form: NgForm) {
    this.confirm.emit(form.value);
  }

  get iconColor(): string {
    switch (this.fileInfo.status) {
      case UploadStatus.Preloaded:
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

  get iconLigature(): string {
    return this.fileInfo.status === UploadStatus.Error ? 'error' : 'check_circle';
  }

  get cancelButtonText(): string {
    return this.fileInfo.status === UploadStatus.Preloaded
    || this.fileInfo.status === UploadStatus.Cancelled ? 'Delete' : 'Cancel';
  }

  get statusText(): string {
    return this.fileInfo.status === UploadStatus.Saved && 'Saved'
      || this.fileInfo.status === UploadStatus.Preloaded && 'Preloaded'
      || this.fileInfo.status === UploadStatus.Error && 'Error occured'
      || this.fileInfo.status === UploadStatus.Cancelled && 'Upload cancelled'
      || '';
  }

  get submitDisabled(): boolean {
    return this.form.invalid
      || this.fileInfo.status !== UploadStatus.Preloaded;
  }

  get cancelDisabled(): boolean {
    return this.fileInfo.status === UploadStatus.Saved
      || this.fileInfo.status === UploadStatus.Error;
  }

  get inputsDisabled(): boolean {
    return this.fileInfo.status === UploadStatus.Saved
      || this.fileInfo.status === UploadStatus.Error
      || this.fileInfo.status === UploadStatus.Cancelled;
  }

}
