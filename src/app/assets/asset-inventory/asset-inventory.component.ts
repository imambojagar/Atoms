import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  MessageService,
} from 'primeng/api';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { AssetInventory } from '../../models/asset-inventory-model';
import { AssetInventoryService } from '../../services/asset-inventory.service';
import { ExportService } from '../../shared/services/export.service';
import { buildFilterForm } from './add-edit-inventory/form-builder';
import { PrimengModule } from '../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { AssetInventorySearchComponent } from './asset-inventory-search/asset-inventory-search.component';
import { Table } from 'primeng/table';
import { AddEditInventoryComponent } from './add-edit-inventory/add-edit-inventory.component';
import { ViewAssetInventoryComponent } from './view-asset-inventory/view-asset-inventory.component';
import { CustomerService } from '../../services/customer.service';
import { AssetTransferService } from '../../services/asset-transfer.service';

@Component({
  selector: 'app-asset-inventory',
  standalone: true,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AssetInventorySearchComponent,
    AddEditInventoryComponent,
    ViewAssetInventoryComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './asset-inventory.component.html',
  styleUrl: './asset-inventory.component.scss',
})
export class AssetInventoryComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  addAssetInventoryLoaded: boolean = false;
  viewAssetInventoryLoaded: boolean = false;
  filterLoaded: boolean = false;
  asset_inventory_id: any = 0;
  asset_inventory_index: any;
  showFilterModal: boolean = false;

  inventoryModel: AssetInventory = new AssetInventory();
  searchForm: any;
  //breadcrumb
  items!: MenuItem[];
  //search filter
  survey!: any[];
  totalRows: number = 0;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  displayPrint: boolean = false;
  isPrinting: string = 'pi-check';

  assetsNameList: any[] = [];
  statusList: any[] = [];
  siteList: [] = [];
  departmentList!: any[];
  assetGroupsList: any[] = [];
  dataPrinted: any;
  balanceFrozen: boolean = false;

  titleList: [] = [];
  buildingList: any[] = [];
  floorList: any[] = [];
  roomList: [] = [];
  customers: [] = [];
  searchValue: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private api: AssetInventoryService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exporteService: ExportService,
    private assetTransfer: AssetTransferService,
    private siteApi: CustomerService
  ) { }

  ngOnInit(): void {
    //this.searchAssetGroup();
    this.searchForm = buildFilterForm(this.fb);

    // this.items = [{ label: 'Home' }, { label: 'Asset Inventory List' }];
    this.Search();
  }

  getAssetInventorySearch(searchdata: any) {
    this.filter = searchdata;
    this.Search();
  }

  navToDetails(row: any, index: number) {
    // this.router.navigate(['/assets/asset-inventory/edit-control'], {
    //   queryParams: { data: row.id, index },
    // });
    this.inventoryModel.id = row.id;
    this.asset_inventory_id = row.id;
    this.asset_inventory_index = index;
    this.addAssetInventoryLoaded = !this.addAssetInventoryLoaded;
  }

  viewDetails(row: any, index: number) {
    this.inventoryModel.id = row.id;
    this.asset_inventory_id = row.id;
    this.asset_inventory_index = index;
    this.viewAssetInventoryLoaded = !this.viewAssetInventoryLoaded;
  }

  async openModal() {
    this.inventoryModel.id = 0;
    this.asset_inventory_id = 0;
    this.asset_inventory_index = 0;
    this.addAssetInventoryLoaded = !this.addAssetInventoryLoaded;
  }

  async openEditModal() {
    this.viewAssetInventoryLoaded = !this.viewAssetInventoryLoaded;
  }

  async openFilterModal() {
    this.showFilterModal = !this.showFilterModal;
  }

  Search() {
    console.log('this.filter', this.filter);
    this.api.getAll(this.filter).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.totalRows = res.totalRows;
        this.survey = data;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
      this.cdr.detectChanges();
    });
    this.searchForm.reset();
    this.close_filter_modal();
  }

  paginate(event: any) {
    this.filter.pageNumber = event.page + 1;
    this.Search();
  }

  delete(row: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.delete(row.id).subscribe((res) => {
          console.log('delete res', res);
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

  fillTitle(event: any) {
    this.api.getAll({ surveyCode: event.query }).subscribe((res) => {
      const data = res.data;
      console.log('title', data);
      this.titleList = data;
    });
  }

  fillBuilding(event: any) {
    this.api.getAll({ buildingId: event.query }).subscribe((res) => {
      const data = res.data;
      console.log('building', data);
      this.buildingList = data;
    });
  }

  fillFloor(event: any) {
    debugger;
    this.api.getAll({ floorId: event.query }).subscribe((res) => {
      const data = res.data;
      console.log('floor', data);
      this.floorList = data;
    });
  }

  //site block
  getCustomers($event: any) {
    this.siteApi
      .GetCustomersAutoComplete($event.query)
      .subscribe((a) => (this.customers = a.data));
  }
  getBuildingList($event: any) {
    console.log('site event', $event);
    this.filter.siteId = $event.id;
    this.assetTransfer
      .getBuildingLookup({ siteId: $event.id })
      .subscribe((a) => {
        this.buildingList = a.data;
      });
  }
  getFloorList(event: any) {
    this.filter.buildingId = event.value;
    this.assetTransfer
      .getFloorLookup({
        siteId: this.searchForm.value.siteId.id,
        buildingId: event.value,
      })
      .subscribe((res) => {
        this.floorList = res.data;
      });
  }

  getDepartments(event: any) {
    this.filter.floorId = event.value;

    this.assetTransfer
      .getDepLookup({
        siteId: this.searchForm.value.siteId.id,
        buildingId: this.searchForm.value.buildingId,
        floorId: event.value,
      })
      .subscribe((res) => {
        this.departmentList = res.data;
      });
  }
  onSelectDept(event: any) {
    this.filter.departmentId = event.value;

    this.assetTransfer
      .getRoomLookup({
        siteId: this.searchForm.value.siteId.id,
        buildingId: this.searchForm.value.buildingId,
        floorId: this.searchForm.value.floorId,
        departmentId: event.value,
      })
      .subscribe((res) => {
        this.roomList = res.data;
      });
  }

  onSelectRoom(event: any) {
    this.filter.roomId = event.value;
  }

  export() {
    console.log('this.filter', this.filter);
    this.exporteService
      .export(this.filter, 'AssetSurvey/ExportToExcel')
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'File should be downloaded now',
          life: 3000,
        });
        var downloadURL = URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'AssetSurvey-Report';
        link.click();
      });
  }

  //#region Print PPMs Dialog
  showPrintDialog(survey: any[]) {
    this.dataPrinted = survey;
    console.log('data printed', survey);
    this.displayPrint = true;
  }
  async waitForElement(selector: string): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(interval);
          resolve(element as HTMLElement);
        }
      }, 100);
    });
  }

  async printPPMs() {
    this.isPrinting = 'pi-spin pi-spinner';
    var doc = new jsPDF();
    // Source HTMLElement or a string containing HTML.
    let elementHTML = document.querySelector('#htmlToBePrinted') as HTMLElement;

    await doc.html(elementHTML, {
      callback: function (doc) {
        // Save the PDF
        doc.save('AssetInventory.pdf');
      },
      margin: [10, 10, 10, 10],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 180, //target width in the PDF document
      windowWidth: 675, //window width in CSS pixels
    });

    this.isPrinting = 'pi-check';
  }

  close_filter_modal() {
    this.searchForm.reset();
    this.showFilterModal = false;
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.survey = this.survey.filter((row: any) =>
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
    this.Search();
    this.cdr.detectChanges();
  }
}
