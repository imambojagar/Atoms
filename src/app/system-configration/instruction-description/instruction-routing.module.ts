import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionDescriptionManagmentComponent } from './instructions-managment/instruction-description-managment.component';

const routes: Routes = [
  { path: '', component: InstructionDescriptionManagmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructionRoutingModule {}
