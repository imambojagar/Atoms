import { CommonModule } from '@angular/common';
import { Component, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
// import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
// import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../shared/services/common_service';
import { SharedModule } from '../../shared/shared.module';

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
  selector: 'app-add-new-employee',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, CommonModule, RouterLink,  ReactiveFormsModule,MatDatepickerModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-new-employee.component.html',
  styleUrl: './add-new-employee.component.scss'
})
export class AddNewEmployeeComponent {

  isLoading: boolean = false;

  department: any[] = [
    { id: 1, name: 'IT'},
    { id: 2, name: 'Design'}
  ];

  supervisor: any[] = [
    { id: 1, name: 'Mahmoud'},
    { id: 2, name: 'Imam'}
  ];

  qualification: any[] = [
    { id: 1, name: 'Graduates'},
    { id: 2, name: 'Masters'}
  ];

  experience: any[] = [
    { id: 1, name: '5+'},
    { id: 2, name: '10+'}
  ];

  extension: any[] = [
    { id: 1, name: '1'},
    { id: 2, name: '2'}
  ];

  mobileNumber: any[] = [
    { id: 1, name: '1234567890'},
    { id: 2, name: '0987654321'}
  ];

  phoneNumber: any[] = [
    { id: 1, name: '12121212'},
    { id: 2, name: '55566666'}
  ];

  homeAddress: any[] = [
    { id: 1, name: 'Riyadh'},
    { id: 2, name: 'N/A'}
  ];

  modility: any[] = [
    { id: 1, name: 'Others'},
    { id: 2, name: 'None'}
  ];

  subModility: any[] = [
    { id: 1, name: 'Others'},
    { id: 2, name: 'None'}
  ];

  serviceTeam: any[] = [
    { id: 1, name: 'Others'},
    { id: 2, name: 'None'}
  ];

  modilityRisk: any[] = [
    { id: 1, name: 'Others'},
    { id: 2, name: 'None'}
  ];

  skillLevel: any[] = [
    { id: 1, name: 'Expert'},
    { id: 2, name: 'Intermediate'},
    { id: 2, name: 'Beginner'}
  ];

  sites: any[] = [
    { id: 1, name: 'Al Qassim Hospital, Bahrain, Sahafa'},
    { id: 2, name: 'International Hospital'}
  ];

  assetGroups: any[] = [
    { id: 1, name: 'Al Qassim Hospital, Bahrain, Sahafa'},
    { id: 2, name: 'International Hospital'}
  ];

  language: any[] = [
    { id: 1, name: 'English'},
    { id: 2, name: 'Arabic'}
  ];

  selectedItemsDepartment = this.department;
  selectedItemsSupervisor = this.supervisor;
  selectedItemsQualification = this.qualification;
  selectedItemsExperience = this.experience;
  selectedItemsExtension = this.extension;
  selectedItemsMobileNumber = this.mobileNumber;
  selectedItemsPhoneNumber = this.phoneNumber;
  selectedItemsHomeAddress = this.homeAddress;
  selectedItemsModility = this.modility;
  selectedItemsSubModility = this.subModility;
  selectedItemsServiceTeam = this.serviceTeam;
  selectedItemsModilityRisk = this.modilityRisk;
  selectedItemsSkillLevel = this.skillLevel;
  selectedItemsSites = this.sites;
  selectedItemsAssetGroups = this.assetGroups;
  selectedItemsLanguage = this.language;


