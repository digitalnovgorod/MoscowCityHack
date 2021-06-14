#!/bin/bash

if [[ $# -eq 0 ]]
  then
    docker run -ti --rm yos-crawler:1.0 -h
    echo "Please, re-run the script but with arguments"
else
  echo "Running Docker container with arguments $1"
  echo "Please wait ... "
  nohup docker run -ti --rm yos-crawler:1.0 "$1" > runlogs.out
  echo "Done, command's output is logged in 'runlogs.out'"
fi
