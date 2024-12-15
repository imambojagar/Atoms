import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralReportsRoutingModule } from './general-reports-routing.module';
import { SharedModule } from 'primeng/api';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, GeneralReportsRoutingModule],
})
export class GeneralReportsModule {}
