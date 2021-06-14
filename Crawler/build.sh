#!/bin/bash


echo "Building Digital Novgorod YOS Crawler"
echo "Please wait ..."
nohup docker build -t yoscrawler:1.0 . > buildlogs.out
echo "Done"
