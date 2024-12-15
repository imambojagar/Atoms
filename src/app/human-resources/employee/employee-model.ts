export class EmployeeModel {
  userName?: string | null = null;
  email?: string | null = null;
  password?: string | null = null;
  cPassword?: string | null = null;

  roles: string[] = [];
  isActive?: boolean | null = null;

  employeeId?: string | null = null;

  position?: number | null = null;
  qualification?: number | null = null;
  yearsOfExpirence?: number | null = null;
  mobileNumber?: string | null = null;
  extensionNo?: string | null = null;
  homeAddress?: string | null = null;
  group?: number | null = null;
  costOfTravelHours?: number | null = null;
  rotaCode?: string | null = null;
  workingHours?: number | null = null;
  rateHours?: number | null = null;
  rateTravelHours?: number | null = null;

  modility?: number | null = null;
  modilityId?: number | null = null;

  subModility?: number | null = null;

  serviceTeam?: number | null = null;
  serviceTeamId?: number | null = null;

  modilityRisk?: number | null = null;
  skillLevel?: number | null = null;
  endUserSkillLevel?: number | null = null;
  joiningDate: Date | null = null;
  phoneNumber?: number | null = null;
  profilePhotoName?: string | null = null;

  userCertifications: UserCertifications[] = [];

  departmentIds?: number[] | null = null;
  departments?: DepartmentModel[] | null = null;
  department?: DepartmentModel | null = null;

  customersId?: number[] | null = null;
  userCustomers?: UserCustomers[] | null = null;

  assetGroupsId?: number[] | null = null;
  userAssetGroups?: UserAssetGroups[] | null = null;

  techDepartementId?: number | null = null;
  techDepartementName?: string | null = null;

  userCodes?: UserCodes[] | null = null;

  qualifiaction?: string | null = null;

  positionId?: number | null = null;
  qualificationId?: number | null = null;
  groupId?: number | null = null;
  languageId?: number | null = null;

  fullRoles?: RoleModel[];

  //Add First and Second Line Managers
  supervisorId?: string | null = null;

  createdOn?: Date | null = null;
  modifiedOn?: Date | null = null;
}

export class UserCertifications {
  expireDate?: Date;
  attachmentName?: string;
  name?: string;
  modelDefinitionId?: number;
  modelDefinationName?: string;
  modelDefinitionId1?: any;
}

interface UserCodes {
  id?: number;
  userId?: string;
  codeTypeId?: number;
  codeValue?: string;
}

interface DepartmentModel {
  id?: number;
  departmentName?: string;
  departmentCode?: string;
  ntCode?: string;
}

interface UserCustomers {
  customerId?: number;
  customerName?: string;
}

interface UserAssetGroups {
  assetGroupId?: number;
  assetGroupName?: string;
}

interface RoleModel {
  id?: string;
  name: string;
  fixedName?: string;
}
