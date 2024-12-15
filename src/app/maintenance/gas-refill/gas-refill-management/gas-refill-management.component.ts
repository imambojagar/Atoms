import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  ConfirmEventType,
} from 'primeng/api';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { CustomerService } from 'src/app/data/service/customer.service';
import { GasRefillService } from 'src/app/data/service/gas-refill.service';
import { LookupService } from 'src/app/data/service/lookup.service';
import { WorkOrderService } from 'src/app/data/service/work-order.service';
import validateForm from 'src/app/shared/helpers/validateForm'; */
import { ServiceRequestFormService } from '../../service-request/service-request-form.service';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { GasRefillService } from '../../../services/gas-refill.service';
import { LookupService } from '../../../services/lookup.service';
import { CustomerService } from '../../../services/customer.service';
import { WorkOrderService } from '../../../services/work-order.service';
import { EmployeeService } from '../../../services/employee.service';
import { Lookup } from '../../../shared/enums/lookup';
import { Role } from '../../../shared/enums/role';
import validateForm from '../../../shared/helpers/validateForm';
/* import { Role } from 'src/app/data/Enum/role';
import { Departments } from 'src/app/data/models/customer-model';
import { CallRequestService } from 'src/app/data/service/call-request.service';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { TransactionHistory } from 'src/app/shared/models/transaction-history';
 */
@Component({
  selector: 'app-gas-refill-management',
  templateUrl: './gas-refill-management.component.html',
  styleUrls: ['./gas-refill-management.component.scss'],
  providers: [MessageService],
})
export class GasRefillManagementComponent {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  transactionHistory!: TransactionHistory
  calendarVal?: Date;
  minDateVal = new Date();

  startDate: any;
  endDate: any;
  startFlag: boolean = false;
  endFlag: boolean = false;
  uploadedFiles: any;
  groupLeaders: any[] = [];
  gasTypes: any[] = [];
  sites: any[] = [];
  buildingsList: any[] = [];
  floorsList: any[] = [];
  depBuild: any[] = [];
  statuses: any[] = [];
  cylinderTypes: any[] = [];
  cylinderSizes: any[] = [];
  items!: MenuItem[];
  gasRefillInfoForm!: FormGroup;
  id: any;
  isViewMode: boolean = false;
  isEditMode: boolean = false;
  isAddMode: boolean = false;
  isViewFieldEngineer: boolean = false;
  isEngineer: boolean = false;
  isNurse: boolean = false;
  isCallCenter: boolean = false;
  isAdmin: boolean = false;
  url: string = '';
  hideField: string = 'false';
  hideButtonSave: boolean = false;
  isSubmitted: boolean = false;
  assignedEmployees: any[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    public gasRefillsService: GasRefillService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private customerService: CustomerService,
    private router: Router,
    public serviceRequestFormService: ServiceRequestFormService,
    private confirmationService: ConfirmationService,
    public workOrdersService: WorkOrderService,
    private employeeService: EmployeeService
  ) {}

