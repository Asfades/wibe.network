import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ActivateProfileGuard } from './activateProfile.guard';
import { ProfileComponent } from './profile.component';
import { TracksComponent } from './tracks/tracks.component';
import { CoreModule } from '@src/app/modules/core.module';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';

const components = [
  ProfileComponent,
  TracksComponent,
  ImageCropperComponent
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CoreModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent,
        children: [
          {
            path: 'tracks',
            component: TracksComponent
          }
        ],
        canActivate: [ActivateProfileGuard]
      }
    ])
  ],
  exports: [
    ...components
  ],
})
export class ProfileModule {}
