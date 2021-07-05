import { FileUpload } from '../models/file-upload.model';
export class Customer {
  key: string;
  makh: string;
  name: string;
  phone: string;
  fileHopDong: FileUpload;

  constructor(makh: string, name: string, phone: string, fileHopDong: FileUpload) {
    this.fileHopDong = fileHopDong;
    this.makh = makh;
    this.name = name;
    this.phone = phone;
  }
}
