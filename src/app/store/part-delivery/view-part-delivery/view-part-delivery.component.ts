/* import { LookupService } from 'src/app/data/service/lookup.service'; */
import { PartCatalogService } from './../../partcatalog/part-catalog.service';
/* import { CustomerService } from 'src/app/data/service/customer.service'; */
import { partDeliverService } from './../partDelivery.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FilterService, MenuItem } from 'primeng/api';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { PartDeliveryModel } from '../part-delivery.model';
import { forkJoin } from 'rxjs';
import { transactionRouteState } from '../../sparePart/add-transaction/transactionRouteState';
/* import { AssetsService } from 'src/app/data/service/assets.service';
import { Lookup } from 'src/app/data/Enum/lookup';
import { StaticMessages } from 'src/app/shared/helpers/StaticMessages';
import { WorkOrderService } from 'src/app/data/service/work-order.service'; */
import { DatePipe } from '@angular/common';
import * as XLSX from "xlsx";
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { LookupService } from '../../../services/lookup.service';
import { AssetsService } from '../../../services/assets.service';
import { ApiService } from '../../../services/name-definition.service';
import { WorkOrderService } from '../../../services/work-order.service';
import { AssetGroupService } from '../../../services/asset-group.service';
import { Lookup } from '../../../shared/enums/lookup';
/* import { ApiService } from 'src/app/data/service/name-definition.service';
import { AssetGroupService } from 'src/app/data/service/asset-group.service'; */

@Component({
  selector: 'view-part-delivery',
  templateUrl: './view-part-delivery.component.html',
  styleUrls: ['./view-part-delivery.component.css'],
  providers: [MessageService, ConfirmationService, FilterService],
})
export class ViewPartDeliveryComponent implements OnInit {
  partDeliveryModel: PartDeliveryModel = new PartDeliveryModel();
  tableData: PartDeliveryModel[] = [];
  searchForm !: FormGroup;
  customers: [] = [];
  PartsItems: [] = [];
  assets: any[] = [];
  assetNames: any[] = [];
  assetNumbers: any[] = [];
  description:any[]=[];
  PageSize!: number;
  PageNumber!: number;
  totalRows!: number;
  loading!: boolean;

