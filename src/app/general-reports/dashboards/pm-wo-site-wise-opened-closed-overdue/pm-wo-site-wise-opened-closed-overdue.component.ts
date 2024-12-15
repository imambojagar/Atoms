import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
/* import { ModalConfig } from '../../../_metronic/partials'; */
import { DashboardService } from '../../../dashboard/dashboard/dashboard.service';
/* import { ModalConfig } from 'src/app/_metronic/partials';
import { DashboardService } from 'src/app/data/service/dashboard.service'; */

declare var Stimulsoft: any;
@Component({
  selector: 'app-pm-wo-site-wise-opened-closed-overdue',
  templateUrl: './pm-wo-site-wise-opened-closed-overdue.component.html',
  styleUrls: ['./pm-wo-site-wise-opened-closed-overdue.component.scss'],
})
export class PmWoSiteWiseOpenedClosedOverdueComponent implements OnInit {
  /* modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
  }; */

  searchForm5!: FormGroup;
  sites: any[] = [];
  assetGroupName: string = '';

  constructor(
    private dashboardService: DashboardService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il';
    var today = new Date();
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.searchForm5 = this.fb.group({
      sites: [],
      dateFrom: [firstDayOfMonth],
      dateTo: [lastDayOfMonth],
    });

    var assetGroups = JSON.parse(
      localStorage.getItem('slectedAssetGroup') || '{}'
    );

      if (assetGroups.id == 1) {
        this.assetGroupName = 'FM';
        this.getChartFM();
      } else if (assetGroups.id == 2) {
        this.assetGroupName = 'FMS';
      }

  }

  getChartFM() {
    this.dashboardService.GetDashboardSites().subscribe((sitesRes) => {
      this.sites = sitesRes;
      this.searchForm5.controls['sites'].setValue(sitesRes);
      this.getPmWOSiteWiseOpenedClosedOverdueParChart();
      this.getPmWOSiteWiseOpenedClosedOverduePieChart();
    });
  }

  onChangeChart9(event: any) {
    this.sites = this.searchForm5.value.sites;
    this.getPmWOSiteWiseOpenedClosedOverdueParChart();
    this.getPmWOSiteWiseOpenedClosedOverduePieChart();
  }

  getPmWOSiteWiseOpenedClosedOverdueParChart() {
    var filter: any = {};
    filter.sites = [];
    let sites: any[] = this.searchForm5.value.sites;
    if (sites != null) {
      sites.forEach((element) => {
        filter.sites.push(element.id);
      });
    }
    filter.dateFrom = this.searchForm5.value.dateFrom;
    filter.dateTo = this.searchForm5.value.dateTo;
    this.dashboardService
      .GetDashboard9(filter)
      .subscribe((callSituationRes) => {
        let optionsChart1: any = new Stimulsoft.Viewer.StiViewerOptions();
        let viewerChart1: any = new Stimulsoft.Viewer.StiViewer(
          optionsChart1,
          'StiViewer9',
          false
        );
        let report = Stimulsoft.Report.StiReport.createNewDashboard();
        report.loadFile('./assets/reports/chart9.mrt');
        let dsMS_SQL = new Stimulsoft.System.Data.DataSet();
        dsMS_SQL.readJson(callSituationRes);
        report.regData('MS SQL', null, dsMS_SQL);
        optionsChart1.appearance.fullScreenMode = false;
        optionsChart1.toolbar.displayMode =
          Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
        optionsChart1.toolbar.visible = false;
        viewerChart1.report = report;
        optionsChart1.height = '400px';
        viewerChart1.renderHtml('chart9');
      });
  }

  getPmWOSiteWiseOpenedClosedOverduePieChart() {
    var filter: any = {};
    filter.sites = [];
    let sites: any[] = this.searchForm5.value.sites;
    if (sites != null) {
      sites.forEach((element) => {
        filter.sites.push(element.id);
      });
    }
    filter.dateFrom = this.searchForm5.value.dateFrom;
    filter.dateTo = this.searchForm5.value.dateTo;
    this.dashboardService
      .GetDashboard9(filter)
      .subscribe((callSituationRes) => {
        sites.forEach((element) => {
          var res = callSituationRes.filter((x) => x.siteName == element.name);
          let optionsChart1: any = new Stimulsoft.Viewer.StiViewerOptions();
          let viewerChart1: any = new Stimulsoft.Viewer.StiViewer(
            optionsChart1,
            'StiViewer10' + element.id,
            false
          );
          let report = Stimulsoft.Report.StiReport.createNewDashboard();
          report.loadFile('./assets/reports/chart10.mrt');
          let dsMS_SQL = new Stimulsoft.System.Data.DataSet();
          dsMS_SQL.readJson(res);
          report.regData('MS SQL', null, dsMS_SQL);
          optionsChart1.appearance.fullScreenMode = false;
          optionsChart1.toolbar.displayMode =
            Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
          optionsChart1.toolbar.visible = false;
          viewerChart1.report = report;
          optionsChart1.width = '100%';
          optionsChart1.height = '400px';
          viewerChart1.renderHtml('chart10' + element.id);
        });
      });
  }
}
