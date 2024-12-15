export class MaintenanceModel {
  id: number = 0;
  contractNumber: string | null = null;
  contractName: string | null = null;
  contractTypeId: number | null = null;
  contractStatusId: number | null = null;
  startDate: Date | null = null;
  numberOfYears: number | null = null;
  calibrationPeriod: number | null = null;
  paymentMethod: number | null = null;
  comment: string | null = null;
  correctVisits: string | null = null;
  sparePartsIncludedInCM: string | null = null;
  responseTime: string | null = null;
  invoice: string | null = null;
  ContractRelatedId: number | null = null;
  maintenanceContractTypeId: number | null = null;
  vendorOperationHours: string | null = null;
  misUse: string | null = null;
  typeOfContractId: number | null = null;
  guaranteeUpTime: string | null = null;
  misUseCoverage: string | null = null;
  autoRenew: true | null = null;
  ettr: string | null = null;
  noOfCorrectiveVisits: number | null = null;
  noOfPlannedVisits: number | null = null;
  sparePartsIncludedInPM: string | null = null;
  maximumSystemFailures: number | null = null;
  laborHourlyPrice: number | null = null;
  services: string | null = null;
  excludedParts: number | null = null;
  quoteReferenceNumber: string | null = null;
  purchaseOrder: string | null = null;
  assetMContract: assetMContract[] = [];
  mContractYearPrice: mContractYearPrice[] = [];
  vendorOperationTimes: vendorOperationTimes[] = [];
  includeServices: string | null = null;
  excludeServices: string | null = null;
  currencyId: number | null = null;
  supplierId: number | null = null;
  siteId: number | null = null;
}

export class assetMContract {
  assetId: number | null = null;
  assetAnnualContractPrice: number | null = null;
  totalContractPrice: number | null = null;
  ppmMonths: number | null = null;
  mContractAssetPrices: mContractAssetPrices[] = [];
}
export class mContractAssetPrices {
  id: number = 0;
  year?: number | null = null;
  price?: number | null = null;
  currencyId?: string | null = null;
}

export class mContractYearPrice {
  id: number = 0;
  price: number | null = null;
  year: number | null = null;
  currencyId: number | null = null;
  currency: string | null = null;
}
export class vendorOperationTimes {
  id: number = 0;
  allDays: boolean | null = null;
  dayName: string | null = null;
  active: boolean = false;
  fromTime: any; //"00:00:00"
  toTime: any; //"00:00:00"
}

export class AssetModel {
  id: number | null = null;
  assetSerialNo: string | null = null;
  serialNumber: string | null = null;
  assetName: string | null = null;
  assetNumber: string | null = null;
  manufacturerName: string | null = null;
  modelName: string | null = null;
  systemID: string | null = null;
  department: any;
  departement: string | null = null;
  siteName: string | null = null;
  assetId: number | null = null;
  assetAnnualContractPrice: number | null = null;
  totalContractPrice: number | null = null;
  ppmMonths: number | null = null;
  modelDefinition: any;
  site: any;
  mContractAssetPrices: mContractAssetPrices[] = [];
}

export class UpdateFromView {
  ids: string | null = null;
  id: number | null = null;
  contractTypeId: number | null = null;
  contractStatusId: number | null = null;
  paymentMethod: number | null = null;
  contractDate: Date | null = null;
  startDate: Date | null = null;
  comment: string | null = null;
  numberOfYears: number | null = null;
  mContractYearPrice: mContractYearPrice[] = [];
  assetId: number | null = null;
}
