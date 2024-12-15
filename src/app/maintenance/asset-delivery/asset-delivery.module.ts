import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* import { PrimengModule } from 'src/app/shared/primeng.module';
import { SharedModule } from 'src/app/shared/shared.module'; */
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
/* import { InlineSVGModule } from 'ng-inline-svg-2'; */
import { AssetDeliveryListComponent } from './asset-delivery-list/asset-delivery-list.component';
import { AssetDeliveryManagementComponent } from './asset-delivery-management/asset-delivery-management.component';
import { AssetDeliveryRoutingModule } from './asset-delivery-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Step1Component } from './steps/step1/step1.component';
import { Step2Component } from './steps/step2/step2.component';
import { Step3Component } from './steps/step3/step3.component';
import { Step4Component } from './steps/step4/step4.component';
import { Step5Component } from './steps/step5/step5.component';
import { CostCenterModalComponent } from './cost-center-modal/cost-center-modal.component';
import { TechnicalInspectionModalComponent } from './technical-assistance-modal/technical-inspection-modal.component';
import { ReportComponent } from './report/report.component';
import { StimulsoftViewerModule } from 'stimulsoft-viewer-angular';
import { TechnicalInspectionComponent } from './steps/technical-inspection/technical-inspection.component';
import { Step11Component } from './steps/step11/step11.component';
import { RegistryFilesModelComponent } from './registry-files-model/registry-files-model.component';

import { PrimengModule } from '../../shared/primeng.module';
import { EmployeeDetailsOracleComponent } from '../../shared/components/employee-details-oracle/employee-details-oracle.component';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';
import { ViewAssetDeliveryManagementComponent } from './view-asset-delivery-management/asset-delivery-management.component';


@NgModule({
  declarations: [
    AssetDeliveryListComponent,
    AssetDeliveryManagementComponent,
    ViewAssetDeliveryManagementComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    CostCenterModalComponent,
    TechnicalInspectionModalComponent,
    ReportComponent,
    TechnicalInspectionComponent,
    Step11Component,
    RegistryFilesModelComponent,

  ],
  imports: [
    CommonModule,
    AssetDeliveryRoutingModule,
    /* InlineSVGModule, */
    NgbTooltipModule,
    PrimengModule,
    ReactiveFormsModule,
    StimulsoftViewerModule,
    TransactionHistoryComponent,
    EmployeeDetailsOracleComponent
  ]
})
export class AssetDeliveryModule { }
