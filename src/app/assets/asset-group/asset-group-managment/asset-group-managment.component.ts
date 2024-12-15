import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { AssetGroupService } from '../../../services/asset-group.service';
import validateForm from '../../../shared/helpers/validateForm';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';
/* import { AssetGroupService } from 'src/app/data/service/asset-group.service';
import validateForm from 'src/app/shared/helpers/validateForm'; */

@Component({
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule, FormsModule, CommonModule],
  selector: 'app-asset-group-managment',
  templateUrl: './asset-group-managment.component.html',
  styleUrls: ['./asset-group-managment.component.scss']
})
export class AssetGroupManagmentComponent implements OnChanges {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  assetGroupForm!: FormGroup;
  id: any;
  isViewMode: boolean = false;
  isEditMode: boolean = false;
  isAddMode: boolean = false;
  items!: MenuItem[];
  url: string = '';

  constructor(private activatedRoute: ActivatedRoute,
    public assetGroupService: AssetGroupService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService) { }

    ngOnChanges(changes: SimpleChanges): void {
      this.Init();
    }

    Init(): void {
      this.activatedRoute.queryParams.subscribe(params => {
        this.id = params['id'];
      });

      this.checkMode()
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
      this.items = [
        { label: 'Home', routerLink: ['/'] },
        { label: 'Asset Group' }
      ];
      this.assetGroupForm = this.formbuilder.group({
        name: [null,Validators.required],
        code: [null],
      });
      if (!this.isAddMode) {
        this.getAssetGroup(this.id);
      }

      if (this.isViewMode) {
        this.assetGroupForm.disable();
      }
    }

    checkMode() {
      this.isViewMode = false
      this.isEditMode = false
      this.isAddMode = false
      this.url = this.router.url;
      if (this.id && this.url.includes('view'))
        this.isViewMode = true

      else if (this.id && !this.url.includes('view'))
        this.isEditMode = true
      else {
        this.isAddMode = true
      }
    }


  save() {
    if (this.assetGroupForm.invalid) {
      validateForm.validateAllFormFields(this.assetGroupForm);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
    }
    else {
      let finalData: any = {};
      Object.assign(finalData, this.assetGroupForm.value,);
      if (this.id) {
        finalData.id = Number(this.id)
        this.assetGroupService.updateAssetGroup(finalData).subscribe(res => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            // this.addCustomerForm.reset();
            this.router.navigate(['systemsettings/asset-groups']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }

        })
      }
      else
        this.assetGroupService.addAssetGroup(finalData).subscribe(res => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            // this.addCustomerForm.reset();
            this.router.navigate(['systemsettings/asset-groups']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }

        })
    }
  }

  getAssetGroup(assetGroupId: number) {
    this.assetGroupService.getAssetGroupById(assetGroupId).subscribe(res => {
      this.assetGroupForm.patchValue(
        {
          name: res.data.name,
          code: res.data.code,
        }
      )

    })

  }

  delete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this asset group?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.assetGroupService.deleteAssetGroup(this.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {

            this.router.navigate(['systemsettings/asset-groups']);
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

  close_modal() {
    if(!this.edit_asset_id) {
      this.Init();
    }
    this.openModals.emit(false);
  }

}
