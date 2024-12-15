import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmWoAgingVsStatusPerSiteComponent } from './cm-wo-aging-vs-status-per-site/cm-wo-aging-vs-status-per-site.component';
import { MissionCriticalWoPerSiteComponent } from './mission-critical-wo-per-site/mission-critical-wo-per-site.component';
import { PmWoSiteWiseOpenedClosedOverdueComponent } from './pm-wo-site-wise-opened-closed-overdue/pm-wo-site-wise-opened-closed-overdue.component';

const routes: Routes = [
  {
    path: 'cm-wo-aging-vs-status-per-site',
    component: CmWoAgingVsStatusPerSiteComponent,
  },
  {
    path: 'mission-critical-wo-per-site',
    component: MissionCriticalWoPerSiteComponent,
  },
  {
    path: 'pm-wo-site-wise-opened-closed–overdue',
    component: PmWoSiteWiseOpenedClosedOverdueComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule {}
