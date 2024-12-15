import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PrimengModule } from '../../../shared/primeng.module';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionHistory } from '../../../models/transaction-history';
import { EmployeeModel, UserCertifications } from '../employee-model';
import { environment } from '../../../../environments/environment.development';
import {
  FullRoleInfo,
  userCertifications,
} from '../../../models/employee-model';
import { ModelDefinitionModel } from '../../../models/model-definition-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomerService } from '../../../services/customer.service';
import { LookupService } from '../../../services/lookup.service';
import { LanguagesService } from '../../../services/languages.service';
import { AssetGroupService } from '../../../services/asset-group.service';
import { ModelService } from '../../../services/model-definition.service';
import { buildEmployeeForm } from '../employee-formbuilder';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import { firstValueFrom } from 'rxjs';
import validateForm from '../../../shared/helpers/validateForm';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TrPipe } from '../../../shared/pipes/tr.pipe';
import { AttachmentsComponent } from '../../../shared/components/attachments/attachments.component';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    TrPipe,
    AttachmentsComponent,
    TransactionHistoryComponent,
    SkeletonLoaderComponent,
  ],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss',
  providers: [TranslatePipe],
})
export class EditEmployeeComponent implements OnChanges {
  @Input('showmodal') showAddModal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('emp_id') emp_id: any;
  @Input('emp_index') emp_index: any;
  @Input('status') status: any;
  @Input('editData') editData: any;

  transactionHistory!: TransactionHistory;
  PAGE_TITLE: string = 'user';
  model!: EmployeeModel;

  employeeForm!: FormGroup;
  tabIndex: number = 0;
  userName!: string | null;
  isOk: boolean = false;
  inAddMode: boolean = false;
  inEditMode: boolean = false;
  inViewMode: boolean = false;

  baseUrl: string = environment.BaseURL.replace('api/', 'attachment/');

  //dropdown declaration
  DepartmentList: any[] = [];
  customersList = [];
  assetGroupsList = [];

  qualfilcations: any[] = [];
  modility: any[] = [];
  subModility: any[] = [];
  serviceTeam: any[] = [];
  modilityRisk: any[] = [];
  skillLevel: any[] = [];
  langagesList: any[] = [];
  defaultLookup = {
    id: null,
    name: 'None',
    value: 0,
  };

  rolesList: FullRoleInfo[] = [];

  codes: any[] = [];
  codeName: any[] = [];

  createdOn: any;
  modifiedOn: any;

  certficateImg: any[] = []; //used to display file link

  photoName: string[] = [];
  attachments: any;
  attachmentName: any[] = [];

  showMessage: boolean = true;
  isSaving: boolean = false;
  pressedSaveButton: boolean = false;

  managersList: any[] = [];
  firstLineManagersList: any[] = [];
  secLineManagersList: any[] = [];
  selectedEmployeesList: any[] = [];

