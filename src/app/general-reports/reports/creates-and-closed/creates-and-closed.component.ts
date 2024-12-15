import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '../../../services/reports.service';
// import { ReportsService } from 'src/app/data/service/reports.service';
declare var Stimulsoft: any;
@Component({
  selector: 'app-creates-and-closed',
  templateUrl: './creates-and-closed.component.html',
  styleUrls: ['./creates-and-closed.component.scss'],
})
export class CreatesAndClosedComponent {
  searchForm!: FormGroup;
  jobTypes: any[] = [];
  createdStatuses: any[] = [];
  filter: any = {};
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(
    this.options,
    'StiViewer',
    false
  );
  report = Stimulsoft.Report.StiReport.createNewDashboard();
  constructor(
    private reportsService: ReportsService,
    private fb: FormBuilder
  ) {}

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
      fromDate: [],
      toDate: [],
    });
    this.getLookups();

    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il';
    this.report.loadFile('./assets/reports/created.mrt');
    this.report.dictionary.databases.clear();
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  getLookups() {
    this.reportsService.GetLookupFilter(2).subscribe((res) => {
      this.jobTypes = res;
    });
    this.reportsService.GetLookupFilter(6).subscribe((res) => {
      this.createdStatuses = res;
    });
  }
  Search() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    let statuses: any[] = this.searchForm.value.status;
    this.filter.status = [];
    if (statuses != null) {
      statuses.forEach((element) => {
        this.filter.status.push(element.id);
      });
    }

    let jobTypes: any[] = this.searchForm.value.jobType;
    this.filter.jobType = [];
    if (jobTypes != null) {
      jobTypes.forEach((element) => {
        this.filter.jobType.push(element.id);
      });
    }
    this.filter.fromDate = this.searchForm.value.fromDate;
    this.filter.toDate = this.searchForm.value.toDate;

    this.reportsService
      .GetServiceRequestCreated(this.filter)
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
