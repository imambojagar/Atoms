import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, FilterService, MenuItem, MessageService } from 'primeng/api';
import { QuotationModel } from '../../../models/quotation-model';
import { CustomerService } from '../../../services/customer.service';
import { QuotationService } from '../../../services/quotaion.service';
import { AssetsService } from '../../../services/assets.service';
import { WorkOrderService } from '../../../services/work-order.service';
import { AssetGroupService } from '../../../services/asset-group.service';
import { PartCatalogService } from '../../../store/partcatalog/part-catalog.service';
import { ExportService } from '../../../shared/services/export.service';
import { SharedTable } from '../../../shared/components/table/table';
/* import { QuotationModel } from 'src/app/data/models/quotation-model';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';
import { AssetsService } from 'src/app/data/service/assets.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { QuotationService } from 'src/app/data/service/quotaion.service';
import { WorkOrderService } from 'src/app/data/service/work-order.service';
import { PartCatalogService } from 'src/app/modules/store/partcatalog/part-catalog.service';
import { SharedTable } from 'src/app/shared/component/table/table';
import { ExportService } from 'src/app/shared/service/export.service'; */


@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss'],providers:[DatePipe]
})
export class QuotationListComponent {
  addPpmForm !: FormGroup;

  searchForm!:FormGroup;

  cer !: FormGroup;
  assets !: FormGroup;
  attachments !: FormGroup;
  quotationModel: QuotationModel = new QuotationModel();
  tableData: QuotationModel[] = [];
  quotations: [] = [];
  key!: any;
  disabled: boolean = true;
  items!: MenuItem[];
  assigned: [] = [];
  TypeService: [] = [];
  callList:[]=[];
  serialList:[]=[];
  assetNumberList:[]=[];
  siteList:[]=[];
  totalRows!: number;
  loading!: boolean;
  fromFlag:boolean=false;
  toFlag:boolean=false;

