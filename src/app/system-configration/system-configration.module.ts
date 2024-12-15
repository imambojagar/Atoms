import { LookupControlModule } from './lookup-control/lookup-control.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemConfigrationRoutingModule } from './system-configration-routing.module';
import { PrimengModule } from '../shared/primeng.module';
import { SharedModule } from '../shared/shared.module';
import { RolesModule } from './roles/roles.module';
import { InstructionDescriptionModule } from './instruction-description/instruction-description.module';
import { InstructionTextModule } from './instruction-text/instruction-text.module';
import { DefectsControlComponent } from './defects-control/defects-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DefectsControlComponent],
  imports: [PrimengModule, SharedModule, LookupControlModule, RolesModule, InstructionDescriptionModule, InstructionTextModule,
    FormsModule, ReactiveFormsModule,
    CommonModule,
    SystemConfigrationRoutingModule
  ]
})
export class SystemConfigrationModule { }
