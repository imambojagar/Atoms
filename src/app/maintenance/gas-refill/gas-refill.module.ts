import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GasRefillRoutingModule } from './gas-refill-routing.module';
import { GasRefillSearchComponent } from './gas-refill-search/gas-refill-search.component';
import { GasRefillManagementComponent } from './gas-refill-management/gas-refill-management.component';
import { SharedModule } from '../../shared/shared.module';
import { PrimengModule } from '../../shared/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';
import { GasRefillViewComponent } from './gas-refill-view/gas-refill-view.component';
/* import { SharedModule } from 'src/app/shared/shared.module'; */


@NgModule({
  declarations: [
    GasRefillSearchComponent,
    GasRefillManagementComponent,
    GasRefillViewComponent
  ],
  imports: [
    CommonModule,
    GasRefillRoutingModule,
    SharedModule,
    PrimengModule,
    ReactiveFormsModule,
    TableComponent,
    TransactionHistoryComponent
  ]
})
export class GasRefillModule { }
