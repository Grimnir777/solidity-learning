# Solidity learning

Basé sur le cours udemy ["Ethereum and Solidity : The Complete Developer's Guide"](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/).

## Premier exercice : inbox

Initialisation :

- Copier coller `.env.sample` vers `.env`
- Créer un compte metamask et fournir la suite de mot dans le fichier `.env`
- Créer un compte infura et fournir l'url complete (avec la clé API) dans le fichier `.env`

Commandes :

- Installation :
```shell
npm install
```

- Test :
```shell
npm run test
```

- Déploiement :
```shell
node deploy.js
```

- Interagir avec le contrat déployé [sur remix](https://remix.ethereum.org/)
  - Se connecter avec metamask `Injected provider metamask`
  - La fonction `message` est gratuite à appeler
  - La fonction `setMessage` coûte des ethers et une popup metamask se lance pour valider la transaction
  - La transaction peut être suivie sur etherscan
  - Il est possible d'appeler de nouveau `message` pour vérifier la nouvelle valeur


## Deuxième exercice : lottery

**Description :**  

Un manager déploie le contrat, ensuite des joueurs peuvent rejoindre la pool.
La manager peut décider à n'importe quel moment de sélectionner le gagnant.
Un joueur est choisi pseudo aléatoirement, la balance totale de la pool est envoyée à ce joueur.
La pool est réinitialisée et une nouvelle pool peut commencer.


Initialisation :
- pareil que l'initialisation du premier exercice

Commandes :

- Installation :
```shell
npm install
```

- Test :
```shell
npm run test
```

- Déploiement :
```shell
node deploy.js
```

- Interagir avec le contrat déployé [sur remix](https://remix.ethereum.org/)
  - Se connecter avec metamask `Injected provider metamask`
  - La fonction `enter` demande à minima d'envoyer > 0.01 ether et permet à un joueur de rejoindre la pool
  - La fonction `getPlayers` est gratuite à appeler et renvoie la liste des joueurs
  - La fonction `pickWinner` ne peut être appelée que par le manager et choisi un joueur gagnant