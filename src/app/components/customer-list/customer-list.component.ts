import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { FileUpload } from 'src/app/models/file-upload.model';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  @ViewChild('makh') makh: ElementRef;
  @ViewChild('fullname') fullname: ElementRef;
  @ViewChild('phone') phone: ElementRef;

  p: number = 1;

  listCustomer: any[];
  listFile: any[] = [];
  othersFileOfCustomer: any[] = [];
  customer = <any>{};
  newCustomer: Customer;
  selectedCustomer = <any>{};
  fileUrl = '';
  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  percentage: number;

  constructor(private uploadService: FileUploadService, private spinner: NgxSpinnerService) {}

  setMakh(makh: string): void {
    this.makh.nativeElement.value = makh;
  }

  setFullname(fullname: string): void {
    this.fullname.nativeElement.value = fullname;
  }

  setPhone(phone: string): void {
    this.phone.nativeElement.value = phone;
  }

  getMakh(): string {
    return this.makh.nativeElement.value;
  }

  getFullname(): string {
    return this.fullname.nativeElement.value;
  }

  getPhone(): string {
    return this.phone.nativeElement.value;
  }

  getInputValue(): void {
    this.customer.makh = this.getMakh();
    this.customer.fullname = this.getFullname();
    this.customer.phone = this.getPhone();
    console.log(this.customer);
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files;
    this.listFile.push(this.selectedFiles.item(0));
    console.log(this.listFile);
  }

  addNewCustomer(): void {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;
    this.currentFileUpload = new FileUpload(file);
    this.newCustomer = new Customer(
      this.getMakh(),
      this.getFullname(),
      this.getPhone(),
      this.currentFileUpload
    );

    this.uploadService
      .pushFileToStorage(this.currentFileUpload, this.newCustomer)
      .subscribe(
        (percentage) => {
          this.percentage = Math.round(percentage);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  viewDetailsOfCustomer(makh: string): void {
    for (let i = 0; i < this.listCustomer.length; i++) {
      if (this.listCustomer[i].makh == makh) {
        this.selectedCustomer = this.listCustomer[i];
        break;
      }
    }
    this.setMakh(this.selectedCustomer.makh);
    this.setFullname(this.selectedCustomer.name);
    this.setPhone(this.selectedCustomer.phone);
    this.fileUrl = this.selectedCustomer.fileHopDong.url;
    this.uploadService
      .getOthersFileByCustomerId(makh)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          // store the key
          changes.map((c) => ({
            key: c.payload.key,
            ...c.payload.val(),
          }))
        )
      )
      .subscribe((others) => {
        this.othersFileOfCustomer = others;
        console.log(this.othersFileOfCustomer);
      });
  }

  ngOnInit(): void {
    this.spinner.show()
    this.uploadService
      .getAllCustomers()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          // store the key
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((listCustomer) => {
        this.listCustomer = listCustomer;
        console.log(this.listCustomer);
        this.spinner.hide()
      });
  }

}
