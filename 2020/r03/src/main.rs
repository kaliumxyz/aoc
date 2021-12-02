fn main() {
    let content = std::fs::read_to_string("./input")
        .expect("could not read file");
    let a = get_trees(&content, 1, 1);
    let b = get_trees(&content, 3, 1);
    let c = get_trees(&content, 5, 1);
    let d = get_trees(&content, 7, 1);
    let e = get_trees(&content, 1, 2);
    println!("{}", b);
    println!("{}", a * b * c * e * d);
}

fn get_trees(content: &String, right: usize, down: usize) -> usize {
    let map = content.split("\n");
    let mut x = 0;
    let mut y = 0;
    let mut hits = 0;
    while let Some(line) = map.clone().nth(y) {
        if let Some(terrain) = line.chars().nth(x) {
            if terrain == '#' {
                hits = hits + 1;
            }
        }
        y = y + down;
        x = x + right;
        if x >= line.len() {
            x = x - line.len();
        }
    }
    return hits
}