  //filter
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };
  assetId:number = 0;
  //breadcrumb
  items!: MenuItem[];

  //lookups
  statusPermission: any[] = [];
  statusWorkflow: any[] = [];
  selectedParts: any[] = [];
  AssetGroups:any[]=[];
  showmodal: boolean = false;
  searchValue: string = '';
  supplierChecked: boolean = true;
  selectedNames!: any[] | null;
  dataTableLoading: boolean = false;
  addTransferLoaded: boolean = false;
  editTransfersLoaded: boolean = false;
  purchase_order_edit_id: number = 0;
  deposite: any;
  viewTransfersLoaded: boolean = false;


  constructor(
    private api: partDeliverService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private customerService: CustomerService,
    private router: Router,
    private partCatalogService: PartCatalogService,
    private lookupService: LookupService,
    private assetsService: AssetsService,
    private nameDefinitionApi:ApiService,
    private formbuilder: FormBuilder,
    private workOrdersService:WorkOrderService,
    private assetGroupService:AssetGroupService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  openFilterModal() {
    this.showmodal = !this.showmodal;
  }

  openModal() {
    this.partDeliveryModel.id = 0;
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  openEditModal() {
    this.editTransfersLoaded = !this.editTransfersLoaded;
  }

  openViewModal() {
    this.viewTransfersLoaded = !this.viewTransfersLoaded;
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  ngOnInit(): void {
    this.getAssetGroups();

    this.searchForm = this.formbuilder.group({
      title: null,
      customerId: null,
      assetId:null,
      description: null,
      partNo: null,
      assetNDId:null,
      assetGroup:null,
      id:null
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['searchId'])
      {
        this.searchForm.value.id.setValue(params['searchId']);
      }
    });

    forkJoin(
      this.lookupService.getLookUps(Lookup.PartDeliveryStatusOfPermission),
      this.lookupService.getLookUps(Lookup.PartDeliveryWorkFlowApproval)
    ).subscribe((res: any) => {
      this.statusPermission = res[0].data;
      this.statusWorkflow = res[1].data;
      this.search();
    });


    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Part Deliverys List' },
    ];
  }


  siteNumberFilter(event: any) {
    this.filter.pageNumber=1;
    this.customerService.searchCustomer({custName:event.query}).subscribe((res) => {
      const data = res.data;
      console.log("site list", data)
      this.customers = data;
    })
  }
  completePartCatalog(event: any) {
    this.partCatalogService
      .getAutoCompleteByPartName(event.query)
      .subscribe((a) => (this.PartsItems = a));

      var dto = {
        id: 0,
        partNo: event.query,
        partName: '',
        assetId: this.assetId
      }
      this.partCatalogService.GetPartAutoComplete(dto).subscribe((data) => {
        this.PartsItems = data.data;
      });
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

  completeDesc(event: any) {
    this.partCatalogService
      .getAutoComplete({partName:event.query})
      .subscribe((a) => (this.description = a));
  }

  reset() {
    this.filter = {
      title: null,
      customerId: null,
      assetId:null,
      description: null,
      partNo: null,
      assetNDId:null,
      assetGroup:null,
      id:null
    };
    this.searchForm.reset()
    this.search();
  }

  queryData: any;

  navToView(row: any, index: number) {
    this.partDeliveryModel.id = row.id;
    this.viewTransfersLoaded = !this.viewTransfersLoaded;
  }


  navToDetails(row: any, index: number) {
    this.partDeliveryModel.id = row.id;
    this.deposite = '';
    
    this.api.get(row.id).subscribe(resPD => {
      if (resPD.isSuccess) {
        if (resPD.data.parentWOId != null)
        {
          this.workOrdersService.GetPreviousAndNextStepById("PD",resPD.data.id,resPD.data.parentWOId).subscribe(res=>{
            if (res.isSuccess)
            {
              if (res.data.nextId != null)
              {
                if (res.data.previousType=='PO')
                {
                  this.queryData = { data: resPD.data.id, index : 1,poId: res.data.previousId,ParentWOId: resPD.data.parentWOId  };
                  // this.router.navigate(['store/partDelivery/edit-control'], { queryParams: { data: resPD.data.id, index : 1,poId: res.data.previousId,ParentWOId: resPD.data.parentWOId  } });
                }
                else
                {
                  this.queryData = { data: resPD.data.id, index : 1,workOrderId: res.data.previousId,ParentWOId: resPD.data.parentWOId  };
                 // this.router.navigate(['store/partDelivery/edit-control'], { queryParams: { data: resPD.data.id, index : 1,workOrderId: res.data.previousId,ParentWOId: resPD.data.parentWOId  } });
                }
              }
              else
              {
                if (res.data.previousType=='PO')
                {
                  this.queryData = { data:resPD.data.id, index : 1,poId: res.data.previousId,ParentWOId: resPD.data.parentWOId  };
                  //this.router.navigate(['store/partDelivery/edit-control'], { queryParams: { data:resPD.data.id, index : 1,poId: res.data.previousId,ParentWOId: resPD.data.parentWOId  } });
                }
                else
                {
                  this.queryData = { data: resPD.data.id, index : 1,workOrderId: res.data.previousId,ParentWOId: resPD.data.parentWOId  };
                  // this.router.navigate(['store/partDelivery/edit-control'], { queryParams: { data: resPD.data.id, index : 1,workOrderId: res.data.previousId,ParentWOId: resPD.data.parentWOId  } });
                }
              }
            }
          })
        }
        else
        {
          this.queryData = { data: row.id, index };
          /* this.router.navigate(['store/partDelivery/edit-control'], {
            queryParams: { data: row.id, index },
          }); */
        }

        this.addTransferLoaded = !this.addTransferLoaded;
       /*  this.editTransfersLoaded = !this.editTransfersLoaded; */
      }
    });

  }

  search() {
    this.filter.assetGroup = this.searchForm.value.assetGroup;
    this.filter.id= this.searchForm.value.id;
    this.filter.pageNumber=1;
    let filterCopy = { ...this.filter };

  //  if (filterCopy.partNo != null) filterCopy.partNo = filterCopy.partNo.id;

    this.api.search(filterCopy).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.tableData = data;
        this.totalRows = res.totalRows;
        this.cdr.detectChanges();
      } else {
        this.showErrorMessage(message);
      }
    });
  }

  private showErrorMessage(message: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    });
  }

  paginate(event: any) {
    /* debugger; */
    console.log('paginate event', event);
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.search(this.filter).subscribe((res) => {
        const data = res.data;
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.tableData = data;
          this.totalRows = res.totalRows;
        } else {
          this.showErrorMessage(message);
        }
      });
    }, 500);
  //  this.search();
  }


  delete(row: any) {
       this.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.delete(row.id).subscribe((res) => {
          this.apiResponse(res);
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
  apiResponse(res: any) {
   /*  debugger */
    if (res.isSuccess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: res.message,
        life: 3000,
      });
      this.search();
    }
    else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: res.message,
        life: 3000,
      });
    }
  }

  /* deposite:boolean = false; */
  navToDeposite(isDeposite: boolean = false) {
    if (this.selectedParts.length == 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No Parts Selected',
        life: 3000,
      });
      return;
    }
    this.deposite = isDeposite;
    this.partDeliveryModel.id = 0; 
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  /* navToDeposite(isDeposite: boolean = false) {
    if (this.selectedParts.length == 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No Parts Selected',
        life: 3000,
      });
      return;
    }
    let url = isDeposite
      ? 'store/spare-part-transaction/add-control/deposit'
      : 'store/spare-part-transaction/add-control/Withdrawal';
    this.router.navigate([url], {
      state: <transactionRouteState>{
        preDefinedModels: this.selectedParts,
      },
    });
  } */
  select(event: any, item: any) {
    const idx = this.selectedParts.findIndex((a) => a == item);
    if (idx == -1) this.selectedParts.push(<any>item);
    else this.selectedParts.splice(idx, 1);
  }
  isSelected(item: any) {
    return this.selectedParts.findIndex((c) => c == item) > -1;
  }

  completeAssetService(event: any) {
    this.assetsService
      .GetAssetsAutoComplete(event.query)
      .subscribe((a) => (this.assets = a.data));
  }

  completeAssetNameService(event: any) {
    this.nameDefinitionApi
      .searchNameDefinition(<any>{assetName:event.query})
      .subscribe((res) => {
        const data = res.data;
        console.log('asset name list', data);
        this.assetNames = data
      });
  }
  completeAssetNumberService(event: any) {
    this.assetsService
      .GetAssetsAutoCompleteMultiFilter(<any>{assetNumber:event.query})
      .subscribe((res) => {
        const data = res.data;
        console.log('asset number list', data);
        this.assetNumbers = data
      });

  }

  onSelectAsset(asset: any) {
    this.filter.assetId = asset.id;
  }



  exportToExcel() {
    let filterCopy = { ...this.filter };
    if (filterCopy.customerId != null)
      filterCopy.customerId = filterCopy.customerId.id;

    if (filterCopy.partNo != null) filterCopy.partNo = filterCopy.partNo.id;

    filterCopy.pageSize = 2147483646;
    this.api.search(filterCopy).subscribe((res) => {
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
            "Call Id": c.callId,
            "Site": c.customerName,
            "Asset Number": c.assetNumber,
            "Asset S.N": c.assetSN,
            "Part No": c.partNo,
            "Part Desc": c.partDesc,
            "Date": datePipe.transform(c.date, 'yyyy-MM-dd'),
            "Status Of Permission": c.statusPermission,
            "Status WorkFlow Approval": c.statusWorkflow
          }
        });
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data ?? []);
        ws["!cols"] = [{ wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 50 }, { wch: 50 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }]
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Exported');
        XLSX.writeFile(wb, `exported Reports ${time}.xlsx`);
      } else {
        this.showErrorMessage(message);
      }
    });
  }
  getAssetGroups(){
    this.assetGroupService.searchAssetGroups({  }).subscribe((res: any) => {
      this.AssetGroups = res.data
    })

  }
}
