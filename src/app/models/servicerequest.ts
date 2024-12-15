export class Servicerequest {
  assetNo: any;
  CallId: any;
  Status: any;
  Site: string = ''
  RequestedDateSymbol: any;
  RequestedDateFrom: any;
  AssetNo: any;
  MaintenanceSituation: any;
  assignedEmployee: any;
  FirstActionStatus: any;
  startDate: any;
  endDate: any;
  workingHours: any;
  AssetName: any;
  Manufacturer: any;
  ModelDefinition: any;
  TypeOfrequest: any;
  Safety: any;
  ProblemDescription: any;
  Priority: any;
  pageSize: number
  pageNumber: number;
  assetGroup!: number;
  AssetSerialNumber: any;
  archivedData: any;
  page!: string;
  requestedThrough: any;
  longDescription: any;
  AssetGroup!: number;
  Jobstatus: any;
  constructor() {
    this.pageSize = 10
    this.pageNumber = 1
  }
}


export class Attachments {
  id: number = 0;
  name: string | null = null;

}
