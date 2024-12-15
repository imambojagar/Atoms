import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { ModalConfig } from '../../../_metronic/partials';
import { DashboardService } from '../../../dashboard/dashboard/dashboard.service';
/* import { ModalConfig } from 'src/app/_metronic/partials';
import { DashboardService } from 'src/app/data/service/dashboard.service'; */

declare var Stimulsoft: any;
@Component({
  selector: 'app-mission-critical-wo-per-site',
  templateUrl: './mission-critical-wo-per-site.component.html',
  styleUrls: ['./mission-critical-wo-per-site.component.scss'],
})
export class MissionCriticalWoPerSiteComponent implements OnInit {
  /* modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
  }; */

  searchForm!: FormGroup;
  sites: any[] = [];
  assetGroupName: string = '';
  periods: any[] = [];
  situations: any[] = [];
  periodsDraw: any[] = [];

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
        this.periods = periodsRes;
        this.periodsDraw = periodsRes;
        this.searchForm.controls['periods'].setValue(this.periods);
        this.dashboardService.GetLookupFilter(5).subscribe((situationsRes) => {
          this.situations = situationsRes;
          this.searchForm.controls['situations'].setValue(situationsRes);
          this.getMissionCriticalWoPerSitePieChart();
          this.getMissionCriticalWoPerSitePivot();
        });
      });
    });
  }

  onChangeChart5And6(event: any) {
    this.periodsDraw = this.searchForm.value.periods;
    this.getMissionCriticalWoPerSitePieChart();
    this.getMissionCriticalWoPerSitePivot();
  }

  getMissionCriticalWoPerSitePieChart() {
    var filter: any = {};
    filter.sites = [];
    let sites: any[] = this.searchForm.value.sites;
    if (sites != null) {
      sites.forEach((element) => {
        filter.sites.push(element.id);
      });
    }

    filter.periods = [];
    var periods: any[] = this.searchForm.value.periods;
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
      .GetDashboard5(filter)
      .subscribe((callSituationRes) => {
        periods.forEach((p) => {
          var res = callSituationRes.filter((x) => x.periodName == p.name);
          let optionsChart1: any = new Stimulsoft.Viewer.StiViewerOptions();
          let viewerChart1: any = new Stimulsoft.Viewer.StiViewer(
            optionsChart1,
            'StiViewer5' + p.id,
            false
          );
          let report = Stimulsoft.Report.StiReport.createNewDashboard();
          report.loadFile('./assets/reports/wopersite.mrt');
          let dsMS_SQL = new Stimulsoft.System.Data.DataSet();
          dsMS_SQL.readJson(res);
          report.regData('MS SQL', null, dsMS_SQL);
          optionsChart1.appearance.fullScreenMode = false;
          optionsChart1.toolbar.displayMode =
            Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
          optionsChart1.toolbar.visible = false;
          viewerChart1.report = report;
          optionsChart1.height = '400px';
          viewerChart1.renderHtml('chart5' + p.id);
        });
      });
  }

  getMissionCriticalWoPerSitePivot() {
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
      .GetDashboard6(filter)
      .subscribe((callSituationRes) => {
        let optionsChart1: any = new Stimulsoft.Viewer.StiViewerOptions();
        let viewerChart1: any = new Stimulsoft.Viewer.StiViewer(
          optionsChart1,
          'StiViewer6',
          false
        );
        let report = Stimulsoft.Report.StiReport.createNewDashboard();
        report.loadFile('./assets/reports/chart6.mrt');
        let dsMS_SQL = new Stimulsoft.System.Data.DataSet();
        dsMS_SQL.readJson(callSituationRes);
        report.regData('MS SQL', null, dsMS_SQL);
        optionsChart1.appearance.fullScreenMode = false;
        optionsChart1.toolbar.displayMode =
          Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
        optionsChart1.toolbar.visible = false;
        viewerChart1.report = report;
        optionsChart1.height = '400px';
        viewerChart1.renderHtml('chart6');
      });
  }
}
