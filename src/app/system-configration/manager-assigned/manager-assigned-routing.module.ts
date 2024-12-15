import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddManagerAssignedComponent } from './add-manager-assigned/add-manager-assigned.component';
import { ViewManagerAssignedComponent } from './view-manager-assigned/view-manager-assigned.component';

const routes: Routes = [
  { path: '', component: ViewManagerAssignedComponent },
  { path: 'add-control', component: AddManagerAssignedComponent },
  { path: 'edit-control', component: AddManagerAssignedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerAssignedRoutingModule { }
