      ( helpers )
      0    VALUE debug
      1024 VALUE kb
      0 VALUE charstr
      0 VALUE local
      0 VALUE local0
      0 VALUE local1
      0 VALUE local2
      0 VALUE addr
      0 VALUE addr2
      0 VALUE int
      0 VALUE index
    ( VARIABLE varCount
      0 varCount !
      : varAdd ( local variable ( str -- addr ))
        varCount @ 1+ varCount !
      ;
      : varDel ( local variable ( addr -- ))
        varCount @ 1- varCount !
      ; )
      : debugprint
      debug 0> IF
            TELL CR
            ELSE
            DROP DROP
            THEN
      ;
      : input
      debug 0> IF
            ." input: "
            .S CR
            THEN
      ;
      : output
      debug 0> IF
            ." output: "
            .S CR
            THEN
      ;
      : ldec
      2DUP
      +
      TO charstr
      DUP
      BEGIN
        DUP
        charstr SWAP -
        DUP
        C@ 76 - 0= IF
          35 SWAP C!
        ELSE
          DROP
        THEN
        1-
      DUP 0= UNTIL
      DROP
      ;

      : findChar ( find the first occurance char. u2 is char location (
c addr u -- u2 ))
      TO local0
      0 TO local
      2DUP
      +
      TO charstr
      DUP
      BEGIN
        DUP
        charstr SWAP -
        debug 0> IF
          DUP
          C@
          U. CR
        THEN
        C@ local0 - 0= IF
          2DUP -
          TO local
          -1 TO local0
        THEN
        1-
      DUP 0< UNTIL
      DROP
      local
      0 TO local
      0 TO local0
      ;

      : countChar ( find the amount occurance char. u2 is char amount (
c addr u -- u2 ))
      TO local0
      0 TO local
      2DUP
      +
      TO charstr
      DUP
      BEGIN
        DUP
        charstr SWAP -
        debug 0> IF
          DUP
          C@
          U. CR
        THEN
        C@ local0 - 0= IF
          local 1+ TO local
        THEN
        1-
      DUP 0< UNTIL
      DROP
      local
      0 TO local
      0 TO local0
      ;

      ( start code )
      S" ./input/input" R/O
      OPEN-FILE
      DROP
      VALUE fd
      kb 16 * VALUE size ( just in case lets use 16 kb for this. )
      size MORECORE size - VALUE str ( we have size after the end of our program to work with )
      str size fd
      READ-FILE
      S" the map:"
      debugprint
      DROP str SWAP
      ( 2DUP )
     ( TELL CR )
      ldec
     ( 2DUP )
      ( TELL CR )
      10 findChar VALUE width
      DUP width / VALUE length
      size MORECORE size - VALUE nstr

      : checkChair
      \ DUP addr2 + C@
      \ local index .S CR DROP DROP DROP
          addr2 + C@ 35 - 0= IF
            ( ." C" CR )
            local 1+ TO local
          THEN
      ;

      : friends ( addr int addr2 -- )
      TO addr
      TO int
      TO addr2
      int TO index
      BEGIN
      index 0>=
      WHILE
      \ addr2 index + C@ 35 - 0= IF ( only if the chair is occupied to
      \ begin with )
          0 TO local
          index 2 + width 1+ /MOD DROP 0= IF 
          ELSE
            index width - 0> IF 
              index width - checkChair ( above right )
            THEN
            index 1+ checkChair ( right )
            index width + 1+ 1+ checkChair ( below right )
          THEN
          index width 1+ /MOD DROP 0= IF 
          ELSE
            index width - 0> IF 
              index width - 1- 1- checkChair ( above left )
            THEN
            index 1- checkChair ( left )
            index width + checkChair ( below left )
          THEN
          index width - 1- checkChair ( above )
          index width + 1+ checkChair ( below )
          local 3 - 0> IF
            \ 48 local + addr index + C!
             76 addr index + C!
           ELSE
            local 0= IF
             35 addr index + C!
            THEN
          THEN
     \     THEN
        index 1- TO index
      REPEAT
      int TO index
      BEGIN
      index 0>=
      WHILE
      addr2 index + C@ 35 - 0= IF ( only if the chair is occupied to
begin with)
        addr index + C@ 46 - 0> IF
          addr index + C@ addr2 index + C!
        THEN
      ELSE
        addr2 index + C@ 76 - 0= IF
          addr index + C@ 46 - 0< IF
            addr index + C@ addr2 index + C!
          THEN
        THEN
      THEN
        index 1- TO index
      REPEAT
      ;

      2DUP
      nstr friends
      2DUP
      CR TELL

      2DUP
      nstr friends
      2DUP
      CR TELL

      2DUP
      nstr friends
      2DUP
      CR TELL

      2DUP
      nstr friends
      2DUP
      CR TELL

      35 countChar
      .
      BYE
