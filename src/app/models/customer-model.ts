export class CustomerModel {
  id: number = 0;
  custName: string = '';
  customerCode: number | null = null;
  custCategoryId: number | null = null;
  custTypeId: number | null = null;
  custGroupId: number | null = null;
  cityId: number | null = null;
  organizationId: number | null = null;
  buildings: BuildingsModle[] = [];
  assignedEmployeeId: string | null = null;
  operatingUnitNumber: string | null = null;
  operatingUnitName: string | null = null;
  attachments: Attachments[] = [];
}

export class custContactPersons {
  id: number = 0;
  customerId: number = 0;
  name: string | null = null;
  mobile: string | null = null;
  email: string | null = null;
}
export class BuildingsModle {
  id: number = 0;
  customerId: number = 0;
  clientBuildingId: number | null = null;
  clientBuildingName: string | null = null;
  floors: Floors[] = [];
}

export class Floors {
  id: number = 0;
  buildingId: number | null = null;
  clientFloorId: number | null = null;
  clientFloorName: string | null = null;
  departments: Departments[] = [];
  departmentsOptions: Departments[] = [];
}
export class Departments {
  id: number = 0;
  floorId: number = 0;
  departmentId: number | null = null;
  departmentName: string | null = null;
}

export class LookupModle {
  id: number | null = null;
  name: string | null = null;
  value: number | null = null;
}
export class Attachments {
  id?: number = 0;
  customerId?: number = 0;
  attachmentName?: string | null = null;
  attachmentURL?: string | null = null;
}

export class CustomerModelB {
  id?: number = 0;
  custName?: string = '';
  nameAsLang?: string = '';
  // custNameLangs?: CustNameLangsModel[] = [];
  translations?: CustNameLangsModel[] = [];
  customerCode?: string = '';
  custCategoryId?: number = 0;
  custCategoryName?: string = '';
  custTypeId?: number = 0;
  custTypeName?: string = '';
  custGroupId?: number = 0;
  custGroupName?: string = '';
  cityId?: number = 0;
  cityName?: string = '';
  assignedEmployeeId?: string = '';
  assignedEmployeeUserName?: string = '';
  orgName?: string = '';
  organizationId?: number = 0;
  attachments?: Attachments[] = [];
  buildings?: BuildingsModleB[] = [];
  operatingUnitNumber?: string | null = null;
  operatingUnitName?: string | null = null;
}

export class CustNameLangsModel {
  id?: number = 0;
  customerId?: number = 0;
  langId?: number | null = null;
  nameValue?: string | null = null;
  langName?: string | null = null;
}

export class BuildingsModleB {
  id?: number = 0;
  customerId?: number = 0;
  clientBuildingId?: number | null = null;
  clientBuildingName?: string | null = null;
  floors?: FloorModelB[] = [];
}

export class FloorModelB {
  id?: number = 0;
  buildingId?: number = 0;

  clientFloorId?: number | null = null;
  clientFloorName?: string | null = null;

  //selected list
  departments?: DepartmentModelB[] = [];

  //departments options list
  departmentsOptions?: DepartmentModelB[] = [];
}

export class DepartmentModelB {
  id?: number = 0;
  floorId?: number = 0;
  departmentId?: number | null = null;
  departmentName?: string | null = null;
  rooms?: RoomModelB[] = [];
}

export class RoomModelB {
  id?: number = 0;
  departmentId?: number = 0;
  clientRoomId?: number | null = null;
  roomName?: string | null = null;
}
