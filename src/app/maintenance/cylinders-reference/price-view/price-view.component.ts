/* import { ExportService } from './../../../../shared/service/export.service'; */
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
/* import { SharedTable } from 'src/app/shared/component/table/table'; */
import { CylindersReferenceService } from '../data/cylinders-reference.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedTable } from '../../../shared/components/table/table';
import { ModelService } from '../../../services/model-definition.service';
import { ExportService } from '../../../shared/services/export.service';
/* import { ModelService } from 'src/app/data/service/model-definition.service'; */

@Component({
  selector: 'app-price-view',
  templateUrl: './price-view.component.html',
  styleUrls: ['./price-view.component.scss'],
})
export class PriceViewComponent {
  tableConfig = new SharedTable();
  searchFilter = {
    pageSize: null,
    pageNumber: null,
    suuplierId: null,
  };
  suppliersList: any[] = [];
  priceForm!: FormGroup;
  isLoading: boolean = false;

  showmodal: boolean=false;
  showmodal1: boolean=false;
  showmodal2: boolean=false;
  selected_CallId: any = null;
  serviceprice: any[]=[];
  selectedNames!: any[] | null;
  addTransferLoaded: boolean = false;
  viewTransferLoaded: boolean = false;
  service_request_edit_id: number = 0;
  serviceIndex: number = 0;
  totalRows: any = 0;
  searchValue: any;

  constructor(
    private api: CylindersReferenceService,
    private router: Router,
    private fb: FormBuilder,
    private modelService: ModelService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exportService:ExportService,
    private cdr: ChangeDetectorRef
  ) { }


  close_modal() {
    this.showmodal = !this.showmodal;
  }

  openFilterModal() {
    this.showmodal = true;
  }

  openModal() {
    this.serviceIndex = 0;
    this.addTransferLoaded = !this.addTransferLoaded
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  navToDetails(row: any, index: number) {
    /* this.nameDefinitionModel.id = row.id; */
    this.service_request_edit_id  =  row.id;
    this.serviceIndex = index;
    console.log("edit asset", row.id);
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  ngOnInit() {
    this.searchReferences();
    this.priceForm = this.fb.group({
      supplierName: [],
    });
    this.tableConfig.tableName = 'Cylinders Price Reference';
    this.tableConfig.tableHeaders = ['Id', 'Supplier', 'Action'];
    this.tableConfig.deleteRow = true;
    this.tableConfig.editRow = true;
    this.tableConfig.addRow = true;
    this.tableConfig.exportRow = true;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.clickableLinks = [{ header: ['Id'] }];
  }


  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.serviceprice = this.serviceprice.filter((row: any) =>
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
    this.searchReferences()
    this.cdr.detectChanges();
  }

  paginate(e: any) {
    this.searchFilter.pageNumber = e;
    this.tableConfig.pageFilter.pageNumber = e;
    this.searchReferences();
  }

  searchReferences() {
    this.isLoading = true;
    this.api.searchCylinderPrice(this.searchFilter).subscribe((data) => {
      this.tableConfig.pageFilter.totalItems = data['totalRows'];
      let tableData: any = [];
      data['data']?.forEach((e: any) => {
        tableData.push({
          Id: e.id,
          Supplier: e.supplierName,
        });
      });

      this.serviceprice = tableData;
      this.tableConfig.tableData = tableData;
      this.totalRows  = data.totalRows;
      this.tableConfig.pageFilter.totalRows = data.totalRows;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  Reset() {
    this.priceForm.reset();
    this.searchFilter = {
      pageSize: null,
      pageNumber: null,
      suuplierId: null,
    };
    this.searchReferences();
  }

  //#region Supplier
  getSpplier($event: any) {
    return this.modelService
      .getSupplier({ suppliername: $event.query })
      .subscribe((res: any) => {
        this.suppliersList = res.data;
      });
  }
  onSelectSupplier(supplier: any) {
    this.priceForm.get('supplierId')?.setValue(supplier.id);
  }
  //#endregion

  Add() {
    this.router.navigate([
      '/maintenance/cylinders-reference/price/add-control',
    ]);
  }

  edit(id: any) {
    this.router.navigate(
      ['/maintenance/cylinders-reference/price/edit-control'],
      {
        queryParams: { id, index: 1 },
      }
    );
  }

  deletePriceService(event: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Reference?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteCylinderReference(event.Id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.searchReferences();
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
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'You have cancelled',
        });
      },
    });
  }

  delete(event: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Reference?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteCylinderReference(event.Id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.searchReferences();
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
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'You have cancelled',
        });
      },
    });
  }

  route(event: any) {
    this.router.navigate(
      ['/maintenance/cylinders-reference/price/edit-control'],
      {
        queryParams: { id: event.rowData.Id, index: 0 },
      }
    );
  }

  exportCylinderPrice() {

    this.exportService
    .export(this.searchFilter, 'Cylinder/exportCylinders')
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
      link.download = 'CylinderPrice-Report';
      link.click();
    });
   }


}
