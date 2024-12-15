import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceInPoManagementComponent } from './invoice-in-po-management/invoice-in-po-management.component';
import { InvoiceInPoReportComponent } from './invoice-in-po-report/invoice-in-po-report.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceInPoReportComponent,
  },
  {
    path: 'invoice-in-po-management',
    component: InvoiceInPoManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceInPoRoutingModule { }
