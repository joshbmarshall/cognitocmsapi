#!/bin/bash

# Call this file regularly from cron

cd "$(dirname "$0")"

[ -e ../.rebuild ] || exit

rm ../.rebuild
git pull
cd ../
git pull
./cognitocmsapi/publish.sh
