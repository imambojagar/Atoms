import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '../../../services/reports.service';
import { EmployeeService } from '../../../services/employee.service';
import { Role } from '../../../shared/enums/role';
/* import { Role } from 'src/app/data/Enum/role';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { ReportsService } from 'src/app/data/service/reports.service'; */

declare var Stimulsoft: any;

@Component({
  selector: 'app-engineer-kpis1',
  templateUrl: './engineer-kpis1.component.html',
  styleUrls: ['./engineer-kpis1.component.scss'],
})
export class EngineerKPIs1Component {
  searchForm!: FormGroup;
  engineerForm!: FormGroup;
  engineerList: any[] = [];
  yearmonthList: any[] = [];
  filter: any = {};

  constructor(
    private reportsService: ReportsService,
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il';
    this.searchForm = this.fb.group({
      engineer: [],
      periods: [],
    });

    this.engineerForm = this.fb.group({
      name: [],
      dob: [],
      age: [],
      doh: [],
      seniority: [],
    });
    this.getLookups();
    this.getAssignedEmployees(Role.engineersvalue);
  }

  nameFilter(e: any) {
    this.employeeService
      .searchEmployee({ employeeName: e.query })
      .subscribe((res) => {
        const data = res.data;
        this.engineerList = data;
      });
  }

  getAssignedEmployees(value: string) {
    this.employeeService.GetUserByRoleValue(value).subscribe((res: any) => {
      this.engineerList = res;
    });
  }

  getLookups() {
    this.reportsService.GetLookupFilter(8).subscribe((res) => {
      this.yearmonthList = res;
    });
  }

  Search() {
    this.filter.UserId = this.searchForm.value.engineer.userId;

    let Dates: any[] = this.searchForm.value.periods;
    this.filter.Dates = [];
    if (Dates != null) {
      this.filter.Dates = Dates;
      /*  Dates.forEach((element) => {
        this.filter.Dates.push(element);
      }); */
    }
    this.reportsService.GetEngineerKPI1(this.filter).subscribe((resKPI1) => {
      let data = resKPI1;
      this.engineerForm.patchValue(resKPI1.userInfo);

      let optionsChart1: any = new Stimulsoft.Viewer.StiViewerOptions();
      let viewerChart1: any = new Stimulsoft.Viewer.StiViewer(
        optionsChart1,
        'StiViewer1',
        false
      );
      let report = Stimulsoft.Report.StiReport.createNewDashboard();
      report.loadFile('./assets/reports/KPI1Pivot.mrt');
      let dsMS_SQL = new Stimulsoft.System.Data.DataSet();
      dsMS_SQL.readJson(resKPI1.kpI1Dtos);
      report.regData('MS SQL', null, dsMS_SQL);
      optionsChart1.appearance.fullScreenMode = false;
      optionsChart1.toolbar.displayMode =
        Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      optionsChart1.toolbar.visible = false;
      viewerChart1.report = report;
      optionsChart1.height = '300px';
      viewerChart1.renderHtml('chart1');

      let optionsChart2: any = new Stimulsoft.Viewer.StiViewerOptions();
      let viewerChart2: any = new Stimulsoft.Viewer.StiViewer(optionsChart2, 'StiViewer2', false);
      let report2 = Stimulsoft.Report.StiReport.createNewDashboard();
       report2.loadFile("./assets/reports/KPIReport1.mrt");
      let dsMS_SQL2 = new Stimulsoft.System.Data.DataSet();
      dsMS_SQL2.readJson(resKPI1.kpI1Dtos);
      report2.regData("MS SQL", null, dsMS_SQL2);
      optionsChart2.appearance.fullScreenMode = false;
      optionsChart2.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      optionsChart2.toolbar.visible = false;
      viewerChart2.report = report2;
      optionsChart2.height = "300px";
      viewerChart2.renderHtml("chart2");
    });

    /*   var dsMS_SQL = new Stimulsoft.System.Data.DataSet();
    this.filter.assetNumber = this.searchForm.value.assetNumber;
    this.filter.serviceRequestNo = this.searchForm.value.serviceRequestNo;
      this.reportService.GetServiceRequestsReport(this.filter).subscribe((res) => {
        dsMS_SQL.readJson(res);
        this.report.regData("MS SQL", null, dsMS_SQL);
       // this.options.appearance.fullScreenMode = true;
        this.options.toolbar.displayMode = Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
        this.viewer.report = this.report;
        this.viewer.renderHtml("viewerContent");
      }); */
  }

  Reset() {
    this.searchForm.reset();
    this.Search();
  }
}
