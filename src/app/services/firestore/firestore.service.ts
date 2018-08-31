import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  public createItem(data: any) {
    return this.firestore.collection('items').add(data);
  }

  public getItem(documentId: string) {
    return this.firestore.collection('items').doc(documentId).snapshotChanges();
  }

  public getItems() {
    return this.firestore.collection('items').snapshotChanges();
  }

  public updateItem(documentId: string, data: any) {
    return this.firestore.collection('items').doc(documentId).set(data);
  }

  public deleteItem(documentId: string) {
    return this.firestore.collection('items').doc(documentId).delete();
  }
}
