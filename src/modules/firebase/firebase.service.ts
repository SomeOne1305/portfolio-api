import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Storage } from 'firebase-admin/lib/storage/storage';
@Injectable()
export class FirebaseService {
  private storage: Storage;
  constructor(@Inject('FIREBASE_APP') private firebaseApp: admin.app.App) {
    this.storage = this.firebaseApp.storage();
  }
  getStorage() {
    return this.storage;
  }
}
