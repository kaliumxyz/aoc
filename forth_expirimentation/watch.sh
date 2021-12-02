#!/bin/sh
while true; do
  sleep 0.01
  cat std.fs $1 | ./jonesforth
  inotifywait $1 -e MOVE_SELF &> /dev/null
done
