import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RolesRoutingModule } from './roles-routing.module';
import { RolesControlComponent } from './roles-control/roles-control.component';
import { SharedModule } from '../../shared/shared.module';
import { PrimengModule } from '../../shared/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, RolesRoutingModule, SharedModule, PrimengModule,
    FormsModule, ReactiveFormsModule,],
  declarations: [RolesControlComponent],
})
export class RolesModule { }
