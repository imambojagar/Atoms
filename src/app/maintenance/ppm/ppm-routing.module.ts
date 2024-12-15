
import { EditDeletePpmEntryComponent } from './ppm-entry/edit-delete-ppm-entry/edit-delete-ppm-entry.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPpmComponent } from './add-ppm/add-ppm.component';
import { EditDeletePpmComponent } from './edit-delete-ppm/edit-delete-ppm.component';
import { ViewPpmEntryComponent } from './ppm-entry/view-ppm-entry/view-ppm-entry.component';
import { ViewPpmComponent } from './view-ppm/view-ppm.component';
import { MultiUpdatePpmEntriesComponent } from './ppm-entry/multi-update-ppm-entries/multi-update-ppm-entries.component';
import { ReportComponent } from './ppm-entry/report/report.component';

const routes: Routes = [
  { path: 'add-control', component: AddPpmComponent },
  { path: '', component: ViewPpmComponent },
  { path: 'edit-control', component: EditDeletePpmComponent },
  { path: 'ppm-entry', component: ViewPpmEntryComponent },
  { path: 'ppm-entry/edit-control', component: EditDeletePpmEntryComponent },
  { path: 'ppm-entry/multiupdate-control', component: MultiUpdatePpmEntriesComponent },
  { path: 'ppm-entry/report', component: ReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PpmRoutingModule { }
