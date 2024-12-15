import { Routes } from '@angular/router';
/* import { Error403Component } from './modules/errors/403.component';
import { Error404Component } from './modules/errors/404.component';
import { Error500Component } from './modules/errors/500.component'; */
import { LoginComponent } from './modules/auth/login/login.component';
/* import { LayoutModule } from './layout/layout.module'; */
import { AdminLayoutComponent } from './layout/admin-layout/main-layout/admin-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';
/* import { AssetsModule } from './assets/assets.module'; */
// import { DashboardComponent } from './admin-layout/dashboard/dashboard.component';
// import { WorkOrderManagementComponent } from './maintenance/workorder/work-order-management/work-order-management.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: AdminLayoutComponent,
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'assets',
        loadChildren: () =>
          import('./assets/assets.module').then((m) => m.AssetsModule),
      },
      {
        path: 'systemsettings',
        loadChildren: () =>
          import('./system-configration/system-configration.module').then(
            (m) => m.SystemConfigrationModule
          ),
      },
      {
        path: 'maintenance',
        loadChildren: () =>
          import('./maintenance/maintenance.module').then(
            (m) => m.MaintenanceModule
          ),
      },

      {
        path: 'demo',
        loadChildren: () =>
          import('./demo/demo.module').then((module) => module.DemoModule),
      },
      {
        path: 'reference-table',
        loadChildren: () =>
          import('./reference-table/reference-table.module').then(
            (m) => m.ReferenceTableModule
          ),
      },
      {
        path: 'human-resources',
        loadChildren: () =>
          import('./human-resources/human-resources.module').then(
            (m) => m.HumanResourcesModule
          ),
      },
      {
        path: 'store',
        loadChildren: () =>
          import('./store/store.module').then((m) => m.StoreModule),
      },
      {
        path: 'general-reports',
        loadChildren: () =>
          import('./general-reports/general-reports.module').then(
            (m) => m.GeneralReportsModule
          ),
      },
      {
        path: 'errors',
        loadChildren: () =>
          import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
  /* ] */
];
