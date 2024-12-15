export class OrderingCylindersLOX {
  id!: 0;
  userId?: string | null = null;
  userName?: string | null = null;
  o2KTypeEmpty?: number | null = null;
  o2MTypeEmpty?: number | null = null;
  o2ETypeEmpty?: number | null = null;
  o2DTypeEmpty?: number | null = null;
  makTypeEmpty?: number | null = null;
  maeTypeEmpty?: number | null = null;
  n2OKTypeEmpty?: number | null = null;
  n2OETypeEmpty?: number | null = null;
  cO2ETypeEmpty?: number | null = null;
  cO2KTypeEmpty?: number | null = null;
  mixtureMTypeEmpty?: number | null = null;
  n2KTypeEmpty?: number | null = null;
  pftMixEmpty?: number | null = null;
  pftHeliumEmpty?: number | null = null;
  liquidNitrogenLarge121LEmpty?: number | null = null;
  liquidNitrogenMedium50LEmpty?: number | null = null;
  liquidNitrogenSmall30LEmpty?: number | null = null;
  customerId?: number | null = null;
  customerName?: any;
  date?: Date | null = null;
  attachmentUrl?: string | null = null;
  suppliersMails?: string[] = [];
  backUpStatusId?: number | null = null;
  backUpStatusName?: string | null = null;
  nextBackUpStatusId?: number | null = null;
  nextBackUpStatusName?: string | null = null;

  prNumber?: string | null = null;
  poNumber?: string | null = null;
  invoiceNumber?: string | null = null;
  deliveryDate?: Date | null = null;

  prAttachment?: string | null = null;
  poAttachment?: string | null = null;
  invoiceAttachment?: string | null = null;

  pcdSubmissionDate?: Date | null = null;
  prfAttachment?: string | null = null;
  prfDate?: Date | null = null;

  lox2VolumeRq?: number | null = null;
  lox1VolumeRq?: number | null = null;
  lox1Volume?: number | null = null;
  lox2Volume?: number | null = null;

  prfApproved?: boolean | null = null;
  supplierId?: number | null = null;
  supplierName?: any;
  contactNumber?: string | null = null;

  isCylinder?: boolean | null = null;

  invoiceFrom?: Date | null = null;
  invoiceTo?: Date | null = null;
}

export class CylindersPercentageModel {
  cO2ETypeEmptyPR?: number = 0;
  o2KTypeEmptyPR?: number = 0;
  o2MTypeEmptyPR?: number = 0;
  o2ETypeEmptyPR?: number = 0;
  o2DTypeEmptyPR?: number = 0;
  makTypeEmptyPR?: number = 0;
  maeTypeEmptyPR?: number = 0;
  n2OKTypeEmptPR?: number = 0;
  n2OETypeEmptPR?: number = 0;
  cO2ETypeEmptPR?: number = 0;
  cO2KTypeEmptyPR?: number = 0;
  mixtureMTypeEmptyPR?: number = 0;
  n2KTypeEmptyPR?: number = 0;
  pftMixEmptyPR?: number = 0;
  pftHeliumEmptyPR?: number = 0;
  liquidNitrogenLarge121LEmptyPR?: number = 0;
  liquidNitrogenMedium50LEmptyPR?: number = 0;
  liquidNitrogenSmall30LEmptyPR?: number = 0;
  loX1Volume?: number = 0;
  loX2Volume?: number = 0;
}

export const cylinderProperties = [
  {
    label: 'O2 K',
    control: 'o2KTypeEmptyRecieved',
    prfLabel: 'O2 K Size',
    receivedLabel: 'O2 K Recieved',
  },
  {
    label: 'O2 E',
    control: 'o2ETypeEmptyRecieved',
    prfLabel: 'O2 E Size',
    receivedLabel: 'O2 E Recieved',
  },
  {
    label: 'O2 M',
    control: 'o2MTypeEmptyRecieved',
    prfLabel: 'O2 M Size',
    receivedLabel: 'O2 M Recieved',
  },
  {
    label: 'O2 D',
    control: 'o2DTypeEmptyRecieved',
    prfLabel: 'O2 D Size',
    receivedLabel: 'O2 D Recieved',
  },
  {
    label: 'N2O K',
    control: 'n2OKTypeEmptyRecieved',
    prfLabel: 'N2O K Size',
    receivedLabel: 'N2O K Recieved',
  },
  {
    label: 'N2O E',
    control: 'n2OETypeEmptyRecieved',
    prfLabel: 'N2O E Size',
    receivedLabel: 'N2O E Recieved',
  },
  {
    label: 'CO2 E',
    control: 'cO2ETypeEmptyRecieved',
    prfLabel: 'CO2 E Size',
    receivedLabel: 'CO2 E Recieved',
  },
  {
    label: 'CO2 K',
    control: 'cO2KTypeEmptyRecieved',
    prfLabel: 'CO2 K Size',
    receivedLabel: 'CO2 K Recieved',
  },
  {
    label: 'N2 K',
    control: 'n2KTypeEmptyRecieved',
    prfLabel: 'N2 K Size',
    receivedLabel: 'N2 K Recieved',
  },
  {
    label: 'MA K',
    control: 'makTypeEmptyRecieved',
    prfLabel: 'MEDICAL AIR K SIZE',
    receivedLabel: 'MA K Recieved',
  },
  {
    label: 'MA E',
    control: 'maeTypeEmptyRecieved',
    prfLabel: 'MEDICAL AIR E SIZE',
    receivedLabel: 'MA E Recieved',
  },
  {
    label: 'MIXTURE HELIUM + AIR',
    control: 'mixtureMTypeEmptyRecieved',
    prfLabel: 'MIXTURE HELIUM + AIR',
    receivedLabel: 'MIXTURE HELIUM + AIR Recieved',
  },
  {
    label: 'MIXTURE C2H2 - PFT',
    control: 'pftMixEmptyRecieved',
    prfLabel: 'MIXTURE C2H2 - PFT',
    receivedLabel: 'MIXTURE C2H2 - PFT Recieved',
  },
  {
    label: 'HELIUM',
    control: 'pftHeliumEmptyRecieved',
    prfLabel: 'HELIUM',
    receivedLabel: 'HELIUM Recieved',
  },
  {
    label: 'NITRIC OXIDE 11PPM',
    control: 'nitricoxidE11PPMRecieved',
    prfLabel: 'NITRIC OXIDE 11PPM',
    receivedLabel: 'NITRIC OXIDE 11PPM Recieved',
  },
  {
    label: 'NITRIC OXIDE 25PPM',
    control: 'nitricoxidE25PPMRecieved',
    prfLabel: 'NITRIC OXIDE 25PPM',
    receivedLabel: 'NITRIC OXIDE 25PPM Recieved',
  },
  {
    label: 'Liquid Nitrogen Small 30 L',
    control: 'liquidNitrogenSmall30LEmptyRecieved',
    prfLabel: 'LIQUID N2/ Gallon',
    receivedLabel: 'LIQUID N2/ Gallon',
  },
  {
    label: 'Liquid Nitrogen Medium 50 L',
    control: 'liquidNitrogenMedium50LEmptyRecieved',
    prfLabel: '',
    receivedLabel: '',
  },
  {
    label: 'Liquid Nitrogen Large 121 L',
    control: 'liquidNitrogenLarge121LEmptyRecieved',
    prfLabel: '',
    receivedLabel: '',
  },
];
