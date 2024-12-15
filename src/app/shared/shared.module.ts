import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TableComponent } from './components/table/table.component';
import { TranslationModule } from '../modules/i18n/translation.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponentComponent } from './components/search-component/search-component.component';
import { TrPipe } from './pipes/tr.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInput,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatPaginator,
    MatInputModule,
    MatOptionModule,
    MatProgressBarModule,
    MatSidenavContainer,
    MatSidenav,
    MatDatepickerModule,
    MatOption,
    NgApexchartsModule,
    TranslationModule, NgxPaginationModule,

    ReactiveFormsModule, FormsModule, TrPipe

  ],
  exports: [
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInput,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatPaginator,
    MatInputModule,
    MatOptionModule,
    MatProgressBarModule,
    MatSidenavContainer,
    MatSidenav,
    MatDatepickerModule,
    MatOption,
    NgApexchartsModule,
    TrPipe
  ]
})
export class SharedModule { }
