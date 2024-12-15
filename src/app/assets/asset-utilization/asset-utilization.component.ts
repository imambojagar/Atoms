import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AssetsService } from '../../services/assets.service';
import validateForm from '../../shared/helpers/validateForm';
import { AssetUtilizationService } from '../../services/asset-utilization.service';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../shared/primeng.module';
/* import { AssetUtilizationService } from 'src/app/data/service/asset-utilization.service';
import { AssetsService } from 'src/app/data/service/assets.service';
import validateForm from 'src/app/shared/helpers/validateForm'; */

declare var Stimulsoft: any;

@Component({
  standalone: true,
  selector: 'app-asset-utilization',
  templateUrl: './asset-utilization.component.html',
  styleUrls: ['./asset-utilization.component.scss'],
  imports: [
    PrimengModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AssetUtilizationComponent {
  searchForm!: FormGroup;
  searchFilter: any = {};
  Asset_SNs: any;
  firstDayOfMonth: any;
  lastDayOfMonth: any;
  isFromRoute: boolean = false;

  items = [
    { label: 'Home', routerLink: ['/'] },
    {
      label: 'Asset Census',
      routerLink: ['/assets/asset-utilization'],
    },
  ];

  constructor(
    private assetService: AssetsService,
    private assetUtilizationService: AssetUtilizationService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    Stimulsoft.Base.StiLicense.key =
      '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmVwe2BR5e6Omuqy35t7IWDq2ZrDrpH9kbJxuL2RNHje/rhDrCr5tu4PtujVl7RyZJLycHrwIouw/fRznJkV12ZmGoazuRof6fenxwap/qIcsIwUbn7ZVY2zHy9VXeUvonvCVEMPuE9IEFh1rNulAgigTARRNAJS9uEZaVvMpMUrkB0gmgkN9ULljdQmTv3CzNOr8PvZLL+CShOIWhMJuL7Y4uWf73GZdqvNr6JJBe+wtzTr6p3nMGIg8gV7zm4RUS/nOnaeo3hr6XF/UiQvTXX9bnE/ve2O+B1AGddAYOtCkCirnqm5fP52uAmdPZlm8nqcsSPrEihh0EGjndAoSHp9D/AGpLHylF7iTJ9u7xVqyaCex+qHTSKcB64T+ePvTx5i0QnoISdX69pvU8LtegXpp4oyFpw+h9iqQPwBibhxWg2B5+QybleYu7mXBkcYoaP2UqfYKCMDW4vGw9dWktrU2HqFlsyUxLG0hFpmm8jgZ2UjENXRbGt0F7XEuX9o182jp9pl2MnMoQLe9Ymk2Z4gZNVy2RqI+cdCyL0H/G0iFaUOztGcZ3n6C0pJ3LgV7jqVKFNvxQdJ4eLgQIa1qLN+wkAFm9GcxmKwfuLuSrj1gzycwFCEblAXzRJfDHIK26pQGc7A0SmMv3eHEYJp+il';
    // this.assetFormService.getLookup();
    this.searchForm = this.fb.group({
      assetNumber: [null, Validators.required],
      assetName: [null],
      manufacturer: [null],
      modelName: [null],
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required],
    });

    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.assetNumber) {
        this.getAssetNumbersFromRoute(params.id, params['assetNumber']);
        this.isFromRoute = true;
      }
    });

    var today = new Date();
    if(today.getMonth() > 6)
    {
      this.firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() - 6, 1);
    }
    else{
      this.firstDayOfMonth = new Date(today.getFullYear(), 1, 1);
    }

    this.lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    this.searchForm.controls['dateFrom'].setValue(this.firstDayOfMonth);
    this.searchForm.controls['dateTo'].setValue(today);
  }

  bindAssetNumber(event: any) {
    //this.searchFilter.assetNo = event.assetNumber
  }
  AssetNumberClear() {
    //this.searchFilter.assetNo = ""
  }
  selectAssetNumber(event: any) {
    this.getAssetNumbers(event.query);
    //this.searchFilter.assetNo = event.query
  }
  getAssetNumbers(searchText: any = '') {
    var dto = { assetNumber: searchText };
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res : any) => {
      this.Asset_SNs = res.data;
    });
  }

  getAssetNumbersFromRoute(id:number,searchText: any = '') {
    var dto = { id:id, assetNumber: searchText };
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res : any) => {
      this.searchForm.controls['assetNumber'].setValue(res.data[0]);
      var today = new Date();
      if(today.getMonth() > 6)
    {
      this.firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() - 6, 1);
    }
    else{
      this.firstDayOfMonth = new Date(today.getFullYear(), 1, 1);
    }

    this.lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
      this.searchForm.controls['dateFrom'].setValue(this.firstDayOfMonth);
      this.searchForm.controls['dateTo'].setValue(this.lastDayOfMonth);
      this.searchAsset();

      this.assetService.getAssetById(id).subscribe((res : any) => {
        this.searchForm.controls['assetName'].setValue(res.data.modelDefinition.assetName);
        this.searchForm.controls['manufacturer'].setValue(res.data.modelDefinition.manufacturerName);
        this.searchForm.controls['modelName'].setValue(res.data.modelDefinition.modelName);
      })
    });
  }

  searchAsset() {
    if (this.searchForm.invalid) {
      validateForm.validateAllFormFields(this.searchForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.searchFilter.assetNumber =
        this.searchForm.value.assetNumber.assetNumber;
      this.searchFilter.dateFrom = this.searchForm.value.dateFrom;
      this.searchFilter.dateTo = this.searchForm.value.dateTo;

/*       this.assetUtilizationService
        .GetAssetUtilizationDashboard(this.searchFilter)
        .subscribe((data) => {
          console.log(data);

          let optionsChart1: any = new Stimulsoft.Viewer.StiViewerOptions();
          let viewerChart1: any = new Stimulsoft.Viewer.StiViewer(
            optionsChart1,
            'StiViewer1',
            false
          );
          let report1 = Stimulsoft.Report.StiReport.createNewDashboard();
          report1.loadFile('./assets/reports/AssetUtilizationDashboard.mrt');
          let dsMS_SQL1 = new Stimulsoft.System.Data.DataSet();
          dsMS_SQL1.readJson(data);
          report1.regData('MS SQL', null, dsMS_SQL1);
          optionsChart1.appearance.fullScreenMode = false;
          optionsChart1.toolbar.displayMode =
            Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
          optionsChart1.toolbar.visible = false;
          viewerChart1.report = report1;
          optionsChart1.height = '300px';
          viewerChart1.renderHtml('chart1');
        }); */


        this.assetUtilizationService
        .GetAssetUtilizationDashboardMonthly(this.searchFilter)
        .subscribe((data) => {
          console.log(data);

          let optionsChart2: any = new Stimulsoft.Viewer.StiViewerOptions();
          let viewerChart2: any = new Stimulsoft.Viewer.StiViewer(
            optionsChart2,
            'StiViewer2',
            false
          );
          let report2 = Stimulsoft.Report.StiReport.createNewDashboard();
          report2.loadFile('./../assets/reports/AssetUtilizationDashboardMonthly.mrt');
          let dsMS_SQL2 = new Stimulsoft.System.Data.DataSet();
          dsMS_SQL2.readJson(data);
          report2.regData('MS SQL', null, dsMS_SQL2);
          optionsChart2.appearance.fullScreenMode = false;
          optionsChart2.toolbar.displayMode =
            Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
          optionsChart2.toolbar.visible = false;
          viewerChart2.report = report2;
          optionsChart2.height = '500px';
          viewerChart2.renderHtml('chart2');
        });



    }
  }


  reset(){
    this.searchForm.reset();
    // this.searchFilter = new Asset();
    this.searchAsset();
  }

}
