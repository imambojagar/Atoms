import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export function getInventoryModel(formValue: any) {
    let model = { ...formValue };
    return model;
  }
  
  
  export function buildtDetailsForm(formbuilder: FormBuilder) {
    return formbuilder.group({
      id: 0,
      assetSurveyId: 0 ,
      assetId:null ,
      assetSerialNo: null,
      assetNumber: null,
      assetName: null,
      bind:null,
      tagCode: null,
      statusId: null ,
      statusName: null,
    });
  }
  
  
  export function buildForm(formbuilder: FormBuilder,detailsForm:FormGroup) {
  
    return formbuilder.group({
        id: 0,
        surveyNo:null,
        surveyCode:null,
        surveyDate: [null,Validators.required],
        siteId: [null,Validators.required],
        siteName: null,
        siteBind:null,
        buildingId:[null,Validators.required],
        buildingName:  null,
        floorId:[null,Validators.required],
        floorName:  null,
        departmentId: [null,Validators.required],
        departmentName: null,
        roomId: null,
        roomName:  null,
        details:formbuilder.array([detailsForm]),
    });
  
  }

  export function buildFilterForm(formbuilder: FormBuilder){
    return formbuilder.group({
        surveyNo: null,
        surveyCode: null,
        surveyDateFrom: null,
        surveyDateTo: null,
        siteId: null,
        buildingId: null,
        floorId: null,
        departmentId: null,
        roomId: null,
        assetId: null,
        statusId: null,
        isAutoComplete: null,
        assetGroup: null
    });
  }
  