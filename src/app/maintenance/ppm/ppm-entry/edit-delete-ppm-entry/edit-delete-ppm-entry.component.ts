import { AssetGroup } from './../../../../../data/Enum/asset-group';

import { filter } from 'rxjs';
import { DataUtil } from './../../../../../_metronic/kt/_utils/_DataUtil';
import { SupplierService } from 'src/app/data/service/supplier.service';
import {
  vAttachments,
  vKits,
} from 'src/app/data/models/ppm-entry-model';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  MessageService,
} from 'primeng/api';
import {
  PpmEntryModel,
  vCalibrationTools

} from 'src/app/data/models/ppm-entry-model';
import { AssetsService } from 'src/app/data/service/assets.service';
import { PPMEntryService } from 'src/app/data/service/ppm-entry.service';
import {
  buildAttatchmentForm,
  buildCalibretionForm,
  buildVisitTimersForm,
  buildChecklistForm,
  buildForm,
  buildKitsForm,
  getVisitModel,
} from './add-form-builder';
import validateForm from 'src/app/shared/helpers/validateForm';
import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { PartCatalogService } from 'src/app/modules/store/partcatalog/part-catalog.service';
import { SignalRService } from 'src/app/data/service/signal-r.service';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { AssetType } from 'src/app/shared/ENUMS/asset-type';
import { Lookup } from 'src/app/data/Enum/lookup';
import { TransactionHistory } from 'src/app/shared/models/transaction-history';

@Component({
  selector: 'edit-delete-ppm-entry',
  templateUrl: './edit-delete-ppm-entry.component.html',
  styleUrls: ['./edit-delete-ppm-entry.component.scss'],
})
export class EditDeletePpmEntryComponent {
  transactionHistory: TransactionHistory
  calendarVal?: Date;
  visitForm!: FormGroup;
  visitTimersForm!: FormGroup;
  vCalibrationTools!: FormGroup;
  visitTimers!: FormGroup;
  vKits!: FormGroup;
  vContats!: FormGroup;
  vChecklists!: FormGroup;
  vAttachments!: FormGroup;
  currentUser: any;
  currentUserName: any;
  currentUserType: any;
  isInternal: boolean = true;
  img: any;
  assetid: any;
  ppmEntryModel: PpmEntryModel = new PpmEntryModel();
  visites: [] = [];
  key!: any;
  disabled: boolean = true;
  required: boolean = false;
  items!: MenuItem[];
  TypeService: any[] = [];
  visitStatus: [] = [];
  deviceStatus: [] = [];
  safetyList: [] = [];
  tasks: [] = [];
  employee: [] = [];
  schduleList: [] = [];
  serialList: [] = [];
  assetNumberList: [] = [];
  siteList: [] = [];
  groupLeader: [] = [];
  forwardTo: [] = [];
  timeFrame: [] = [];
  taskStatus: [] = [];
  suppliers: [] = [];
  catalogList: [] = [];
  catalogNumberList: [] = [];
  assetList: any[] = [];
  totalRows: number = 0;
  loading!: boolean;
  tabIndex: number = 0;
  createdOn!: any;
  modifiedOn!: any;
  calibration: any;
  kits: any;
  checklist: any;
  attachments: any;
  assetFlag: boolean = false;
  catalogFlag: boolean = false;
  contacts: any;
  actualDate: Date | null = null;
  expectedDate: Date | null = null;
  nextDate: Date | null = null;

