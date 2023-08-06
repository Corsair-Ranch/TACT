# TACT: Travel Accommodations and Coordination Technology

This project is created for Hack the Ranch May 2023

Updated July 2023

## Team Members

- Michael Borland
- Dayan Sauerbronn
- Roman Morawski
- Brett Mather

## Problem Statement

Build an automated tool that calculates PACAF O&M dollars per head count for the exercise.

### Tool should include

- Summary Report
- Visual Component (Chart)
- Implement other features deemed useful

## Objectives

- Reduce time needed to manually calculate manpower costs to support PACAF Exercises
- Provide, with higher accuracy, dollar amounts for PACAF planning teams
- Consolidate data available for reporting analytics, including manpower requirements, and potential areas for economy of scale

## How to use

- Create a .env file under the Server folder to include the secrets for the flight api calls
- Make sure the ports 8080, 3000, and 5432 are unassigned
- Run the following commands

```bash
docker-compose build
```

```bash
docker-compose up
```

- The client will be running on [localhost](http://localhost:3000 "Local port 3000")

## Using PM2 for Development

- Because this application is designed to run as a group of containers, development can be painful sometimes due to the nature of how docker images work. PM2 alleviates this by automating running both client and server locally while keeping the database in a container.

- To start without changing any files, simply follow the "How to use" steps from above to start, then the following depending on if you are using Docker Desktop or just the Docker CLI

### If using Docker Desktop

- Navigate to the GUI and click the stop button for only the client and server container.

- Make sure you are in the TACT directory then run

```bash
npm install pm2 -g
```

> **🗒️ Note :**
> You may also just run `npm i` if you don't want to install pm2 globally

- If you get permission errors, you may need to use sudo

- Finally run

```bash
./start.sh
```

- Once the script is finished, there should be a process list in the terminal showing both tact-api and tact-client

> **⚠️ Warning :**
> If you have a db_data_volume folder in the top directory you may need to remove it if you run into issues with the database not seeding properly.

### If using Docker CLI, run

```bash
docker-compose down
```

```bash
docker-compose up db
```

- Make sure you are in the TACT directory then run

```bash
npm install pm2 -g
```

> **🗒️ Note :**
> You may also just run `npm i` if you don't want to install pm2 globally

- If you get permission errors, you may need to use sudo

- Finally run

```bash
./start.sh
```

- Once the script is finished, there should be a process list in the terminal showing both tact-api and tact-client

> **⚠️ Warning :**
> If you have a db_data_volume folder in the top directory you may need to remove it if you run into issues with the database not seeding properly.

### Start Script Arguments

Arguments you can pass to the start script at the root of the project to have the sever build in different ways.

"'default' -> no migrations or seed"

"'fresh' -> run full migrations and seed"

"'build' -> run migrations, no seed"

"'seed' -> run seed, no migrations"
