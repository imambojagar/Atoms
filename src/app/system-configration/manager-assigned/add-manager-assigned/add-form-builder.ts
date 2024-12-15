import { FormArray, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

export function getModel(formValue: any) {
  let model = { ...formValue };
  return model;
}

export function buildManagersForm(formbuilder: FormBuilder) {
  return formbuilder.group({
    id: 0,
    assignedManagerId: 0,
    assignedManagerName:[''],
    siteId: [''],
    siteName:[''],
    roleId:[''],
    roleName:[''],
    employeeId:[''],
    employeeName:[''],
    bind:[''],
    
  });
}


export function buildForm(formbuilder: FormBuilder,managers:FormGroup) {

  return formbuilder.group({
    id: 0, 
    assessorTeamLeaderId:[''],
    assessorTeamLeaderName:[''],
    apiDirectorId:[''],
    apiDirectorName:[''],
    sites:formbuilder.array([managers]),
  });

}



