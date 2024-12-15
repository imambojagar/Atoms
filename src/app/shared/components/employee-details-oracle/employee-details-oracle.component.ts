import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
/* import { AssetDeliveryService } from 'src/app/data/service/asset-delivery.service'; */
import { SharedTable } from '../table/table';
import { AssetDeliveryService } from '../../../services/asset-delivery.service';
import { PrimengModule } from '../../primeng.module';
import { TableComponent } from '../table/table.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-employee-details-oracle',
  templateUrl: './employee-details-oracle.component.html',
  styleUrls: ['./employee-details-oracle.component.scss'],
  imports: [PrimengModule, TableComponent, ReactiveFormsModule, CommonModule]
})
export class EmployeeDetailsOracleComponent implements OnInit, OnDestroy {
  showDialog: boolean = false;
  isDisabled: boolean = true;
  searchFilter: any = {};
  searchForm!: FormGroup;
  dialogForm!: FormGroup;
  employees: any[] = [];
  employeesNumber: any[] = [];
  employeesName: any[] = [];
  employeesEmail: any[] = [];
  pageNum: number = 1;
  pageLimit: number = 50;
  totalRows: number = 0;
  tableConfig = new SharedTable();
  @Output() onSelectedEmployee: EventEmitter<any> = new EventEmitter<any> ();

  private unsubscribe: Subscription[] = [];
  constructor(
    private formbuilder: FormBuilder,
    private messageService: MessageService,
    private assetDeliveryService: AssetDeliveryService
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.searchForm = this.formbuilder.group({
      employeeNumber: null,
      employeeName: null,
      employeeEmail: null,
    });

    this.searchFilter.pageNumber = this.pageNum;
    this.searchFilter.pageSize = this.pageLimit;
    this.tableConfig.tableHeaders = [
      'Employee Number',
      'Employee Name',
      'Mobile Number',
    ];
    this.tableConfig.deleteRow = false;
    this.tableConfig.editRow = false;
    //this.tableConfig.viewRow = true;
    this.tableConfig.openChart = false;
    this.tableConfig.addRow = false;
    this.tableConfig.exportRow = false;

    //this.tableConfig.idHeader = 'Employee Number';
    this.tableConfig.tableName = 'Employee List';

    this.searchEmployeeDetails();
  }

  openDialog() {
    this.showDialog = true;
    this.searchFilter.pageNumber = this.pageNum;
    this.searchFilter.pageSize = this.pageLimit;
    this.searchEmployeeDetails();
  }

  searchEmployeeDetails() {
    this.searchFilter.employeeNumber = this.searchForm.value.employeeNumber;
    this.searchFilter.employeeName = this.searchForm.value.employeeName;
    this.searchFilter.employeeEmail = this.searchForm.value.employeeEmail;

    var employeesSB = this.assetDeliveryService
      .getEmployees(this.searchFilter)
      .subscribe((res: any) => {
        this.employees = res.employeesDetails;
        this.tableConfig.pageFilter.totalItems =
          res?.employeesDetails[0]?.nO_OF_ROWS ?? 0;
        let tableData: any = [];
        res.employeesDetails?.forEach((e: any) => {
          tableData.push({
            'Employee Number': e.employeE_NUMBER,
            'Employee Name': e.fulL_NAME,
            'Mobile Number': e.employeE_MOBILE_NUMBER,
          });
        });
        this.tableConfig.tableData = tableData;

        this.tableConfig.clickableLinks = [{ header: 'Employee Number' }];

        this.tableConfig.pageFilter.totalRows =
          res?.employeesDetails[0]?.nO_OF_ROWS ?? 0;
      });
    this.unsubscribe.push(employeesSB);
  }

  Reset() {
    this.searchFilter.employeeNumber = null;
    this.searchFilter.employeeName = null;
    this.searchFilter.employeeEmail = null;
    this.searchFilter.pageNumber = this.pageNum;
    this.searchFilter.pageSize = this.pageLimit;
    this.searchForm.reset();
  }

  selectEmployee(e: any) {
    console.log(e);
  }

  paginate(e: any) {

    this.searchFilter.pageNum = e;
    this.tableConfig.pageFilter.pageNumber = e
    this.searchEmployeeDetails()
  }

  route(e: any) {
    console.log(e);
    this.onSelectedEmployee.emit(e)
    this.showDialog = false;
 }
}
