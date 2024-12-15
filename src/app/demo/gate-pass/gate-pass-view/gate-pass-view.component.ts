import { ExportService } from './../../../shared/services/export.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { DemoReqService } from '../../demo-request/data/demo-req.service';

@Component({
  selector: 'app-gate-pass-view',
  templateUrl: './gate-pass-view.component.html',
  styleUrls: ['./gate-pass-view.component.scss'],
})
export class GatePassViewComponent {
  items: MenuItem[] = [];
  demos: any[] = [];
  totalRows: number = 0;
  loading!: boolean;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };
  selectedRows: any;
  url: string = '';
  QP: any = {};

  constructor(
    private api: DemoReqService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.searchRequest();
    this.items = [{ label: 'Home', routerLink: ['/'] }, { label: 'Gate Pass' }];
  }

  searchRequest() {
    this.loading = true;
    this.api.searchGatePass(this.filter).subscribe((res) => {
      this.demos = res.data;
      this.totalRows = res.totalRows;
      this.loading = false;
      this.cdr.detectChanges();
    });

  }

  Search() {
    this.filter.pageNumber = 1;
    this.searchRequest();
  }

  paginate(event: any) {
    this.filter.pageNumber = event.page + 1;
    this.searchRequest();
  }

  navTo(place: string, row?: any, index?: number) {


    switch (place) {
      case 'AddEvaluation':
        this.url = 'evaluation/add-control';
        this.QP.data = this.selectedRows.demoRequestId;
        break;
      default:
        this.url = 'gate-pass/edit-control';
        this.QP.data = row.id;
        this.QP.index = index;
        break;
    }

    // this.router.navigate([`/demo/${th}`], {
    //   queryParams: QP,
    // });
  }

  navToDetails(row: any, index: number) {
    this.router.navigate(['/demo/gate-pass/edit-control'], {
      queryParams: {
        data: row.id,
        index,
      },
    });
  }

  export() {
    this.exportService
      .export(this.filter, 'DemoRequest/gatpass/export')
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
        link.download = 'Gate-Pass-Report';
        link.click();
      });
  }

  deleteDemoGatePass(demo: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Gate Pass?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteGatePass(demo.id).subscribe((res) => {
          this.apiResponse(res);
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'You have cancelled',
        });
      },
    });
  }

  apiResponse(res: any) {
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
      this.searchRequest();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }
  closeModal() {
    this.url = ''
  }
}
