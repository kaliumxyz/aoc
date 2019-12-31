#!/usr/bin/env zsh
cur=0;
win=""
for a in $(seq 0 4); do
    echo "start: $a";
    ia=($(echo "$a\n0" | cargo run -- -q ../input 2> /dev/null))
    for b in $(seq 0 4); do
        echo "$a$b";
        ib=($(echo "$b\n$ia" | cargo run -- -q ../input 2> /dev/null))
        for c in $(seq 0 4); do
            # echo "$a$b$c";
            ic=($(echo "$c\n$ib" | cargo run -- -q ../input 2> /dev/null))
            for d in $(seq 0 4); do
                # echo "$a$b$c$d";
                id=($(echo "$d\n$ic" | cargo run -- -q ../input 2> /dev/null))
                for e in $(seq 0 4); do
                    # echo "$a$b$c$d$e";
                    res=$(echo "$e\n$id" | cargo run -- -q ../input 2> /dev/null)
                    if [ $res -gt $cur ]; then
                        cur=$res;
                        win="$a$b$c$d$e";
                        # echo "cur: $cur";
                    fi
                    # echo "res: $res";
                done
            done
        done
    done
    echo "done";
done

echo "winner winner chicken dinner!"
echo $win;
echo "with!"
echo $cur;
