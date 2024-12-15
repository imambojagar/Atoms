import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { OrderingCylindersLoxService } from '../data/ordering-cylinders-lox.service';
import { Router } from '@angular/router';
/* import { CustomerService } from 'src/app/data/service/customer.service';
import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { LookupService } from 'src/app/data/service/lookup.service';
import { Lookup } from 'src/app/data/Enum/lookup';
import validateForm from 'src/app/shared/helpers/validateForm'; */
import jsPDF from 'jspdf';
import { cylinderProperties } from '../data/ordering-cylinders-lox.model';
import { CylindersReferenceService } from '../../cylinders-reference/data/cylinders-reference.service';
import { CustomerService } from '../../../services/customer.service';
import { LookupService } from '../../../services/lookup.service';
import { ExportService } from '../../../shared/services/export.service';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import { Lookup } from '../../../shared/enums/lookup';
import validateForm from '../../../shared/helpers/validateForm';
import { PrimengModule } from '../../../shared/primeng.module';
import { OrderingCylindersLoxControlComponent } from '../ordering-cylinders-lox-control/ordering-cylinders-lox-control.component';
import { AttachmentsComponent } from '../../../shared/components/attachments/attachments.component';
import { OrderingCylindersLoxViewDetailsControlComponent } from '../ordering-cylinders-lox-view-details/ordering-cylinders-lox-view-details-control.component';

@Component({
  standalone: true,
  selector: 'app-ordering-cylinders-lox-view',
  imports: [
    PrimengModule ,
    FormsModule,
    ReactiveFormsModule,
    OrderingCylindersLoxControlComponent,
    AttachmentsComponent,
    OrderingCylindersLoxViewDetailsControlComponent],
  templateUrl: './ordering-cylinders-lox-view.component.html',
  styleUrls: ['./ordering-cylinders-lox-view.component.scss'],
})
export class OrderingCylindersLoxViewComponent {
  orderFG!: FormGroup;
  items!: MenuItem[];
  orders: any[] = [];
  sitesList: any[] = [];
  siteName: string = '';
  totalRows: number = 0;
  loading!: boolean;
  showmodal: boolean = false;
  isMultiupdate: boolean = false;

  isPRupdate: boolean = false;
  isPOupdate: boolean = false;
  isInvoiceupdate: boolean = false;
  isPRFupdate: boolean = false;
  isPCDupdate: boolean = false;
  isClosed: boolean = false;

  selectedRows: any[] = [];

  backupStatusList: any[] = [];
  nextBackupStatusList: any[] = [];
  selectedStatus: any;
  selectedNextStep: any;

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  routingId: number = 0;

  multiUpdateForm!: FormGroup;
  isSaving: boolean = false;

  userId: string | null = localStorage.getItem('userId');
  userRoles: any[] = JSON.parse(localStorage.getItem('userRoles') || '[]');

  YesOrNo: any[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  pressedSaveButton: boolean = false;
  displayPrint: boolean = false;
  isPrinting: string = 'pi-check';
  selectedToBePrinte: any;

  cylinders: any;
  cylindersArr = cylinderProperties;
  priceRef: any;
  totalAfterVat!: number;
  vatPrice: number = 0;
  showPrint: boolean = false;
  searchIsClicked: boolean = false;

  orderingcylinder: any[]=[];
  selectedNames!: any[] | null;
  addTransferLoaded: boolean = false;
  viewCylinderTransferLoaded: boolean = false;
  service_request_edit_id: number = 0;
  searchValue: any;
  editIndex: any;

  constructor(
    private api: OrderingCylindersLoxService,
    private priceApi: CylindersReferenceService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private apiCustomer: CustomerService,
    private lookupService: LookupService,
    private exporteService:ExportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.Search();
    this.buildForms();
    this.getBackupStatusLookups();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Ordering Cylinders/LOX' },
    ];
  }

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  close_displayPrint() {
    this.displayPrint = !this.displayPrint;
  }

  openFilterModal() {
    this.showmodal = !this.showmodal;
  }

  openModal() {
    this.addTransferLoaded = !this.addTransferLoaded
  }

