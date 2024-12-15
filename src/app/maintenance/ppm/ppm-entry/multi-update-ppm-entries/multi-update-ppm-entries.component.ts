import { TaxonomyService } from 'src/app/data/service/taxonomy.service';
import { FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PpmEntryModel } from 'src/app/data/models/ppm-entry-model';
import { AssetsService } from 'src/app/data/service/assets.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { PPMEntryService } from 'src/app/data/service/ppm-entry.service';
import validateForm from 'src/app/shared/helpers/validateForm';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';
import { CustomCardsService } from 'src/app/modules/systemsettings/custom-cards/data/custom-cards.service';
import { LanguagesService } from 'src/app/data/service/languages.service';

@Component({
  selector: 'multi-update-ppm-entries',
  templateUrl: './multi-update-ppm-entries.component.html',
  styleUrls: ['./multi-update-ppm-entries.component.scss'],
})
export class MultiUpdatePpmEntriesComponent {
  ppmEntryModel: PpmEntryModel = new PpmEntryModel();
  searchForm!: FormGroup;
  visites: [] = [];
  items!: MenuItem[];
  period: [] = [];
  assigned: [] = [];
  TypeService: [] = [];
  visitStatus: [] = [];
  taskStatus: [] = [];
  deviceStatus: [] = [];
  tasks: [] = [];
  employee: [] = [];
  schduleList: [] = [];
  serialList: [] = [];
  assetNumberList: [] = [];
  assetNames: [] = [];
  siteList: [] = [];
  models: [] = [];
  totalRows!: number;
  loading!: boolean;
  fromFlag: boolean = false;
  toFlag: boolean = false;
  isChecked: any[] = [];
  selectedRowIds: Array<number> = new Array<number>();
  serialNumbersArray: Set<string> = new Set<string>();
  updateVisitForm!: FormGroup;
  actualDate: Date | null = null;
  engineerId: any;

  //filter
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  isPrinting: string = '';
  isCustomPrinting: string = '';
  AssetGroups: any[] = [];

  showDialog: boolean = false;
  customLabelsList: any[] = [];

  selectedCustomCardId: number;
  languageId: number;
  ppmIdToPrint: number;

  languages: any[] = [];

