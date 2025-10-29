# Intl

This repository contains everything related to the internationalization of our systems.

## Installation
**Composer**: `composer require upinion/intl`

**NPM**: `npm install --save @upinion/intl`

## Releasing new versions
- Always release both artefacts together: tag a new PHP package on GitHub (`upinion/intl` repo) and publish the Node package.
- **PHP**: create a GitHub release pointing to the tag that matches the updated `composer.json` version (Packagist will pick it up automatically).
- **Node**: run `npm publish` from the repo root once `package.json` is updated.
