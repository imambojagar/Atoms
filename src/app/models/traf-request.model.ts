export class TrafRequestModel {
    id: number = 0; //autogenerated
    ids:Array<number>|null=null;
    reqNo: number = 0; //autogenerated
    reqCode: string | null = null;
    employeeId: string | null = null;
    positionId: number | null = null;
    positionName:string | null = null;
    siteId: number = 0;
    siteName: string | null = null;
    requesterExtensionNumber: string | null = null;
    requesterExtensionName: string | null = null;
    requesterExtensionPositionId:number | null = null;
    requesterExtensionPositionName: string | null = null;
    requestTypeId: number | null = null;
    assetNDId: number | null = null;
    assetId: number | null = null;
    qty: number | null = null;
    purposeAnswer: string | null = null;
    currentPractise: string | null = null;
    censusQ1: number | null = null;
    censusQ2: number | null = null;
    censusQ3: number | null = null;
    censusQ4: number | null = null;
    usingSolelyOrSharedId: number | null = null;
    usingSolelyOrSharedName:string | null = null;
    effectedServices: string | null = null;
    usedWithCombination: string | null = null;
    comment: string | null = null;
    contacts: Contacts[] = [];
    departments: Departments[]=[];
   
    attachments: Attachments[] = [];
    isBudgetId: number = 0;
    firstLineManagerId: string | null = null;
    firstLineManagerName:string | null = null;
    firstLineManagerApprovalId: number = 0;
    tlapiId: string | null = null;
    assessorEmployeeId: string | null = null;
    assessorEmployeeName:string | null = null;
    assessorTeamLeaderApprovalId:number=0;
    secondLineManagerId: string | null = null;
    secondLineManagerName:string | null = null;
    secondLineManagerApprovalId: number = 0;
    hospitalManagementId: string | null = null;
    hospitalManagementName:string | null = null;
    hospitalManagementApprovalId: number = 0;
    assessorTeamLeaderId:string | null = null;
    assessorTeamLeaderName:string | null = null;
    statusOfDRId:number | null = null;
    statusOfDRName:string | null = null;
    statusOfRequesterId:number | null = null;
    statusOfRequesterName:string | null = null;
    apiDirectorApprovalId:number|null=null;
    

  }
  
  export class Contacts {
    id: number = 0;
    trafId: number = 0;
    name: string | null = null;
    telephone: string | null = null;
    notes: string | null = null;
  }
  export class Departments {
    id: number = 0;
    departmentId: number | null = null;
    departmentName:string | null = null;
    trafId: number | null = null;
  }
  export class Attachments {
    id: number = 0;
    trafId: number = 0;
    attachmentName: string | null = null;
   
  }
  