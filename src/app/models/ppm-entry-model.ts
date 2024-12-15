export class PpmEntryModel {
    id: number = 0;
    ids:Array<number>|null=null;
    visitNo:number |null = null;
    visitCode: string|null=null;
    planNo:number |null = null;
    planCode: string|null=null;
    ppmId:number |null = null;
    ppmScheduleId:number |null = null;
    ppmScheduleNo: number |null = null;
    ppmScheduleCode: string|null=null;
    assetId: number |null = null;
    assetName: string|null=null;
    assetSerialNo: string|null=null;
    assetNumber: string|null=null;
    warrantyEndDate: Date|null=null;
    modelId: number |null = null;
    modelName: string|null=null;
    manufacturerId: number |null = null;
    manufacturerName: string|null=null;
    siteId:number |null = null;
    siteName: string|null=null;
    assignedToId: number |null = null;
    assignedToName: string|null=null;
    jobSheetNo: string|null=null;
    assignedEmployeeId: string|null=null;
    assignedEmployeeName: string|null=null;
    groupLeaderId: string|null=null;
    groupLeaderName: string|null=null;
    expectedDate: Date|null=null;
    nextDate: Date|null=null;
    actualDate:Date|null=null;
    forwardToId: string|null=null;
    forwardToName: string|null=null;
    maintenanceContractId: number|null=null;
    contractNumber: string|null=null;
    typeOfServiceId: number |null = null;
    typeOfServiceName: string|null=null;
    executionTimeFrameId: number |null = null;
    executionTimeFrameName: string|null=null;
    externalEngineer : string|null=null;
    telephone : string |null = null;
    groupLeaderReviewId: number |null = null;
    groupLeaderReviewName: string|null=null;
    timePeriodId: number |null = null;
    timePeriodName: string|null=null;
    groupLeaderReview : string = '';
    vCalibrationTools: vCalibrationTools[]=[];
    vKits : vKits[]=[];
    vContacts : vContacts[]=[];
    vChecklists : vChecklists[]=[];
    vAttachments : vAttachments[]=[];
    visitStatusId: number |null = null;
    visitStatusName: string|null=null;
    startDate: Date|null=null;
    endDate: Date|null=null;
    workingHours: string|null=null;
    travelingHours: string|null=null;
    deviceStatusId: number |null = null;
    deviceStatusName: string|null=null;
    comments: string|null=null;
    workPerformed: string|null=null;
    supplierId: number |null = null;
    supplierName: string|null=null;
    taskStatusId:number|null=null;
    taskStatusName: string|null=null;
    createdOn: Date|null=null;
    modifiedOn:Date|null=null;
    InstructionDescriptionId:string|null=null;
    ListInstructionTextId:any[]=[];

}

export class vCalibrationTools{
    id: number=0;
    visitId:number= 0;
    assetId:number= 0;
    assetSerialNo: string|null=null;
    calibrationDateOfTesters: Date|null=null;
}

export class visitTimers{
    id: number=0;
    startDateTime:Date|null=null;
    endDateTime:Date|null=null;
    workingHours:number= 0;
}

export class vKits{
    id: number=0;
    visitId: number=0;
    partCatalogItemId:number| null=null;
    partName:string| null=null;
    partNumber:number|null=null;
    
}

export class vContacts{
    id:  number=0;
    visitId:  number=0;
    title:string|null=null;
    person: string|null=null;
    job:string|null=null;
    email: string|null=null;
    telephone: string|null=null;
    landLine: string|null=null;
  
   
}

export class vChecklists{
    id: number=0;
    visitId: number=0;
    task:string|null=null;
    taskStatusId:number=0;
    taskStatusName: string|null=null;
    taskComment: string|null=null;
    measuredValue: string|null=null;
    InstructionTextId:string|null=null;
}
export class vAttachments{
    id:  number=0;
    visitId:  number=0;
    attachmentName: string|null=null;
    attachmentURL: string|null=null;
}