  selectedDepartment = new FormControl(this.department[0].id, [Validators.required]);
  selectedSupervisor = new FormControl(this.supervisor[0].id, [Validators.required]);
  selectedQualification = new FormControl(this.qualification[0].id, [Validators.required]);
  selectedExperience = new FormControl(this.experience[0].id, [Validators.required]);
  selectedExtension = new FormControl(this.extension[0].id, [Validators.required]);
  selectedMobileNumber = new FormControl(this.mobileNumber[0].id, [Validators.required]);
  selectedPhoneNumber = new FormControl(this.phoneNumber[0].id, [Validators.required]);
  selectedHomeAddress = new FormControl(this.homeAddress[0].id, [Validators.required]);
  selectedModility = new FormControl(this.modility[0].id, [Validators.required]);
  selectedSubModility = new FormControl(this.subModility[0].id, [Validators.required]);
  selectedServiceTeam = new FormControl(this.serviceTeam[0].id, [Validators.required]);
  selectedModilityRisk = new FormControl(this.modilityRisk[0].id, [Validators.required]);
  selectedSkillLevel = new FormControl(this.skillLevel[0].id, [Validators.required]);
  selectedSites = new FormControl(this.sites[0].id, [Validators.required]);
  selectedAssetGroups = new FormControl(this.assetGroups[0].id, [Validators.required]);
  selectedLanguage = new FormControl(this.language[0].id, [Validators.required]);
  /* selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);
  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]); */

  matcher = new MyErrorStateMatcher();

  constructor(private elementRef: ElementRef, private commonService: CommonService,
    // matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer
  ){
    // matIconRegistry.addSvgIcon('calendar_icon', domSanitizer.bypassSecurityTrustResourceUrl('/Calendar.svg'));
  }


  ngOnInit() {
    const nativeElement = this.elementRef.nativeElement;
    const customselect = nativeElement.querySelectorAll( '.mat-mdc-select-arrow' );
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
        breadcrumText: 'Employees\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Add New Employee' 
      }
    });
  }
  
  
  

  onKeyDepartment(event: any) {
    let value = event.target.value;
    this.selectedItemsDepartment = this.search(value, this.department);
  }

  onKeySupervisor(event: any) {
    let value = event.target.value;
    this.selectedItemsSupervisor = this.search(value, this.supervisor);
  }

  onKeyQualification(event: any) {
    let value = event.target.value;
    this.selectedItemsQualification = this.search(value, this.qualification);
  }

  onKeyExperience(event: any) {
    let value = event.target.value;
    this.selectedItemsExperience = this.search(value, this.experience);
  }

  onKeyExtension(event: any) {
    let value = event.target.value;
    this.selectedItemsExtension = this.search(value, this.extension);
  }

  onKeyMobileNumber(event: any) {
    let value = event.target.value;
    this.selectedItemsMobileNumber = this.search(value, this.mobileNumber);
  }

  onKeyPhoneNumber(event: any) {
    let value = event.target.value;
    this.selectedItemsPhoneNumber = this.search(value, this.phoneNumber);
  }

  onKeyHomeAddress(event: any) {
    let value = event.target.value;
    this.selectedItemsHomeAddress = this.search(value, this.homeAddress);
  }

  onKeyModility(event: any) {
    let value = event.target.value;
    this.selectedItemsModility = this.search(value, this.modility);
  }

  onKeySubModility(event: any) {
    let value = event.target.value;
    this.selectedItemsSubModility = this.search(value, this.subModility);
  }

  onKeyServiceTeam(event: any) {
    let value = event.target.value;
    this.selectedItemsServiceTeam = this.search(value, this.serviceTeam);
  }

  onKeyModilityRisk(event: any) {
    let value = event.target.value;
    this.selectedItemsModilityRisk = this.search(value, this.modilityRisk);
  }

  onKeySkillLevel(event: any) {
    let value = event.target.value;
    this.selectedItemsSkillLevel = this.search(value, this.skillLevel);
  }

  onKeySites(event: any) {
    let value = event.target.value;
    this.selectedItemsSites = this.search(value, this.sites);
  }

  onKeyAsseGroups(event: any) {
    let value = event.target.value;
    this.selectedItemsAssetGroups = this.search(value, this.assetGroups);
  }

  onKeyLanguage(event: any) {
    let value = event.target.value;
    this.selectedItemsLanguage = this.search(value, this.language);
  }

  search(value: string, select_array: any) {
    let filter = value.toLowerCase();
    return select_array.filter((option : any) => option.name.toLowerCase().startsWith(filter));
  }

}
