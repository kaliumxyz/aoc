use std::str::FromStr;
extern crate regex;

fn main() {
    let content = std::fs::read_to_string("./input")
        .expect("could not read file");
    let fields = vec!["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
    let a = valdate_batch(&content, fields);
    println!("{:?}", a);
}

fn valdate_batch(content: &String, required_fields: Vec<&str>) -> usize {
    let passports = content.split("\n\n");
    let mut count = 0;
    for passport in passports {
        let mut flag = false;
        for field in &required_fields {
            if !passport.contains(field) {
                flag = true;
            }
        }
        if !flag {
            let fields = passport.split(|c| c == '\n' || c == ' ');
            for field in fields {
                println!("field: {:?}", field);
                if field.len() > 0 {
                    let both = field.split(":").collect::<Vec<_>>();
                    let (a,b) = (both[0], both[1]);
                    match a {
                        "byr"=> {
                            let num = i32::from_str(b).unwrap();
                            if !(num >= 1920 && num <= 2002) {
                                println!("wrong: {:?}", num);
                                flag = true;
                            }
                        }
                        "iyr"=> {
                            let num = i32::from_str(b).unwrap();
                            if !(num >= 2010 && num <= 2020) {
                                println!("wrong: {:?}", num);
                                flag = true;
                            }
                        }
                        "eyr"=> {
                            let num = i32::from_str(b).unwrap();
                            if !(num >= 2020 && num <= 2030) {
                                println!("wrong: {:?}", num);
                                flag = true;
                            }
                        }
                        "hgt"=> {
                            let height = b.split(|c| c == 'c' || c == 'i').collect::<Vec<_>>();
                            if height.len() < 2 {
                                flag = true;
                                println!("wrong: {:?}", height);
                            } else {
                                println!("height: {:?}", height);
                                match height[1] {
                                    "m" => {
                                        let num = i32::from_str(height[0]).unwrap();
                                        if !(num >= 150 && num <= 193) {
                                            println!("wrong: {:?}", height);
                                            flag = true;
                                        }
                                    }
                                    "n" => {
                                        let num = i32::from_str(height[0]).unwrap();
                                        if !(num >= 59 && num <= 76) {
                                            println!("wrong: {:?}", height);
                                            flag = true;
                                        }
                                    }
                                    _ => {
                                        println!("wrong: {:?}", height);
                                        flag = true;
                                    }
                                }
                            }
                        }
                        "hcl"=> {
                            if b.len() != 7 {
                                println!("wrong: {:?}", b);
                                flag = true;
                            } else {
                                let color = b.split(|c| c == '#').collect::<Vec<_>>();
                                if color.len() < 2 {
                                    flag = true;
                                    println!("wrong: {:?}", b);
                                } else {
                                    let re = regex::Regex::new(r"^[0-9a-fA-F]{6}$").unwrap();
                                    if re.is_match(color[1]) {
                                    } else {
                                        flag = true;
                                        println!("wrong format! {:?}", b);
                                    }
                                }
                            }
                        }
                        "ecl"=> {
                            match b {
                                "amb" | "blu"| "brn"| "gry"| "grn"| "hzl"| "oth" => {
                                }
                                x => {
                                    println!("wrong: {:?}", x);
                                    flag = true;
                                }
                            }
                        }
                        "pid"=> {
                            if b.len() != 9 {
                                println!("wrong: {:?}", b);
                                flag = true;
                            }
                        }
                        _ => {
                           
                        }
                    }
                }
            }
        }

        if !flag {
            count = count + 1
        }
    }
    return count;
}
