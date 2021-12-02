    /*
    this is based on jonesforth and mostly 1:1 replicated from it,
    everything was taken over by hand and reviewed.
    */

    .set OCT_VERSION,1

    .macro NEXT
    lodsl               /* look kids, intel just has instructions for everything */
    Jmp *(%eax)
    .endm

    .macro PUSHRSP reg  /* push to instruction stack */
    lea -4(%ebp),%ebp   /* decrement? return stack pointer */
    movl \reg,(%ebp)    /* move reg into stack pointer memory */
    .endm

    .macro POPRSP reg   /* pop from instruction stack */
    mov (%ebp),\reg     /* move memory at location of stack pointer to reg */
    lea 4(%ebp),%ebp    /* increment? return stack pointer */
    .endm

    .text               /* start the code */
    .align 4            /* pads the location counter so that its a multiple of 4 ??? why */
DOCOL:
    PUSHRSP %esi
    addl $4,%eax        /* add 4 */
    movl %eax,%esi      /* move the incremented A into I */
    NEXT

    .text
    .globl _start /* this tells the assembler where the code starts, so that ld stops showing warnings */
_start:
    cld
    mov %esp,var_S0             /* save initial data stack pointer into forth var S0. */
    mov $return_stack_top,%ebp  /* init return stack */
    call set_up_data_segment

    mov $cold_start,%esi        /* start at the interpreter */
    NEXT

    .section .rodata
cold_start:
    .int QUIT

    .set F_IMMED,0x80
    .set F_HIDDEN,0x20
    .set F_LENMASK,0x1f

    .set link,0

    .macro defword name, namelen, flags=0, label
    .section .rodata
    .align 4
    .globl name_\label
name_\label :
    .int link
    .set link,name_\label
    .byte \flags+\namelen
    .ascii "\name"
    .align 4
    .globl \label
\label :
    .int DOCOL
    .endm

    .macro defcode name, namelen, flags=0, label
    .section .rodata
    .align 4
    .globl name_\label
name_\label :
    .int link
    .set link,name_\label
    .byte \flags+\namelen
    .ascii "\name"
    .align 4
    .globl \label
\label :
    .int code_\label
    .text

    .globl code_\label
code_\label :
    .endm

    defcode "DROP", 4,,DROP
    pop %eax /* pops top of stack into A */
    NEXT

    defcode "SWAP", 4,,SWAP
    pop %eax
    pop %ebx
    push %eax
    push %ebx
    NEXT

    defcode "DUP", 3,,DUP
    mov (%esp),%eax /* copy top of stack into A */
    push %eax /* put A onto stack */
    NEXT

    defcode "OVER", 4,,OVER
    mov 4(%esp),%eax /* get the second element of stack into A */
    push %eax /* put A onto stack */
    NEXT

    defcode "ROT", 3,,ROT
    pop %eax
    pop %ebx
    pop %ecx
    push %ebx
    push %eax
    push %ecx
    NEXT

    defcode "-ROT", 4,,NROT
    pop %eax
    pop %ebx
    pop %ecx
    push %eax
    push %ebx
    push %ecx
    NEXT

    defcode "2DROP", 5,,TWODROP
    pop %eax /* pops top of stack into A */
    pop %eax /* pops top of stack into A */
    NEXT

    defcode "2DUP", 4,,TWODUP
    mov (%esp),%eax /* copy top of stack into A */
    mov 4(%esp),%ebx /* copy top of stack into B */
    push %ebx /* put B onto stack */
    push %eax /* put A onto stack */
    NEXT

    defcode "2SWAP", 5,,TWOSWAP
    pop %eax
    pop %ebx
    pop %ecx
    pop %edx
    push %ebx
    push %eax
    push %edx
    push %ecx
    NEXT

    defcode "?DUP", 4,,QDUP /* dup if top of stack is non-zero /*
    movl (%esp),%eax /* copy top of stack into A */
    test %eax,%eax   /* test if A is non-zero */
    jz 1f /* jump to NEXT if A is non-zero */
    push %eax /* put A onto stack */
