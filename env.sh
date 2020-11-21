#!/usr/bin/env bash

source .env

build() {
    echo 'Building'
    npm run buid:assets
    npm run build:prod
    npm run build:node
    npm run build:es
}

deploy() {
    echo 'Deploying assets to CDN'
    WIDGET_VERSION=$(<VERSION)
    echo "Asset version: $WIDGET_VERSION"
}

publish() {
    echo 'Publishing to npm'
    PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
    echo "npm version: $PACKAGE_VERSION"
    npm publish
}

$@
