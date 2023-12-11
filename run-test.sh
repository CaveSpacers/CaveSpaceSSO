#!/bin/bash
docker-compose -f docker-compose-local.yml --profile tests build &&
docker-compose -f docker-compose-local.yml --profile tests up --exit-code-from=sso-integration-tests
exit_code=$?

echo $exit_code

exit $exit_code
#test_status=$?
#exit $test_status
#      if [ $test_status -ne 0 ]; then
#          echo "Tests failed. Exiting with status $test_status."
#          exit $test_status
#      fi