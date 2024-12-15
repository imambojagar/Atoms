import { AssetFormService } from './../../systemsettings/assets/asset-form.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PpmRoutingModule } from './ppm-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { AddPpmComponent } from './add-ppm/add-ppm.component';
import { ViewPpmComponent } from './view-ppm/view-ppm.component';
import { EditDeletePpmComponent } from './edit-delete-ppm/edit-delete-ppm.component';
import { ViewPpmEntryComponent } from './ppm-entry/view-ppm-entry/view-ppm-entry.component';
import { EditDeletePpmEntryComponent } from './ppm-entry/edit-delete-ppm-entry/edit-delete-ppm-entry.component';
import { MultiUpdatePpmEntriesComponent } from './ppm-entry/multi-update-ppm-entries/multi-update-ppm-entries.component';
import { StimulsoftViewerModule } from 'stimulsoft-viewer-angular';
import { ReportComponent } from './ppm-entry/report/report.component';



@NgModule({
  declarations: [
    AddPpmComponent,
    ViewPpmComponent,
    EditDeletePpmComponent,
    ViewPpmEntryComponent,
    EditDeletePpmEntryComponent,
    MultiUpdatePpmEntriesComponent,
    ReportComponent

  ],
  imports: [
    CommonModule,
    PpmRoutingModule,
    SharedModule,
    PrimengModule,
    StimulsoftViewerModule
  ],
  providers:[AssetFormService]
})
export class PpmModule { }
