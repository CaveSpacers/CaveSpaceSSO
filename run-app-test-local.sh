#!/bin/bash
docker-compose -f docker-compose-test.yml down &&
docker-compose -f docker-compose-test.yml build &&
docker-compose -f docker-compose-test.yml up &&
npx playwright test ./Integration-tests/test