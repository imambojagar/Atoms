export class QuestionsCustomerExperienceTeamModel {
  id: number = 0;
  ParentWOId: number | null = null;
  poId: number | null = null;
  workOrderId: number | null = null;
  date: string = '';
  assetSN: string | null = null;
  assetNumber: string | null = null;
  assetName: string | null = null;
  assetId: number | null = null;
  callId: number | null | any = null;
  model: string | null = null;
  customerId: string | null = null;
  customerName: string | null = null;
  relatedEmp: string | null = null;
  relatedEmpName: string | null = null;
  statusWorkflow: string | null = null;
  approvalComment: string | null = null;
  statusPermission: string | null = null;
  note: string | null = null;
  spareParts: spareParts[] = [];
  callLast: string | null = null;
  presentedTo: string | null = null;
  subject: string | null = null;
  withdraw: string | null = null;
  poNo: string | null | any = null;
  poNoValue: string | null = '';
  createdOn: string | null = null;
  modifiedOn: string | null = null;
}

export class spareParts {
  partName: string | null = null;
  partNo: number | null = null;
  partNoName: string | null = null;
  description: string | null = null;
  qty: string | null = null;
  installedQty: string | null = null;
  returnedQty: string | null = null;
  expectedDate: string | null = null;
  sparePartStatusId: any;
}
