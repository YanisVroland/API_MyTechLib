import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE_CONFIG } from '../../firebase.config';

@Injectable()
export class FirebaseService {
  private firebaseAdmin: admin.app.App;

  constructor() {
    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_CONFIG.projectId,
        clientEmail: 'VOTRE_CLIENT_EMAIL',
        privateKey: 'VOTRE_PRIVATE_KEY',
      }),
      databaseURL: `https://${FIREBASE_CONFIG.projectId}.firebaseio.com`,
    });
  }

  // Implémentez les méthodes nécessaires pour interagir avec Firebase (inscription, connexion, etc.)
}