1:  NEXT

    defcode "1+", 2,,INCR
    incl (%esp)
    NEXT

    defcode "1-", 2,,DECR
    decl (%esp)
    NEXT

    defcode "4+", 2,,INCR4
    addl $4,(%esp) /* add 4 off memory at top of stack */
    NEXT

    defcode "4-", 2,,DECR4
    subl $4,(%esp) /* subtract 4 off memory at top of stack */
    NEXT

    defcode "+", 1,,ADD
    pop %eax
    addl %eax,(%esp)
    NEXT

    defcode "-", 1,,SUB
    pop %eax
    subl %eax,(%esp)
    NEXT

    defcode "*", 1,,MUL
    pop %eax
    pop %ebx
    imull %ebx,%eax
    push %eax
    NEXT

    defcode "/MOD", 4,,DIVMOD /* has to be primitive */
    xor %edx,%edx /* empty edx */
    pop %ebx
    pop %eax
    idivl %ebx /* divide A by B */
    push %ebx
    push %eax
    NEXT

    defcode "=", 1,,EQU
    pop %eax
    pop %ebx
    cmp %ebx,%eax
    sete %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode "<>", 2,,NEQU
    pop %eax
    pop %ebx
    cmp %ebx,%eax
    setne %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode "<", 1,,LT
    pop %eax
    pop %ebx
    cmp %ebx,%eax
    setl %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode ">", 1,,GT
    pop %eax
    pop %ebx
    cmp %ebx,%eax
    setg %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode "<=", 2,,LE
    pop %eax
    pop %ebx
    cmp %ebx,%eax
    setle %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode ">=", 2,,GE
    pop %eax
    pop %ebx
    cmp %ebx,%eax
    setge %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode "0=", 2,,ZEQU /* is top of stack 0? */
    pop %eax
    test %eax,%eax
    setz %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode "0<>", 3,,ZNEQU /* is top of stack not 0? */
    pop %eax
    test %eax,%eax
    setnz %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode "0<", 2,,ZLT /* is top of stack less as zero? */
    pop %eax
    test %eax,%eax
    setl %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode "0>", 2,,ZGT /* is top of stack greater as zero? */
    pop %eax
    test %eax,%eax
    setg %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode "0<=", 3,,ZLE /* is top of stack less or equal to zero? */
    pop %eax
    test %eax,%eax
    setle %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode "0>=", 3,,ZGE /* is top of stack greater or equal to zero? */
    pop %eax
    test %eax,%eax
    setge %al
    movzbl %al,%eax
    pushl %eax
    NEXT

    defcode "AND", 3,,AND /* bitwise AND top of stack */
    pop %eax
    andl %eax, (%esp)
    NEXT

    defcode "OR", 2,,OR /* bitwise OR top of stack */
    pop %eax
    orl %eax, (%esp)
    NEXT

    defcode "XOR", 3,,XOR /* bitwise XOR top of stack */
    pop %eax
    xorl %eax, (%esp)
    NEXT

    defcode "INVERT", 6,,INVERT /* FOTH bitwise NOT, NEGATIVE and NOT */
    notl (%esp)
    NEXT

    defcode "EXIT", 4,,EXIT
    POPRSP %esi
    NEXT

    defcode "LIT", 3,,LIT
    lodsl
    push %eax
    NEXT

    defcode "!", 1,,STORE
    pop %ebx
    pop %eax
    mov %eax,(%ebx)
    NEXT

    defcode "@", 1,,FETCH
    pop %ebx
    mov (%ebx),%eax
    pop %eax
    NEXT

    defcode "+!", 2,,ADDSTORE
    pop %ebx
    pop %eax
    addl %eax,(%ebx)
    NEXT

    defcode "-!", 2,,SUBSTORE
    pop %ebx
    pop %eax
    subl %eax,(%ebx)
    NEXT

    defcode "C!", 2,,SUBBYTE
    pop %ebx
    pop %eax
    movb %al,(%ebx)
    NEXT

    defcode "C@", 2,,FETCHBYTE
    pop %ebx
    xor %eax,%eax
    movb (%ebx),%al
    push %eax
    NEXT

    defcode "C@C!", 4,,CCOPY
    movl 4(%esp),%ebx
    movb (%ebx),%al
    pop %edi
    stosb
    push %edi
    incl 4(%esp)
    NEXT

    defcode "CMOVE", 5,,CMOVE
    mov %esi,%edx
    pop %ecx
    pop %edi
    pop %esi
    rep movsb
    mov %ebx,%esi
    NEXT

    .macro defvar name, namelen, flags=0, label, initial=0
    defcode \name,\namelen,\flags,\label
    push $var_\name
    NEXT
    .data
    .align 4
var_\name :
    .int \initial
    .endm

    defvar "STATE",5,,STATE
    defvar "HERE",4,,HERE
    defvar "LATEST",6,,LATEST,name_SYSCALL0
    defvar "S0",2,,SZ
    defvar "BASE",4,,BASE,10

