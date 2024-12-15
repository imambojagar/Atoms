import { ViewDetailsPartDeliveryComponent } from './part-delivery/view-details-part-delivery/view-details-part-delivery.component';
import { ViewPartDeliveryComponent } from './part-delivery/view-part-delivery/view-part-delivery.component';
import { AddPartDeliveryComponent } from './part-delivery/add-part-delivery/add-part-delivery.component';
import { ViewTransactionComponent } from './sparePart/view-transaction/view-transaction.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { AddPartCatalogComponent } from './partcatalog/add-part-catalog/add-part-catalog.component';
import { ViewPartCatalogComponent } from './partcatalog/view-part-catalog/view-part-catalog.component';
import { EditDeletePartCatalogComponent } from './partcatalog/readonly-part-catalog/edit-delete-part-catalog.component';
import { AddTransactionComponent } from './sparePart/add-transaction/add-transaction.component';
import { EditDeletePartDeliveryComponent } from './part-delivery/readonly-part-delivery/edit-delete-part-delivery.component';
import { StoreControlComponent } from './store-control/store-control.component';
import { SparePartsQuantityLookupComponent } from './sparePartsQuantityLookup/sparePartsQuantityLookup.component';
import { PrimengModule } from '../shared/primeng.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionHistoryComponent } from '../shared/components/transaction-history/transaction-history.component';
import { FormValidationMsgDirective } from '../shared/directives/FormValidationMsg.directive';
import { ViewDetailsPartCatalogComponent } from './partcatalog/view-details-part-catalog/view-details-part-catalog.component';


@NgModule({
  declarations: [
    AddPartCatalogComponent,
    ViewPartCatalogComponent,
    EditDeletePartCatalogComponent,
    AddTransactionComponent,
    ViewTransactionComponent,
    AddPartDeliveryComponent,
    ViewPartDeliveryComponent,
    ViewDetailsPartDeliveryComponent,
    EditDeletePartDeliveryComponent,
    StoreControlComponent,
    SparePartsQuantityLookupComponent,
    FormValidationMsgDirective, 
    ViewDetailsPartCatalogComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    SharedModule,
    FormsModule,
    PrimengModule,
    ReactiveFormsModule,
    TransactionHistoryComponent
  ]
})
export class StoreModule { }
