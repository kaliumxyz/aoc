fn main() {
    let content = std::fs::read_to_string("./input")
        .expect("could not read file");
    let a = valdate_batch(&content);
    // println!("{:?}", a);
}

fn valdate_batch(content: &String) -> i32 {
    let lines = content.split("\n");
    let mut highest: i32 = 0;
    for line in lines {
        let mut chars = line.chars();
        let mut i = 0;
        let mut row = 0;
        let mut col = 0;
        while let Some(cha) = chars.next() {
            i = i + 1;
            if cha == 'B' {
                row = row + 2_i32.pow(7 - i);
            }
            if cha == 'R' {
                col = col + 2_i32.pow(10 - i);
            }
        }
        let id = row * 8 + col;
        // println!("{:?} {} {} {}", line, row, col, id);
        println!("{}", id);
        if id > highest {
            highest = id;
        }
    }
    return highest;
}

