<p align="center">
  <h3 align="center">Github App Installation Token</h3>

  <p align="center">
      npm/script and binary 📦 to get generate a token from a GitHub App. 
    <br />
    <a href="https://github.com/gagoar/ts-node-template#table-of-contents"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://github.com/gagoar/ts-node-template/issues">Report Bug</a>
    ·
    <a href="https://github.com/gagoar/ts-node-template/issues">Request Feature</a>
  </p>
</p>

## Table of Contents

- [Built With](#built-with)
- [Installation](#installation)

  - [NPX](#npx)
  - [NPM](#npm-global)
  - [YARN](#yarn-global)
  - [Binary](#binary)

- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

<!-- CONTRIBUTING -->

### Installation

you can install and use this package in different ways:

#### NPX

it will allow you to use it right away, without having a project tight to it.

```bash
  npx github-app-installation-token --appID <APP_ID> --installationId <INSTALLATION_ID> --privateKeyLocation <path/to/the/private.key>
```

#### NPM (global)

_Installing it globally_

```bash
  npm -g install github-app-installation-token

  npm run github-app-installation-token --appID <APP_ID> --installationId <INSTALLATION_ID> --privateKeyLocation <path/to/the/private.key>
```

#### YARN (global)

_Installing it globally_

```bash
  yarn global install github-app-installation-token

  yarn github-app-installation-token --appID <APP_ID> --installationId <INSTALLATION_ID> --privateKeyLocation <path/to/the/private.key>
```

#### Binary

If you don't want any dependencies, you can install the binary.

_commit soon_

### Getting Started

GitHub Apps are the most powerful entity in the GitHub universe today. These Apps allow you to change a PR, add checks to a commit, trigger workflows and even (with the right permissions) commit code! But The tricky thing is, You need to generate a token every time you you want to use them.

This npm package / command line tool / binary will do just that for you. Avoiding the tedious need of repeating your self.

#### You can use it programmatically:

```typescript
const { getToken } = 'github-app-installation-token';

const { token } = await getToken({
  appId: '1234',
  installationId: '112345555', // https://developer.github.com/v3/apps/#list-installations-for-the-authenticated-app
  privateKey: PRIVATE_KEY, // the private key you took from  the app. https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#generating-a-private-key
});
```

#### You can use it in the command line:

### Built With

- [ncc](https://github.com/vercel/ncc/)
- [jest](https://github.com/facebook/jest)
- [ora](https://github.com/sindresorhus/ora)
- [commander](https://github.com/tj/commander.js/)
- [octokit/rest](https://github.com/octokit/rest.js/)
- [octokit/auth-app](https://github.com/octokit/auth-app.js/)

## Contributing

Contributions are what makes the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.
