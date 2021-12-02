." 

START 

"
\ the index for loops
0 VALUE index
0 VALUE flag
0 VALUE inner
0 VALUE start
0 VALUE offset
\ amount of times to run the loop
10000 VALUE times

3 TO index
times 4 * ALLOT TO start
\ 2 is the first prime
2 start !
: main
  BEGIN
    0 TO flag
    0 TO inner
\    index . 
    BEGIN
      start inner 4 * + @
\      DUP .
      index SWAP MOD 0= IF
        1 TO flag
\        index .
        offset TO inner
      THEN
      inner 1+ TO inner
      offset inner - 0<=
    UNTIL
    flag NOT IF
      offset 1+ TO offset
      index start offset 4 * + !
    THEN
    index 1+ TO index
    index times - 0=
  UNTIL

  0 TO inner
  BEGIN
    start inner 4 * + @ .
    ." 
"
    inner 1+ TO inner
    offset inner - 0=
  UNTIL
;
main
