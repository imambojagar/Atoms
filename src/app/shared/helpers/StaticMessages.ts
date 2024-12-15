import { Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
export class StaticMessages {
    public static InvalidForm( msgService: MessageService) {
        msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please Fill Required Data',
            life: 3000,
          });
    }
    public static OnAdd(navToRoute: string | null, res: any, router: Router, msgService: MessageService){
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            msgService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            if (navToRoute != null)
              router.navigate([ navToRoute ]);
          } else {
            msgService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
    }
    public static onUpdate(navToRoute: string | null, res: any, router: Router, msgService: MessageService){
      console.log('res', res);
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          msgService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
            if (navToRoute != null)
            router.navigate([ navToRoute ]);
        } else {
          msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
    }

    public static OnDelete(id: number,
      confirmationService: ConfirmationService,
      msgService: MessageService,
      onDelete: () => void) {
      confirmationService.confirm({
        message: 'Are you sure you want to delete ?',
        header: 'Confirm',
        rejectButtonStyleClass: 'p-button-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          onDelete();
          msgService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Model Deleted',
            life: 3000,
          });
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              msgService.add({
                severity: 'warn',
                summary: 'Cancelled',
                detail: 'You have cancelled',
              });
              break;
            case ConfirmEventType.CANCEL:
              msgService.add({
                severity: 'warn',
                summary: 'Cancelled',
                detail: 'You have cancelled',
              });
              break;
          }
        },
      });
    }
}
