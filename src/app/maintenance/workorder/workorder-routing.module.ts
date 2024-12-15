import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkOrderManagementComponent } from './work-order-management/work-order-management.component';
import { WorkOrderSearchComponent } from './work-order-search/work-order-search.component';

const routes: Routes = [
  { path: 'work-order-management', component: WorkOrderManagementComponent },
  { path: 'work-order-search', component: WorkOrderSearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkorderRoutingModule { }
