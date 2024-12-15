import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FilterService, MenuItem } from 'primeng/api';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { Router } from '@angular/router';
import { SparePartTransactionModel } from '../transaction-model';
import { sparePartTransaction } from '../sparePartTransaction.service';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { CustomerService } from 'src/app/data/service/customer.service';
import { SupplierService } from 'src/app/data/service/supplier.service';
import { StaticMessages } from 'src/app/shared/helpers/StaticMessages'; */
import { DatePipe } from '@angular/common';
import * as XLSX from "xlsx";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../services/name-definition.service';
import { CustomerService } from '../../../services/customer.service';
import { SupplierService } from '../../../services/supplier.service';
import { AssetsService } from '../../../services/assets.service';
import { AssetGroupService } from '../../../services/asset-group.service';
import { Lookup } from '../../../shared/enums/lookup';
import { StaticMessages } from '../../../shared/helpers/StaticMessages';
/* import { AssetsService } from 'src/app/data/service/assets.service';
import { ApiService } from 'src/app/data/service/name-definition.service';
import { AssetGroupService } from 'src/app/data/service/asset-group.service'; */

@Component({
  selector: 'view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.css'],
  providers: [MessageService, ConfirmationService, FilterService],
})
export class ViewTransactionComponent implements OnInit {
  names: SparePartTransactionModel[] = [];
  searchForm !: FormGroup;

  titleList: [] = [];
  transactionStatusList: [] = [];
  suppliers: [] = [];
  customers: [] = [];
  titles:[]=[];
  assets:any[]=[];
  assetNumbers:any[]=[];
  assetNames: any[] = [];

  totalRows!: number;
  disabled: boolean = true;
  loading!: boolean;
  showmodal: boolean = false;
  searchValue: string = '';


  filter: any = {
    pageSize: 10,
    pageNumber: 1,

  };

  items!: MenuItem[];
  AssetGroups:any[]=[];
  partTransactionModel: number = 0;
  addTransferLoaded: boolean = false;
  deposite: any;

  constructor(private apiServiceNameDefinition:ApiService,
    private api: sparePartTransaction,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private customerService: CustomerService,
    private supplierService: SupplierService,
    private formbuilder: FormBuilder,
    private nameDefinitionApi:ApiService,
    private assetsService: AssetsService,
    private assetGroupService:AssetGroupService,
    private cdr : ChangeDetectorRef
  ) {}

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  openFilterModal() {
    this.showmodal = true;
  }

  openModal() {
    this.partTransactionModel = 0;
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  ngOnInit(): void {
    this.getAssetGroups();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Transaction List' },
    ];
    this.getAndBindLookup(
      Lookup.SparePartTransactionStatus,
      (a) => (this.transactionStatusList = a)
    );


    this.searchForm = this.formbuilder.group({
      title:null,
      transactionType: null,
      supplierId: null,
      customerId: null,
      assetId:null,
      assetNDId:null,
      assetGroup:null
    });
    this.filterTransactions();
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.names = this.names.filter((row: any) =>
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
    this.filterTransactions()
    this.cdr.detectChanges();
  }

  getAndBindLookup(lookup: Lookup, targetProp: (a: any) => void) {
    this.api
      .getLookups({ queryParams: lookup })
      .subscribe((res) => targetProp(res.data));
  }

  getStatusById(id: number): string {

    return this.transactionStatusList && this.transactionStatusList.length > 0
      ? <string>(
          (<any>this.transactionStatusList.find((a: any) => a.id == id)!).name
        )
      : '';
  }
  getCustomers($event: any) {
    this.customerService
      .GetCustomersAutoComplete($event.query)
      .subscribe((a) => (this.customers = a.data));
  }

  getSupplier($event: any) {
    this.supplierService
      .getAutoComplete({ supplierName: $event.query })
      .subscribe((a) => {
        this.suppliers = a;
      });
  }
getTitle(event:any){
  this.api.search({title:event.query}).subscribe(res=>{
    const data=res.data;
    this.titles=data;
  })
}

completeAssetService(event: any) {
  this.assetsService
    .GetAssetsAutoComplete(event.query)
    .subscribe((a) => (this.assets = a.data));
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
completeAssetNameService(event: any) {
  this.nameDefinitionApi
    .searchNameDefinition(<any>{assetName:event.query})
    .subscribe((res) => {
      const data = res.data;
      console.log('asset name list', data);
      this.assetNames = data
    });

}
  onSelectSupplier($event: any) {
    this.filter.supplierId = $event.id;
  }
  onSelectCustomer($event: any) {
    this.filter.customerId = $event.id;
  }

  navToDetails(row: any, status: any, index: number) {
 /* debugger; */
    this.partTransactionModel = row.id;
    this.addTransferLoaded = !this.addTransferLoaded;
    this.deposite = status;
    /* this.router.navigate(['store/spare-part-transaction/edit-control'], {
      queryParams: { id: row.id, deposite: status },
    }); */
  }

  filterTransactions() {
    /* debugger; */
   // this.loading = true;
    this.filter.assetGroup = this.searchForm.value.assetGroup;
    this.api.search(this.filter).subscribe((res: any) => {
     // this.loading = false;
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.names = data;
        this.totalRows = res.totalRows;
        this.cdr.detectChanges();
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

  reset() {
    this.filter = {};
    this.searchForm.reset();
    this.filterTransactions();
  }

  paginate(event: any) {
    this.filter.pageNumber = event.page + 1;
    this.filterTransactions();
  }

  delete(row: any) {
    StaticMessages.OnDelete(
      row.id,
      this.confirmationService,
      this.messageService,
      () => {
        this.api.delete(row.id).subscribe((x) => this.filterTransactions());
      }
    );
  }

  deleteRowdata(row: any) {
    StaticMessages.OnDelete(
      row.id,
      this.confirmationService,
      this.messageService,
      () => {
        this.api.delete(row.id).subscribe((x) => this.filterTransactions());
      }
    );
  }

  exportToExcel() {
    let filterCopy = { ...this.filter };
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
            "Title": c.title,
            "Transaction Status": this.getStatusById(c.statusId),
            "Supplier Name": c.supplierName,
            "customer Name": c.customerName,
            "Asset Name": c.assetName,
            "Asset Number": c.assetNumber,
            "Asset S.N": c.assetSN,
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

  completeAssetName(event: any) {
    this.apiServiceNameDefinition.searchNameDefinition(<any>{ assetname: event.query }).subscribe((res) => {
      this.assetNames = res.data;
    })
  }
  selectAssetName(event:any) {
    /* debugger */
    this.filter.assetName = event.assetname;
  }

  clearAssetName() {
    this.filter.assetName = "";
  }
  getAssetGroups(){
    this.assetGroupService.searchAssetGroups({  }).subscribe((res: any) => {
      this.AssetGroups = res.data
    })

  }
}
