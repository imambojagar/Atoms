import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionDescriptionMappingComponent } from './instruction-description-mapping-managment/instruction-description-mapping.component';

const routes: Routes = [
  { path: '', component: InstructionDescriptionMappingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructionRoutingModule {}
