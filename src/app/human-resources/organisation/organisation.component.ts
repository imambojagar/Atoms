import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT, NgClass } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonService } from '../../shared/services/common_service';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BubblePaginationDirective } from '../../shared/directives/bubble-pagination.directive';
import { ErrorStateMatcher } from '@angular/material/core';
import { SharedModule } from '../../shared/shared.module';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import * as XLSX from 'xlsx';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
  }

@Component({
  selector: 'app-organisation',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgClass,
    RouterLink,
    BubblePaginationDirective,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDrawer,
    MatSidenavModule
  ],
  templateUrl: './organisation.component.html',
  styleUrl: './organisation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild("hoverBtn") hoverBtn!: ElementRef;

  cities: any[] = [
    { id: 1, name: 'Riyadh'},
    { id: 2, name: 'N/A'}
  ];

  selectedItemsCities = this.cities;
  selectedCities = new FormControl(this.cities[0].id, [Validators.required]);
  organisationame = new FormControl('1234');
  organisationCode = new FormControl('ORG-7');
  postalCode= new FormControl('12333');
  location = new FormControl('KSA');

  countries: any[] = [
    { id: 1, name: 'KSA'},
    { id: 2, name: 'N/A'}
  ];

  selectedItemsCountries = this.countries;
  selectedCountries  = new FormControl(this.countries[0].id, [Validators.required]);

  matcher = new MyErrorStateMatcher();

  constructor(@Inject(DOCUMENT) private _document: Document, private commonService: CommonService,
  private elementRef: ElementRef) {
  }

  // selectedCity: any; //Primng Select dropdown
  // selectedItemsCities: SelectItem[] = [
  //   { label: 'City 1', value: { id: 1, name: 'City 1' } },
  //   { label: 'City 2', value: { id: 2, name: 'City 2' } },
  //   { label: 'City 3', value: { id: 3, name: 'City 3' } }
  // ];

  // onCityChange(event: any) {
  //   this.selectedItemsCities = event.target.value;
  // }

  displayedColumns: string[] = [
    'organisationame', 'organisationcode', 'postalcode', 'fromdate',
    'todate', 'location', 'city', 'country', 'action'
  ];

  listData: any = [
    {id: 1, name: 'Under Repair Internal'},
    {id: 2, name: 'Waiting for quotation '},
    {id: 3, name: 'Waiting for vendor '},
    {id: 4, name: 'Waiting for delivery '},
    {id: 5, name: 'Under Observation'},
    {id: 6, name: 'Fixed'},
    {id: 7, name: 'Waiting for it'}
  ]

  dropdownText: string = 'Next Step';

  popover_active: boolean = false;
  isLoading: boolean = false;
  recordsperPage: number = 10;
  currentPage  = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  numberOfPages: number = 0;
  numbeOfRecords: number = 0;
  selectedItem: any = {};


  ngOnInit(): void {
    const nativeElement = this.elementRef.nativeElement;
    const customselect = nativeElement.querySelectorAll( '.mat-mdc-select-arrow' );
    customselect.forEach((element: any) => {
      element.innerHTML = '';
      element.innerHTML = '<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.56269 7.48187C6.32745 7.48187 6.09225 7.39206 5.9129 7.2128L0.269257 1.56909C-0.0897524 1.21008 -0.0897524 0.628012 0.269257 0.269148C0.628121 -0.0897161 1.21008 -0.0897161 1.56912 0.269148L6.56269 5.26301L11.5563 0.269323C11.9153 -0.0895417 12.4972 -0.0895417 12.856 0.269323C13.2152 0.628187 13.2152 1.21026 12.856 1.56927L7.21247 7.21297C7.03304 7.39226 6.79783 7.48187 6.56269 7.48187Z"fill="#3B3D4A" /></svg>';
    });

    this.numberOfPages = ELEMENT_DATA.length / this.recordsperPage;
    this.numbeOfRecords= ELEMENT_DATA.length;
    this.dataToggle();
  }

  dataToggle() {
    this.commonService.updateConfig({
       appConfig : {
        showProgressBar : !this.isLoading,
        breadcrumText: 'Organisation'
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    /* setTimeout(() => this.appFocus.nativeElement.focus(), 0); */
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

  onKeyCities(event: any) {
    let value = event.target.value;
    this.selectedItemsCities = this.search(value, this.cities);
  }

  onKeyCountries(event: any) {
    let value = event.target.value;
    this.selectedItemsCountries = this.search(value, this.countries);
  }

  search(value: string, select_array: any) {
    let filter = value.toLowerCase();
    return select_array.filter((option : any) => option.name.toLowerCase().startsWith(filter));
  }

  exportOrganisationaData() {
  const header = ['Organisation Name', 'Organisation Code', 'Postal Code', 'From Date', 'To Date', 'Location', 'City', 'Country'];

  const data = this.dataSource.data;

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

  XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, 'Organisation_List');
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
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
  {organisationame: "HMG", organisationcode: "HMG-1",  postalcode: "12356", fromdate: "Jun 30, 2024", todate: "Jun 30, 2024", location: "KSA", city: 'Riyadh', country: 'Saudi Arabia'},
];



