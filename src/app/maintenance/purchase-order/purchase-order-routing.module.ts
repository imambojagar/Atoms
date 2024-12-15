import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { PurchaseOrderManagementComponent } from './purchase-order-management/purchase-order-management.component';

const routes: Routes = [
  { path: '', component:  PurchaseOrderListComponent },
  { path: 'add-control', component:  PurchaseOrderManagementComponent },
  { path: 'edit-control', component:  PurchaseOrderManagementComponent },
  { path: 'view-control', component:  PurchaseOrderManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseOrderRoutingModule {}
