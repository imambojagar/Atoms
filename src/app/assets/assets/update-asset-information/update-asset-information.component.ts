import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Asset } from '../../../models/asset';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedTable } from '../../../shared/components/table/table';
import { AssetsService } from '../../../services/assets.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ModelService } from '../../../services/model-definition.service';
import { AssetGroupService } from '../../../services/asset-group.service';
import { ExportService } from '../../../shared/services/export.service';
import { CustomCardsService } from '../../custom_cards/data/custom-cards.service';
import { LanguagesService } from '../../../services/languages.service';
import { AssetFormService } from '../asset-form.service';
import { AssetGroup } from '../../../shared/enums/asset-group';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
  // NgxQRCodeModule
} from '@techiediaries/ngx-qrcode';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-update-asset-information',
  standalone: true,
  imports: [
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    // NgxQRCodeModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './update-asset-information.component.html',
  styleUrl: './update-asset-information.component.scss',
  providers: [MessageService, AssetFormService, DatePipe],
})
export class UpdateAssetInformationComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  searchFilter = new Asset();
  searchForm!: FormGroup;
  // items = [
  //   { label: 'Home', routerLink: ['/'] },
  //   { label: 'Update Asset Information' },
  // ];
  tableConfig = new SharedTable();
  dataTableLoading: boolean = false;
  showmodal = false;
  showAddModal = false;
  survey: any[] = [];
  selectedSurveys: any[] = [];
  searchValue: string = '';
  addAssetForm!: FormGroup;

  constructor(
    private cdr: ChangeDetectorRef,
    private assetService: AssetsService,
    private fb: FormBuilder,
    public assetFormService: AssetFormService,
    private messageService: MessageService,
    private router: Router,
    private modelService: ModelService,
    private assetGroupService: AssetGroupService,
    private exporteService: ExportService,
    private customCardsService: CustomCardsService,
    private languagesService: LanguagesService
  ) {
    this.addAssetForm = this.fb.group({
      modelDefinitionId: [null],
      deliveryInspectionDate: [null],
      endUserAcceptanceDate: [null],
      siteWarrantyMonthNo: [null],
      poNo: [null],
      purchasePrice: [null],
    });
  }

  modelDefinitionId!: any;
  siteId!: any;
  departmentId!: any;
  deliveryInspectionDate!: any;
  modelsList: any[] = [];
  endUserAcceptanceDate!: any;
  siteWarrantyMonths!: any;
  poNo!: any;
  purchasePrice!: any;
  assetIds: any[] = [];
  ModelDefinitions: any[] = [];
  displayPrintAssets: boolean = false;
  selectedToBePrinte: any[] = [];
  isPrinting: string = 'pi-check';
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  assetGroupsList: any[] = [];
  selectedCustomCardId!: number;
  languageId!: number;
  showDialog: boolean = false;
  customLabelsList: any[] = [];
  languages: any[] = [];
  isCustomPrinting: string = '';
  printTypeList: any[] = [];
  selectedPrintTypeId!: number;
  showDialogPrint: boolean = false;
  userAssetGroups: any[] = [];
  userAssetGroupSelected: any;
  AssetGroupDialogVisible!: boolean;
  assetGroupSelectorForm!: FormGroup;
  selectedGroupId!: number;
  ngOnInit(): void {
    this.userAssetGroups = JSON.parse(
      localStorage.getItem('userAssetGroups') || '{}'
    );
    this.userAssetGroupSelected = JSON.parse(
      localStorage.getItem('slectedAssetGroup') || '{}'
    );

    if (this.userAssetGroupSelected.id == AssetGroup.FM) {
      this.selectedGroupId = this.userAssetGroups[0].id;
      this.printTypeList.push({ id: 1, name: 'ASSET TAG' });
      this.printTypeList.push({ id: 2, name: 'NON HMG PROPERTY' });
      this.printTypeList.push({ id: 3, name: 'PPM EXEMPETED' });
      this.printTypeList.push({ id: 4, name: 'PPM FOR INSTALLATION TAG' });
    } else if (this.userAssetGroupSelected.id == AssetGroup.FMS) {
      this.selectedGroupId = this.userAssetGroups[0].id;
      this.printTypeList.push({ id: 5, name: 'ASSET TAG' });
      this.printTypeList.push({ id: 6, name: 'LOCATION TAG' });
    }

    this.customCardsService.filterCustomCards({}).subscribe((res: any) => {
      this.customLabelsList = res.data;
    });

    this.languagesService.getLanguages({}).subscribe((res: any) => {
      this.languages = res.data;
    });
    this.assetFormService.getLookup();
    this.modelDefinitionId = null;
    this.siteId = null;
    this.departmentId = null;
    this.deliveryInspectionDate = null;
    this.endUserAcceptanceDate = null;
    this.siteWarrantyMonths = null;
    this.poNo = null;
    this.purchasePrice = null;

    this.searchForm = this.fb.group({
      assetSerialNumber: [null],
      supplyDateSymbol: [null],
      supplyDateFrom: [null],
      supplyDateTo: [null],
      warrantyEndDateSymbol: [null],
      warrantyEndDateFrom: [null],
      warrantyEndDateTo: [null],
      delieveryInspectionDateSymbol: [null],
      deliveryInspectionDateFrom: [null],
      deliveryInspectionDateTo: [null],
      maintenanceContract: [null],
      assetClassification: [null],
      assetStatus: [null],
      assetNotScraped: [null],
      assetNo: [null],
      modelDefinition: [null],
      site: [null],
      manufacturer: [null],
      assetGroup: [null],
      modelName: [null],
    });
    this.tableConfig.tableHeaders = [
      'Asset Number',
      'Id',
      'Asset Name',
      'Manufacturer',
      'Model',
      'Site',
      'Department',
      'Serial No',
      'Delivery Inspection Date',
      'Warranty End Date',
      'PO No.',
    ];
    this.tableConfig.deleteRow = false;
    this.tableConfig.editRow = false;
    this.tableConfig.addRow = false;
    this.tableConfig.idHeader = 'Id';

    this.tableConfig.tableName = 'Assets List';
    this.searchAsset();
    this.searchAssetGroup();
  }

  reset() {
    this.searchForm.reset();
    this.searchFilter = new Asset();
    this.searchAsset();
  }

  searchAsset() {
    Object.bind(this.searchFilter, this.searchForm.value);
    this.searchFilter.warrantyEndDateSymbol =
      this.searchForm.value.warrantyEndDateSymbol;
    this.searchFilter.warrantyEndDateFrom =
      this.searchForm.value.warrantyEndDateFrom;
    this.searchFilter.warrantyEndDateTo =
      this.searchForm.value.warrantyEndDateTo;
    this.searchFilter.delieveryInspectionDateSymbol =
      this.searchForm.value.delieveryInspectionDateSymbol;
    this.searchFilter.deliveryInspectionDateFrom =
      this.searchForm.value.deliveryInspectionDateFrom;
    this.searchFilter.deliveryInspectionDateTo =
      this.searchForm.value.deliveryInspectionDateTo;
    this.searchFilter.assetGroup =
      this.searchForm.value.assetGroup == null
        ? null
        : Object({ id: this.searchForm.value.assetGroup, name: '', code: '' });
    this.dataTableLoading = true;
    this.assetService.searchAsset(this.searchFilter).subscribe({
      next: (data) => {
        this.tableConfig.pageFilter.totalItems = data['totalRows'];
        let tableData: any = [];
        this.dataTableLoading = false;
        // data['data']?.forEach((e: any) => {
        //   tableData.push({
        //     'Asset Number': e.assetNumber,
        //     Id: e.id,
        //     'Asset Name': e.modelDefinition.assetName,
        //     Manufacturer: e.modelDefinition.manufacturerName,
        //     Model: e.modelDefinition.modelName,
        //     Site: e.site.custName,
        //     Department: e.department?.departmentName,
        //     'Serial No': e.assetSerialNo,
        //     'Delivery Inspection Date': e.deliveryInspectionDate,
        //     'Warranty End Date': e.warrantyEndDate,
        //     'PO No.': e.poNo,
        //   });
        // });
        data['data']?.forEach((e: any) => {
          tableData.push({
            assetNumber: e.assetNumber,
            id: e.id,
            assetName: e.modelDefinition.assetName,
            manufacturer: e.modelDefinition.manufacturerName,
            model: e.modelDefinition.modelName,
            site: e.site.custName,
            department: e.department?.departmentName,
            serialNo: e.assetSerialNo,
            deliveryInspectionDate: e.deliveryInspectionDate,
            warrantyEndDate: e.warrantyEndDate,
            pONo: e.poNo,
          });
        });
        this.tableConfig.tableData = tableData;
        this.survey = tableData;
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.dataTableLoading = false;
        console.log('error');
        console.error(e);
      },
      complete: () => {
        this.dataTableLoading = false;
        console.log('complete');
      },
    });
    this.searchForm.reset();
    this.close_modal();
  }

  EditRecord(id: any) { }

  // veiwAsset(e: any) {
  //   this.router.navigate(['systemsettings/assets/view-control'], {
  //     queryParams: { id: e },
  //   });
  // }

  paginate(e: any) {
    this.searchFilter.pageNumber = e;
    this.tableConfig.pageFilter.pageNumber = e;
    this.searchAsset();
  }

  selectAssetSN(event: any) {
    this.assetFormService.getAssetsData(event.query);
    this.searchFilter.assetSerialNumber = event.query;
  }
  clearSN() {
    this.searchFilter.assetSerialNumber = '';
  }
  bind(event: any) {
    this.searchFilter.assetSerialNumber = event.assetSerialNo;
  }

  selectAssetNumber(event: any) {
    this.assetFormService.getAssetNumbers(event.query);
    this.searchFilter.assetNo = event.query;
  }
  clearAssetNumber() {
    this.searchFilter.assetNo = '';
  }
  bindAssetNumber(event: any) {
    this.searchFilter.assetNo = event.value.assetNumber;
  }

  onSelectContractor(event: any) {
    this.assetFormService.searchonContractor(event.query);
    this.searchFilter.site = event.query;
  }
  bindContractor(event: any) {
    this.searchFilter.site = event.value.custName;
  }
  clearSite() {
    this.searchFilter.site = '';
  }

  selectModels(event: any) {
    this.modelService.GetModelDefinitionAsset(event.query).subscribe((data) => {
      this.ModelDefinitions = data.data;
      this.searchFilter.modelDefinition = event.query;
    });
  }
  bindModel(event: any) {
    // this.searchFilter.modelDefinition = event.modelDefCode
    this.searchFilter.model = event.modelName;
  }
  clearModel() {
    this.searchFilter.modelDefinition = '';
  }

  selectManufacturer(event: any) {
    this.assetFormService.getManufacturers(event.query);
    this.searchFilter.manufacturer = event.query;
  }

  modelNameFilter(name: any) {
    this.modelService.getModel({ name: name.query }).subscribe((res) => {
      const data = res.data;
      console.log('model name:', data);
      this.modelsList = data;
    });
  }

  bindManufacturer(event: any) {
    this.searchFilter.manufacturer = event.name;
  }
  clearManufacturer() {
    this.searchFilter.manufacturer = '';
  }

  selectModelsSave(event: any) {
    this.modelService.GetModelDefinitionAsset(event.query).subscribe((data) => {
      this.ModelDefinitions = data.data;
      this.modelDefinitionId = null;
    });
  }
  bindModelSave(event: any) {
    this.modelDefinitionId = event.id;
  }
  clearModelSave() {
    this.modelDefinitionId = null;
  }

  onSelectSiteSave(event: any) {
    this.assetFormService.searchonContractor(event.query);
    this.siteId = null;
  }
  bindSiteSave(event: any) {
    this.siteId = event.id;
  }
  clearSiteSave() {
    this.siteId = null;
  }

  selectDepartment(event: any) {
    this.departmentId = event.value;
  }

  onChangeInstallationDate(event: any) {
    this.deliveryInspectionDate = event;
  }
  onInstallationDateClear() {
    this.deliveryInspectionDate = null;
  }

  onChangeAcceptanceDate(event: any) {
    this.endUserAcceptanceDate = event;
  }
  onAcceptanceDateClear() {
    this.endUserAcceptanceDate = null;
  }

  selectWarranty(event: any) {
    this.siteWarrantyMonths = event.value;
  }

  SaveAssets() {
    this.assetIds = [];
    this.tableConfig.selectedItems.forEach((c: any) =>
      this.assetIds.push(c.Id)
    );
    // if (Array.isArray(this.tableConfig.selectedItems)) {
    //   this.tableConfig.selectedItems.forEach((c) => {
    //     this.assetIds.push(c.Id);
    //   });
    // } else {
    //   console.error('selectedItems is not an array:', this.tableConfig.selectedItems);
    // }
    if (this.poNo == '') {
      this.poNo = null;
    }
    if (
      this.modelDefinitionId == null &&
      this.siteId == null &&
      this.departmentId == null &&
      this.deliveryInspectionDate == null &&
      this.endUserAcceptanceDate == null &&
      this.siteWarrantyMonths == null &&
      this.poNo == null &&
      this.purchasePrice == null
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill at least on field to modify',
        life: 3000,
      });
      return;
    }
    if (this.assetIds.length == 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select at least one asset',
        life: 3000,
      });
      return;
    }
    var multiAssets = {
      assetIds: this.assetIds,
      modelDefinitionId: this.modelDefinitionId,
      siteId: this.siteId,
      departmentId: this.departmentId,
      deliveryInspectionDate: this.deliveryInspectionDate,
      endUserAcceptanceDate: this.endUserAcceptanceDate,
      siteWarrantyMonths: this.siteWarrantyMonths,
      poNo: this.poNo,
      purchasePrice: this.purchasePrice,
    };
    this.assetService.updateMultiAssets(multiAssets).subscribe((res: any) => {
      if (res.isSuccess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Update Successfully',
          life: 1000,
        });
        setTimeout(() => {
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['systemsettings/assets/assets-bulk-update']);
        }, 1000);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: res.message,
          life: 3000,
        });
      }
      this.cdr.detectChanges();
    });
  }

  showPrintDialog() {
    this.tableConfig.selectedItems.forEach((c: { [x: string]: any }) =>
      this.selectedToBePrinte.push({ assetNumber: c['Asset Number'] })
    );
    this.displayPrintAssets = true;
  }

  async printAssets() {
    this.isPrinting = 'pi-spin pi-spinner';

    const doc = new jsPDF('p', 'mm');
    let index = 0;
    let lengthArr = this.selectedToBePrinte.length - 1;
    let dataArr: any[] = [];
    let i = 0;
    this.selectedToBePrinte.forEach((x) => {
      const data = document.getElementById('div' + i) as HTMLElement;
      dataArr.push(data);
      i++;
    });
    dataArr.forEach((x) => {
      html2canvas(x).then((canvas: any) => {
        const imgWidth = 50.8;
        const pageHeight = 25;
        let position = 0;
        doc.addImage(canvas, 'PNG', 60, 25, imgWidth, pageHeight, '', 'FAST');
        if (index == lengthArr) {
          doc.save('Downld.pdf');
        } else {
          doc.addPage();
          index++;
        }
      });
    });

    this.isPrinting = 'pi-check';
  }

  exportAsset() {
    console.log('clicked');
    Object.bind(this.searchFilter, this.searchForm.value);
    this.searchFilter.warrantyEndDateSymbol =
      this.searchForm.value.warrantyEndDateSymbol;
    this.searchFilter.warrantyEndDateFrom =
      this.searchForm.value.warrantyEndDateFrom;
    this.searchFilter.warrantyEndDateTo =
      this.searchForm.value.warrantyEndDateTo;
    this.searchFilter.delieveryInspectionDateSymbol =
      this.searchForm.value.delieveryInspectionDateSymbol;
    this.searchFilter.deliveryInspectionDateFrom =
      this.searchForm.value.deliveryInspectionDateFrom;
    this.searchFilter.deliveryInspectionDateTo =
      this.searchForm.value.deliveryInspectionDateTo;
    this.searchFilter.assetGroup =
      this.searchForm.value.assetGroup == null
        ? null
        : Object({ id: this.searchForm.value.assetGroup, name: '', code: '' });

    this.exporteService
      .export(this.searchFilter, 'Asset/ExportAssets')
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
        link.download = 'Assets-Report';
        link.click();
      });
  }

  searchAssetGroup() {
    this.assetGroupService
      .searchAssetGroups({})
      .subscribe((res) => (this.assetGroupsList = res.data));
  }

  downloadPDFToPrintAssets() {
    this.isPrinting = 'pi-spin pi-spinner';
    var assetIds: any[] = [];
    this.tableConfig.selectedItems.forEach((c: any) => assetIds.push(c.Id));

    this.assetService
      .downloadAssetsPDF({
        ids: assetIds,
        selectedPrintTypeId: this.selectedPrintTypeId,
      })
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
        link.target = '_blank';
        // link.download = 'PPM.pdf';
        link.click();
        this.isPrinting = '';
        setTimeout(() => {
          this.isPrinting = 'pi-check';
        }, 2000);
      });
  }

  AssetCardCustomPrint() {
    this.isCustomPrinting = 'pi-spin pi-spinner';
    var assetIds: any[] = [];
    this.tableConfig.selectedItems.forEach((c: any) => assetIds.push(c.Id));

    this.assetService
      .AssetCardCustomPrint({
        ids: assetIds,
        customLabelId: this.selectedCustomCardId,
        languageId: this.languageId,
      })
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'File should open now',
          life: 3000,
        });
        this.showDialog = false;
        var downloadURL = URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        // link.download = 'PPM.pdf';
        link.target = '_blank';
        link.click();
        this.isCustomPrinting = '';
        setTimeout(() => {
          this.isCustomPrinting = 'pi-check';
        }, 2000);
      });
  }

  toggleFilter() {
    this.searchForm.reset();
    this.showmodal = !this.showmodal;
  }

  close_modal() {
    this.showmodal = false;
  }

  toggleAdd() {
    // this.addAssetForm.reset();
    this.showAddModal = !this.showAddModal;
  }

  close_add_modal() {
    this.showAddModal = false;
  }

  onGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value;
    this.dt.filterGlobal(filterValue, 'contains');
  }

  onRowSelect(event: any) {
    const selected = this.selectedSurveys.find(
      (item) => item.id === event.data.id
    );
    if (selected) {
      this.selectedSurveys = this.selectedSurveys.filter(
        (item) => item.id !== event.data.id
      ); // Deselect if already selected
    } else {
      this.selectedSurveys.push(event.data); // Select if not selected
    }
  }

  onSelectionChange(event: any) {
    this.selectedSurveys = event.value; // Update selectedSurveys to reflect the current selection
  }

  onHeaderCheckboxToggle(event: any) {
    if (event.checked) {
      this.selectedSurveys = [...this.survey]; // Select all
    } else {
      this.selectedSurveys = []; // Deselect all
    }
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.survey = this.survey.filter((row: any) =>
        Object.values(row).some((val: any) =>
          String(val).toLowerCase().includes(this.searchValue)
        )
      );
    } else {
      this.resetGlobalFilter();
    }
    this.cdr.detectChanges();
  }

  resetGlobalFilter() {
    this.searchValue = ''; // Clear the search input
    this.searchAsset();
    this.searchAssetGroup();
    this.cdr.detectChanges();
  }
}
