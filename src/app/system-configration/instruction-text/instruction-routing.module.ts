import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionManagmentComponent } from './instructions-managment/instruction-managment.component';

const routes: Routes = [
  { path: '', component: InstructionManagmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructionRoutingModule {}
