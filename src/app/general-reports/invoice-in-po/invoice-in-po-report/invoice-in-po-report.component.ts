import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SharedTable } from '../../../shared/components/table/table';
import { InvoicePO } from '../../../models/invoice-po';
import { CallRequestService } from '../../../services/call-request.service';
import { InvoicepoService } from '../../../services/invoicepo.service';
import { AssetsService } from '../../../services/assets.service';
import { EmployeeService } from '../../../services/employee.service';
import { CustomerService } from '../../../services/customer.service';
import { LookupService } from '../../../services/lookup.service';
import { Lookup } from '../../../shared/enums/lookup';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { GasRefill } from 'src/app/data/models/gas-refill';
import { InvoicePO } from 'src/app/data/models/invoice-po';
import { AssetsService } from 'src/app/data/service/assets.service';
import { CallRequestService } from 'src/app/data/service/call-request.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { GasRefillService } from 'src/app/data/service/gas-refill.service';
import { InvoicepoService } from 'src/app/data/service/invoicepo.service';
import { LookupService } from 'src/app/data/service/lookup.service';
import { SharedTable } from 'src/app/shared/component/table/table';
import { AssetFormService } from '../../../systemsettings/assets/asset-form.service'; */

@Component({
  selector: 'app-invoice-in-po-report',
  templateUrl: './invoice-in-po-report.component.html',
  styleUrls: ['./invoice-in-po-report.component.scss']
})
export class InvoiceInPoReportComponent {
  tableConfig = new SharedTable();
  searchForm!: FormGroup;
  invoiceSearchForm!: FormGroup;

  searchFilter =new InvoicePO()
  assginedEmployees: any[] = [];
  selectedAssginedEmployees: any[] = [];
  items!: MenuItem[];
  Sites: any[] = [];
  callId:any[]=[];
  Asset_SNs: any[] = [];
  Operator_Dates: any[] = []
  Invoicepaid: any[] = []
  poNumbers: any[] = []
  invoicenos: any[] = []
  constructor(private fb: FormBuilder,
    public callRequestService: CallRequestService,
       public invoicepoService: InvoicepoService,
       private assetService: AssetsService,
    public employeeService: EmployeeService,
    private customerService: CustomerService,
    private lookupService: LookupService,
    private router: Router) { }
  ngOnInit(): void {
    this.items = [
      { label: 'Home', routerLink: ['/'] }
    ];
    this.searchForm = this.fb.group({
      assetNumber: [null],
      call: [null],
      site: [null],
      invoicePaid: [null],
      poNumber: [null],
      invoiceIssueDateOperator: [null],
      invoiceIssuekDateFrom: [null],
      invoiceIssuekDateTo: [null],
      invoiceNo: [null]
    })

    this.tableConfig.tableHeaders = [
      "Id",
      "Call",
      "Site",
      "Invoice no.",
      "Invoice total",
      "Asset",
      "PO Number",
      "Item No",
      "Quotation",
      "Invoice paid",
      "Invoice issue date"
    ];
    this.tableConfig.deleteRow = false;
    this.tableConfig.editRow = true;
    this.tableConfig.addRow=false
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.clickableLinks = [{ header: "Title" }]

    this.getLookup()
    this.searchInvoices();
  }

  getLookup() {
    this.lookupService.getLookUps(Lookup.Operator_Date).subscribe((res: any) => {
      this.Operator_Dates = res.data
    })
    this.lookupService.getLookUps(Lookup.Asset_Replace).subscribe((res: any) => {
      this.Invoicepaid = res.data
      this.Invoicepaid.splice(0, 0, { id: null, name: "Select", value: null })
    })
  }

  searchInvoices() {

    Object.assign(this.searchFilter, this.searchForm.value);

    this.invoicepoService.searchInvoices(this.searchFilter).subscribe(data => {
      this.tableConfig.pageFilter.totalItems = data['totalRows'];
      let tableData: any = [];
      data['data']?.forEach((e: any) => {
        tableData.push({
          "Id": e.id,
          "Call":e.purchaseOrder.callNo,
          "Site": e.purchaseOrder.site,
          "Invoice no.": e.invoiceNO,
          "Invoice total": e.invoiceTotal,
          "Asset": e.purchaseOrder.assetNumber,
          "PO Number": e.purchaseOrder.id,
          "Item No": e.purchaseOrder.id,
          "Quotation": e.purchaseOrder?.qutationNo,
          "Invoice paid": e.invoicePaid?.name,
          "Invoice issue date": e.invoiceIssueDate,

        });
      });
      this.tableConfig.tableData = tableData;
      this.tableConfig.pageFilter.totalRows = data.totalRows;
      this.tableConfig.tableName = "Invoice PO List"
    })

  }


  paginate(e: any) {

    this.searchFilter.pageNumber = e;
    this.tableConfig.pageFilter.pageNumber = e
    this.searchInvoices()
  }
  bindContractor(event: any) {
    this.searchFilter.site = event.custName
  }
  onSelectContractor(event: any) {
    this.searchonContractor(event.query);
    this.searchFilter.site = event.query
  }
  clearContractor() { }
  GetCallRequestAutoComplete(callId: string) {
    this.callRequestService.GetCallRequestAutoComplete(callId).subscribe((res) => {
      this.callId = res.data;
    });
  }
  selectCallId(event: any) {
    this.GetCallRequestAutoComplete(event.query);
    this.searchFilter.callId = event.query
  }
  clearCallId(){
    this.searchFilter.callId = "";
  }
  bindCallId(event: any) {
    this.searchFilter.callId = event.callNo
  }
  selectAssetSN(event: any) {
    this.getAssetsData(event.query);
    this.searchFilter.assetSerialNumber = event.query
  }
  bind(event: any) {
    this.searchFilter.assetSerialNumber = event.assetSerialNo
  }
  AssetClear(){
    this.searchFilter.assetSerialNumber = ""
  }
  getAssetsData(searchText: any = '') {
    console.log(searchText.q);
    this.assetService.GetAssetsAutoComplete(searchText.query).subscribe((res) => {
      // this.oldAssetNums = res.data;
      this.Asset_SNs = res.data;
    });
  }
  route(event: any) {
    if (event.header == 'Title')
      this.router.navigate(['/general-reports/invoice-report/invoice-in-po-management'], { queryParams: { id: event.rowData.Id } });
  }

  searchonContractor(code: any) {
    this.customerService.GetCustomersAutoComplete(code).subscribe((data: any) => {
      this.Sites = data.data;

    });
  }
  editInvoice(e: any) {
    this.router.navigate(['/general-reports/invoice-report/invoice-in-po-management'], { queryParams: { id: e } });
  }
}
