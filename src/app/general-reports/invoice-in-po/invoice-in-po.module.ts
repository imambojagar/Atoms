import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceInPoRoutingModule } from './invoice-in-po-routing.module';
import { InvoiceInPoReportComponent } from './invoice-in-po-report/invoice-in-po-report.component';
import { InvoiceInPoManagementComponent } from './invoice-in-po-management/invoice-in-po-management.component';
import { CallInvoiceComponent } from './invoice-in-po-management/call-invoice/call-invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng.module';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';
import { TableComponent } from '../../shared/components/table/table.component';


@NgModule({
  declarations: [
    InvoiceInPoReportComponent,
    InvoiceInPoManagementComponent,
    CallInvoiceComponent
  ],
  imports: [
    CommonModule,
    InvoiceInPoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
    TransactionHistoryComponent,
    TableComponent
  ]
})
export class InvoiceInPoModule { }
