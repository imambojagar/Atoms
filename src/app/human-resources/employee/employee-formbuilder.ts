import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export function buildEmployeeForm(model: any) {
  let frm = new FormGroup({
    userName: new FormControl(),
    employeeId: new FormControl(),
    email: new FormControl(null, [Validators.email]),

    password: new FormControl(
      null,
      Validators.compose([
        Validators.minLength(6),
        Validators.pattern(new RegExp('(?=.*[0-9]*[A-Z]*[a-z]*[$@^!%*?&])')),
      ])
    ),
    cPassword: new FormControl(null, [Validators.minLength(6)]),

    isActive: new FormControl(true),

    roles: new FormControl([]),
    fullRoles: new FormControl([]),

    qualification: new FormControl(),
    qualifiactionName: new FormControl(),
    yearsOfExpirence: new FormControl(),
    mobileNumber: new FormControl(),
    extensionNo: new FormControl(),
    phoneNumber: new FormControl(),
    homeAddress: new FormControl(),

    customersId: new FormControl([]),
    userCustomers: new FormControl([]),
    customerName: new FormArray([]),

    assetGroupsId: new FormControl([]),
    userAssetGroups: new FormControl([]),
    assetGroupName: new FormArray([]),

    departmentIds: new FormControl(),
    departmentName: new FormControl(),
    modility: new FormControl(),
    modilityName: new FormControl(),
    subModility: new FormControl(),
    serviceTeam: new FormControl(),
    serviceTeamName: new FormControl(),
    modilityRisk: new FormControl(),
    skillLevel: new FormControl(),
    joiningDate: new FormControl(),
    joiningDateView: new FormControl(),
    profilePhotoName: new FormControl(),
    userCertifications: new FormArray([]),
    userCodes: new FormArray([]),

    costOfTravelHours: new FormControl(),
    rotaCode: new FormControl(),
    workingHours: new FormControl(),
    rateHours: new FormControl(),
    rateTravelHours: new FormControl(),
    languageId: new FormControl(),

    supervisorId: new FormControl(),
  });

  frm.patchValue(model);
  return frm;
}
