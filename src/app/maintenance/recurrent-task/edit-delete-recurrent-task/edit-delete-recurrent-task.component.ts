import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';

import {
  buildForm,
  getRecurrentTaskModel,
} from '../add-recurrent-task-form-builder';
import { RecurrentTaskModel } from '../recurrent-task.model';
import { RecurrentTaskService } from '../recurrent-task.service';
import { GasRoomService } from '../../gas-room/data/gas-room.service';
import { cylinderProperties } from '../../ordering-cylinders-lox/data/ordering-cylinders-lox.model';
import { CommonModule, formatDate } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { PPMEntryService } from '../../../services/ppm-entry.service';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import validateForm from '../../../shared/helpers/validateForm';
import { Role } from '../../../shared/enums/role';
import { PrimengModule } from '../../../shared/primeng.module';


@Component({
  standalone: true,
  selector: 'app-edit-delete-recurrent-task',
  imports: [PrimengModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-delete-recurrent-task.component.html',
  styleUrls: ['./edit-delete-recurrent-task.component.scss'],
})
export class EditDeleteRecurrentTaskComponent implements OnChanges {

  /* @Input('showmodal') showmodal : boolean = false ;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>(); */

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('edit_index') edit_index: any = 0;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  /* transactionHistory: TransactionHistory */
  addRecurrentForm!: FormGroup;
  recurrentTestModel: RecurrentTaskModel = new RecurrentTaskModel();

  msgs!: Message[];
  isSubmitted = false;
  items!: MenuItem[];

  taskTypeList: [] = [];
  frequentList: [] = [];
  renewedList: any[] = [];
  statusList: [] = [];
  assignedEmpList: [] = [];
  siteList: [] = [];
  teamLeaderList: [] = [];

  roomIdList: any[] = [];
  roomModel: any;

  siteId!: number;

  createdOn!: any;
  modifiedOn!: any;
  tabIndex: number = 0;

  empRole: any;
  roleValue: any;
  userId: any;
  imEngineer: boolean = false;

  testCheck: any[] = [
    { name: 'Pass', value: true },
    { name: 'Fail', value: false },
  ];

  startDate: any;
  startFlag: boolean = false;
  endFlag: boolean = false;
  endDate: any;

  is2PerDay: boolean = false;
  isChild: boolean = false;
  isStartEndDateRequired: boolean = false;
  showCylinders: boolean = true;
  mainFold: boolean = false;
  o2: boolean = false;
  n2o: boolean = false;
  n2: boolean = false;
  co2: boolean = false;
  medicalAir: boolean = false;
  lox: boolean = false;
  plantRoom: boolean = false;
  backupCylinders: boolean = false;

  cylindersArr = cylinderProperties;

  showEditTab: boolean = false;
  minDateVal!: Date;

  sunday:boolean=true;
  monday:boolean=false;
  tuesday:boolean=false;
  wednesday:boolean=false;
  thursday:boolean=false;
  friday:boolean=false;
  saturday:boolean=false;
  isDay:boolean=false;

  //#endregion

  //#region Ctor and OnInit
  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private api: RecurrentTaskService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private empServices: EmployeeService,
    private roomApi: GasRoomService,
    private ppmEAPI: PPMEntryService,
    private employeeService: EmployeeService,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
     this.Init();
  }

  close_modal() {
    this.openModals.emit(false);
  }

  Init(): void {
    this.empRole = JSON.parse(localStorage.getItem('userRoles') || '{}');
    this.userId = localStorage.getItem('userId');
      if(this.empRole) {
        this.empRole.forEach((e: any) => {
          this.roleValue = e.value;
          if (this.roleValue == 'R-6') {
            this.imEngineer = true;
          }
        });
      }

    this.addRecurrentForm = buildForm(this.formbuilder);
    /* this.route.queryParams.subscribe((params: any) => { */
     /*  this.tabIndex = params.index;
      this.recurrentTestModel.id = params.data; */

      this.tabIndex = this.edit_index;
      this.recurrentTestModel.id = this.edit_asset_id;
        if(this.edit_asset_id) { 
          this.api.getRecurrentTaskId(this.edit_asset_id).subscribe((res) => {
            const data = res.data;
          /*   this.transactionHistory=new TransactionHistory();
            Object.assign( this.transactionHistory,res.data); */
            console.log(data);
            this.showEditTab = this.checkDate(data.date);
            this.isChild = data.isChild;
            this.isStartEndDateRequired = this.imEngineer;
            const message = res.message;
            const sucess = res.isSuccess;
            this.minDateVal = new Date(res.data.date);
            if (sucess == true) {
              this.createdOn = data.createdOn;
              this.modifiedOn = data.modifiedOn;
              if (data.date == null) {
              } else {
                this.addRecurrentForm.controls['dateView'].setValue(
                  formatDate(new Date(data.date), 'dd/MM/YYYY hh:mm a', this.locale)
                );
              }
              if (data.startDate == null) {
              } else {
                this.addRecurrentForm.controls['startDateView'].setValue(
                  formatDate(
                    new Date(data.startDate),
                    'dd/MM/YYYY hh:mm a',
                    this.locale
                  )
                );
              }
              if (data.endDate == null) {
              } else {
                this.addRecurrentForm.controls['endDateView'].setValue(
                  formatDate(
                    new Date(data.endDate),
                    'dd/MM/YYYY hh:mm a',
                    this.locale
                  )
                );
              }
              this.isDay=false;
              if (data.frequesnt === '2 Per day') {
                this.is2PerDay = true;
                this.isDay=true
                if (!this.isChild) {
                  this.showCylinders = false;
                }
              }
              if (data.frequesnt === '1 Per day') {
                this.isDay=true
              }
              this.sunday=data.sunday;
              this.monday=data.monday;
              this.tuesday=data.tuesday;
              this.wednesday=data.wednesday;
              this.thursday=data.thursday;
              this.friday=data.friday;
              this.saturday=data.saturday;
              this.addRecurrentForm.get('sunday')?.setValue(data.sunday);
              this.addRecurrentForm.get('monday')?.setValue(data.monday);
              this.addRecurrentForm.get('tuesday')?.setValue(data.tuesday);
              this.addRecurrentForm.get('wednesday')?.setValue(data.wednesday);
              this.addRecurrentForm.get('thursday')?.setValue(data.thursday);
              this.addRecurrentForm.get('friday')?.setValue(data.friday);
              this.addRecurrentForm.get('saturday')?.setValue(data.saturday);

              this.siteId = data.siteId;
              this.getAssignedEmployeesBySiteId(Role.engineersvalue, this.siteId);
              this.addRecurrentForm.controls['engineerUser1Id'].setValue(data.engineerUser1Id);
              this.addRecurrentForm.controls['engineerUser1Name'].setValue(data.engineerUser1Name);
              this.addRecurrentForm.controls['engineerUser2Id'].setValue(data.engineerUser2Id);
              this.addRecurrentForm.controls['engineerUser2Name'].setValue(data.engineerUser2Name);
              this.addRecurrentForm.patchValue(data);
              this.addRecurrentForm.controls['date'].patchValue(
                dateHelper.handleDateApi(data.date)
              );
              this.addRecurrentForm.controls['startDate'].patchValue(
                dateHelper.handleDateApi(data.startDate)
              );
              this.addRecurrentForm.controls['endDate'].patchValue(
                dateHelper.handleDateApi(data.endDate)
              );
              this.addRecurrentForm.controls['firstDate'].patchValue(
                dateHelper.handleDateApi(data.firstDate)
              );
              this.addRecurrentForm.controls['secondDate'].patchValue(
                dateHelper.handleDateApi(data.secondDate)
              );
              this.addRecurrentForm.controls['siteName'].setValue({
                custName: data.siteName,
              });
              this.addRecurrentForm.controls['roomName'].setValue({
                roomId: data.roomId ? data.roomId : '',
              });

              console.log("data", data);
              this.setRoomModel(data.roomId);
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
   /*  }); */
    this.getTaskType();
    this.getFrequent();
    this.getRenewed();
    this.getStatus();

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      {
        label: 'Recurring Task',
        routerLink: ['/maintenance/recurrent-task/schedule'],
      },
    ];
  }
  //#endregion

  //#region Room Management
  roomIdFilter(name: any) {
    this.roomApi.searchRoom({ roomId: name.query }).subscribe((res) => {
      const data = res.data;
      this.roomIdList = data;
    });
  }

  setRoomModel(roomId: any) {
    if (roomId) {
      this.roomApi.searchRoom({ roomId }).subscribe((res) => {
        const data = res.data;
        this.roomModel = data[0];
        this.changeRoomConditions();
        console.log('this.roomModel', this.roomModel);
      });
    }
  }

  changeRoom(event: any) {
    this.makeRoomValuesNull();
    console.log(event);
    this.roomModel = event;
    this.changeRoomConditions();
    this.addRecurrentForm.controls['roomId'].setValue(event.roomId);
    this.addRecurrentForm.controls['roomName'].setValue({
      roomId: event.roomId,
    });
  }

  changeRoomConditions() {
    if (
      this.roomModel?.o2ManifoldMainOut ||
      this.roomModel.o2ManifoldRightBank ||
      this.roomModel.o2ManifoldLeftBank ||
      this.roomModel.o2ManifoldEmergency
    ) {
      this.o2 = true;
    } else {
      this.o2 = false;
    }

    if (
      this.roomModel.n2OMainout ||
      this.roomModel.n2ORightBank ||
      this.roomModel.n2OLeftBank ||
      this.roomModel.n2OEmergencyBank
    ) {
      this.n2o = true;
    } else {
      this.n2o = false;
    }

    if (
      this.roomModel.cO2MainOut ||
      this.roomModel.cO2RightBank ||
      this.roomModel.cO2LeftBank ||
      this.roomModel.cO2EmergencyBank
    ) {
      this.co2 = true;
    } else {
      this.co2 = false;
    }

    if (
      this.roomModel.n2Mainout ||
      this.roomModel.n2RightBank ||
      this.roomModel.n2LeftBank ||
      this.roomModel.n2EmergencyBank
    ) {
      this.n2 = true;
    } else {
      this.n2 = false;
    }

    if (
      this.roomModel.medicalAirMainOut ||
      this.roomModel.medicalAirRightBank ||
      this.roomModel.medicalAirLeftBank ||
      this.roomModel.medicalAirEmergencyBank
    ) {
      this.medicalAir = true;
    } else {
      this.medicalAir = false;
    }

    if (
      this.roomModel.loX1Volume ||
      this.roomModel.loX2Volume ||
      this.roomModel.loX1Pressure ||
      this.roomModel.loX2Pressure
    ) {
      this.lox = true;
    } else {
      this.lox = false;
    }

    if (
      this.roomModel.compressorsCheckforAnyUnusualNoise ||
      this.roomModel.compressorsOutputPressure ||
      this.roomModel.compressorsMedicalAirLinePressure7To8Bar ||
      this.roomModel.compressorsMedicalAirLinePressure4To5Bar ||
      this.roomModel.dryersCheckforAlarmOrUnusualNoise ||
      this.roomModel.vacuumPumpCheckOilLeakage ||
      this.roomModel.vacuumPumpCheckForAnyUnusualNoise ||
      this.roomModel.vacuumPumpPressure ||
      this.roomModel.agssCheckForAnyAlarm ||
      this.roomModel.agssCheckManualOperation ||
      this.roomModel.agssCheckAndCleanFilter
    ) {
      this.plantRoom = true;
    } else {
      this.plantRoom = false;
    }

    if (this.o2 || this.n2o || this.n2 || this.co2 || this.medicalAir) {
      this.mainFold = true;
    } else {
      this.mainFold = false;
    }

    if (
      this.roomModel.pftHeliumEmpty ||
      this.roomModel.pftMixEmpty ||
      this.roomModel.mixtureMTypeEmpty ||
      this.roomModel.liquidNitrogenLarge121LEmpty ||
      this.roomModel.liquidNitrogenMedium50LEmpty ||
      this.roomModel.liquidNitrogenSmall30LEmpty ||
      this.roomModel.maeTypeEmpty ||
      this.roomModel.makTypeEmpty ||
      this.roomModel.n2KTypeEmpty ||
      this.roomModel.cO2KTypeEmpty ||
      this.roomModel.cO2ETypeEmpty ||
      this.roomModel.n2OETypeEmpty ||
      this.roomModel.n2OKTypeEmpty ||
      this.roomModel.o2DTypeEmpty ||
      this.roomModel.o2MTypeEmpty ||
      this.roomModel.o2ETypeEmpty ||
      this.roomModel.o2KTypeEmpty
    ) {
      this.backupCylinders = true;
    } else {
      this.backupCylinders = false;
    }
  }

  makeRoomValuesNull() {
    this.addRecurrentForm.controls['loX1Volume'].setValue(null);
    this.addRecurrentForm.controls['loX2Volume'].setValue(null);

    this.addRecurrentForm.controls['o2KTypeEmpty'].setValue(null);
    this.addRecurrentForm.controls['o2MTypeEmpty'].setValue(null);
    this.addRecurrentForm.controls['o2ETypeEmpty'].setValue(null);
    this.addRecurrentForm.controls['o2DTypeEmpty'].setValue(null);
    this.addRecurrentForm.controls['makTypeEmpty'].setValue(null);
    this.addRecurrentForm.controls['maeTypeEmpty'].setValue(null);
    this.addRecurrentForm.controls['n2OKTypeEmpty'].setValue(0);
    this.addRecurrentForm.controls['n2OETypeEmpty'].setValue(null);
    this.addRecurrentForm.controls['cO2KTypeEmpty'].setValue(null);
    this.addRecurrentForm.controls['cO2ETypeEmpty'].setValue(null);
    this.addRecurrentForm.controls['mixtureMTypeEmpty'].setValue(null);
    this.addRecurrentForm.controls['n2KTypeEmpty'].setValue(null);
    this.addRecurrentForm.controls['pftMixEmpty'].setValue(null);
    this.addRecurrentForm.controls['pftHeliumEmpty'].setValue(null);
    this.addRecurrentForm.controls['liquidNitrogenLarge121LEmpty'].setValue(
      null
    );
    this.addRecurrentForm.controls['liquidNitrogenMedium50LEmpty'].setValue(
      null
    );
    this.addRecurrentForm.controls['liquidNitrogenSmall30LEmpty'].setValue(
      null
    );
  }

  //#endregion

  //#region Lookups
  getTaskType() {
    this.api.getLookups({ queryParams: 506 }).subscribe((res) => {
      this.taskTypeList = res.data;
    });
  }

  getFrequent() {
    this.api.getLookups({ queryParams: 508 }).subscribe((res) => {
      this.frequentList = res.data;
    });
  }

  getRenewed() {
    let renewedObj = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];
    this.renewedList = renewedObj;
  }

  getStatus() {
    this.api.getLookups({ queryParams: 801 }).subscribe((res) => {
      this.statusList = res.data;
    });
  }

  siteSearch(e: any) {
    this.api.searchSites(e.query).subscribe((res) => {
      const data = res.data;
      this.siteList = data;
    });
  }

  // getAssignedEmployee() {
  //   this.empServices.searchRoles({ fixedName: 'R-6' }).subscribe((res) => {
  //     let id = res.data[0].id;
  //     this.empServices.getEmployeeByRole([id]).subscribe((res) => {
  //       this.assignedEmpList = res;
  //     });
  //   });
  // }
  getAssignedEmployeesBySiteId(
    value: string,
    siteId: number,
    assetId?: number
  ) {
    this.employeeService
      .GetUserByRoleValueSiteAndAssetGroupBySite(value, siteId)
      .subscribe((res: any) => {
        this.assignedEmpList = res;
      });
  }
  //#endregion

  //#region Lookups Changes
  changeTask(event: any) {
    this.addRecurrentForm.value.taskType = event.value;
  }

  changeFrequent(event: any) {
    const label = event.originalEvent.target.innerText;
    this.addRecurrentForm.value.frequent = event.value;
    if (label === '2 Per day') {
      this.is2PerDay = true;
      this.addRecurrentForm.get('date')?.setValue(null);
    } else {
      this.is2PerDay = false;
      this.addRecurrentForm.get('firstDate')?.setValue(null);
      this.addRecurrentForm.get('secondDate')?.setValue(null);
    }
  }

  changeRenewed(event: any) {
    this.addRecurrentForm.value.renewed = event.value;
  }

  changeStatus(event: any) {
    this.addRecurrentForm.value.status = event.value;
  }

  changeTeamLeader(event: any) {
    this.addRecurrentForm.value.teamLeader = event.value;
  }

  changeSite(event: any) {
    this.siteId = event.id;
  }
  //#endregion

  //#region Calculate Working Hours
  selectStartDate($event: any) {
    if (this.addRecurrentForm.controls['startDate'].value) {
      this.startDate = this.addRecurrentForm.controls['startDate'].value;
      this.startFlag = true;
      if (this.startDate > this.endDate) {
        this.addRecurrentForm.controls['startDate'].setValue(null);
        this.addRecurrentForm.controls['workingHours'].setValue(0);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The start date is greater than the end date',
          life: 3000,
        });
      } else if (this.startDate < this.minDateVal) {
        this.addRecurrentForm.controls['startDate'].setValue(null);
        this.addRecurrentForm.controls['workingHours'].setValue(0);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The start date should be greater than the creation date',
          life: 3000,
        });
      } else {
        if (this.endFlag === true) {
          this.calculateWorkingHoursAPICall();
        }
      }
    }
  }

  selectEndDate($event: any) {
    if (this.addRecurrentForm.controls['endDate'].value) {
    this.endDate = this.addRecurrentForm.controls['endDate'].value;
    this.endFlag = true;
    if (this.startDate > this.endDate) {
      this.addRecurrentForm.controls['endDate'].setValue(null);
      this.addRecurrentForm.controls['workingHours'].setValue(0);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The end date is less than the start date',
        life: 3000,
      });
    } else {
      if (this.startFlag === false) {
        this.addRecurrentForm.controls['endDate'].patchValue(null);
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail:
            'Please Select Start Date First To Calculate Working Hours Correctly !',
          life: 5000,
        });
      } else {
        this.calculateWorkingHoursAPICall();
      }
    }
  }
  }

  calculateWorkingHoursAPICall() {
    this.ppmEAPI
      .calcWorkingHours({ startDate: this.startDate, endDate: this.endDate })
      .subscribe((res) => {
        const data = res.data;
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.addRecurrentForm.controls['workingHours'].patchValue(
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

  checkDate(taskDate: any) {
    const currentDate = new Date();
    if (new Date(taskDate).getTime() <= currentDate.getTime()) {
      return true;
    } else {
      return false;
    }
  }
  //#endregion

  //#region API Requests
  saveBtnIsPressed: boolean = false;
  isSaving: boolean = false;
  updateRecurrentTask() {
    if (this.addRecurrentForm.invalid) {
      validateForm.validateAllFormFields(this.addRecurrentForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.isSaving = true;

      if (!this.saveBtnIsPressed) {
        this.addRecurrentForm.value.date = dateHelper.ConvertDateWithSameValue(
          this.addRecurrentForm.value.date
        );
        this.addRecurrentForm.value.startDate =
          dateHelper.ConvertDateWithSameValue(
            this.addRecurrentForm.value.startDate
          );
        this.addRecurrentForm.value.endDate =
          dateHelper.ConvertDateWithSameValue(
            this.addRecurrentForm.value.endDate
          );

        this.addRecurrentForm.value.firstDate =
          dateHelper.ConvertDateWithSameValue(
            this.addRecurrentForm.value.firstDate
          );
        this.addRecurrentForm.value.secondDate =
          dateHelper.ConvertDateWithSameValue(
            this.addRecurrentForm.value.secondDate
          );
        this.saveBtnIsPressed = true;
      }

      this.addRecurrentForm.value.siteId = this.siteId;
      let model = getRecurrentTaskModel(this.addRecurrentForm.value);
      model.sunday=this.sunday;
      model.monday=this.monday;
      model.tuesday=this.tuesday;
      model.wednesday=this.wednesday;
      model.thursday=this.thursday;
      model.friday=this.friday;
      model.saturday=this.saturday;
      this.api.editRecurrentTask(model).subscribe((res: any) => {
        this.apiRequest(res);
        this.isSaving = false;
      });
    }
  }
  deleteRecurrentTask() {
    this.route.queryParams.subscribe((params: any) => {
      this.recurrentTestModel.id = params.data;

      console.log(this.recurrentTestModel.id);
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this Recurring Task?',
        header: 'Confirm',
        rejectButtonStyleClass: 'p-button-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api
            .deleteRecurrentTasks(this.recurrentTestModel.id)
            .subscribe((res) => {
              this.apiRequest(res);
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

  apiRequest(res: any) {
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      if (this.isChild) {
        this.router.navigate(['maintenance/recurrent-task/entries']);
      } else {
        this.router.navigate(['maintenance/recurrent-task/schedule']);
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });

      this.Init();
      this.close_modal();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }

  setCheckboxSunday(event: any) {
    this.sunday = event.checked;
  }
  setCheckboxMonday(event: any) {
    this.monday = event.checked;
  }
  setCheckboxTuesday(event: any) {
    this.tuesday = event.checked;
  }
  setCheckboxWednesday(event: any) {
    this.wednesday = event.checked;
  }
  setCheckboxThursday(event: any) {
    this.thursday = event.checked;
  }
  setCheckboxFriday(event: any) {
    this.friday = event.checked;
  }
  setCheckboxSaturday(event: any) {
    this.saturday = event.checked;
  }

  //#endregion
}
