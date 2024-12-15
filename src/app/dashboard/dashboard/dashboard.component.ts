import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';

import { DashboardService } from './dashboard.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SharedTable } from '../../shared/components/table/table';
import { ServicerequestService } from '../../services/servicerequest.service';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
} from 'ng-apexcharts';

import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../shared/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { ServiceDeliveryManagementComponent } from './service-delivery-management/service-delivery-management.component';
import { AssignEmpComponent } from './assign-emp/assign-emp.component';
import { RejectRequestComponent } from './reject-request/reject-request.component';
import { ExportService } from '../../shared/services/export.service';
import { SearchServiceDeliveryComponent } from './search-service-delivery/search-service-delivery.component';
import { ServiceDeliveryTimelineComponent } from './service-delivery-timeline/service-delivery-timeline.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

const formatDate = (date: any): string => {
  date = new Date(date);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })?.format(date);
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceDeliveryManagementComponent,
    AssignEmpComponent,
    RejectRequestComponent,
    SearchServiceDeliveryComponent, ServiceDeliveryTimelineComponent
  ],
})
export class DashboardComponent {
  rejectReasonCount: any[] = [];

  @ViewChild('chart') chart: ChartComponent | undefined;
  public chartOptions: any;
  searchFilter: any = { pageSize: 5, pageNumber: 1 };
  tableConfig = new SharedTable();
  pageSize: number = 5;
  pageIndex: number = 1;
  searchValue: string = ''; // For search input
  ServiceDeliveryCount: any;
  items: MenuItem[];
  activeRow!: any | null;

  totalRows!: number;
  public assignEmpLoaded: boolean = false;
  public addServiceReqLoaded: boolean = false;
  public rejectReqLoaded: boolean = false;
  public searchServiceReqLoaded: boolean = false;
  TLReqLoaded: boolean = false;
  loading: boolean = false;
  constructor(
    private dashboardService: DashboardService,
    private serviceRequestService: ServicerequestService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private exporteService: ExportService, private messageService: MessageService,
  ) {

    this.initializeChart();
    // Initialize table headers
    this.tableConfig.tableHeaders = [
      // { header: 'Call Id', field: 'callId', hidden: true },
      { header: 'Asset No.', field: 'assetNo', hidden: false },
      { header: 'S.N', field: 'serialNo', hidden: false },
      { header: 'Asset Name', field: 'assetName', hidden: false },
      { header: 'Model', field: 'model', hidden: false },
      { header: 'Manufacturer', field: 'manufacturer', hidden: false },
      { header: 'Site', field: 'site', hidden: false },
      { header: 'Assigned Employee', field: 'assignedEmployee', hidden: false },
      { header: 'Status', field: 'status', hidden: false },
      { header: 'Priority', field: 'priority', hidden: false },
      { header: 'Date', field: 'requestedDate', hidden: false },
    ];

    // Define menu items
    this.items = [
      { label: 'Assign', icon: 'pi pi-check', command: () => this.assignAction() },
      { label: 'Reject', icon: 'pi pi-times', command: () => this.rejectAction() },
      // { label: 'Customer Survey', icon: 'pi pi-info-circle', command: () => this.surveyAction() },
      // { label: 'Print', icon: 'pi pi-print', command: () => this.printAction() },
    ];
  }

  assignAction() {
    this.openModal();
  }

  rejectAction() {
    this.openModal2();
  }

  surveyAction() {
    console.log('Customer Survey clicked');
  }

  printAction() {
    console.log('Print clicked');
  }

