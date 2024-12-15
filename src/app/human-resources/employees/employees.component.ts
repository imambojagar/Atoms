import { AfterViewInit, Component, ElementRef, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT, NgClass } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BubblePaginationDirective } from '../../shared/directives/bubble-pagination.directive';

import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';
import { CommonService } from '../../shared/services/common_service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    RouterLink,
    BubblePaginationDirective,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatPaginator
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild("hoverBtn") hoverBtn!: ElementRef;

  constructor(@Inject(DOCUMENT) private _document: Document, private commonService: CommonService) {

  }



  displayedColumns: string[] = [
    'employename', 'email', 'roles', 'userlanguage',
    'mobileno', 'department', 'position', 'qualification', 'action'
  ];

  listData: any = [
    { id: 1, name: 'Under Repair Internal' },
    { id: 2, name: 'Waiting for quotation ' },
    { id: 3, name: 'Waiting for vendor ' },
    { id: 4, name: 'Waiting for delivery ' },
    { id: 5, name: 'Under Observation' },
    { id: 6, name: 'Fixed' },
    { id: 7, name: 'Waiting for it' }
  ]

  dropdownText: string = 'Next Step';

  popover_active: boolean = false;
  isLoading: boolean = false;
  recordsperPage: number = 10;
  currentPage = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  numberOfPages: number = 0;
  numbeOfRecords: number = 0;
  selectedItem: any = {};


  ngOnInit(): void {
    this.numberOfPages = ELEMENT_DATA.length / this.recordsperPage;
    this.numbeOfRecords = ELEMENT_DATA.length;
    this.dataToggle();
  }

  dataToggle() {
    this.commonService.updateConfig({
      appConfig: {
        showProgressBar: !this.isLoading,
        breadcrumText: 'Employees'
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  popoverToggle() {
    this.popover_active = !this.popover_active
  }

  pagesEvent(event: PageEvent) {
    console.log("event", event);
    this.isLoading = false;
    // this.pageSize = event.pageSize + 1;
    event.pageIndex += 1;
    this.currentPage = event.pageIndex;
  }



  mouseEnter() {
    console.log("mouseEnter", this.hoverBtn.nativeElement);
    this.hoverBtn.nativeElement.click();
  }

  mouseLeave() {
    console.log("mouse leave :");
    this.hoverBtn.nativeElement.click();
  }

  selectedItems(item: any) {
    this.selectedItem = item;
  }

  exportEmployeeData() {
    const header = ['Employee Name', 'Email', 'Roles', 'User Language', 'Mobile No.', 'Department', 'Position', 'Qualification'];

    const data = this.dataSource.data;

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Employee_List');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

}



const ELEMENT_DATA: any[] = [
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
  { employename: 'Mohammad Hussain', email: "mail@gmail.com", roles: "Sys Admin", userlanguage: "English", mobileno: "0512345678", department: "Anaesthesia", Position: "None", qualification: 'None' },
];