#include <asm/unistd.h>

    .macro defconst name, namelen, flags=0, label, value
    defcode \name,\namelen,\flags,\label
    push $\value
    NEXT
    .endm
   
    defconst "VERSION",7,,VERSION,OCT_VERSION
    defconst "R0",2,,RZ,return_stack_top
    defconst "DOCOL",5,,__DOCOL,DOCOL
    defconst "F_IMMED",7,,__F_IMMED,F_IMMED
    defconst "F_HIDDEN",8,,__F_HIDDEN,F_HIDDEN
    defconst "F_LENMASK",9,,__F_LENMASK,F_LENMASK

    defconst "SYS_EXIT",8,,SYS_EXIT,__NR_exit
    defconst "SYS_OPEN",8,,SYS_OPEN,__NR_open
    defconst "SYS_CLOSE",9,,SYS_CLOSE,__NR_close
    defconst "SYS_READ",8,,SYS_READ,__NR_read
    defconst "SYS_WRITE",9,,SYS_WRITE,__NR_write
    defconst "SYS_CREAT",9,,SYS_CREAT,__NR_creat
    defconst "SYS_BRK",7,,SYS_BRK,__NR_brk

    defconst "O_RDONLY",8,,__O_RDONLY,0
    defconst "O_WRONLY",8,,__O_WRONLY,1
    defconst "O_RDWR",6,,__O_RDWR,2
    defconst "O_CREAT",7,,__O_CREAT,0100
    defconst "O_EXCL",6,,__O_EXCL,0200
    defconst "O_TRUNC",7,,__O_TRUNC,01000
    defconst "O_APPEND",8,,__O_APPEND,02000
    defconst "O_NONBLOCK",10,,__O_NONBLOCK,04000

    defcode ">R",2,,TOR
    pop %eax
    PUSHRSP %eax
    NEXT

    defcode "R>",2,,FROMR
    POPRSP %eax
    push %eax
    NEXT

    defcode "RSP@",4,,RSPFETCH
    PUSH %ebp
    NEXT

    defcode "RSP!",4,,RSPSTORE
    pop %ebp
    NEXT

    defcode "RDROP",5,,RDROP
    addl $4,%ebp
    NEXT

    /* parameter data stack -----------------------------------------
    linux sets up the parameter stack for us, we merely live with it.
    */

    defcode "DSP@",4,,DPSFETCH /* Parameter Data Stack FETCH */
    mov %esp,%eax
    push %eax
    NEXT

    defcode "DSP!",4,,DPSSTORE /* Parameter Data Stack STORE */
    pop %esp
    NEXT


    /* input and output ---------------------------------------------
    here come the forth primitives
    */

    defcode "KEY",3,,KEY
    call _KEY
    push %eax  /* return value on stack */
    NEXT
_KEY:
    mov (currkey),%ebx
    cmp (bufftop),%ebx
    jge 1f
    xor %eax,%eax
    mov (%ebx),%al
    inc %ebx
    mov %ebx,(currkey)
    ret

1:
    xor %edx,%edx       /* empty edx */
    mov $buffer,%ecx
    mov %ecx,currkey
    mov $BUFFER_SIZE,%edx
    mov $__NR_read,%eax
    int $0x80
    test %eax,%eax
    jbe 2f
    addl %eax,%ecx
    mov %ecx,bufftop
    jmp _KEY

2:
    xor %ebx,%ebx
    mov $__NR_exit,%eax
    int $0x80

    .data
    .align 4

currkey:
    .int buffer

bufftop:
    .int buffer

    defcode "EMIT",4,,EMIT
    pop %eax
    call _EMIT
    NEXT

_EMIT:
    mov $1,%ebx
    mov %al,emit_scratch
    mov $emit_scratch, %ecx

    mov $1,%edx

    mov $__NR_write,%eax
    int $0x80
    ret

    .data
emit_scratch:
    .space 1
    defcode "WORD",4,,WORD
    call _WORD
    push %edi
    push %ecx
    NEXT


_WORD:
1:
    call _KEY
    cmpb $'\\',%al
    je 3f
    cmpb $' ',%al
    jbe 1b

    /* Search for the end of the word, storing chars as we go. */
    mov $word_buffer,%edi
2:
    stosb
    call _KEY
    cmpb $' ',%al
    ja 2b

    /* Return the word (well, the static buffer) and length. */
    sub $word_buffer,%edi
    mov %edi,%ecx
    mov $word_buffer,%edi
    ret

    /* Code to skip \ comments to end of the current line. */
3:
    call _KEY
    cmpb $'\n',%al
    jne 3b
    jmp 1b

    .data
    
    
word_buffer:
    .space 32

/*
    As well as reading in words we'll need to read in numbers and for that we are using a function
    called NUMBER.  This parses a numeric string such as one returned by WORD and pushes the
    number on the parameter stack.

    The function uses the variable BASE as the base (radix) for conversion, so for example if
    BASE is 2 then we expect a binary number.  Normally BASE is 10.

    If the word starts with a '-' character then the returned value is negative.

    If the string can't be parsed as a number (or contains characters outside the current BASE)
    then we need to return an error indication.  So NUMBER actually returns two items on the stack.
    At the top of stack we return the number of unconverted characters (ie. if 0 then all characters
    were converted, so there is no error).  Second from top of stack is the parsed number or a
    partial value if there was an error.
*/
    defcode "NUMBER",6,,NUMBER
    pop %ecx
    pop %edi
    call _NUMBER
    push %eax
    push %ecx
    NEXT

_NUMBER:
    xor %eax,%eax
    xor %ebx,%ebx

    test %ecx,%ecx
    jz 5f

    movl var_BASE,%edx


    movb (%edi),%bl
    inc %edi
    push %eax
    cmpb $'-',%bl
    jnz 2f
    pop %eax
    push %ebx
    dec %ecx
    jnz 1f
    pop %ebx
    movl $1,%ecx
    ret


1:    imull %edx,%eax
    movb (%edi),%bl
    inc %edi


