# Projet NestJs - API de l'application de répertoire de projets MyTechLib

*VROLAND Yanis*
*M2 Cyber*

## Introduction

Ce projet est une API développée avec NestJS pour fournir les services nécessaires à l'application mobile MyTechLib. L'API est conçue pour gérer les données des utilisateurs, des entreprises et des projets, et fournir des fonctionnalités telles que l'authentification sécurisée et l'accès aux informations de projet.

## À savoir

Voici quelques informations importantes à connaître sur cette API :

- Ce projet est réalisé dans le cadre d'un projet de fin d'étude de Master 2 en informatique à l'université catholique de Lille.

- Ce projet accompagne l'application mobile MyTechLib et est utilisé pour fournir les services backend, disponible sur le lien GitHub suivant : [Mobile_MyTechLib](https://github.com/YanisVroland/Mobile_MyTechLib.git)

- Le projet utilise une base de données Firebase et Supabase, qui sont hébergées pour assurer la disponibilité et la performance des données. Ces bases de données sont utilisées pour stocker et gérer les informations des utilisateurs, des entreprises et des projets de l'application.

- Afin de tester l'api en local, vous avez à disposition dans le dossier "annexes" un fichier "MyTechLib.postman_collection.json" qui contient les requêtes postman pour tester l'api ainsi qu'un fichier "MyTechLib.postman_environment.json" qui contient les variables d'environnement pour les requêtes postman.
---

## Installation et Utilisation

Pour utiliser cette API localement, suivez ces étapes :

1. Assurez-vous d'avoir installé Node.js.

