import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetDeliveryListComponent } from './asset-delivery-list/asset-delivery-list.component';
import { AssetDeliveryManagementComponent } from './asset-delivery-management/asset-delivery-management.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  { path: 'search-asset-delivery', component: AssetDeliveryListComponent },
  { path: 'management-asset-delivery', component: AssetDeliveryManagementComponent },
  { path: 'report', component: ReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetDeliveryRoutingModule {}
