import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, Message, MessageService, SelectItem } from 'primeng/api';
import { PurchaseOrderModel } from '../../../models/purchaseorder-model';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { WorkOrderService } from '../../../services/work-order.service';
import { AssetGroupService } from '../../../services/asset-group.service';
import { ExportService } from '../../../shared/services/export.service';
/* import { PurchaseOrderModel } from 'src/app/data/models/purchaseorder-model';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';
import { PurchaseOrderService } from 'src/app/data/service/purchase-order.service';
import { WorkOrderService } from 'src/app/data/service/work-order.service';
import { ExportService } from 'src/app/shared/service/export.service'; */

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss']
})
export class PurchaseOrderListComponent {
  userDialog!: boolean;
  linkDialog: boolean = false;
  msgs!: Message[];

  searchForm!: FormGroup

  addpurchaseOrderForm!: FormGroup;
  purchaseOrderModel: PurchaseOrderModel = new PurchaseOrderModel();
  tableData: PurchaseOrderModel[] = [];
  partNumberList: [] = [];
  partNameList: [] = [];
  oracleCodeList: [] = [];
  assetModelList: [] = [];
  clientPartList: [] = [];
  onReserveList: [] = [];
  currencyList: [] = [];
  classList: [] = [];
  siteList: [] = [];
  supplierList: [] = [];

  PageSize!: number;
  PageNumber!: number;
  totalRows!: number;
  key!: any;
  disabled: boolean = true;
  loading!:boolean;
  first:number=0;

