import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { CmWoAgingVsStatusPerSiteComponent } from './cm-wo-aging-vs-status-per-site/cm-wo-aging-vs-status-per-site.component';
import { MissionCriticalWoPerSiteComponent } from './mission-critical-wo-per-site/mission-critical-wo-per-site.component';
import { PmWoSiteWiseOpenedClosedOverdueComponent } from './pm-wo-site-wise-opened-closed-overdue/pm-wo-site-wise-opened-closed-overdue.component';
import { PrimengModule } from '../../shared/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CmWoAgingVsStatusPerSiteComponent,
    MissionCriticalWoPerSiteComponent,
    PmWoSiteWiseOpenedClosedOverdueComponent,
  ],
  imports: [
    CommonModule,
    DashboardsRoutingModule,
    PrimengModule,
    ReactiveFormsModule
  ]
})
export class DashboardsModule { }