  tableConfig = new SharedTable();
  pageSize: number = 10;
  pageIndex: number = 1;
  //filter
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
    callNo:null,
    quotationNo : null,
    workOrderNo:null,
    assetSerialNo : null,
    assetGroup : null,
    partId : null
  };
  assetGroupsList:any[]=[];
  sparePartAutoComplete: [] = [];


  showmodal: boolean=false;
  showmodal1: boolean=false;
  showmodal2: boolean=false;
  selected_CallId: any = null;
  quotationlist: any[]=[];
  selectedNames!: any[] | null;
  addTransferLoaded: boolean = false;
  viewQuotationTransferLoaded: boolean = false;
  service_request_edit_id: number = 0;
  searchValue: string ='';


  constructor(
    private siteApi:CustomerService,
    private formbuilder: FormBuilder,
    private api: QuotationService,
    private assetApi: AssetsService,
    private messageService: MessageService,
     private confirmationService: ConfirmationService,
     private router: Router,
     private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private workOrdersService: WorkOrderService,
    private assetGroupService:AssetGroupService,
    private partCatalogService: PartCatalogService,
    private exporteService:ExportService) { }


      close_modal() {
        this.showmodal = !this.showmodal;
      }

      openFilterModal() {
        this.showmodal = !this.showmodal;
      }

      openModal() {
        this.addTransferLoaded = !this.addTransferLoaded
      }

      openViewModal() {
        this.viewQuotationTransferLoaded = !this.viewQuotationTransferLoaded;
      }

      clearValue(event: any) {
        event.target.value = '';
      }



  ngOnInit(): void {
    this.searchForm = this.formbuilder.group({
      quotationNo: [null],
      workOrderNo: [null],
      callNo: [null],
      assetSN: [null],
      partNo: [null]
    })


    this.tableConfig.tableHeaders = [
      "No",
      "Quotation No",
      "Work Order",
      "Date",
      "Total",
      "Action"
    ];
    this.tableConfig.deleteRow = false;
    this.tableConfig.editRow = true;
    this.tableConfig.addRow = false;
    this.tableConfig.viewRow = true;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.tableName = "Quotations"
    this.tableConfig.clickableLinks = [{ header: "No" }, { header: "Operation" }]
    this.search();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Quotations' },
    ];

     this.getQuotations();
     this.searchAssetGroup();
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.quotationlist = this.quotationlist.filter((row: any) =>
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


  editQuotaion(e: any) {
    this.api.getQuotation(e).subscribe(resQuo => {
      if (resQuo.isSuccess) {
        this.workOrdersService.GetPreviousAndNextStepById("Q",resQuo.data.id,resQuo.data.parentWOId).subscribe(res=>{
          if (res.isSuccess)
          {
            if (res.data.nextId != null)
            {
              this.router.navigate(['/maintenance/quotations/view-control'], { queryParams: { id:resQuo.data.id, workerorderId: resQuo.data.workerorderId,ParentWOId: resQuo.data.parentWOId } });
            }
            else
            {
                this.router.navigate(['/maintenance/quotations/edit-control'], { queryParams: { id:resQuo.data.id, workerorderId: resQuo.data.workerorderId,ParentWOId: resQuo.data.parentWOId } });
            }
          }
        })
      }
    })
  }
  veiwQuotaion(e: any) {
    this.api.getQuotation(e.rowData.Id).subscribe(resQuo => {
      if (resQuo.isSuccess) {
        this.router.navigate(['/maintenance/quotations/view-control'], { queryParams: { id:resQuo.data.id, workerorderId: resQuo.data.workerorderId,ParentWOId: resQuo.data.parentWOId } });
      }
    })
  }

  route(e: any) {
    if (e.header == "No")
    {
      this.api.getQuotation(e.rowData.Id).subscribe(resQuo => {
        if (resQuo.isSuccess) {
          this.router.navigate(['/maintenance/quotations/view-control'], { queryParams: { id:resQuo.data.id, workerorderId: resQuo.data.workerorderId,ParentWOId: resQuo.data.parentWOId } });
        }
      })
    }


  }

  querydata: any;
  navToDetails(row: any, index: number) {
    this.quotationModel.id = row.id;
    this.service_request_edit_id  =  row.id;
    console.log("edit asset", row.id);
    this.querydata = { id: row.id, index };
    this.addTransferLoaded = !this.addTransferLoaded;
    
    /* this.router.navigate(['main/maintenance/quotations/edit-control'], { queryParams: { id: row.id, index } }) */
  }

  navToView(row: any, index: number) {
    this.quotationModel.id = row.id;
    this.service_request_edit_id  =  row.id;
    console.log("edit asset", row.id);
    this.querydata = { id: row.id, index };
    this.viewQuotationTransferLoaded = !this.viewQuotationTransferLoaded;
    
    /* this.router.navigate(['main/maintenance/quotations/edit-control'], { queryParams: { id: row.id, index } }) */
  }

  navToPO(row: any, index: number) {
    this.quotationModel.id = row.id;
    this.service_request_edit_id  =  row.id;
    console.log("edit asset", row.id);
    this.querydata =  { quotationId: row.id, index };
    this.addTransferLoaded = !this.addTransferLoaded;
    /* this.router.navigate(['main/maintenance/purchase-order/add-control'], { queryParams: { quotationId: row.id, index } }) */
  }

  deleteQuotaion(row: any) {
    this.quotationModel = row;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete Quotation No : ' + row.Id + ' ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteQuotation(row.Id).subscribe(res => {
          console.log("delete res", res)
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successfully',
              detail: message,
              life: 3000,
            });
            this.getQuotations();
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

  getQuotations() {

    this.filter.partId = this.filter.partId;
    this.api.getQuotations(this.filter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      //----------------
      const data1 = res;
      this.tableConfig.pageFilter.totalItems = data1['totalRows'];
      let tableData: any = [];
      data1['data']?.forEach((e: any) => {
        tableData.push({
          "Id": e.id,
          "No": e.quotationNo,
          "QuotationNo": e.quotationNoManual,
          "WorkOrder":e.workOrderNo,
          "Date":e.quotationDate== null? '' : this.datePipe.transform(e.quotationDate, 'yyyy-MM-dd'),
          "Total":e.total
        })

      });

      this.quotationlist = tableData;
      this.tableConfig.tableData = tableData;
     // this.tableConfig.clickableLinks = [{ header: "Id" }, { header: "No" }];
      this.tableConfig.pageFilter.totalRows = data.totalRows;
      //----------------
      if (sucess == true) {
        this.quotations = data;
        this.totalRows = res.totalRows;
        this.cdr.detectChanges();
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
    this.filter.pageNumber = event;
    this.getQuotations();
    this.loading = false;
  }
  search(){
    this.getQuotations();
  }

  reset() {
    // this.filter = {};

    // this.searchForm.controls['quotationNo'].setValue("");
    // this.searchForm.controls['workOrderNo'].setValue("");
    // this.searchForm.controls['callNo'].setValue("");
    // this.searchForm.controls['assetSN'].setValue("");
    // this.searchForm.controls['partNo'].setValue("");


    this.filter.quotationNo = "";
    this.filter.workOrderNo = "";
    this.filter.callNo = "";
    this.filter.assetSN = "";
    this.filter.partId = "";


    this.searchForm.reset();
    this.filter.pageNumber = 1;
    this.getQuotations();
  }

  // #region Filter
    QuotationRequestFilter(id: any) {
    this.filter.pageNumber=1;
    this.api.getQuotation(<any>{CallId:id}).subscribe((res) => {
      const data = res.data;
      this.callList = data;
    });
  }

    SerialNumberFilter(event: any){
    this.filter.pageNumber=1;
    this.assetApi.GetAssetsAutoComplete(event.query).subscribe((res) => {
      this.serialList =res.data;
    });
}

    SiteNumberFilter(number: any) {
  this.filter.pageNumber = 1;
  this.siteApi.searchCustomer({siteId:number}).subscribe((res) => {
    const data = res.data;
    console.log("asset serial list", data)
    this.siteList = data;
  })
}

searchAssetGroup() {
  this.assetGroupService
  .searchAssetGroups({  })
  .subscribe((res) => (this.assetGroupsList = res.data));
}
  //  getAssignedTo() {
  // this.api.getLookups(<any>{ queryParams: 33 }).subscribe(res => {
  //   this.assigned = res.data;
  // })
  //  }
// #endregion

onSelectSparePart(event: any) {
  var dto = {
    id: 0,
    partNo: event.query,
    partName: '',
    AssetId: null
  }

  this.partCatalogService.GetPartAutoComplete(dto).subscribe((data: any) => {
    this.sparePartAutoComplete = data.data;
  });
}

bindSparePart(event: any) {
  this.filter.partId = event.id
}


ExportQuotations() {
  console.log('this.filter', this.filter);

   this.exporteService
    .export(this.filter, 'Quotation/exportQuotation')
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
      link.download = 'Quotation-Report';
      link.click();
    });
}


}
