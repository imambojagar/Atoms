export class NewEmployeeModel {
  userName: string = '';
  email: string = '';
  password: string = '';
  cPassword: string = '';
  roles: [string] = [''];
  isActive: boolean = true;
  employeeId: number = 0;
  position: number | null = null;
  qualification: number | null = null;
  customersId: number[] = [0];
  yearsOfExpirence: number | null = null;
  mobileNumber: number | null = null;
  homeAddress: string | null = null;
  group: number | null = null;
  costOfTravelHours: number | null = null;
  rotaCode: string | null = null;
  workingHours: number | null = null;
  rateHours: number | null = null;
  rateTravelHours: number | null = null;
  modility: number | null = null;
  subModility: number | null = null;
  serviceTeam: number | null = null;
  modilityRisk: number | null = null;
  skillLevel: number | null = null;
  endUserSkillLevel: number | null = null;
  techDepartementId: number | null = null;
  joiningDate: Date | null = null;
  phoneNumber: number | null = null;
  profilePhotoName: string | null = null;
  userCertifications: userCertifications[] = [];
  userCodes: userCodes[] = [];
  departmentId: number = 0;
}

export class userCodes {
  id: number = 0;
  userId: number = 0;
  codeTypeId: number | null = null;
  codeValue: string | null = null;
}

export class userCustomers {
  customerId: number | null = null;
  customerName: string | null = null;
}

export class userCertifications {
  expireDate: Date | null = null;
  expireDateView: string | null = null;
  attachmentName: string | null = null;
  name: string | null = null;
  modelDefinitionId: number | null = null;
  modelDefinationName: number | null = null;
}

export class FullRoleInfo {
  id: string = '';
  name: string = '';
  value: string | null = null;
  fixedName: string | null = null;
  checked: boolean = false;
}
