import { Component, Input } from '@angular/core';
/* import { TransactionHistory } from '../../models/transaction-history';
import { EmployeeService } from 'src/app/data/service/employee.service'; */
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { TransactionHistory } from '../../../models/transaction-history';
import { FormsModule } from '@angular/forms';
// import { format } from 'date-fns';
@Component({
  standalone: true,
  selector: 'app-transaction-history',
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent {
  @Input() transactionHistory: TransactionHistory = new TransactionHistory();
  constructor(private employeeService: EmployeeService, public datepipe: DatePipe) {

  }
  ngOnInit(): void {
    this.getUsernameById(this.transactionHistory?.createdBy, this.transactionHistory?.modifiedBy);
    if (this.transactionHistory?.createdDate)
      this.transactionHistory.createdDate = this.datepipe.transform(this.transactionHistory.createdDate, 'dd/MM/yyyy HH:mm:ss'); //format(this.transactionHistory.createdDate, 'dd/MM/yyyy HH:mm:ss')
    if (this.transactionHistory?.modifiedDate)
      this.transactionHistory.modifiedDate = this.datepipe.transform(this.transactionHistory.modifiedDate, 'dd/MM/yyyy HH:mm:ss');//format(this.transactionHistory.modifiedDate, 'dd/MM/yyyy HH:mm:ss')
  }
  getUsernameById(createdBy: any, modifiedBy: any) {
    if (createdBy)
      this.employeeService.getEmployeeById(createdBy).subscribe(
        data => {
          this.transactionHistory.createdByName = data.userName
        }
      )
    if (modifiedBy)
      this.employeeService.getEmployeeById(modifiedBy).subscribe(
        data => {
          this.transactionHistory.modifiedByName = data.userName
        }
      )
  }
}
