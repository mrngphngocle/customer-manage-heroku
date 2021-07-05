import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FileUpload } from 'src/app/models/file-upload.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  @ViewChild('searchmakh') searchmakh: ElementRef;
  @ViewChild('makh') makh: ElementRef;
  @ViewChild('fullname') fullname: ElementRef;
  @ViewChild('phone') phone: ElementRef;
  @ViewChild('tenfilekhac') tenfilekhac: ElementRef;

  selectedFiles: FileList = undefined;
  listOtherFile: any[] = [];
  customer = <any>{};
  othersFileOfCustomer: any[] = [];
  fileUrl = '';
  isEditing = false;
  isHaveCustomer = false;
  isHaveOthersFile = false;
  currentFileUpload: FileUpload;
  percentage: number;
  messagePreUpload = '';

  constructor(
    private uploadService: FileUploadService,
    private spinner: NgxSpinnerService
  ) {}

  getSearchMakh(): string {
    return this.searchmakh.nativeElement.value;
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

  resetSearchMakh(): void {
    this.searchmakh.nativeElement.value = '';
  }

  setMakh(makh: string): void {
    this.makh.nativeElement.value = makh;
  }

  setFullname(fullname: string): void {
    this.fullname.nativeElement.value = fullname;
  }

  setPhone(phone: string): void {
    this.phone.nativeElement.value = phone;
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }

  addOtherFileToList(): void {
    var check = false;
    this.listOtherFile.forEach((otherFile) => {
      if (otherFile.file.file.name == this.selectedFiles.item(0).name) {
        alert('Bạn đã chọn file này rồi!');
        check = true;
      }
    });
    if (!check) {
      this.listOtherFile.push({
        name: this.getTenFileKhac(),
        file: new FileUpload(this.selectedFiles.item(0)),
      });
      console.log(this.listOtherFile);
      this.messagePreUpload =
        this.listOtherFile.length + ' file đang được chọn.';
    }
  }

  addNewOthersFile(): void {
    if (this.listOtherFile.length == 0)
      alert('Có gì đâu mà lưu! Chọn file đi emmmmmm!');
    else {
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
              this.messagePreUpload = '';
            },
            (err) => console.log(err)
          );
      });
      this.listOtherFile = [];
    }
  }

  searchCustomer(): void {
    if (this.getSearchMakh() == '') alert('Chưa nhập mã KH để tìm kiếm!');
    else {
      this.spinner.show();
      let makh = this.getSearchMakh();
      this.uploadService
        .getCustomerById(makh)
        .snapshotChanges()
        .pipe(
          map((changes) =>
            // store the key
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
        .subscribe((getCustomer) => {
          if (getCustomer.length < 1) {
            this.spinner.hide()
            let content =
              "<div class='alert alert-warning alert-dismissible fade show' role='alert'>" +
              'Không có/còn khách hàng ứng với mã KH này!' +
              "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
              "<span aria-hidden='true'>&times;</span></button></div>";
            $('#alertLocation').prepend(content);
            setTimeout(() => {
              $('.alert')
                .fadeTo(500, 0)
                .slideUp(500, function () {
                  $(this).remove();
                });
            }, 3000);
          } else {
            this.customer = getCustomer[0];
            console.log(this.customer);
            this.isHaveCustomer = true;
            this.setMakh(this.customer.makh);
            this.setFullname(this.customer.name);
            this.setPhone(this.customer.phone);
            this.fileUrl = this.customer.fileHopDong.url;

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
                if (this.othersFileOfCustomer.length > 0)
                  this.isHaveOthersFile = true;
                console.log(this.othersFileOfCustomer);
                this.spinner.hide();
              });
          }
        });
    }
  }

  onEditCustomer(): void {
    this.isEditing = true;
  }

  endEditCustomer(): void {
    const data = {
      name: this.getFullname(),
      phone: this.getPhone(),
    };
    this.isEditing = false;
    this.uploadService
      .updateCustomer(this.customer.key, data)
      .then(() => alert('Sửa thông tin khách hàng thành công!'))
      .catch((err) => console.log(err));
  }

  deleteOtherFile(key: string, name: string): void {
    if (confirm('Chắc chắn muốn xóa chứ?')) {
      this.uploadService.deleteOtherFile(key, name);
    }
  }

  deleteCustomer(): void {
    if (
      confirm(
        'Toàn bộ thông tin cũng như file liên quan của khách hàng này sẽ bị XÓA VĨNH VIỄN khỏi hệ thống. Chắc chắn muốn xóa chứ người đẹp!?'
      )
    ) {
      this.othersFileOfCustomer.forEach((otherFile) => {
        this.uploadService.deleteOtherFile(otherFile.key, otherFile.file.name);
      });
      this.uploadService.deleteContractFileStorage(
        this.customer.fileHopDong.name
      );
      this.uploadService
        .deleteCustomerDatabse(this.customer.key)
        .then(() => {
          alert('Xóa khách hàng thành công!');
          this.resetSearchMakh();
          this.setMakh('');
          this.setFullname('');
          this.setPhone('');
          this.fileUrl = '';
          console.log(this.fileUrl);
        })
        .catch((error) => console.log(error));
    }
  }

  ngOnInit(): void {
    
  }
}