> Suivez les instructions de la [documentation node](https://nodejs.org/en/download) pour l'instalation.

> [!NOTE]
> Version recommandée au projet : node v18.16.1

2. Clonez ou téléchargez ce dépôt sur votre machine locale.

```bash
git clone https://github.com/YanisVroland/API_MyTechLib.git
```
3. **Important** : Configuration de la Base de Données (pour des raisons de sécurité, GitHub refuse d'ajouter ce fichier, c'est pourquoi il faut le créer manuellement)
> Dans le répertoire **"/src/firebase/"**, créez le fichier **mytechlib-firebase-adminsdk-ez50h-bed62bb0ee.json**.

```
{
  "type": "service_account",
  "project_id": "mytecklib",
  "private_key_id": "bed62bb0ee836153a98e0797b77b7ec83bd496fc",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCiuZ0QRugp0Rfs\nLASDwtVo31OAT1W0ze5DkNwhuK47QdSf5yRtRh1xHvrs5PxhHPVztce67h0IjqX8\nK/FTYslx+VRj1aONjOYaaQyA5TIcdbszf9mXevErRSlEp6OPOdX2cqqnkkOnE8LP\nxCvDGfYiOB2cb2VnUu/Dw2TGVBqTFHu9GsBtvzx6XIQlsqocgGcbezvzN7FsIYX0\ni8L23Ln6dZYpT8GBv+Oh6byazSX9BAfJPQJcw1UAXLG81ZBqQiHx0ZPNJ7gO3Kli\nnQqbEly8bDKfgttiEhkaidhaG5bFq+lJpUDluOtYN3Yccc6J7eL7EER6I5q1rHRD\nMBvVJbY9AgMBAAECggEAJM74vMxVStQ95ZHlaYqibIkL4dvQRshIS6dSbBxS6RuQ\nhaUq4772/PYli32Wqz76NLTbW6juD1f5KuwjuBmB+NKN6NFUIDpNeI7noaZ2qeJl\nuJYEedP5BrErzxhekpDiGc/BU4tt2zbIm+fDgGv4dbAc3pyCIxerHayuuIAgzMD5\n7GubsKbaV9X1lnMeVtkPWGdHJlfAe6MffM3sAp/jLgLsWUTgXJdebO2b12d0Ysjb\nPhkSrt5Le0XrXPNTulrQX7c+KfN0CSnqSu/rBo9uGMCjt/97CdWXAn5YBz9cFMKZ\nONKPVY/SHL+aUuJUpmASdGi0NJTFyMPKsC8RVZwXEQKBgQDllHKgL0hfLr8JUud/\nU9BSlH3AZPyJK1nw2M36A8eqbOxCvIK3kqbwi8ZHRnN8+lBYzBQAyOi1itu6peJd\n2u5px8sCPQ1MZPLuZsgiT52n+c/9g67gzfS1V4RVLr68F6kVNh67iTuYyyr/23Pd\n4Z82BLtaMH+he/z3j/J/eshhdQKBgQC1c5XLFmZxJZWQOsPU4Z3voiJrY9aNgFx2\nZbAB+okVfrxA8+qDpPewkic1qNdGw8VBBcWV2QP76hzJfDgUTUyk1we8f4pdfiM+\nnfSPxF9F3bNh75c+f+ZJteQmG1JvfaNm3syacbxrWP9AB8T4UjpEVw9EvHpS4A0K\niYGj+VvgqQKBgGYFAKcEO/HoMQZwq+TeFu4LhJIxjjNaa15myal3coveWWMSqDfx\nWHP+eP8FZJ6+EWRUU/NBVIAQE7KuspgoiNfC7Aiznqw7E+UzEW6F2LZjgbTThqvp\nefv3xxufaSzmisGdSizmP/CXICWQnL2V3I1BrwvWD3FwSqqscgOKSW9dAoGBALNl\nqtTWucPmT+AAabugsUDKQVOBqw/NuB0K3qCmLkCFQ+TIA7XSNV1qsr93xhfd2Lk3\n1qkXnbvENF/0o5FW948GVkzEoG1dF8WB79jwYu21ivQqKJOPaoS4A/C1FKTMR/Ce\nGRYdmxdbL0oEJHcK/TayCJOB8ULc56fiWb1f/bm5AoGBAInVRnmCcNjNfK27yiaT\nO/ffUHeE3RmVBJuismUdkMzeBSltmlT2b6EtRxVO5Dy4xJtSFhWY2q0Hy5soPist\nx4hIXAEH971fnEo+Q5nHB5stZh2/4ozYaNATVTSrvdQUYk7G8w9IQIlqPBptUNyy\nTBm4ePhPrihPUdr+xy/EH/pi\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-ez50h@mytecklib.iam.gserviceaccount.com",
  "client_id": "113605108375989825477",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ez50h%40mytecklib.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

4. Installez les dépendances en exécutant la commande suivante dans le répertoire du projet :

```bash
npm install
```

4. Démarrez le serveur en exécutant la commande suivante :

```bash
npm run start:dev
```

L'API sera alors accessible à l'adresse suivante : `http://localhost:3000`

---

## Structure du Projet

Le projet est organisé de manière à faciliter la gestion des différentes parties de l'API. Voici un aperçu de la structure des dossiers :

- **dossier src :** Ce dossier contient tout le code de l'API. Il est composé de plusieurs modules qui représentent chaque objet métier du projet, tels que company, project, user, etc. Chaque module contient trois fichiers principaux :

  - **Controller :** Ce fichier contient les contrôleurs qui gèrent les requêtes HTTP entrantes et renvoient les réponses appropriées.

  - **Service :** Ce fichier contient les services qui implémentent la logique métier de l'API. Ils sont responsables de la manipulation des données et de l'interaction avec la base de données.

  - **Module :** Ce fichier définit le module et ses dépendances. Il configure les contrôleurs, les services et les routes associées au module.

- **Dossier \_\_test\_\_ :** Ce dossier contient les tests de l'API réalisés à l'aide de Jest. Les tests sont utilisés pour vérifier le bon fonctionnement des différentes fonctionnalités de l'API et garantir sa fiabilité.

- **Autres fichiers de configuration :** Le reste des fichiers sont des fichiers de configuration utilisés par l'API, tels que les fichiers de configuration de la base de données, les variables d'environnement, etc. Ces fichiers sont essentiels pour paramétrer et personnaliser le fonctionnement de l'API.
