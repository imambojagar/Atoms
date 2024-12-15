import { ExportService } from './../../../shared/services/export.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DemoReqService } from '../../demo-request/data/demo-req.service';

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrls: ['./evaluation-view.component.scss'],
})
export class EvaluationViewComponent {
  items: MenuItem[] = [];
  demos: any[] = [];
  totalRows: number = 0;
  loading!: boolean;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  selectedRow: any;
  QP: any;
  url: string = '';

  constructor(
    private api: DemoReqService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.Search();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'End-User Evaluation' },
    ];
  }

  Search() {
    this.loading = true;
    let searchObj = { ...this.filter };
    searchObj.pageNumber = 1;
    this.api.searchEvaluation(searchObj).subscribe((res) => {
      const data = res.data;
      console.log('Data:', data);

      this.totalRows = res.totalRows;
      this.demos = data;
      this.loading = false;
      console.log(data);
      this.cdr.detectChanges();
    });

  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.searchEvaluation(this.filter).subscribe((res) => {
        const data = res.data;
        this.demos = data;
        this.totalRows = res.totalRows;
        this.loading = false;

        this.cdr.detectChanges();
      });
    }, 500);
  }

  navTo(place: string, row?: any) {

    this.QP = {};

    switch (place) {
      case 'AddGatePass':
        this.url = 'gate-pass/add-control';
        this.QP.demoRequestId = this.selectedRow.demoRequestId;
        break;
      default:
        this.url = 'evaluation/edit-control';
        this.QP.data = row.demoRequestId;
        this.QP.endUserEvalId = row.id;
        break;
    }

    this.cdr.detectChanges();
    // this.router.navigate([`/demo/${url}`], {
    //   queryParams: QP,
    // });
  }

  // navToDetails(row: any, evalIndex: number) {
  //   this.router.navigate(['/demo/evaluation/control'], {
  //     queryParams: {
  //       data: row.demoRequestId,
  //       endUserEvalId: row.id,
  //       evalIndex,
  //     },
  //   });
  // }

  export() {
    console.log('this.filter', this.filter);
    this.exportService
      .export(this.filter, 'DemoRequest/evaluation/export')
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
        link.download = 'End-User-Evaluation-Report';
        link.click();
      });
  }

  deleteDemoEval(demo: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Evaluation?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteEvaluation(demo.id).subscribe((res) => {
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
      this.Search();
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