2:    subb $'0',%bl
    jb 4f
    cmp $10,%bl
    jb 3f
    subb $17,%bl
    jb 4f
    addb $10,%bl

3:    cmp %dl,%bl
    jge 4f


    add %ebx,%eax
    dec %ecx
    jnz 1b


4:    pop %ebx
    test %ebx,%ebx
    jz 5f
    neg %eax

5:    ret

/*
    DICTIONARY LOOK UPS ----------------------------------------------------------------------

    We're building up to our prelude on how FORTH code is compiled, but first we need yet more infrastructure.

    The FORTH word FIND takes a string (a word as parsed by WORD -- see above) and looks it up in the
    dictionary.  What it actually returns is the address of the dictionary header, if it finds it,
    or 0 if it didn't.

    So if DOUBLE is defined in the dictionary, then WORD DOUBLE FIND returns the following pointer:

    pointer to this
    |
    |
    V
    +---------+---+---+---+---+---+---+---+---+------------+------------+------------+------------+
    | LINK    | 6 | D | O | U | B | L | E | 0 | DOCOL      | DUP        | +          | EXIT       |
    +---------+---+---+---+---+---+---+---+---+------------+------------+------------+------------+

    See also >CFA and >DFA.

    FIND doesn't find dictionary entries which are flagged as HIDDEN.  See below for why.
*/

    defcode "FIND",4,,FIND
    pop %ecx
    pop %edi
    call _FIND
    push %eax
    NEXT

_FIND:
    push %esi

    
    mov var_LATEST,%edx
1:    test %edx,%edx
    je 4f




    xor %eax,%eax
    movb 4(%edx),%al
    andb $(F_HIDDEN|F_LENMASK),%al
    cmpb %cl,%al
    jne 2f


    push %ecx
    push %edi
    lea 5(%edx),%esi
    repe cmpsb
    pop %edi
    pop %ecx
    jne 2f

    
    pop %esi
    mov %edx,%eax
    ret

2:    mov (%edx),%edx
    jmp 1b

4:    
    pop %esi
    xor %eax,%eax
    ret

/*
    FIND returns the dictionary pointer, but when compiling we need the codeword pointer (recall
    that FORTH definitions are compiled into lists of codeword pointers).  The standard FORTH
    word >CFA turns a dictionary pointer into a codeword pointer.

    The example below shows the result of:

        WORD DOUBLE FIND >CFA

    FIND returns a pointer to this
    |                >CFA converts it to a pointer to this
    |                       |
    V                       V
    +---------+---+---+---+---+---+---+---+---+------------+------------+------------+------------+
    | LINK    | 6 | D | O | U | B | L | E | 0 | DOCOL      | DUP        | +          | EXIT       |
    +---------+---+---+---+---+---+---+---+---+------------+------------+------------+------------+
                           codeword

    Notes:

    Because names vary in length, this isn't just a simple increment.

    In this FORTH you cannot easily turn a codeword pointer back into a dictionary entry pointer, but
    that is not true in most FORTH implementations where they store a back pointer in the definition
    (with an obvious memory/complexity cost).  The reason they do this is that it is useful to be
    able to go backwards (codeword -> dictionary entry) in order to decompile FORTH definitions
    quickly.

    What does CFA stand for?  My best guess is "Code Field Address".
*/

    defcode ">CFA",4,,TCFA
    pop %edi
    call _TCFA
    push %edi
    NEXT
_TCFA:
    xor %eax,%eax
    add $4,%edi
    movb (%edi),%al
    inc %edi
    andb $F_LENMASK,%al
    add %eax,%edi
    addl $3,%edi
    andl $~3,%edi
    ret

/*
    Related to >CFA is >DFA which takes a dictionary entry address as returned by FIND and
    returns a pointer to the first data field.

    FIND returns a pointer to this
    |                >CFA converts it to a pointer to this
    |                       |
    |                       |    >DFA converts it to a pointer to this
    |                       |         |
    V                       V         V
    +---------+---+---+---+---+---+---+---+---+------------+------------+------------+------------+
    | LINK    | 6 | D | O | U | B | L | E | 0 | DOCOL      | DUP        | +          | EXIT       |
    +---------+---+---+---+---+---+---+---+---+------------+------------+------------+------------+
                           codeword

    (Note to those following the source of FIG-FORTH / ciforth: My >DFA definition is
    different from theirs, because they have an extra indirection).

    You can see that >DFA is easily defined in FORTH just by adding 4 to the result of >CFA.
*/

    defword ">DFA",4,,TDFA
    .int TCFA
    .int INCR4
    .int EXIT

