import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkOrderManagementComponent } from './work-order-management/work-order-management.component';
import { WorkOrderSearchComponent } from './work-order-search/work-order-search.component';

const routes: Routes = [
  { path: '', component: WorkOrderSearchComponent },
  { path: 'add-control', component: WorkOrderManagementComponent },
  { path: 'edit-control', component: WorkOrderManagementComponent },
  { path: 'view-control', component: WorkOrderManagementComponent },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkOrdersRoutingModule {}
