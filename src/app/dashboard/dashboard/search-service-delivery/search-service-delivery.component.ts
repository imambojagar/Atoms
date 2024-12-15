import { CustomDropdownComponent } from './../../../shared/components/custom-dropdown/custom-dropdown.component';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Message, MenuItem, SelectItem, MessageService, ConfirmationService, SharedModule } from 'primeng/api';
import { NameDefinitionModel } from '../../../models/name-definition-model';
import { ApiService } from '../../../services/name-definition.service';
import validateForm from '../../../shared/helpers/validateForm';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../../shared/primeng.module';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AssetsService } from '../../../services/assets.service';
import { CustomerService } from '../../../services/customer.service';
import { ServicerequestService } from '../../../services/servicerequest.service';

@Component({
  selector: 'app-search-service-delivery',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,],
  templateUrl: './search-service-delivery.component.html',
  styleUrl: './search-service-delivery.component.scss'
})
export class SearchServiceDeliveryComponent {

  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() serviceDeliverySearch: EventEmitter<any> = new EventEmitter<any>();
  searchForm!: FormGroup;
  asset_Numbers: any[] = [];
  Asset_SNs: any[] = [];
  Sites: any[] = [];
  WorkOrders: any[] = [];
  searchCriteria: SearchCriteria = new SearchCriteria();
  // filter: any;
  constructor(
    private serviceRequestService: ServicerequestService,
    private formbuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private assetService: AssetsService, private customerService: CustomerService,
  ) {

  }

  ngOnInit(): void {
    this.searchForm = this.formbuilder.group({
      workOrderNo: [''],
      assetSerialNo: [''],
      assetNumber: [''],
      site: [''],
      pageSize: [this.searchCriteria.pageSize],
      pageIndex: [this.searchCriteria.pageIndex]
    });

  }
  selectGetWorkOrderAutoComplete(event: any) {
    this.GetWorkOrderAutoComplete(event.query);
    this.searchCriteria.workOrderNo = event.query
  }
  bindWorkOrder(event: any) {
    this.searchCriteria.workOrderNo = event.value.workOrderNo
  }
  WorkOrderClear() {
    this.searchCriteria.workOrderNo = ''
  }
  GetWorkOrderAutoComplete(searchText: string) {
    this.serviceRequestService.GetWorkOrderAutoComplete(searchText).subscribe((res) => {
      // this.oldAssetNums = res.data;
      this.WorkOrders = res.data;
      this.triggerChangeDetection()
    });
  }
  selectAssetSN(event: any) {
    this.getAssetsData(event.query);
    this.searchCriteria.assetSerialNo = event.query
  }
  bind(event: any) {
    this.searchCriteria.assetSerialNo = event.value.assetSerialNo
  }
  AssetClear() {
    this.searchCriteria.assetSerialNo = ''
  }
  getAssetsData(searchText: any = '') {
    console.log(searchText.q);
    this.assetService.GetAssetsAutoComplete(searchText.query).subscribe((res) => {
      // this.oldAssetNums = res.data;
      this.Asset_SNs = res.data;
      this.triggerChangeDetection()
    });
  }
  getAssetsDataByAssetNumber(searchText: string = ''): void {
    const dto = { assetNumber: searchText };
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.asset_Numbers = res.data;
        this.triggerChangeDetection();
      });
  }
  private triggerChangeDetection(): void {
    this.cdr.detectChanges();
  }

  selectAsset(data: any): void {
    const selectedAssetId = data.value?.id;
    if (!selectedAssetId) {
      return;
    }

    this.searchForm.get('assetNumber')?.setValue(data.value.assetNumber);

  }
  // Error handler method
  handleError(error: any) {
    console.error('Error occurred:', error); // Log error to the console (optional)

    // Return an observable error to be caught in the subscribe block
    return throwError(() => new Error(error.message || 'Server error'));
  }
  Search() {
    let assetSerialNo = this.searchCriteria.assetSerialNo

    let site = this.searchCriteria.site
    this.searchCriteria = {
      ...this.searchForm.value, // Include all form values, including pageSize and pageIndex
      pageSize: this.searchForm.value.pageSize,
      pageIndex: this.searchForm.value.pageIndex
    };
    this.searchCriteria.assetSerialNo = assetSerialNo
    this.searchCriteria.site = this.searchForm.value.site?.custName

    this.searchCriteria.workOrderNo = this.searchForm.value.workOrderNo?.workOrderNo
    this.serviceDeliverySearch.emit(this.searchCriteria);
    this.close_modal();
    this.showmodal = false;
  }
  onSelectContractor(filter: any) {
    this.searchCriteria.site = filter.query

    this.searchonContractor(filter.query);

  }
  searchonContractor(code: any) {
    this.customerService.GetCustomersAutoComplete(code).subscribe((data: any) => {

      this.Sites = data.data;
      this.triggerChangeDetection()
      // TO DO ::
      // this.Assets_Buildings=data.data.buildings
      // this.Assets_Floor

    });
  }
  close_modal() {
    this.openModals.emit(false);
    this.searchForm.reset();
    this.showmodal = false
  }
}
export class SearchCriteria {
  workOrderNo?: string;
  assetSerialNo?: string;
  assetNumber?: string;
  site?: string;
  pageSize: number = 10;
  pageIndex: number = 1;

  constructor(init?: Partial<SearchCriteria>) {
    Object.assign(this, init);
  }
}