  close_modal() {
    this.openModals.emit(false);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params['id'];
    });

    this.checkMode();
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please Fill Required Data',
      life: 3000,
    });
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Gas Refill', routerLink: ['/maintenance/gas-refill'] },
    ];

    this.gasRefillInfoForm = this.formbuilder.group({
      gazRefillNo: [null],
      expectedDate: [null],
      expectedTime: [null],
      startDate: [null],
      startTime: [null],
      endDate: [null],
      endTime: [null],
      workingHours: [null],
      site: [null],
      building: [null],
      floor: [null],
      department: [null],
      assignedEmployee: [null],
      status: [null],
      gazRefillDetails: this.formbuilder.array([]),
      comment: [null],
    });

    this.ifUserEngineer();
    this.getLookup();
    if (this.isViewMode) {
      this.gasRefillInfoForm.disable();
    }

    if (this.isAddMode) {
      this.hideField = 'true';
      this.addMoregazRefillDetails();
      this.generateGazRefillNumber();
    } else {
      this.getgasRefill(this.id);
    }
  }
  generateGazRefillNumber() {
    this.gasRefillsService.generateGazRefillNumber().subscribe((res: any) => {
      this.gasRefillInfoForm.controls['gazRefillNo'].setValue(res.data);
    });
  }
  checkMode() {
    this.isViewMode = false;
    this.isEditMode = false;
    this.isAddMode = false;
    this.url = this.router.url;
    if (this.id && this.url.includes('view')) this.isViewMode = true;
    else if (this.id && !this.url.includes('view')) this.isEditMode = true;
    else {
      this.isAddMode = true;
    }
  }
  getLookup() {
    this.lookupService
      .getLookUps(Lookup.StatusGazRefill)
      .subscribe((res: any) => {
        let statusValue: any[] = [];
        statusValue = res.data;

        this.statuses = statusValue.filter((x) => x.value != 0);
      });
    this.lookupService.getLookUps(Lookup.GazType).subscribe((res: any) => {
      this.gasTypes = res.data;
      this.gasTypes.splice(0, 0, { id: 0, name: 'Select', value: null });
    });
    this.lookupService.getLookUps(Lookup.CylinderSize).subscribe((res: any) => {
      this.cylinderSizes = res.data;
      this.cylinderSizes.splice(0, 0, { id: 0, name: 'Select', value: null });
    });
    this.lookupService.getLookUps(Lookup.SizeCylinder).subscribe((res: any) => {
      this.cylinderTypes = res.data;
      this.cylinderTypes.splice(0, 0, { id: 0, name: 'Select', value: null });
    });
  }
  gazRefillDetails() {
    return (<FormArray>this.gasRefillInfoForm.get('gazRefillDetails')).controls;
  }

  removegazRefillDetails(index: number) {
    (this.gasRefillInfoForm.get('gazRefillDetails') as FormArray).removeAt(
      index
    );
  }

  addMoregazRefillDetails() {
    (this.gasRefillInfoForm?.get('gazRefillDetails') as FormArray)?.push(
      this.formbuilder.group({
        id: [0],
        gasType: [''],
        cylinderType: [''],
        cylinderSize: [''],
        requestedQty: [''],
        deliverdQty: [''],
      })
    );
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(event.files);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'File Upload',
      detail: 'File Uploaded Successfully ! ',
    });
  }

  searchonContractor(code: any) {
    this.customerService
      .GetCustomersAutoComplete(code)
      .subscribe((data: any) => {
        this.sites = data.data;
      });
  }
  onSelectContractor(filter: any) {
    this.searchonContractor(filter.query);
    this.buildingsList = filter.buildings;
    if (filter.id)
      this.getAssignedEmployeesBySiteId(Role.engineersvalue, filter.id);
  }

  getAssignedEmployeesBySiteId(
    value: string,
    siteId: number,
    assetId?: number
  ) {
    this.employeeService
      .GetUserByRoleValueSiteAndAssetGroupBySiteId(siteId,value)
      .subscribe((res: any) => {
        this.assignedEmployees = res;
      });
  }

  onSelectContractor1(filter: any) {
    this.searchonContractor(filter.custName);
    this.buildingsList = filter.buildings;
  }
  onSelectBulding(filter: any) {
    this.floorsList = filter.value.floors;
  }
  onSelectBulding1(filter: any) {
    this.floorsList = filter.floors;
  }
  onSelectFloor(filter: any) {
    this.depBuild = filter.value.departments;
  }
  onSelectFloor1(filter: any) {
    this.depBuild = filter.departments;
  }

  save() {
    debugger;
    try {
      this.isSubmitted = true;
      if (
        this.gasRefillInfoForm.value.status != null &&
        this.gasRefillInfoForm.value.status.value == null
      ) {
        this.gasRefillInfoForm.controls['status'].setValue(null);
      }

      // if (this.isEngineer==false)
      // {
      //   if (this.gasRefillInfoForm.value.assignedEmployee == null)
      //   {
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: "Assigned Employee is required",
      //       life: 3000,
      //     });
      //     return;
      //   }

      // }

      if (this.gasRefillInfoForm.invalid) {
        validateForm.validateAllFormFields(this.gasRefillInfoForm);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please Fill Required Data',
          life: 3000,
        });
        this.isSubmitted = false;
      } else {
        let finalData: any = {};
        Object.assign(finalData, this.gasRefillInfoForm.value);

        finalData.assignedEmployee = this.assignedEmployees1();

        finalData.gazRefillDetails = [];

        let details: any[] = [];

        details = this.gasRefillInfoForm.value.gazRefillDetails;

        details.forEach((e) => {
          if (
            e.gasType &&
            e.gasType.value != null &&
            e.cylinderType &&
            e.cylinderType.value != null &&
            e.cylinderSize &&
            e.cylinderSize.value != null
          ) {
            finalData.gazRefillDetails.push(e);
          }
        });

        if (this.id) {
          finalData.id = Number(this.id);
          this.gasRefillsService.updateGazRefill(finalData).subscribe((res) => {
            const message = res.message;
            const sucess = res.isSuccess;

            debugger;

            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });

              setTimeout(() => {
                this.router.navigate(['maintenance/gas-refill']);
              }, 3000);
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
        } else {
          this.gasRefillsService.saveGazRefill(finalData).subscribe((res) => {
            const message = res.message;
            const sucess = res.isSuccess;
            debugger;
            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });

              setTimeout(() => {
                this.router.navigate(['maintenance/gas-refill']);
              }, 3000);
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

  getgasRefill(gasRefillId: number) {
    this.gasRefillsService.getGazRefillById(gasRefillId).subscribe((res) => {
      if (res.isSuccess) {
        // this.gasRefillInfoForm.patchValue(res.data)
        this.transactionHistory=new TransactionHistory();
        Object.assign( this.transactionHistory,res.data);

        this.gasRefillInfoForm.patchValue({
          expectedDate: res.data.expectedDate
            ? new Date(res.data.expectedDate)
            : res.data.expectedDate,
          expectedTime: res.data.expectedTime
            ? new Date(res.data.expectedTime)
            : res.data.expectedTime,
          startDate: res.data.startDate
            ? new Date(res.data.startDate)
            : res.data.startDate,
          startTime: res.data.startTime
            ? new Date(res.data.startTime)
            : res.data.startTime,
          endDate: res.data.endDate
            ? new Date(res.data.endDate)
            : res.data.endDate,
          endTime: res.data.endTime
            ? new Date(res.data.endTime)
            : res.data.endTime,
          gazRefillNo: res.data.gazRefillNo,
          workingHours: res.data.workingHours,
          assignedEmployee: res.data.assignedEmployee,
          status: res.data.status,
          comment: res.data.comment,
        });

        this.minDateVal = new Date(res.data.createdOn);
        if (res.data.assignedEmployee == null) {
          this.hideField = 'true';
        }

        if (res.data.status.value == 2) {
          this.hideButtonSave = true;
        }

        if (res.data.site != null) {
          this.onSelectContractor1(res.data.site);
          if (res.data.site) {
            this.getAssignedEmployeesBySiteId(
              Role.engineersvalue,
              res.data.site.id
            );
          }

          this.gasRefillInfoForm.controls['site'].setValue(res.data.site);
          if (this.buildingsList != null) {
            this.buildingsList.forEach((b) => {
              if (res.data.building?.id == b.id) {
                this.gasRefillInfoForm.controls['building'].setValue(b);
                this.onSelectBulding1(b);
                if (this.floorsList != null) {
                  this.floorsList.forEach((f) => {
                    if (res.data.floor?.id == f.id) {
                      this.gasRefillInfoForm.controls['floor'].setValue(f);
                      this.onSelectFloor1(f);
                      if (this.depBuild != null) {
                        this.depBuild.forEach((d) => {
                          if (res.data.department?.id == d.id) {
                            this.gasRefillInfoForm.controls[
                              'department'
                            ].setValue({
                              id: d.id,
                              name: d.name,
                              rooms: d.rooms,
                            });
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        }
        if (this.gasRefillInfoForm.value.assignedEmployee) {
          this.gasRefillInfoForm.patchValue({
            assignedEmployee: this.getassignedemployee(
              res.data.assignedEmployee
            ),
          });
        }

        this.setExsitinggazRefillDetails(res.data.gazRefillDetails);
      }
    });
  }

  setExsitinggazRefillDetails(gazRefillDetails: any[]) {
    gazRefillDetails.forEach((p) => {
      (this.gasRefillInfoForm.get('gazRefillDetails') as FormArray).push(
        this.formbuilder.group({
          id: [p.id],
          gasType: [p.gasType],
          cylinderType: [p.cylinderType],
          cylinderSize: [p.cylinderSize],
          requestedQty: [p.requestedQty],
          deliverdQty: [p.deliverdQty],
        })
      );
    });
    // this.addMoregazRefillDetails()
  }

  getassignedemployee(assEmp: any) {
    let emp = {
      userId: this.gasRefillInfoForm.value.assignedEmployee.id,
      userName: this.gasRefillInfoForm.value.assignedEmployee.name,
    };
    return emp;
  }

  delete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this gas refill?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gasRefillsService.deleteGazRefill(this.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.router.navigate(['maintenance/gas-refill']);
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

  assignedEmployees1() {
    let emp = {
      id: this.gasRefillInfoForm.value.assignedEmployee?.userId,
      name: this.gasRefillInfoForm.value.assignedEmployee?.userName,
    };
    return emp;
  }

  ifUserEngineer() {
    this.isEngineer = false;
    this.isCallCenter = false;
    this.isNurse = false;
    this.isAdmin = false;
    let userRoles = JSON.parse(localStorage.getItem('userRoles') || '');
    let result: any[] = [];
    result = userRoles;

    var callCenterRole = result.filter((x) => x.value == 'R-2');
    if (callCenterRole.length != 0) {
      this.isCallCenter = true;
    }

    var nurseRole = result.filter((x) => x.value == 'R-7');
    var headNurseRole = result.filter((x) => x.value == 'R-33');
    if (nurseRole.length != 0 || headNurseRole.length != 0) {
      this.isNurse = true;
    }

    var engineerRole = result.filter((x) => x.value == 'R-6');
    if (engineerRole.length != 0) {
      this.isEngineer = true;
    }

    var adminRole = result.filter((x) => x.value == 'R-13' || x.value == 'R-1');
    if (adminRole.length != 0) {
      this.isAdmin = true;
    }
  }

  selectStartTime($event: any) {
    if (this.gasRefillInfoForm.controls['startDate'].value) {
      this.startDate = this.gasRefillInfoForm.controls['startDate'].value;

      if (
        this.gasRefillInfoForm.value.endDate == null ||
        this.gasRefillInfoForm.value.startDate == null
      ) {
        return;
      }

      if (this.startDate > this.endDate) {
        this.gasRefillInfoForm.controls['startDate'].setValue(null);
        this.gasRefillInfoForm.controls['workingHours'].setValue(0);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The Start date is greater than the End date',
          life: 3000,
        });
      } else if (this.startDate < this.minDateVal) {
        this.gasRefillInfoForm.controls['startDate'].setValue(null);
        this.gasRefillInfoForm.controls['workingHours'].setValue(0);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The Start date should be greater than the creation date',
          life: 3000,
        });
      } else {
        this.calculateTime();
      }
    }
  }

  selectEndTime($event: any) {
    if (this.gasRefillInfoForm.controls['endDate'].value) {
      this.endDate = this.gasRefillInfoForm.controls['endDate'].value;

      if (
        this.gasRefillInfoForm.value.endDate == null ||
        this.gasRefillInfoForm.value.startDate == null
      ) {
        return;
      }

      if (this.endDate < this.startDate) {
        this.gasRefillInfoForm.controls['endDate'].setValue(null);
        this.gasRefillInfoForm.controls['workingHours'].setValue(0);
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
      this.gasRefillInfoForm.value.endDate == null ||
      this.gasRefillInfoForm.value.startDate == null
    ) {
      return;
    }

    let end = new Date(this.gasRefillInfoForm.value.endDate).getTime();
    let start = new Date(this.gasRefillInfoForm.value.startDate).getTime();
    let minute = (end - start) / (1000 * 60 * 60);
    this.gasRefillInfoForm.controls['workingHours'].setValue(minute.toFixed(2));
  }
}
