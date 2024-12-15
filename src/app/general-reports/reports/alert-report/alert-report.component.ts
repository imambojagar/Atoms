import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '../../../services/reports.service';
// import { ReportsService } from 'src/app/data/service/reports.service';
declare var Stimulsoft: any;
@Component({
  selector: 'app-alert-report',
  templateUrl: './alert-report.component.html',
  styleUrls: ['./alert-report.component.scss'],
})
export class AlertReportComponent {
  searchForm!: FormGroup;
  periods: any[] = [];
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
      periods: [],
    });
    this.getLookups();

    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il';
    this.report.loadFile('./assets/reports/alerrtreport.mrt');
    this.report.dictionary.databases.clear();
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  getLookups() {
    this.reportsService.GetLookupFilter(4).subscribe((res) => {
      this.periods = res;
    });
  }
  Search() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    let periods: any[] = this.searchForm.value.periods;
    this.filter.periods = [];
    if (periods != null) {
      periods.forEach((element) => {
        this.filter.periods.push(element.id);
      });
    }

    this.reportsService.GetServiceRequestAlert(this.filter).subscribe((res) => {
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
