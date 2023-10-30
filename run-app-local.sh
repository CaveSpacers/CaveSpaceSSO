#!/bin/bash
docker-compose -f docker-compose-local.yml down --remove-orphans -v &&
docker-compose -f docker-compose-local.yml --profile infra build &&
docker-compose -f docker-compose-local.yml --profile infra up -d