/*
    COMPILING ----------------------------------------------------------------------

    Now we'll talk about how FORTH compiles words.  Recall that a word definition looks like this:

        : DOUBLE DUP + ;

    and we have to turn this into:

      pointer to previous word
       ^
       |
    +--|------+---+---+---+---+---+---+---+---+------------+------------+------------+------------+
    | LINK    | 6 | D | O | U | B | L | E | 0 | DOCOL      | DUP        | +          | EXIT       |
    +---------+---+---+---+---+---+---+---+---+------------+--|---------+------------+------------+
           ^       len                         pad  codeword      |
       |                              V
      LATEST points here                points to codeword of DUP

    There are several problems to solve.  Where to put the new word?  How do we read words?  How
    do we define the words : (COLON) and ; (SEMICOLON)?

    FORTH solves this rather elegantly and as you might expect in a very low-level way which
    allows you to change how the compiler works on your own code.

    FORTH has an INTERPRET function (a true interpreter this time, not DOCOL) which runs in a
    loop, reading words (using WORD), looking them up (using FIND), turning them into codeword
    pointers (using >CFA) and deciding what to do with them.

    What it does depends on the mode of the interpreter (in variable STATE).

    When STATE is zero, the interpreter just runs each word as it looks them up.  This is known as
    immediate mode.

    The interesting stuff happens when STATE is non-zero -- compiling mode.  In this mode the
    interpreter appends the codeword pointer to user memory (the HERE variable points to the next
    free byte of user memory -- see DATA SEGMENT section below).

    So you may be able to see how we could define : (COLON).  The general plan is:

    (1) Use WORD to read the name of the function being defined.

    (2) Construct the dictionary entry -- just the header part -- in user memory:

    pointer to previous word (from LATEST)            +-- Afterwards, HERE points here, where
       ^                            |   the interpreter will start appending
       |                            V   codewords.
    +--|------+---+---+---+---+---+---+---+---+------------+
    | LINK    | 6 | D | O | U | B | L | E | 0 | DOCOL      |
    +---------+---+---+---+---+---+---+---+---+------------+
                   len                         pad  codeword

    (3) Set LATEST to point to the newly defined word, ...

    (4) .. and most importantly leave HERE pointing just after the new codeword.  This is where
        the interpreter will append codewords.

    (5) Set STATE to 1.  This goes into compile mode so the interpreter starts appending codewords to
        our partially-formed header.

    After : has run, our input is here:

    : DOUBLE DUP + ;
             ^
         |
        Next byte returned by KEY will be the 'D' character of DUP

    so the interpreter (now it's in compile mode, so I guess it's really the compiler) reads "DUP",
    looks it up in the dictionary, gets its codeword pointer, and appends it:

                                         +-- HERE updated to point here.
                                         |
                                         V
    +---------+---+---+---+---+---+---+---+---+------------+------------+
    | LINK    | 6 | D | O | U | B | L | E | 0 | DOCOL      | DUP        |
    +---------+---+---+---+---+---+---+---+---+------------+------------+
                   len                         pad  codeword

    Next we read +, get the codeword pointer, and append it:

                                              +-- HERE updated to point here.
                                              |
                                              V
    +---------+---+---+---+---+---+---+---+---+------------+------------+------------+
    | LINK    | 6 | D | O | U | B | L | E | 0 | DOCOL      | DUP        | +          |
    +---------+---+---+---+---+---+---+---+---+------------+------------+------------+
                   len                         pad  codeword

    The issue is what happens next.  Obviously what we _don't_ want to happen is that we
    read ";" and compile it and go on compiling everything afterwards.

    At this point, FORTH uses a trick.  Remember the length byte in the dictionary definition
    isn't just a plain length byte, but can also contain flags.  One flag is called the
    IMMEDIATE flag (F_IMMED in this code).  If a word in the dictionary is flagged as
    IMMEDIATE then the interpreter runs it immediately _even if it's in compile mode_.

    This is how the word ; (SEMICOLON) works -- as a word flagged in the dictionary as IMMEDIATE.

    And all it does is append the codeword for EXIT on to the current definition and switch
    back to immediate mode (set STATE back to 0).  Shortly we'll see the actual definition
    of ; and we'll see that it's really a very simple definition, declared IMMEDIATE.

    After the interpreter reads ; and executes it 'immediately', we get this:

    +---------+---+---+---+---+---+---+---+---+------------+------------+------------+------------+
    | LINK    | 6 | D | O | U | B | L | E | 0 | DOCOL      | DUP        | +          | EXIT       |
    +---------+---+---+---+---+---+---+---+---+------------+------------+------------+------------+
                   len                         pad  codeword                           ^
                                                       |
                                                      HERE
    STATE is set to 0.

    And that's it, job done, our new definition is compiled, and we're back in immediate mode
    just reading and executing words, perhaps including a call to test our new word DOUBLE.

    The only last wrinkle in this is that while our word was being compiled, it was in a
    half-finished state.  We certainly wouldn't want DOUBLE to be called somehow during
    this time.  There are several ways to stop this from happening, but in FORTH what we
    do is flag the word with the HIDDEN flag (F_HIDDEN in this code) just while it is
    being compiled.  This prevents FIND from finding it, and thus in theory stops any
    chance of it being called.

    The above explains how compiling, : (COLON) and ; (SEMICOLON) works and in a moment I'm
    going to define them.  The : (COLON) function can be made a little bit more general by writing
    it in two parts.  The first part, called CREATE, makes just the header:

                           +-- Afterwards, HERE points here.
                           |
                           V
    +---------+---+---+---+---+---+---+---+---+
    | LINK    | 6 | D | O | U | B | L | E | 0 |
    +---------+---+---+---+---+---+---+---+---+
                   len                         pad

    and the second part, the actual definition of : (COLON), calls CREATE and appends the
    DOCOL codeword, so leaving:

                                +-- Afterwards, HERE points here.
                                |
                                V
    +---------+---+---+---+---+---+---+---+---+------------+
    | LINK    | 6 | D | O | U | B | L | E | 0 | DOCOL      |
    +---------+---+---+---+---+---+---+---+---+------------+
                   len                         pad  codeword

    CREATE is a standard FORTH word and the advantage of this split is that we can reuse it to
    create other types of words (not just ones which contain code, but words which contain variables,
    constants and other data).
*/

    defcode "CREATE",6,,CREATE


    pop %ecx
    pop %ebx

    
    movl var_HERE,%edi
    movl var_LATEST,%eax
    stosl

    
    mov %cl,%al
    stosb
    push %esi
    mov %ebx,%esi
    rep movsb
    pop %esi
    addl $3,%edi
    andl $~3,%edi


    movl var_HERE,%eax
    movl %eax,var_LATEST
    movl %edi,var_HERE
    NEXT

