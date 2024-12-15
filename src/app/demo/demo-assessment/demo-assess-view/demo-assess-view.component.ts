import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DemoReqService } from '../../demo-request/data/demo-req.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportService } from '../../../shared/services/export.service';

@Component({
  selector: 'app-demo-assess-view',
  templateUrl: './demo-assess-view.component.html',
  styleUrls: ['./demo-assess-view.component.scss'],
})
export class DemoAssessViewComponent {
  items: MenuItem[] = [];
  demos: any[] = [];
  totalRows: number = 0;
  loading!: boolean;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  selectedRows: any;
  assessorEmp: any[] = [];
  assessorTL: any[] = [];

  isMultiupdate: boolean = false;
  queryParams: any = {};
  url: string = '';

  constructor(
    private api: DemoReqService,
    // private router: Router,
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
      { label: 'Demo Assessment' },
    ];
  }

  Search() {
    this.loading = true;
    let searchObj = { ...this.filter };
    searchObj.pageNumber = 1;
    this.api.searchDemoAssess(searchObj).subscribe((res) => {
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
      this.api.searchDemoAssess(this.filter).subscribe((res) => {
        const data = res.data;
        this.demos = data;
        this.totalRows = res.totalRows;
        this.loading = false;
      });
    }, 500);

    this.cdr.detectChanges();
  }

  navToDetails(row: any, assessIndex: number) {
    // this.router.navigate(['/demo/assessment/edit-control'], {
    //   queryParams: {
    //     data: row.demoRequestId,
    //     demoAssessmentId: row.id,
    //     assessIndex,
    //   },
    // });

    this.url = '/demo/assessment/edit-control'
    this.queryParams = {
      data: row.demoRequestId,
      demoAssessmentId: row.id,
      assessIndex,
    }
  }

  export() {
    console.log('this.filter', this.filter);
    this.exportService
      .export(this.filter, 'DemoRequest/asset/export')
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
        link.download = 'Demo-Assessment-Report';
        link.click();
      });
  }

  deleteDemoAssess(demo: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Demo Assessment?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteDemoAssess(demo.id).subscribe((res) => {
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
      // this.router.navigate(['demo/assessment/']);
      this.closeModal()
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
