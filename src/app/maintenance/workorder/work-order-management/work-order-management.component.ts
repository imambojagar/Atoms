import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert-service';
import { AlertMessageComponent } from '../../../shared/components/alert-message/alert-message.component';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonService } from '../../../shared/services/common_service';

interface City {
  name: string;
  code: string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-work-order-management',
  standalone: true,
  imports: [FormsModule, AlertMessageComponent, CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './work-order-management.component.html',
  styleUrl: './work-order-management.component.scss',
  providers: [AlertService]
})
export class WorkOrderManagementComponent {

  isLoading: boolean = false;

  sites: any[] = [
    { id: 1, name: 'Al Qassim Hospital, Bahrain, Sahafa' },
    { id: 1, name: 'International Hospital' }
  ];

  selectedItems = this.sites;

  cities: City[] | undefined;
  selectedCity: City | undefined;

  selected = new FormControl(this.sites[0].id, [Validators.required]);
  /* selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);
  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]); */

  matcher = new MyErrorStateMatcher();

  constructor(public alertService: AlertService, private elementRef: ElementRef,
    private commonService: CommonService,
  ) { }


  ngOnInit() {
    const nativeElement = this.elementRef.nativeElement;
    const customselect = nativeElement.querySelectorAll('.mat-mdc-select-arrow');
    customselect.forEach((element: any) => {
      element.innerHTML = '';
      element.innerHTML = '<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.56269 7.48187C6.32745 7.48187 6.09225 7.39206 5.9129 7.2128L0.269257 1.56909C-0.0897524 1.21008 -0.0897524 0.628012 0.269257 0.269148C0.628121 -0.0897161 1.21008 -0.0897161 1.56912 0.269148L6.56269 5.26301L11.5563 0.269323C11.9153 -0.0895417 12.4972 -0.0895417 12.856 0.269323C13.2152 0.628187 13.2152 1.21026 12.856 1.56927L7.21247 7.21297C7.03304 7.39226 6.79783 7.48187 6.56269 7.48187Z"fill="#3B3D4A" /></svg>';
    });

    this.dataToggle();
  }

  dataToggle() {
    this.commonService.updateConfig({
      appConfig: {
        showProgressBar: !this.isLoading,
        breadcrumText: 'Work Order'
      }
    });
  }

  onKey(event: any) {
    let value = event.target.value;
    this.selectedItems = this.search(value, this.sites);
  }

  search(value: string, select_array: any) {
    let filter = value.toLowerCase();
    return select_array.filter((option: any) => option.name.toLowerCase().startsWith(filter));
  }

}
