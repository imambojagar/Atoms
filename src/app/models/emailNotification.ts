export class EmailNotifiactionModel{
    id: number = 0;
    subject: string | null = null;
    body: string | null = null;
    isHTML: boolean = false;
    email: string | null = null;
    sent: boolean = false;
    sendDate:  Date|null=null;
    ignore: boolean = false;
    userId: string | null = null;
    userName: string | null = null;
    attachments: attachments []=[];
}
export class attachments{
    id: number = 0;
    eMailNotificationId: number = 0;
    fileName: string | null = null;
}