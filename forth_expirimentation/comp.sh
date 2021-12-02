#!/bin/sh
gcc -m32 -nostdlib -static -Wl,--build-id=none -o oct oct.s
