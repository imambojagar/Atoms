import { Injectable, ViewChild, OnInit, Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ModelDefinitionModel } from '../../models/model-definition-model';
import { CustomerSurvey } from '../../models/customer-survey';
import { LookupService } from '../../services/lookup.service';
import { ModelService } from '../../services/model-definition.service';
import { AssetsService } from '../../services/assets.service';
import { EmployeeService } from '../../services/employee.service';
import { TaxonomyService } from '../../services/taxonomy.service';
import { PPMEntryService } from '../../services/ppm-entry.service';
import { CustomerService } from '../../services/customer.service';
import { AssetGroupService } from '../../services/asset-group.service';
import { ServicerequestService } from '../../services/servicerequest.service';
import { Lookup } from '../../shared/enums/lookup';
import { AssetGroup } from '../../shared/enums/asset-group';
import { Role } from '../../shared/enums/role';
import { dateHelper } from '../../shared/helpers/dateHelper';
import validateForm from '../../shared/helpers/validateForm';
import { Attachments } from '../../models/servicerequest';
import { TransactionHistory } from '../../models/transaction-history';
import { error } from 'console';


/* @Injectable({
  providedIn: 'root'
}) */

@Injectable()

export class ServiceRequestFormService implements OnInit {
  minDateVal = new Date();
  startDate: any;
  endDate: any;
  StartFlag: boolean = false;
  Sites: any[] = [];
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  isShowVisitDate: boolean = false;
  callInfoForm!: FormGroup;
  maintenanceForm!: FormGroup;
  serviceReviewForm!: FormGroup;
  id: any;
  uploadedFiles: any;
  numberOfDefectedAssets: any[] = [];
  defectTypes: any[] = [];
  contactTitles: any[] = [];
  listEmployee: any[] = [];
  yesOrNo: any[] = [];
  requestedThrough: any[] = [];
  typeOfrequests: any[] = [];
  noOffollowups: any[] = [];
  groupleaders: any[] = [];
  assignedEmployees: any[] = [];
  assistantEmployees: any[] = [];
  statuses: any[] = [];
  callsLastSituations: any[] = [];
  repairLocations: any[] = [];
  partNos: any[] = [];
  quotationTypes: any[] = [];
  maintenanceSituations: any[] = [];
  AssetNames: any[] = [];
  Operator_Dates: any[] = [];
  callReview: any[] = [];
  Asset_SNs: any[] = [];
  asset_Numbers: any[] = [];
  ModelDefinitions: ModelDefinitionModel[] = [];
  manufacturers: any[] = [];
  isSubmitted: boolean = false;
  url!: string;
  contactIDs: any[] = [];
  firsActionForm!: FormGroup;
  firstActionStatuses: any[] = [];
  CallslastSituationWO: any[] = [];
  loanAvailablities: any[] = [];
  safety: any[] = [];
  user: any;
  isClose: boolean = false;
  isReview: string = '';
  viewComment: string = 'true';
  isAssginedEmployee: string = 'false';
  attachmentCallForm!: FormGroup;
  attachmentName: any[] = [];
  searchFilter = new CustomerSurvey();
  assetGroupsList: any[] = [];
  assetId!: number;
  userAssetGroups: any[] = [];
  userAssetGroupSelected: any;
  AssetGroupDialogVisible!: boolean;
  FMLookup!: boolean;
  FMfirstAction!: boolean;
  problemDescriptions: any[] = [];
  callRequestTransaction: any[] = [];
  empRole: any;
  roleValue: any;
  isNurse: boolean = false;
  showSafety: string = 'false';
  minDate!: Date;
  isEngineer: boolean = false;
  headerWaring: any = ""
  detailWaring: any[] = [];
  showDialogWarning: boolean = false;
  transactionHistory!: TransactionHistory

