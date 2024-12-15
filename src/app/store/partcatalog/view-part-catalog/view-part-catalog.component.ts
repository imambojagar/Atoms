import { PartCatalogService } from './../part-catalog.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FilterService, MenuItem } from 'primeng/api';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
  Message,
} from 'primeng/api';
import { Router } from '@angular/router';
import { PartCatalogModel } from '../part-catalog.model';
/* import { CustomerService } from 'src/app/data/service/customer.service'; */
import { DatePipe } from '@angular/common';
import * as XLSX from "xlsx";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModelService } from '../../../services/model-definition.service';
import { CustomerService } from '../../../services/customer.service';
/* import { ModelService } from 'src/app/data/service/model-definition.service'; */


@Component({
  selector: 'view-part-catalog',
  templateUrl: './view-part-catalog.component.html',
  styleUrls: ['./view-part-catalog.component.css'],
  providers: [MessageService, ConfirmationService, FilterService],
})
export class ViewPartCatalogComponent implements OnInit {

  partCatalogModel: PartCatalogModel = new PartCatalogModel();
  tableData: PartCatalogModel[] = [];
  searchForm !: FormGroup;

  totalRows!: number;
  loading!: boolean;
  filter: any= {
    pageSize: 10,
    pageNumber: 1,
  };
  customers: any[] = [];
  items!: MenuItem[];
  PartsItems: [] = [];
  description: [] = [];
  modelsList: [] = [];
  searchValue: string = ''; 
  showmodal: boolean = false;
  showViewModal: boolean = false;
  addTransferLoaded: boolean = false;
  viewPartCatalogLoaded: boolean = false;
  editPartCatalogLoaded: boolean = false;

  constructor(
    private api: PartCatalogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private formbuilder: FormBuilder,
    private modelService: ModelService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
  ) {}

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  close_view_modal() {
    this.showViewModal = !this.showViewModal;
  }

  openFilterModal() {
    this.showmodal = true;
  }

  openModal() {
    this.partCatalogModel.id = 0;
    this.addTransferLoaded = !this.addTransferLoaded;
  }


  openEditModal() {
    this.editPartCatalogLoaded = !this.editPartCatalogLoaded;
  }

  openViewModal() {
    this.viewPartCatalogLoaded = !this.viewPartCatalogLoaded;
  }

  
  ngOnInit(): void {
    this.search();
    this.searchForm = this.formbuilder.group({
      partNumber: null,
      partName: null,
      oracleCode: null,
      assetModel: null,
      clientPart: null,
      onReserve: null,
      currency: null,
      class: null,
      site: null,
      supplier: null,
    });
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Part Catalog List' },
    ];
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.tableData = this.tableData.filter((row: any) =>
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
    this.search()
    this.cdr.detectChanges();
  }

  reset() {
   this.filter={
    pageSize: 10,
    pageNumber: 1,
   }
   this.searchForm.reset();
    this.search();
  }

  search() {
    this.loading = true;
    this.filter.pageNumber=1;
    this.api.searchPartCatalog(this.filter).subscribe((res) => {
      this.loading = false;
      const data = res.data;
      console.log('asset name list', data);
      this.totalRows = res.totalRows;
      this.tableData = data;
      this.cdr.detectChanges();
    });
  }

  partIndex: number = 0;
  navToDetails(row: any, index: number) {
    this.partCatalogModel.id = row.id;
    this.editPartCatalogLoaded = !this.editPartCatalogLoaded;
    this.partIndex = index;
   /*  this.router.navigate(['store/part-catalog/edit-control'], {
      queryParams: { data: row.id },
    }); */
  }


  navToView(row: any, index: number) {
    this.partCatalogModel.id = row.id;
    this.partIndex = index;
    this.viewPartCatalogLoaded = !this.viewPartCatalogLoaded; 
   /*  this.router.navigate(['store/part-catalog/edit-control'], {
      queryParams: { data: row.id },
    }); */
  }
  

  paginate(event: any) {
    console.log('paginate event', event);
    this.filter.pageNumber = event.page + 1;
    this.loading = true;
    this.api.searchPartCatalog(this.filter).subscribe((res) => {
      this.loading = false;
      const data = res.data;
      console.log('asset name list', data);
      this.totalRows = res.totalRows;
      this.tableData = data;
    });

    //this.search();
  }

  deletePartCatalog(row: any) {

    this.partCatalogModel.id = row.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deletePartCatalog(row.id).subscribe((x) => {
          if (x.isSuccess) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: x.message,
              life: 3000,
            });
            this.search();
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Cannot Delete',
              detail: x.message,
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

  completePartCatalog(event: any) {
    this.api
      .getAutoCompleteByPartName(event.query)
      .subscribe((a) => (this.PartsItems = a));
  }

  completePartName(event: any) {
    this.api
      .getAutoComplete({partName:event.query})
      .subscribe((a) => (this.description = a));
  }


  modelNameFilter(name: any) {
    this.modelService.getModel({ name: name.query }).subscribe((res) => {
      const data = res.data;
      console.log('model name:', data);
      this.modelsList = data;
    });
  }
  getCustomers($event: any) {
    this.customerService
      .GetCustomersAutoComplete($event.query)
      .subscribe((a) => (this.customers = a.data));
  }


  exportToExcel() {
    let filterCopy = { ...this.filter };
    filterCopy.pageSize = 2147483646;
    this.api.searchPartCatalog(filterCopy).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        const t = new Date();
        const date = ('0' + t.getDate()).slice(-2);
        const month = ('0' + (t.getMonth() + 1)).slice(-2);
        const year = t.getFullYear();
        const time = `${date}/${month}/${year}`;
        let datePipe = new DatePipe('en-us');
        let data = ((res.data ?? []) as any).map((c: any) => {
          return {
            "Part Number": c.partNumber,
            "Part Name": c.partName,
            "Oracle Code": c.OracleCode,
            "Asset Model": c.modelInfo != null && c.modelInfo.length > 0 ? c.modelInfo[0].assetModelName : "",
            "Client Part": c.inventory != null && c.inventory.length > 0 ? c.inventory[0].clientPartName : "",
            "Supplier": c.supplier != null && c.supplier.length > 0 ? c.supplier[0].supplierName : "",
          }
        });
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data ?? []);
        ws["!cols"] = [{ wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 50 }, { wch: 50 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }]
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Exported');
        XLSX.writeFile(wb, `exported Reports ${time}.xlsx`);
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
