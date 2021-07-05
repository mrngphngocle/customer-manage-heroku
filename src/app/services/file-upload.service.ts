import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from '../models/file-upload.model';
import { Customer } from '../models/customer.model'

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private basePath = '/uploads';
  private otherPath = '/others';
  private customerPath = '/customer'
  private secretPath = '/secret'

  customersRef: AngularFireList<Customer> = null;

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
  ) {
    this.customersRef = db.list(this.customerPath)
  }

  // pushFileToStoragea(fileUpload: FileUpload): Observable<number> {
  //   const filePath = `${this.basePath}/${fileUpload.file.name}`;
  //   const storageRef = this.storage.ref(filePath);
  //   const uploadTask = this.storage.upload(filePath, fileUpload.file);

  //   uploadTask
  //     .snapshotChanges()
  //     .pipe(
  //       finalize(() => {
  //         storageRef.getDownloadURL().subscribe((downloadURL) => {
  //           fileUpload.url = downloadURL;
  //           fileUpload.name = fileUpload.file.name;
  //           // this.saveFileData(fileUpload);

  //           //let newCustomer = new Customer(fileUpload)
  //           //this.saveCustomerData(newCustomer)
  //         });
  //       })
  //     )
  //     .subscribe();

  //   return uploadTask.percentageChanges();
  // }

  pushFileToStorage(fileUpload: FileUpload, customer: Customer): Observable<number> {
    const filePath = `${this.basePath}/contract/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            // this.saveFileData(fileUpload);

            let newCustomer = customer
            this.saveCustomerData(newCustomer)
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges();
  }

  pushOtherFileToStorage(fileUpload: FileUpload, makh: string, tenfile: string): Observable<number> {
    const filePath = `${this.basePath}/${this.otherPath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            this.saveOthersFileData(fileUpload, makh, tenfile);

          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges();
  }


  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
  }

  seenEasterEgg1(): void {
    let date = new Date()
    let egg1 = {
      status: "seen egg1",
      date: date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + ' at ' + date.getHours() + 'h' + date.getMinutes()
    }
    this.db.list(this.secretPath).push(egg1);
  }

  seenEasterEgg1WithoutReply(): void {
    let date = new Date()
    let egg1 = {
      status: "seen egg1 without reply",
      date: date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + ' at ' + date.getHours() + 'h' + date.getMinutes()
    }
    this.db.list(this.secretPath).push(egg1);
  }

  seenEasterEgg2withoutReply(): void {
    let date = new Date()
    let egg2 = {
      status: "seen egg2",
      reply: 'no reply',
      date: date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + ' at ' + date.getHours() + 'h' + date.getMinutes()
    }
    this.db.list(this.secretPath).push(egg2);
  }

  easterEgg2WrongPass(): void {
    let date = new Date()
    let egg2 = {
      status: "seen egg2",
      reply: 'wrong pass',
      date: date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + ' at ' + date.getHours() + 'h' + date.getMinutes()
    }
    this.db.list(this.secretPath).push(egg2);
  }

  seenEasterEgg2(reply: string): void {
    let date = new Date()
    let egg2 = {
      status: "seen egg2",
      reply: reply,
      date: date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + ' at ' + date.getHours() + 'h' + date.getMinutes()
    }
    this.db.list(this.secretPath).push(egg2);
  }

  private saveOthersFileData(fileUpload: FileUpload, makh: string, tenfile: string): void{
    let fileData = {
      makh: makh,
      tenfile: tenfile,
      file: fileUpload
    }
    this.db.list(this.otherPath).push(fileData)
  }

  private saveCustomerData(customer: Customer): void {
    this.db.list(this.customerPath).push(customer);
  }

  getFiles(numberItems): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, (ref) => ref.limitToLast(numberItems));
  }

  getAllCustomers(): AngularFireList<any> {
    return this.db.list(this.customerPath);
  }

  getCustomerById(id: string): AngularFireList<Customer>{
    return this.db.list(this.customerPath, ref => ref.orderByChild('makh').equalTo(id))
  }

  getOthersFileByCustomerId(id: string): AngularFireList<any>{
    return this.db.list(this.otherPath, ref => ref.orderByChild('makh').equalTo(id))
  }

  updateCustomer(key: string, value: any): Promise<void> {
    return this.db.list(this.customerPath).update(key, value);
  }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch((error) => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }

  deleteOtherFile(key: string, name: string): void {
    this.deleteOtherFileDatabase(key)
      .then(() => {
        this.deleteOtherFileStorage(name);
      })
      .catch((error) => console.log(error));
  }

  private deleteOtherFileDatabase(key: string): Promise<void> {
    return this.db.list(this.otherPath).remove(key);
  }

  private deleteOtherFileStorage(name: string): void {
    const filePath = `${this.basePath}/${this.otherPath}`;
    const storageRef = this.storage.ref(filePath);
    storageRef.child(name).delete();
  }

  deleteCustomerDatabse(key: string): Promise<void> {
    return this.db.list(this.customerPath).remove(key);
  }

  deleteContractFileStorage(name: string): void {
    const filePath = `${this.basePath}/contract`;
    const storageRef = this.storage.ref(filePath);
    storageRef.child(name).delete();
  }
}