/*
    Because I want to define : (COLON) in FORTH, not assembler, we need a few more FORTH words
    to use.

    The first is , (COMMA) which is a standard FORTH word which appends a 32 bit integer to the user
    memory pointed to by HERE, and adds 4 to HERE.  So the action of , (COMMA) is:

                            previous value of HERE
                                 |
                                 V
    +---------+---+---+---+---+---+---+---+---+-- - - - - --+------------+
    | LINK    | 6 | D | O | U | B | L | E | 0 |             |  <data>    |
    +---------+---+---+---+---+---+---+---+---+-- - - - - --+------------+
                   len                         pad                      ^
                                          |
                                    new value of HERE

    and <data> is whatever 32 bit integer was at the top of the stack.

    , (COMMA) is quite a fundamental operation when compiling.  It is used to append codewords
    to the current word that is being compiled.
*/

    defcode ",",1,,COMMA
    pop %eax
    call _COMMA
    NEXT
_COMMA:
    movl var_HERE,%edi
    stosl
    movl %edi,var_HERE
    ret

/*
    Our definitions of : (COLON) and ; (SEMICOLON) will need to switch to and from compile mode.

    Immediate mode vs. compile mode is stored in the global variable STATE, and by updating this
    variable we can switch between the two modes.

    For various reasons which may become apparent later, FORTH defines two standard words called
    [ and ] (LBRAC and RBRAC) which switch between modes:

    Word    Assembler    Action        Effect
    [    LBRAC        STATE := 0    Switch to immediate mode.
    ]    RBRAC        STATE := 1    Switch to compile mode.

    [ (LBRAC) is an IMMEDIATE word.  The reason is as follows: If we are in compile mode and the
    interpreter saw [ then it would compile it rather than running it.  We would never be able to
    switch back to immediate mode!  So we flag the word as IMMEDIATE so that even in compile mode
    the word runs immediately, switching us back to immediate mode.
*/

    defcode "[",1,F_IMMED,LBRAC
    xor %eax,%eax
    movl %eax,var_STATE
    NEXT

    defcode "]",1,,RBRAC
    movl $1,var_STATE
    NEXT

/*
    Now we can define : (COLON) using CREATE.  It just calls CREATE, appends DOCOL (the codeword), sets
    the word HIDDEN and goes into compile mode.
*/

    defword ":",1,,COLON
    .int WORD
    .int CREATE
    .int LIT, DOCOL, COMMA
    .int LATEST, FETCH, HIDDEN
    .int RBRAC
    .int EXIT

/*
    ; (SEMICOLON) is also elegantly simple.  Notice the F_IMMED flag.
*/

    defword ";",1,F_IMMED,SEMICOLON
    .int LIT, EXIT, COMMA
    .int LATEST, FETCH, HIDDEN
    .int LBRAC
    .int EXIT

/*
    EXTENDING THE COMPILER ----------------------------------------------------------------------

    Words flagged with IMMEDIATE (F_IMMED) aren't just for the FORTH compiler to use.  You can define
    your own IMMEDIATE words too, and this is a crucial aspect when extending basic FORTH, because
    it allows you in effect to extend the compiler itself.  Does gcc let you do that?

    Standard FORTH words like IF, WHILE, ." and so on are all written as extensions to the basic
    compiler, and are all IMMEDIATE words.

    The IMMEDIATE word toggles the F_IMMED (IMMEDIATE flag) on the most recently defined word,
    or on the current word if you call it in the middle of a definition.

    Typical usage is:

    : MYIMMEDWORD IMMEDIATE
        ...definition...
    ;

    but some FORTH programmers write this instead:

    : MYIMMEDWORD
        ...definition...
    ; IMMEDIATE

    The two usages are equivalent, to a first approximation.
*/

    defcode "IMMEDIATE",9,F_IMMED,IMMEDIATE
    movl var_LATEST,%edi
    addl $4,%edi
    xorb $F_IMMED,(%edi)
    NEXT

