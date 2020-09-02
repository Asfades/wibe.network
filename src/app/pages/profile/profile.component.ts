import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '@store/app.reducer';
import { map } from 'rxjs/operators';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService, ProfileData } from './profile.service';
import { HttpClient } from '@angular/common/http';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef<HTMLInputElement>;
  @ViewChild(ImageCropperComponent, { static: false }) cropper: ImageCropperComponent;

  $profile: Observable<ProfileData>;
  personalPage = of(false);
  $username = of('');
  showModal = false;
  profileModals = ProfileModals;
  activeModal: ProfileModals;

  originalImageFile: File;
  imageBlob: string;

  zoomValue$ = new BehaviorSubject(0);
  maxSteps = 50;

  mouseIsDown = false;

  croppedImage: any = '';

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private profileService: ProfileService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.personalPage = this.store.select('auth').pipe(
      map(state => state.user),
      map(user => this.router.url === `/${user.username}`)
    );

    this.$username = this.store.select('auth').pipe(
      map(state => state.user.username)
    );

    this.$profile = this.profileService.profileData;
  }

  onHideModal() {
    this.showModal = false;
  }

  onBlobImage(image: string) {
    this.imageBlob = image;
  }

  saveImage() {
    this.cropper.emitImage();
    const data = new FormData();
    data.set('image', makeblob(this.imageBlob));
    this.http.post('http://localhost:3000/users/exmail/avatar', data, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }).subscribe();
  }

  onShowModal(event: Event, type: ProfileModals) {
    event.stopPropagation();
    this.activeModal = type;
    switch (type) {
      case ProfileModals.Avatar:
        this.showModal = true;
        break;
      case ProfileModals.UploadAvatar:
        this.fileInput.nativeElement.click();
    }
  }

  fileChangeEvent(file: File): void {
    this.originalImageFile = file;
    this.showModal = true;
  }

  onZoomChange(event: { value: number }) {
    this.zoomValue$.next(event.value / this.maxSteps);
  }

}

export enum ProfileModals {
  Avatar,
  UploadAvatar,
  UploadBackground
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
