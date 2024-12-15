import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import validateForm from '../../../shared/helpers/validateForm';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import { RecurrentTaskModel } from '../recurrent-task.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { cylinderProperties } from '../../ordering-cylinders-lox/data/ordering-cylinders-lox.model';
import { Router } from '@angular/router';
import { RecurrentTaskService } from '../recurrent-task.service';
import { EmployeeService } from '../../../services/employee.service';
import { GasRoomService } from '../../gas-room/data/gas-room.service';
import { buildForm, getRecurrentTaskModel } from '../add-recurrent-task-form-builder';
import { Role } from '../../../shared/enums/role';
import { PrimengModule } from '../../../shared/primeng.module';

@Component({
  selector: 'app-add-recurrent-task',
  standalone: true,
  imports: [PrimengModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-recurrent-task.component.html',
  styleUrl: './add-recurrent-task.component.scss'
})
export class AddRecurrentTaskComponent implements OnChanges {
  @Input('showmodal') showmodal : boolean = false ;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();

  addRecurrentForm!: FormGroup;
  recurrentTestModel: RecurrentTaskModel = new RecurrentTaskModel();

  msgs!: Message[];
  isSubmitted = false;
  items!: MenuItem[];

  taskTypeList: [] = [];
  frequentList: any[] = [];
  renewedList: any[] = [];
  statusList: [] = [];
  assignedEmpList: [] = [];
  siteList: [] = [];
  teamLeaderList: [] = [];

  roomIdList: any[] = [];
  roomModel: any;

  siteId!: number;

  lastNumber: any;
  thisYear: any;

  empRole: any;
  roleValue: any;
  imEngineer: boolean = false;

  testCheck: any[] = [
    { name: 'Pass', value: true },
    { name: 'Fail', value: false },
  ];

  cylindersArr = cylinderProperties;
  sunday:boolean=true;
  monday:boolean=false;
  tuesday:boolean=false;
  wednesday:boolean=false;
  thursday:boolean=false;
  friday:boolean=false;
  saturday:boolean=false;
  isDay:boolean=false;
  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private api: RecurrentTaskService,
    private roomApi: GasRoomService,
    private employeeService: EmployeeService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
     this.Init();
  }

  close_modal() {
    this.openModals.emit(false);
  }

  Init(): void {
    this.empRole = JSON.parse(localStorage.getItem('userRoles') || '{}');

    if(this.empRole.length > 0) {
        this.empRole.forEach((e: any) => {
        this.roleValue = e.value;
        if (this.roleValue == 'R-6') {
          this.imEngineer = true;
        }
      });
    }

    this.addRecurrentForm = buildForm(this.formbuilder);
    this.getTaskType();
    this.getFrequent();
    this.getRenewed();
    // this.getStatus();
   // this.getAssignedEmployee();
    this.getLastNumber();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Add Recurring Task',routerLink: ['/maintenance/recurrent-task'] },
    ];
  }

  roomIdFilter(name: any) {
    this.roomApi.searchRoom({ roomId: name.query }).subscribe((res) => {
      const data = res.data;
      this.roomIdList = data;
    });
  }

  getLastNumber() {
    this.api.getLastNumber().subscribe((res) => {
      this.lastNumber = res;
      this.thisYear = new Date().getFullYear();
      this.addRecurrentForm.controls['title'].setValue(
        'RT-' + this.thisYear + '-' + this.lastNumber
      );
    });
  }

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
      if (res.data)
        this.addRecurrentForm.get('taskStatusId')?.setValue(res.data[0].id);
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
  getAssignedEmployeesBySiteId(value: string, siteId: number, assetId?: number) {
    this.employeeService.GetUserByRoleValueSiteAndAssetGroupBySite(value, siteId).subscribe((res: any) => {
      this.assignedEmpList = res
    })
  }

  siteSearch(e: any) {
    this.api.searchSites(e.query).subscribe((res) => {
      const data = res.data;
      this.siteList = data;
    });
  }

  changeTask(event: any) {
    this.addRecurrentForm.value.taskType = event.value;

    //rahaf

    if (this.addRecurrentForm.value.taskType == 343)
    {
      this.showRoom = false;
    }



  }

  is2PerDay: boolean = false;
  changeFrequent(event: any) {
    console.log(event);
    var selected = this.frequentList.filter(x=>x.id==event.value)[0];
    this.addRecurrentForm.value.frequent = event.value;
    if (selected.value === 1) {
      this.is2PerDay = true;
      this.addRecurrentForm.get('date')?.setValue(null);
    } else {
      this.is2PerDay = false;
      this.addRecurrentForm.get('firstDate')?.setValue(null);
      this.addRecurrentForm.get('secondDate')?.setValue(null);
    }
    if (selected.value === 1 || selected.value === 2) {
      this.isDay=true;
    } else {
      this.isDay=false;
      this.sunday=false;
      this.monday=false;
      this.tuesday=false;
      this.wednesday=false;
      this.thursday=false;
      this.friday=false;
      this.saturday=false;
      this.addRecurrentForm.get('sunday')?.setValue(false);
      this.addRecurrentForm.get('monday')?.setValue(false);
      this.addRecurrentForm.get('tuesday')?.setValue(false);
      this.addRecurrentForm.get('wednesday')?.setValue(false);
      this.addRecurrentForm.get('thursday')?.setValue(false);
      this.addRecurrentForm.get('friday')?.setValue(false);
      this.addRecurrentForm.get('saturday')?.setValue(false);

    }
    console.log('is2PerDay', this.is2PerDay);
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
    this.getAssignedEmployeesBySiteId(Role.engineersvalue, this.siteId);
  }

  mainFold: boolean = false;
  o2: boolean = false;
  n2o: boolean = false;
  n2: boolean = false;
  co2: boolean = false;
  medicalAir: boolean = false;
  lox: boolean = false;
  plantRoom: boolean = false;
  backupCylinders: boolean = false;

  showRoom:boolean = true;

  changeRoom(event: any) {
    console.log(event);
    this.roomModel = event;
    this.changeRoomConditions();
    this.addRecurrentForm.controls['roomId'].setValue(event.roomId);
    this.addRecurrentForm.controls['roomName'].setValue({
      roomId: event.roomId,
    });
    console.log(this.addRecurrentForm.value.roomId);
  }

  changeRoomConditions() {
    if (
      this.roomModel.o2ManifoldMainOut ||
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
  //submit form
  saveBtnIsPressed: boolean = false;
  isSaving: boolean = false;
  addRecurrentSubmit() {
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
        if (this.is2PerDay) this.addRecurrentForm.value.date = null;
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
      this.api.addRecurrentTask(model).subscribe((res) => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          this.addRecurrentForm.reset();
          this.Init();
          this.close_modal();
          // this.router.navigate(['maintenance/recurrent-task/schedule']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
        this.isSaving = false;
      });
    }
  }

  cancel() {
    this.addRecurrentForm.reset();
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
}
