#!/bin/sh
while true; do
  cat jonesforth.f $1 - | ./jonesforth
done