  ngOnInit() {
    // Fetch data for the chart
    this.dashboardService.GetDashboardServiceDeliveryCount().subscribe((res) => {
      this.ServiceDeliveryCount = res.data;

      this.rejectReasonCount = res.data?.rejectReasonCount;
      this.chartOptions = {
        series: this.rejectReasonCount.map((item: { count: any; }) => item.count),
        chart: {
          type: 'donut',
          height: 130
        },
        labels: this.rejectReasonCount.map((item: { rejectReson: any; }) => item.rejectReson),
        colors: ['#3485b3', '#99cbec'],// Specify the colors you want
        legend: {
          position: 'left', // Adjust legend position to the left
          labels: {
            colors: ['#333'] // Text color for legend
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '50%',
            },
            dataLabels: {
              // Disable data labels
              show: true,
            },
          },
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              height: 200,
            },
            legend: {
              position: 'bottom',
            }
          }
        }],
      };




    });

    // Fetch table data
    this.search()

  }
  serviceDeliverySearch(event: any) {
    this.searchFilter = event
    // this.search()
  }
  search() {
    this.serviceRequestService.searchnewServiceRequest(this.searchFilter).subscribe((res) => {

      this.totalRows = res.totalRows;
      const transformedDataArray = res.data.map((originalData: any) => ({
        workOrderId: originalData.id,
        assetId: originalData.asset.id,
        callId: originalData.id,
        assetNo: originalData.asset?.assetNumber,
        serialNo: originalData.workOrderNo,
        assetName: originalData.assetNDModel?.name,
        model: originalData.model?.name,
        manufacturer: originalData.manufacturer?.name,
        site: originalData.site?.siteName,
        assignedEmployee: originalData.assignedEmployee?.userName,
        createdDate: formatDate(new Date()),
        status: originalData.status?.name,
        priority: originalData.priority?.name,
        requestedDate: formatDate(originalData.requestedDate),
      }));
      this.tableConfig.tableData = transformedDataArray;
      this.cdr.detectChanges();
    });
  }
  initializeChart() {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'donut',
        height: 130,
      },
      labels: [],
      colors: ['#3485b3', '#99cbec'], // Specify the colors you want
      legend: {
        position: 'left',
        labels: {
          colors: ['#333'],
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '50%',
          },
        },
      },
    };
  }

  // Modal methods
  async openaddServiceReq(call: any) {
    this.activeRow = call
    this.addServiceReqLoaded = true
  }
  // Modal methods
  async closeServiceReq(call: any) {
    this.activeRow = null
    this.addServiceReqLoaded = false
  }
  async opensearchServiceReq() {
    this.searchServiceReqLoaded = true
  }
  async closesearchServiceReq() {
    this.searchServiceReqLoaded = false
  }
  async openModal() {
    this.assignEmpLoaded = true
  }
  async closeModal() {
    this.assignEmpLoaded = false

    this.activeRow = null
  }
  // async close() {
  //   this.TLReqLoaded = false;
  // }
  async openModal2() {
    this.rejectReqLoaded = true;
  }
  async close1() {
    this.rejectReqLoaded = false;

    this.activeRow = null
  }
  async openTLreq(call: any) {
    this.activeRow = call
    this.TLReqLoaded = true;

  }
  async closeTLreq(call: any) {
    this.activeRow = call
    this.TLReqLoaded = false;

  }

  // Reset active row after modal is closed
  resetActiveRow() {
    this.activeRow = null;
  }

  // Global search and filter logic
  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.tableConfig.tableData = this.tableConfig.tableData.filter((row: any) =>
        Object.values(row).some((val: any) => String(val).toLowerCase().includes(this.searchValue))
      );
    }
    else {
      this.resetGlobalFilter()
    }
    this.cdr.detectChanges();
  }

  resetGlobalFilter() {
    this.searchValue = ''; // Clear the search input
    this.search()
    this.cdr.detectChanges();
  }
  export() {

    this.exporteService
      .export(this.searchFilter, 'ServiceRequest/ExportWorkOrders')
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'File should be downloaded now',
          life: 3000,
        });
        var downloadURL = URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Service Request Report';
        link.click();
      });
  }
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      // case 'high priority':
      //   return 'high-priority';
      case 'completed':
        return 'completed1';
      case 'closed':
        return 'closed1';
      case 'rejected':
        return 'rejected1';
      case 'open':
        return 'open1';
      case 'new':
        return 'new1';
      case 'overdue':
        return 'overdue1';
      case 'in progress':
        return 'in-progress1';
      default:
        return ''; // Default or no class
    }
  }

  paginate(event: any) {
    this.loading = true;
    this.searchFilter.pageNumber = event.page + 1;
    this.search();
    this.cdr.detectChanges()
    this.loading = false;
  }

}