  rolesValues: any[] = [];
  ModelDefinitions: ModelDefinitionModel[] = [];
  constructor(
    private router: ActivatedRoute,
    // private authService: AuthService,
    private route: Router,
    private formbuilder: FormBuilder,
    private api: EmployeeService,
    private messageService: MessageService,
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private lookupService: LookupService,
    private languagesService: LanguagesService,
    private assetGroupService: AssetGroupService,
    private modelService: ModelService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  Init(): void {
    this.employeeForm = this.formbuilder.group({
      assetGroupsId: [null, Validators.required],
      customersId: [null, Validators.required],
    });

    this.userName = null;
    this.tabIndex = this.emp_index; 
    if (this.editData?.data) this.userName = this.editData.data;

    // this.userName = null;
    // this.inAddMode = true;
    // this.tabIndex = this.emp_index; 
    // if (this.editData?.data) {
    //   this.userName = this.editData.data;
    //   this.inEditMode = false;
    // }
    this.getLookups();
    this.buildEmployeeForm();
  }

  //#region Form Building
  buildEmployeeForm() {
    this.searchCustomer({ query: null });
    this.searchAssetGroup({ query: null });
    if (this.userName == null) {
      this.model = {
        userName: undefined,
        joiningDate: null,
        roles: [],
        userCertifications: [],
      };
      
      this.employeeForm = buildEmployeeForm(this.model);
      this.getCodes();

      this.inAddMode = true;
      this.inEditMode = false;
      this.inViewMode = false;
    } else {
      if (this.tabIndex == 0) {
        this.inViewMode = true;
        this.inAddMode = false;
        this.inEditMode = false;
      } else {
        this.inEditMode = true;
        this.inAddMode = false;
        this.inViewMode = false;
      }
      this.getEmployeeData();
    }
  }
  // buildEmployeeForm() {
  //   this.searchCustomer({ query: null });
  //   this.searchAssetGroup({ query: null });

  //   console.log('emp_id', this.emp_id);
  //   console.log('userName', this.userName);
  //   console.log('tabIndex', this.tabIndex);
  //   this.inAddMode = true;
  //   if (this.userName == null) {
  //     this.model = {
  //       userName: undefined,
  //       joiningDate: null,
  //       roles: [],
  //       userCertifications: [],
  //     };

  //     this.employeeForm = buildEmployeeForm(this.model);
  //     this.getCodes();
  //   } else {
  //   }
  // }

  getEmployeeData() {
    this.api.getSingleEmployee(this.userName).subscribe((res: any) => {
      this.model = res;
      this.transactionHistory = new TransactionHistory();
      Object.assign(this.transactionHistory, res.data);
      this.getCodes(this.model.userCodes);
      this.createdOn = this.model.createdOn;
      this.modifiedOn = this.model.modifiedOn;
      if (this.model.fullRoles) {
        let myRoles: any[] = [];
        this.model.fullRoles.forEach((role: any) => {
          myRoles.push(role.name);
        });
        this.model.roles = [...myRoles];
      }
      if (this.model.profilePhotoName) {
        this.photoName[0] = this.model.profilePhotoName;
      }
      if (this.model.userCustomers) {
        let mySites: any[] = [];
        this.model.userCustomers.forEach((site: any) => {
          mySites.push(site.customerId);
        });
        this.model.customersId = [...mySites];
        var event: any;
        event = { value: this.model.customersId };
        this.onCustomerChange(event);
      }
      if (this.model.userAssetGroups) {
        let myAssetGroups: any[] = [];
        this.model.userAssetGroups.forEach((assetGroup: any) => {
          myAssetGroups.push(assetGroup.assetGroupId);
        });
        this.model.assetGroupsId = [...myAssetGroups];
      }
      if (this.model.departments) {
        let myDepsrtments: any[] = [];
        this.model.departments.forEach((department: any) => {
          myDepsrtments.push(department.id);
        });
        this.model.departmentIds = [...myDepsrtments];
      }
      if (this.model.joiningDate) {
        this.model.joiningDate = dateHelper.handleDateApi(
          this.model.joiningDate
        );
      }
      if (this.model.modilityId) {
        this.model.modility = this.model.modilityId;
      }
      if (this.model.serviceTeamId) {
        this.model.serviceTeam = this.model.serviceTeamId;
      }
      this.employeeForm = buildEmployeeForm(this.model);
      this.setExsitingCer(this.model.userCertifications);
    });
  }
  //#endregion

  //#region Checks
  get employeeControls() {
    return this.employeeForm.controls;
  }

  confirmPasswordMatch() {
    const password: string = this.employeeForm.value.password; // get password from our password form control
    const confirmPassword: string = this.employeeForm.value.cPassword; // get password from our confirmPassword form control

    if (password !== confirmPassword) {
      this.employeeForm.controls['cPassword'].setErrors({ mismatch: true });
    } else {
      // if passwords match, don't return an error.
      return null;
    }
  }

  emailValidation() {
    let email = this.employeeForm.value.email;

    let emailRegx = /^([a-zA-Z0-9\._]+)@([a-zA-Z]+)+.([a-zA-Z]+)(.[a-zA-Z]+)?$/;

    if (!emailRegx.test(email)) {
      this.showMessage = false;
      this.employeeForm.invalid;
    } else {
      this.showMessage = true;
    }
  }

  changeTabIndex(tab: any) {
    if (tab.index == 1) {
      this.inViewMode = false;
      this.inEditMode = true;
    } else {
      this.inViewMode = true;
      this.inEditMode = false;
    }
  }

  // changeTabIndex(tab: any) {
  //   if (tab.index == 1 && this.status == 'edit') {
  //     this.inAddMode = false;
  //     this.inEditMode = true;
  //   } else {
  //     this.inAddMode = true;
  //     this.inEditMode = false;
  //   }
  // }

  onChangeCheckbox(e: any) {
    let checked = this.employeeForm.value.roles;
    if (checked.indexOf(e.name) == -1) {
      checked.push(e.name);
      this.rolesValues.push(e.fixedName);
    } else {
      let i = checked.indexOf(e.name);
      checked.splice(i, 1);
      this.rolesValues.splice(i, 1);
    }
  }
  //#endregion

  //#region User Dynamic codes
  userCodes() {
    return (<FormArray>this.employeeForm.get('userCodes')).controls;
  }

  getCodes(code?: any) {
    this.api.getLookups({ queryParams: 408 }).subscribe((res: any) => {
      this.codes = res.data;
      if (code != null && code.length != 0) {
        for (let i = 0; i < this.codes.length; i++) {
          const formGroup = this.formbuilder.group({
            id: code[i]?.id ?? [],
            userId: code[i]?.userId ?? [],
            codeTypeId: [this.codes[i].id],
            codeValue: code[i]?.codeValue ?? [],
          });
          (this.employeeForm.get('userCodes') as FormArray).push(formGroup);
          this.codeName.push(this.codes[i].name);
        }
      } else {
        for (let i = 0; i < this.codes.length; i++) {
          (this.employeeForm.get('userCodes') as FormArray).push(
            this.formbuilder.group({
              id: 0,
              userId: 0,
              codeTypeId: [this.codes[i].id],
              codeValue: [],
            })
          );

          this.codeName.push(this.codes[i].name);
        }
      }
    });
  }
  //#endregion

  //#region Attachments Management
  attachmentReady(event: any) {
    this.employeeForm.get('profilePhotoName')?.setValue(event[0]);
  }
  cerAttachmentReady(event: any, index: number) {
    const itemControls = <FormArray>(
      this.employeeForm.controls['userCertifications']
    );
    const itemFormGroup = <FormGroup>itemControls.controls[index];
    itemFormGroup.controls['attachmentName'].setValue(event[0]);
  }
  formateAttachment(attachment: string) {
    if (attachment.indexOf('/')) {
      let x = attachment.split('/').slice(-1)[0];
      return x;
    } else {
      return attachment;
    }
  }
  //#endregion

  //#region Certificates Management
  setExsitingCer(certficate: UserCertifications[]) {
    if (!certficate) {
      console.error('certficate is null or undefined');
      return; // Exit the function if certficate is not valid
    }

    let u = new UserCertifications();
    certficate.forEach((c, i) => {
      u = new UserCertifications();
      u.name = c.name;
      u.modelDefinitionId = c.modelDefinitionId;
      u.modelDefinationName = c.modelDefinationName;
      u.modelDefinitionId1 = {
        id: c.modelDefinitionId,
        modelDefCode: c.modelDefinationName,
      }; //
      if (c.expireDate != null) {
        u.expireDate = new Date(c.expireDate);
      }
      if (c.attachmentName) {
        u.attachmentName = c.attachmentName;
        this.attachmentName[0] = u.attachmentName;
        this.certficateImg.push(this.baseUrl + c.attachmentName);
      }
      (this.employeeForm.get('userCertifications') as FormArray).push(
        this.formbuilder.group(u)
      );
    });
  }
  certificationsControl() {
    return (<FormArray>this.employeeForm.get('userCertifications')).controls;
  }
  removeCertificate(index: number) {
    (this.employeeForm.get('userCertifications') as FormArray).removeAt(index);
  }
  addMoreCertificates() {
    let uc = new userCertifications();
    (this.employeeForm.get('userCertifications') as FormArray).push(
      this.formbuilder.group(uc)
    );
  }
  //#endregion

  //#region Sites Array Management
  searchCustomer($event: any) {
    this.api
      .GetCustomersForSysAdmin({ custName: $event.query })
      .subscribe((res: any) => (this.customersList = res.data));
  }
  onSelectCustomer($event: any, formGroup: any) {
    formGroup.controls.customerId.setValue($event.id);
  }
  //#endregion

  //#region Asset Groups
  searchAssetGroup($event: any) {
    // this.assetGroupService
    //   .searchAssetGroups({})
    //   .subscribe((res) => (this.assetGroupsList = res.data));
    this.assetGroupsList = JSON.parse(
      localStorage.getItem('userAssetGroups') || '{}'
    );
  }
  //#endregion

  //#region Lookups
  getLookups() {
    // this.api.getDepartments({}).subscribe((data: any) => {
    //   this.DepartmentList = data;
    // });
    this.api.getRoles().subscribe((res: any) => {
      this.rolesList = res;
    });

    this.api.getQualifications().subscribe((res: any) => {
      res.data.unshift(this.defaultLookup);
      this.qualfilcations = res.data;
    });

    this.api.getServiceTeam().subscribe((res: any) => {
      res.data.unshift(this.defaultLookup);
      this.serviceTeam = res.data;
    });

    this.lookupService.getLookUps(413).subscribe((res: any) => {
      res.data.unshift(this.defaultLookup);
      this.modility = res.data;
    });
    this.languagesService.getLanguages({}).subscribe((res: any) => {
      this.langagesList = res.data;
    });
    this.getSupervisors();
  }

  async getSupervisors() {
    this.managersList = await firstValueFrom(
      this.api.GetUserByRoleValue('R-8')
    );
    this.firstLineManagersList = await firstValueFrom(
      this.api.GetUserByRoleValue('R-16')
    );
    this.secLineManagersList = await firstValueFrom(
      this.api.GetUserByRoleValue('R-17')
    );
    this.selectedEmployeesList = [
      ...this.managersList,
      ...this.firstLineManagersList,
      ...this.secLineManagersList,
    ];
  }

  changeSupervisorsListDependingOnRoleValue() {
    if (this.rolesValues.find((roleValue) => roleValue === 'R-7')) {
      this.selectedEmployeesList = this.firstLineManagersList;
    } else if (this.rolesValues.find((roleValue) => roleValue === 'R-16')) {
      this.selectedEmployeesList = this.secLineManagersList;
    } else {
      this.selectedEmployeesList = [
        ...this.managersList,
        ...this.firstLineManagersList,
        ...this.secLineManagersList,
      ];
    }
  }
  //#endregion

  //#region Actions To API
  save() {

    if (this.employeeForm.invalid) {
      validateForm.validateAllFormFields(this.employeeForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.isSaving = true;

      if (!this.pressedSaveButton) {
        this.employeeForm.value.joiningDate =
          dateHelper.ConvertDateWithSameValue(
            this.employeeForm.value.joiningDate
          );
        for (
          let i = 0;
          i < this.employeeForm.value.userCertifications.length;
          i++
        ) {
          this.employeeForm.value.userCertifications[i].expireDate =
            dateHelper.ConvertDateWithSameValue(
              this.employeeForm.value.userCertifications[i].expireDate
            );
        }
        this.pressedSaveButton = true;
      }
      let m = this.employeeForm.value;

      //#region None Conditions
      if (m.qualification == 'None') {
        m.qualification = null;
      }
      if (m.modility == 'None') {
        m.modility = null;
      }
      if (m.subModility == 'None') {
        m.subModility = null;
      }
      if (m.serviceTeam == 'None') {
        m.serviceTeam = null;
      }
      if (m.modilityRisk == 'None') {
        m.modilityRisk = null;
      }
      if (m.skillLevel == 'None') {
        m.skillLevel = null;
      }
      //#endregion
      if (this.inAddMode) {
        //add
        this.api.postEmployee(m).subscribe({
          next: (res: any) => {
            this.apiResponse(res);
          },
          error: (e: any) => {
            this.isSaving = false;
            console.error('unable to save ', e);
          },
          complete: () => {
            this.isSaving = false;
          },
        });
      } else {
        //update
        this.api.updateEmployee(m, m.userName).subscribe({
          next: (res: any) => {
            this.apiResponse(res);
          },
          error: (e: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: e.error,
              life: 3000,
            });
            this.isSaving = false;
            console.error('unable to save ', e);
          },
        });
      }
    }
  }

