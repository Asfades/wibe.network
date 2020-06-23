import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivateProfileGuard } from './activateProfile.guard';
import { TracksComponent } from './tracks/tracks.component';

const declarations = [
  ProfileComponent,
  TracksComponent
];

@NgModule({
  declarations,
  imports: [
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
