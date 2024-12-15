import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PrimengModule } from '../../shared/primeng.module';
import { Table } from 'primeng/table';
import { ProductService } from '../../services/productservice';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddControlComponent } from './add-control/add-control.component';
import { Router } from '@angular/router';
import { AssetsService } from '../../services/assets.service';
import { AssetTransferService } from '../../services/asset-transfer.service';
import { AssetTransfer } from '../../models/asset-transfer';
import { ExportService } from '../../shared/services/export.service';
import { CustomerService } from '../../services/customer.service';
import { AssetSearchComponent } from './asset-search/asset-search.component';
import { ViewControlComponent } from './view-add-control/view-control.component';

@Component({
  selector: 'app-asset-transfer',
  standalone: true,
  imports: [PrimengModule, AddControlComponent, AssetSearchComponent, ViewControlComponent],
  providers: [AssetTransferService],
  templateUrl: './asset-transfer.component.html',
  styleUrl: './asset-transfer.component.scss'
})
export class AssetTransferComponent implements OnInit {


  productDialog: boolean = false;
  assets!: any[];
  product!: any;
  selectedAssets!: any[] | null;
  submitted: boolean = false;
  transferAssetModel : AssetTransfer = new AssetTransfer();
  filter: any = {
    pageSize: 10,
    pageNumber: 1
  };
  searchForm!:FormGroup;
  totalRows!: number;
  loading!: boolean;
  asset_id: any = 0;

  statuses: any[] = [
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' },
    { label: 'WAITING', value: 'info' }
  ];

  // @ViewChild('drawer') public modalComponent: any;

 // @ViewChild('modal') private modalComponent: any;



 public addTransferLoaded: boolean = false;
 public viewAssetTransferLoaded: boolean = false;
 public filterLoaded: boolean = false;
  searchValue: any = '';
  navIndes: number = 0;

  constructor(
    private exporteService: ExportService,private siteApi:CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private assetApi:AssetsService,
    private api:AssetTransferService,
    private cdr: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    this.getAllAssetsTransfer();

    /* this.productService.getProducts().then((data) => (this.products = data)); */
  }


  async openModal() {
    this.asset_id = 0;
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  async openViewModal() {
    this.viewAssetTransferLoaded = !this.viewAssetTransferLoaded;
  }

  async openFilterModal() {
    this.filterLoaded = !this.filterLoaded;
  }

     openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.assets = this.assets.filter((val) => !this.selectedAssets?.includes(val));
                this.selectedAssets = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
            }
        });
    }

   /*  editProduct(product: any) {
        this.product = { ...product };
        this.productDialog = true;
    } */

     navToDetails(row: any, index: number) {
      this.transferAssetModel.id = row.id;
      this.asset_id = row.id;
      this.navIndes = index;
      this.addTransferLoaded = !this.addTransferLoaded;
      /* this.router.navigate(['/maintenance/asset-transfer/edit-control'], { queryParams: { data: row.id, index } }); */
    }

    viewDetails(row: any, index: number) {
      this.transferAssetModel.id = row.id;
      this.asset_id = row.id;
      this.navIndes = index;
      this.viewAssetTransferLoaded = !this.viewAssetTransferLoaded;
      /* this.router.navigate(['/maintenance/asset-transfer/edit-control'], { queryParams: { data: row.id, index } }); */
    }

    getAssetsTransferSearch(searchdata: any) {
      this.filter.assetGroup = searchdata;
    }

    applyGlobalFilter(event: Event) {
      if (this.searchValue) {
        this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
        this.assets = this.assets.filter((row: any) =>
          Object.values(row).some((val: any) => String(val).toLowerCase().includes(this.searchValue))
        );
      }
      else {
        this.resetGlobalFilter()
      }
      this.cdr.detectChanges();
    }

    resetGlobalFilter() {
      this.searchValue = ''; // Clear the search input
      this.getAllAssetsTransfer()
      this.cdr.detectChanges();
    }

    getAllAssetsTransfer() {
      /* this.filter.assetGroup=this.searchForm.value.assetGroup; */
      this.api.getAssetTransfer(this.filter).subscribe((res: any) => {
        const data = res.data;
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.assets = data;
          this.totalRows = res.totalRows;
          this.loading = false;
          this.cdr.detectChanges();
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
      });
    }


    paginate(event: any) {
      /* this.loading = true; */
      this.filter.pageNumber = event.page + 1;
      this.getAllAssetsTransfer();
      this.loading = false;
    }

    deleteRow(row: any) {
      this.transferAssetModel.id = row.id;
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this ?',
        header: 'Confirm',
        rejectButtonStyleClass: 'p-button-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.deleteAssetTransfer(row.id).subscribe(res => {
            console.log("delete res", res)
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });
              this.getAllAssetsTransfer();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 3000,
              });
            }
          });
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
              break;
            case ConfirmEventType.CANCEL:
              this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
              break;
          }
        }
      });

    }

    deleteProduct(product: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.assets = this.assets.filter((val) => val.id !== product.id);
                this.product = {};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                this.assets[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.assets.push(this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            this.assets = [...this.assets];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.assets.length; i++) {
            if (this.assets[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
              return 'info';
        }
    }

    clear(table: Table) {
      table.clear();
    }

}
