import {
  AfterViewInit,
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
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DistributionEmployeeDetail,
  DistributionShiftDetail,
  DistributionShiftMaster,
} from '../../../models/shift-dist.model';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { CustomerService } from '../../../services/customer.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ShiftDistributionService } from '../../../services/shift-distribution.service';
import { ShiftPeriodService } from '../../../services/shift.service';
import { AssetGroupService } from '../../../services/asset-group.service';
// import { FullCalendarOptions, EventObject } from 'ngx-fullcalendar';
/* import { CalendarOptions  } from '@fullcalendar/angular';
import { FullCalendarModule } from '@fullcalendar/angular'; */
import { RotadialogComponent } from '../rotadialog/rotadialog.component';
// rt { NoDataComponent } from '../../../shared/components/no-data/no-data.component';
// import { SharedModule } from '../../../shared/shared.module';

import { CalendarOptions, EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-add-edit-rota',
  changeDetection: ChangeDetectionStrategy.OnPush,
  /* standalone: true, */
  /* imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NoDataComponent,
    // SharedModule
  ], */
  templateUrl: './add-edit-rota.component.html',
  styleUrl: './add-edit-rota.component.scss',
  providers: [DialogService],
})
export class AddEditRotaComponent implements AfterViewInit {
  @Input('showmodal') showAddModal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('rotaId') rotaId: any;
  @Input('rotaIndex') rotaIndex: any;
  @Input('status') status: any;
  /* options!: FullCalendarOptions;
  events!: EventObject[]; */
  events!: EventInput[];
  calendarOptions: CalendarOptions = {};
  formRotaLoaded: boolean = false;

