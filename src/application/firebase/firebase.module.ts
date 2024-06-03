import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { configService } from '@infra/config/config.service';

const firebasePrivateKeyBase64 =
  configService.getFirebaseConfig().firebasePrivateKeyBase64;
const firebasePrivateKey = Buffer.from(
  firebasePrivateKeyBase64,
  'base64',
).toString('utf-8');

const firebaseConfig = {
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  privateKey: firebasePrivateKey,
};

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(firebaseConfig.privateKey)),
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
