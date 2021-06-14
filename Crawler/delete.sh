#!/bin/bash


echo 'Deleting previous container'
docker container stop yos-crawler
docker container rm crawler

echo 'Deleting previous image'
docker image rmi yos-crawler:1.0 -f


echo "Remove all <none> images"
docker rmi $(docker images -a|grep "<none>"|awk '$1=="<none>" {print $3}')

echo "Pruning"
docker image prune -f
docker system prune -a
