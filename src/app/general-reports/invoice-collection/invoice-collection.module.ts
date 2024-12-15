import { PrimengModule } from './../../shared/primeng.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceCollectionRoutingModule } from './invoice-collection-routing.module';
import { UpdateInvoiceCollectionComponent } from './update-invoice-collection/update-invoice-collection.component';
import { ViewInvoiceCollectionComponent } from './view-invoice-collection/view-invoice-collection.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';
import { TableComponent } from '../../shared/components/table/table.component';

@NgModule({
  declarations: [
    UpdateInvoiceCollectionComponent,
    ViewInvoiceCollectionComponent,
  ],
  imports: [CommonModule, InvoiceCollectionRoutingModule, PrimengModule, ReactiveFormsModule, TransactionHistoryComponent, TableComponent],
})
export class InvoiceCollectionModule {}
