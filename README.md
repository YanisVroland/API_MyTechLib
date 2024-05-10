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

---

## Installation et Utilisation

Pour utiliser cette API localement, suivez ces étapes :

1. Assurez-vous d'avoir installé Node.js.

> Suivez les instructions de la [documentation node](https://nodejs.org/en/download) pour l'instalation.

2. Clonez ou téléchargez ce dépôt sur votre machine locale.

```bash
git clone https://github.com/YanisVroland/API_MyTechLib.git
```

3. Installez les dépendances en exécutant la commande suivante dans le répertoire du projet :

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

- **Dossier __test__ :** Ce dossier contient les tests de l'API réalisés à l'aide de Jest. Les tests sont utilisés pour vérifier le bon fonctionnement des différentes fonctionnalités de l'API et garantir sa fiabilité.

- **Autres fichiers de configuration :** Le reste des fichiers sont des fichiers de configuration utilisés par l'API, tels que les fichiers de configuration de la base de données, les variables d'environnement, etc. Ces fichiers sont essentiels pour paramétrer et personnaliser le fonctionnement de l'API.
