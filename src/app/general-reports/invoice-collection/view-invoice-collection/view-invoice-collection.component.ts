import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, Message, MessageService } from 'primeng/api';
/* import { InvoiceCollectionModel } from 'src/app/data/models/invoice-collection-model';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';
import { AssetsService } from 'src/app/data/service/assets.service';
import { AuthService } from 'src/app/data/service/auth.service';
import { InvoiceService } from 'src/app/data/service/invoice.service'; */

import { asset, InvoiceCollectionModel } from '../../../models/invoice-collection-model';
import { InvoiceService } from '../../../services/invoice.service';
import { AuthService } from '../../../services/auth.service';
import { AssetsService } from '../../../services/assets.service';
import { AssetGroupService } from '../../../services/asset-group.service';

@Component({
  selector: 'app-view-invoice-collection',
  templateUrl: './view-invoice-collection.component.html',
  styleUrls: ['./view-invoice-collection.component.scss'],
})
export class ViewInvoiceCollectionComponent {
  invoiceCollectionModel: InvoiceCollectionModel = new InvoiceCollectionModel();
  invoices: InvoiceCollectionModel[] = [];

  PageSize!: number;
  PageNumber!: number;
  totalRows: number = 0;

  assetNameList: [] = [];
  siteList: [] = [];
  modelList: [] = [];
  invoicePaidList: [] = [];

  loading: boolean = false;
  first: number = 0;
  pageNumber: number = 1;
  //search filter
  filter: any = { pageSize: 10, pageNumber: 1 };
  filterForPagination: any = { pageSize: 10, pageNumber: 1 };

  msgs!: Message[];
  //breadcrumb
  items!: MenuItem[];
  months: any[] = []; 
  editPartCatalogLoaded: boolean = false;
  partIndex: number = 0;

  invoicePaid = [
    { name: 'Yes', id: true },
    { name: 'No', id: false },
  ];

  invoiceSearchForm!: FormGroup;

  exDate: any;
  actualDate: any;
  AssetGroups:any[]=[];
  showmodal: boolean = false;
  searchValue: string = '';
  supplierChecked: boolean = true;
  selectedNames!: any[] | null;
  dataTableLoading: boolean = false;
  addTransferLoaded: boolean = false;
  purchase_order_edit_id: number = 0;


  constructor(
   /*  private authService: AuthService, */
    private api: InvoiceService,
    /* private messageService: MessageService, */
    private cdr: ChangeDetectorRef,
    private apiAsset: AssetsService,
    private fb: FormBuilder,
    private assetGroupService:AssetGroupService
  ) {}

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  openFilterModal() {
    this.showmodal = !this.showmodal;
  }

  openModal() {
    this.addTransferLoaded = !this.addTransferLoaded
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.invoices = this.invoices.filter((row: any) =>
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

  ngOnInit(): void {
    this.getAssetGroups();
    this.invoiceSearchForm = this.fb.group({
      assetNo: [],
      site: [],
      invNo: [],
      isPaid: [],
      mCNo: [],
      fromD: [],
      toD: [],
      assetGroup:[]
    });
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Invoice collection' },
    ];
    this.Reset();
  }

  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      invoiceNumber: null,
      assetName: null,
      site: null,
      isPaid: null,
      contractNumber: null,
      fromDate: null,
      toDate: null,
      assetGroup:null
    };
    this.invoiceSearchForm.reset();
    this.Search();
  }

  Search() {
    console.log(this.filter);
    this.loading = true;
    this.filter.assetGroup = this.invoiceSearchForm.value.assetGroup;
    let searchFilter = { ...this.filter };
    searchFilter.pageNumber = 1;
    this.api.getAllInvoices(searchFilter).subscribe((res) => {
      this.invoices = res.data;
      this.totalRows = res.totalRows;
      this.loading = false;
      console.log(this.invoices);
    });
  }

  Date(d: any) {
    if (!d) {
    } else {
      d = new Date(d).toDateString();
      return d;
    }
  }

  assetNameFilter(name: any) {
    this.filter.assetName = name;
    this.filter.pageNumber = 1;
    this.apiAsset
      .GetAssetsAutoCompleteMultiFilter({ assetNumber: name })
      .subscribe((res) => {
        const data = res.data;
        this.assetNameList = data;
      });
  }
  siteFilter(e: any) {
    this.api.searchSites(e.query).subscribe((res) => {
      const data = res.data;
      this.siteList = data;
    });
  }

  onSelectSite(e: any) {
    this.filter.site = e.custName;
  }
  onChangefromDate(e: any) {
    let date = new Date(e);
    this.filter.fromDate = new Date(
      date.setDate(date.getDate() + 1)
    ).toISOString();
  }
  onChangeToDate(e: any) {
    let date = new Date(e);
    this.filter.toDate = new Date(
      date.setDate(date.getDate() + 1)
    ).toISOString();
  }

  navToDetails(row: any, index: number) {
    this.invoiceCollectionModel.id = row.id;
    this.editPartCatalogLoaded = !this.editPartCatalogLoaded;
    this.partIndex = index;
    /* this.router.navigate(['general-reports/invoice-collection/edit-control'], {
      queryParams: { data: row.id, index },
    }); */
  }

  onChangeInvNo(e: any) {
    this.filter.invoiceNumber = e.value;
  }
  onChangeInvPaied(e: any) {
    this.filter.isPaid = e.value;
  }
  event(e: any) {
    console.log('eee', e);
  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.Search();
    this.loading = false;
  }
  getLookups() {
    Array(12)
      .fill(0)
      .map((x, i) => {
        this.months.push({ label: `${i + 1} Month`, value: i + 1 });
      });
    this.months.unshift({ label: 'None', value: null });
  }
  getAssetGroups(){
    this.assetGroupService.searchAssetGroups({  }).subscribe((res: any) => {
      this.AssetGroups = res.data
    })

  }
}
