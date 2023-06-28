#!/bin/sh

cd "$(dirname "$0")"

cp public/* ../public/
cp ../src/initialData.json ../public/
