import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemoAssessmentModel, DemoRequest } from './demo-req.model';

export function buildDomeForm(model: DemoRequest, fb: FormBuilder) {
  let frm: FormGroup = fb.group({
    id: 0,
    employeeId: [],
    extensionNumber: [],
    branch: [],
    departmentId: [],
    doctor: fb.group({
      id: 0,
      email: [, Validators.required],
      departmentId: [],
      departmentName: [],
      contactNumber: [],
    }),
    modelDefinitionId: [],
    assetId: [, Validators.required],
    vendorId: [, Validators.required],
    vendorMobile: [, Validators.required],
    manufactureId: [],
    link: [],
    demoDuration: [, Validators.required],
    description: [, Validators.required],
    finishEvaluationForm: [false, Validators.required],
    bookPatientOnDemo: [false, Validators.required],
    useTheDemo: [false, Validators.required],

    email: [],
    employeeName: [],
    mobile: [],
    position: [],
    employeeDepartment: [],
    departmentName: [],
    modelDefinationName: [],
    assetName: [],
    vendorEmail: [],
    vendorName: [],
    manufactureName: [],

    assessorTeamLeaderId: [],
    assessorEmployeeId: [],
    assessorTeamLeaderName: [],
    assessorEmployeeName: [],

    comments: [],
    specialConfiguration: true,
    requireSLA: true,
    specialCalibration: true,
    recommendIt: true,
    demoRequestId: [],

    advantages: [],
    disadvantages: [],
    improvements: [],
    isSavingTime: [true],
    isClinicalSuitable: [true],
    isRecommendable: true,
    easeOfUse: [],
    easeOfApplication: [],
    easeOfConnection: [],
    patientComfort: [],

    overAllPerformance: [],
    isInformationCorrect: false,

    installationDate: [],
    expirationDate: [],
    retirementDate: [],

    demoRequestStatusId: [],
    assetDemoRequestStatusId: [],
    userEvaluationStatusId: [],
    gatePassStatusId: [],

    demoRequestStatusName: [],
    assetDemoRequestStatusName: [],
    userEvaluationStatusName: [],
    gatePassStatusName: [],

    apiDirectorId: [],
    branchManagerDirectorId: [],
    branchManagerDirectorName: [],
    apiDirectorName: [],

    assessorApproval: null,
    assessmentTLApproval: null,
    apiDirectoryApproval: null,
    branchMDApproval: null,

    siteId: [, Validators.required],
    siteName: [],

    demoRequestTypeId: [],
    attachmentUrl: [],
  });

  frm.patchValue(model);
  return frm;
}

export function buildDemoAssessmentForm(
  model: DemoAssessmentModel,
  fb: FormBuilder
) {
  let frm: FormGroup = fb.group({
    id: 0,
    comments: [],
    attachmentUrl: [],
    specialConfiguration: true,
    requireSLA: true,
    specialCalibration: true,
    recommendIt: true,
    demoRequestId: [],
    assetDemoRequestStatusId: [],
    assetDemoRequestStatusName: [],
  });
  frm.patchValue(model);
  return frm;
}
