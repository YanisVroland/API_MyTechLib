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
    // Initialize Firebase Admin SDK with service account credentials
    this.adminConfig = {
      projectId: serviceAccount.project_id,
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
    };
    this.firebaseClient = admin.initializeApp({
      credential: admin.credential.cert(this.adminConfig),
    });
    // Initialize Firebase services: Firestore, Auth, and Cloud Storage
    this.db = this.firebaseClient.firestore(); // Firestore database
    this.auth = this.firebaseClient.auth(); // Firebase Auth
    this.storage = this.firebaseClient.storage(); // Cloud Storage
  }

  /**
   * Uploads a file to Cloud Storage.
   * @param file The file to be uploaded.
   * @param folder The folder in Cloud Storage where the file will be stored.
   * @returns A promise that resolves with the public URL of the uploaded file.
   */
  async uploadFile(file: any, folder: string): Promise<unknown> {
    // Get the Cloud Storage bucket
    const bucket = this.storage.bucket(FIREBASE_CONFIG.storageBucket);
    // Create a reference to the file in the specified folder
    const fileUpload = bucket.file(`${folder}/${file.originalname}`);
    // Create a write stream to upload the file
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Return a promise that resolves when the upload is complete
    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error); // Reject the promise if an error occurs during the upload
      });
      stream.on('finish', async () => {
        // Once the upload is complete, construct the public URL for the uploaded file
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
        resolve(publicUrl); // Resolve the promise with the public URL
      });
      // End the stream by writing the file buffer
      stream.end(file.buffer);
    });
  }
}
