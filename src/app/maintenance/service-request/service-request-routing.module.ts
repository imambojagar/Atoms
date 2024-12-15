import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceRequestBulkUpdateComponent } from './service-request-bulk-update/service-request-bulk-update.component';
import { ServiceRequestManagementComponent } from './service-request-management/service-request-management.component';
import { ServiceRequestSearchComponent } from './service-request-search/service-request-search.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  
  { path: '', component: ServiceRequestSearchComponent },
  { path: 'add-control', component: ServiceRequestManagementComponent },  
  { path: 'edit-control', component: ServiceRequestManagementComponent },  
  { path: 'view-control', component: ServiceRequestManagementComponent },
  { path: 'service-request-bulk-update', component: ServiceRequestBulkUpdateComponent },
  { path: 'report', component: ReportComponent },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceRequestRoutingModule {}
