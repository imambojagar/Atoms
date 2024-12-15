import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerAssignedRoutingModule } from './manager-assigned-routing.module';
import { AddManagerAssignedComponent } from './add-manager-assigned/add-manager-assigned.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewManagerAssignedComponent } from './view-manager-assigned/view-manager-assigned.component';

import { PrimengModule } from '../../shared/primeng.module';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    AddManagerAssignedComponent,
    ViewManagerAssignedComponent
  ],
  imports: [
    CommonModule,
    ManagerAssignedRoutingModule,
    SharedModule,
    PrimengModule,
    ReactiveFormsModule, TransactionHistoryComponent
  ], exports: [AddManagerAssignedComponent]
})
export class ManagerAssignedModule { }
