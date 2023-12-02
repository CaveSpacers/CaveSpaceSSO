#!/bin/bash
docker-compose -f docker-compose-local.yml down --remove-orphans -v &&
docker-compose -f docker-compose-local.yml build sso-postgres &&
docker-compose -f docker-compose-local.yml up sso-postgres