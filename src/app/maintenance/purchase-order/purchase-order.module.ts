import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
/* import { PrimengModule } from 'src/app/shared/primeng.module';
import { SharedModule } from 'src/app/shared/shared.module'; */
import { PurchaseOrderManagementComponent } from './purchase-order-management/purchase-order-management.component';
import { PrimengModule } from '../../shared/primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';
import { PurchaseOrderViewComponent } from './purchase-order- view/purchase-order-view.component';



@NgModule({
  declarations: [
    PurchaseOrderListComponent,
    PurchaseOrderManagementComponent,
    PurchaseOrderViewComponent
  ],
  imports: [
    CommonModule,
    PurchaseOrderRoutingModule,
    SharedModule,
    PrimengModule,
    ReactiveFormsModule,
    TransactionHistoryComponent
  ]
})
export class PurchaseOrderModule { }
