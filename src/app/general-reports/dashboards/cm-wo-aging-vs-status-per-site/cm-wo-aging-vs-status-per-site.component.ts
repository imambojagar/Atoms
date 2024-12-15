import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DashboardService } from '../../../dashboard/dashboard/dashboard.service';
// import { ModalConfig } from '../../../_metronic/partials';
/* import { ModalConfig } from 'src/app/_metronic/partials';
import { DashboardService } from 'src/app/data/service/dashboard.service'; */

declare var Stimulsoft: any;
@Component({
  selector: 'app-cm-wo-aging-vs-status-per-site',
  templateUrl: './cm-wo-aging-vs-status-per-site.component.html',
  styleUrls: ['./cm-wo-aging-vs-status-per-site.component.scss'],
})
export class CmWoAgingVsStatusPerSiteComponent implements OnInit {
 /*  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
  }; */

  searchForm!: FormGroup;
  sites: any[] = [];
  assetGroupName: string = '';
  periods: any[] = [];
  situations: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il';
    this.searchForm = this.fb.group({
      periods: [],
      sites: [],
      situations: [],
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
      this.searchForm.controls['sites'].setValue(sitesRes);
      this.dashboardService.GetLookupFilter(7).subscribe((periodsRes) => {
        this.periods = periodsRes.filter((x) => x.id != 1);

        this.searchForm.controls['periods'].setValue(this.periods);

        this.dashboardService.GetLookupFilter(5).subscribe((situationsRes) => {
          this.situations = situationsRes;
          this.searchForm.controls['situations'].setValue(situationsRes);

          this.getChart_CM_WO_AgingStatusPerSiteParChart();
          this.getChart_CM_WO_AgingStatusPerSitePivot();
        });
      });
    });
  }

  onChangeChart1And2(event: any) {
    this.getChart_CM_WO_AgingStatusPerSiteParChart();
    this.getChart_CM_WO_AgingStatusPerSitePivot();
  }

  getChart_CM_WO_AgingStatusPerSiteParChart() {
    var filter: any = {};
    filter.sites = [];
    let sites: any[] = this.searchForm.value.sites;
    if (sites != null) {
      sites.forEach((element) => {
        filter.sites.push(element.id);
      });
    }

    filter.periods = [];
    let periods: any[] = this.searchForm.value.periods;
    if (periods != null) {
      periods.forEach((element) => {
        filter.periods.push(element.id);
      });
    }

    filter.situations = [];
    let situations: any[] = this.searchForm.value.situations;
    if (situations != null) {
      situations.forEach((element) => {
        filter.situations.push(element.id);
      });
    }

    this.dashboardService
      .GetDashboard1(filter)
      .subscribe((callSituationRes) => {
        let optionsChart1: any = new Stimulsoft.Viewer.StiViewerOptions();
        let viewerChart1: any = new Stimulsoft.Viewer.StiViewer(
          optionsChart1,
          'StiViewer1',
          false
        );
        let report = Stimulsoft.Report.StiReport.createNewDashboard(
          false,
          true
        );
        report.loadFile('./assets/reports/woaging.mrt');
        let dsMS_SQL = new Stimulsoft.System.Data.DataSet();
        dsMS_SQL.readJson(callSituationRes);
        report.regData('MS SQL', null, dsMS_SQL);
        optionsChart1.appearance.fullScreenMode = false;
        optionsChart1.toolbar.displayMode =
          Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
        optionsChart1.toolbar.visible = false;
        viewerChart1.report = report;
        optionsChart1.height = '400px';
        viewerChart1.renderHtml('chart1');
      });
  }

  getChart_CM_WO_AgingStatusPerSitePivot() {
    var filter: any = {};
    filter.sites = [];
    let sites: any[] = this.searchForm.value.sites;
    if (sites != null) {
      sites.forEach((element) => {
        filter.sites.push(element.id);
      });
    }

    filter.periods = [];
    let periods: any[] = this.searchForm.value.periods;
    if (periods != null) {
      periods.forEach((element) => {
        filter.periods.push(element.id);
      });
    }

    filter.situations = [];
    let situations: any[] = this.searchForm.value.situations;
    if (situations != null) {
      situations.forEach((element) => {
        filter.situations.push(element.id);
      });
    }

    this.dashboardService
      .GetDashboard2(filter)
      .subscribe((callSituationRes) => {
        let optionsChart1: any = new Stimulsoft.Viewer.StiViewerOptions();
        let viewerChart1: any = new Stimulsoft.Viewer.StiViewer(
          optionsChart1,
          'StiViewer2',
          false
        );
        let report = Stimulsoft.Report.StiReport.createNewDashboard();
        report.loadFile('./assets/reports/branch.mrt');
        let dsMS_SQL = new Stimulsoft.System.Data.DataSet();
        dsMS_SQL.readJson(callSituationRes);
        report.regData('MS SQL', null, dsMS_SQL);
        optionsChart1.appearance.fullScreenMode = false;
        optionsChart1.toolbar.displayMode =
          Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
        optionsChart1.toolbar.visible = false;
        viewerChart1.report = report;
        optionsChart1.height = '400px';
        viewerChart1.renderHtml('chart2');
      });
  }
}
