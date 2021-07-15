import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreModule } from '@src/app/core/core.module';
import { ActivateProfileGuard } from './activateProfile.guard';
import { ProfileComponent } from './profile.component';
import { TracksComponent } from './tracks/tracks.component';
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
