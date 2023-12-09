#!/bin/bash
docker-compose -f docker-compose-local.yml --profile tests build &&
docker-compose -f docker-compose-local.yml --profile tests up
test_status=$?
exit $test_status