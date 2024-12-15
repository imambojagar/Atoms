import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ReportsService } from '../../../services/reports.service';
// import { ReportsService } from 'src/app/data/service/reports.service';

declare var Stimulsoft: any;

@Component({
  selector: 'app-wo-table',
  templateUrl: './wo-table.component.html',
  styleUrls: ['./wo-table.component.scss'],
})
export class WoTableComponent {
  constructor(
    private reportsService: ReportsService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}
  searchForm!: FormGroup;
  statues!: any[];
  jobTypes!: any[];
  equipmentStatus!: any[];
  filter: any = {};
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(
    this.options,
    'StiViewer',
    false
  );
  report = Stimulsoft.Report.StiReport.createNewDashboard();

  showmodal: boolean = false;
  supplierChecked: boolean = true;
  selectedNames!: any[] | null;
  dataTableLoading: boolean = false;
  addTransferLoaded: boolean = false;
  purchase_order_edit_id: number = 0;

  ngOnInit() {
    this.searchForm = this.fb.group({
      status: [],
      jobType: [],
      equipmentStatus: [],
    });

    this.getLookups();
    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il';
    this.report.loadFile('./assets/reports/wotable.mrt');
    this.report.dictionary.databases.clear();
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  getLookups() {
    this.reportsService.GetLookupFilter(1).subscribe((res) => {
      this.statues = res;
    });
    this.reportsService.GetLookupFilter(2).subscribe((res) => {
      this.jobTypes = res;
    });
    this.reportsService.GetLookupFilter(3).subscribe((res) => {
      this.equipmentStatus = res;
    });
  }

  Search() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    let status: any[] = this.searchForm.value.status;
    this.filter.status = [];
    if (status != null) {
      status.forEach((element) => {
        this.filter.status.push(element.id);
      });
    }
    if (this.filter.status.length == 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Select at least one value from status',
        life: 3000,
      });
      return;
    }
    this.filter.jobType = [];
    let jobType: any[] = this.searchForm.value.jobType;
    if (jobType != null) {
      jobType.forEach((element) => {
        this.filter.jobType.push(element.id);
      });
    }
    if (this.filter.jobType.length == 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Select at least one value from job type',
        life: 3000,
      });
      return;
    }
    this.filter.equipmentStatus = [];
    let equipmentStatus: any[] = this.searchForm.value.equipmentStatus;
    if (equipmentStatus != null) {
      equipmentStatus.forEach((element) => {
        this.filter.equipmentStatus.push(element.id);
      });
    }
    if (this.filter.equipmentStatus.length == 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Select at least one value from equipment status',
        life: 3000,
      });
      return;
    }
    this.reportsService
      .GetServiceRequestTableReport(this.filter)
      .subscribe((res) => {
        dsMS_SQL.readJson(res);
        this.report.regData('MS SQL', null, dsMS_SQL);
        // this.options.appearance.fullScreenMode = true;
        this.options.toolbar.displayMode =
          Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
        this.viewer.report = this.report;
        this.viewer.renderHtml('viewerContent');
      });
  }

  Reset() {
    this.searchForm.reset();
    this.Search();
  }
}
