import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateInvoiceCollectionComponent } from './update-invoice-collection/update-invoice-collection.component';
import { ViewInvoiceCollectionComponent } from './view-invoice-collection/view-invoice-collection.component';

const routes: Routes = [
  {
    path: 'edit-control',
    component: UpdateInvoiceCollectionComponent,
  },
  {
    path: '',
    component: ViewInvoiceCollectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceCollectionRoutingModule {}
