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

cd ..

echo "=========================================================================="
echo "Starting API"
echo "=========================================================================="
cd Server
if [ "$arg1" == "fresh" ]; then
  npx pm2 start npm --name "tact-api" -- run fresh --watch=true
elif [ "$arg1" == "build" ]; then
  npx pm2 start npm --name "tact-api" -- run build --watch=true
elif [ "$arg1" == "seed" ]; then
  npx pm2 start npm --name "tact-api" -- run seed --watch=true
else
  npx pm2 start npm --name "tact-api" -- start --watch=true
fi

cd ..

echo "=========================================================================="
echo "Starting Frontend"
echo "=========================================================================="
cd Client
npx pm2 start npm --name "tact-client" -- start --watch=true
cd ..

npx pm2 monit
