import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { WorkOrdersRoutingModule } from './work-orders-routing.module';

import { PrimengModule } from '../../shared/primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';
import { AttachmentsComponent } from '../../shared/components/attachments/attachments.component';
import { WorkOrderManagementComponent } from './work-order-management/work-order-management.component';
import { WorkOrderSearchComponent } from './work-order-search/work-order-search.component';
import { WorkOrderViewComponent } from './work-order-view/work-order-view.component';
/* import { SharedModule } from 'src/app/shared/shared.module';
import { PrimengModule } from 'src/app/shared/primeng.module';
 */

@NgModule({
  declarations: [
    WorkOrderManagementComponent,
    WorkOrderSearchComponent,
    WorkOrderViewComponent
  ],
  imports: [
    CommonModule,
    WorkOrdersRoutingModule,
    SharedModule,
    PrimengModule,
    ReactiveFormsModule,
    TableComponent,
    TransactionHistoryComponent,
    AttachmentsComponent
  ],
  providers:[
    DatePipe
  ]
})
export class WorkOrdersModule { }
