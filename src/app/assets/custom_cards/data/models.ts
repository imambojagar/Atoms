export interface CutomCard {
  id: number;
  name?: string;
  code?: string;
  width?: number;
  height?: number;
  margin?: number;
  margin_Left?: number;
  margin_Right?: number;
  margin_Top?: number;
  margin_Bottom?: number;
  color?: {
    r: number;
    g: number;
    b: number;
  };
  translations?: CustomCardName[];
  contents?: CutomLabelContent[];
}

export interface CustomCardName {
  id?: number;
  customLabelId?: number;
  langId?: number;
  langName?: string;
  name?: string;
}

export interface CutomLabelContent {
  id?: number;
  customLabelId?: number;
  contentType?: number;
  dataField?: number;
  x?: number;
  y?: number;
  width?: number | null;
  height?: number | null;
  fontName?: number | null;
  fontSize?: number | null;
  fontStyle?: number | null;
  foreColor_R?: number | null;
  foreColor_G?: number | null;
  foreColor_B?: number | null;
  prefix?: string | null;
  text?: string | null;
  suffix?: string | null;
  translations: CutomLabelContentTextTranslations[];
}

export interface CutomLabelContentTextTranslations {
  id?: number;
  customLabelContentId?: number;
  langId?: number;
  langName?: string;
  prefix?: string | null;
  text?: string | null;
  suffix?: string | null;
}
