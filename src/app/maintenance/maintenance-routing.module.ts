import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetTransferComponent } from './asset-transfer/asset-transfer.component';
import { AddControlComponent } from './asset-transfer/add-control/add-control.component';
import { AddRecurrentTaskComponent } from './recurrent-task/add-recurrent-task/add-recurrent-task.component';
import { EditDeleteRecurrentTaskComponent } from './recurrent-task/edit-delete-recurrent-task/edit-delete-recurrent-task.component';
import { GasRoomControlComponent } from './gas-room/gas-room-control/gas-room-control.component';
import { GasRoomViewComponent } from './gas-room/gas-room-view/gas-room-view.component';
import { OrderingCylindersLoxControlComponent } from './ordering-cylinders-lox/ordering-cylinders-lox-control/ordering-cylinders-lox-control.component';
import { OrderingCylindersLoxViewComponent } from './ordering-cylinders-lox/ordering-cylinders-lox-view/ordering-cylinders-lox-view.component';
import { RecurrentTaskComponent } from './recurrent-task/recurrent-task.component';
import { ServiceRequestSearchComponent } from './service-request/service-request-search/service-request-search.component';
import { ServiceRequestManagementComponent } from './service-request/service-request-management/service-request-management.component';
import { ServiceRequestBulkUpdateComponent } from './service-request/service-request-bulk-update/service-request-bulk-update.component';
import { ReportComponent } from './service-request/report/report.component';
import { PurchaseOrderListComponent } from './purchase-order/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderManagementComponent } from './purchase-order/purchase-order-management/purchase-order-management.component';
import { QuotationListComponent } from './quotations/quotation-list/quotation-list.component';
import { QuotationManagementComponent } from './quotations/quotation-management/quotation-management.component';
import { WorkOrderSearchComponent } from './work-orders/work-order-search/work-order-search.component';
import { WorkOrderManagementComponent } from './work-orders/work-order-management/work-order-management.component';
import { CylindersReferenceComponent } from './cylinders-reference/cylinders-reference/cylinders-reference.component';
import { PriceViewComponent } from './cylinders-reference/price-view/price-view.component';
import { PriceComponent } from './cylinders-reference/price/price.component';
import { AssetDeliveryListComponent } from './asset-delivery/asset-delivery-list/asset-delivery-list.component';
import { AssetDeliveryManagementComponent } from './asset-delivery/asset-delivery-management/asset-delivery-management.component';
import { GasRefillSearchComponent } from './gas-refill/gas-refill-search/gas-refill-search.component';
import { GasRefillManagementComponent } from './gas-refill/gas-refill-management/gas-refill-management.component';
import { CylindersReferenceViewComponent } from './cylinders-reference/cylinders-reference-view/cylinders-reference-view.component';

const routes: Routes = [
  {
    path: 'asset-delivery',
    children: [
      { path: 'search-asset-delivery', component: AssetDeliveryListComponent },
      { path: 'management-asset-delivery', component: AssetDeliveryManagementComponent },
      { path: 'report', component: ReportComponent }
    ]
  },
  {
    path: 'ordering-cylinders-lox',
    children:[
      { path: 'add-control', component: OrderingCylindersLoxControlComponent },
      { path: 'edit-control', component: OrderingCylindersLoxControlComponent },
      { path: '', component: OrderingCylindersLoxViewComponent },
    ]
  },
  {
    path: 'work-order',
    children: [
      { path: '', component: WorkOrderSearchComponent },
      { path: 'work-order-search', component: WorkOrderSearchComponent },
      { path: 'work-order-management', component: WorkOrderManagementComponent },
      { path: 'update:id', component: WorkOrderManagementComponent }
    ]
    /* loadChildren: () => import('./workorder/workorder.module').then(m => m.WorkorderModule) */
  },
  {
    path: 'asset-transfer',
    children: [
      { path: '', component: AssetTransferComponent},
      { path: 'add-control', component: AddControlComponent },
      { path: 'edit-control', component: AddControlComponent }
    ]
    /* asset-transfer loadChildren: () => import('./workorder/workorder.module').then(m => m.WorkorderModule) */
  },
  {
    path: 'recurrent-task',
    children: [
      { path: 'schedule/add-control', component: AddRecurrentTaskComponent },
      { path: 'entries/add-control', component: AddRecurrentTaskComponent },
      { path: 'schedule', component: RecurrentTaskComponent },
      { path: 'entries', component: RecurrentTaskComponent },
      { path: 'schedule/edit-control', component: EditDeleteRecurrentTaskComponent },
      { path: 'entries/edit-control', component: EditDeleteRecurrentTaskComponent },

     /*  { path: 'schedule/add-control', component: AddRecurrentTaskComponent },
      { path: 'entries/add-control', component: AddRecurrentTaskComponent },
      { path: 'schedule', component: ViewRecurrentTaskComponent },
      { path: 'entries', component: ViewRecurrentTaskComponent },
      { path: 'schedule/edit-control', component: EditDeleteRecurrentTaskComponent },
      { path: 'entries/edit-control', component: EditDeleteRecurrentTaskComponent }, */
    ]
   },
  {
    path: 'gas-room',
    children: [
      { path: 'add-control', component: GasRoomControlComponent },
      { path: 'edit-control', component: GasRoomControlComponent },
      { path: '', component: GasRoomViewComponent },
    ]
  },
  {
    path: 'ordering-cylinders',
    children: [
      { path: 'add-control', component: OrderingCylindersLoxControlComponent },
      { path: 'edit-control', component: OrderingCylindersLoxControlComponent },
      { path: '', component: OrderingCylindersLoxViewComponent },
    ]
  },
  {
    path: 'cylinders-reference',
    children: [ { path: 'amount', component: CylindersReferenceViewComponent },
      { path: 'amount/add-control', component: CylindersReferenceComponent },
      { path: 'amount/edit-control', component: CylindersReferenceComponent },
      { path: 'price', component: PriceViewComponent },
      { path: 'price/add-control', component: PriceComponent },
      { path: 'price/edit-control', component: PriceComponent },
    ]
  },
  {
    path: 'purchase-order',
    children: [
      { path: '', component:  PurchaseOrderListComponent },
      { path: 'add-control', component:  PurchaseOrderManagementComponent },
      { path: 'edit-control', component:  PurchaseOrderManagementComponent },
      { path: 'view-control', component:  PurchaseOrderManagementComponent },
    ]
  },
  {
    path: 'service-request',
    children: [
      { path: '', component: ServiceRequestSearchComponent },
      { path: 'add-control', component: ServiceRequestManagementComponent },
      { path: 'edit-control', component: ServiceRequestManagementComponent },
      { path: 'view-control', component: ServiceRequestManagementComponent },
      { path: 'service-request-bulk-update', component: ServiceRequestBulkUpdateComponent },
      { path: 'report', component: ReportComponent }
    ]
  },
  {
    path: 'quotations',
    children: [
      { path: '', component: QuotationListComponent },
      { path: 'add-control', component: QuotationManagementComponent },
      { path: 'edit-control', component: QuotationManagementComponent },
      { path: 'view-control', component: QuotationManagementComponent }
    ]
  },
  {
    path: 'gas-refill',
    children: [
      { path: '', component: GasRefillSearchComponent },
      { path: 'add-control', component: GasRefillManagementComponent },
      { path: 'edit-control', component: GasRefillManagementComponent },
      { path: 'view-control', component: GasRefillManagementComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
