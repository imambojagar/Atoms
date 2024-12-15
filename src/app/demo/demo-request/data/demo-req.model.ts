export interface DemoRequest {
  id: number;
  employeeId?: string;
  extensionNumber?: string;
  branch?: string;
  departmentId?: number;
  doctor?: Doctor;
  modelDefinitionId?: number;
  assetId?: number;
  vendorId?: number;
  vendorMobile?: string;
  manufactureId?: number;
  link?: string;
  demoDuration?: number;
  description?: string;
  finishEvaluationForm?: boolean;
  bookPatientOnDemo?: boolean;
  useTheDemo?: boolean;

  email?: string;
  employeeName?: string;
  mobile?: number;
  position?: any;
  employeeDepartment?: any;
  departmentName?: string;
  modelDefinationName?: any;
  assetName?: any;
  vendorEmail?: string;
  vendorName?: any;
  manufactureName?: any;

  assessorTeamLeaderId?: string;
  assessorEmployeeId?: string;
  assessorTeamLeaderName?: string;
  assessorEmployeeName?: string;

  comments?: string;
  attachmentUrl?: string;
  specialConfiguration?: boolean;
  requireSLA?: boolean;
  specialCalibration?: boolean;
  recommendIt?: boolean;
  demoRequestId?: number;

  advantages?: string;
  disadvantages?: string;
  improvements?: string;
  isSavingTime?: boolean;
  isClinicalSuitable?: boolean;
  isRecommendable?: boolean;
  easeOfUse: 0;
  easeOfApplication: 0;
  easeOfConnection: 0;
  patientComfort: 0;
  overAllPerformance?: number;
  isInformationCorrect?: boolean;

  installationDate?: any;
  expirationDate?: any;
  retirementDate?: any;

  demoRequestStatusId?: number;
  assetDemoRequestStatusId?: number;
  userEvaluationStatusId?: number;
  gatePassStatusId?: number;

  apiDirectorId?: string;
  branchManagerDirectorId?: string;
  branchManagerDirectorName?: string;
  apiDirectorName?: string;

  assessorApproval?: boolean;
  assessmentTLApproval?: boolean;
  apiDirectoryApproval?: boolean;
  branchMDApproval?: boolean;

  siteId?: number;
  siteName?: any;

  createdOn?: string;
  modifiedOn?: string;
}

export interface DemoAssessmentModel {
  id: 0;
  comments?: string;
  attachmentUrl?: string;
  specialConfiguration?: boolean;
  requireSLA?: boolean;
  specialCalibration?: boolean;
  recommendIt?: boolean;
  demoRequestId?: number;
  assetDemoRequestStatusId?: number;
  assetDemoRequestStatusName?: string;
}

export interface Doctor {
  id?: number;
  email?: string;
  departmentId?: number;
  contactNumber?: string;
}
