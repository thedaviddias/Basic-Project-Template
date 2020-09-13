<p align="center">
  <!-- img -->
</p>
<h1 align="center">
  --repo--
</h1>

[![Actions Status](https://github.com/--owner--/--repo--/workflows/.github/workflows/ci.yml/badge.svg)](https://github.com/--owner--/--repo--/actions)
[![Code coverage](https://img.shields.io/codecov/c/github/--owner--/--repo--/master.svg)](https://codecov.io/gh/--owner--/--repo--)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/--owner--/--repo--)

A starter project for my projects

---

## Usage

```bash
git clone https://github.com/thedaviddias/basic-project-template.git YOURFOLDERNAME
cd YOURFOLDERNAME

# Run yarn install and answer the questions prompted. That's all!
yarn install
```
## Features
* Zero-setup. After running npm install or yarn install things will setup for you 😉
* Tests, coverage and interactive watch mode using [Jest](https://jestjs.io/)
* [Prettier](https://prettier.io/) for code formatting and consistency
* Automatic releases and changelog, using [Semantic release](https://semantic-release.gitbook.io/semantic-release/) (using Github actions)

## Requirements

* You will need to add to your Github Secrets, a [NPM_TOKEN](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) for the Semantic Release Authentication Environment Variables.
* Add your project to Codecov
* If your repo is **private** only, you will need to add to your Github Secrets, a [CODECOV_TOKEN](https://docs.codecov.io/docs/quick-start)

## NPM scripts
* npm run lint: Lint and fix your code
* npm run test:watch: Run test suite in interactive watch mode
* npm run test:prod: Run linting and generate coverage
* npm run commit: Commit using conventional commit style (husky will tell you to use it if you haven't 😉)

### Useful commands

Ensure your `package.json` is organized correctly

> npx sort-package-json

## Useful bots

These following bots can be installed to help automating some tasks:

* [@all-contributors bot](https://github.com/all-contributors/all-contributors-bot): To automate acknowledging contributors to the project
* [Semantic Pull Requests](https://github.com/zeke/semantic-pull-requests): To ensure that the PR is following semantic commit convention. After installing this bot, you can go to your Settings > Branches, "Branch protection rules" section and
* [Probot: Stale](https://github.com/probot/stale) - Closes abandoned Issues and Pull Requests after a period of inactivity

## Github actions

* [Semantic Release Action](https://github.com/cycjimmy/semantic-release-action) - Github action for [Semantic Release](https://github.com/semantic-release/semantic-release)
* [Codecov Github Action](https://github.com/codecov/codecov-action) - To easily upload coverage reports to Codecov

## Contributors
