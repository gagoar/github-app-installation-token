<p align="center">
    <a href="https://codecov.io/gh/gagoar/github-app-installation-token">
      <img src="https://codecov.io/gh/gagoar/github-app-installation-token/branch/main/graph/badge.svg?token=E9CdygqJc4"/>
    </a>
    <a href="https://github.com/gagoar/github-app-installation-token/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/github-app-installation-token.svg?style=flat-square" alt="MIT license" />
    </a>
  <h3 align="center">Github App Installation Token</h3>

  <p align="center">
      npm/cli and binary 📦 to generate a token from GitHub Apps. 
    <br />
    <a href="https://github.com/gagoar/github-app-installation-token#table-of-contents"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://github.com/gagoar/github-app-installation-token/issues">Report Bug</a>
    ·
    <a href="https://github.com/gagoar/github-app-installation-token/issues">Request Feature</a>
  </p>
</p>

## Table of Contents

- [Built With](#built-with)
- [Installation and use](#installation-and-use)

  - [NPX](#npx)
  - [NPM](#npm-global)
  - [YARN](#yarn-global)
  - [GitHub Workflow](#github-Workflow)
  - [Binary](#binary)
  - [Programmatically](#programmatically)

- [Contributing](#contributing)
- [License](#license)

### Getting Started

GitHub Apps are the most powerful entity in the GitHub universe today. These Apps allow you to change a PR, add checks to a commit, trigger workflows and even (with the right permissions) commit code! But The tricky thing is, You need to generate a token every time you you want to use them.

This npm package / command line tool / binary will do just that!

## Installation and Use

You can install and use this package in different ways:

### NPX

```bash
   npx github-app-installation-token \
      --appId <APP_ID> \
      --installationId <INSTALLATION_ID> \
      --privateKeyLocation <path/to/the/private.pem>
```

### NPM (global)

```bash
  npm -g install github-app-installation-token

  npm run github-app-installation-token \
      --appID <APP_ID> \
      --installationId <INSTALLATION_ID> \
      --privateKeyLocation <path/to/the/private.pem>
```

### YARN (global)

```bash
  yarn global add github-app-installation-token

  github-app-installation-token \
      --appId <APP_ID> \
      --installationId <INSTALLATION_ID> \
      --privateKeyLocation <path/to/the/private.pem>
```

### Programmatically

```typescript
import { getToken } from 'github-app-installation-token';

const { token } = await getToken({
  appId: '1234',
  installationId: '112345555', // https://developer.github.com/v3/apps/#list-installations-for-the-authenticated-app
  privateKey: '-----BEGIN RSA PRIVATE KEY----- ......-----END RSA PRIVATE KEY-----', // the private key you took from  the app. https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#generating-a-private-key
});
```

### Binary

If you don't want any dependencies, you can use the binary directly.

Head over to [releases](https://github.com/gagoar/github-app-installation-token/releases/latest) and pick the binary for LINUX, MACOSX and WINDOWS.

### Github Workflow

If you are looking for a solution for your GitHub workflows, take a look at [github-app-installation-token-action](https://github.com/jnwng/github-app-installation-token-action)

## Built With

- [esbuild](https://github.com/evanw/esbuild)
- [pkg](https://github.com/vercel/pkg)
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
