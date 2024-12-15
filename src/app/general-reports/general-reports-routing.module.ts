import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'invoice-collection',
    loadChildren: () =>
      import(
        './invoice-collection/invoice-collection.module'
      ).then((module) => module.InvoiceCollectionModule),
  },
  {
    path: 'invoice-report',
    loadChildren: () =>
      import(
        './invoice-in-po/invoice-in-po.module'
      ).then((module) => module.InvoiceInPoModule),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import(
        './reports/reports.module'
      ).then((module) => module.ReportsModule),
  },
  {
    path: 'dashboards',
    loadChildren: () =>
      import(
        './dashboards/dashboards.module'
      ).then((module) => module.DashboardsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralReportsRoutingModule {}
