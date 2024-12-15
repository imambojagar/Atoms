import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DemoReqService } from '../../demo-request/data/demo-req.service';
import { GatePassModel } from '../data/gate-pass.model';
import { buildGassPassForm } from '../data/gate-pass-formbuilder';
import { firstValueFrom } from 'rxjs';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import validateForm from '../../../shared/helpers/validateForm';

@Component({
  selector: 'app-gate-pass-control',
  templateUrl: './gate-pass-control.component.html',
  styleUrls: ['./gate-pass-control.component.scss'],
})
export class GatePassControlComponent {
  @Input('showmodal') showmodal: boolean = false;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input('data') data: any = null;
  items: MenuItem[] = [];
  gatePassForm!: FormGroup;
  model!: GatePassModel;
  id: number = 0;
  demoReqId: number = 0;
  tabIndex: number = 0;
  inAddMode: boolean = false;
  inEditMode: boolean = false;
  inViewMode: boolean = false;
  confirmationList: any[] = [
    { label: 'Confirmed', value: true },
    { label: 'Not Confirmed', value: false },
  ];

  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private api: DemoReqService,
    // private route: Router,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // this.router.queryParams.subscribe((params: any) => {
    this.id = 0;
    this.tabIndex = this.data.index;
    if (this.data.data) this.id = this.data.data;
    if (this.data.demoRequestId) this.demoReqId = this.data.demoRequestId;
    this.buildForm();
    // });
    this.items = [{ label: 'Home', routerLink: ['/'] }, { label: 'Gate Pass' }];
    this.cdr.detectChanges()
  }

  getDemoRequestNeededData(demoReqId: number) {
    this.api.getShortDemoRequestData(demoReqId).subscribe((res: any) => {
      this.gatePassForm.get('site')?.setValue(res.data?.siteName);
      console.log(res);
      this.cdr.detectChanges()
    });
  }

  buildForm() {
    if (this.id === 0 || !this.id) {
      this.model = {
        id: 0,
        demoRequestId: this.demoReqId,
        finalEddDate: null
      };
      this.inAddMode = true;
      this.gatePassForm = buildGassPassForm(this.model, this.fb);
      this.getDemoRequestNeededData(this.demoReqId);
    } else {
      if (this.tabIndex == 0) {
        this.inViewMode = true;
      } else {
        this.inEditMode = true;
      }
      this.getGassPassData();
    }

    this.cdr.detectChanges()
  }

  async getGassPassData() {
    const GassPassObs = await firstValueFrom(
      this.api.getSingelGatePass(this.id)
    );
    this.model = (await GassPassObs.data) as GatePassModel;
    if (this.model.edd) {
      this.model.edd = new Date(this.model.edd);
    }
    if (this.model.finalEddDate) {
      this.model.finalEddDate = dateHelper.handleDateApi(this.model.finalEddDate);
    }

    console.log('Model', this.model);
    this.gatePassForm = buildGassPassForm(this.model, this.fb);

    this.cdr.detectChanges()
  }

  changeTabIndex(tab: any) {
    if (tab.index == 1) {
      this.inViewMode = false;
      this.inEditMode = true;
    } else {
      this.inViewMode = true;
      this.inEditMode = false;
    }
  }

  //#region Send To Api
  isLoading: boolean = false;
  isSaveBtnPressed: boolean = false;
  currentFinalEDDDate: Date | null = null;

  save() {
    if (this.gatePassForm.invalid) {
      validateForm.validateAllFormFields(this.gatePassForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.isLoading = true;
      let m;
      m = this.gatePassForm.value as GatePassModel;

      if (m.isConfirmed) {
        if (!this.isSaveBtnPressed || (m.finalEddDate && this.currentFinalEDDDate && new Date(m.finalEddDate).getTime() != new Date(this.currentFinalEDDDate).getTime())) {
          m.finalEddDate = dateHelper.ConvertDateWithSameValue(
            m.finalEddDate
          );
        }
      } else {
        m.finalEddDate = null
      }

      console.log('Model', m);

      const apiMethod = 'GatePass';
      const addOrUpdate = m.id === 0 ? 'add' : 'update';

      this.api[`${addOrUpdate}${apiMethod}`](m).subscribe({
        next: (res) => {
          this.apiResponse(res);
          console.log(`${addOrUpdate}d successfully`, res);
        },
        error: (e) => {
          console.error(`Unable to ${addOrUpdate}`, e);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  deleteGatePass() {
    let selectedForm = 'Gate Pass';
    let message = `Are you sure you want to delete This ${selectedForm}?`;
    this.confirmationService.confirm({
      message: message,
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const apiMethod = 'GatePass';
        this.api[`delete${apiMethod}`](this.id).subscribe((res) => {
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
      // this.route.navigate(['demo/gate-pass/']);
      this.close_modal()
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }
  //#endregion
  close_modal() {
    // this.ngOnInit()
    this.gatePassForm.reset()
    this.openModals.emit(false);
    this.showmodal = false
    // this.editModelobject = null
  }
}
