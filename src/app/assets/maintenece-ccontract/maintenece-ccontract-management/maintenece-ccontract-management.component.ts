import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MenuItem, TreeNode, MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { MaintenanceService } from '../../../services/maintenance.service';
import validateForm from '../../../shared/helpers/validateForm';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengModule } from '../../../shared/primeng.module';
import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MaintenanceModel, AssetModel, vendorOperationTimes } from '../../../models/Maintenance.model';
import { AuthService } from '../../../services/auth.service';
import { CustomerService } from '../../../services/customer.service';
import { ModelService } from '../../../services/model-definition.service';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import { AssetFormService } from '../../assets/asset-form.service';
import { AssetSearchComponent } from './asset-search/asset-search.component';
import { NewEmployeeModel } from '../../../models/employee-model';
import { AssetGroupService } from '../../../services/asset-group.service';
import { AssetsService } from '../../../services/assets.service';
import { EmployeeService } from '../../../services/employee.service';
import { TaxonomyService } from '../../../services/taxonomy.service';

@Component({
  selector: 'app-maintenece-ccontract-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule, ReactiveFormsModule, TranslateModule, DynamicDialogModule,

  ],
  providers: [
    DynamicDialogConfig,
    DialogService,
    MessageService, AssetFormService
  ],
  templateUrl: './maintenece-ccontract-management.component.html',
  styleUrl: './maintenece-ccontract-management.component.scss'
})
export class MainteneceCcontractManagementComponent {
  loading: boolean = true
  @Input('showmodal') showmodal: boolean = false;

  @Input('editMCobject') editMCobject: any = null;
  @ViewChild('addMC') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>(); addMaintenanceForm!: FormGroup;
  isSubmitted = false;
  maintenanceModel: MaintenanceModel = new MaintenanceModel();
  items!: MenuItem[];

  test: number = 0;
  contractType: any[] = [];
  contractStatus: any[] = [];
  cuurencyId: any[] = [];
  contractVendor: any[] = [];
  typeOfContract: any[] = [];
  autorenew = [
    { name: 'None', value: null },
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];

  listOfExParts: any[] = [];
  months: any[] = [];
  numberOfYears: any[] = [];

  defaultLookup = {
    id: null,
    name: 'None',
    value: 0,
  };

  selectedRowIds: Set<number> = new Set<number>();
  selectedRowData: any[] = [];

  suppliersList = [];
  filter: any = {
    pageSize: 10,
    pageNumber: 1
  };
  showDialog: boolean = false;
  filterLoaded: boolean = false;


  // -------------asset
  totalRows!: number;
  loading2!: boolean;
  employees: NewEmployeeModel[] = [];
  allAssets: [] = [];
  manufacts: [] = [];
  assetNames: [] = [];

  filter2: any = {
    pageSize: 5,
    pageNumber: 1,
  };
  searchFilter: any = {
    pageSize: 5,
    pageNumber: 1,
  };

