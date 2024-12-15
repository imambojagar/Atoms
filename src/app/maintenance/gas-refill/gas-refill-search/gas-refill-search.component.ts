import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AssetFormService } from '../../../assets/assets/asset-form.service';
import { SharedTable } from '../../../shared/components/table/table';
import { GasRefill } from '../../../models/gas-refill';
import { CallRequestService } from '../../../services/call-request.service';
import { GasRefillService } from '../../../services/gas-refill.service';
import { EmployeeService } from '../../../services/employee.service';
import { CustomerService } from '../../../services/customer.service';
import { LookupService } from '../../../services/lookup.service';
import { DepartmentService } from '../../../services/department.service';
import { ExportService } from '../../../shared/services/export.service';
import { Lookup } from '../../../shared/enums/lookup';
import { Role } from '../../../shared/enums/role';
import { ServiceRequestFormService } from '../../service-request/service-request-form.service';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { Role } from 'src/app/data/Enum/role';
import { GasRefill } from 'src/app/data/models/gas-refill'; */
// import { GasRefillfilter, AssistantEmployeesModel, StatusModel } from 'src/app/data/models/workorder-model';
/* import { CallRequestService } from 'src/app/data/service/call-request.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { DepartmentService } from 'src/app/data/service/department.service';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { GasRefillService } from 'src/app/data/service/gas-refill.service';
import { LookupService } from 'src/app/data/service/lookup.service';
import { SharedTable } from 'src/app/shared/component/table/table';
import { AssetFormService } from '../../../systemsettings/assets/asset-form.service';
import { ExportService } from 'src/app/shared/service/export.service'; */

@Component({
  selector: 'app-gas-refill-search',
  templateUrl: './gas-refill-search.component.html',
  styleUrls: ['./gas-refill-search.component.scss'],
  providers: [AssetFormService, MessageService, ServiceRequestFormService]
})
export class GasRefillSearchComponent implements OnInit {
  tableConfig = new SharedTable();
  searchForm!: FormGroup;
  searchFilter = new GasRefill()
  assginedEmployees: any[] = [];
  selectedAssginedEmployees: any[] = [];
  items!: MenuItem[];
  GasTypes: any[] = [];
  statuses: any[] = [];
  cylinderSizes: any;
  sizeCylinders: any;
  sites:any[]=[];
  departments:any[]=[];
  showDialog:boolean=false;
  commentForm!:FormGroup;
  gasRefillId:any;
  comments:any[]=[];
  selectedNames!: any[] | null;
  gasrefil:any[]=[];
  showmodal: boolean=false;
  showmodal1: boolean=false;
  showmodal2: boolean=false;
  totalRows: number = 0;
  gas_order_edit_id: number = 0;
  addTransferLoaded: boolean = false;
  ViewRefilTransferLoaded: boolean = false;
  searchValue: string = '';

