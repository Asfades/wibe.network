import { NgModule } from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
import { MaterialModule } from './material.module';

const declarations = [
  ModalComponent
];

@NgModule({
  imports: [
    MaterialModule
  ],
  declarations,
  providers: [],
  exports: declarations
})
export class CoreModule {}
