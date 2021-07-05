import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FileUpload } from 'src/app/models/file-upload.model';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
})
export class AddCustomerComponent implements OnInit {
  @ViewChild('makh') makh: ElementRef;
  @ViewChild('fullname') fullname: ElementRef;
  @ViewChild('phone') phone: ElementRef;
  @ViewChild('tenfilekhac') tenfilekhac: ElementRef;

  listFile: any[] = [];
  listOtherFile: any[] = [];
  listFileToUpload: any[] = [];
  customer = <any>{};
  newCustomer: Customer;
  selectedFiles: FileList = undefined;
  mainFiles: FileList = undefined;
  currentFileUpload: FileUpload;
  percentage: number;
  mainPercentage: number;
  currentMainFileUpload: FileUpload;

  constructor(private uploadService: FileUploadService) {}

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

  getTenFileKhac(): string {
    return this.tenfilekhac.nativeElement.value;
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }

  selectMainFile(event): void {
    this.mainFiles = event.target.files;
  }

  addOtherFileToList(): void {
    this.listOtherFile.push({
      name: this.getTenFileKhac(),
      file: new FileUpload(this.selectedFiles.item(0)),
    });
    console.log(this.listOtherFile);
  }

  removeFileFromOtherFileList(file: JSON): void {
    this.listOtherFile.splice(this.listOtherFile.indexOf(file), 1);
    console.log(this.listOtherFile);
  }

  addNewOthersFile(): void {
    this.listOtherFile.forEach((fileToUpload) => {
      this.currentFileUpload = fileToUpload;

      this.uploadService
        .pushOtherFileToStorage(
          fileToUpload.file,
          this.getMakh(),
          fileToUpload.name
        )
        .subscribe(
          (percentage) => {
            this.percentage = Math.round(percentage);
          },
          (err) => console.log(err)
        );
    });
  }

  checkForm(): boolean {
    if (
      this.getMakh() == '' ||
      this.getFullname() == '' ||
      this.getPhone() == ''
    )
      return false;
    else return true;
  }

  checkContractFile(): boolean {
    if (this.mainFiles == undefined) return false;
    else return true;
  }

  checkOtherFiles(): boolean {
    if (this.listOtherFile.length < 1) return false;
    else return true;
  }

  addNewCustomer(): void {
    if (!this.checkForm())
      alert('Chưa nhập đầy đủ thông tin rồi người đẹp ơi! Kiểm tra lại nhé!');
    else if (!this.checkContractFile())
      alert('Chưa up file hợp đồng rồi người đẹp ơi!');
    else if (!this.checkOtherFiles()) {
      if (
        confirm(
          'Chưa up bất cứ file khác nào. Vẫn tiếp tục thêm khách hàng này chứ?'
        )
      ) {
        const file = this.mainFiles.item(0);
        this.mainFiles = undefined;
        this.currentMainFileUpload = new FileUpload(file);
        this.newCustomer = new Customer(
          this.getMakh(),
          this.getFullname(),
          this.getPhone(),
          this.currentMainFileUpload
        );

        this.uploadService
          .pushFileToStorage(this.currentMainFileUpload, this.newCustomer)
          .subscribe(
            (percentage) => {
              this.mainPercentage = Math.round(percentage);
            },
            (error) => {
              console.log(error);
            }
          );

        this.setMakh('');
        this.setFullname('');
        this.setPhone('');
      }
    } else {
      this.addNewOthersFile();
      this.selectedFiles = undefined;
      const file = this.mainFiles.item(0);
      this.mainFiles = undefined;
      this.currentMainFileUpload = new FileUpload(file);
      this.newCustomer = new Customer(
        this.getMakh(),
        this.getFullname(),
        this.getPhone(),
        this.currentMainFileUpload
      );

      this.uploadService
        .pushFileToStorage(this.currentMainFileUpload, this.newCustomer)
        .subscribe(
          (percentage) => {
            this.mainPercentage = Math.round(percentage);
          },
          (error) => {
            console.log(error);
          }
        );

      this.setMakh('');
      this.setFullname('');
      this.setPhone('');
    }
  }

  ngOnInit(): void {
    
  }
}