  searchForm!: FormGroup;
  assetSearchForm!: FormGroup;
  // selectedRowIds2: Set<number> = new Set<number>();
  // selectedRowData2: any[] = [];
  assetsNumberList: any[] = [];
  AssetGroups: any[] = [];
  showmodal2: boolean = false;
  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private api: MaintenanceService,
    public messageService: MessageService,
    public dialogService: DialogService,
    public config: DynamicDialogConfig,
    public assetFormService: AssetFormService,
    private apiModel: ModelService,
    private apiCustomer: CustomerService,
    private api2: EmployeeService,
    private mainService: MaintenanceService,
    private taxonomyService: TaxonomyService,
    private apiAsset: AssetsService,
    private assetGroupService: AssetGroupService, private cdr: ChangeDetectorRef
  ) {
    this.addMaintenanceForm = this.formbuilder.group({
      contractNumber: ['', Validators.required],
      contractName: ['', Validators.required],
      contractTypeId: ['', Validators.required],
      contractStatusId: [],
      startDate: ['', Validators.required],
      numberOfYears: ['', Validators.required],
      calibrationPeriod: [],
      paymentMethod: ['', Validators.required],
      comment: [],
      correctVisits: [],
      sparePartsIncludedInCM: [],
      responseTime: ['', Validators.required],
      invoice: [],
      ContractRelatedId: [],
      maintenanceContractTypeId: [],
      vendorOperationHours: [],
      misUse: [],
      typeOfContractId: [],
      guaranteeUpTime: ['', Validators.required],
      misUseCoverage: [],
      autoRenew: [],
      ettr: ['', Validators.required],
      noOfCorrectiveVisits: [],
      noOfPlannedVisits: [],
      sparePartsIncludedInPM: [],
      maximumSystemFailures: [],
      laborHourlyPrice: [],
      services: [],
      excludedParts: [],
      quoteReferenceNumber: [],
      purchaseOrder: [],
      includeServices: [],
      excludeServices: [],
      currencyId: [],
      assetMContract: this.formbuilder.array([]),
      mContractYearPrice: this.formbuilder.array([]),
      vendorOperationTimes: this.formbuilder.array([]),
      checkedOption: [],
      // supplierId: [],
      supplierNameField: [],
      // siteId: [],
      siteNameField: [],
    });
  }

  ngOnInit(): void {
    this.authService.isAuthenticated = true;
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Create Maintenance Contracts' },
    ];
    this.addMaintenanceForm
      .get('numberOfYears')
      ?.valueChanges.subscribe((years) => {
        this.setYears();
      });
    this.getLookups();
  }

  event(e: any) {
    console.log('Event:', e);
  }

  displayTotal() {
    for (let p = 0; p < this.priceArray.length; p++) {
      let subTotal = 0;

      for (let a = 0; a < this.assetArray.length; a++) {
        subTotal += this.mContractAssetPrices(a).at(p).get('price')?.value ?? 0;
      }

      this.priceArray.at(p).get('price')?.setValue(subTotal);
    }
  }

  //#region vendor Operation Times
  categories: any[] = [
    { name: 'Every day', key: 'E' },
    { name: '24 hrs out of 24 hrs', key: 'M' },
  ];

  first: any;
  sec: any;
  days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  is24Hrs: boolean = false;
  operationEvent(e: any) {
    this.first = true;
    this.is24Hrs = e.value.key === 'M';
    this.setArray(this.first, e.value.key);
  }
  get operationArray() {
    return this.addMaintenanceForm.get('vendorOperationTimes') as FormArray;
  }
  setArray(e: boolean, key: string) {
    (this.addMaintenanceForm.get('vendorOperationTimes') as FormArray).clear();
    if (e && key == 'E') {
      for (let i = 0; i < this.days.length; i++) {
        (this.addMaintenanceForm.get('vendorOperationTimes') as FormArray).push(
          this.formbuilder.group({
            id: 0,
            allDays: true,
            dayName: this.days[i],
            active: true,
            fromTime: [],
            toTime: [],
            hour: [],
            min: [],
          })
        );
      }
    } else {
      for (let i = 0; i < this.days.length; i++) {
        (this.addMaintenanceForm.get('vendorOperationTimes') as FormArray).push(
          this.formbuilder.group({
            id: 0,
            allDays: false,
            dayName: this.days[i],
            active: false,
            fromTime: [],
            toTime: [],
            hour: [],
            min: [],
          })
        );
      }
    }
  }

  eventCheck(e: any) {
    console.log(e);
  }
  //#endregion

  //#region Dialog
  ref!: DynamicDialogRef;
  show() {
    this.assetSearchForm = this.formbuilder.group({
      serialNo: null,
      assetNo: null,
      manufacturer: null,
      assetName: null,
      assetGroup: null
    });
    this.getAssetGroups();
    this.getAssets();
    this.assetSerach();
    this.showmodal2 = true
  }
  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
  //#endregion

  //#region Setting Lookups
  hours: any = [];
  min: any = [];
  getLookups() {
    this.api.getContractType().subscribe((res: any) => {
      this.contractType = res;
      this.contractType.unshift(this.defaultLookup);
    });
    this.api.getContractStatus().subscribe((res: any) => {
      this.contractStatus = res;
      this.contractStatus.unshift(this.defaultLookup);
    });
    this.api.getCurrency().subscribe((res: any) => {
      this.cuurencyId = res;
    });
    this.api.getContractVendor().subscribe((res: any) => {
      this.contractVendor = res;
      this.contractVendor.unshift(this.defaultLookup);
    });
    this.api.getTypeOfContract().subscribe((res: any) => {
      this.typeOfContract = res;
      this.typeOfContract.unshift(this.defaultLookup);
    });
    this.listOfExParts.unshift(this.defaultLookup);
    this.getNumberOfYears();
    this.getMonths();
    Array(24)
      .fill(0)
      .map((x, i) => {
        this.hours.push({ label: `${i + 1}`, value: i + 1 });
      });
    Array(60)
      .fill(0)
      .map((x, i) => {
        this.min.push({ label: `${i + 1}`, value: i + 1 });
      });
  }
  getNumberOfYears() {
    Array(7)
      .fill(0)
      .map((x, i) => {
        this.numberOfYears.push({ label: `${i + 1} Year`, value: i + 1 });
      });
    this.numberOfYears.unshift({ label: 'None', value: null });
  }
  getMonths() {
    Array(12)
      .fill(0)
      .map((x, i) => {
        this.months.push({ label: `${i + 1} Month`, value: i + 1 });
      });
    this.months.unshift({ label: 'None', value: null });
  }
  //#endregion

  //#region No. of Years selection

  selectedCurrency!: number;
  selectedCurrencyId(e: any) {
    this.selectedCurrency = e.value;
  }

  get priceArray() {
    return this.addMaintenanceForm.get('mContractYearPrice') as FormArray;
  }
  onSelectYears(event: any) {
    this.test = event;
    this.addMaintenanceForm.value.numberOfYears = event;
    for (let i = 0; i < this.selectedRowData.length; i++) {
      this.removeMContractAssetPrices(i);
    }
    this.setMContarctAP(this.selectedRowData.length, this.test);
  }
  setYears() {
    this.priceArray.clear();
    for (let i = 0; i < this.test; i++) {
      this.priceArray.push(
        this.formbuilder.group({
          price: ['', Validators.required],
          year: [i + 1],
        })
      );
    }
  }

  //#endregion

  //#region Prices Validations
  eventPro(e: any, fieldName: string) {
    console.log(e);
    let fieldControl = this.addMaintenanceForm.get(fieldName);
    if (e < 0) {
      fieldControl?.setErrors({ incorrect: true });
    }
  }
  eventProArray(e: any, arrayName: string, fieldName: string, index: number) {
    let fieldArray = this.addMaintenanceForm.get(arrayName) as FormArray;
    let fieldControl = fieldArray?.at(index).get(fieldName);
    if (e < 0) {
      fieldControl?.setErrors({ incorrect: true });
    }
  }
  eventProMaxArray(
    e: any,
    arrayName: string,
    fieldName: string,
    subArrayName: string,
    index: number,
    subIndex: number
  ) {
    let fieldArray = this.addMaintenanceForm.get(arrayName) as FormArray;
    let fieldSubArray = fieldArray.at(index).get(subArrayName) as FormArray;
    let fieldControl = fieldSubArray?.at(subIndex).get(fieldName);
    if (e < 0) {
      fieldControl?.setErrors({ incorrect: true });
    }
  }
  //#endregion

  //#region Maintenance contract Assets
  assetData: AssetModel[] = [];

  get assetArray() {
    return this.addMaintenanceForm.get('assetMContract') as FormArray;
  }
  removeAsset(i: number) {
    this.assetArray.removeAt(i);
  }
  getAssetData() {
    this.assetData = [];
    this.selectedRowData.forEach((x) => {
      this.assetData.push(x);
    });
  }
  setAssets() {
    for (let i = 0; i < this.priceArray.length; i++) {
      this.priceArray.at(i).get('price')?.setValue(null);
    }
    this.assetArray.clear();
    this.getAssetData();
    for (let i = 0; i < this.selectedRowData.length; i++) {
      this.assetArray.push(
        new FormGroup({
          assetName: new FormControl(this.assetData[i].assetNumber),
          assetSN: new FormControl(this.assetData[i].assetSerialNo),
          assetId: new FormControl(this.assetData[i].id),
          department: new FormControl(
            this.assetData[i].department.departmentName
          ),
          manufacturerName: new FormControl(
            this.assetData[i].modelDefinition.manufacturerName
          ),
          modelName: new FormControl(
            this.assetData[i].modelDefinition.modelName
          ),
          site: new FormControl(this.assetData[i].site.custName),
          ppmMonths: new FormControl(),
          mContractAssetPrices: new FormArray([]),
        })
      );
    }
    this.setMContarctAP(this.assetData.length, this.test);
  }
  //#endregion

  //#region Assets prices
  mContractAssetPrices(i: number): FormArray {
    return this.assetArray.at(i)?.get('mContractAssetPrices') as FormArray;
  }
  removeMContractAssetPrices(i: number) {
    this.mContractAssetPrices(i).clear();
  }
  setMContarctAP(assetLength: number, noOfPrice: number) {
    for (let i = 0; i < assetLength; i++) {
      for (let j = 0; j < noOfPrice; j++) {
        (this.assetArray.at(i).get('mContractAssetPrices') as FormArray).push(
          this.formbuilder.group({
            id: [0],
            year: [j + 1],
            price: ['', Validators.required],
          })
        );
      }
    }
  }
  //#endregion

  //#region Supplier Methods
  supplierField: boolean = true;
  clientField: boolean = true;
  sitesList: any[] = [];

  getSpplier($event: any) {
    return this.apiModel
      .getSupplier({ suppliername: $event.query })
      .subscribe((res: any) => {
        const data = res.data;
        this.suppliersList = data;
      });
  }

  onSelectSupplier(supplier: any) {
    this.addMaintenanceForm.controls['supplierId'].setValue(supplier.id);
    console.log('Supplier Id', this.addMaintenanceForm.value.supplierId);
  }

  getSite(name: any) {
    this.apiCustomer
      .searchCustomer({ custName: name.query })
      .subscribe((res) => {
        this.sitesList = res.data;
      });
  }

  onSelectSite(site: any) {
    this.addMaintenanceForm.controls['siteId'].setValue(site.id);
    console.log('site Id', this.addMaintenanceForm.value.siteId);
  }

  showField(event: any) {
    console.log('event', event);
    const targetText = event.originalEvent.target?.innerHTML;

    if (targetText.includes('Vendor')) {
      this.supplierField = false;
      this.clientField = true;
      this.addMaintenanceForm.controls['siteId'].setValue({});
      this.addMaintenanceForm.controls['siteId'].setValue(null);
    } else if (targetText.includes('Client')) {
      this.clientField = false;
      this.supplierField = true;
      this.addMaintenanceForm.controls['supplierId'].setValue({});
      this.addMaintenanceForm.controls['supplierId'].setValue(null);
    } else {
      this.clientField = true;
      this.supplierField = true;
      this.addMaintenanceForm.controls['supplierId'].setValue({});
      this.addMaintenanceForm.controls['siteId'].setValue({});
      this.addMaintenanceForm.controls['supplierId'].setValue(null);
      this.addMaintenanceForm.controls['siteId'].setValue(null);
    }
  }
  //#endregion

  //#region Save and Cancel
  addMaintenanceSubmit() {
    debugger
    console.log(this.addMaintenanceForm.value);
    this.isSubmitted = true;
    if (this.addMaintenanceForm.invalid) {
      validateForm.validateAllFormFields(this.addMaintenanceForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.maintenanceModel.contractNumber =
        this.addMaintenanceForm.value.contractNumber;
      this.maintenanceModel.contractName =
        this.addMaintenanceForm.value.contractName;
      this.maintenanceModel.contractTypeId =
        this.addMaintenanceForm.value.contractTypeId;
      this.maintenanceModel.contractStatusId =
        this.addMaintenanceForm.value.contractStatusId;
      this.maintenanceModel.startDate = this.addMaintenanceForm.value.startDate;
      this.maintenanceModel.numberOfYears =
        this.addMaintenanceForm.value.numberOfYears;
      this.maintenanceModel.calibrationPeriod =
        this.addMaintenanceForm.value.calibrationPeriod;
      this.maintenanceModel.paymentMethod =
        this.addMaintenanceForm.value.paymentMethod;
      this.maintenanceModel.comment = this.addMaintenanceForm.value.comment;
      this.maintenanceModel.correctVisits =
        this.addMaintenanceForm.value.correctVisits;
      this.maintenanceModel.sparePartsIncludedInCM =
        this.addMaintenanceForm.value.sparePartsIncludedInCM;
      this.maintenanceModel.responseTime =
        this.addMaintenanceForm.value.responseTime;
      this.maintenanceModel.invoice = this.addMaintenanceForm.value.invoice;
      this.maintenanceModel.ContractRelatedId =
        this.addMaintenanceForm.value.ContractRelatedId;
      this.maintenanceModel.maintenanceContractTypeId =
        this.addMaintenanceForm.value.maintenanceContractTypeId;
      this.maintenanceModel.vendorOperationHours =
        this.addMaintenanceForm.value.vendorOperationHours;
      this.maintenanceModel.misUse = this.addMaintenanceForm.value.misUse;
      this.maintenanceModel.typeOfContractId =
        this.addMaintenanceForm.value.typeOfContractId;
      this.maintenanceModel.guaranteeUpTime =
        this.addMaintenanceForm.value.guaranteeUpTime;
      this.maintenanceModel.misUseCoverage =
        this.addMaintenanceForm.value.misUseCoverage;
      this.maintenanceModel.autoRenew = this.addMaintenanceForm.value.autoRenew;
      this.maintenanceModel.ettr = this.addMaintenanceForm.value.ettr;
      this.maintenanceModel.noOfCorrectiveVisits =
        this.addMaintenanceForm.value.noOfCorrectiveVisits;
      this.maintenanceModel.noOfPlannedVisits =
        this.addMaintenanceForm.value.noOfPlannedVisits;
      this.maintenanceModel.sparePartsIncludedInPM =
        this.addMaintenanceForm.value.sparePartsIncludedInPM;
      this.maintenanceModel.maximumSystemFailures =
        this.addMaintenanceForm.value.maximumSystemFailures;
      this.maintenanceModel.laborHourlyPrice =
        this.addMaintenanceForm.value.laborHourlyPrice;
      this.maintenanceModel.services = this.addMaintenanceForm.value.services;
      this.maintenanceModel.excludedParts =
        this.addMaintenanceForm.value.excludedParts;
      this.maintenanceModel.quoteReferenceNumber =
        this.addMaintenanceForm.value.quoteReferenceNumber;
      this.maintenanceModel.purchaseOrder =
        this.addMaintenanceForm.value.purchaseOrder;
      this.maintenanceModel.assetMContract =
        this.addMaintenanceForm.value.assetMContract;
      this.maintenanceModel.mContractYearPrice =
        this.addMaintenanceForm.value.mContractYearPrice;
      this.maintenanceModel.includeServices =
        this.addMaintenanceForm.value.includeServices;
      this.maintenanceModel.excludeServices =
        this.addMaintenanceForm.value.excludeServices;

      this.maintenanceModel.currencyId =
        this.addMaintenanceForm.value.currencyId;
      this.maintenanceModel.currencyId =
        this.addMaintenanceForm.value.currencyId;
      this.maintenanceModel.supplierId =
        this.addMaintenanceForm.value.supplierId;
      this.maintenanceModel.siteId = this.addMaintenanceForm.value.siteId;

      this.maintenanceModel.vendorOperationTimes = [];
      this.addMaintenanceForm.value.vendorOperationTimes.forEach(
        (element: vendorOperationTimes) => {
          let o = element;
          // console.log(o.fromTime.length);
          if (o.fromTime != null && o.fromTime.length != 8) {
            o.fromTime = dateHelper.ConvertDateToStringTimeOnly(o.fromTime);

          }
          if (o.toTime != null && o.toTime.length != 8) {
            o.toTime = dateHelper.ConvertDateToStringTimeOnly(o.toTime);
          }

          this.maintenanceModel.vendorOperationTimes.push(o);
        }
      );

      console.log(this.addMaintenanceForm.value);
      this.api.postMaintenance(this.maintenanceModel).subscribe((res) => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          this.addMaintenanceForm.reset();
          this.close_modal()
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
  }
  close_modal() {
    this.ngOnInit()
    this.openModals.emit();
    this.showmodal = false
  }
  getAssetsTransferSearch(searchdata: any) {
    this.filter.assetGroup = searchdata;
  }
  async openFilterModal() {
    this.filterLoaded = !this.filterLoaded;
  }
  // ----------------------asset

  Reset() {
    this.searchFilter = {
      pageSize: 5,
      pageNumber: 1,
      serialNo: null,
      assetNo: null,
      manufacturer: null,
      assetName: null,
      assetGroup: null
    };

    this.assetSearchForm.reset();
    this.apiAsset.searchAsset(this.searchFilter).subscribe((res) => {
      console.log('rea', res);
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.allAssets = data;
        this.totalRows = res.totalRows;
        this.cdr.detectChanges()
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

  getAssets() {
    this.mainService.getAssets(this.filter).subscribe((res: any) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.allAssets = data;

      this.cdr.detectChanges()
    });
  }
  paginate(event: any) {
    this.searchFilter.pageNumber = event.page + 1;
    this.searchAsset();

    this.cdr.detectChanges()
  }

  closeDialog() {
    this.showmodal2 = false

    this.cdr.detectChanges()
  }

  nameFilter(name: any) {
    this.filter.employeeName = name;
    this.api2.searchEmployee(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.employees = data;

      this.cdr.detectChanges()
    });
  }
  onSelectName(name: any) {
    this.filter.employeeName = name.userName;
    this.api2.searchEmployee(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.employees = data;

      this.cdr.detectChanges()
    });
  }

  assetSerach() {
    this.searchForm = this.formbuilder.group({
      code: [null],
      assetSerialNumber: [null],
      supplyDateSymbol: [null],
      supplyDateFrom: [null],
      supplyDateTo: [null],
      warrantyEndDateSymbol: [null],
      warrantyEndDateFrom: [null],
      warrantyEndDateTo: [null],
      recievingDateSymbol: [null],
      recievingDateFrom: [null],
      recievingDateTo: [null],
      maintenanceContract: [null],
      assetClassification: [null],
      assetStatus: [null],
      assetNotScraped: [null],
      assetNo: [null],
      modelDefinition: [null],
      site: [null],
      manufacturer: [null],
      assetGroup: [null]
    });
  }
  onRowSelect(event: any) {
    const id = event.data.id;
    const data = event.data;
    if (this.selectedRowData.includes(data)) {
      this.selectedRowIds.delete(id);
      this.selectedRowData.splice(this.selectedRowData.indexOf(data), 1);
    } else {
      this.selectedRowIds.add(id);
      this.selectedRowData.push(data);
    }

    this.cdr.detectChanges()
  }
  onRowUnselect(event: any) {
    const id = event.data.id;
    const data = event.data;
    if (this.selectedRowData.includes(data)) {
      this.selectedRowIds.delete(id);
      this.selectedRowData.splice(this.selectedRowData.indexOf(data), 1);
    } else {
      this.selectedRowIds.add(id);
      this.selectedRowData.push(data);

    }

    this.cdr.detectChanges()
  }
  rowIsSelected(id: number) {
    return this.selectedRowIds.has(id);
  }
  addSerialNumber() {
    this.closeDialog();
    this.selectedRowIds = this.selectedRowIds;
    this.selectedRowData = [];
    this.selectedRowIds.forEach((x) => {
      this.selectedRowData.push(x)
    })
    this.setAssets();

    this.cdr.detectChanges()
  }
  searchAsset() {
    Object.bind(this.searchFilter, this.searchForm.value);
    this.searchFilter.assetGroup = this.assetSearchForm.value.assetGroup;
    this.apiAsset.searchAsset(this.searchFilter).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.allAssets = data;
        this.totalRows = res.totalRows;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });

    this.cdr.detectChanges()
  }
  manfacturersList = [];
  selectManufacturer(event: any) {
    this.searchFilter.pageNumber = 1;
    this.taxonomyService
      .searchManufacturerByName({ name: event.query })
      .subscribe((res) => {
        this.manufacts = res.data;
      });
    this.searchFilter.manufacturer = event.query;

    this.cdr.detectChanges()
  }
  bindManufacturer(event: any) {
    this.searchFilter.manufacturer = event.taxonomyName;

    this.cdr.detectChanges()
  }
  serialNosList = [];
  selectSN(event: any) {
    this.searchFilter.pageNumber = 1;
    this.apiAsset.GetAssetsAutoComplete(event.query).subscribe((res) => {
      this.serialNosList = res.data;

      this.cdr.detectChanges()
    });
    this.searchFilter.assetSerialNumber = event.query;
  }
  bindSN(event: any) {
    this.searchFilter.assetSerialNumber = event.assetSerialNo;

    this.cdr.detectChanges()
  }
  selectAssetNumber(event: any) {
    this.apiAsset
      .GetAssetsAutoCompleteMultiFilter({
        assetNumber: event.query,
      })
      .subscribe((res) => {
        this.assetsNumberList = res.data;

        this.cdr.detectChanges()
      });
    this.searchFilter.assetNo = event.query;
  }
  bindAssetNumber(event: any) {
    this.searchFilter.assetNo = event.assetNumber;
  }

  selectAssetName(event: any) {
    this.apiAsset
      .searchAsset(<any>{ assetName: event.query })
      .subscribe((res) => {
        this.assetNames = res.data;

        this.cdr.detectChanges()
      });
    this.searchFilter.assetName = event.query;
  }
  bindAssetName(event: any) {
    console.log('event', event);
    this.searchFilter.assetName = event.modelDefinition.assetName;
  }

  getAssetGroups() {
    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      this.AssetGroups = res.data

      this.cdr.detectChanges()
    })

  }

}