  openViewModal() {  
    this.viewCylinderTransferLoaded = !this.viewCylinderTransferLoaded;
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.orders = this.orders.filter((row: any) =>
        Object.values(row).some((val: any) => String(val).toLowerCase().includes(this.searchValue))
      );
    }
    else {
      this.resetGlobalFilter()
    }
    this.cdr.detectChanges();
  }

  resetGlobalFilter() {
    this.searchValue = ''; // Clear the search input
    this.Search()
    this.cdr.detectChanges();
  }

  // region Main Search
  Search() {
    this.loading = true;
    this.setStepsCondition();
    this.userRoles.find((role) => role.value == 'R-13')
      ? (this.filter.userId = this.userId = null)
      : (this.filter.userId = this.userId = localStorage.getItem('userId'));
    this.api.searchRequest(this.filter).subscribe(async (res) => {
      const data = await res.data;
      this.totalRows = await res.totalRows;
      this.orders = await data;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  setStepsCondition() {
    if (this.selectedNextStep) {
      this.isMultiupdate = true;

      switch (this.selectedNextStep) {
        case this.nextBackupStatusList[1].id:
          this.isPRupdate = true;
          this.isPOupdate = false;
          this.isInvoiceupdate = false;
          this.isPRFupdate = false;
          this.isPCDupdate = false;
          this.isClosed = false;
          break;

        case this.nextBackupStatusList[2].id:
          this.isPRupdate = false;
          this.isPOupdate = true;
          this.isInvoiceupdate = false;
          this.isPRFupdate = false;
          this.isPCDupdate = false;
          this.isClosed = false;
          break;

        case this.nextBackupStatusList[3].id:
          this.isPRupdate = false;
          this.isPOupdate = false;
          this.isInvoiceupdate = true;
          this.isPRFupdate = false;
          this.isPCDupdate = false;
          this.isClosed = false;
          break;

        case this.nextBackupStatusList[4].id:
          this.isPRupdate = false;
          this.isPOupdate = false;
          this.isInvoiceupdate = false;
          this.isPRFupdate = true;
          this.isPCDupdate = false;
          this.isClosed = false;
          break;

        case this.nextBackupStatusList[5].id:
          this.isPRupdate = false;
          this.isPOupdate = false;
          this.isInvoiceupdate = false;
          this.isPRFupdate = false;
          this.isPCDupdate = true;
          this.isClosed = false;
          break;

        case this.nextBackupStatusList[6].id:
          this.isPRupdate = false;
          this.isPOupdate = false;
          this.isInvoiceupdate = false;
          this.isPRFupdate = false;
          this.isPCDupdate = false;
          this.isClosed = true;
          break;

        default:
          this.isPRupdate = false;
          this.isPOupdate = false;
          this.isInvoiceupdate = false;
          this.isPRFupdate = false;
          this.isPCDupdate = false;
          this.isClosed = false;
      }
    } else {
      this.isMultiupdate = false;
    }
  }

  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      customerId: null,
      date: null,
      prNumber: null,
      poNumber: null,
      backupStatusId: null,
      nextStepId: null,
      deliveryDate: null,
      userId: this.userId,
    };
    this.siteName = '';
    this.selectedNextStep = null;
    this.isPRupdate = false;
    this.isPOupdate = false;
    this.isInvoiceupdate = false;
    this.isPRFupdate = false;
    this.isPCDupdate = false;
    this.Search();
    this.orderFG.reset();
  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.api.searchRequest(this.filter).subscribe((res) => {
      const data = res.data;
      this.orders = data;
      this.totalRows = res.totalRows;
      this.loading = false;
    });
  }

  customerIdFilter(cust: any) {
    this.apiCustomer
      .searchCustomer({ custName: cust.query })
      .subscribe((res) => {
        this.sitesList = res.data;
      });
  }
  date(e: any) {
    let myDate = e;
    myDate = dateHelper.ConvertDateWithSameValue(new Date(myDate));
    return myDate;
  }
  //#endregion

  //#region Form definition
  buildForms() {
    this.orderFG = this.fb.group({
      site: [],
      date: [],
      prNumber: [],
      poNumber: [],
      backUpStatusId: [],
      nextBackUpStatusId: [],
      deliveryDate: [],
      invoiceNumber: [],
    });
    this.multiUpdateForm = this.fb.group({
      ids: [],
      pr: [],
      PRAttachement: [],
      po: [],
      PoAttachement: [],
      invoiceNumber: [],
      invoiceFrom: [],
      invoiceTo: [],
      invoiceAttachement: [],
      prfDate: [],
      prfApproved: true,
      prfAttachement: [],
      pcdSubmissionDate: [],
      pcdAttachmentUrl: [],
    });
  }
  //#endregion

  //#region Define Lookups
  getBackupStatusLookups() {
    this.lookupService
      .get({ queryParams: Lookup.BackUpStatus })
      .subscribe((res) => {
        this.backupStatusList = res.data;
      });
    this.lookupService
      .get({ queryParams: Lookup.NextBackUpStatus })
      .subscribe((res) => {
        this.nextBackupStatusList = res.data;
      });
  }

  setNextBackupStatus(event: any) {
    this.selectedNextStep = event.value;
  }
  //#endregion

  //#region Naving to details
  navToDetails(row: any, index: number) {
    /* this.router.navigate(['maintenance/ordering-cylinders-lox/edit-control'], {
      queryParams: { data: row.id, index },
    }); */
    this.editIndex = index;
    this.service_request_edit_id = row.id;
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  navToView(row: any, index: number) {
    this.editIndex = index;
    this.service_request_edit_id = row.id;
    this.viewCylinderTransferLoaded = !this.viewCylinderTransferLoaded;
  }

  navToDetailsFromRD(row: any, index: number, RQ: boolean) {
    this.api.moveStep(row.id).subscribe((res) => {
      this.router.navigate(
        ['maintenance/ordering-cylinders-lox/edit-control'],
        {
          queryParams: { data: row.id, index, RQ },
        }
      );
    });
  }
  //#endregion

  //#region Print Dialog
  showPrintDialog() {
    this.displayPrint = true;
  }
  async printContract() {
    this.isPrinting = 'pi-spin pi-spinner';
    var doc = new jsPDF();
    // Source HTMLElement or a string containing HTML.
    let elementHTML = document.querySelector('#htmlToBePrinted') as HTMLElement;

    await doc.html(elementHTML, {
      callback: function (doc) {
        // Save the PDF
        doc.save('Backup.pdf');
      },
      margin: [10, 10, 10, 10],
      autoPaging: 'text',
      x: 6,
      y: 0,
      width: 180, //target width in the PDF document
      windowWidth: 675, //window width in CSS pixels
    });

    this.isPrinting = 'pi-check';
  }
  //#endregion

  //#region Print summition
  itemsNoArray: number[] = [];
  itemsCount: number = 0;
  calculateTotal(supplierId: number) {
    this.itemsNoArray = [];
    this.itemsCount = 0;
    this.vatPrice = 0;
    this.totalAfterVat = 0;
    this.priceApi
      .searchCylinderPrice({ suuplierId: supplierId })
      .subscribe((res) => {
        if (res.data?.length > 0) {
          this.showPrint = true;
          this.priceRef = res?.data[0];

          let sum = 0;
          this.cylindersArr.forEach((key) => {
            if (
              this.cylinders[key.control] > 0 &&
              this.cylinders[key.control]
            ) {
              this.itemsCount++;
              this.itemsNoArray.push(this.itemsCount);

              sum +=
                this.cylinders[key.control] *
                this.priceRef[key.control.replace('Recieved', '')];
            } else {
              this.itemsNoArray.push(0);
            }
          });
          if (this.cylinders.loX1Volume) {
            if (this.selectedToBePrinte.loX1Volume) {
              this.itemsCount++;
              this.itemsNoArray.push(this.itemsCount);
              sum +=
                this.selectedToBePrinte.loX1Volume * this.priceRef.loX1Volume;
            } else {
              this.itemsNoArray.push(0);
            }
          }
          this.vatPrice = sum * 0.15;
          this.totalAfterVat = sum + this.vatPrice;
        } else {
          this.showPrint = false;
          this.messageService.add({
            severity: 'error',
            summary: 'No Price Reference',
            detail:
              'The price reference of the supplier of this order has not been declared',
            life: 3000,
          });
        }
      });
  }
  poSummition() {
    if (this.orders.length > 0) {
      this.api.poSummition(this.filter).subscribe((res) => {
        this.cylinders = res.data;
        this.selectedToBePrinte = res.data;
        this.calculateTotal(this.cylinders.supplierId);
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'No Orders',
        detail: 'There are no orders with this Number',
        life: 3000,
      });
    }
  }
  //#endregion

  //#region Attachement Method
  ready(event: any, controller: string) {
    this.multiUpdateForm.get(controller)?.setValue(event[0]);
  }
  //#endregion

  //#region API Methods
  multiUpdate(formtype: string) {
    const apiMethod =
      formtype === 'pr'
        ? 'prMultiUpdate'
        : formtype === 'po'
        ? 'poMultiUpdate'
        : formtype === 'inv'
        ? 'invoiceMultiUpdate'
        : formtype === 'prf'
        ? 'prfMultiUpdate'
        : 'pcdMultiUpdate';
    let ids: any[] = [];
    this.selectedRows.map((order) => {
      ids.push(order.id);
    });
    this.multiUpdateForm.value.ids = ids.join(',');

    if (this.multiUpdateForm.invalid) {
      validateForm.validateAllFormFields(this.multiUpdateForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.isSaving = true;
      if (
        (!this.pressedSaveButton && this.isPCDupdate) ||
        this.isInvoiceupdate
      ) {
        this.multiUpdateForm.value.pcdSubmissionDate =
          dateHelper.ConvertDateWithSameValue(
            this.multiUpdateForm.value.pcdSubmissionDate
          );
        this.multiUpdateForm.value.invoiceFrom =
          dateHelper.ConvertDateWithSameValue(
            this.multiUpdateForm.value.invoiceFrom
          );
        this.multiUpdateForm.value.invoiceTo =
          dateHelper.ConvertDateWithSameValue(
            this.multiUpdateForm.value.invoiceTo
          );
        this.pressedSaveButton = true;
      }
      this.api[`${apiMethod}`](this.multiUpdateForm.value).subscribe((res) => {
        this.apiResponse(res);
        this.isSaving = false;
        this.selectedRows = [];
      });
    }
  }

  deleteOrder(row: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Order?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteRequest(row.id).subscribe((res) => {
          this.apiResponse(res);
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
      this.Search();
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



  export() {

     this.exporteService
      .export(this.filter, 'BackupRequest/exportCylindersBackup')
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'File should be downloaded now',
          life: 3000,
        });
        var downloadURL = URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Cylinders-Backup-Report';
        link.click();
      });
  }


}
