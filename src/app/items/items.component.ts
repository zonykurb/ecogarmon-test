import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore/firestore.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  public documentId = null;
  public items = [];
  public currentStatus = 1;
  public newItemForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    email1: new FormControl('', Validators.required),
    email2: new FormControl(''),
    email3: new FormControl(''),
    phone: new FormControl('', Validators.required)
  });

  constructor(private firestoreService: FirestoreService) {
    this.newItemForm.setValue({
        id: '',
        name: '',
        date: '',
        time: '',
        email1: '',
        email2: '',
        email3: '',
        phone: ''
    });
  }

  ngOnInit() {
    this.firestoreService.getItems().subscribe((itemsSnapshot) => {
      this.items = [];
      itemsSnapshot.forEach((itemData: any) => {
        this.items.push({
          id: itemData.payload.doc.id,
          data: itemData.payload.doc.data()
        });
      });
    });
  }

  public newItem(form, documentId = this.documentId) {
    console.log('Status: ' + this.currentStatus);
    if (this.currentStatus === 1) {
      let data = {
        name: form.name,
        date: form.date,
        time: form.time,
        email1: form.email1,
        email2: form.email2,
        email3: form.email3,
        phone: form.phone
      };
      this.firestoreService.createItem(data).then(() => {
        console.log('Success');
        this.newItemForm.setValue({
          id: '',
          name: '',
          date: '',
          time: '',
          email1: '',
          email2: '',
          email3: '',
          phone: ''
        });
      }, (error) => {
        console.log(error);
      });
    } else {
      let data = {
          name: form.name,
          date: form.date,
          time: form.time,
          email1: form.email1,
          email2: form.email2,
          email3: form.email3,
          phone: form.phone
      };
      this.firestoreService.updateItem(documentId, data).then(() => {
        this.currentStatus = 1;
        this.newItemForm.setValue({
          id: '',
          name: '',
          date: '',
          time: '',
          email1: '',
          email2: '',
          email3: '',
          phone: ''
        });
        console.log('Success');
      }, (error) => {
        console.log(error);
      });
    }
  }

  public editItem(documentId) {
    let editSubscribe = this.firestoreService.getItem(documentId).subscribe((item: any) => {
      this.currentStatus = 2;
      this.documentId = documentId;
      this.newItemForm.setValue({
         id: documentId,
         name: item.payload.data().name,
         date: item.payload.data().date,
         time: item.payload.data().time,
         email1: item.payload.data().email1,
         email2: item.payload.data().email2,
         email3: item.payload.data().email3,
         phone: item.payload.data().phone
      });
      editSubscribe.unsubscribe();
    });
  }

  public deleteItem(documentId) {
    if (window.confirm('Delete item?')) {
      this.firestoreService.deleteItem(documentId).then(() => {
        console.log('Deleted');
      }, (error) => {
        console.log(error);
      });
    }
  }

  public clearForm() {
    if (window.confirm('Clear form?')) {
      this.newItemForm.setValue({
        id: '',
        name: '',
        date: '',
        time: '',
        email1: '',
        email2: '',
        email3: '',
        phone: ''
      });
    }
  }
}
