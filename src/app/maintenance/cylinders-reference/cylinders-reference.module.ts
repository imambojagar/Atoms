import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CylindersReferenceRoutingModule } from './cylinders-reference-routing.module';
import { CylindersReferenceComponent } from './cylinders-reference/cylinders-reference.component';
/* import { PrimengModule } from 'src/app/shared/primeng.module';
import { SharedModule } from 'src/app/shared/shared.module'; */
import { PriceComponent } from './price/price.component';
import { PriceViewComponent } from './price-view/price-view.component';
import { SharedModule } from '../../shared/shared.module';
import { PrimengModule } from '../../shared/primeng.module';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { CylindersReferenceDetailsComponent } from './cylinders-details-reference/cylinders-reference-details.component';
import { CylindersReferenceViewComponent } from './cylinders-reference-view/cylinders-reference-view.component';
import { PriceDetailsComponent } from './price-details-view/price-details.component';

@NgModule({
  declarations: [
    CylindersReferenceViewComponent,
    CylindersReferenceComponent, 
    CylindersReferenceDetailsComponent, 
    PriceComponent,
    PriceViewComponent,
    PriceDetailsComponent
  ],
  imports: [
    CommonModule,
    CylindersReferenceRoutingModule,
    SharedModule,
    PrimengModule,
    TransactionHistoryComponent,
    ReactiveFormsModule,
    FormsModule,
    TableComponent
  ],
})
export class CylindersReferenceModule {}
