import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AddEditRotaComponent } from './add-edit-rota/add-edit-rota.component';
import { RotadialogComponent } from './rotadialog/rotadialog.component';
import { NoDataComponent } from '../../shared/components/no-data/no-data.component';
import { RotaComponent } from './rota.component';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [RotaComponent, AddEditRotaComponent, RotadialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimengModule,
    FormsModule,
    FullCalendarModule,
    NoDataComponent,
    DialogModule,
    DynamicDialogModule
  ],
  providers: [DialogService], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyRotaModule {}