  constructor(private fb: FormBuilder,
    public callRequestService: CallRequestService,
    public assetFormService: AssetFormService,
    public gasRefillService: GasRefillService,
    public employeeService: EmployeeService,
    private customerService: CustomerService,
    private lookupService: LookupService,
    private router: Router,
    private departmentService:DepartmentService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private exporteService:ExportService) {}

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  close_dialog() {
    this.showDialog = !this.showDialog;
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

  navToDetails(row: any, index: number) {
    /* this.nameDefinitionModel.id = row.id; */
    this.gas_order_edit_id  =  row.id;
    console.log("edit asset", row.id);
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  navToView(row: any, index: number) {
    this.gas_order_edit_id  =  row.id;
    console.log("edit asset", row.id);
    this.ViewRefilTransferLoaded = !this.ViewRefilTransferLoaded;
  }

  ngOnInit(): void {

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Search Gas Refills' },
    ];

    this.searchForm = this.fb.group({
      gasType: [null],
      cylinderType: [null],
      // requstedQty: [null],
      // deliverdQty: [null],
      cylinderSize: [null],
      assignedEmployee: [null],
      status: [null],
      site:[null],
      department:[null]
    })
    this.commentForm = this.fb.group({
      comment:['']
    })
    this.tableConfig.tableHeaders = [
      "Id",
      "Title",
      "Assigned Employee",
      "Status",
      "Comments",
      "Action"
    ];

    // this.tableConfig.tableHeaders2 = [
    //   "Gas Type",
    //   "Size Cylinder",
    //   "Requsted Qty",
    //   "Deliverd Qty",
    // ];
    this.tableConfig.deleteRow = false;
    this.tableConfig.editRow = true;
    this.tableConfig.exportRow=true;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.tableName = "Gas Refill List"
    this.tableConfig.clickableLinks = [{ header: "Title" },{ header: "Comments" }]
    this.getDepartments()
    this.getLookup()
    this.getAssignedEmployees(Role.engineersvalue);
    this.searchGasRefill();
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.gasrefil = this.gasrefil.filter((row: any) =>
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
    this.searchGasRefill()
    this.cdr.detectChanges();
  }

  getAssignedEmployees(value: string) {
    this.employeeService.GetUserByRoleValue(value).subscribe((res: any) => {
      this.assginedEmployees = res
    })
  }

  getLookup() {
    this.lookupService.getLookUps(Lookup.StatusGazRefill).subscribe((res: any) => {
      this.statuses = res.data
      this.statuses?.splice(0, 0, { id: 0, name: "Select", value: null })
    })
    this.lookupService.getLookUps(Lookup.GazType).subscribe((res: any) => {
      this.GasTypes = res.data
      this.GasTypes?.splice(0, 0, { id: 0, name: "Select", value: null })
    })
    this.lookupService.getLookUps(Lookup.CylinderSize).subscribe((res: any) => {
      this.cylinderSizes = res.data
      this.cylinderSizes?.splice(0, 0, { id: 0, name: "Select", value: null })
    })
    this.lookupService.getLookUps(Lookup.SizeCylinder).subscribe((res: any) => {
      this.sizeCylinders = res.data
      this.sizeCylinders?.splice(0, 0, { id: 0, name: "Select", value: null })
    })
  }
  searchGasRefill() {

    Object.assign(this.searchFilter, this.searchForm.value);

    this.searchFilter.assignedEmployee = this.searchFilter.assignedEmployee?.userId;
    if (this.searchForm.value.site != null)
    {
      if (this.searchForm.value.site.custName == undefined)
      {
        this.searchFilter.site = this.searchForm.value.site
      }
      else
      {
        this.searchFilter.site = this.searchForm.value.site.custName
      }

    }


    this.gasRefillService.searchGazRefill(this.searchFilter).subscribe(data => {
      this.tableConfig.pageFilter.totalItems = data['totalRows'];
      let tableData: any = [];
      let tableData2: any = [];
      data['data']?.forEach((e: any) => {
        tableData.push({
          "Id": e.id,
          "Title": e.gazRefillNo,
          "AssignedEmployee": e.assignedEmployee?.name,
          "Status": e.status?.name,
          "Comments":"Comments"
        });

        this.gasrefil = tableData;
        this.totalRows = data['totalRows'];
        this.cdr.detectChanges();

        // e.gazRefillDetails?.forEach((x: any) => {
        //   tableData2.push({
        //     "Gas Type": x.gasType?.name,
        //     "Size Cylinder": x.cylinderType?.name,
        //     "Requsted Qty": x.requestedQty,
        //     "Deliverd Qty": x.deliverdQty,
        //     "gazId": e.id
        //   })
        // })

      })

      // this.tableConfig.tableData2 = tableData2;
      this.tableConfig.tableData = tableData;
      this.tableConfig.pageFilter.totalRows = data.totalRows;
      /* this.tableConfig.tableName = "Gas Refill List" */
    })
  }


  paginate(e: any) {
    this.searchFilter.pageNumber = e
    this.tableConfig.pageFilter.pageNumber = e
    this.searchGasRefill()
  }

  route(event: any) {
    if (event.header=="Title")
    {
      this.router.navigate(['/maintenance/gas-refill/view-control'], { queryParams: { id: event.rowData.Id } });
    }
    else if (event.header=="Comments")
    {
      this.gasRefillId = event.rowData.Id;
      this.getHistoryComment();
    }

  }

  editGazRefill(event:any)
  {
    this.router.navigate(['/maintenance/gas-refill/edit-control'], { queryParams: { id: event } });
  }
  Add() {
    this.router.navigate(['/maintenance/gas-refill/add-control']);
  }
  reset() {
    this.searchForm.reset();
    this.searchFilter = new GasRefill();
    this.searchGasRefill();
  }

  searchonSite(filter: any) {
    this.customerService.GetCustomersAutoComplete(filter.query).subscribe((data: any) => {
      this.sites = data.data;
    });
  }

  onSelectSite(filter: any) {
    this.searchForm.value.site=filter.custName
  }

  clearSite() {
    this.searchForm.value.site=""
  }

  getDepartments(){
    this.departmentService.GetDepartmentsAutoComplete().subscribe((data: any) => {
      this.departments = data.data;
    });
  }

  openDialogComments(){
    this.showDialog=true;
  }

  getHistoryComment(){
    this.gasRefillService.getHistoryComments(this.gasRefillId).subscribe(res => {
      this.comments = res.data;
      this.showDialog=true;
    })
  }

  saveComment(){
    debugger;
    if (this.commentForm.value.comment==null|| this.commentForm.value.comment=="" || this.commentForm.value.comment==undefined) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    }
    else
    {
      let finalData: any = {};
      finalData.comment = this.commentForm.value.comment;
      finalData.gasRefillId =this.gasRefillId;
      this.gasRefillService.AddHistoryComment(finalData).subscribe(res => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          this.getHistoryComment();
          this.commentForm.reset();
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });

        }
      })


    }
  }

  export(){
  this.exporteService
      .export(this.searchFilter, 'GazRefill/exportGasRefill')
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
        link.download = 'GasRefill-Report';
        link.click();
      });
  }

}
