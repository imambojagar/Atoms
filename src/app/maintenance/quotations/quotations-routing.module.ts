import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationListComponent } from './quotation-list/quotation-list.component';
import { QuotationManagementComponent } from './quotation-management/quotation-management.component';

const routes: Routes = [
  { path: '', component: QuotationListComponent },
  { path: 'add-control', component: QuotationManagementComponent },
  { path: 'edit-control', component: QuotationManagementComponent },
  { path: 'view-control', component: QuotationManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationsRoutingModule {}
