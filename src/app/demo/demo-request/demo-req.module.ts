import { TrPipe } from './../../shared/pipes/tr.pipe';
import { PrimengModule } from './../../shared/primeng.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoReqRoutingModule } from './demo-req-routing.module';
import { DemoReqControlComponent } from './demo-req-control/demo-req-control.component';
import { DemoReqViewComponent } from './demo-req-view/demo-req-view.component';
import { TranslationModule } from '../../modules/i18n/translation.module';
import { AttachmentsComponent } from '../../shared/components/attachments/attachments.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { TranslatePipe } from '@ngx-translate/core';


@NgModule({
  declarations: [DemoReqControlComponent, DemoReqViewComponent,],
  imports: [CommonModule, DemoReqRoutingModule, SharedModule, ReactiveFormsModule, FormsModule, PrimengModule, TrPipe, TranslationModule, AttachmentsComponent, SkeletonLoaderComponent],
  exports: [DemoReqControlComponent, PrimengModule, TrPipe, TranslationModule,],
  providers: [TranslatePipe]
})
export class DemoReqModule { }
