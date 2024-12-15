import { ViewPartDeliveryComponent } from './part-delivery/view-part-delivery/view-part-delivery.component';
import { AddPartDeliveryComponent } from './part-delivery/add-part-delivery/add-part-delivery.component';
import { ViewTransactionComponent } from './sparePart/view-transaction/view-transaction.component';
import { EditDeletePartCatalogComponent } from './partcatalog/readonly-part-catalog/edit-delete-part-catalog.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AddPartCatalogComponent } from './partcatalog/add-part-catalog/add-part-catalog.component';
import { ViewPartCatalogComponent } from './partcatalog/view-part-catalog/view-part-catalog.component';
import { AddTransactionComponent } from './sparePart/add-transaction/add-transaction.component';
import { EditDeletePartDeliveryComponent } from './part-delivery/readonly-part-delivery/edit-delete-part-delivery.component';
import { StoreControlComponent } from './store-control/store-control.component';

const routes: Routes = [
  { path: 'part-catalog/add-control', component: AddPartCatalogComponent },
  { path: 'part-catalog', component: ViewPartCatalogComponent },
  { path: 'part-catalog/edit-control', component: EditDeletePartCatalogComponent },
  {
    path: 'spare-part-transaction/add-control/deposit',
    component: AddTransactionComponent,
  },
  {
    path: 'spare-part-transaction/add-control/Withdrawal',
    component: AddTransactionComponent,
  },
  { path: 'spare-part-transaction/edit-control', component: AddTransactionComponent },
  { path: 'spare-part-transaction', component: ViewTransactionComponent },

  { path: 'partDelivery/add-control', component: AddPartDeliveryComponent },
  { path: 'partDelivery', component: ViewPartDeliveryComponent },
  { path: 'partDelivery/view-control', component: EditDeletePartDeliveryComponent },
  { path: 'partDelivery/edit-control', component: EditDeletePartDeliveryComponent },
  { path: 'store-control', component: StoreControlComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRoutingModule {}
