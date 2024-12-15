import { ContentType, DataField, PdfFontFamily, PdfFontStyle } from './enums';

export const ContentTypeList: any[] = [
  { key: 'Free Text', value: ContentType.FreeText },
  { key: 'Data Field', value: ContentType.DataField },
  { key: 'Barcode', value: ContentType.Barcode },
  { key: 'QRcode', value: ContentType.QRcode },
  // { key: 'Picture', value: ContentType.Picture },
];

export const DataFieldList: any[] = [
  { key: 'Free Text', value: DataField.None },
  { key: 'Visit Actual Date', value: DataField.VisitActualDate },
  { key: 'Visit Expected Date', value: DataField.VisitExpectedDate },
  { key: 'Visit Eng Name', value: DataField.VisitEngName },
  { key: 'Visit Asset Serial No', value: DataField.VisitAssetSerialNo },
  { key: 'Visit Asset Number', value: DataField.VisitAssetNumber },
  { key: 'Visit Asset Name', value: DataField.VisitAssetName },
  { key: 'Visit Next Date', value: DataField.VisitNextDate },
  { key: 'Visit Safety', value: DataField.VisitSafety },
  { key: 'Visit Type of Service', value: DataField.VisitTypeOfService },
  { key: 'Asset Number', value: DataField.AssetNumber },
];

export const PdfFontFamilyList: any[] = [
  { key: 'Helvetica', value: PdfFontFamily.Helvetica, name: 'Helvetica' },
  { key: 'Courier', value: PdfFontFamily.Courier, name: 'Courier' },
  { key: 'Times Roman', value: PdfFontFamily.TimesRoman, name: 'TimesRoman' },
  { key: 'Symbol', value: PdfFontFamily.Symbol, name: 'Symbol' },
  {
    key: 'Zapf Dingbats',
    value: PdfFontFamily.ZapfDingbats,
    name: 'ZapfDingbats',
  },
];

export const PdfFontStyleList: any[] = [
  { key: 'Regular', value: PdfFontStyle.Regular, name: 'Regular' },
  { key: 'Bold', value: PdfFontStyle.Bold, name: 'Bold' },
  { key: 'Italic', value: PdfFontStyle.Italic, name: 'Italic' },
  { key: 'Underline', value: PdfFontStyle.Underline, name: 'Underline' },
  { key: 'Strikeout', value: PdfFontStyle.Strikeout, name: 'Strikeout' },
];
