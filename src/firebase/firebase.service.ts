import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { auth, firestore, storage, ServiceAccount } from 'firebase-admin';
import Firestore = firestore.Firestore;
import Storage = storage.Storage;
import Auth = auth.Auth;
import serviceAccount from './mytecklib-firebase-adminsdk-ez50h-bed62bb0ee.json';
import { FIREBASE_CONFIG } from '../../firebase.config';

@Injectable()
export class FirebaseService {
  private firebaseClient;
  private db: Firestore;
  private auth: Auth;
  private storage: Storage;
  private readonly adminConfig: ServiceAccount;

  constructor() {
    this.adminConfig = {
      projectId: serviceAccount.project_id,
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
    };
    this.firebaseClient = admin.initializeApp({
      credential: admin.credential.cert(this.adminConfig),
    });
    this.db = this.firebaseClient.firestore();
    this.auth = this.firebaseClient.auth();
    this.storage = this.firebaseClient.storage();
  }

  async uploadFile(file: any, folder: string): Promise<unknown> {
    const bucket = this.storage.bucket(FIREBASE_CONFIG.storageBucket);
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const fileUpload = bucket.file(`${folder}/${fileName}`);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });
      stream.on('finish', async () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
        resolve(publicUrl);
      });
      stream.end(file.buffer);
    });
  }
}
