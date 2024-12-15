import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { AssetDeliveryModule } from './asset-delivery/asset-delivery.module';
import { CylindersReferenceModule } from './cylinders-reference/cylinders-reference.module';
import { GasRefillModule } from './gas-refill/gas-refill.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { QuotationsModule } from './quotations/quotations.module'; 
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { RecurrentTaskComponent } from './recurrent-task/recurrent-task.component';
import { ServiceRequestSearchComponent } from './service-request/service-request-search/service-request-search.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    AssetDeliveryModule,
    CylindersReferenceModule,
    GasRefillModule,
    PurchaseOrderModule,
    QuotationsModule, 
    WorkOrdersModule,
    RecurrentTaskComponent,
    ServiceRequestSearchComponent
  ]
})
export class MaintenanceModule { }