  constructor(private lookupService: LookupService, private modelService: ModelService,
    private employeeService: EmployeeService, private messageService: MessageService,
    private fb: FormBuilder, private activatedRoute: ActivatedRoute, private assetService: AssetsService,
    private taxonamyService: TaxonomyService, private router: Router, private serviceRequestService: ServicerequestService,
    private PPMService: PPMEntryService,
    private customerService: CustomerService,
    private assetGroupService: AssetGroupService
  ) {
    this.isSubmitted = false;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params['id'];
    });
    this.empRole = localStorage.getItem('userRoles') ? JSON.parse(localStorage.getItem('userRoles') || '{}') : [];

    if(this.empRole.lenth > 0) {
      this.empRole.forEach((e: any) => {
        this.roleValue = e.value;
        if (this.roleValue == 'R-7' || this.roleValue == 'R-33') {
          this.isNurse = true;
        }
        if (this.roleValue == 'R-6') {
          this.isEngineer = true;
        }
        this.userAssetGroupSelected = JSON.parse(localStorage.getItem('slectedAssetGroup') || '{}');
        this.loadLookups(this.userAssetGroupSelected.id);
        this.toggleLookupLabel();

      });
    }

    this.intiateForm();
  }
  ngOnInit(): void {
     throw new Error();
  }

  intiateForm() {
    this.attachmentName = [];
    this.callInfoForm = this.fb.group({
      callCreatedBy: [
        { value: localStorage.getItem('userName'), disabled: true },
      ],
      requestedDate: [new Date(), Validators.required],
      requestedTime: [new Date(), Validators.required],
      defectType: [null],
      assets: this.fb.array([]),
      callSiteContactPerson: this.fb.array([]),
      priority: [null],
      requestedThrough: [null],
      typeofRequest: [null],
      callComments: [null],
      noofFollowup: [null],
      attachFile: [null],
      assignedEmployee: [null],
      voiceNote: [null],
      loanAvailablity: [null],
      Safety: [null],
      assetLoan: [null],
      problemDescription: [null],
      startDate: [null],
      endDate: [null],
      workingHours: [null],
    });

    if (!this.isAddMode) {
      this.maintenanceForm = this.fb.group({
        status: [null, Validators.required],
        callsLastSituation: [null],
        repairLocation: [null],
        faultDescription: [null],
        workPerformed: [null],
        cause: [null],
        comment: [null],
        spareForm: this.fb.array([]),
        startDateFrom: [null],
        startDateTo: [null],
        returnToServiceDateFrom: [null],
        returnToServiceDateTo: [null],
        endOfWorkFrom: [null],
        endOfWorkTo: [null],
        totalCost: [null],
        quoteAmount: [null],
      });
      this.maintenanceForm.disable();
      this.addspareForm();
    }

    this.firsActionForm = this.fb.group({
      firstActionStatus: [null],
      startDate: [null],
      endDate: [null],
      workingHours: [null],
      visitDate: [null],
      comments: [null],
    });

    this.serviceReviewForm = this.fb.group({
      callReview: [null],
      reviewComment: [null],
      status: [null],
    });
    this.attachmentCallForm = this.fb.group({
      attachments: this.fb.array([]),
    });

    if (this.isAddMode == true) {

      this.addcontact_Data();
      this.addassets();
      this.ifUserNurse();


      if (this.yesOrNo.length != 0) {
        this.callInfoForm.controls['priority'].setValue(this.yesOrNo[0]);
      }
    }

    //this.addassets()

  }

  checkMode() {
    this.isViewMode = false;
    this.isEditMode = false;
    this.isAddMode = false;
    this.url = this.router.url;
    if (this.id)
      if (this.url.includes('view')) {
        this.isViewMode = true;
        this.callInfoForm.disable();
        this.firsActionForm.disable();
      } else this.isEditMode = true;
    else this.isAddMode = true;
  }

  checkAssetGroup() {
    this.userAssetGroupSelected = JSON.parse(localStorage.getItem('slectedAssetGroup') || '{}');

    this.getLookup(this.userAssetGroupSelected.id);
    this.toggleLookupLabel();
    this.router.navigate(['/maintenance/service-request/add-control']);

  }

  RenderAssetGroup(event: any) {
    if (event != undefined) {
      this.userAssetGroupSelected = event.value;
      this.toggleLookupLabel();
    }
  }

  toggleLookupLabel() {
    if (this.userAssetGroupSelected.id == AssetGroup.FM) {
      this.FMLookup = true;
      // this.FMfirstAction = true;
    } else {
      this.FMLookup = false;
      // this.FMfirstAction = false;
    }
  }

  checkMode1() {
    this.isViewMode = false;
    this.isEditMode = false;
    this.isAddMode = false;
    this.url = this.router.url;
    if (this.id)
      if (this.url.includes('view')) {
        this.isViewMode = true;
      } else this.isEditMode = true;
    else this.isAddMode = true;
  }

  loadLookups(assetGroup?: AssetGroup) {
    this.getAssignedEmployees(Role.engineersvalue);
    this.getManufacturers();
    this.getLookup(assetGroup);
    this.searchAssetGroup();


  }


  onSelectSite(event: any) {
    this.searchonSite(event.query);
    //this.filter.site = event.query
  }

  searchonSite(code: any) {
    this.customerService.GetCustomersAutoComplete(code).subscribe((data: any) => {
      this.Sites = data.data;
    });
  }

  bindSite(event: any) {
    this.searchFilter.site = event.id
  }

  clearSite() {
    this.searchFilter.site = ''
  }

  getAssetsDataByAssetNumber(searchText: any = '') {
    var dto = { assetNumber: searchText };
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res) => {
      this.asset_Numbers = res.data;
    });
  }

  getAssetsData(searchText: any = '') {
    this.assetService.GetAssetsAutoComplete(searchText).subscribe((res) => {
      this.Asset_SNs = res.data;
    });
  }

  getLookup(assetGroup?: AssetGroup) {
    this.lookupService
      .getLookUps(Lookup.Operator_Date)
      .subscribe((res: any) => {
        this.Operator_Dates = res.data;
        // this.Operator_Dates.splice(0, 0, {
        //   id: 0,
        //   name: 'Select',
        //   value: null,
        // });
      });

    this.lookupService
      .getLookUps(
        assetGroup == AssetGroup.FMS ? Lookup.JobStatus : Lookup.DefectType
      )
      .subscribe((res: any) => {
        this.defectTypes = res.data;
        //this.defectTypes.splice(0, 0, { id: 0, name: 'Select', value: null });
      });

    this.lookupService
      .getLookUps(
        assetGroup == AssetGroup.FMS ? Lookup.JobPriority : Lookup.Asset_Replace
      )
      .subscribe((res: any) => {
        this.yesOrNo = res.data;
      });

    this.lookupService
      .getLookUps(
        assetGroup == AssetGroup.FMS ? Lookup.CostCode : Lookup.TypeOfRequest
      )
      .subscribe((res: any) => {
        this.typeOfrequests = res.data;
        // this.typeOfrequests.splice(0, 0, {
        //   id: 0,
        //   name: 'Select',
        //   value: null,
        // });
      });

    this.PPMService.getLookups({ queryParams: 480 }).subscribe((res) => {
      this.safety = res.data;
      //this.safety.splice(0, 0, { id: 0, name: 'Select', value: null });
    });

    this.lookupService
      .getLookUps(Lookup.requestedThrough)
      .subscribe((res: any) => {
        this.requestedThrough = res.data;


        let userRoles = JSON.parse(localStorage.getItem('userRoles') || '');
        let result: any[] = [];
        result = userRoles;
        var callCenterRole = result.filter((x) => x.value == 'R-2');
        if (callCenterRole.length != 0) {
          this.requestedThrough = this.requestedThrough.filter((x) => x.value == 1 || x.value == 2);
        }


        // this.requestedThrough.splice(0, 0, {
        //   id: 0,
        //   name: 'Select',
        //   value: null,
        // });
      });


    this.lookupService
      .getLookUps(Lookup.Asset_Replace)
      .subscribe((res: any) => {
        this.loanAvailablities = res.data;
        this.loanAvailablities.splice(0, 0, {
          id: null,
          name: 'Select',
          value: null,
        });
      });

    this.lookupService
      .getLookUps(Lookup.Asset_Replace)
      .subscribe((res: any) => {
        this.loanAvailablities = res.data;
        this.loanAvailablities.splice(0, 0, {
          id: null,
          name: 'Select',
          value: null,
        });
      });

    this.lookupService.getLookUps(Lookup.First_Action).subscribe((res: any) => {
      this.firstActionStatuses = res.data;
      // this.firstActionStatuses.splice(0, 0, {
      //   id: null,
      //   name: 'Select',
      //   value: null,
      // });
    });

    this.lookupService
      .getLookUps(Lookup.CallslastSituationWO)
      .subscribe((res: any) => {
        this.CallslastSituationWO = res.data;
        // this.CallslastSituationWO.splice(0, 0, {
        //   id: null,
        //   name: 'Select',
        //   value: null,
        // });
      });

    this.lookupService.getLookUps(Lookup.callReview).subscribe((res: any) => {
      this.callReview = res.data;
    });

    this.lookupService.getLookUps(Lookup.StatusWO).subscribe((res: any) => {
      this.statuses = res.data;
     // this.statuses?.splice(0, 0, { id: null, name: 'Select', value: null });
    });
    if (assetGroup == AssetGroup.FMS) {
      this.lookupService
        .getLookUps(Lookup.ProblemDescription)
        .subscribe((res: any) => {
          this.problemDescriptions = res.data;
        });
    }

  }





  getGroupLeaders(roleId: string) {
    let roleIds: any = [roleId];
    this.employeeService.getEmployeeByRole(roleIds).subscribe((res: any) => {
      this.groupleaders = res;
    });
  }

  getAssignedEmployees(value: string, assetId?: number) {
    this.employeeService
      .GetUserByRoleValue(value, assetId)
      .subscribe((res: any) => {
        this.assignedEmployees = res;
        this.assignedEmployees.splice(0, 0, {
          userId: null,
          userName: 'Select',
          value: null,
        });
      });
  }

  getAssignedEmployeesBySiteId(
    value: string,
    siteId: number,
    assetId?: number
  ) {
    this.employeeService
      .GetUserByRoleValueSiteAndAssetGroupBySite(value, siteId)
      .subscribe((res: any) => {
        this.assignedEmployees = res;
      });
  }
  // searchonmodels(code: any) {
  //   this.modelService.GetModelDefinitionAsset(code).subscribe((data) => {
  //     this.ModelDefinitions = data.data;
  //   });
  // }

  getManufacturers(searchText: any = '') {
    this.taxonamyService
      .GetManufacturerOrModelAutoComplete3(true, searchText)
      .subscribe((res) => {
        this.manufacturers = res.data;
      });
  }

  searchAssetGroup() {
    this.assetGroupService
      .searchAssetGroups({})
      .subscribe((res) => (this.assetGroupsList = res.data));
  }

  getModel(searchText: any = '') {
    this.modelService.GetModelDefinitionAsset(searchText).subscribe((data) => {
      this.ModelDefinitions = data.data;
    });
  }

  getAssetNames($event: any) {
    this.modelService
      .getAssetName({ assetName: $event.query })
      .subscribe((res) => {
        const data = res.data;
        this.AssetNames = data;
      });
  }

  getServiceRequestById() {
    this.serviceRequestService.getServiceRequestById(this.id).subscribe(
      res => {
        this.userAssetGroupSelected = { id: res.data.asset.assetGroup.id, name: res.data.asset.assetGroup.name };
       /*  this.transactionHistory = new TransactionHistory();
        Object.assign(this.transactionHistory, res.data); */
        this.toggleLookupLabel();
        this.getLookup(res.data.asset.assetGroup.id);

        this.callInfoForm.patchValue(res.data);
        this.assetId = res.data.asset.id;
        this.callInfoForm.controls['assetLoan'].setValue(res.data.assetLoan);
        if (res.data.typeofRequest.value == 2) {
          this.showSafety = 'true';
        } else {
          this.showSafety = 'false';
        }
        this.callInfoForm.controls['Safety'].setValue(res.data.safety);
        this.callInfoForm.patchValue({
          requestedDate: new Date(res.data?.requestedDate),
          requestedTime: new Date(res.data?.requestedTime),
          callCreatedBy: res.data.callCreatedBy.name,
        });
        this.minDate = new Date(res.data?.requestedTime);
        this.minDateVal = new Date(res.data?.requestedTime);
        this.serviceReviewForm.controls['status'].setValue(res.data.status);
        this.serviceReviewForm.controls['callReview'].setValue(
          res.data.callReview
        );
        this.serviceReviewForm.controls['reviewComment'].setValue(
          res.data.reviewComment
        );

        let userRoles = JSON.parse(localStorage.getItem('userRoles') || '');
        let result: any[] = [];
        result = userRoles;
        var emgineerRole = result.filter((x) => x.value == 'R-6');
        if (emgineerRole.length != 0) {
          if (
            this.serviceReviewForm.controls['status'].value.name !=
            'In progress'
          ) {
            this.isViewMode = true;
          }
        }

        this.attachmentName = [];
        var att = res.data.attachmentsCallRequest as any[];
        if (att != null) {
          att.forEach((element) => {
            (this.attachmentCallForm.get('attachments') as FormArray).push(
              this.fb.group({
                attachmentName: element.name,
                attachmentURL: element.name,
                id: element.id,
              })
            );
            this.attachmentName.push(element.name);
          });
        }

        if (res.data.callReview != null && res.data.callReview.value) {
          this.viewComment = 'true';
        } else {
          this.viewComment = 'false';
        }

        if (res.data?.assignedEmployee) {
          this.isAssginedEmployee = 'true';
          let assgined = {
            userId: res.data?.assignedEmployee.id,
            userName: res.data?.assignedEmployee.name,
          };
          this.callInfoForm.controls['assignedEmployee'].setValue(assgined);
        } else {
          this.isAssginedEmployee = 'false';
        }

        this.firsActionForm.controls['firstActionStatus'].setValue(
          res.data.firstAction
        );

        this.firsActionForm.controls['startDate'].patchValue(
          dateHelper.handleDateApi(res.data.startDate)
        );
        this.firsActionForm.controls['endDate'].patchValue(
          dateHelper.handleDateApi(res.data.endDate)
        );
        this.firsActionForm.controls['workingHours'].setValue(
          res.data.workingHours
        );


        this.firsActionForm.controls['startDate'].patchValue(dateHelper.handleDateApi(res.data.startDate));
        this.firsActionForm.controls['endDate'].patchValue(dateHelper.handleDateApi(res.data.endDate));
        this.firsActionForm.controls['workingHours'].setValue(res.data.workingHours);


        if (this.userAssetGroupSelected.id == AssetGroup.FM && res.data.firstAction?.value == 1) {
          this.FMfirstAction = true;
        }

        if (res.data.firstAction != null && res.data.firstAction.value == 2) {
          this.isShowVisitDate = true;
        } else {
          this.isShowVisitDate = false;
        }

        if (res.data.visitDate != null) {
          this.firsActionForm.patchValue({
            visitDate: new Date(res.data.visitDate),
          });
        }

        //this.isClose = res.data.status == null ? false : res.data.status.value == 5 ? true : false

        this.firsActionForm.controls['comments'].setValue(res.data.comments);
        if (res.data?.callSiteContactPerson) {
          let contacts: any[] = [];
          contacts = res.data?.callSiteContactPerson;
          contacts.forEach((e) => {
            var obj = this.fb.group({
              id: [e.id],
              employeeCode: [e],
              name: [e.name],
              telephone: [e.telephone],
              job: [e.job],
              email: [e.email],
              land: [e.land],
              contactUserId: [e.contactUserId],
            });

            this.callSiteContactPerson.push(obj);
          });

          if (contacts.length == 0) {
            this.addcontact_Data();
          }

          for (let i = 0; i <= contacts.length - 1; i++) {
            if (
              contacts[i].contactUserId == null ||
              contacts[i].contactUserId == 0
            ) {
              (this.callInfoForm.get('callSiteContactPerson') as FormArray)
                .at(i)
                .get('name')
                ?.enable();
              (this.callInfoForm.get('callSiteContactPerson') as FormArray)
                .at(i)
                .get('telephone')
                ?.enable();
              (this.callInfoForm.get('callSiteContactPerson') as FormArray)
                .at(i)
                .get('job')
                ?.enable();
              (this.callInfoForm.get('callSiteContactPerson') as FormArray)
                .at(i)
                .get('email')
                ?.enable();
              (this.callInfoForm.get('callSiteContactPerson') as FormArray)
                .at(i)
                .get('land')
                ?.enable();
            } else {
              (this.callInfoForm.get('callSiteContactPerson') as FormArray)
                .at(i)
                .get('name')
                ?.disable();
              (this.callInfoForm.get('callSiteContactPerson') as FormArray)
                .at(i)
                .get('telephone')
                ?.disable();
              (this.callInfoForm.get('callSiteContactPerson') as FormArray)
                .at(i)
                .get('job')
                ?.disable();
              (this.callInfoForm.get('callSiteContactPerson') as FormArray)
                .at(i)
                .get('email')
                ?.disable();
              (this.callInfoForm.get('callSiteContactPerson') as FormArray)
                .at(i)
                .get('land')
                ?.disable();
            }
          }
        }

        this.addassets();

        (this.callInfoForm.get('assets') as FormArray)
          .at(0)
          .get('assetSerialNo')
          ?.setValue(res.data.asset.assetSerialNo);
        //(this.callInfoForm.get('assets') as FormArray).at(0).get('assetSerialNo')?.disable();
        (this.callInfoForm.get('assets') as FormArray)
          .at(0)
          .get('assetNumber')
          ?.setValue(res.data.asset);
        (this.callInfoForm.get('assets') as FormArray)
          .at(0)
          .get('assetName')
          ?.setValue(res.data.asset.modelDefinition.assetName);
        (this.callInfoForm.get('assets') as FormArray)
          .at(0)
          .get('manufacturer')
          ?.setValue(res.data.asset.modelDefinition.manufacturerName);
        (this.callInfoForm.get('assets') as FormArray)
          .at(0)
          .get('site')
          ?.setValue(res.data.asset.site.custName);
        (this.callInfoForm.get('assets') as FormArray)
          .at(0)
          .get('department')
          ?.setValue(res.data.asset.department.departmentName);
        (this.callInfoForm.get('assets') as FormArray)
          .at(0)
          .get('model')
          ?.setValue(res.data.asset.modelDefinition.modelName);
        if (this.serviceReviewForm.controls['status'].value.name == 'Open') {
          (<FormArray>this.callInfoForm.get('assets')).controls.forEach(
            (control) => {
              control.disable();
            }
          );
        }
        // this.serviceRequestService.CheckIfCallHasWorkOrder(this.id).subscribe(res => {
        //   if (res.isSuccess)
        //   {
        //     if (res.data==true)
        //     {
        //       this.firsActionForm.disable();
        //     }
        //     else{
        //       this.firsActionForm.enable();
        //     }
        //   }
        // })

        if (res.data.firstAction != null) {
          this.firsActionForm.disable();
        } else {
          this.firsActionForm.enable();
        }

        if (res.data.status.value == 3 || res.data.status.value == 5) {
          this.isReview = 'Review';
        }

        if (res.data.status.value == 3) {
          this.serviceReviewForm.enable();
        } else {
          this.serviceReviewForm.disable();
        }

        this.getAssignedEmployees(Role.engineersvalue, this.assetId);
      });
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({
      severity: 'success',
      summary: 'File Upload',
      detail: 'File Uploaded Successfully ! ',
    });
  }

  CheckWarning() {
    if (this.id) {
      this.Save();
    } else {
      var assetId = this.assetsArray();
      if (assetId[0] == undefined) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one asset',
          life: 3000,
        });
      } else {
        this.serviceRequestService
          .checkIfAssetHasAnotherServiceRequest(assetId[0])
          .subscribe((res) => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              if (res.data.details.length == 0) {
                this.Save();
              } else {
                this.headerWaring = res.data.headerMessage;
                this.detailWaring = res.data.details;
                this.showDialogWarning = true;
              }
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 3000,
              });
              this.isSubmitted = false;
            }
          });
      }
    }
  }

  Save() {
    try {
      this.showDialogWarning = false;
      this.isSubmitted = true;
      if (
        this.callInfoForm.value.callReview != null &&
        this.callInfoForm.value.callReview.value == null
      ) {
        this.callInfoForm.controls['callReview'].setValue(null);
      }

      if (this.callInfoForm.invalid) {
        validateForm.validateAllFormFields(this.callInfoForm);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please Fill Required Data',
          life: 3000,
        });
        // this.child.displatMsg("ssss");
        this.isSubmitted = false;
      } else {
        debugger;
        let finalData: any = {};
        this.callInfoForm.value.callCreatedBy = {
          id: localStorage.getItem('userId'),
        };
        Object.assign(finalData, this.callInfoForm.value);

        if (
          !(
            this.callInfoForm.value.assignedEmployee == undefined ||
            this.callInfoForm.value.assignedEmployee.userId == ''
          )
        ) {
          finalData.assignedEmployee = {
            id: this.callInfoForm.value.assignedEmployee.userId,
          };
        }

        finalData.loanAvailablity =
          this.callInfoForm.value.loanAvailablity == null ||
            this.callInfoForm.value.loanAvailablity.id == 0
            ? null
            : this.callInfoForm.value.loanAvailablity;
        finalData.callReview = this.serviceReviewForm.value.callReview;
        // finalData.Safety = this.serviceReviewForm.value.Safety;
        finalData.reviewComment = this.serviceReviewForm.value.reviewComment;



        finalData.status = this.serviceReviewForm.value.status;
        let contactPerson: any[] = [];
        contactPerson = this.callInfoForm.value.callSiteContactPerson;
        finalData.callSiteContactPerson = [];

        contactPerson.forEach((e) => {
          if (e.name != '') {
            var obj = {
              id: e.id,
              name: e.name,
              telephone: e.telephone,
              job: e.job,
              email: e.email,
              land: e.land,
              contactUserId: e.contactUserId,
            };
            finalData.callSiteContactPerson.push(obj);
          }
        });

        finalData.assets = this.assetsArray();

        // let userRoles = JSON.parse(localStorage.getItem("userRoles") || "");
        // let result: any[] = [];
        // result = userRoles;
        // var hospitalRole = result.filter(x => x.value == "R-7");

        // if(hospitalRole.length != 0 && finalData.assets.length != 1){

        //   console.log("tttttttttttttt")
        //   this.messageService.add({
        //     severity: 'error',
        //     summary: 'Error',
        //     detail: "Please select only one asset",
        //     life: 3000,
        //   });
        //   /////////////////////////////////////////////////////////////////////////////////////////////////////
        // }

        finalData.firstAction =
          this.firsActionForm.value.firstActionStatus == null ||
            this.firsActionForm.value.firstActionStatus.id == 0
            ? null
            : this.firsActionForm.value.firstActionStatus;
        finalData.visitDate =
          this.firsActionForm.value.firstActionStatus == null ||
            this.firsActionForm.value.firstActionStatus.id == 0
            ? null
            : this.firsActionForm.value.visitDate;
        finalData.comments = this.firsActionForm.value.comments;
        finalData.startDate = this.firsActionForm.value.startDate;
        finalData.endDate = this.firsActionForm.value.endDate;
        finalData.workingHours = this.firsActionForm.value.workingHours;

        if (!finalData.attachmentsCallRequest) {
          finalData.attachmentsCallRequest = [];
        }
        (
          this.attachmentCallForm.get('attachments') as FormArray
        ).controls.forEach((element) => {
          let attach = new Attachments();
          attach.id = element.value.id;
          attach.name = element.value.attachmentName;
          finalData.attachmentsCallRequest.push(attach);
        });

        try {
          finalData.requestedDate = dateHelper.ConvertDateToStringTimeOnly(
            this.callInfoForm.value.requestedDate
          );
        } catch { }

        try {
          finalData.requestedTime = dateHelper.ConvertDateToStringTimeOnly(
            this.callInfoForm.value.requestedTime
          );
        } catch { }

        try {
          finalData.visitDate = dateHelper.ConvertDateToStringTimeOnly(
            this.firsActionForm.value.visitDate
          );
        } catch { }

        let userRoles = JSON.parse(localStorage.getItem('userRoles') || '');
        let result: any[] = [];
        result = userRoles;
        var hospitalRole = result.filter(
          (x) => x.value == 'R-7' || x.value == 'R-33'
        );

        if (hospitalRole.length != 0 && finalData.assets.length != 1) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please select only one asset',
            life: 3000,
          });
          this.isSubmitted = false;
        } else {
          if (this.id) {
            finalData.id = Number(this.id);
            debugger;
            this.serviceRequestService
              .updateServiceRequest(finalData)
              .subscribe((res) => {
                const message = res.message;
                const sucess = res.isSuccess;
                if (sucess == true) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: message,
                    life: 3000,
                  });
                  // this.addCustomerForm.reset();
                  this.router.navigate(['maintenance/service-request']);
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: message,
                    life: 3000,
                  });
                  this.isSubmitted = false;
                }
              });
          } else
            this.serviceRequestService
              .saveServiceRequest(finalData)
              .subscribe((res) => {
                const message = res.message;
                const sucess = res.isSuccess;

                if (sucess == true) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: message,
                    life: 3000,
                  });
                  // this.addCustomerForm.reset();
                  this.router.navigate(['maintenance/service-request']);
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: message,
                    life: 3000,
                  });
                  this.isSubmitted = false;
                }
              });
        }
      }
    } catch {
      this.isSubmitted = false;
    }
  }

  assetsArray(): any[] {
    let assetsIDs: any[] = [];
    this.assets.controls.forEach((element) => {
      if (element.value.assetNumber != null) {
        assetsIDs.push(element.value.assetNumber.id);
      }
    });
    return assetsIDs;
  }

  get assets(): FormArray {
    return this.callInfoForm.get('assets') as FormArray;
  }

  newasset(): FormGroup {
    return this.fb.group({
      assetSerialNo: [{ value: null, disabled: true }],
      assetNumber: [null, Validators.required],
      assetName: [{ value: null, disabled: true }],
      manufacturer: [{ value: null, disabled: true }],
      site: [{ value: null, disabled: true }],
      department: [{ value: null, disabled: true }],
      model: [{ value: null, disabled: true }],
    });
  }

  addassets() {
    this.assets.push(this.newasset());
  }

  removeassetForm(i: number) {
    this.assets.removeAt(i);
  }

  get spareForm(): FormArray {
    return this.maintenanceForm.get('spareForm') as FormArray;
  }

  newspareForm(): FormGroup {
    return this.fb.group({
      partNo: [null],
      description: [null],
      qty: [null],
      unitPrice: [null],
      currency: [null],
      quotationType: [null],
    });
  }

  addspareForm() {
    this.spareForm.push(this.newspareForm());
  }

  removespareForm(i: number) {
    this.spareForm.removeAt(i);
  }

  gePartNoData(searchText: any = '') {
    var dto = { assetNumber: searchText };
  }

  selectAsset(i: number, data: any) {
    var isExist: boolean = false;
    this.assets.controls.forEach((element, index) => {
      if (element.value.assetNumber != null) {
        if (index != i && data.id == element.value.assetNumber.id) {
          isExist = true;
        }
      }
    });
    if (isExist == false) {
      this.assetService.getAssetById(data.id).subscribe((res) => {
        (this.callInfoForm.get('assets') as FormArray)
          .at(i)
          .get('assetSerialNo')
          ?.setValue(res.data.multiAssets[0].assetSerialNo);
        (this.callInfoForm.get('assets') as FormArray)
          .at(i)
          .get('assetNumber')
          ?.setValue(data);
        (this.callInfoForm.get('assets') as FormArray)
          .at(i)
          .get('manufacturer')
          ?.setValue(res.data.modelDefinition.manufacturerName);
        (this.callInfoForm.get('assets') as FormArray)
          .at(i)
          .get('site')
          ?.setValue(res.data.site.custName);
        (this.callInfoForm.get('assets') as FormArray)
          .at(i)
          .get('department')
          ?.setValue(res.data.department.departmentName);
        (this.callInfoForm.get('assets') as FormArray)
          .at(i)
          .get('model')
          ?.setValue(res.data.modelDefinition.modelName);
        (this.callInfoForm.get('assets') as FormArray)
          .at(i)
          .get('assetName')
          ?.setValue(data.assetName);
      });
    } else {
      (this.callInfoForm.get('assets') as FormArray)
        .at(i)
        .get('assetNumber')
        ?.setValue(null);
    }
  }

  selectAssetPOPUP(id: any) {
    this.assets.push(this.newasset());
    var i = this.assets.length - 1;
    var dto = {
      id: id,
    };
    this.assetService
      .GetAssetsAutoCompleteMultiFilter(dto)
      .subscribe((resdata) => {
        this.assetService.getAssetById(id).subscribe((res) => {
          (this.callInfoForm.get('assets') as FormArray)
            .at(i)
            .get('assetSerialNo')
            ?.setValue(res.data.multiAssets[0].assetSerialNo);
          (this.callInfoForm.get('assets') as FormArray)
            .at(i)
            .get('assetNumber')
            ?.setValue(resdata.data[0]);
          (this.callInfoForm.get('assets') as FormArray)
            .at(i)
            .get('assetName')
            ?.setValue(resdata.data[0].assetName);
          (this.callInfoForm.get('assets') as FormArray)
            .at(i)
            .get('manufacturer')
            ?.setValue(res.data.modelDefinition.manufacturerName);
          (this.callInfoForm.get('assets') as FormArray)
            .at(i)
            .get('site')
            ?.setValue(res.data.site.custName);
          (this.callInfoForm.get('assets') as FormArray)
            .at(i)
            .get('department')
            ?.setValue(res.data.department.departmentName);
          (this.callInfoForm.get('assets') as FormArray)
            .at(i)
            .get('model')
            ?.setValue(res.data.modelDefinition.modelName);
        });
      });
  }

  // selectAssets(itemEnterd:any[]) {
  //  // let lastindex=itemEnterd.length

  //   let index = this.assets.length;
  //   itemEnterd.forEach(x=>{
  //       var dto={
  //           id:x
  //        }
  //        this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe(auto => {
  //         this.addassets();
  //          this.selectAsset(index,auto.data[0])
  //          index++;
  //        })
  //   })
  // }

  get callSiteContactPerson(): FormArray {
    return this.callInfoForm.get('callSiteContactPerson') as FormArray;
  }

  newcontact_Data(): FormGroup {
    return this.fb.group({
      id: [0],
      employeeCode: [''],
      name: [''],
      telephone: [''],
      job: [''],
      email: [''],
      land: [''],
      contactUserId: [null],
    });
  }

  ifUserNurse() {
    let userRoles = localStorage.getItem('userRoles') ? JSON.parse(localStorage.getItem('userRoles') || '') : [];
    let result: any[] = [];
    result = userRoles;
    var hospitalRole = result.filter(
      (x) => x.value == 'R-7' || x.value == 'R-33'
    );
    var group!: FormGroup;

    if (hospitalRole.length != 0) {
      var currentUser = localStorage.getItem('userId') || '';
      this.employeeService
        .GetEmployeeContactsAutoCompleteById(currentUser)
        .subscribe((res) => {
          var obj = {
            employeeCode: res.employeeCode,
            name: res.userName,
            telephone: res.mobile,
            job: res.job,
            email: res.email,
            land: res.phone,
            contactUserId: res.userId,
          };
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('employeeCode')
            ?.setValue(obj);
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('name')
            ?.setValue(obj.name);
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('name')
            ?.disable();
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('telephone')
            ?.setValue(obj.telephone);
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('telephone')
            ?.disable();
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('job')
            ?.setValue(obj.job);
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('job')
            ?.disable();
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('email')
            ?.setValue(obj.email);
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('email')
            ?.disable();
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('land')
            ?.setValue(obj.land);
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('land')
            ?.disable();
          (this.callInfoForm.get('callSiteContactPerson') as FormArray)
            .at(0)
            .get('contactUserId')
            ?.setValue(obj.contactUserId);
          this.callInfoForm
            .get('typeofRequest')
            ?.setValue(this.typeOfrequests.filter((x) => x.value == 1)[0]);
          //this.callInfoForm.get('typeofRequest')?.disable()
          this.callInfoForm
            .get('requestedThrough')
            ?.setValue(this.requestedThrough.filter((x) => x.value == 5)[0]);
          //this.callInfoForm.get('requestedThrough')?.disable()
        });
    }
  }

  addcontact_Data() {
    this.callSiteContactPerson.push(this.newcontact_Data());
  }

  removecontact_Data(i: number) {
    this.callSiteContactPerson.removeAt(i);
  }

  onSelectEmployee(event: any) {
    this.employeeService
      .GetEmployeeContactsAutoComplete(event.query)
      .subscribe((data) => {
        this.listEmployee = data;
      });
  }

  bindEmployee(event: any, index: number) {
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('employeeCode')
      ?.setValue(event);
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('name')
      ?.setValue(event.userName);
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('name')
      ?.disable();
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('telephone')
      ?.setValue(event.phone);
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('telephone')
      ?.disable();
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('job')
      ?.setValue(event.job);
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('job')
      ?.disable();
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('email')
      ?.setValue(event.email);
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('email')
      ?.disable();
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('land')
      ?.setValue(event.land);
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('land')
      ?.disable();
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('contactUserId')
      ?.setValue(event.userId);
  }

  clearEmployee(index: number) {
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('employeeCode')
      ?.setValue('');
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('name')
      ?.setValue('');
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('name')
      ?.enable();
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('telephone')
      ?.setValue('');
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('telephone')
      ?.enable();
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('job')
      ?.setValue('');
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('job')
      ?.enable();
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('email')
      ?.setValue('');
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('email')
      ?.enable();
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('land')
      ?.setValue('');
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('land')
      ?.enable();
    (this.callInfoForm.get('callSiteContactPerson') as FormArray)
      .at(index)
      .get('contactUserId')
      ?.setValue('');
  }

  onSelectFirstStatus(event: any) {

    if (event.value.value == 2) {
      this.isShowVisitDate = true;
      this.FMfirstAction = false;
    }
    else {
      this.FMfirstAction = false;
      this.isShowVisitDate = false;
    }

    if (
      this.userAssetGroupSelected.id == AssetGroup.FM &&
      event.value.value == 1
    ) {
      this.FMfirstAction = true;
    }
  }

  withComment1(data: any) {
    this.viewComment = data.value.value == 3 ? 'true' : 'false';
  }

  attachmentReady(event: any) {
    (this.attachmentCallForm.get('attachments') as FormArray).push(
      this.fb.group({
        attachmentName: event[0],
        attachmentURL: [''],
        id: 0,
      })
    );
  }

  attachmentDelete(event: any) {
    (this.attachmentCallForm.get('attachments') as FormArray).removeAt(event);
  }

  changeTypeOfReq(event: any) {
    if (event.value.value == 2) {
      this.showSafety = 'true';
    } else {
      this.showSafety = 'false';
    }
  }

  selectStartDate($event: any) {
    if (this.firsActionForm.controls['startDate'].value) {
      this.startDate = this.firsActionForm.controls['startDate'].value;
      this.StartFlag = true;

      if (
        this.firsActionForm.value.endDate == null ||
        this.firsActionForm.value.startDate == null ||
        this.firsActionForm.value.endDate == '' ||
        this.firsActionForm.value.startDate == ''
      ) {
        return;
      }

      if (this.startDate > this.endDate) {
        this.firsActionForm.controls['startDate'].setValue('');
        this.firsActionForm.controls['workingHours'].setValue(0);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The Start date is greater than the End date',
          life: 3000,
        });
      } else if (this.startDate < this.minDateVal) {
        this.firsActionForm.controls['startDate'].setValue('');
        this.firsActionForm.controls['workingHours'].setValue(0);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The Start date should be greater than the request date',
          life: 3000,
        });
      } else {
        this.calculateTime();
      }
    }
  }

  selectEndDate($event: any) {
    if (this.firsActionForm.controls['endDate'].value) {
      this.endDate = this.firsActionForm.controls['endDate'].value;
      if (this.endDate < this.startDate) {
        this.firsActionForm.controls['endDate'].setValue('');
        this.firsActionForm.controls['workingHours'].setValue(0);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The End date is less than the Start date',
          life: 3000,
        });
      } else {
        this.calculateTime();
      }
    }
  }

  calculateTime() {
    if (
      this.firsActionForm.value.endDate == '' ||
      this.firsActionForm.value.startDate == ''
    ) {
      return;
    }

    if (
      this.firsActionForm.value.endDate != null &&
      this.firsActionForm.value.startDate != null
    ) {
      let start = new Date(this.firsActionForm.value.startDate).getTime();
      let end = new Date(this.firsActionForm.value.endDate).getTime();
      let minute = (end - start) / (1000 * 60 * 60);
      this.firsActionForm.controls['workingHours'].setValue(minute.toFixed(2));
    }
  }
}
