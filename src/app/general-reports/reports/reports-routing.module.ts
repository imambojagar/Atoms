import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  {
    path: 'service-request-report',
    component: ServiceRequestReportComponent,
  },
  {
    path: 'wo-table',
    component: WoTableComponent,
  },
  {
    path: 'status-table',
    component: StatusTableComponent,
  },
  {
    path: 'alert-report',
    component: AlertReportComponent,
  },
  {
    path: 'creates-and-closed',
    component: CreatesAndClosedComponent,
  },
  {
    path: 'Engineer-KPIs-1',
    component: EngineerKPIs1Component,
  },
  {
    path: 'Engineer-KPIs-2',
    component: EngineerKPIs2Component,
  },
  {
    path: 'Engineer-KPIs-3',
    component: EngineerKPIs3Component,
  },
  {
    path: 'medical-gas-dashboard',
    component: RecurrentTaskComponent,
  },
  {
    path: 'TRAFInProgressReport',
    component: TRAFInProgressReportComponent,
  },
  {
    path: 'budgetDashboardReport',
    component: BudgetDashboardReportComponent,
  },
  {
    path: 'FullCylinders',
    component: FullyCylinderComponent,
  },
  {
    path: 'EmptyCylinders',
    component: EmptyCylinderComponent,
  },
  {
    path: 'DemoRequest',
    component: DemoRequestReportComponent,
  },
  {
    path: 'medical-gas-daily-report',
    component: MedicalGasDailyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
