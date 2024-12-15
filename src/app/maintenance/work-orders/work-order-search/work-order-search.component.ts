import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { SharedTable } from '../../../shared/components/table/table';
import { AssistantEmployeesModel, StatusModel, WorkOrderfilter } from '../../../models/workorder-model';
import { CallRequestService } from '../../../services/call-request.service';
import { AssetsService } from '../../../services/assets.service';
import { WorkOrderService } from '../../../services/work-order.service';
import { EmployeeService } from '../../../services/employee.service';
import { CustomerService } from '../../../services/customer.service';
import { LookupService } from '../../../services/lookup.service';
import { ExportService } from '../../../shared/services/export.service';
import { AssetGroupService } from '../../../services/asset-group.service';
import { Lookup } from '../../../shared/enums/lookup';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { AssistantEmployeesModel, StatusModel, WorkOrderfilter } from 'src/app/data/models/workorder-model';
import { AssetsService } from 'src/app/data/service/assets.service';
import { CallRequestService } from 'src/app/data/service/call-request.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { LookupService } from 'src/app/data/service/lookup.service';
import { WorkOrderService } from 'src/app/data/service/work-order.service';
import { SharedTable } from 'src/app/shared/component/table/table';
import { ExportService } from 'src/app/shared/service/export.service';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';
 */
@Component({
  selector: 'app-work-order-search',
  templateUrl: './work-order-search.component.html',
  styleUrls: ['./work-order-search.component.scss']
})
export class WorkOrderSearchComponent implements OnInit {
  tableConfig = new SharedTable();
  searchForm!: FormGroup;


