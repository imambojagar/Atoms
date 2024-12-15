import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { CylindersReferenceService } from '../../../maintenance/cylinders-reference/data/cylinders-reference.service';
import { dateHelper } from '../../../shared/helpers/dateHelper';
/* import { CustomerService } from 'src/app/data/service/customer.service';
import { CylindersReferenceService } from 'src/app/modules/maintenance/cylinders-reference/data/cylinders-reference.service';
import { dateHelper } from 'src/app/shared/helpers/dateHelper'; */

declare var Stimulsoft: any;

@Component({
  selector: 'app-empty-cylinder',
  templateUrl: './empty-cylinder.component.html',
  styleUrls: ['./empty-cylinder.component.scss'],
})
export class EmptyCylinderComponent {
  searchForm!: FormGroup;
  sitesList: any[] = [];

  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(
    this.options,
    'StiViewer',
    false
  );

  report = Stimulsoft.Report.StiReport.createNewDashboard();
  dsMS_SQL = new Stimulsoft.System.Data.DataSet();

  searched: boolean = false;
  noData: boolean = false;
  constructor(
    private fb: FormBuilder,
    private apiCustomer: CustomerService,
    private apiCylinders: CylindersReferenceService
  ) {}

  ngOnInit() {
    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il';

    this.report.loadFile('./assets/reports/EmptyCylinders.mrt');
    this.report.dictionary.databases.clear();

    this.searchForm = this.fb.group({
      customerId: [],
      customerName: [],
      date: [],
    });
  }

  searchSites(name: any) {
    this.apiCustomer
      .searchCustomer({ custName: name.query })
      .subscribe((res) => {
        this.sitesList = res.data;
      });
  }

  Search() {
    this.searched = true;
    const filter = this.searchForm.value;
    filter.date = dateHelper.ConvertDateWithSameValue(new Date(filter.date));

    this.apiCylinders
      .getEmptyCylindersReportData(filter)
      .subscribe((res: any) => {
        if (res) {
          this.noData = false;
          this.dsMS_SQL.readJson(res);
          this.report.regData('MS SQL', null, this.dsMS_SQL);
          this.options.toolbar.displayMode =
            Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
          this.options.appearance.fullScreenMode = false;
          this.options.height = '100%';
          this.viewer.report = this.report;
          this.viewer.renderHtml('chart1');
        } else {
          this.noData = true;
        }
      });
  }

  Reset() {
    this.searchForm.reset();
    this.Search();
  }
}
