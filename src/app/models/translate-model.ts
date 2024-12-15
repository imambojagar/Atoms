export class TranslateModel {
    id: number = 0;
    word: string | null = null;
    translations: translations[] = [];
}

export class translations {
    id: number = 0;
    dictionaryId: number = 0;
    langId: number = 0;
    langName: string | null = null;
    transValue: string | null = null;
}