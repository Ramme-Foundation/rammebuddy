# Readme

Slackbot for Ramme logging.

For the uninitiated:

This is an event-sourced bot to log and save training activities for an internal competition among a group of friends. It is written to display the capabilities of event sourcing.

Tags:

### Dev env

Prereqs:

- nodejs
- docker
- docker-compose

First time:

Download yarn if not available.

```sh
npm i -g yarn
```

Start the developer environment by running

```sh
docker-compose up -d
yarn
yarn dev
```

### Deployment

Compile and dockerize a production-grade container

```sh
docker build -t rammebuddy .
```

### Add a dump into docker postgres

```
docker exec -i postgres-rammebuddy pg_restore --verbose --clean --no-acl --no-owner -h localhost -U postgres -d rammebuddy < filenamehere
```
