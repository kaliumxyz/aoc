#!/bin/sh
total=0;
for line in $(cat $1); do
  total=$(($total + $line / 3 - 2))
done
echo $total;
