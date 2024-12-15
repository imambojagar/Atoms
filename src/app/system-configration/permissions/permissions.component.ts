import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
import { RoutesService } from '../../services/routes.service';
import { PermissionModelDto } from '../../models/permissionModel';
import { RouteInfo } from '../../models/routeInfo';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../shared/primeng.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PrimengModule,
    ReactiveFormsModule, MatSlideToggleModule
  ],
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  providers: [],
})
export class PermissionsComponent {
  roles: any[] = [];
  activeRole: any = null;
  frm: FormGroup = null as any;
  items!: MenuItem[];
  totalRows!: number;
  data: any[] = [];
  controlsIndex = 0;
  sectionsFormArray: FormArray;

  constructor(
    private route: RoutesService,
    private permissionService: PermissionService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {
    this.frm = this.fb.group({
      sections: this.fb.array([]), // FormArray for sections
    });
    this.sectionsFormArray = this.frm.get('sections') as FormArray;
  }
  ngOnInit(): void {
    this.data = this.route.getViewPages();
    // console.log('Before I', this.data);
    // this.setIndexes(this.data);
    // console.log('indexs', this.data);
    // console.log(this.frm.getRawValue());
    this.initializeForm(this.data); // Replace with your actual data
    this.employeeService.getRoles().subscribe((d) => {
      this.roles = d;
    });
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Permissions' },
    ];
    this.cdr.detectChanges()
  }
  initializeForm(data: any[]) {
    data.forEach((group) => {
      const groupFormArray = this.fb.array([]);

      group.childrens.forEach((child: any) => {
        const childForm: any = this.fb.group({
          canView: [false],
          canAdd: [false],
          canEdit: [false],
          canDelete: [false],
          id: [child.id || 0],
          url: [child.path || ''],
          label: [child.title || ''],
          atomeroleId: [null],
        });
        groupFormArray.push(childForm);
      });

      this.sectionsFormArray.push(groupFormArray);
    });
  }
  getRowForm(sectionIndex: number, rowIndex: number): FormGroup {
    const sectionFormArray = this.sectionsFormArray.at(sectionIndex) as FormArray;
    const rowFormGroup = sectionFormArray.at(rowIndex);
    if (!(rowFormGroup instanceof FormGroup)) {
      throw new Error(`Row form at index ${rowIndex} is not a FormGroup`);
    }
    return rowFormGroup as FormGroup;
  }

  onToggleChange(event: any, sectionIndex: number, rowIndex: number, field: string) {
    console.log(
      `Toggle for section ${sectionIndex}, row ${rowIndex}, field ${field} changed:`,
      event.checked
    );
  }
  setIndexes(routes: RouteInfo[]) {
    routes.forEach((route) => {
      // Create a FormGroup for each permission
      const ctrl = this.fb.group({
        canView: [false],
        canAdd: [false],
        canEdit: [false],
        canDelete: [false],
        id: [route.id || 0],
        url: [route.path || ''],
        label: [route.title || ''],
        atomeroleId: [null],
      });

      // Add the FormGroup to the FormArray
      // this.permissionsFormArray.push(ctrl);

      // Recursively add child routes
      if (route.childrens) {
        this.setIndexes(route.childrens);
      }
    });
  }
  // getControl(index: number, controlName: string): FormControl {
  // const control = this.permissionsFormArray.at(index).get(controlName);
  // if (!control || !(control instanceof FormControl)) {
  //   throw new Error(`Control '${controlName}' at index ${index} is invalid or missing.`);
  // }
  // return control as FormControl;
  // }
  // getFormGroup(index: number): FormGroup {
  // const control = this.permissionsFormArray.at(index);
  // if (!(control instanceof FormGroup)) {
  //   throw new Error(`Control at index ${index} is not a FormGroup`);
  // }
  // return control as FormGroup;
  // }
  buildControls(a: RouteInfo) {
    let ctrl = this.fb.group({
      canAdd: false,
      canDelete: false,
      canEdit: false,
      canView: false,
      id: 0,
      url: (a as any).path,
      label: (a as any).title,
      atomeroleId: null,
    });
    (this.frm.get('sections') as any).push(ctrl as FormGroup);
  }
  resolveUrl(url: string) {
    if (typeof url !== 'string') {
      console.warn('Invalid URL:', url);
      return ''; // or return null depending on how you want to handle invalid inputs
    }

    // If the URL is empty or null after trimming, return an empty string
    if (!url.trim()) {
      return '';
    }

    // Remove leading slash if present
    if (url.startsWith('/')) {
      url = url.substring(1);
    }

    // Convert to lowercase and trim remaining spaces
    url = url.toLowerCase().trim();

    return url;
  }

