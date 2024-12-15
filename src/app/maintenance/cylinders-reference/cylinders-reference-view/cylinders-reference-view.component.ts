/* import { ExportService } from './../../../../shared/service/export.service'; */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
/* import { SharedTable } from 'src/app/shared/component/table/table'; */
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CylindersReferenceService } from '../data/cylinders-reference.service';
import { SharedTable } from '../../../shared/components/table/table';
import { ExportService } from '../../../shared/services/export.service';

@Component({
  selector: 'app-cylinders-reference-view',
  templateUrl: './cylinders-reference-view.component.html',
  styleUrls: ['./cylinders-reference-view.component.scss'],
})
export class CylindersReferenceViewComponent implements OnInit {
  tableConfig = new SharedTable();
  searchFilter = {
    pageSize: 10,
    pageNumber: 1,
  };
  isLoading = false;

  totalRows: number = 0;
  showmodal: boolean=false;
  showmodal1: boolean=false;
  showmodal2: boolean=false;
  selected_CallId: any = null;
  cylinderreference: any[]=[];
  selectedNames!: any[] | null;
  addTransferLoaded: boolean = false;
  viewCylinderTransferLoaded: boolean = false;
  service_request_edit_id: number = 0;
  searchValue: string = '';
  editIndex: number = 0;



  constructor(
    private api: CylindersReferenceService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef
  ) {}

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  openFilterModal() {
    this.showmodal = true;
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

  navToDetails(row: any, index: number) {
    /* this.nameDefinitionModel.id = row.id; */
    this.service_request_edit_id  =  row.id;
    this.editIndex = index;
    console.log("edit asset", row.id);
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  openViewDetails(row: any, index: number) {
    /* this.nameDefinitionModel.id = row.id; */
    this.service_request_edit_id  =  row.id;
    this.editIndex = index;
    console.log("view asset", row.id);
    this.viewCylinderTransferLoaded = !this.viewCylinderTransferLoaded;
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.cylinderreference = this.cylinderreference.filter((row: any) =>
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

  ngOnInit() {
    this.searchReferences();

    this.tableConfig.tableHeaders = ['Id', 'Site', 'Action'];
    this.tableConfig.deleteRow = true;
    this.tableConfig.editRow = true;
    this.tableConfig.addRow = true;
    this.tableConfig.exportRow = true;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.clickableLinks  = [{ header: ['Id'] }];

  }

  paginate(e: any) {
    this.searchFilter.pageNumber = e;
    this.tableConfig.pageFilter.pageNumber = e;
    this.searchReferences();
  }

  searchReferences() {
    this.isLoading = true;
    this.api.searchCylinderReference(this.searchFilter).subscribe((data) => {
      this.tableConfig.pageFilter.totalItems = data['totalRows'];
      let tableData: any = [];
      data['data']?.forEach((e: any) => {
        tableData.push({
          Id: e.id,
          Site: e.siteName,
        });
      });

      this.cylinderreference = tableData;
      this.tableConfig.tableData = tableData;
      this.totalRows = data.totalRows;
      this.tableConfig.pageFilter.totalRows = data.totalRows;
      this.tableConfig.tableName = 'Cylinders Reference'; 
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  Add() {
    this.router.navigate([
      '/maintenance/cylinders-reference/amount/add-control',
    ]);
  }

  edit(id: any) {
    this.router.navigate(
      ['/maintenance/cylinders-reference/amount/edit-control'],
      {
        queryParams: { id, index: 1 },
      }
    );
  }

  delete(event: any) {
    console.log(event);
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

  deleteCylinderRefrence(event: any) {
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
      ['/maintenance/cylinders-reference/amount/edit-control'],
      {
        queryParams: { id: event.rowData.Id, index: 0 },
      }
    );
  }


  exportCylinders() {

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
        link.download = 'Cylinders-Report';
        link.click();
      });
   }


}
