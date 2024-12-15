export class MessageNotificationModel {
    id: number = 0;
    code: number = 0;
    name: string | null = null;
    title: string | null = null;
    text: string | null = null;
    translations: translations[] = [];
}

export class translations {
    id: number = 0;
    messageId: number = 0;
    messageCode: number = 0;
    messageName: string | null = null;
    langId: number = 0;
    langName: string | null = null;
    titleValue: string | null = null;
    textValue: string | null = null;
}