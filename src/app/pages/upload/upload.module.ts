import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@src/app/modules/material.module';

import { UploadComponent } from './upload.component';
import { DropPlaceComponent } from './drop-place/drop-place.component';
import { UploadItemsComponent } from './upload-item/upload-items.component';
import { AuthGuard } from '../auth/auth.guard';

const declarations = [
  UploadComponent,
  DropPlaceComponent,
  UploadItemsComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{
      path: '', component: UploadComponent,
      canActivate: [AuthGuard],
      // canDeactivate: [CanDeactivateUpload]
    }]),
    MaterialModule
  ],
  declarations,
  exports: declarations
})
export class UploadModule {}