  totalRows!: number;
  loading!: boolean;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };
  showActionHistoryDialog: boolean = false;
  actionHistoryList:any[]=[];
  workOrderID : any;
  WOnum : string = '';
  work_order_edit_id: number = 0;
  editIndex : number = 0;

  searchFilter = new WorkOrderfilter();
  callId:any[]=[];
  workOrderNo:any[]=[];
  assginedEmployees:any[]=[];
  selectedAssginedEmployees:any[]=[];
  statusWO:any[]=[];
  selectedStatus:any[]=[];
  sites: any[] = [];
  items!: MenuItem[];
  Operator_Dates: any[]=[];
  Asset_SNs: any[]=[];
  showDialog:boolean=false;
  step1:boolean=false;
  step2:boolean=false;
  step3:boolean=false;
  step4:boolean=false;
  step5:boolean=false;
  step6:boolean=false;
  step7:boolean=false;
  step8:boolean=false;
  step9:boolean=false;
  step10:boolean=false;
  step11:boolean=false;
  step12:boolean=false;
  step13:boolean=false;
  step14:boolean=false;
  step15:boolean=false;
  step16:boolean=false;
  step17:boolean=false;
  step18:boolean=false;
  step19:boolean=false;
  step20:boolean=false;
  step21:boolean=false;
  showmodal: boolean=false;
  showmodal1: boolean=false;
  showmodal2: boolean=false;
  selected_CallId: any = null;
  selected_ParentWOID: any = null;
  assetGroupsList: any[]=[];
  selectedNames!: any[] | null;
  dataTableLoading: boolean = false;
  workorder: any = [];
  addTransferLoaded: boolean = false;
  viewWorksTransferLoaded: boolean = false;
  searchValue: string = '';

  constructor(
    private fb: FormBuilder,
    public callRequestService: CallRequestService,
    public assetService: AssetsService,
    public workOrderService: WorkOrderService,
    private formbuilder:FormBuilder,
    public employeeService:EmployeeService,
    private customerService:CustomerService,
    private lookupService:LookupService,
    private router: Router,
    private confirmationService: ConfirmationService,
    public workOrdersService: WorkOrderService,
    private exporteService:ExportService,
    private messageService: MessageService,
    private assetGroupService: AssetGroupService,
    private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    /* this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Search Work Orders' }
    ]; */
    this.searchForm = this.fb.group({
      callId: [null],
      assetSerialNo:[null],
      workOrderNo:[null],
      callslastSituationWO:[null],
      site:[null],
      visitDateSymbol:[null],
      visitDateFrom:[null],
      visitDateTo:[null],
      endDateSymbol:[null],
      endDateFrom:[null],
      endDateTo:[null],
      assetNumber:[null],
      cAssginedEmployees:this.formbuilder.array([
        this.formbuilder.group(new AssistantEmployeesModel())
      ]),
      cStatusWO:this.formbuilder.array([
        this.formbuilder.group(new StatusModel())
      ]),

      assetGroup:[null]
    });

    this.getAllUsers();
    this.workOrderService.getCallLastSituation();
    this.workOrderService.getStatusWO();
    this.getOperator();

    this.tableConfig.tableHeaders = [
      "Id",
      "Call Id",
      "Work Order Number",
      "Return To Service Date",
      "Assigned Employee",
      "Asset Number",
      "Asset S.N",
      "Asset Name",
      "Manufacturer/Model",
      "Site",
      "Situation",
      "Total Working Hours",
      "Current Situation",
      "NextStep",
      "Action"
    ];
    this.tableConfig.deleteRow = false;
    this.tableConfig.editRow = true;
    this.tableConfig.addRow=false;
    this.tableConfig.viewRow = true;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.clickableLinks = [{header:["Work Order Number"]}, { header: "NextStep" }];
    this.searchWorkOrder();
    this.searchAssetGroup();
  }

  close_modal() {
    this.showmodal = !this.showmodal;
    this.reset();
  }

  closeActionDialog() {
    this.showActionHistoryDialog = !this.showActionHistoryDialog;
  }

  openFilterModal() {
    this.showmodal = !this.showmodal;
  }

  openModal() {
    this.work_order_edit_id  = 0;
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  openViewModal() {
    this.work_order_edit_id  = 0;
    this.viewWorksTransferLoaded = !this.viewWorksTransferLoaded;
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.workorder = this.workorder.filter((row: any) =>
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
    this.searchWorkOrder()
    this.cdr.detectChanges();
  }

  navToDetails(row: any, index: number) {
    /* this.nameDefinitionModel.id = row.id; */
    this.work_order_edit_id  =  row.id;
    console.log("edit asset", row.id);
    /* this.workorderData =  */
    this.addTransferLoaded = !this.addTransferLoaded;

    /* this.asset_id = row.id;
    this.assets_index = index;
    this.addTransferLoaded = !this.addTransferLoaded; */
    /* this.router.navigate(['/maintenance/asset-transfer/edit-control'], { queryParams: { data: row.id, index } }); */
  }

  navToView(row: any, index: number) {
    /* this.nameDefinitionModel.id = row.id; */
    this.work_order_edit_id  =  row.id;
    console.log("edit asset", row.id);
    /* this.workorderData =  */
    this.viewWorksTransferLoaded = !this.viewWorksTransferLoaded;

    /* this.asset_id = row.id;
    this.assets_index = index;
    this.addTransferLoaded = !this.addTransferLoaded; */
    /* this.router.navigate(['/maintenance/asset-transfer/edit-control'], { queryParams: { data: row.id, index } }); */
  }

  viewActionHistory(workOrderId: any) {
    this.showActionHistoryDialog = true;
    this.SearchWorkOrderHistory(workOrderId);
  }

  GetCallRequestAutoComplete(callId:string ){
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
    this.getAssetsData(event.query,'SN');
    this.searchFilter.assetSerialNo = event.query
  }
  clearAssetSN(){
    this.searchFilter.assetSerialNo = "";
  }
  bindAssetSN(event: any) {
    this.searchFilter.assetSerialNo = event.assetSerialNo
  }

  getAssetsData(searchText: any = '',typesearch:any) {
    let dto={
      assetSerialNo: typesearch=='SN' ? searchText : '',
      assetNumber: typesearch=='Number' ? searchText : '',
    }
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res) => {
      this.Asset_SNs = res.data;
    });
  }

  selectAssetNumber(event: any) {
    this.getAssetsData(event.query,'Number');
    this.searchFilter.assetNumber = event.query
  }
  clearAssetNumber(){
    this.searchFilter.assetNumber = "";
  }
  bindAssetNumber(event: any) {
    this.searchFilter.assetNumber = event.assetNumber
  }


  GetWorkOrderAutoComplete(workOrderNo:string ){
    this.workOrderService.GetWorkOrderAutoComplete(workOrderNo,true).subscribe((res) => {
      this.workOrderNo = res.data;
    });
  }
  selectWorkOrderNo(event: any) {
    this.GetWorkOrderAutoComplete(event.query);
    this.searchFilter.workOrderNo = event.query;
  }
  clearWorkOrderNo(){
    this.searchFilter.workOrderNo = "";
  }
  bindWorkOrderNo(event: any) {
    this.searchFilter.workOrderNo = event.workOrderNo;
  }

  searchOnSite(code: any) {
    this.customerService.GetCustomersAutoComplete(code).subscribe((data) => {
      this.sites = data.data;
    });
  }

  onSelectSite(event: any) {
    this.searchOnSite(event.query);
    this.searchFilter.site = event.query
  }
  bindSite(event: any) {
    this.searchFilter.site = event.custName
  }
  clearSite(){
    this.searchFilter.site = "";
  }

  assginedEmployeesControl() {
    return (<FormArray>this.searchForm.get('cAssginedEmployees')).controls;
  }

  statusControl() {
    return (<FormArray>this.searchForm.get('cStatusWO')).controls;
  }

  getAllUsers(){
    this.employeeService.getAllUsersFilter().subscribe((res:any)=>{
      let result:any[]=[];
      result=res;
      result.forEach(t => {
        var emp = new  AssistantEmployeesModel();
        emp.id =0,
        emp.userId=t.userId,
        emp.userName=t.userName
        this.assginedEmployees.push(emp);
      })

    })
  }

  getOperator(){
    this.lookupService.getLookUps(Lookup.Operator_Date).subscribe((res: any) => {
      this.Operator_Dates = res.data;
    })
  }


  searchWorkOrder() {
    this.searchFilter.callslastSituationWO=this.searchForm.value.callslastSituationWO;
    this.searchFilter.visitDateSymbol=this.searchForm.value.visitDateSymbol;
    this.searchFilter.visitDateFrom=this.searchForm.value.visitDateFrom;
    this.searchFilter.visitDateTo=this.searchForm.value.visitDateTo;
    this.searchFilter.assetGroup=this.searchForm.value.assetGroup;



    this.searchFilter.callId = this.searchFilter.callId;
    this.searchFilter.assetSerialNo = this.searchFilter.assetSerialNo;
    this.searchFilter.workOrderNo = this.searchFilter.workOrderNo;
    this.searchFilter.site = this.searchFilter.site;
    this.searchFilter.assetNumber = this.searchFilter.assetNumber;


    this.searchFilter.assignedEmployees=[];

    if(this.selectedAssginedEmployees.length != 0){
      this.selectedAssginedEmployees.forEach(e=>{
        this.searchFilter.assignedEmployees.push(e.userId);
      });
    }

    this.searchFilter.statusWO=[];
    this.selectedStatus.forEach(e=>{
      this.searchFilter.statusWO.push(e.id);
    });
    this.dataTableLoading = true;
    this.workOrderService.searchWorkOrders(this.searchFilter).subscribe({next: (data) => {
      this.tableConfig.pageFilter.totalItems = data['totalRows'];
      let tableData: any = [];
      /* data['data']?.forEach((e: any) => {
        tableData.push({
          "Id": e.id,
          "Call Id": e.callRequest.callNo,
          "Work Order Number": e.workOrderNo,
          "Return To Service Date": e.visitDate==null ? '': this.datePipe.transform(e.visitDate, 'yyyy-MM-dd'),
          "Assigned Employee": e.assignedEmployee?.name,
          "Asset Number": e.callRequest.asset.assetNumber,
          "Asset S.N": e.callRequest.asset.assetSerialNo,
          "Asset Name": e.callRequest.asset.modelDefinition.assetName,
          "Manufacturer/Model": e.callRequest.asset.modelDefinition.manufacturerName + '/' +e.callRequest.asset.modelDefinition.modelName,
          "Site":e.callRequest.asset.site.custName,
          "Situation": e.calllastSituation?.name,
          "Total Working Hours":e.totalWorkingHours,
          "Current Situation": e.currentSituation?.name,
          "NextStep": e.currentSituation?.value == 14 || e.currentSituation?.value == 10 ? "" : "Next Step",
        });
      }); */
      this.workorder = data['data'];
      this.tableConfig.tableData = tableData;
      this.tableConfig.pageFilter.totalRows = data.totalRows;
      this.tableConfig.tableName = "Work Orders List";
      this.cdr.detectChanges();
    },
    error: (e) => {
      this.dataTableLoading = false;
      console.log("error");
      console.error(e);
    },
    complete: () => {
      this.dataTableLoading = false;
      console.log("complete");
    }})

  }

  reset(){

    this.searchFilter.callId = "";
    this.searchFilter.assetSerialNo = "";
    this.searchFilter.workOrderNo = "";
    this.searchFilter.site = "";
    this.searchFilter.assetNumber = "";

    this.selectedAssginedEmployees = [];

    this.searchForm.reset();
    this.searchWorkOrder();
  }

  paginate(e: any) {

    this.searchFilter.pageNumber = e;
    this.tableConfig.pageFilter.pageNumber = e
    this.searchWorkOrder()
    this.SearchWorkOrderHistory(this.workOrderID);
  }

  wororderPayload = {};
  route(event:any)
  {
     if (event.header=='Work Order Number')
     {
      this.workOrderService.getParentInfo(event.rowData.Id,0).subscribe((res) => {
        if (res.isSuccess)
        {
          this.addTransferLoaded = true;
          this.wororderPayload = { callId: res.data.callId,id: event.rowData.Id };
          // this.router.navigate(['/maintenance/work-orders/view-control'], { queryParams: { callId: res.data.callId,id: event.rowData.Id } });
        }
      })
     }
     else  if (event.rowData.NextStep=="Next Step")
     {
      this.step1=false;
      this.step2=false;
      this.step3=false;
      this.step4=false;
      this.step5=false;
      this.step6=false;
      this.step7=false;
      this.step8=false;
      this.step9=false;
      this.step10=false;
      this.step11=false;
      this.step12=false;
      this.step13=false;
      this.step14=false;
      this.step15=false;
      this.step16=false;
      this.step17=false;
      this.step18=false;
      this.step19=false;
      this.step20=false;
      this.step21=false;
        this.workOrderService.getParentInfo(event.rowData.Id,0).subscribe((res1) => {
          if (res1.isSuccess)
          {
            this.workOrderService.GetLookupCallLastSituationBasedOnCase(event.rowData.Id,true,0,"1").subscribe((res) => {
              if (res.isSuccess)
              {
                this.showDialog=true;
                let nextOptions:any[]=[];
                nextOptions =res.data
                if (res1.data.currentSituation?.value == 4)
                {
                  this.step18=true
                  this.step10=true
                  this.step4=true
                }
                else if (res1.data.currentSituation?.value == 6)
                {
                  this.step19=true
                  this.step10=true
                }
                else if (res1.data.currentSituation?.value == 7)
                {
                  this.step20=true
                  this.step10=true
                }
                else if (res1.data.currentSituation?.value == 8)
                {
                  this.step21=true
                  this.step10=true
                }
                else
                {
                  this.step1 = this.getVisiableStep(1,nextOptions)
                  this.step2 = this.getVisiableStep(2,nextOptions)
                  this.step3 = this.getVisiableStep(3,nextOptions)
                  this.step4 = this.getVisiableStep(4,nextOptions)
                  this.step5 = this.getVisiableStep(5,nextOptions)
                  this.step6 = this.getVisiableStep(6,nextOptions)
                  this.step7 = this.getVisiableStep(7,nextOptions)
                  this.step8 = this.getVisiableStep(8,nextOptions)
                  this.step9 = this.getVisiableStep(9,nextOptions)
                  this.step10 = this.getVisiableStep(10,nextOptions)
                  this.step11 = this.getVisiableStep(11,nextOptions)
                  this.step12 = this.getVisiableStep(12,nextOptions)
                  this.step13 = this.getVisiableStep(13,nextOptions)
                  this.step14 = this.getVisiableStep(14,nextOptions)
                  this.step15 = this.getVisiableStep(15,nextOptions)
                  this.step16 = this.getVisiableStep(16,nextOptions)
                  this.step17 = this.getVisiableStep(17,nextOptions)
                }



                this.selected_CallId = res1.data.callId;
                this.selected_ParentWOID=event.rowData.Id;

              }
            })
        }
       })
     }
  }

  getVisiableStep(i:number,nextOptions:any[])
  {
   if (nextOptions.filter(x=>x.value==i).length > 0)
     return true;
   else
     return  false;

  }


  editWorkOrder(e: any) {
    this.workOrderService.GetPreviousAndNextStepById("W",e,e).subscribe(res=>{
      if (res.isSuccess)
      {
        if (res.data.nextId != null)
        {
          this.workOrderService.getParentInfo(e,0).subscribe((res) => {
            if (res.isSuccess)
            {
              this.work_order_edit_id = e;
              this.wororderPayload = { callId: res.data.callId,id: e };
              this.addTransferLoaded = true;
              // this.router.navigate(['/maintenance/work-orders/view-control'], { queryParams: { callId: res.data.callId,id: e } });
            }
          })
        }
        else
        {
          this.workOrderService.getParentInfo(e,0).subscribe((res) => {
            if (res.isSuccess)
            {
              this.work_order_edit_id = e;
              this.wororderPayload = { callId: res.data.callId,id: e };
              this.addTransferLoaded = true;
             // this.router.navigate(['/maintenance/work-orders/edit-control'], { queryParams: { callId: res.data.callId,id: e } });
            }
          })
        }
      }
    })

  }

  deleteWorkorder(rowdat: any) {
    let id = rowdat.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this work order?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.workOrdersService.deleteWorkOrder(id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.router.navigate(['maintenance/work-orders']);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
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


  //rahaf
  SearchWorkOrderHistory(workOrderId: any) {
    this.workOrderID = workOrderId;
    this.workOrderService.GetWorkOrderHistory(workOrderId).subscribe(res=>{
      if (res.isSuccess)
      {
        this.totalRows = res.totalRows;
        this.actionHistoryList = res.data;
        this.WOnum = this.actionHistoryList[0].workOrderNo;
      }
    })

  }




  clickStep(id:any)
  {
    if (id==18)
    {
      this.workOrderService.lastTransaction(this.selected_ParentWOID).subscribe(last=>{
        this.router.navigate(['/maintenance/quotations/add-control'], { queryParams: { workerorderId: last.data.previousId,ParentWOId: this.selected_ParentWOID } });
      })

    }
    else if (id==19)
    {
      this.workOrderService.lastTransaction(this.selected_ParentWOID).subscribe(last=>{
        if (last.data.previousType == 'Q')
        {
          this.router.navigate(['/maintenance/purchase-order/add-control'], { queryParams: { quotationId: last.data.previousId,ParentWOId: this.selected_ParentWOID,isPR:'PR' } });
        }
        else if (last.data.previousType == 'W')
        {
          this.workOrderService.lastTransactionQ(this.selected_ParentWOID).subscribe(q=>{
            this.router.navigate(['/maintenance/purchase-order/add-control'], { queryParams: { quotationId: q.data.previousId,ParentWOId: this.selected_ParentWOID,isPR:'PR' } });
          })
        }
      })

    }
    else if (id==20)
    {
      this.workOrderService.lastTransaction(this.selected_ParentWOID).subscribe(last=>{
       if (last.data.previousType == 'PR')
        {
          this.workOrderService.lastTransactionQ(this.selected_ParentWOID).subscribe(q=>{
            this.router.navigate(['/maintenance/purchase-order/add-control'], { queryParams: { quotationId: q.data.previousId,ParentWOId: this.selected_ParentWOID,isPR:'PO' } });
          })
        }
      })

    }
    else if (id==21)
    {
      this.workOrderService.lastTransaction(this.selected_ParentWOID).subscribe(last=>{
        this.router.navigate(['/store/partDelivery/add-control'], { queryParams: { poId: last.data.previousType == 'PO' ? last.data.previousId : null,
        workOrderId: last.data.previousType == 'W' ? last.data.previousId : null,
        ParentWOId: this.selected_ParentWOID } });
      })

    }
    else
    {
      this.router.navigate(['/maintenance/work-orders/add-control'], { queryParams: { callId: this.selected_CallId,ParentWOId: this.selected_ParentWOID,clickSituationId:id } });
    }
  }

  exportWorkOrder(){
    this.searchFilter.callslastSituationWO=this.searchForm.value.callslastSituationWO;
    this.searchFilter.visitDateSymbol=this.searchForm.value.visitDateSymbol;
    this.searchFilter.visitDateFrom=this.searchForm.value.visitDateFrom;
    this.searchFilter.visitDateTo=this.searchForm.value.visitDateTo;
    this.searchFilter.assignedEmployees=[];
    this.selectedAssginedEmployees.forEach(e=>{
      this.searchFilter.assignedEmployees.push(e.userId);
    });
    this.searchFilter.statusWO=[];
    this.selectedStatus.forEach(e=>{
      this.searchFilter.statusWO.push(e.id);
    });
    this.exporteService
      .export(this.searchFilter, 'WorkOrder/ExportWorkOrders')
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
        link.download = 'WorkOrders-Report';
        link.click();
      });
  }

  searchAssetGroup() {
    this.assetGroupService
    .searchAssetGroups({  })
    .subscribe((res) => (this.assetGroupsList = res.data));
  }
}
