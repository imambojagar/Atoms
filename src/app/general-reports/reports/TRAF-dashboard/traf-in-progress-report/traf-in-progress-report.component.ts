import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TrafService } from '../../../../services/traf-request.service';
/* import { ReportsService } from 'src/app/data/service/reports.service';
import { TrafService } from 'src/app/data/service/traf-request.service'; */
declare var Stimulsoft: any;

@Component({
  selector: 'app-traf-in-progress-report',
  templateUrl: './traf-in-progress-report.component.html',
  styleUrls: ['./traf-in-progress-report.component.scss']
})


export class TRAFInProgressReportComponent {
  constructor(
    private trafApi: TrafService,
    private fb: FormBuilder,
  ) { }

  loading: boolean = true;

  inProgressCases:any;
  notRecommended:any;
  recommended:any;
  closedCases:any;
  total:any;
  totalExceedsCount:any;
  //progress
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, 'StiViewer', false);
  report = Stimulsoft.Report.StiReport.createNewDashboard();
  ///
  //Team Member
  optionsTeamMember: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewerTeamMember: any = new Stimulsoft.Viewer.StiViewer(this.optionsTeamMember, 'teamMemberViewer', false);
  reportTeamMember = Stimulsoft.Report.StiReport.createNewDashboard();
  ///
  //Site
  optionsSite: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewerSite: any = new Stimulsoft.Viewer.StiViewer(this.optionsSite, 'SiteViewer', false);
  reportSite = Stimulsoft.Report.StiReport.createNewDashboard();
  //
  //Time Frame
  optionsTimeFrame: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewerTimeFrame: any = new Stimulsoft.Viewer.StiViewer(this.optionsTimeFrame, 'TimeFrameViewer', false);
  reportTimeFrame = Stimulsoft.Report.StiReport.createNewDashboard();

  //table
  optionsTable: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewerTable: any = new Stimulsoft.Viewer.StiViewer(this.optionsTable, 'TableViewer', false);
  reportTable = Stimulsoft.Report.StiReport.createNewDashboard();

  ngOnInit() {
    Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il";
    this.report.loadFile("./assets/reports/TRAF_CasesInProgress.mrt");
    this.reportTeamMember.loadFile("./assets/reports/TRAF_CasesInProgressByEmployee.mrt");
    this.reportSite.loadFile("./assets/reports/TRAF_CasesInProgressBySite.mrt");
    this.reportTimeFrame.loadFile("./assets/reports/TRAF_CasesInProgressExceedsTimeFrame.mrt");
    this.reportTable.loadFile("./assets/reports/TRAFStatusTimeFrameTable.mrt");
    this.report.dictionary.databases.clear();
    this.reportTeamMember.dictionary.databases.clear();
    this.reportSite.dictionary.databases.clear();
    this.reportTimeFrame.dictionary.databases.clear();
    this.reportTable.dictionary.databases.clear();
    this.showInProgressReport();
    this.showTimeFrameReport();
    this.showInProgressTeamMemberReport();
    this.showInProgressSiteReport();
    this.showTimeFrameTable();
    this.GetStatistics();

  }

  showInProgressReport() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    this.trafApi.GetTRAFInProgressReport().subscribe((res) => {
      dsMS_SQL.readJson(res);
      this.report.regData("MS SQL", null, dsMS_SQL);
      this.options.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.viewer.report = this.report;
      this.viewer.renderHtml("viewerContent");
      this.loading = false;
    });
  }

  showInProgressTeamMemberReport() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    this.trafApi.GetCasesInProgressByEmployee().subscribe((res) => {
      dsMS_SQL.readJson(res);
      this.reportTeamMember.regData("Ms SQL", null, dsMS_SQL);
      this.optionsTeamMember.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.viewerTeamMember.report = this.reportTeamMember;
      this.viewerTeamMember.renderHtml("teamMemberContent");
      // this.loading=false;
    });
  }

  showInProgressSiteReport() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    this.trafApi.GetCasesInProgressBySite().subscribe((res) => {
      dsMS_SQL.readJson(res);
      this.reportSite.regData("MS SQL", null, dsMS_SQL);
      this.optionsSite.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.viewerSite.report = this.reportSite;
      this.viewerSite.renderHtml("siteContent");
      // this.loading=false;
    });
  }

  showTimeFrameReport() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    this.trafApi.GetCasesInProgressExceedsTimeFrame().subscribe((res) => {
      dsMS_SQL.readJson(res);
      this.reportTimeFrame.regData("MS SQL", null, dsMS_SQL);
      this.optionsTimeFrame.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.viewerTimeFrame.report = this.reportTimeFrame;
      this.viewerTimeFrame.renderHtml("timeFrameContent");
      // this.loading=false;
    });
  }

  showTimeFrameTable() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    this.trafApi.GetTRAFStatusTimeFrameDashboard().subscribe((res) => {
      dsMS_SQL.readJson(res);
      this.reportTable.regData("MS SQL", null, dsMS_SQL);
      this.optionsTable.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.viewerTable.report = this.reportTable;
      this.viewerTable.renderHtml("tableContent");
      // this.loading=false;
    });
  }

  GetStatistics(){
    this.trafApi.GetStatistics().subscribe((res: any)=>{
      console.log("get Statistics res :",res)
      this.inProgressCases=res.inProgressCount;
      this.notRecommended=res.notRecommendedCount;
      this.recommended=res.recommendedCount;
      this.closedCases=res.closedCount;
      this.total=res.total;
      this.totalExceedsCount=res.exceedsCount;
    })
  }

}
