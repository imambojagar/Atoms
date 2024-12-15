import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ServiceRequestReportComponent } from './service-request-report/service-request-report.component';
import { WoTableComponent } from './wo-table/wo-table.component';
import { StatusTableComponent } from './status-table/status-table.component';
import { AlertReportComponent } from './alert-report/alert-report.component';
import { CreatesAndClosedComponent } from './creates-and-closed/creates-and-closed.component';
import { EngineerKPIs1Component } from './engineer-kpis1/engineer-kpis1.component';
import { EngineerKPIs2Component } from './engineer-kpis2/engineer-kpis2.component';
import { EngineerKPIs3Component } from './engineer-kpis3/engineer-kpis3.component';
import { TRAFInProgressReportComponent } from './TRAF-dashboard/traf-in-progress-report/traf-in-progress-report.component';
import { BudgetDashboardReportComponent } from './TRAF-dashboard/budget-dashboard-report/budget-dashboard-report.component';
import { RecurrentTaskComponent } from './recurrent-task/recurrent-task.component';
import { FullyCylinderComponent } from './fully-cylinder/fully-cylinder.component';
import { EmptyCylinderComponent } from './empty-cylinder/empty-cylinder.component';
import { DemoRequestReportComponent } from './demo-request-report/demo-request-report.component';
import { MedicalGasDailyComponent } from './medical-gas-daily/medical-gas-daily.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng.module';

@NgModule({
  declarations: [
    ServiceRequestReportComponent,
    WoTableComponent,
    StatusTableComponent,
    AlertReportComponent,
    CreatesAndClosedComponent,
    EngineerKPIs1Component,
    EngineerKPIs2Component,
    EngineerKPIs3Component,
    TRAFInProgressReportComponent,
    BudgetDashboardReportComponent,
    RecurrentTaskComponent,
    FullyCylinderComponent,
    EmptyCylinderComponent,
    DemoRequestReportComponent,
    MedicalGasDailyComponent,
  ],
  imports: [CommonModule, ReportsRoutingModule, ReactiveFormsModule, PrimengModule],
})
export class ReportsModule { }
