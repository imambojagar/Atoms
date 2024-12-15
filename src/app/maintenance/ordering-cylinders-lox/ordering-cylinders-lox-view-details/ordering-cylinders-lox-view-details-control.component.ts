import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {
  CylindersPercentageModel,
  OrderingCylindersLOX,
  cylinderProperties,
} from '../data/ordering-cylinders-lox.model';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import {
  buildAttachForm,
  buildBackupForm,
  buildLOXForm,
  buildOrderForm,
} from '../data/ordering-cylinders-lox-form-builder';

import { OrderingCylindersLoxService } from '../data/ordering-cylinders-lox.service';
/* import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { LookupService } from 'src/app/data/service/lookup.service';
import { Lookup } from 'src/app/data/Enum/lookup';
import { environment } from 'src/environments/environment';
import { ModelService } from 'src/app/data/service/model-definition.service';
import { FilesService } from 'src/app/data/service/files.service';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeService } from '../../../services/employee.service';
import { CustomerService } from '../../../services/customer.service';
import { LookupService } from '../../../services/lookup.service';
import { FilesService } from '../../../services/files.service';
import { ModelService } from '../../../services/model-definition.service';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import { Lookup } from '../../../shared/enums/lookup';
import validateForm from '../../../shared/helpers/validateForm';
import { PrimengModule } from '../../../shared/primeng.module';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';

@Component({
  standalone: true,
  selector: 'app-ordering-cylinders-lox-view-details-control',
  imports: [PrimengModule, FormsModule, ReactiveFormsModule, TransactionHistoryComponent],
  templateUrl: './ordering-cylinders-lox-view-details-control.component.html',
  styleUrls: ['./ordering-cylinders-lox-control.component.scss'],
})
export class OrderingCylindersLoxViewDetailsControlComponent
  implements AfterViewChecked, OnDestroy
{

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('indexs') indexs: any = 0;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  transactionHistory!: TransactionHistory
  orderForm!: FormGroup;
  backupForm!: FormGroup;
  LOXForm!: FormGroup;
  attachForm!: FormGroup;

  requestsList: Subscription[] = [];

  supplierForm: FormGroup = this.fb.group({});
  model: any;
  id: number = 0;
  items!: MenuItem[];
  tabIndex: number = 0;
  assignedEmpList: any[] = [];
  sitesList: any[] = [];
  backupStatusList: any[] = [];
  nextBackupStatusList: any[] = [];
  suppliersList: any[] = [];
  siteName: string = '';
  siteId: number = 0;
  userId: string = '';
  statusId: any;
  nextStatusId: any;
  baseUrl = environment.BaseURL.replace('api/', 'attachment/');
  attachmentUrl: string = '';
  prAttachmentUrl: string = '';
  poAttachmentUrl: string = '';
  invoiceAttachmentUrl: string = '';
  prfAttachmentUrl: string = '';
  pressedSaveButton: boolean = false;

  inAddMode: boolean = false;
  inEditMode: boolean = false;
  inViewMode: boolean = false;

  cylinderPercentage: any;

  isLoading: boolean = false;
  isSaving: boolean = false;
  selectedASite: boolean = true;

  foundCylinderChildren: boolean = true;
  foundLoxChildren: boolean = true;

  checked: boolean = true;

  inRD: boolean = false;
  @ViewChild('cylindersDiv') cylinderDivView!: ElementRef;
  @ViewChild('loxDiv') loxDivView!: ElementRef;

  cylindersArr = cylinderProperties;

  attachmentNames: string[] = [];


  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: Router,
    private empServices: EmployeeService,
    private api: OrderingCylindersLoxService,
    private apiCustomer: CustomerService,
    private lookupService: LookupService,
    private modelService: ModelService,
    protected filesService: FilesService
  ) {}

  close_modal() {
    this.openModals.emit(false);
  }

  ngOnInit() {
    let routerObsv = this.router.queryParams.subscribe((params: any) => {
      this.id = 0;
      this.tabIndex = params.index;
      if (params.data) this.id = params.data;
      if (params.RQ) this.inRD = params.RQ;
    });
    this.requestsList.push(routerObsv);
    this.buildForm();
    this.getAssignedEmployee();
    this.getBackupStatusLookups();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Ordering Cylinders/LOX' },
    ];
  }

  //#region Build Form and Get Index
  buildForm() {
    if (this.id == 0) {
      this.model = {
        id: 0,
        suppliersMails: [''],
        date: new Date(),
        deliveryDate: new Date(),
      };
      this.orderForm = buildOrderForm(
        this.model.suppliersMails,
        this.model,
        this.fb
      );
      this.backupForm = buildBackupForm(this.model, this.fb);
      this.LOXForm = buildLOXForm(this.model, this.fb);
      this.attachForm = buildAttachForm(this.model, this.fb);
      this.inAddMode = true;
    } else {
      if (this.tabIndex == 0) {
        this.inViewMode = true;
      } else {
        this.inEditMode = true;
      }
      this.getbuildOrderData();
    }
  }

  getbuildOrderData() {
    let buildFormFromApi = this.api
      .getSingleRequest(this.id)
      .subscribe((res: any) => {
        if (res.data) {
          this.transactionHistory=new TransactionHistory();
          Object.assign( this.transactionHistory,res.data);
          this.model = res.data as OrderingCylindersLOX;
          this.statusId = this.model.backUpStatusId;
          this.nextStatusId = this.model.nextBackUpStatusId;
          this.model.userId
            ? (this.userId = this.model.userId)
            : (this.userId = '');

          if (this.model.date) {
            this.model.date = dateHelper.handleDateApi(res.data.date);
          }
          if (this.model.deliveryDate) {
            this.model.deliveryDate = dateHelper.handleDateApi(
              res.data.deliveryDate
            );
          }
          if (this.model.attachmentUrl) {
            this.attachmentNames[0] = this.model.attachmentUrl;
          }
          if (this.model.prAttachment) {
            this.prAttachmentUrl = this.model.prAttachment;
          }
          if (this.model.poAttachment) {
            this.poAttachmentUrl = this.model.poAttachment;
          }
          if (this.model.invoiceAttachment) {
            this.invoiceAttachmentUrl = this.model.invoiceAttachment;
          }
          if (this.model.prfAttachment) {
            this.prfAttachmentUrl = this.model.prfAttachment;
          }

          if (res.data.customerName) {
            this.siteId = res.data.customerId;
            this.siteName = res.data.customerName;
            this.model.customerName = {
              custName: res.data.customerName,
            };
            this.selectedASite = false;
          }
          if (res.data.supplierName) {
            this.model.supplierName = {
              suppliername: res.data.supplierName,
            };
          }

          if (this.model.isCylinder != null)
            this.checked = this.model.isCylinder;
          this.orderForm = buildOrderForm(
            this.model.suppliersMails,
            this.model,
            this.fb
          );
          this.backupForm = buildBackupForm(this.model, this.fb);
          this.LOXForm = buildLOXForm(this.model, this.fb);
          this.attachForm = buildAttachForm(this.model, this.fb);
          this.fillCylinderPercentageData();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Data Status',
            detail: 'No data available',
            life: 6000,
          });
        }
      });

    this.requestsList.push(buildFormFromApi);
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
  //#endregion

  //#region Order Status
  getBackupStatusLookups() {
    let lookupBUS = this.lookupService
      .get({ queryParams: Lookup.BackUpStatus })
      .subscribe((res) => {
        this.backupStatusList = res.data;
      });
    this.requestsList.push(lookupBUS);

    let lookupNBUS = this.lookupService
      .get({ queryParams: Lookup.NextBackUpStatus })
      .subscribe((res) => {
        this.nextBackupStatusList = res.data;
      });
    this.requestsList.push(lookupNBUS);
  }

  setBackupStatus(event: any) {
    this.orderForm.get('backUpStatusId')?.setValue(event.value);
    this.statusId = event.value;
  }
  setNextBackupStatus(event: any) {
    this.orderForm.get('nextBackUpStatusId')?.setValue(event.value);
    this.nextStatusId = event.value;
  }
  //#endregion

  //#region Assigned Employee
  getAssignedEmployee() {
    let empSubscription = this.empServices
      .searchRoles({ fixedName: 'r-6' })
      .subscribe((res) => {
        let id = res.data[0].id;
        let getEmpsSubscription = this.empServices
          .getEmployeeByRole([id])
          .subscribe((res) => {
            this.assignedEmpList = res;
          });
        this.requestsList.push(getEmpsSubscription);
      });
    this.requestsList.push(empSubscription);
  }

  setAssignedEmployee(event: any) {
    this.orderForm.get('userId')?.setValue(event.value);
    this.userId = event.value;
  }
  //#endregion

  //#region Supplier Mail
  supplierMailControl() {
    return <FormArray>this.orderForm.get('suppliersMails');
  }

  addMoreSupplierMails() {
    this.supplierMailControl().push(this.fb.control(''));
  }
  removeSupplierMail(index: number) {
    this.supplierMailControl().removeAt(index);
  }

  getSpplier($event: any) {
    return this.modelService
      .getSupplier({ suppliername: $event.query })
      .subscribe((res: any) => {
        this.suppliersList = res.data;
      });
  }
  onSelectSupplier(supplier: any) {
    this.orderForm.get('supplierId')?.setValue(supplier.id);
  }
  //#endregion

  //#region Site and Date
  searchSites(name: any) {
    this.apiCustomer
      .searchCustomer({ custName: name.query })
      .subscribe((res) => {
        this.sitesList = res.data;
      });
  }
  sendSiteId(site: any) {
    this.selectedASite = false;
    this.orderForm.controls['customerId'].setValue(site.id);
    this.siteName = site.custName;
    this.siteId = site.id;
  }
  getRequestData() {
    this.isLoading = true;
    let filter = {
      customerId: this.siteId,
      date: dateHelper.ConvertDateWithSameValue(
        new Date(this.orderForm.value.date)
      ),
    };
    let calcSubscreption = this.api
      .calculateRequest(filter)
      .subscribe(async (res) => {
        this.isLoading = false;
        if (res.isSuccess) {
          this.cylinderPercentage =
            (await res.data) as CylindersPercentageModel;
          this.backupForm.patchValue(res.data);
          this.LOXForm.patchValue(res.data);
          if (!this.orderForm.value.isCylinder) {
            this.LOXForm.get('lox1VolumeRq')?.setValue(
              this.cylinderPercentage.loX1Volume
            );
            this.LOXForm.get('lox2VolumeRq')?.setValue(
              this.cylinderPercentage.loX2Volume
            );
          }
        } else {
          this.isLoading = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Values Status',
            detail: res.message,
            life: 3000,
          });
        }
      });
    this.requestsList.push(calcSubscreption);
  }

  getDivData() {
    if (!this.checked) {
      if (this.loxDivView) {
        const loxDivChildrenLegnth =
          this.loxDivView.nativeElement.childElementCount;
        if (loxDivChildrenLegnth > 0) {
          this.foundLoxChildren = true;
        } else {
          this.foundLoxChildren = false;
        }
      }
    } else {
      if (this.cylinderDivView) {
        const cylinderDivChildrenLegnth =
          this.cylinderDivView.nativeElement.childElementCount;
        if (cylinderDivChildrenLegnth > 0) {
          this.foundCylinderChildren = true;
        } else {
          this.foundCylinderChildren = false;
        }
      }
    }
  }

  ngAfterViewChecked() {
    this.getDivData();
  }

  fillCylinderPercentageData() {
    this.isLoading = true;
    let filter = {
      customerId: this.siteId,
      date: dateHelper.ConvertDateWithSameValue(
        new Date(this.orderForm.value.date)
      ),
    };
    let calcSubscreption = this.api
      .calculateRequest(filter)
      .subscribe((res) => {
        this.cylinderPercentage = res.data as CylindersPercentageModel;
        if (!this.orderForm.value.isCylinder) {
          if (res.isSuccess) {
            this.LOXForm.get('lox1VolumeRq')?.setValue(
              this.cylinderPercentage.loX1Volume
            );
            this.LOXForm.get('lox2VolumeRq')?.setValue(
              this.cylinderPercentage.loX2Volume
            );
          } else {
            this.isLoading = false;
            this.messageService.add({
              severity: 'warn',
              summary: 'Values Status',
              detail: res.message,
              life: 3000,
            });
          }
        }
        this.isLoading = false;
      });
    this.requestsList.push(calcSubscreption);
  }
  //#endregion

  //#region Radio buttons
  options = [
    { name: 'Cylinders', value: true, key: 'cylinder' },
    { name: 'LOX', value: false, key: 'lox' },
  ];

  getSelectedoption(e: any) {
    this.checked = e.value;
  }
  //#endregion

  //#region Attachment
  ready(event: any) {
    this.attachForm.get('attachmentUrl')?.setValue(event[0]);
    this.attachmentUrl = event[0];
  }

  downloadFile(fileName: string) {
    var url = this.filesService.downloadFile(fileName);
    window.open(url, '_blank');
  }
  //#endregion

  //#region Save and Delete
  save() {
    if (
      this.orderForm.invalid ||
      this.backupForm.invalid ||
      this.LOXForm.invalid ||
      this.attachForm.invalid
    ) {
      validateForm.validateAllFormFields(this.orderForm);
      validateForm.validateAllFormFields(this.backupForm);
      validateForm.validateAllFormFields(this.LOXForm);
      validateForm.validateAllFormFields(this.attachForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.isSaving = true;
      if (!this.pressedSaveButton) {
        this.orderForm.value.date = dateHelper.ConvertDateWithSameValue(
          this.orderForm.value.date
        );
        this.orderForm.value.deliveryDate = dateHelper.ConvertDateWithSameValue(
          this.orderForm.value.deliveryDate
        );
      }
      this.pressedSaveButton = true;
      let m;
      if (this.orderForm.value.isCylinder) {
        m = {
          ...this.orderForm.value,
          ...this.backupForm.value,
          ...this.attachForm.value,
        } as OrderingCylindersLOX;
      } else {
        m = {
          ...this.LOXForm.value,
          ...this.orderForm.value,
          ...this.attachForm.value,
        } as OrderingCylindersLOX;
      }
      console.log(m);
      if (m.id == 0) {
        //add
        this.api.addRequest(m).subscribe({
          next: (res) => {
            this.apiResponse(res);
          },
          error: (e) => {
            console.error('unable to save ', e);
          },
          complete: () => {
            this.isSaving = false;
          },
        });
      } else {
        //update
        this.api.updateRequest(m).subscribe({
          next: (res) => {
            this.apiResponse(res);
          },
          error: (e) => {
            console.error('unable to save ', e);
          },
        });
      }
    }
  }

  deleteOrder() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Order?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteRequest(this.id).subscribe((res) => {
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
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
      this.route.navigate(['maintenance/ordering-cylinders-lox']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }

  ngOnDestroy() {
    for (let req of this.requestsList) {
      req.unsubscribe();
    }
  }
  //#endregion
}
