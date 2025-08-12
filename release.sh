#!/bin/bash

cd "$(dirname "$0")"
cd ..

pnpm build || exit
pnpm golive
exit

# Disabled release uploads
export SENTRY_AUTH_TOKEN=$2
export SENTRY_ORG=josh-marshall-pty-ltd
export SENTRY_PROJECT=$1
export SENTRY_URL=https://glitchtip.logger.jm1.au

pnpm sentry-cli --url $SENTRY_URL login --auth-token $SENTRY_AUTH_TOKEN

VCMS=`cd cognitocmsapi; git rev-parse --short HEAD`
VSITE=`git rev-parse --short HEAD`
VERSION="${SENTRY_PROJECT}-${VSITE}-${VCMS}"

echo "VITE_RELEASE=\"${VERSION}\"" > .env
pnpm sentry-cli releases new "$VERSION"
pnpm build || exit
pnpm sentry-cli releases files "$VERSION" upload-sourcemaps dist
pnpm sentry-cli releases finalize "$VERSION"
pnpm golive
# Note npm_config_deploy_path is defined in .npmrc

