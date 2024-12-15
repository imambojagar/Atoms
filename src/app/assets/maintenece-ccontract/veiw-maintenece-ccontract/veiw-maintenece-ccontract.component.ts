import { MainteneceCcontractManagementComponent } from './../maintenece-ccontract-management/maintenece-ccontract-management.component';
import { ChangeDetectorRef, Component } from '@angular/core';
import { SearchMainteneceCcontractComponent } from '../search-maintenece-ccontract/search-maintenece-ccontract.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengModule } from '../../../shared/primeng.module';

import { MenuItem, MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ExportService } from '../../../shared/services/export.service';
import { MaintenanceService } from '../../../services/maintenance.service';

@Component({
  selector: 'app-veiw-maintenece-ccontract',
  standalone: true,
  imports: [SearchMainteneceCcontractComponent, MainteneceCcontractManagementComponent, CommonModule, FormsModule, PrimengModule, ReactiveFormsModule, TranslateModule,],
  templateUrl: './veiw-maintenece-ccontract.component.html',
  styleUrl: './veiw-maintenece-ccontract.component.scss'
})
export class VeiwMainteneceCcontractComponent {

  filterLoaded: boolean = false;
  addMaintenanceLoaded: boolean = false;
  allData: any[] = [];
  totalRows!: number;
  totalRowsModels!: number;
  loading!: boolean;
  manufatureresList: [] = [];
  modelsList: [] = [];
  // showDialog!: boolean;
  parentId: any;
  filter: any = {
    pageSize: 10,
    pageNumber: 1
  };
  child: any
  editModelobject: any
  searchValue: any;
  constructor(private api: MaintenanceService, private formbuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exporteService: ExportService, private cdr: ChangeDetectorRef,) { }
  ngOnInit(): void {


    this.getAll()
  }

  export() {
    // todo
    // this.filter.assetGroup = this.mContractSearch.value.assetGroup;
    this.exporteService
      .export(this.filter, 'MContract/export')
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
        link.download = 'Maintenance-Contract-Report';
        link.click();
      });
  }

  // Global search and filter logic
  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.allData = this.allData.filter((row: any) =>
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
    this.getAll()
    this.cdr.detectChanges();
  }






  getAll() {
    this.filter.pageSize = 10
    this.api.getMaintenance(this.filter).subscribe((res: any) => {

      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.allData = data;
        this.totalRows = res.totalRows;
        this.cdr.detectChanges();

        this.filterLoaded = false
        this.addMaintenanceLoaded = false
      }
      else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });


  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.getAll();
    this.loading = false;
    this.cdr.detectChanges();
  }




  delete(id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteMaintenance(id).subscribe(res => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.getAll();
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
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });

  }


  async openFilterModal() {
    this.filterLoaded = !this.filterLoaded;
    if (this.filterLoaded) {
      this.filter = {
        pageSize: 10,
        pageNumber: 1
      };
    }
    if (!this.filterLoaded) {

      this.getAll()
    }

  }


  getMaintenanceSearch(event: any) {

    this.filter = event;
    debugger
    this.getAll();
    this.filterLoaded = false
  }
  async openaddmodel() {
    this.addMaintenanceLoaded = true;

  } async closeaddmodel() {
    this.addMaintenanceLoaded = false;
    this.cdr.detectChanges()
  }
  close() {
    this.filterLoaded = false
    this.getAll()
  }
  openeditModal(id: number) {
    this.api.getSingleMaintenance(id).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.addMaintenanceLoaded = true
        this.editModelobject = data
        this.cdr.detectChanges()
      }
      else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });



  }
  Date(d: any) {
    if (!d) {
    } else {
      d = new Date(d).toDateString();
      return d;
    }
  }


}
