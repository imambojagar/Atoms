import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditTRetirementComponent } from './add-edit-t-retirement/add-edit-t-retirement.component';
import { ViewTRetirementComponent } from './view-t-retirement/view-t-retirement.component';

const routes: Routes = [
  { path: 'add-control', component: AddEditTRetirementComponent },
  { path: 'edit-control', component: AddEditTRetirementComponent },
  { path: '', component: ViewTRetirementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnicalRetirementRoutingModule { }
