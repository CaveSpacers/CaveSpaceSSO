#!/bin/bash
docker-compose -f docker-compose-local.yml --profile tests build &&
docker-compose -f docker-compose-local.yml --profile tests up
    test_status=$?
        if [ $test_status -ne 0 ]; then
            echo "Tests failed. Exiting with status $test_status."
            exit $test_status
        fi