  //filter

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
    quotationNo : null,
    callNo: null,
    assetSerialNo: null,
    purchaseOrderNo: null,
    purchaseOrderDate: null,
    assetGroup: null,
    };

  //Dropdown Lists
  businessOptions: [] = [];
  riskOptions: [] = [];
  classOptions: [] = [];
  categoriesOptions: [] = [];
  modilityOptions: [] = [];
  subModilityOptions: [] = [];
  functionOptions: [] = [];
  typeAssetOptions: [] = [];
  lifeSpanOptions: SelectItem[] = [];
  complexOptions: SelectItem[] = [];
  assetGroupsList:any[]=[];

  submitted!: boolean;
  //breadcrumb
  items!: MenuItem[];

  //checkboxes
  pageChecked: boolean = true;
  pageNumberChecked: boolean = true;
  partNumberChecked: boolean = true;
  partNameChecked: boolean = true;
  oracleChecked: boolean = true;
  assetModelChecked: boolean = true;
  clientPartChecked: boolean = true;
  onReserveChecked: boolean = true;
  currencyChecked: boolean = true;
  classChecked: boolean = true;
  siteChecked: boolean = true;
  showmodal: boolean = false;
  supplierChecked: boolean = true;
  selectedNames!: any[] | null;
  perchaseOrder: any[] = [];
  dataTableLoading: boolean = false;
  addTransferLoaded: boolean = false;
  viewPurchaseTransferLoaded: boolean = false;
  purchase_order_edit_id: number = 0;
  edit_index: number = 0;
  queryData: any = [];
  searchValue: any;

  constructor(
    private formbuilder: FormBuilder,
    private api: PurchaseOrderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private workOrdersService:WorkOrderService,
    private assetGroupService:AssetGroupService,
    private exporteService:ExportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.searchForm = this.formbuilder.group({
      purchaseOrderNo: [null],
      quotationNo: [null],
      callNo: [null],
      assetSerialNo: [null]
    })


    this.search();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      {label: 'Purchase Orders'},
    ];
    this.searchAssetGroup();
  }

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  openFilterModal() {
    this.showmodal = !this.showmodal;
  }

  openModal() {
    this.purchase_order_edit_id = 0;
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  openViewModal() {
    this.viewPurchaseTransferLoaded = !this.viewPurchaseTransferLoaded;
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  reset() {
    // this.filter = {};

    this.searchForm.controls['purchaseOrderNo'].setValue("");
    this.searchForm.controls['quotationNo'].setValue("");
    this.searchForm.controls['callNo'].setValue("");
    this.searchForm.controls['assetSerialNo'].setValue("");

    this.search();
  }

  search() {
    this.api.searchPurcahseOrder(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.tableData = data;
      this.perchaseOrder = data;
      this.cdr.detectChanges();
    });
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.perchaseOrder = this.perchaseOrder.filter((row: any) =>
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

  navToDetails(row: any, index: number) {
    console.log("row", row);
    this.purchaseOrderModel.id = row.id;
    this.purchase_order_edit_id = row.id;
    this.edit_index =  index;
    this.api.getPurcahseOrder(row.id).subscribe(resPO => {
      if (resPO.isSuccess) {
        let transactionType:string="PO"
        if (resPO.data.isPR==true) {
          transactionType="PR"
        }  else  {
          transactionType="PO"
        }

        this.workOrdersService.GetPreviousAndNextStepById(transactionType,resPO.data.id,resPO.data.parentWOId).subscribe(res=>{
          if (res.isSuccess) {

            if (res.data.nextId != null) {
              this.queryData =  { id:resPO.data.id, quotationId: resPO.data.quotationId,ParentWOId: resPO.data.parentWOId ,isPR:transactionType};
              // this.router.navigate(['/maintenance/purchase-order/view-control'], { queryParams: { id:resPO.data.id, quotationId: resPO.data.quotationId,ParentWOId: resPO.data.parentWOId ,isPR:transactionType} });
            } else {
              this.queryData =  { id:resPO.data.id, quotationId: resPO.data.quotationId,ParentWOId: resPO.data.parentWOId,isPR:transactionType };
              //  this.router.navigate(['/maintenance/purchase-order/edit-control'], { queryParams: { id:resPO.data.id, quotationId: resPO.data.quotationId,ParentWOId: resPO.data.parentWOId,isPR:transactionType } });
            }

            this.addTransferLoaded = !this.addTransferLoaded;
          }
        });
      }
    });

  }

  navToView(row: any, index: number) {
    console.log("row", row);
    this.purchaseOrderModel.id = row.id;
    this.purchase_order_edit_id = row.id;
    this.edit_index =  index;
    this.api.getPurcahseOrder(row.id).subscribe(resPO => {
      if (resPO.isSuccess) {
        let transactionType:string="PO"
        if (resPO.data.isPR==true) {
          transactionType="PR"
        }  else  {
          transactionType="PO"
        }

        this.workOrdersService.GetPreviousAndNextStepById(transactionType,resPO.data.id,resPO.data.parentWOId).subscribe(res=>{
          if (res.isSuccess) {


            if (res.data.nextId != null) {
              this.queryData =  { id:resPO.data.id, quotationId: resPO.data.quotationId,ParentWOId: resPO.data.parentWOId ,isPR:transactionType};
              // this.router.navigate(['/maintenance/purchase-order/view-control'], { queryParams: { id:resPO.data.id, quotationId: resPO.data.quotationId,ParentWOId: resPO.data.parentWOId ,isPR:transactionType} });
            } else {
              this.queryData =  { id:resPO.data.id, quotationId: resPO.data.quotationId,ParentWOId: resPO.data.parentWOId,isPR:transactionType };
              //  this.router.navigate(['/maintenance/purchase-order/edit-control'], { queryParams: { id:resPO.data.id, quotationId: resPO.data.quotationId,ParentWOId: resPO.data.parentWOId,isPR:transactionType } });
            }

            this.viewPurchaseTransferLoaded = !this.viewPurchaseTransferLoaded;
          }
        });
      }
    });

  }

  paginate(event:any){
    this.loading = true;
    this.filter.pageNumber=event.page+1;
    this.search();
    this.loading = false;
  }

  deletePurchaseOrder(row: any) {
    this.purchaseOrderModel.id = row.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete Purchase Order No : ' + row.purchaseOrderNo + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deletePurcahseOrder(row.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.search();
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

  changeCol(event: any, index: any) {
    var col = document.getElementsByClassName(index);
    if (event.checked) {
      for (let i = 0; i < col.length; i++) col[i].classList.remove('colList');
    } else {
      for (let i = 0; i < col.length; i++) col[i].classList.add('colList');
    }
  }

  searchAssetGroup() {
    this.assetGroupService
    .searchAssetGroups({  })
    .subscribe((res) => (this.assetGroupsList = res.data));
  }


  export() {
     this.exporteService
      .export(this.filter, 'PurchaseOrder/exportPurchaseOrder')
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
        link.download = 'PurchaseOrder-Report';
        link.click();
      });

  }
}