/*
    'addr HIDDEN' toggles the hidden flag (F_HIDDEN) of the word defined at addr.  To hide the
    most recently defined word (used above in : and ; definitions) you would do:

        LATEST @ HIDDEN

    'HIDE word' toggles the flag on a named 'word'.

    Setting this flag stops the word from being found by FIND, and so can be used to make 'private'
    words.  For example, to break up a large word into smaller parts you might do:

        : SUB1 ... subword ... ;
        : SUB2 ... subword ... ;
        : SUB3 ... subword ... ;
        : MAIN ... defined in terms of SUB1, SUB2, SUB3 ... ;
        HIDE SUB1
        HIDE SUB2
        HIDE SUB3

    After this, only MAIN is 'exported' or seen by the rest of the program.
*/

    defcode "HIDDEN",6,,HIDDEN
    pop %edi
    addl $4,%edi
    xorb $F_HIDDEN,(%edi)
    NEXT

    defword "HIDE",4,,HIDE
    .int WORD
    .int FIND
    .int HIDDEN
    .int EXIT

/*
    ' (TICK) is a standard FORTH word which returns the codeword pointer of the next word.

    The common usage is:

    ' FOO ,

    which appends the codeword of FOO to the current word we are defining (this only works in compiled code).

    You tend to use ' in IMMEDIATE words.  For example an alternate (and rather useless) way to define
    a literal 2 might be:

    : LIT2 IMMEDIATE
        ' LIT ,        \ Appends LIT to the currently-being-defined word
        2 ,        \ Appends the number 2 to the currently-being-defined word
    ;

    So you could do:

    : DOUBLE LIT2 * ;

    (If you don't understand how LIT2 works, then you should review the material about compiling words
    and immediate mode).

    This definition of ' uses a cheat which I copied from buzzard92.  As a result it only works in
    compiled code.  It is possible to write a version of ' based on WORD, FIND, >CFA which works in
    immediate mode too.
*/
    defcode "'",1,,TICK
    lodsl
    pushl %eax
    NEXT

/*
    BRANCHING ----------------------------------------------------------------------

    It turns out that all you need in order to define looping constructs, IF-statements, etc.
    are two primitives.

    BRANCH is an unconditional branch. 0BRANCH is a conditional branch (it only branches if the
    top of stack is zero).

    The diagram below shows how BRANCH works in some imaginary compiled word.  When BRANCH executes,
    %esi starts by pointing to the offset field (compare to LIT above):

    +---------------------+-------+---- - - ---+------------+------------+---- - - - ----+------------+
    | (Dictionary header) | DOCOL |            | BRANCH     | offset     | (skipped)     | word       |
    +---------------------+-------+---- - - ---+------------+-----|------+---- - - - ----+------------+
                                   ^  |                  ^
                                   |  |                  |
                                   |  +-----------------------+
                                  %esi added to offset

    The offset is added to %esi to make the new %esi, and the result is that when NEXT runs, execution
    continues at the branch target.  Negative offsets work as expected.

    0BRANCH is the same except the branch happens conditionally.

    Now standard FORTH words such as IF, THEN, ELSE, WHILE, REPEAT, etc. can be implemented entirely
    in FORTH.  They are IMMEDIATE words which append various combinations of BRANCH or 0BRANCH
    into the word currently being compiled.

    As an example, code written like this:

        condition-code IF true-part THEN rest-code

    compiles to:

        condition-code 0BRANCH OFFSET true-part rest-code
                      |        ^
                      |        |
                      +-------------+
*/

    defcode "BRANCH",6,,BRANCH
    add (%esi),%esi
    NEXT

    defcode "0BRANCH",7,,ZBRANCH
    pop %eax
    test %eax,%eax
    jz code_BRANCH
    lodsl
    NEXT

/*
    LITERAL STRINGS ----------------------------------------------------------------------

    LITSTRING is a primitive used to implement the ." and S" operators (which are written in
    FORTH).  See the definition of those operators later.

    TELL just prints a string.  It's more efficient to define this in assembly because we
    can make it a single Linux syscall.
*/

    defcode "LITSTRING",9,,LITSTRING
    lodsl
    push %esi
    push %eax
    addl %eax,%esi
     addl $3,%esi
    andl $~3,%esi
    NEXT

    defcode "TELL",4,,TELL
    mov $1,%ebx
    pop %edx
    pop %ecx
    mov $__NR_write,%eax
    int $0x80
    NEXT

/*
    QUIT AND INTERPRET ----------------------------------------------------------------------

    QUIT is the first FORTH function called, almost immediately after the FORTH system "boots".
    As explained before, QUIT doesn't "quit" anything.  It does some initialisation (in particular
    it clears the return stack) and it calls INTERPRET in a loop to interpret commands.  The
    reason it is called QUIT is because you can call it from your own FORTH words in order to
    "quit" your program and start again at the user prompt.

    INTERPRET is the FORTH interpreter ("toploop", "toplevel" or "REPL" might be a more accurate
    description -- see: http:
*/


    defword "QUIT",4,,QUIT
    .int RZ,RSPSTORE
    .int INTERPRET
    .int BRANCH,-8

