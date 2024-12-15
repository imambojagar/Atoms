import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRequestRoutingModule } from './service-request-routing.module';
import { ServiceRequestBulkUpdateComponent } from './service-request-bulk-update/service-request-bulk-update.component';
import { ServiceRequestSearchComponent } from './service-request-search/service-request-search.component';
import { ServiceRequestManagementComponent } from './service-request-management/service-request-management.component';
/* import { SharedModule } from 'src/app/shared/shared.module'; */
import { MaintenanceInfoComponent } from './service-request-management/maintenance-info/maintenance-info.component';
import { CallInfoComponent } from './service-request-management/call-info/call-info.component';
import { FirstActionComponent } from './service-request-management/first-action/first-action.component';
import { ServiceReviewComponent } from './service-request-management/service-review/service-review.component';
import { ServiceRequestFormService } from './service-request-form.service';
import { MessageService } from 'primeng/api';
import { ReportComponent } from './report/report.component';
import { StimulsoftViewerModule } from 'stimulsoft-viewer-angular';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    ServiceRequestRoutingModule,
    SharedModule,
    StimulsoftViewerModule,
    ServiceRequestBulkUpdateComponent,
    ServiceRequestSearchComponent,
    ServiceRequestManagementComponent,
    MaintenanceInfoComponent,
    CallInfoComponent,
    FirstActionComponent,
    ServiceReviewComponent,
  ],
  providers:[ServiceRequestFormService,MessageService]
})
export class ServiceRequestModule { }
