import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LookupControlRoutingModule } from './lookup-control-routing.module';
import { EditLookupComponent } from './edit-lookup/edit-lookup.component';

import { PrimengModule } from '../../shared/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    EditLookupComponent
  ],
  imports: [
    CommonModule,
    LookupControlRoutingModule,
    SharedModule,
    PrimengModule,
    FormsModule, ReactiveFormsModule, TransactionHistoryComponent
  ]
})
export class LookupControlModule { }