/*
    This interpreter is pretty simple, but remember that in FORTH you can always override
    it later with a more powerful one!
 */
    defcode "INTERPRET",9,,INTERPRET
    call _WORD

    
    xor %eax,%eax
    movl %eax,interpret_is_lit
    call _FIND
    test %eax,%eax
    jz 1f


    mov %eax,%edi
    movb 4(%edi),%al
    push %ax
    call _TCFA
    pop %ax
    andb $F_IMMED,%al
    mov %edi,%eax
    jnz 4f

    jmp 2f

1:
    incl interpret_is_lit
    call _NUMBER
    test %ecx,%ecx
    jnz 6f
    mov %eax,%ebx
    mov $LIT,%eax

2:    
    movl var_STATE,%edx
    test %edx,%edx
    jz 4f

    
    call _COMMA
    mov interpret_is_lit,%ecx
    test %ecx,%ecx
    jz 3f
    mov %ebx,%eax
    call _COMMA
3:    NEXT

4:
    mov interpret_is_lit,%ecx
    test %ecx,%ecx
    jnz 5f



    jmp *(%eax)

5:
    push %ebx
    NEXT

6:

    mov $2,%ebx
    mov $errmsg,%ecx
    mov $errmsgend-errmsg,%edx
    mov $__NR_write,%eax
    int $0x80

    mov (currkey),%ecx
    mov %ecx,%edx
    sub $buffer,%edx
    cmp $40,%edx
    jle 7f
    mov $40,%edx
7:    sub %edx,%ecx
    mov $__NR_write,%eax
    int $0x80

    mov $errmsgnl,%ecx
    mov $1,%edx
    mov $__NR_write,%eax
    int $0x80

    NEXT

    .section .rodata
errmsg: .ascii "PARSE ERROR: "
errmsgend:
errmsgnl: .ascii "\n"

    .data
    .align 4
interpret_is_lit:
    .int 0

    defcode "CHAR",4,,CHAR
    call _WORD
    xor %eax,%eax
    movb (%edi),%al
    push %eax
    NEXT

    defcode "EXECUTE",7,,EXECUTE
    pop %eax
    jmp *(%eax)


    defcode "SYSCALL3",8,,SYSCALL3
    pop %eax
    pop %ebx
    pop %ecx
    pop %edx
    int $0x80
    push %eax
    NEXT

    defcode "SYSCALL2",8,,SYSCALL2
    pop %eax
    pop %ebx
    pop %ecx
    int $0x80
    push %eax
    NEXT

    defcode "SYSCALL1",8,,SYSCALL1
    pop %eax
    pop %ebx
    int $0x80
    push %eax
    NEXT

    defcode "SYSCALL0",8,,SYSCALL0
    pop %eax
    int $0x80
    push %eax
    NEXT

/*
    DATA SEGMENT ----------------------------------------------------------------------

    Here we set up the Linux data segment, used for user definitions and variously known as just
    the 'data segment', 'user memory' or 'user definitions area'.  It is an area of memory which
    grows upwards and stores both newly-defined FORTH words and global variables of various
    sorts.

    It is completely analogous to the C heap, except there is no generalised 'malloc' and 'free'
    (but as with everything in FORTH, writing such functions would just be a Simple Matter
    Of Programming).  Instead in normal use the data segment just grows upwards as new FORTH
    words are defined/appended to it.

    There are various "features" of the GNU toolchain which make setting up the data segment
    more complicated than it really needs to be.  One is the GNU linker which inserts a random
    "build ID" segment.  Another is Address Space Randomization which means we can't tell
    where the kernel will choose to place the data segment (or the stack for that matter).

    Therefore writing this set_up_data_segment assembler routine is a little more complicated
    than it really needs to be.  We ask the Linux kernel where it thinks the data segment starts
    using the brk(2) system call, then ask it to reserve some initial space (also using brk(2)).

    You don't need to worry about this code.
*/
    .text
    .set INITIAL_DATA_SEGMENT_SIZE,65536
set_up_data_segment:
    xor %ebx,%ebx
    movl $__NR_brk,%eax
    int $0x80
    movl %eax,var_HERE
    addl $INITIAL_DATA_SEGMENT_SIZE,%eax
    movl %eax,%ebx
    movl $__NR_brk,%eax
    int $0x80
    ret

/*
    We allocate static buffers for the return static and input buffer (used when
    reading in files and text that the user types in).
*/
    .set RETURN_STACK_SIZE,8192
    .set BUFFER_SIZE,4096

    .bss
/* FORTH return stack. */
    .align 4096
return_stack:
    .space RETURN_STACK_SIZE
return_stack_top:

/* This is used as a temporary input buffer when reading from files or the terminal. */
    .align 4096
buffer:
    .space BUFFER_SIZE