  deleteEmployee() {
    let userName = this.employeeForm.value.userName;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Employee?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteEmployee(userName).subscribe((res: any) => {
          this.apiResponse(res);
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'You have cancelled',
        });
      },
    });
  }

  apiResponse(res: any) {
    let sucess = res;
    if (this.inAddMode) {
      sucess = !res.hasError;
    }
    const message = res.message;
    if (sucess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
      this.close_add_modal();
      this.Init();
    } else {
      this.isSaving = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }

  selectModelsSave(event: any) {
    this.modelService
      .ModelDefinitionAutoComplete(event.query)
      .subscribe((data) => {
        this.ModelDefinitions = data.data;
        //his.modelDefinitionId = null;
      });
  }
  bindModelSave(event: any, index: number) {
    (this.employeeForm.get('userCertifications') as FormArray)
      .at(index)
      .get('modelDefinitionId')
      ?.setValue(event.id);
    (this.employeeForm.get('userCertifications') as FormArray)
      .at(index)
      .get('modelDefinitionId1')
      ?.setValue({ id: event.id, modelDefCode: event.modelDefCode });
    (this.employeeForm.get('userCertifications') as FormArray)
      .at(index)
      .get('modelDefinationName')
      ?.setValue(event.modelDefCode);
  }
  clearModelSave(index: number) {
    (this.employeeForm.get('userCertifications') as FormArray)
      .at(index)
      .get('modelDefinitionId')
      ?.setValue(0);
    (this.employeeForm.get('userCertifications') as FormArray)
      .at(index)
      .get('modelDefinationName')
      ?.setValue('');
  }
  //#endregion

  onCustomerChange(event: any) {
    this.customerService
      .getDepartmentsBySites(event.value)
      .subscribe((data: any) => {
        this.DepartmentList = data.data;

        var index = 0;
        while (index < this.employeeForm.value.departmentIds.length) {
          var exist = this.DepartmentList.filter(
            (x) => x.id == this.employeeForm.value.departmentIds[index]
          );
          if (exist == undefined || exist.length == 0) {
            this.employeeForm.value.departmentIds?.splice(index, 1);
          } else {
            index++;
          }
        }
      });
    console.log(this.employeeForm.value.departmentIds);
  }

  close_add_modal() {
    this.employeeForm.reset();
    this.openModals.emit(false);
  }
}
