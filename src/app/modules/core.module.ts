import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

import { ModalComponent } from '../components/modal/modal.component';

const declarations = [
  ModalComponent
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations,
  providers: [],
  exports: [
    ...declarations,
    MaterialModule,
    CommonModule
  ]
})
export class CoreModule {}
