import { NgModule } from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
import { MaterialModule } from './material.module';

const declarations = [
  ModalComponent
];

@NgModule({
  declarations,
  providers: [],
  exports: [
    ...declarations,
    MaterialModule
  ]
})
export class CoreModule {}
