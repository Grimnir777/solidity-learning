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