  constructor(
    private siteApi: CustomerService,
    public modelService: TaxonomyService,
    private assetApi: AssetsService,
    private formbuilder: FormBuilder,
    private api: PPMEntryService,
    private messageService: MessageService,
    private router: Router,
    private employeeService: EmployeeService,
    private assetGroupService: AssetGroupService,
    private customCardsService: CustomCardsService,
    private languagesService: LanguagesService
  ) {}
  ngOnInit(): void {
    this.getAssetGroups();
    this.customCardsService.filterCustomCards({}).subscribe((res: any) => {
      this.customLabelsList = res.data;
    });
    this.updateVisitForm = this.formbuilder.group({
      assignedEmployeeId: ['', Validators.required],
    });
    this.languagesService.getLanguages({}).subscribe((res: any) => {
      this.languages = res.data;
    });
    this.searchForm = this.formbuilder.group({
      classification: null,
      visitStatusId: null,
      deviceStatusId: null,
      groupLeaderReviewId: null,
      assignedEmployeeId: null,
      assignedToId: null,
      assetId: null,
      ppmId: null,
      siteId: null,
      ppmScheduleId: null,
      expectedDateFrom: null,
      expectedDateTo: null,
      actualDateFrom: null,
      actualDateTo: null,
      planNo: null,
      modelId: null,
      jobSheetNo: null,
      assetGroup: null,
    });
    this.Reset();
    this.getDeviceStatus();
    this.getTaskReview();
    this.getTypeService();
    this.getVisitStatus();
    this.getEmployee();
    this.getTaskStatus();
    this.getAssignedTo();

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'PPM Entries List' },
    ];
  }

  navToDetails(row: any, index: number) {
    console.log('row', row);
    this.ppmEntryModel.id = row;
    this.router.navigate(['/maintenance/ppm/ppm-entry/edit-control'], {
      queryParams: { data: row, index },
    });
  }

  getEmployee() {
    this.employeeService
      .GetUserByRoleValueSiteAndAssetGroup('R-6')
      .subscribe((res: any) => {
        this.employee = res;
      });
  }

  changeEngineer(event: any) {
    this.updateVisitForm.value.assignedEmployeeId = event.value;
  }

  onRowSelect(event: any) {
    console.log('checkbox', event);
    const id = event.data.id;
    this.selectedRowIds.push(id);
    console.log('this.isChecked', this.isChecked);
    console.log('this.selectedRowIds', this.selectedRowIds);
  }

  onRowUnselect(event: any) {
    console.log('uncheckbox', event);
    const id = event.data.id;
    this.selectedRowIds.forEach((value, index) => {
      if (value == id) {
        this.selectedRowIds.splice(index, 1);
      }
    });

    console.log('this.selectedRowIds', this.selectedRowIds);
    console.log('this.isChecked', this.isChecked);
  }

  onSelectAll(event: any) {
    console.log('event', event);
    console.log('this.isChecked', this.isChecked);
    if (event.checked == true) {
      this.isChecked.forEach((a: any) => this.selectedRowIds.push(a.id));
    } else {
      this.selectedRowIds = [];
    }
  }

  //#region Print PPMs Dialog
  downloadPDFToPrintPPMs() {
    this.isPrinting = 'pi-spin pi-spinner';
    var selectedPPM: any[] = [];
    this.isChecked.forEach((a: any) => selectedPPM.push(a.id));
    this.api.downloadPPMsPDF({ ids: selectedPPM }).subscribe((res) => {
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

  VisitCardCustomPrint() {
    this.isCustomPrinting = 'pi-spin pi-spinner';
    var selectedPPM: any[] = [];
    this.isChecked.forEach((a: any) => selectedPPM.push(a.id));
    this.api
      .VisitCardCustomPrint({
        ids: selectedPPM,
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
  //#endregion

  updateVisit() {
    if (this.updateVisitForm.invalid) {
      validateForm.validateAllFormFields(this.updateVisitForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.ppmEntryModel.ids = this.selectedRowIds;
      this.ppmEntryModel.assignedEmployeeId =
        this.updateVisitForm.value.assignedEmployeeId;
      console.log('this.ppmEntryModel', this.ppmEntryModel);
      this.api.updateVisits(this.ppmEntryModel).subscribe((res) => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          this.isChecked = [];
          this.selectedRowIds = [];
          this.updateVisitForm.reset();
          this.getAllVisites();
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

  getAllVisites() {
    this.filter.assetGroup = this.searchForm.value.assetGroup;
    this.api.getVisits(this.filter).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.visites = data;
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
  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.getAllVisites();
    this.loading = false;
  }

  getTypeService() {
    this.api.getLookups({ queryParams: 33 }).subscribe((res) => {
      this.TypeService = res.data;
    });
  }

  getVisitStatus() {
    this.api.getLookups({ queryParams: 402 }).subscribe((res) => {
      this.visitStatus = res.data;
    });
  }

  getDeviceStatus() {
    this.api.getLookups({ queryParams: 401 }).subscribe((res) => {
      this.deviceStatus = res.data;
    });
  }

  getTaskReview() {
    this.api.getLookups({ queryParams: 404 }).subscribe((res) => {
      this.tasks = res.data;
    });
  }
  getAssignedTo() {
    this.api.getLookups({ queryParams: 33 }).subscribe((res) => {
      this.assigned = res.data;
    });
  }

  getTaskStatus() {
    this.api.getLookups({ queryParams: 403 }).subscribe((res) => {
      this.taskStatus = res.data;
    });
  }
  changeVisitStatus(event: any) {
    this.updateVisitForm.value.visitStatusId = event.value;
    console.log('event.value', event.value);
  }
  changeTaskStatus(event: any) {
    this.updateVisitForm.value.taskStatusId = event.value;
    console.log('event.value', event.value);
  }
  changeReview(event: any) {
    this.updateVisitForm.value.deviceStatusId = event.value;
    console.log('event.value', event.value);
  }
  changeAssigned(event: any) {
    // this.addPpmForm.value.assignedToId=event.value;
    // console.log(" this.addPpmForm.value.assignedToId", this.addPpmForm.value.assignedToId)
  }

  selectAssetSN(event: any) {
    this.assetApi.GetAssetsAutoComplete(event.query).subscribe((res) => {
      this.serialList = res.data;
    });
  }

  onAssetNumberSelect(number: any) {
    this.filter.assetId = number.id.toString();
  }
  assetNumberFilter(event: any) {
    this.filter.pageNumber = 1;
    this.assetApi
      .GetAssetsAutoCompleteMultiFilter({ assetNumber: event.query })
      .subscribe((res) => {
        this.assetNumberList = res.data;
      });
  }

  assetNameFilter(event: any) {
    this.assetApi
      .searchAsset(<any>{ assetName: event.query })
      .subscribe((res) => {
        this.assetNames = res.data;
      });
  }
  changeVisitStatuse(event: any) {
    this.filter.visitStatusId = event.value;
  }
  changeDevice(event: any) {
    this.filter.deviceStatusId = event.value;
  }

  changeTasks(event: any) {
    this.filter.groupLeaderReviewId = event.value;
  }
  changeEmployee(event: any) {
    this.filter.assignedEmployeeId = event.value;
  }

  changeService(typeId: any) {
    this.filter.typeOfServiceId = typeId.value;
  }

  onSiteSelect(number: any) {
    this.filter.siteId = number.id;
  }
  siteNumberFilter(event: any) {
    this.filter.pageNumber = 1;
    this.siteApi.searchCustomer({ custName: event.query }).subscribe((res) => {
      const data = res.data;
      console.log('asset serial list', data);
      this.siteList = data;
    });
  }

  modelFilter(event: any) {
    this.filter.pageNumber = 1;
    this.modelService.searchTaxonomy({ name: event.query }).subscribe((res) => {
      this.models = res.data;
    });
  }

  onInput($event: any) {
    this.filter.jobSheetNo = $event.target.value;
  }
  search() {
    this.getAllVisites();
  }
  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      classification: null,
      visitStatusId: null,
      deviceStatusId: null,
      groupLeaderReviewId: null,
      assignedEmployeeId: null,
      assignedToId: null,
      assetId: null,
      ppmId: null,
      siteId: null,
      ppmScheduleId: null,
      expectedDateFrom: null,
      expectedDateTo: null,
      actualDateFrom: null,
      actualDateTo: null,
      planNo: null,
      modelId: null,
      jobSheetNo: null,
      assetGroup: null,
    };
    this.searchForm.reset();
    this.getAllVisites();
  }

  getAssetGroups() {
    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      this.AssetGroups = res.data;
    });
  }
}
