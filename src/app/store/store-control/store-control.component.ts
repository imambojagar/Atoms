import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  MessageService,
} from 'primeng/api';
/* import { CustomerService } from 'src/app/data/service/customer.service'; */
import { StoreControlServiceService } from './store-control-service.service';
import { TransactionHistory } from '../../shared/models/transaction-history';
import { CustomerService } from '../../services/customer.service';
/* import { StaticMessages } from 'src/app/shared/helpers/StaticMessages';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Component({
  selector: 'app-store-control',
  templateUrl: './store-control.component.html',
  styleUrls: ['./store-control.component.scss'],
})
export class StoreControlComponent implements OnInit {
  storesForm!: FormGroup;
  storesList = [];
  items!: MenuItem[];

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
    store: null,
  };
  totalRows!: number;
  loading!: boolean;
  searchValue: string = '';
  storeModel = {
    id: 0,
    storeName: '',
    siteId: '',
    siteName: '',
    storeCode: '',
  };

  customers: any[] = [];
  displayAdd: boolean = false;
  displayUpdate: boolean = false;
  transactionHistory!: TransactionHistory

  showmodal : boolean = false ;
  showmodal1 : boolean = false ;

  constructor(
    private fb: FormBuilder,
    private api: StoreControlServiceService,
    private messageService: MessageService,
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
  ) {}

  openModal() {
    this.showmodal = true;
  }

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  openFilterModal() {

  }

  close_modals() {
    this.showmodal1 = !this.showmodal1;
  }

  close_update() {
    this.displayUpdate = !this.displayUpdate;
  }

  ngOnInit() {
    this.getstores();
    this.storesForm = this.fb.group({
      id: ['', Validators.required],
      storeName: ['', Validators.required],
      siteId: ['', Validators.required],
      storeCode: ['', Validators.required],
    });

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Define Store' },
    ];
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.storesList = this.storesList.filter((row: any) =>
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
    this.getstores()
    this.cdr.detectChanges();
  }

  getstores() {
    this.api.search(this.filter).subscribe((res) => {
      this.totalRows = res.totalRows;
      console.log('reessss', res);
      this.storesList = res.data;
      this.cdr.detectChanges();
    });
  }
  paginate(event: any) {
    this.loading = true;
    console.log('paginate event', event);
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.search(this.filter).subscribe((res) => {
        const data = res.data;
        this.storesList = data;
        this.totalRows = res.totalRows;
        this.loading = false;
        this.cdr.detectChanges();
      });
    }, 500);
  }
  showAddDialog() {
    this.displayAdd = true;
  }
  showUpdateDialog(store: any) {
    let cloned = { ...store };
    let obj = <any>{ id: store.siteId, custName: store.siteName };
    this.customers.push(obj);
    cloned.siteId = obj;
    this.transactionHistory=new TransactionHistory();
    Object.assign( this.transactionHistory,store);
    console.log('transactionHistory', store);
    this.storesForm.patchValue(cloned);
    this.displayUpdate = true;
  }
  onAdd() {
    this.storeModel.id = 0;
    this.storeModel.storeName = this.storesForm.value.storeName;
    this.storeModel.siteId = this.storesForm.value.siteId.id;
    this.storeModel.storeCode = this.storesForm.value.storeCode;
    this.api.add(this.storeModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.displayAdd = false;
        this.getstores();
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

  storeId!: number;
  onUpdate() {
    this.storeModel.id = this.storeId;
    this.storeModel.storeName = this.storesForm.value.storeName;
    this.storeModel.siteId = this.storesForm.value.siteId.id;
    this.storeModel.storeCode = this.storesForm.value.storeCode;

    this.api.update(this.storeModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.displayUpdate = false;
        this.getstores();
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
  onDelete(store: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + store.storeName + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.storesForm.value.id = store.id;
        this.api.delete(this.storesForm.value.id).subscribe((res) => {
          this.getstores();
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Model Deleted',
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

  getCustomers($event: any) {
    this.customerService
      .GetCustomersAutoComplete($event.query)
      .subscribe((a) => {
        this.cdr.detectChanges();
        return (this.customers = a.data)
      });
  }
  onHideDialog() {
    this.storesForm.reset();
  }

  exportToExcel() {
    this.api.export(this.filter).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'File should be downloaded now',
        life: 3000,
      });
      var downloadURL = URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'Stores Report';
      link.click();
    });
  }
}
