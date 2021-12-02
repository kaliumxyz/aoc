#!/bin/sh
gcc -m32 -nostdlib -static -Wl,--build-id=none -o jonesforth jonesforth.S
#gcc -m32 -nostdlib -static -Wl,-Ttext,0 -Wl,--build-id=none -o jonesforth jonesforth.S
