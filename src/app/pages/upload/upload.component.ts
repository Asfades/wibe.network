import { Component, OnInit, HostListener } from '@angular/core';
import { UploadService, UploadState } from './upload.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  dragFile = false;
  uploads$: Observable<UploadState>[] = [];

  constructor(
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.uploads$ = this.uploadService.uploads;
  }

  @HostListener('document:dragover', ['$event']) onDragOverDoc(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.dragFile) {
      this.dragFile = true;
    }
  }

  onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragFile = false;
  }

  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragFile = false;
    const files = event.dataTransfer.files;
    if (files.length) {
      this.uploadService.uploadFiles(files);
    }
  }

  uploadFiles(files: File[]) {
    this.uploadService.uploadFiles(files);
  }

  deleteUploadedFile(index) {
    this.uploadService.deleteUploadedFile(index);
  }

  confirmFile(data: { artist: string, name: string, uploadState: UploadState }, index: number) {
    this.uploadService.confirmFile(data, index);
  }

  trackUploadKey(index: number, upload: UploadState) {
    return index;
  }

}
