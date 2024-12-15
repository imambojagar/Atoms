import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common'; 
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { BubblePaginationDirective } from '../../shared/directives/bubble-pagination.directive';
import { CustomDropdownComponent } from '../../shared/components/custom-dropdown/custom-dropdown.component';
 

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    NgClass,
    RouterLink,
    BubblePaginationDirective,
    CustomDropdownComponent,
    NgbPopoverModule,
  ]
})
export class AdminLayoutModule { }
