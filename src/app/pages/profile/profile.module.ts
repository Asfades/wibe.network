import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ImageCropperModule } from 'ngx-image-cropper';

import { ActivateProfileGuard } from './activateProfile.guard';
import { ProfileComponent } from './profile.component';
import { TracksComponent } from './tracks/tracks.component';
import { CoreModule } from '@src/app/modules/core.module';

const declarations = [
  ProfileComponent,
  TracksComponent,
];

@NgModule({
  declarations,
  imports: [
    CoreModule,
    ImageCropperModule,
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
  exports: declarations,
})
export class ProfileModule {}
