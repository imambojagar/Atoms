import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationsRoutingModule } from './quotations-routing.module';
import { QuotationListComponent } from './quotation-list/quotation-list.component';
/* import { PrimengModule } from 'src/app/shared/primeng.module';
import { SharedModule } from 'src/app/shared/shared.module'; */
import { QuotationManagementComponent } from './quotation-management/quotation-management.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { PrimengModule } from '../../shared/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';
import { AttachmentsComponent } from '../../shared/components/attachments/attachments.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { QuotationViewComponent } from './quotation-view/quotation-view.component';
/* import { InlineSVGModule } from 'ng-inline-svg-2';
    InlineSVGModule,*/



@NgModule({
  declarations: [
    QuotationListComponent,
    QuotationManagementComponent,
    QuotationViewComponent
  ],
  imports: [
    CommonModule,
    QuotationsRoutingModule,
    SharedModule,
    NgbTooltipModule,
    PrimengModule,
    ReactiveFormsModule,
    TransactionHistoryComponent,
    AttachmentsComponent,
    TableComponent
  ]
})
export class QuotationsModule { }
