export enum ContentType {
  None = 0,
  FreeText = 1,
  DataField = 2,
  Barcode = 3,
  Picture = 4,
  QRcode = 5,
}

export enum DataField {
  None = 0,
  VisitActualDate = 1,
  VisitExpectedDate = 2,
  VisitEngName = 3,
  VisitAssetSerialNo = 4,
  VisitAssetNumber = 5,
  VisitAssetName = 6,
  VisitNextDate = 7,
  VisitSafety = 8,
  VisitTypeOfService = 9,
  AssetNumber = 10,
}

export enum PdfFontFamily {
  Helvetica,

  Courier,

  TimesRoman,

  Symbol,

  ZapfDingbats,
}

export enum PdfFontStyle {
  Regular = 0x0,

  Bold = 0x1,

  Italic = 0x2,

  Underline = 0x4,

  Strikeout = 0x8,
}
