import { Lookup } from './../../../shared/enums/lookup';
import { dateHelper } from './../../../shared/helpers/dateHelper';
import { formatDate } from '@angular/common';
import { DemoReqService } from './../data/demo-req.service';
import { EmployeeService } from './../../../services/employee.service';
import { AssignedManagerService } from './../../../services/assignedManager.service';
import { CustomerService } from './../../../services/customer.service';
import { LookupService } from './../../../services/lookup.service';
import { SupplierService } from './../../../services/supplier.service';
import { TaxonomyService } from './../../../services/taxonomy.service';
import { ModelService } from './../../../services/model-definition.service';
import { Component, Input, LOCALE_ID, Inject, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { DemoRequest } from '../data/demo-req.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

import { buildDomeForm } from '../data/demo-req-formbuilder';
import validateForm from '../../../shared/helpers/validateForm';
import { log } from 'node:console';

@Component({
  selector: 'app-demo-req-control',
  templateUrl: './demo-req-control.component.html',
  styleUrls: ['./demo-req-control.component.scss'],
})
export class DemoReqControlComponent {
  @Input('showmodal') showmodal: boolean = false;
  @Input('data') data: any = null;
  @Input('mode') mode: any = null;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('demoRequestId') demoRequestId: number = 0;
  @Input('demoAssessmentId') demoAssessmentId: number = 0;
  @Input('endUserEvalId') endUserEvalId: number = 0;


  @Input('tabIndex') tabIndex1: any = null;
  @Input() inAssessmentForm: boolean = false;
  @Input() inEvaluationForm: boolean = false;
  @Input() inDemoRequestForm: boolean = false;
  PAGE_TITLE: string = 'Demo';
  items: string = this.inAssessmentForm
    ? 'Demo Assessment'
    : this.inEvaluationForm
      ? 'End-User Evaluation'
      : 'Demo Request';

  demoForm!: FormGroup;



  model!: DemoRequest;
  assessmentModel!: DemoRequest;
  evaluationModel!: DemoRequest;

  id: number = 0;
  // demoAssessmentId: number = 0;
  // endUserEvalId: number = 0;
  tabIndex: number = 0;

  steps!: MenuItem[];

  inAddMode: boolean = false;
  inEditMode: boolean = false;
  inViewMode: boolean = false;

  assignedEmpList: any[] = [];
  DepartmentList: any[] = [];
  assets: any[] = [];
  manufatureresList: any[] = [];
  modelDef: any[] = [];
  suppliersList: any[] = [];
  months: any[] = [];
  assessorEmp: any[] = [];
  assessorTL: any[] = [];
  apiDir: any[] = [];
  branchMD: any[] = [];
  YesOrNo: any[] = [
    { label: 'None', value: null },
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  demoStatus: any[] = [];
  assessmentStatus: any[] = [];
  useEvalStatus: any[] = [];

  loadingSteps: boolean = false;

  sitesList: any[] = [];
  assignedMangagers: any;

  userRoles: any[] = JSON.parse(localStorage.getItem('userRoles') || '');
  currentUserId = localStorage.getItem('userId');
  hasHospitalRoles: boolean = false;

  demoTypes: any[] = [];
  attachmentName: string[] = [];

  openAttachment: string = environment.AttachmentURL;
  constructor(
    // private router: ActivatedRoute,
    private empServices: EmployeeService,
    private modelService: ModelService,
    private taxonomyApi: TaxonomyService,
    private supplierService: SupplierService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private api: DemoReqService,
    // private route: Router,
    private confirmationService: ConfirmationService,
    private lookupService: LookupService,
    private sitesApi: CustomerService,
    private assignedMangaersApi: AssignedManagerService,
    private cdr: ChangeDetectorRef,
    @Inject(LOCALE_ID) public locale: string
  ) { }

  async ngOnInit() {

    console.log(this.demoRequestId);

    this.inAssessmentForm || this.inEvaluationForm
      ? (this.inDemoRequestForm = false)
      : (this.inDemoRequestForm = true);

    // this.router.queryParams.subscribe((params: any) => {
    this.id = 0;
    this.tabIndex = this.tabIndex1;
    if (this.demoRequestId) this.id = this.demoRequestId;
    if (this.demoAssessmentId)
      this.demoAssessmentId = this.demoAssessmentId;
    if (this.endUserEvalId) this.endUserEvalId = this.endUserEvalId;
    this.buildForm();
    // });
    this.getAssignedEmployee();
    this.getDepartment();
    this.setArray();
    this.getAssignedManagers();
    this.getDemoStatus();
    this.getDemoTypeLookup();

    this.getStepsByDemoReqID();

    this.steps = [
      {
        label: 'Demo Request',
        styleClass: 'p-steps-check',
      },
      {
        label: 'Demo Assessment',
        routerLink: ['/demo/assessment'],
        // queryParams: { data: this.id },
      },
      {
        label: 'Gate Pass',
        routerLink: ['/demo/gate-pass'],
        // queryParams: { demoRequestId: this.id },
      },
      {
        label: 'End-User Evaluation',
        routerLink: ['/demo/evaluation'],
        // queryParams: { data: this.id },
      },
    ];
  }

  //#region Check Role
  checkUserRole() {
    this.userRoles.find((role) => role.value === 'R-7')
      ? (this.hasHospitalRoles = true)
      : (this.hasHospitalRoles = false);

    if (this.hasHospitalRoles) {
      this.setAssignedEmployee(this.currentUserId);
    }
  }

  //#endregion

  //#region Steps Checking
  private async searchDemoAssess() {
    const demoAssessRes: any = await firstValueFrom(
      this.api.searchDemoAssess({ demoRequestId: this.id })
    );
    this.handleStep(1, demoAssessRes.data);
  }

  private async searchGatePass() {
    const gatePassRes: any = await firstValueFrom(
      this.api.searchGatePass({ demoRequestId: this.id })
    );
    this.handleStep(2, gatePassRes.data);
  }

  private async searchEvaluation() {
    const evalRes: any = await firstValueFrom(
      this.api.searchEvaluation({ demoRequestId: this.id })
    );
    this.handleStep(3, evalRes.data);
  }

  private handleStep(index: number, data: any) {
    if (data?.length > 0) {
      this.steps[index].styleClass = 'p-steps-check';
    } else {
      this.steps[index].styleClass = 'p-steps-false';
    }
  }

  async getStepsByDemoReqID() {
    try {
      await this.searchDemoAssess();
      await this.searchEvaluation();
      await this.searchGatePass();
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingSteps = true;
    }
  }
  //#endregion

  //#region Form Building
  buildForm() {
    // this.demoForm = buildDomeForm(this.model, this.fb);
    if (this.id === 0 || !this.id) {
      this.model = {
        id: 0,
        easeOfApplication: 0,
        easeOfUse: 0,
        easeOfConnection: 0,
        patientComfort: 0,
      };
      this.inAddMode = true;
      this.demoForm = buildDomeForm(this.model, this.fb);
    } else {
      if (this.tabIndex == 0) {
        this.inViewMode = true;
      } else {
        this.demoForm = buildDomeForm(this.model, this.fb);
        this.inEditMode = true;
        this.cdr.detectChanges()
      }
      this.getDemoData();
    }
    this.checkUserRole();

    this.cdr.detectChanges()
  }

  async getDemoData() {
    if (this.demoAssessmentId !== 0) {
      this.assessmentModel = (
        await firstValueFrom(
          this.api.getSingelDemoAssess(this.demoAssessmentId)
        )
      ).data as DemoRequest;
    }

    if (this.endUserEvalId !== 0) {
      this.evaluationModel = (
        await firstValueFrom(this.api.getSingelEvaluation(this.endUserEvalId))
      ).data as DemoRequest;
    }

    const demoReqObs = this.api.getSingelDemoReq(this.id);

    demoReqObs.subscribe((res: any) => {
      this.model = res.data as DemoRequest;

      if (this.model.attachmentUrl) {
        this.attachmentName.push(this.model.attachmentUrl);
      }

      if (this.inAssessmentForm && this.demoAssessmentId == 0) {
        this.model.demoRequestId = this.model.id;
        this.model.id = this.demoAssessmentId;
        this.inEditMode = false;
      }

      if (this.inAssessmentForm && this.assessmentModel) {
        const fieldsToCopy = [
          'demoRequestId',
          'id',
          'comments',
          'specialConfiguration',
          'requireSLA',
          'specialCalibration',
          'recommendIt',
          'assetDemoRequestStatusId',
        ];
        fieldsToCopy.forEach((field) => {
          this.model[field as keyof typeof this.model] =
            this.assessmentModel[field as keyof typeof this.model];
        });
      }

      if (this.inEvaluationForm && this.endUserEvalId == 0) {
        this.model.demoRequestId = this.model.id;
        this.model.id = this.endUserEvalId;
        this.inEditMode = false;
      }

      if (this.inEvaluationForm && this.evaluationModel) {
        const fieldsToCopy = [
          'demoRequestId',
          'id',
          'comments',
          'advantages',
          'disadvantages',
          'improvements',
          'isSavingTime',
          'isClinicalSuitable',
          'isRecommendable',
          'easeOfUse',
          'easeOfApplication',
          'easeOfConnection',
          'patientComfort',
          'overAllPerformance',
          'isInformationCorrect',
          'userEvaluationStatusId',
        ];
        fieldsToCopy.forEach((field) => {
          this.model[field as keyof typeof this.model] =
            this.evaluationModel[field as keyof typeof this.model];
        });
      }
      if (this.model.siteName)
        this.model.siteName = { custName: this.model.siteName };
      if (this.model.installationDate) {
        this.model.installationDate = dateHelper.handleDateApi(
          this.model.installationDate
        );
        this.model.expirationDate = formatDate(
          new Date(this.model.expirationDate),
          'dd/MM/YYYY',
          this.locale
        );
      }
      if (this.model.retirementDate) {
        this.model.retirementDate = formatDate(
          new Date(this.model.retirementDate),
          'dd/MM/YYYY',
          this.locale
        );
      }

      res.data.assetName
        ? (this.model.assetName = { assetname: res.data.assetName })
        : null;
      res.data.manufactureName
        ? (this.model.manufactureName = {
          taxonomyName: res.data.manufactureName,
        })
        : null;
      res.data.modelDefinationName
        ? (this.model.modelDefinationName = {
          modelDefCode: res.data.modelDefinationName,
        })
        : null;
      res.data.vendorName
        ? (this.model.vendorName = { suppliername: res.data.vendorName })
        : null;

      this.demoForm = buildDomeForm(this.model, this.fb);
      this.cdr.detectChanges()
    });

    await firstValueFrom(demoReqObs);
  }
  //#endregion

  //#region Instant Changes
  changeTabIndex(tab: any) {
    if (tab.index == 1) {
      this.inViewMode = false;
      this.inEditMode = true;
    } else {
      this.inViewMode = true;
      this.inEditMode = false;
    }
  }

  changeRate() {
    this.demoForm.controls['overAllPerformance'].setValue(
      (this.demoForm.value.easeOfUse +
        this.demoForm.value.easeOfApplication +
        this.demoForm.value.easeOfConnection +
        this.demoForm.value.patientComfort) /
      4
    );
    this.demoForm.controls['overAllPerformance'].setValue(
      Math.round(this.demoForm.value.overAllPerformance)
    );
  }
  //#endregion

  //#region Lookups and autocompletion
  async getAssignedEmployee() {
    const hospital = await firstValueFrom(
      this.empServices.GetUserByRoleValue('r-7')
    );
    this.assessorEmp = await firstValueFrom(
      this.empServices.GetUserByRoleValue('r-32')
    );

    this.assignedEmpList = [...hospital, ...this.assessorEmp];
  }

  setAssignedEmployee(event: any) {
    this.demoForm
      .get('employeeId')
      ?.setValue(this.hasHospitalRoles ? event : event.value);
    this.empServices
      .getEmployeeById(this.hasHospitalRoles ? event : event.value)
      .subscribe((res) => {
        this.demoForm.get('employeeName')?.setValue(res.userName);
        this.demoForm.get('email')?.setValue(res.email);
        this.demoForm.get('mobile')?.setValue(res.mobileNumber);
        this.demoForm.get('position')?.setValue(res.position);
      });
  }

  getDepartment() {
    let department = {
      pageSize: 10,
      pageNumber: 1,
    };
    this.empServices.getDepartments(department).subscribe((data: any) => {
      this.DepartmentList = data;
    });
  }

  searchAsset($event: any) {
    this.modelService
      .getAssetName({ assetName: $event.query })
      .subscribe((res) => {
        const data = res.data;
        this.assets = data;
      });
  }
  onSelectAsset(asset: any) {
    this.demoForm.get('assetId')?.setValue(asset.id);
    this.demoForm.get('assetName')?.setValue({ assetname: asset.assetname });
  }

  searchManufacturer($event: any) {
    this.taxonomyApi
      .searchManufacturerByName({ name: $event.query })
      .subscribe((res) => {
        this.manufatureresList = res.data;
      });
  }
  onSelectManufacturer($event: any) {
    this.demoForm.get('manufactureId')?.setValue($event.id);
    this.demoForm
      .get('manufactureName')
      ?.setValue({ taxonomyName: $event.taxonomyName });
  }

  searchModel($event: any) {
    let model = {
      modelDefCode: $event.query,
    };
    this.modelService.getModelDefinitions(model).subscribe((res) => {
      this.modelDef = res.data;
    });
  }
  onSelectModel(model: any) {
    this.demoForm.get('modelDefinitionId')?.setValue(model.id);
    this.demoForm
      .get('modelDefinationName')
      ?.setValue({ modelDefCode: model.modelDefCode });
  }

  getSpplier($event: any) {
    let supplier = {
      pageSize: 10,
      pageNumber: 1,
      suppliername: $event.query,
    };
    return this.modelService.getSupplier(supplier).subscribe((res: any) => {
      const data = res.data;
      this.suppliersList = data;
    });
  }
  onSelectSupplier(supplier: any) {
    this.demoForm.get('vendorId')?.setValue(supplier.id);
    this.demoForm
      .get('vendorName')
      ?.setValue({ suppliername: supplier.suppliername });
    this.supplierService.getSingleSupplier(supplier.id).subscribe((res) => {
      const data = res.data;
      this.demoForm.get('vendorEmail')?.setValue(data.email);
    });
  }

  setArray() {
    Array(90)
      .fill(0)
      .map((x, i) => {
        this.months.push({ label: i + 1, value: i + 1 });
      });
  }

  customerNameFilter(name: any) {
    this.sitesApi.searchCustomer({ custName: name.query }).subscribe((res) => {
      this.sitesList = res.data;
    });
  }

  logSiteData(e: any) {
    this.demoForm.get('siteId')?.setValue(e.id);
    this.assignedMangaersApi
      .getAssignedManagerBySiteName({ siteName: e.custName })
      .subscribe((res: any) => {
        this.demoForm
          .get('branchManagerDirectorId')
          ?.setValue(res.data[0].employeeId);
        this.demoForm
          .get('branchManagerDirectorName')
          ?.setValue(res.data[0].employeeName);
      });
  }

  getAssignedManagers() {
    this.assignedMangaersApi.getAll({}).subscribe((res: any) => {
      this.assignedMangagers = res.data[0];
      this.demoForm
        .get('assessorTeamLeaderId')
        ?.setValue(this.assignedMangagers.assessorTeamLeaderId);
      this.demoForm
        .get('apiDirectorId')
        ?.setValue(this.assignedMangagers.apiDirectorId);
      this.demoForm
        .get('assessorTeamLeaderName')
        ?.setValue(this.assignedMangagers.assessorTeamLeaderName);
      this.demoForm
        .get('apiDirectorName')
        ?.setValue(this.assignedMangagers.apiDirectorName);
    });
  }

  getDemoTypeLookup() {
    this.lookupService
      .getLookUps(Lookup.DemoRequestTypye)
      .subscribe((res: any) => {
        this.demoTypes = res.data;
      });
  }
  //#endregion

  //#region Demo Status
  getDemoStatus() {
    this.lookupService.getLookUps(Lookup.DemoStatus).subscribe((res: any) => {
      this.fillInDataToStatusArrays(res.data);
    });
  }

  fillInDataToStatusArrays(originalArray: any[]): void {
    if (this.inAddMode && this.inDemoRequestForm) {
      const underTeamLeaderAssignedStatusId = originalArray.find(
        (status) => status.value === 16
      ).id;
      this.demoForm
        .get('demoRequestStatusId')
        ?.setValue(underTeamLeaderAssignedStatusId);
    }
    //In Assessment add form
    if (this.inAssessmentForm) {
      this.demoStatus = originalArray.slice(2, 3);
    } else if (this.inEvaluationForm) {
      this.demoStatus = originalArray.slice(4, 6);
    }
  }

  onChangeStatus(status: any) {
    this.demoForm.value.demoRequestId = status.id;
  }
  //#endregion

  //#region Attachment
  attachmentReady(event: any) {
    this.demoForm.get('attachmentUrl')?.setValue(event[0]);
  }
  //#endregion

  //#region Save and Delete API calls
  isLoading: boolean = false;
  save() {
    if (this.demoForm.invalid) {
      validateForm.validateAllFormFields(this.demoForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.isLoading = true;
      let m;
      if (this.inDemoRequestForm) {
        this.demoForm.value.installationDate =
          dateHelper.ConvertDateWithSameValue(
            this.demoForm.value.installationDate
          );
        this.demoForm.value.expirationDate = null;
      }
      m = this.demoForm.value as DemoRequest;
      const apiMethod = this.inAssessmentForm
        ? 'DemoAssess'
        : this.inEvaluationForm
          ? 'Evaluation'
          : 'DemoReq';
      const addOrUpdate = m.id === 0 ? 'add' : 'update';

      this.api[`${addOrUpdate}${apiMethod}`](m).subscribe({
        next: (res) => {
          this.apiResponse(res);
          console.log(`${addOrUpdate}d successfully`, res);
        },
        error: (e) => {
          console.error(`Unable to ${addOrUpdate}`, e);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }


  apiResponse(res: any) {
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });

      // todo
      // this.inAssessmentForm
      //   ? this.route.navigate(['demo/assessment/'])
      //   : this.inEvaluationForm
      //     ? this.route.navigate(['demo/evaluation/'])
      //     : this.route.navigate(['demo/request/']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }
  //#endregion
  close_modal() {
    // this.ngOnInit()
    // this.addModelForm.reset()
    this.openModals.emit(false);
    this.showmodal = false
    // this.editModelobject = null
  }
}
