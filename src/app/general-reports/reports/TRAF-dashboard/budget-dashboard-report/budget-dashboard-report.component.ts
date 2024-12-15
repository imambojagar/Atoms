import { Component } from '@angular/core';
import { TrafService } from '../../../../services/traf-request.service';
// import { TrafService } from 'src/app/data/service/traf-request.service';
declare var Stimulsoft: any;
@Component({
  selector: 'app-budget-dashboard-report',
  templateUrl: './budget-dashboard-report.component.html',
  styleUrls: ['./budget-dashboard-report.component.scss']
})
export class BudgetDashboardReportComponent {
  years: any[] = [];

  constructor(
    private trafApi: TrafService
  ) { }

  //BudgetConversion
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, 'StiViewer', false);
  report = Stimulsoft.Report.StiReport.createNewDashboard();

  //BudgetValue
  optionsBudgetValue: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewerBudgetValue: any = new Stimulsoft.Viewer.StiViewer(this.optionsBudgetValue, 'BudgetValueViewer', false);
  reportBudgetValue = Stimulsoft.Report.StiReport.createNewDashboard();
  budgetYear: number = new Date().getFullYear();

   //BudgetConversion&PR
   optionsPR: any = new Stimulsoft.Viewer.StiViewerOptions();
   viewerPR: any = new Stimulsoft.Viewer.StiViewer(this.optionsPR, 'PRViewer', false);
   reportPR = Stimulsoft.Report.StiReport.createNewDashboard();

    //BudgetSurplus
    optionsSurplus: any = new Stimulsoft.Viewer.StiViewerOptions();
    viewerSurplus: any = new Stimulsoft.Viewer.StiViewer(this.optionsSurplus, 'SurplusViewer', false);
    reportSurplus = Stimulsoft.Report.StiReport.createNewDashboard();
    surplusBudgetYear: number = new Date().getFullYear();
  ngOnInit() {
    this.getYears();
    Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il";
    this.report.loadFile("./assets/reports/TRAF_BudgetConversionRateBySite.mrt");
    this.reportBudgetValue.loadFile("./assets/reports/TRAF_BudgetValueBySite.mrt");
    this.reportPR.loadFile("./assets/reports/TRAF_BudgetConversionRateRequestAndPRBySite.mrt");
    this.reportSurplus.loadFile("./assets/reports/TRAF_BudgetValueSurplusBySite.mrt");
    this.report.dictionary.databases.clear();
    this.reportBudgetValue.dictionary.databases.clear();
    this.reportPR.dictionary.databases.clear();
    this.reportSurplus.dictionary.databases.clear();
    this.showBudgetConversionReport();
    this.showBudgetValueReport();
    this.showBudgetPRReport();
    this.showBudgetSurplusReport();
    console.log("budgetYear", this.budgetYear)
  }

  showBudgetConversionReport() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    this.trafApi.GetBudgetConversionRateBySite().subscribe((res) => {
      dsMS_SQL.readJson(res);
      this.report.regData("MS SQL", null, dsMS_SQL);
      this.options.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.viewer.report = this.report;
      this.viewer.renderHtml("viewerContent");
    });
  }

  showBudgetValueReport() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    this.trafApi.GetBudgetValueBySite({"budgetYear": this.budgetYear}).subscribe((res) => {
      dsMS_SQL.readJson(res);
      this.reportBudgetValue.regData("MS SQL", null, dsMS_SQL);
      this.optionsBudgetValue.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.viewerBudgetValue.report = this.reportBudgetValue;
      this.viewerBudgetValue.renderHtml("budgetValueContent");
    });
  }

  showBudgetPRReport() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    this.trafApi.GetBudgetConversionRateRequestAndPRBySite().subscribe((res) => {
      dsMS_SQL.readJson(res);
      this.reportPR.regData("MS SQL", null, dsMS_SQL);
      this.optionsPR.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.viewerPR.report = this.reportPR;
      this.viewerPR.renderHtml("PRContent");
    });
  }

  showBudgetSurplusReport() {
    var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    this.trafApi.GetBudgetValueSurplusBySite({"budgetYear": this.surplusBudgetYear}).subscribe((res) => {
      dsMS_SQL.readJson(res);
      this.reportSurplus.regData("MS SQL", null, dsMS_SQL);
      this.optionsSurplus.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.viewerSurplus.report = this.reportSurplus;
      this.viewerSurplus.renderHtml("SurplusContent");
    });
  }
  changeYear(event:any){
    console.log("event:",event);
    this.budgetYear=event.value;
    this.showBudgetValueReport();
  }
  changeYearSurplus(event:any){
    console.log("event:",event);
    this.surplusBudgetYear=event.value;
    this.showBudgetSurplusReport();
  }
  getYears() {
    var max = new Date().getFullYear(),
      min = max,
      max = max + 4;

    for (var i = min; i <= max; i++) {
      this.years.push({"id":i,"name":i});
    }

    console.log("years:",this.years)
  }

}
