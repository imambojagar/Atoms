import { Component } from '@angular/core';
import { DemoReqService } from '../../../demo/demo-request/data/demo-req.service';
/* import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomerService } from 'src/app/data/service/customer.service';
import { DemoReqService } from 'src/app/modules/demo/demo-request/data/demo-req.service'; */

declare var Stimulsoft: any;

@Component({
  selector: 'app-demo-request-report',
  templateUrl: './demo-request-report.component.html',
  styleUrls: ['./demo-request-report.component.scss'],
})
export class DemoRequestReportComponent {
  sitesList: any[] = [];

  options1: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer1: any = new Stimulsoft.Viewer.StiViewer(
    this.options1,
    'StiViewer1',
    false
  );
  report1 = Stimulsoft.Report.StiReport.createNewDashboard();
  dsMS_SQL1 = new Stimulsoft.System.Data.DataSet();

  options2: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer2: any = new Stimulsoft.Viewer.StiViewer(
    this.options2,
    'StiViewer2',
    false
  );
  report2 = Stimulsoft.Report.StiReport.createNewDashboard();
  dsMS_SQL2 = new Stimulsoft.System.Data.DataSet();

  options3: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer3: any = new Stimulsoft.Viewer.StiViewer(
    this.options3,
    'StiViewer3',
    false
  );
  report3 = Stimulsoft.Report.StiReport.createNewDashboard();
  dsMS_SQL3 = new Stimulsoft.System.Data.DataSet();

  options4: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer4: any = new Stimulsoft.Viewer.StiViewer(
    this.options4,
    'StiViewer4',
    false
  );
  report4 = Stimulsoft.Report.StiReport.createNewDashboard();
  dsMS_SQL4 = new Stimulsoft.System.Data.DataSet();

  options5: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer5: any = new Stimulsoft.Viewer.StiViewer(
    this.options5,
    'StiViewer5',
    false
  );
  report5 = Stimulsoft.Report.StiReport.createNewDashboard();
  dsMS_SQL5 = new Stimulsoft.System.Data.DataSet();

  constructor(private apiDemo: DemoReqService) {}

  ngOnInit() {
    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il';

    this.report1.loadFile('./assets/reports/GetDemoCountBySite.mrt');
    this.report2.loadFile('./assets/reports/GetDemoStatusCount.mrt');
    this.report3.loadFile('./assets/reports/GetDemoExcededDempDuration.mrt');
    this.report4.loadFile(
      './assets/reports/GetDemoAcceptedAndRejectedPrecentage.mrt'
    );
    this.report5.loadFile(
      './assets/reports/GetDemoAcceptedAndRejectedPrecentageTable.mrt'
    );
    this.report1.dictionary.databases.clear();
    this.report2.dictionary.databases.clear();
    this.report3.dictionary.databases.clear();
    this.report4.dictionary.databases.clear();
    this.report5.dictionary.databases.clear();
  }

  getReportsData() {
    this.apiDemo.getDemoCountBySite().subscribe((res: any) => {
      this.dsMS_SQL1.readJson(res);
      this.report1.regData('MS SQL', null, this.dsMS_SQL1);
      this.options1.toolbar.displayMode =
        Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.options1.appearance.fullScreenMode = false;
      this.options1.height = '100%';
      this.viewer1.report = this.report1;
      this.viewer1.renderHtml('chart1');
    });

    this.apiDemo.getDemoStatusCount().subscribe((res: any) => {
      this.dsMS_SQL2.readJson(res);
      this.report2.regData('MS SQL', null, this.dsMS_SQL2);
      this.options2.toolbar.displayMode =
        Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.options2.appearance.fullScreenMode = false;
      this.options2.height = '100%';
      this.viewer2.report = this.report2;
      this.viewer2.renderHtml('chart2');
    });

    this.apiDemo.getDemosExceededDemoDurationCount().subscribe((res: any) => {
      this.dsMS_SQL3.readJson(res);
      this.report3.regData('MS SQL', null, this.dsMS_SQL3);
      this.options3.toolbar.displayMode =
        Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      this.options3.appearance.fullScreenMode = false;
      this.options3.height = '100%';
      this.viewer3.report = this.report3;
      this.viewer3.renderHtml('chart3');
    });

    this.apiDemo
      .getDemoCompletedAndRejectedPercentage()
      .subscribe((res: any) => {
        this.dsMS_SQL4.readJson(res);
        this.report4.regData('MS SQL', null, this.dsMS_SQL4);
        this.options4.toolbar.displayMode =
          Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
        this.options4.appearance.fullScreenMode = false;
        this.options4.height = '100%';
        this.viewer4.report = this.report4;
        this.viewer4.renderHtml('chart4');

        this.dsMS_SQL5.readJson(res);
        this.report5.regData('MS SQL', null, this.dsMS_SQL5);
        this.options5.toolbar.displayMode =
          Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
        this.options5.appearance.fullScreenMode = false;
        this.options5.height = '100%';
        this.viewer5.report = this.report5;
        this.viewer5.renderHtml('chart5');
      });
  }
}
