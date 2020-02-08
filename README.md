# Readme

Slackbot for Ramme logging.

For the uninitiated:

This is an event-sourced bot to log and save training activities for an internal competition among a group of friends. It is written to display the capabilities of event sourcing.

Tags:

### Dev env

Prereqs:

  + Docker
  + Node

First time:

``` sh
cd infra
docker-compose up -d
./create_db.sh
cd ..
yarn
yarn dev
```

