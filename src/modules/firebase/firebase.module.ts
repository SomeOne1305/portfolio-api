import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import firebaseConfig from 'src/configs/firebase.config';
import { FirebaseService } from './firebase.service';

const FirebaseProvider = {
  provide: 'FIREBASE_APP',
  useFactory: () => {
    const firebaseConf = firebaseConfig() as admin.ServiceAccount;
    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConf),
      storageBucket: `${firebaseConf.projectId}.appspot.com`,
    });
  },
};

@Module({
  controllers: [],
  providers: [FirebaseService, FirebaseProvider],
  exports: [FirebaseService],
})
export class FirebaseModule {}
