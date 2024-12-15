import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
  MenuItem
} from 'primeng/api';
import { ModelService } from '../../services/model-definition.service';

@Component({

  selector: 'app-defects-control',
  templateUrl: './defects-control.component.html',
  styleUrls: ['./defects-control.component.scss'],
})
export class DefectsControlComponent {
  defectsForm!: FormGroup;
  defectsList = [];

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
    name: null,
  };
  totalRows!: number;
  loading!: boolean;

  defectModel = {
    id: 0,
    name: '',
  };
  items!: MenuItem[];
  displayAdd: boolean = false;
  displayUpdate: boolean = false;
  searchValue: string = '';
  constructor(
    private fb: FormBuilder,
    private api: ModelService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
  ) { }
  ngOnInit() {
    this.getDefects();
    this.defectsForm = this.fb.group({
      id: [0, Validators.required],
      name: ['', Validators.required],
    });
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Model Definition Defects Control List' },
    ];
  }
  getDefects() {
    this.api.getDefects(this.filter).subscribe((res) => {
      this.totalRows = res.totalRows;
      this.defectsList = res.data;

      this.cdr.detectChanges();
    });
  }
  paginate(event: any) {
    this.loading = true;
    console.log('paginate event', event);
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.getDefects(this.filter).subscribe((res) => {
        const data = res.data;
        this.defectsList = data;
        this.totalRows = res.totalRows;
        this.loading = false;


        this.cdr.detectChanges();
      });
    }, 500);
  }
  showAddDialog() {
    this.displayAdd = true;
  }
  showUpdateDialog(id: number) {
    this.displayUpdate = true;
    this.api.getSingleDefect(id).subscribe((res) => {
      const data = res.data;
      this.defectsForm.patchValue(data);
      console.log(res);


      this.cdr.detectChanges();
    });
  }
  onAdd() {
    this.defectModel.id = 0;
    this.defectModel.name = this.defectsForm.value.name;
    this.api.addDefects(this.defectModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.displayAdd = false;
        this.getDefects();


        this.cdr.detectChanges();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }

  defectId!: number;
  onUpdate() {
    this.defectModel.id = this.defectId;
    this.defectModel.name = this.defectsForm.value.name;
    this.api.updateDefects(this.defectModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.displayUpdate = false;


        this.cdr.detectChanges();
        this.getDefects();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }
  onDelete(defect: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + defect.name + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.defectsForm.value.id = defect.id;
        this.api.deleteDefect(this.defectsForm.value.id).subscribe((res) => {
          this.getDefects();
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }
  onHideDialog() {
    this.defectsForm.reset();
    this.displayAdd = false;
    this.cdr.detectChanges();
  }
  onHideDialogs() {
    this.defectsForm.reset();
    this.displayUpdate = false;
    this.cdr.detectChanges();
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.defectsList = this.defectsList.filter((row: any) =>
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
    this.getDefects()
    this.cdr.detectChanges();
  }
}
