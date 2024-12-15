import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, FilterService, MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AssetDeliveryModel } from '../../../models/asset-delivery-model';
import { SharedTable } from '../../../shared/components/table/table';
import { ExportService } from '../../../shared/services/export.service';
import { AssetDeliveryService } from '../../../services/asset-delivery.service';
/* import { AssetDeliveryModel } from 'src/app/models/asset-delivery-model';
import { AssetDeliveryService } from 'src/app/service/asset-delivery.service';
import { SharedTable } from 'src/app/shared/component/table/table';
import { ExportService } from 'src/app/shared/service/export.service';
 */
@Component({
  selector: 'app-asset-delivery-list',
  templateUrl: './asset-delivery-list.component.html',
  styleUrls: ['./asset-delivery-list.component.scss'],providers:[DatePipe]
})
export class AssetDeliveryListComponent {
  searchForm!:FormGroup;
  assetDeliveryModel: AssetDeliveryModel = new AssetDeliveryModel();
  assetDeliveries:[] = [];
  tableData: AssetDeliveryModel[] = [];
  private unsubscribe: Subscription[] = [];
  key!: any;
  disabled: boolean = true;
  selectedOperatingUnit:any;
  items!: MenuItem[];
  sites: any[] = [];
  selectedNames!: any[] | null;
  totalRows!: number;
  loading!: boolean;
  fromFlag:boolean=false;
  toFlag:boolean=false;
  deliverylist: any[] = [];
  tableConfig = new SharedTable();
  pageSize: number = 10;
  pageIndex: number = 1;
  asset_id: number = 0;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
    operatingUnit: null,
    poNumber:null,
    supplier: null,
    type: null,
    buyer: null,
    status: null
  };

  queryparfamsdata: any = {};
  edit_index : number = 0;
  addTransferLoaded: boolean = false;
  viewAssetTransferLoaded: boolean = false;
  showmodal: boolean = false;
  searchValue: string = '';

  constructor(
    private cd:ChangeDetectorRef, private api: AssetDeliveryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,private exporteService:ExportService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.tableConfig.tableHeaders = [
      "Purchase Order No",
      "Site",
      "Type",
      "Status",
      "Complete",
      "Action"
    ];
    this.tableConfig.deleteRow = true;
    this.tableConfig.editRow = true;
    this.tableConfig.addRow = true;
    this.tableConfig.viewRow = true;
    this.tableConfig.exportRow=true;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.tableName = "Asset Delivery"
    this.tableConfig.clickableLinks = [{ header: "Purchase Order No" }]
    this.search();
    this.items = [ { label: 'Home', routerLink: ['/'] }, { label: 'Asset Deliversy' }, ];
    this.getSites()
     this.getAssetDeliveries();
  }

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  openFilterModal() {
    this.showmodal = true;
  }

  async openModal() {
    this.asset_id = 0;
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  async openViewModal() {
    this.asset_id = 0;
    this.viewAssetTransferLoaded = !this.viewAssetTransferLoaded;
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.deliverylist = this.deliverylist.filter((row: any) =>
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

  editAssetDelivery(e: any) {
    this.router.navigate(['/maintenance/asset-delivery/management-asset-delivery'], { queryParams: { id: e } });
  }

  veiwAssetDelivery(e: any) {
    this.asset_id = e;
    this.edit_index = 0;
    this.viewAssetTransferLoaded = !this.viewAssetTransferLoaded;

    // this.router.navigate(['/maintenance/asset-delivery/management-asset-delivery'], { queryParams: { id: e } });
  }

  route(e: any) {
    this.router.navigate(['/maintenance/asset-delivery/management-asset-delivery'], { queryParams: { id: e.rowData.Id } });
  }


  navToDetails(row: any, index: number) {
    this.assetDeliveryModel.id = row.id;
    this.asset_id = row.id;
    this.edit_index = index;
    this.addTransferLoaded = !this.addTransferLoaded;
    this.queryparfamsdata = { id: row.id, index };
    // this.router.navigate(['main/maintenance/asset-delivery/management-asset-delivery'], { queryParams: { id: row.id, index } })
  }

 add(){
  this.router.navigate(['/maintenance/asset-delivery/management-asset-delivery']);
}

deleteAssetDelivery(row: any) {
    this.assetDeliveryModel = row;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete Asset Delivery No : ' + row.Id +' ?',
      header: 'Confirm', rejectButtonStyleClass: 'p-button-danger', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteAssetDelivery(row.Id).subscribe((res: any) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({ severity: 'success', summary: 'Successfully', detail: message, life: 3000, });
            this.getAssetDeliveries();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
          }
        });
      },
      reject: (type: any) => {
        switch (type) {
           case ConfirmEventType.REJECT:
           this.messageService.add({ severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
           break;
           case ConfirmEventType.CANCEL:
           this.messageService.add({ severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
           break;
        }
      }
    });

  }

  getAssetDeliveries() {
    this.api.GetAssetDeliveries(this.filter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      this.tableConfig.pageFilter.totalItems = res['data']['totalRows'];
      let tableData: any = [];
      this.deliverylist = res['data'];
      this.cd.detectChanges();
      /* data1['data']?.forEach((e: any) => {
        tableData.push({
          "Id": e.id,
          "Purchase Order No": e.poNumber,
          "Site": e.operatingUnit,
          "Type":e.type,
          "Status":e.status,
          "Complete":e.complete== true? 'Yes' : 'No'
        })
      }) */
      this.tableConfig.tableData = tableData;
     // this.tableConfig.clickableLinks = [{ header: "Id" }, { header: "No" }];
      this.tableConfig.pageFilter.totalRows = data.totalRows;
      //----------------
      if (sucess == true) {
        this.assetDeliveries = data;
        this.totalRows = res.totalRows;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
      }
    });


  }
  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.getAssetDeliveries();
    this.loading = false;
  }

  search(){
    this.getAssetDeliveries();
  }

  reset() {
    this.filter = {};
    this.sites = [];
    this.getAssetDeliveries();
    this.getSites();
  }

  getSites() {
    var sitessb =this.api.getSites().subscribe((res: any) => {
      this.sites = res.getOuListDetails;
    });
    this.unsubscribe.push(sitessb)
  }

  changeSite(event: any){
    if(event.value !=null){
      this.filter.value.operatingUnit = event.value;
    }
  }

  export(){
    this.exporteService
      .export(this.filter, 'AssetDelivery/exportAssetDelivery')
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
        link.download = 'AssetDelivery-Report';
        link.click();
      });
  }

}