  caliDate: Date | null = null;
  assetId: any | null = null;
  serialNumber: string | null = null;
  contractList: [] = [];
  contractNum: number | null = null;
  fileList: File[] = [];
  check: boolean = true;
  addImg!: boolean;
  uploadedFiles: any[] = [];
  contractId: any;
  partNumber: any;
  partName: any;
  attachmentName: any[] = [];
  engineerId: any;
  startFlag: boolean = false;
  suppPersons: any[] = [];
  suppStartDate: any;
  suppStartFlag: boolean = false;
  suppEndDate: any;
  assetAvailabilityList: [] = [];
  assetGroups: any;
  instructionDescription: string;
  instructionDescriptionId: string;
  InstructionText: any[] = [];
  newArray: any[] = [];
  AssetGroupId: number;
  visitClosed: boolean = false;
  actualMinDate: Date;
  dateFlag: boolean = false;
  constructor(
    private partCatalogApi: PartCatalogService,
    private route: Router,
    private router: ActivatedRoute,
    private supplierApi: SupplierService,
    private assetApi: AssetsService,
    private formbuilder: FormBuilder,
    private api: PPMEntryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private httpClient: HttpClient,
    public signalRService: SignalRService,
    private employeeService: EmployeeService

  ) { }
  ngOnInit(): void {
    this.dateFlag = false;
    this.visitTimersForm = this.formbuilder.group({
      visitTimers: this.formbuilder.array([]),
    });
    this.assetGroups = JSON.parse(localStorage.getItem('selectedAssetGroup') || '{}');
    this.AssetGroupId = this.assetGroups.id;

    this.vCalibrationTools = buildCalibretionForm(this.formbuilder);
    this.vChecklists = buildChecklistForm(this.formbuilder);
    this.vKits = buildKitsForm(this.formbuilder);
    this.vAttachments = buildAttatchmentForm(this.formbuilder);
    this.visitForm = buildForm(
      this.formbuilder,
      this.vCalibrationTools,
      this.vChecklists,
      this.vContats,
      this.vKits,
      this.vAttachments
    );


    this.router.queryParams.subscribe((params: any) => {
      console.log('params', params);
      this.ppmEntryModel.id = params.data;
      console.log('this.ppmEntryModel.id', this.ppmEntryModel.id);
      this.tabIndex = params.index;
      this.editTab();
    });
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'View Visit' },
    ];

    this.getDeviceStatus();
    this.getTaskStatus();
    this.getTimeFrame();
    this.getTypeService();
    this.getVisitStatus();
    this.getSuppliers();
    this.getSafety();
    this.getAssetAvailability();
    this.currentUserLogin();
  }

  editTab() {
    this.api.getSingleVisit(this.ppmEntryModel.id).subscribe((res) => {
      const data = res.data;
      this.transactionHistory = new TransactionHistory();
      Object.assign(this.transactionHistory, res.data);
      if (this.AssetGroupId == 2) {
        this.instructionDescription = res.data.instructionDescription;
        this.instructionDescriptionId = res.data.instructionDescriptionId;
        this.InstructionText = res.data.vChecklists.length == 0 ? res.data.listInstructionText : res.data.vChecklists;
      }

      if (res.data.assignedEmployeeId == null) {
        this.dateFlag = true;
      }

      if (res.data.visitStatusId == 270 || res.data.visitStatusId == 269) {
        this.visitClosed = true;
      }

      this.actualMinDate = new Date(data.expectedDate);
      this.getEmployeeID(data.assetId);
      console.log('data', data);
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.visitForm.controls['typeOfServiceId'].setValue(
          data.typeOfServiceId
        );

        if (data.typeOfServiceId == 65 || data.typeOfServiceId == null) {
          this.isInternal = true;
        } else {
          this.isInternal = false;
        }
        for (let index = 0; index < data.vCalibrationTools.length - 1; index++)
          this.addMoreCalibration();

        for (let index = 0; index < data.vKits.length - 1; index++)
          this.addMorePpmKits();

        if (this.AssetGroupId == 2) {
          if (this.InstructionText != null) {
            for (let index = 0; index < this.InstructionText.length - 1; index++)
              this.addMorePpmCheckList();
          }

        } else {
          for (let index = 0; index < data.vChecklists.length - 1; index++)
            this.addMorePpmCheckList();
        }
        dateHelper.parseDateFilds(data.vCalibrationTools, [
          'calibrationDateOfTesters',
        ]);

        if (data.visitTimers) {
          (data.visitTimers as any[]).forEach(x => {
            (this.visitTimersForm.get('visitTimers') as FormArray).push(
              this.formbuilder.group({
                id: x.id,
                startDateTime: new Date(x.startDateTime),
                endDateTime: new Date(x.endDateTime),
                workingHours: x.workingHours
              })
            );

          })
        }
        if ((this.visitTimersForm.get('visitTimers') as FormArray).length == 0) {
          (this.visitTimersForm.get('visitTimers') as FormArray).push(
            this.formbuilder.group({
              id: [0],
              startDateTime: [null],
              endDateTime: [null],
              workingHours: [null]
            })
          );
        }

        dateHelper.parseDateFilds(data, [
          'expectedDate',
          'actualDate',
          'nextDate',
        ]);
        this.visitForm.controls['maintenanceCString'].patchValue({
          contractNumber: data.contractNumber,
        });
        this.visitForm.patchValue(data);

        this.contractId = data.maintenanceContractId;
        if (data.supplierId) {
          this.getSuppPersons(data.supplierId);
        }

        this.visitForm.controls['supplierString'].patchValue({
          suppliername: data.supplierName,
        });
        // this.visitForm.controls['startDate'].patchValue(
        //   dateHelper.handleDateApi(data.startDate)
        // );
        // this.visitForm.controls['endDate'].patchValue(
        //   dateHelper.handleDateApi(data.endDate)
        // );
        this.visitForm.controls['suppStartDate'].patchValue(
          dateHelper.handleDateApi(data.suppStartDate)
        );
        this.visitForm.controls['suppEndDate'].patchValue(
          dateHelper.handleDateApi(data.suppEndDate)
        );
        this.attachments = data.vAttachments;
        if (this.attachments.length > 0) {
          this.attachmentName[0] = this.attachments[0].attachmentName;
        }

        if (data.vCalibrationTools.length == 0) {

        } else {
          let counter = 0;
          (<FormArray>(
            this.visitForm.controls['vCalibrationTools']
          )).controls.forEach((c) => {
            const objToBind = {
              assetSerialNo: data.vCalibrationTools[counter].assetSerialNo,
              assetNumber: data.vCalibrationTools[counter].assetNumber,
              assetName: data.vCalibrationTools[counter].assetName,
              id: data.vCalibrationTools[counter].assetId,
            };
            this.assetid = data.vCalibrationTools[counter].assetId;
            c.patchValue({ bind: objToBind });
            this.assetList = <any>[...this.assetList, objToBind];
            counter++;
          });
        }

        if (data.vKits.length == 0) {

        } else {
          let x = 0;
          (<FormArray>this.visitForm.controls['vKits']).controls.forEach(
            (c) => {
              const objToBind = {
                id: data.vKits[x].partCatalogItemId,
                partName: data.vKits[x].partName,
                partNumber: data.vKits[x].partNumber,
              };
              c.patchValue({ bind: objToBind });
              this.catalogList = <any>[...this.catalogList, objToBind];
              x++;
            }
          );
        }

        // if (data.startDate) {
        //   this.startFlag = true;
        //   this.startDate = data.startDate;
        // }

        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;
        this.calibration = data.vCalibrationTools;
        this.kits = data.vKits;
        this.checklist = data.vChecklists;

      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });

  }

  setExsitingAttachment(attachs: vAttachments[]) {
    attachs.forEach((a) => {
      (this.visitForm.get('vAttachments') as FormArray).push(
        this.formbuilder.group({
          attachmentName: a.attachmentName,
          attachmentURL: a.attachmentURL,
          id: a.id,
          visitId: a.visitId,
        })
      );
    });
  }

  currentUserLogin() {
    let result: any[] = [];
    let userRoles = JSON.parse(localStorage.getItem("userRoles") || "");
    result = userRoles;
    console.log(userRoles)
    var engineerRole = result.filter(x => x.value == "R-6");
    var callCenterRole = result.filter(x => x.value == "R-2");
    var serviceDeliveryRole = result.filter(x => x.value == "R-10");
    this.currentUser = localStorage.getItem("userId") || "";
    if (engineerRole.length != 0) {
      this.currentUserType = "Engineer";
      this.required = true;
    }
    else if (callCenterRole.length != 0) {
      this.currentUserType = "Call Center";
      this.required = false;
    }
    else if (serviceDeliveryRole.length != 0) {
      this.currentUserType = "Service Delivery";
    }
  }


  update() {

    if (this.visitForm.invalid) {
      validateForm.validateAllFormFields(this.visitForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    }
    else {
      let model = getVisitModel(this.visitForm.value);
      //model.instructionDescriptionId = this.instructionDescriptionId;
      dateHelper.reverseDateFilds(model.vCalibrationTools, [
        'calibrationDateOfTesters',
      ]);
      model.visitTimers = [];
      (this.visitTimersForm.get('visitTimers') as FormArray).controls.forEach((element) => {
        if (element.value.startDateTime != null && element.value.endDateTime != null) {
          var s: any;
          var dto = {
            id: 0,
            startDateTime: s,
            endDateTime: s,
            workingHours: null
          }
          dto.id = element.value.id;
          try {
            dto.startDateTime = dateHelper.ConvertDateWithSameValue(element.value.startDateTime);
          }
          catch { }
          try {
            dto.endDateTime = dateHelper.ConvertDateWithSameValue(element.value.endDateTime);
          }
          catch { }
          dto.workingHours = element.value.workingHours;
          model.visitTimers.push(dto);
        }

      });
      dateHelper.reverseDateFilds(model, [
        'expectedDate',
        'nextDate',
        'actualDate',
      ]);
      // model.startDate = dateHelper.ConvertDateWithSameValue(model.startDate);
      // model.endDate = dateHelper.ConvertDateWithSameValue(model.endDate);
      model.suppStartDate = dateHelper.ConvertDateWithSameValue(
        model.suppStartDate
      );
      model.suppEndDate = dateHelper.ConvertDateWithSameValue(
        model.suppEndDate
      );
      console.log('model', model);

      if (!model.vAttachments) {
        model.vAttachments = [];
      }
      (this.visitForm.get('vAttachments') as FormArray).controls.forEach(
        (element) => {
          let attach = new vAttachments();
          attach.visitId = this.ppmEntryModel.id;
          attach.attachmentName = this.img;
          console.log('attach', attach);
          model.vAttachments.push(attach);
        }
      );

      model.vAttachments.push();
      if (this.AssetGroupId == 2 && this.required) {
        model.InstructionDescriptionId = this.instructionDescriptionId;
        if (this.InstructionText.length > 0) {
          this.newArray = model.vChecklists;

          model.vChecklists = [];
          for (let i = 0; i < this.InstructionText.length; i++) {
            model.vChecklists.push({
              id: this.newArray[i].id,
              measuredValue: this.newArray[i].measuredValue,
              task: this.newArray[i].task,
              taskComment: this.newArray[i].taskComment,
              taskStatusId: this.newArray[i].taskStatusId,
              taskStatusName: this.newArray[i].taskStatusName,
              visitId: this.newArray[i].visitId,
              InstructionTextId: this.InstructionText[i].instructionTextId
            });
          }
        }
      }


      this.api.updateVisit(model).subscribe((res) => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          model = {};
          this.route.navigate(['/maintenance/ppm/ppm-entry']);
          this.signalRService.initializeConnection();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
          model = {};
        }
      });
    }
  }








  deletePpmEntry() {
    this.router.queryParams.subscribe((params: any) => {
      this.ppmEntryModel.id = params.data;
      console.log(this.ppmEntryModel.id);
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this Visit?',
        header: 'Confirm',
        rejectButtonStyleClass: 'p-button-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.deleteVisit(this.ppmEntryModel.id).subscribe((res) => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });
              this.route.navigate(['/maintenance/ppm/ppm-entry']);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 3000,
              });
            }
          });
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              this.messageService.add({
                severity: 'warn',
                summary: 'Cancelled',
                detail: 'You have cancelled',
              });
              break;
            case ConfirmEventType.CANCEL:
              this.messageService.add({
                severity: 'warn',
                summary: 'Cancelled',
                detail: 'You have cancelled',
              });
              break;
          }
        },
      });
    });
  }
  getEmployeeID(assetId: any) {
    this.employeeService.GetUserByRoleValueSiteAndAssetGroup('R-6', assetId).subscribe((res: any) => {
      this.employee = res;
    });
  }

  getTypeService() {
    this.api.getLookups({ queryParams: 34 }).subscribe((res) => {
      this.TypeService = res.data;
    });
  }

  getTimeFrame() {
    this.api.getLookups({ queryParams: 400 }).subscribe((res) => {
      this.timeFrame = res.data;
    });
  }

  getTaskStatus() {
    this.api.getLookups({ queryParams: 403 }).subscribe((res) => {
      this.taskStatus = res.data;

    });
  }
  getVisitStatus() {
    this.api.getLookups({ queryParams: 402 }).subscribe((res) => {
      this.visitStatus = res.data;
    });
  }
  getDeviceStatus() {
    this.api.getLookups({ queryParams: 401 }).subscribe((res) => {
      this.deviceStatus = res.data;
    });
  }
  getAssetAvailability() {
    this.api.getLookups({ queryParams: Lookup.AssetAvailability }).subscribe((res) => {
      this.assetAvailabilityList = res.data;
    });
  }

  getSafety() {
    this.api.getLookups({ queryParams: 480 }).subscribe((res) => {
      this.safetyList = res.data;
    });
  }
  getSuppliers() {
    this.supplierApi.getSupplier({}).subscribe((res) => {
      this.suppliers = res.data;
    });
  }

  changeEmployee(event: any) {
    this.visitForm.value.assignedEmployeeId = event.value;
  }
  changePerson(event: any) {
    this.visitForm.value.suppPersonId = event.value;
    console.log('event.value', event.value);
  }
  changeDeviceStatus(event: any) {
    this.visitForm.value.deviceStatusId = event.value;
  }
  changeVisitStatus(event: any) {
    this.visitForm.value.visitStatusId = event.value;
  }

  changeTaskStatus(event: any) {
    this.visitForm.value.taskStatusId = event.value;
  }

  changeSafetyStatus(event: any) {
    this.visitForm.value.safetyId = event.value;
  }
  changeTimeFrame(event: any) {
    this.visitForm.value.executionTimeFrameId = event.value;
  }
  changeService(event: any) {
    this.visitForm.value.typeOfServiceId = event.value;
    console.log('type', event.value);
    if (event.value == this.TypeService[1].id) {
      this.isInternal = false;
    } else {
      this.isInternal = true;
    }
  }
  changeSupplier(event: any) {
    this.visitForm.value.supplierId = event.value;
  }

  changeAssetAvailability(event: any) {
    this.visitForm.value.assetAvailabilityId = event.value;
  }

  //Customer Info Array
  calibrationsControl() {
    return (<FormArray>this.visitForm.get('vCalibrationTools')).controls;
  }

  removeCalibration(index: number) {
    (this.visitForm.get('vCalibrationTools') as FormArray).removeAt(index);
  }
  addMoreCalibration() {
    (this.visitForm.get('vCalibrationTools') as FormArray).push(
      buildCalibretionForm(this.formbuilder)
    );
  }
  visitTimerControl() {
    return (<FormArray>this.visitTimersForm.get('visitTimers')).controls;
  }

  removeVisitTimer(index: number) {
    (this.visitTimersForm.get('visitTimers') as FormArray).removeAt(index);
  }
  addMorevisitTimer() {
    (this.visitTimersForm.get('visitTimers') as FormArray).push(
      buildVisitTimersForm(this.formbuilder)
    );
  }

  ppmKitsControl() {
    return (<FormArray>this.visitForm.get('vKits')).controls;
  }
  removePpmKits(index: number) {
    (this.visitForm.get('vKits') as FormArray).removeAt(index);
  }
  addMorePpmKits() {
    (this.visitForm.get('vKits') as FormArray).push(
      buildKitsForm(this.formbuilder)
    );
  }

  ppmCheckListControl() {
    return (<FormArray>this.visitForm.get('vChecklists')).controls;
  }
  removePpmCheckList(index: number) {
    (this.visitForm.get('vChecklists') as FormArray).removeAt(index);
  }
  addMorePpmCheckList() {

    (this.visitForm.get('vChecklists') as FormArray).push(
      buildChecklistForm(this.formbuilder)
    );
  }

  attachControl() {
    return (<FormArray>this.visitForm.get('vAttachments')).controls;
  }
  removeAttachment(index: number) {
    this.addImg = true;
    (this.visitForm.get('vAttachments') as FormArray).removeAt(index);
  }
  addMoreAttachment() {
    (this.visitForm.get('vAttachments') as FormArray).push(
      buildAttatchmentForm(this.formbuilder)
    );
    this.addImg = false;
  }
  handleFileInput(files: any) {
    console.log('files event', files.currentFiles);
    this.fileList = files.currentFiles[0];
    console.log('this.fileList', this.fileList);
    this.api.uploadFiles(this.fileList).subscribe((res) => {
      const data = res.data;
      this.attachments.attachmentName = data[0];
      this.attachments.attachmentURL = null;
      this.ppmEntryModel.vAttachments.push(this.attachments);
      console.log('this.attachments', this.attachments);

      this.ppmEntryModel.vAttachments.push(this.attachments);
      const sucess = res.isSuccess;
      const message = res.message;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }
  filterByName($event: any) {
    this.assetApi
      .GetAssetsAutoCompleteMultiFilter({ assetNumber: $event.query, assetType: AssetType.Tester })
      .subscribe((d) => (this.assetList = d.data));

  }


  selectAssetSN(event: any) {
    this.assetApi
      .searchAsset(<any>{ assetSerialNumber: event.query })
      .subscribe((res) => {
        this.serialList = res.data;
      });
  }

  onSerialNumberSelect(event: any, i: number,) {
    console.log(' asset event', event);
    this.calibrationsControl()[i].patchValue({
      assetId: event.id,
      bind: event,
      assetSerialNo: event.assetSerialNo,
      assetName: event.assetName
    });
    this.assetFlag = true;
  }
  getValueFor(frm: any, key: string, prop: string) {
    if (key in (frm.getRawValue() ?? {}))
      if (frm.getRawValue()[key] != null)
        return frm.getRawValue()[key][prop] ?? '';
    return '';
  }
  onCatalogSelect(i: number, event: any) {
    console.log('event', event);
    this.ppmKitsControl()[i].patchValue({
      partCatalogItemId: event.id,
      bind: event,
      partName: event.partName,
      partNumber: event.partNumber,
    });

    this.partName = event.partName;
    this.partNumber = event.partNumber;
    this.catalogFlag = true;
    //this.visitForm.controls['vKits'].setValue({partName:event.partName,partNumber:event.partNumber});
  }
  selectcatalog(event: any) {
    this.partCatalogApi
      .searchPartCatalog({ partName: event.query })
      .subscribe((res: any) => {
        this.catalogList = res.data;
      });
  }
  selectcatalogNumber(event: any) {
    this.partCatalogApi
      .searchPartCatalog({ partNumber: event.query })
      .subscribe((res: any) => {
        this.catalogNumberList = res.data;
      });
  }
  selectCalibDate(i: number, event: any) {
    this.calibrationsControl()[i].patchValue({
      calibrationDateOfTesters: event,
    });
  }
  searchContract(event: any) {
    this.api
      .getContractNum({ maintenanceContractNumber: event.query })
      .subscribe((res) => {
        const data = res.data;
        console.log('contract:', data);
        this.contractList = data;
      });
  }

  searchSupplier(event: any) {
    this.supplierApi
      .getSupplier({ suppliername: event.query })
      .subscribe((res) => {
        this.suppliers = res.data;
      });
  }
  onSelectSupplier(event: any) {
    this.visitForm.controls['supplierId'].patchValue(event.id);
    this.visitForm.controls['supplierName'].patchValue({
      suppliername: event.suppliername,
    });
    this.suppPersons = [];
    this.getSuppPersons(event.id);
  }

  getSuppPersons(id: any) {
    this.supplierApi.getSupplierPersons(id).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const isSuccess = res.isSuccess;
      if (isSuccess == true) {
        console.log('suppPersons data', data);
        data.forEach((e: any) => {
          this.suppPersons.push({ id: e.id, name: e.personName });
        });
        this.suppPersons = <any>[...this.suppPersons];
        console.log('suppPersons list', this.suppPersons);
      } else {
        this.suppPersons = [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }
  ready(event: any) {
    console.log('attach', event);
    this.img = event[0];
    // this.attachmentForm.value.attachmentName=event[0];
  }
  onSelectContract(event: any) {
    this.contractNum = event.id;
    this.visitForm.controls['maintenanceContractId'].patchValue(event.id);
  }
  selectStartDate($event: any, i: any) {
    //   if ((this.visitForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.value) {

    //   if(new Date((this.visitForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.value) > new Date((this.visitForm.get('visitTimers') as FormArray).at(i).get('endDateTime')?.value)){
    //     (this.visitForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.setValue(null);
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: "The Start date is greater than the End date",
    //       life: 3000,
    //     });
    //   }
    //   else if(new Date((this.visitForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.value) < this.minDateVal){
    //     (this.visitForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.setValue(null);
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: "The Start date should be greater than the current date",
    //       life: 3000,
    //     });
    //   }
    //   else{
    //   }
    // }

    if ((this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('endDateTime')?.value == null ||
      (this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('endDateTime')?.value == '' ||
      (this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.value == null ||
      (this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.value == ''
    ) {
      return;
    }
    var start = new Date((this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.value);
    var end = new Date((this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('endDateTime')?.value);

    this.api
      .calcWorkingHours({ startDate: start, endDate: end })
      .subscribe((res) => {
        const data = res.data;
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          (this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('workingHours')?.setValue(data.workingHours)

        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
      });

  }


  selectEndDate($event: any, i: any) {
    if ((this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('endDateTime')?.value == null ||
      (this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('endDateTime')?.value == '' ||
      (this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.value == null ||
      (this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.value == ''
    ) {
      return;
    }
    var start = new Date((this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.value);
    var end = new Date((this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('endDateTime')?.value);

    this.api
      .calcWorkingHours({ startDate: start, endDate: end })
      .subscribe((res) => {
        const data = res.data;
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          (this.visitTimersForm.get('visitTimers') as FormArray).at(i).get('workingHours')?.setValue(data.workingHours)

        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
      });

    //   if ((this.visitForm.get('visitTimers') as FormArray).at(i).get('endDateTime')?.value) {
    //   if(new Date((this.visitForm.get('visitTimers') as FormArray).at(i).get('endDateTime')?.value) < new Date((this.visitForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.value)){
    //     (this.visitForm.get('visitTimers') as FormArray).at(i).get('endDateTime')?.setValue(null);
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: "The End date is less than the Start date",
    //       life: 3000,
    //     });
    //   }
    //   else{
    //   }
    //   if (this.startFlag == false) {
    //     this.visitForm.controls['endDate'].patchValue(null);
    //     this.messageService.add({
    //       severity: 'warn',
    //       summary: 'Warning',
    //       detail:
    //         'Please Select Start Date First To Calculate Working Hours Correctly !',
    //       life: 5000,
    //     });
    //   } else {
    //     this.api
    //       .calcWorkingHours({ startDate:  (this.visitForm.get('visitTimers') as FormArray).at(i).get('startDateTime')?.setValue(null), endDate: (this.visitForm.get('visitTimers') as FormArray).at(i).get('endDateTime')?.setValue(null) })
    //       .subscribe((res) => {
    //         const data = res.data;
    //         const message = res.message;
    //         const sucess = res.isSuccess;
    //         if (sucess == true) {
    //           (this.visitForm.get('visitTimers') as FormArray).at(i).get('workingHours')?.setValue(data.workingHours)

    //         } else {
    //           this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: message,
    //             life: 3000,
    //           });
    //         }
    //       });
    //   }
    //  }
  }

  selectSuppStartDate($event: any) {
    this.suppStartDate = $event;
    this.suppStartFlag = true;
  }

  selectSuppEndDate($event: any) {
    this.suppEndDate = $event;
    if (this.suppStartFlag == false) {
      this.visitForm.controls['suppEndDate'].patchValue(null);
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail:
          'Please Select Start Date First To Calculate Working Hours Correctly !',
        life: 5000,
      });
    } else {
      this.api
        .calcWorkingHours({
          startDate: this.suppStartDate,
          endDate: this.suppEndDate,
        })
        .subscribe((res) => {
          const data = res.data;
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.visitForm.controls['suppWorkingHours'].patchValue(
              data.workingHours
            );
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        });
    }
  }
}
