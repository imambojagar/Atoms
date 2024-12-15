import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component';
import { LoaderService } from '../../services/loader.service';

@NgModule({
  imports: [CommonModule, LoaderComponent],
  declarations: [],
  exports: [LoaderComponent],
  providers: [LoaderService],
})
export class LoaderModule {}
