import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomModel } from './gas-room.model';

export function getRoomModel(formValue: any) {
  let room = { ...formValue };
  return room as FormGroup;
}

export function buildRoomForm(model: RoomModel, fb: FormBuilder) {
  let frm: FormGroup = fb.group({
    id: 0,
    roomId: ['', Validators.required],
    o2ManifoldMainOut: false,
    o2ManifoldRightBank: false,
    o2ManifoldLeftBank: false,
    o2ManifoldEmergency: false,
    n2OMainout: false,
    n2ORightBank: false,
    n2OLeftBank: false,
    n2OEmergencyBank: false,
    medicalAirMainOut: false,
    medicalAirRightBank: false,
    medicalAirLeftBank: false,
    medicalAirEmergencyBank: false,
    cO2MainOut: false,
    cO2RightBank: false,
    cO2LeftBank: false,
    cO2EmergencyBank: false,
    n2MainOut: false,
    n2RightBank: false,
    n2LeftBank: false,
    n2EmergencyBank: false,
    loX1Volume: false,
    loX2Volume: false,
    loX1Pressure: false,
    loX2Pressure: false,
    compressorsCheckforAnyUnusualNoise: false,
    compressorsOutputPressure: false,
    compressorsMedicalAirLinePressure7To8Bar: false,
    compressorsMedicalAirLinePressure4To5Bar: false,
    dryersCheckforAlarmOrUnusualNoise: false,
    vacuumPumpCheckOilLeakage: false,
    vacuumPumpCheckForAnyUnusualNoise: false,
    vacuumPumpPressure: false,
    agssCheckForAnyAlarm: false,
    agssCheckManualOperation: false,
    agssCheckAndCleanFilter: false,
    o2KTypeEmpty: false,
    o2MTypeEmpty: false,
    o2ETypeEmpty: false,
    o2DTypeEmpty: false,
    makTypeEmpty: false,
    maeTypeEmpty: false,
    n2OKTypeEmpty: false,
    n2OETypeEmpty: false,
    cO2KTypeEmpty: false,
    cO2ETypeEmpty: false,
    mixtureMTypeEmpty: false,
    n2KTypeEmpty: false,
    pftMixEmpty: false,
    pftHeliumEmpty: false,
    liquidNitrogenLarge121LEmpty: false,
    liquidNitrogenMedium50LEmpty: false,
    liquidNitrogenSmall30LEmpty: false,
    nitricoxidE11PPM: false,
    nitricoxidE25PPM: false,
    customerId: [],
    customerName: [],
  });

  frm.patchValue(model);
  return frm;
}
