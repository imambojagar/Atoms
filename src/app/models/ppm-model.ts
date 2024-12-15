export class PpmModel {
  id: number = 0;
  timePeriodId: number |null = null;
  timePeriodName:string|null=null;
  timePeriodValue:string|null=null;
  assignedToId: number |null = null;
  assignedToName:string|null=null;
  ppmTasks: string |null = null;
  maintenanceContractId: number |null = null;
  contractNumber:string|null=null;
  contractName:string|null=null;
  typeOfServiceId: number |null = null;
  typeOfServiceName:string|null=null;
  fromDate: Date|null=null;
  toDate: Date|null=null;
  groupLeaderId: string |null = null;
  groupLeaderUserName:string|null=null;
  ppmAssets : ppmAssets[] = []
  attachments : attachments [] = [];
  comments: string |null = null;
  workPerformedBy: string|null = null;
  numOfVisitsDone: number |null = null;
  createdOn: Date |null=null;
  modifiedOn: Date| null=null;
  planNo: number| null=null;
  planCode: string|null = null;
  supplierId: number|null=null;
  supplierName: string|null = null;
  reCreateVisitsConfirmed:boolean=false;
  autoRenew:boolean=false;
  executionTimeFrameId: number |null = null;
  InstructionDescriptionId: number |null = null;
}

export class ppmAssets {
    id: number = 0;
    ppmId: number = 0;
    assetId: number |null= null;
    assetSerialNo: string|null=null;
    assetNumber: string|null=null;
    assetName: string|null=null;
    warrantyEndDate: Date| null=null;
    modelId:number= 0;
    modelName: string|null=null;
    manufacturerId: number=0;
    manufacturerName: string|null=null;
    siteId: number=0;
    siteName: string|null=null;
}

export class attachments {
  id: number = 0;
  ppmId: number = 0;
  attachmentName: string |null = null;
 
}