  get permissionsFrm() {
    return (this.frm.get('sections') as FormArray).controls;
  }



  onChange($event: { checked: boolean }, index: number, formGroupIndex: number) {
    let ctrl = ((this.frm.get('sections') as FormArray).controls[formGroupIndex] as FormGroup).controls[index];
    let canView = (ctrl.value as PermissionModelDto).canView;
    if (!canView) {
      ctrl.patchValue({
        canAdd: false,
        canDelete: false,
        canEdit: false,
      });
    }
  }
  onCanViewChange($event: any, index: number, formGroupIndex: number) {

    ((this.frm.get('sections') as FormArray).controls[formGroupIndex] as FormGroup).controls[index].patchValue({
      canAdd: $event.checked,
      canDelete: $event.checked,
      canEdit: $event.checked,
    });
  }
  isUpdating: boolean = false;

  updateRolePermissions() {
    this.isUpdating = true;

    // Gather permissions data from all sections
    const permissions = this.sectionsFormArray.controls
      .map((section) => {
        // Cast the section to FormArray explicitly
        const sectionFormArray = section as FormArray;
        return sectionFormArray.getRawValue().filter(
          (item: any) => item.url != null && item.url !== '' && typeof item.url === 'string' && item.url.trim() !== ''
        );
      })
      .flat();

    // Send permissions to the service
    this.permissionService.update(permissions).subscribe((res: any) => {
      const message = res.message;
      const success = res.isSuccess;

      // Show a message based on the result
      this.messageService.add({
        severity: success ? 'success' : 'error',
        summary: success ? 'Successful' : 'Error',
        detail: message,
        life: 3000,
      });

      this.isUpdating = false;
    });
  }



  getPermissionsByRole(roleId: string) {
    this.activeRole = roleId;

    // Reset all permissions in the form
    this.sectionsFormArray.controls.forEach((section: AbstractControl) => {
      const sectionFormArray = section as FormArray;
      sectionFormArray.controls.forEach((ctrl: AbstractControl) => {
        const groupCtrl = ctrl as FormGroup;
        groupCtrl.patchValue({
          atomeroleId: roleId,
          id: 0,
          canEdit: false,
          canAdd: false,
          canView: false,
          canDelete: false,
        });
      });
    });

    // Fetch permissions for the role
    this.permissionService.search(roleId).subscribe((response) => {
      const data = (response as any).data as PermissionModelDto[];

      data.forEach((item) => {
        // Check if item.url is a string before calling .trim()
        if (typeof item.url === 'string' && item.url.trim()) {
          this.sectionsFormArray.controls.forEach((section: AbstractControl) => {
            const sectionFormArray = section as FormArray;

            const matchingControl = sectionFormArray.controls.find(
              (ctrl: AbstractControl) => {
                const groupCtrl = ctrl as FormGroup;
                return this.resolveUrl(groupCtrl.value.url) === this.resolveUrl(item.url);
              }
            );

            // Update the matching control with fetched data
            if (matchingControl) {
              const matchingGroup = matchingControl as FormGroup;
              matchingGroup.patchValue({
                canAdd: item.canAdd,
                canView: item.canView,
                canDelete: item.canDelete,
                canEdit: item.canEdit,
                id: item.id,
              });
            }
          });
        }
      });
    });
  }


}
