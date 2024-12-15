import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '../../../services/reports.service';
import { LookupService } from '../../../services/lookup.service';
/* import { LookupService } from 'src/app/data/service/lookup.service';
import { ReportsService } from 'src/app/data/service/reports.service'; */

declare var Stimulsoft: any;

@Component({
  selector: 'app-service-request-report',
  templateUrl: './service-request-report.component.html',
  styleUrls: ['./service-request-report.component.scss'],
})
export class ServiceRequestReportComponent implements OnInit {
  constructor(
    private reportService: ReportsService,
    private fb: FormBuilder,
    private lookupService: LookupService
  ) {}

  searchForm!: FormGroup;
  filter: any = {};
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(
    this.options,
    'StiViewer',
    false
  );
  report = Stimulsoft.Report.StiReport.createNewDashboard();
  firstDayOfMonth: any;
  lastDayOfMonth: any;
  showmodal: boolean = false;
  supplierChecked: boolean = true;
  selectedNames!: any[] | null;
  dataTableLoading: boolean = false;
  addTransferLoaded: boolean = false;
  purchase_order_edit_id: number = 0;

  ngOnInit() {
    var today = new Date();
    this.firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    this.searchForm = this.fb.group({
      assetNumber: [],
      serviceRequestNo: [],
      startDate: [],
      endDate: [],
    });
    this.searchForm.controls['startDate'].setValue(this.firstDayOfMonth);
    this.searchForm.controls['endDate'].setValue(this.lastDayOfMonth);
    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il';
    this.report.loadFile('./assets/reports/servicerequestreport.mrt');
    this.report.dictionary.databases.clear();
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  Search() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    this.filter.assetNumber = this.searchForm.value.assetNumber;
    this.filter.serviceRequestNo = this.searchForm.value.serviceRequestNo;
    this.filter.startDate = this.searchForm.value.startDate;
    this.filter.endDate = this.searchForm.value.endDate;
    this.reportService
      .GetServiceRequestsReport(this.filter)
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
