import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { configService } from '@infra/config/config.service';

const firebaseConfig = configService.getFirebaseConfig();

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig.privateKey),
  storageBucket: firebaseConfig.storageBucket,
});

@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useValue: firebaseAdmin,
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}
