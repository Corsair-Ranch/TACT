#!/bin/bash

echo "=========================================================================="
echo "Clean up PM2 apps"
echo "=========================================================================="
npx pm2 stop all
npx pm2 delete all

arg1="${1:-default}"

echo "=========================================================================="
echo "Executing npm install and sequelize migrations for frontend and API"
echo "Run mode: $arg1"
echo "'default' -> no migrations or seed"
echo "'fresh' -> run full migrations and seed"
echo "'build' -> run migrations, no seed"
echo "'seed' -> run seed, no migrations"
echo "=========================================================================="

cd Client
npm install

cd ..
cd Server
npm install
if [ "$arg1" == "fresh"  ]; then
  npm run fresh
elif ["$arg1" == "build"]
  npm run build
elif ["$arg1" == "seed"]
  npm run seed
else
  npm run start
fi


cd ..

echo "=========================================================================="
echo "Starting API"
echo "=========================================================================="
cd Server
npx pm2 start npm --name "tact-api" -- start --watch=true
cd ..

echo "=========================================================================="
echo "Starting Frontend"
echo "=========================================================================="
cd Client
npx pm2 start npm --name "tact-client" -- start --watch=true
cd ..

npx pm2 ps
npx pm2 monit
