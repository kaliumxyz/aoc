use std::collections::HashMap;

fn main() {
    let content = std::fs::read_to_string("./test")
        .expect("could not read file");
    let a = valdate_batch(&content);
    // let b = second_batch(&content);
    println!("{:?}", a);
    // println!("{:?}", b);
}

fn valdate_batch(content: &String) -> usize {
    let lines = content.split("\n");
    let mut total = 0;
    for line in lines {
        let mut map = HashMap::new();
        let mut chars = line.chars();
        let mut i = 0;
        while let Some(cha) = chars.next() {
            i = i + 1;
            match cha {
                '\n' => {}
                cha => {
                    map.insert(cha, cha);
                }
            }
        }
        total += map.len();
        // println!("{:?} {}", line, i);
        // println!("{:?} {}", map, map.len());
    }
    return total;
}

// fn second_batch(content: &String) -> usize {
//     let lines = content.split("\n\n");
//     let mut total = 0;
//     for line in lines {
//         let mut map = HashMap::new();
//         let mut first = true;
//         let groups = line.split("\n");
//         for group in groups {
//             if group.len() > 0 {
//                 if first {
//                     first = false;
//                     let mut chars = group.chars();
//                     while let Some(cha) = chars.next() {
//                         map.insert(cha, cha);
//                     }
//                 } else {
//                     let mut current = HashMap::new();
//                     let mut chars = group.chars();
//                     while let Some(cha) = chars.next() {
//                         current.insert(cha, cha);
//                     }
//                     map.retain(|k,_| current.contains_key(&k) )
//                 }
//             }
//         }
//         total += map.len();
//         // println!("{:?}", line);
//         // println!("{:?} {}", map, map.len());
//     }
//     return total;
// }
