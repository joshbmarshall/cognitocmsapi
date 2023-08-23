#!/bin/bash

cd "$(dirname "$0")"
git pull
cd ..
git pull

export NODE_OPTIONS=--max_old_space_size=8198

pnpm i && pnpm p
