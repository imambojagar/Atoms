import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GatePassRoutingModule } from './gate-pass-routing.module';
import { GatePassControlComponent } from './gate-pass-control/gate-pass-control.component';
import { GatePassViewComponent } from './gate-pass-view/gate-pass-view.component';
import { SharedModule } from '../../shared/shared.module';
import { PrimengModule } from '../../shared/primeng.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [GatePassControlComponent, GatePassViewComponent],
  imports: [CommonModule, GatePassRoutingModule, SharedModule, PrimengModule, TranslateModule, ReactiveFormsModule, FormsModule],
})
export class GatePassModule { }
