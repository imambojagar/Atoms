import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

function checkIfDefault(obj: any): boolean {
  let isValid = true;
  Object.keys(obj).forEach((key) => {
    if ((key == 'id' || key == 'visitId') && obj[key] == '') {
      obj[key] = 0;
    }
    if (typeof obj[key] === 'string' && obj[key] != '') isValid = false;
    if (typeof obj[key] === 'number' && obj[key] != 0) isValid = false;
  });
  return isValid;
}

function clone(model: any, obj: any, props: string[]) {
  props.forEach((k: string) => {
    model[k] = [...obj[k]].filter((o) => !checkIfDefault(o));
  });
}

export function getVisitModel(formValue: any) {
  let model = { ...formValue };
  clone(model, formValue, [
    'vCalibrationTools',
    'vKits',
    'vChecklists',
    'vAttachments',
  ]);
  return model;
}

export function buildCalibretionForm(formbuilder: FormBuilder) {
  return formbuilder.group({
    assetId: '',
    id: '',
    visitId: '',
    assetSerialNo: [''],
    assetNumber: [''],
    assetName: [''],
    calibrationDateOfTesters: [''],
    bind: [''],
  });
}

export function buildVisitTimersForm(formbuilder: FormBuilder) {
  return formbuilder.group({
    id: 0,
    startDateTime: [null],
    endDateTime: [null],
    workingHours: [null]
  });
}

export function buildKitsForm(formbuilder: FormBuilder) {
  return formbuilder.group({
    id: '',
    partCatalogItemId: [''],
    partName: [''],
    partNumber: [''],
    visitId: '',
    bind: [''],
  });
}

export function buildAttatchmentForm(formbuilder: FormBuilder) {
  return formbuilder.group({
    id: '',
    visitId: '',
    attachmentName: [''],
    attachmentURL: [''],
  });
}
export function buildChecklistForm(formbuilder: FormBuilder) {
  return formbuilder.group({
    id: '',
    measuredValue: [''],
    task: [''],
    visitId: '',
    taskStatusId: [''],
    taskStatusName: [''],
    taskComment: [''],
    instructionTextId: ''
  });
}

export function buildForm(
  formbuilder: FormBuilder,
  vCalibrationTools: FormGroup,
  vChecklists: FormGroup,
  vContats: FormGroup,
  vKits: FormGroup,
  vAttachments: FormGroup
) {
  return formbuilder.group({
    id: [''],
    ppmId: [''],
    actualDate: [''],
    visitNo: [''],
    visitCode: [''],
    planNo: [''],
    planCode: [''],
    jobSheetNo: [''],
    ppmScheduleCode: [''],
    ppmScheduleNo: [''],
    ppmScheduleId: [''],
    assetId: [''],
    assetName: [''],
    assetSerialNo: [''],
    warrantyEndDate: [''],
    modelId: [''],
    modelName: [''],
    manufacturerId: [''],
    manufacturerName: [''],
    siteId: [''],
    siteName: [''],
    assetNumber: [''],
    assignedToId: [''],
    assignedToName: [''],
    assignedEmployeeId: [''],
    assignedEmployeeName: [''],
    groupLeaderId: [''],
    groupLeaderName: [''],
    expectedDate: [''],
    nextDate: [''],
    forwardToId: [''],
    forwardToName: [''],
    maintenanceContractId: [''],
    contractNumber: [''],
    typeOfServiceId: [''],
    typeOfServiceName: [''],
    executionTimeFrameId: [''],
    executionTimeFrameName: [''],
    externalEngineer: [''],
    telephone: [''],
    groupLeaderReviewId: [''],
    groupLeaderReviewName: [''],
    timePeriodId: [''],
    timePeriodName: [''],
    groupLeaderReview: [''],
    visitStatusId: ['', Validators.required],
    visitStatusName: [''],
    startDate: [''],
    endDate: [''],
    workingHours: [''],
    travelingHours: [''],
    deviceStatusId: [''],
    deviceStatusName: [''],
    comments: [''],
    workPerformed: [''],
    supplierId: [''],
    supplierName: [''],
    supplierString: [''],
    suppPersonId: [''],
    suppStartDate: [''],
    suppEndDate: [''],
    suppWorkingHours: [''],
    taskStatusId: [''],
    taskStatusName: [''],
    maintenanceCString: [''],
    assetSupplierId: [''],
    assetSupplierName: [''],
    departmentId: [''],
    departmentName: [''],
    safetyId: [''],
    safetyName: [''],
    vCalibrationTools: formbuilder.array([vCalibrationTools]),
    vKits: formbuilder.array([vKits]),
    vChecklists: formbuilder.array([vChecklists]),
    vAttachments: formbuilder.array([vAttachments]),
    assetAvailabilityId: [''],
  });
}