  /*  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
  }; */

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr);
  }

  eventsPromise!: Promise<EventInput[]>;

  selectedShiftsForEmployee: any[] = [];
  Employees: any[] = [];
  searchFilter: DistributionShiftMaster = new DistributionShiftMaster();
  Sites: any[] = [];
  // items = [
  //   { label: 'Home', routerLink: ['/'] },
  //   { label: 'Rota', routerLink: ['/hr/rota/calender'] },
  // ];
  id: any;
  isViewMode: boolean = false;
  isEditMode: boolean = false;
  isAddMode: boolean = false;
  url!: string;
  // distributionEmployeeDetails: any[] = [];
  shifts: any[] = [];
  showDialog: boolean = false;
  AssetGroups: any[] = [];
  showFilterModal: boolean = false;
  searchForm!: FormGroup;
  constructor(
    private cdr: ChangeDetectorRef,
    private employeeService: EmployeeService,
    private router: Router,
    private messageService: MessageService,
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private shiftsDistService: ShiftDistributionService,
    private confirmationService: ConfirmationService,
    private shiftsService: ShiftPeriodService,
    private assetGroupService: AssetGroupService,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit(): void {
    this.Init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  Init(): void {
    this.searchForm = this.fb.group({
      site: [null],
      date: [null],
      assetGroup: [null],
      defaultShift: [null],
    });
    this.getAssetGroups();
    // this.activatedRoute.queryParams.subscribe((params) => {
    // this.id = params['id'] || 0;
    // });
    this.id = this.rotaId || 0;
    this.calendarOptions = {
      initialDate: this.searchFilter.shiftDate,
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      events: this.events,
      eventClick: (info) => this.calendarFunction(info),
      editable: true,
    };

    // this.calendarOptions.initialDate = this.searchFilter.shiftDate;
    /* this.options = { 
      defaultDate: this.searchFilter.shiftDate,
      editable: true,
    }; */

    /* this.calendarOptions = {
      initialView: this.searchFilter.shiftDate,
      editable: true,
    } */
    this.checkMode();
    if (!this.isAddMode) {
      this.getshift(this.id);
    } else {
      this.searchFilter.shiftDate = new Date();
    }
  }

  checkMode() {
    this.isViewMode = false;
    this.isEditMode = false;
    this.isAddMode = false;
    // this.url = this.router.url;
    // if (this.id && this.url.includes('view')) this.isViewMode = true;
    // else if (this.id && !this.url.includes('view')) this.isEditMode = true;
    if (this.id && this.status == 'view') this.isViewMode = true;
    else if (this.id && this.status == 'edit') this.isEditMode = true;
    else {
      this.isAddMode = true;
    }
  }
  getshift(shiftId: number) {
    this.events = [];
    this.shiftsDistService
      .getdistributionShiftById(shiftId)
      .subscribe((res) => {
        this.searchFilter = res.data;
        this.searchFilter.site = res.data.site;
        this.searchFilter.assetGroup = res.data.assetGroup;
        this.selectAssetGroupRetrieve();
        this.searchFilter.shiftDate = new Date(res.data.shiftDate);
        this.getUsersBtSite(
          this.searchFilter.assetGroup.id,
          this.searchFilter.site.id,
          this.searchFilter.shiftDate.toLocaleString(),
          shiftId
        );
        /* setTimeout(() => { */

        this.searchFilter.distributionShiftDetail.forEach(
          (dsd: DistributionShiftDetail) => {
            dsd.distributionEmployeeDetail.forEach(
              (details: DistributionEmployeeDetail) => {
                let day = new Date(res.data.shiftDate);
                this.events.push({
                  id: details.employee.userId,
                  title:
                    details.employee.userName + ' - ' + details.shift.shiftName,
                  allDay: true,
                  start: new Date(
                    day.getFullYear(),
                    day.getMonth(),
                    dsd.noOfDay
                  ),
                  date: this.dateToYMD(
                    new Date(day.getFullYear(), day.getMonth(), dsd.noOfDay)
                  ),
                });
              }
            );
          }
        );

        this.calendarOptions.events = this.events;

        console.log('shift edit', this.events);
        this.cdr.detectChanges();
        /*  }, 1000); */
      });
  }

  dateToYMD(date: any) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }

  getUsersBtSite(assetGroupId: any, siteId: any, monthDate: string, id: any) {
    this.employeeService
      .GetUserBySite(assetGroupId, siteId, monthDate, id)
      .subscribe((res) => {
        this.Employees = res;
      });
  }
  bindSite(event: any) {
    this.searchFilter.site = event;
  }
  onSelectSite(event: any) {
    this.searchonSite(event.query);
    this.searchFilter.site = event.value;
  }
  searchonSite(code: any) {
    this.customerService
      .GetCustomersAutoComplete(code)
      .subscribe((data: any) => {
        this.Sites = data.data;
      });
  }
  clearSite() {
    this.searchFilter.site = '';
  }

  selectAssetGroup(event: any) {
    this.searchFilter.assetGroup = event.value;
    this.searchShifts();
  }
  selectAssetGroupRetrieve() {
    this.searchShifts();
  }

  searchShifts() {
    this.getShifts();
    if (
      this.searchFilter.assetGroup.id &&
      this.searchFilter.site.id &&
      this.searchFilter.shiftDate?.toLocaleString()
    ) {
      // this.distributionEmployeeDetails = []

      this.getUsersBtSite(
        this.searchFilter.assetGroup.id,
        this.searchFilter.site.id,
        this.searchFilter.shiftDate?.toLocaleString(),
        this.id
      );
    } else {
    }
  }

  getShifts() {
    let body = {
      pageSize: 100000,
      pageNumber: 1,
      assetGroup: this.searchFilter.assetGroup,
    };
    this.shiftsService.GetShifts(body).subscribe((data) => {
      this.shifts = data.data;
    });
  }

  save() {
    if (this.id == undefined || this.id == 0) {
      this.shiftsDistService
        .savedistributionShift(this.searchFilter)
        .subscribe((res) => {
          const message = res.message;
          const sucess = res.data;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.close_add_modal();
            // this.addCustomerForm.reset();
            // this.router.navigate(['/hr/rota']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        });
    } else {
      this.searchFilter.id = this.id;
      this.shiftsDistService
        .updatedistributionShift(this.searchFilter)
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
            this.close_add_modal();
            // this.router.navigate(['/hr/rota']);
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

  onShiftSelection(value: any, dayNo: any, employee: any) {
    if (!employee) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Select User',
        life: 3000,
      });
      return;
    }

    let shift = this.selectedShiftsForEmployee.filter(
      (s) => s.noOfDay === dayNo && s.employee.userId == employee.userId
    );
    if (shift.length > 0) {
      this.selectedShiftsForEmployee.splice(
        this.selectedShiftsForEmployee.indexOf(shift[0]),
        1
      );
    }

    this.selectedShiftsForEmployee.push({
      id: 0,
      employee: employee,
      noOfDay: dayNo,
      shift: {
        id: value,
      },
    });
  }
  delete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Customer Servy ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shiftsDistService
          .deletedistributionShift(this.id)
          .subscribe((res) => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              // this.router.navigate(['/hr/rota']);
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 5000,
              });
              this.close_add_modal();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 5000,
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
  }

  apply() {
    this.events = [];
    let date = new Date(this.searchFilter.shiftDate);

    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1);
    let daysOfMonths: any = [];
    for (var d = date; d <= lastDay; d.setDate(d.getDate() + 1)) {
      daysOfMonths.push(new Date(d));
    }
    this.searchFilter.employees.forEach((emp: any) => {
      daysOfMonths.forEach((day: any) => {
        this.events.push({
          id: emp.userId,
          title:
            emp.userName + ' - ' + this.searchFilter.defaultShift.shiftName,
          allDay: true,
          start: day,
        });

        this.searchFilter.distributionShiftDetail.push({
          id: 0,
          noOfDay: day.getDate(),
          distributionEmployeeDetail: [],
        });
      });
      this.searchFilter.distributionShiftDetail.forEach(
        (dsd: DistributionShiftDetail) => {
          dsd.distributionEmployeeDetail.push({
            id: 0,

            employee: emp,

            shift: this.searchFilter.defaultShift,
          });
        }
      );
    });
  }

  ref!: DynamicDialogRef;
  calendarFunction(dateClickInfo: any) {
    this.ref = this.dialogService.open(RotadialogComponent, {
      header: 'Choose a Product',
      width: '50%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        data: dateClickInfo.event,
        filters: this.searchFilter,
        shifts: this.shifts,
        employees: this.Employees,
      },
    });

    this.ref.onClose.subscribe((product: any) => {
      if (product) {
        let test = {
          id: product.employee.userId,
          title:
            product.employee.userName + ' - ' + product.defaultShift.shiftName,
          allDay: true,
          start: product.shiftDate,
        };
        if (this.events.includes(test))
          this.messageService.add({
            severity: 'info',
            summary: 'shift updated',
            detail: product.name,
          });
        else {
          this.events.splice(
            this.events.indexOf(
              this.events.filter(
                (element: any) =>
                  new Date(element.start).toDateString() ==
                    new Date(product.shiftDate).toDateString() &&
                  element.title.toString().split('-')[0].trim() ==
                    product.employee.userName
              )[0]
            ),
            1
          );
          this.events.push({
            id: product.employee.userId,
            title:
              product.employee.userName +
              ' - ' +
              product.defaultShift.shiftName,
            allDay: true,
            start: product.shiftDate,
          });
        }
        this.searchFilter.distributionShiftDetail.forEach(
          (e1: DistributionShiftDetail) => {
            e1.distributionEmployeeDetail.forEach(
              (e2: DistributionEmployeeDetail) => {
                if (
                  e2.employee.userId == product.employee.userId &&
                  e1.noOfDay.toString() ==
                    product.shiftDate.getDate().toString()
                ) {
                  e2.shift = product.defaultShift;
                }
              }
            );
          }
        );
        this.messageService.add({
          severity: 'info',
          summary: 'shift updated',
          detail: product.name,
        });
      }
      this.cdr.detectChanges();
    });
  }

  // calanderFunction(info: any): void {
  //   // const clickedEvent = info.event;
  //   this.ref = this.dialogService.open(RotadialogComponent, {
  //     header: 'Choose a Product',
  //     width: '70%',
  //     contentStyle: { 'max-height': '500px', overflow: 'auto' },
  //     baseZIndex: 10000,
  //     data: {
  //       eventData: info,
  //       filters: this.searchFilter,
  //       shifts: this.shifts,
  //       employees: this.Employees,
  //     },
  //   });

  //   this.ref.onClose.subscribe((product: any) => {
  //     if (product) {
  //       const newEvent = {
  //         id: product.employee.userId,
  //         title: `${product.employee.userName} - ${product.defaultShift.shiftName}`,
  //         allDay: true,
  //         start: product.shiftDate,
  //       };

  //       const existingEventIndex = this.events.findIndex((e: any) =>
  //         new Date(e.start).toDateString() === new Date(product.shiftDate).toDateString() &&
  //         e.title.split('-')[0].trim() === product.employee.userName
  //       );

  //       if (existingEventIndex !== -1) {
  //         this.events[existingEventIndex] = newEvent;
  //         this.messageService.add({
  //           severity: 'info',
  //           summary: 'Shift updated',
  //           detail: product.name,
  //         });
  //       } else {
  //         this.events.push(newEvent);
  //         this.messageService.add({
  //           severity: 'info',
  //           summary: 'New shift added',
  //           detail: product.name,
  //         });
  //       }

  //       this.searchFilter.distributionShiftDetail.forEach((e1: any) => {
  //         e1.distributionEmployeeDetail.forEach((e2: any) => {
  //           if (e2.employee.userId === product.employee.userId &&
  //             e1.noOfDay.toString() === product.shiftDate.getDate().toString()) {
  //             e2.shift = product.defaultShift;
  //           }
  //         });
  //       });
  //     }
  //   });
  // }

  getAssetGroups() {
    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      this.AssetGroups = res.data;
      this.cdr.detectChanges();
    });
  }

  close_add_modal() {
    this.searchForm.reset();
    this.openModals.emit(false);
  }

  // async openRotaModal() {
  //   this.formRotaLoaded = !this.formRotaLoaded;
  // }
}
