use std::env;
use std::fs;

use crate::error::*;
mod error;

mod vm;

struct Config {
    quiet: bool,
    debug: bool,
    interactive: bool,
    path: String,
}

fn main() -> BoxResult<()> {
    let args: Vec<String> = env::args().collect();

    if args.len() == 1 {
        println!("USAGE: {} [OPTIONS] [FILE]", args[0]);
        println!("-d: start with debug mode on");
        return Ok(());
    }

    let mut config = Config {
        quiet: false,
        debug: false,
        interactive: false,
        path: String::new(),
    };

    if args.len() == 2 {
        config.path = args[1].clone();
    } else {
        for i in 1..args.len() {
            match args[i].as_ref() {
                "-d" | "--debug" => {
                    config.debug = true;
                }
                "-q" | "--quiet" => {
                    config.quiet = true;
                }
                file => {
                    if config.path == "" {
                        config.path = file.to_owned();
                    } else {
                        return Err(InvalidArgError::new(format!("unknown argument {}", file)));
                    }
                }
            }
        }
    }

    let program = load(&config)?;
    let mut rec = 0;

    for n0 in 0..5 {
        // println!("{}", n);
        let mut o0 = String::new();
        run(program.clone(), &config, vec![format!("{}", n0), String::from("0")], &mut o0)?;
        for n1 in 0..5 {
            let mut o1 = String::new();
            run(program.clone(), &config, vec![format!("{}", n1), o0.clone()], &mut o1)?;
            for n2 in 0..5 {
                let mut o2 = String::new();
                run(program.clone(), &config, vec![format!("{}", n2), o1.clone()], &mut o2)?;
                for n3 in 0..5 {
                    let mut o3 = String::new();
                    run(program.clone(), &config, vec![format!("{}", n3), o2.clone()], &mut o3)?;
                    for n4 in 0..5 {
                        let mut o4 = String::new();
                        run(program.clone(), &config, vec![format!("{}", n4), o3.clone()], &mut o4)?;
                        if n0 != n1 && n0 != n2 && n0 != n3 && n0 != n4 && n1 != n2 && n1 != n3 && n1 != n4 && n2 != n3 && n2 != n4 && n3 != n4 {
                            let res: u32 = o4.parse()?;
                            if res > rec {
                                rec = res;
                                println!("{} {} {} {} {}", n0, n1, n2, n3, n4);
                                println!("{}", rec);
                            }
                        }
                    }
                }
            }
        }
        println!();
    }

    println!();
    Ok(())
}

fn run(rom: String, config: &Config, mut input: Vec<String>, output: &mut String) -> BoxResult<()> {
    let mut program: Vec<String> = rom.split(",").map(|s| s.to_string()).collect();
    let mut ip: usize = 0;
    loop {
        let symbol = &program[ip];
        let mut modes = "";
        // if the opcode has positional information, strip it
        let symbol = if symbol.len() > 2 {
            let temp = symbol.split_at(symbol.len() - 2);
            modes = temp.0;
            temp.1
        } else {
            symbol
        };

        if config.debug {
            println!("symbol {}", symbol);
        }

        let op = match symbol.as_ref() {
            "1" | "01" => {
                ip = ip + 1;
                let first  = program[ip].parse::<isize>()?;
                ip = ip + 1;
                let second = program[ip].parse::<isize>()?;
                ip = ip + 1;
                let third  = program[ip].parse::<isize>()?;
                ip = ip + 1; // next OP
                vm::Op::Add(first, second, third)
            },
            "2" | "02" => {
                ip = ip + 1;
                let first  = program[ip].parse::<isize>()?;
                ip = ip + 1;
                let second = program[ip].parse::<isize>()?;
                ip = ip + 1;
                let third  = program[ip].parse::<isize>()?;
                ip = ip + 1; // next OP
                vm::Op::Multiply(first, second, third)
            },
            "3" | "03" => {
                ip = ip + 1;
                let first  = program[ip].parse::<isize>()?;
                ip = ip + 1; // next OP
                vm::Op::Read(first)
            },
            "4" | "04" => {
                ip = ip + 1; // get first arg
                let first  = program[ip].parse::<isize>()?;
                ip = ip + 1;
                vm::Op::Write(first)
            },
            "5" | "05" => {
                ip = ip + 1;
                let first  = program[ip].parse::<isize>()?;
                ip = ip + 1;
                let second = program[ip].parse::<isize>()?;
                ip = ip + 1; // next OP
                vm::Op::JumpIfTrue(first, second)
            },
            "6" | "06" => {
                ip = ip + 1;
                let first  = program[ip].parse::<isize>()?;
                ip = ip + 1;
                let second = program[ip].parse::<isize>()?;
                ip = ip + 1; // next OP
                vm::Op::JumpIfFalse(first, second)
            },
            "7" | "07" => {
                ip = ip + 1;
                let first  = program[ip].parse::<isize>()?;
                ip = ip + 1;
                let second = program[ip].parse::<isize>()?;
                ip = ip + 1;
                let third  = program[ip].parse::<isize>()?;
                ip = ip + 1; // next OP
                vm::Op::LessThan(first, second, third)
            },
            "8" | "08" => {
                ip = ip + 1;
                let first  = program[ip].parse::<isize>()?;
                ip = ip + 1;
                let second = program[ip].parse::<isize>()?;
                ip = ip + 1;
                let third  = program[ip].parse::<isize>()?;
                ip = ip + 1; // next OP
                vm::Op::Equals(first, second, third)
            },
            "99" => { vm::Op::Halt },
            _ => {
                return Err(GenericError::new(format!("unknown symbol {}", symbol)));
            },
        };

        if config.debug {
            println!("{:?}", op);
            println!("modes {}", modes);
        }

        match op {
            vm::Op::Read(first) => {
                if !config.quiet {
                    print!(">");
                    use std::io::Write;
                    std::io::stdout().flush()?;
                }
                // if config.debug {
                //     println!("input: {}", input.first());
                // }
                program[first as usize] = input.remove(0);
            },
            vm::Op::Write(mut first) => {
                first = match modes {
                    "1" => {
                        first
                    },
                    _ => {
                        program[first as usize].parse::<isize>()?
                    }
                };
                if config.interactive {
                    if config.debug {
                        println!("WRITE: {}", first);
                    } else {
                        print!("{}", first);
                    }
                } else {
                    output.push_str(format!("{}", first).as_ref());
                }
            },
            vm::Op::Add(mut first, mut second, third) => {
                first = match modes {
                    "1" | "01" | "11" => {
                        first
                    }
                    _ => {
                        program[first as usize].parse::<isize>()?
                    }
                };
                second = match modes {
                    "11" | "10" => {
                        second
                    }
                    _ => {
                        program[second as usize].parse::<isize>()?
                    }
                };
                if config.debug {
                    println!("args: {} {} {}", first, second, third);
                }
                program[third as usize] = (first + second).to_string();
            },
            vm::Op::LessThan(mut first, mut second, third) => {
                first = match modes {
                    "1" | "01" | "11" => {
                        first
                    }
                    _ => {
                        program[first as usize].parse::<isize>()?
                    }
                };
                second = match modes {
                    "11" | "10" => {
                        second
                    }
                    _ => {
                        program[second as usize].parse::<isize>()?
                    }
                };
                if config.debug {
                    println!("args: {} {} {}", first, second, third);
                }
                if first < second {
                    program[third as usize] = "1".to_string();
                } else {
                    program[third as usize] = "0".to_string();
                }
            },
            vm::Op::Equals(mut first, mut second, third) => {
                first = match modes {
                    "1" | "01" | "11" => {
                        first
                    }
                    _ => {
                        program[first as usize].parse::<isize>()?
                    }
                };
                second = match modes {
                    "11" | "10" => {
                        second
                    }
                    _ => {
                        program[second as usize].parse::<isize>()?
                    }
                };
                if config.debug {
                    println!("args: {} {} {}", first, second, third);
                }
                if first == second {
                    program[third as usize] = "1".to_string();
                } else {
                    program[third as usize] = "0".to_string();
                }
            },
            vm::Op::JumpIfTrue(mut first, mut second) => {
                first = match modes {
                    "1" | "01" | "11" => {
                        first
                    }
                    _ => {
                        program[first as usize].parse::<isize>()?
                    }
                };
                second = match modes {
                    "11" | "10" => {
                        second
                    }
                    _ => {
                        program[second as usize].parse::<isize>()?
                    }
                };
                if config.debug {
                    println!("args: {} {} {}", first, second, ip);
                }
                if first > 0 {
                    ip = second as usize;
                }
            },
            vm::Op::JumpIfFalse(mut first, mut second) => {
                first = match modes {
                    "1" | "01" | "11" => {
                        first
                    }
                    _ => {
                        program[first as usize].parse::<isize>()?
                    }
                };
                second = match modes {
                    "11" | "10" => {
                        second
                    }
                    _ => {
                        program[second as usize].parse::<isize>()?
                    }
                };
                if config.debug {
                    println!("args: {} {} {}", first, second, ip);
                }
                if first == 0 {
                    ip = second as usize;
                }
            },
            vm::Op::Halt => {
                break;
            },
            vm::Op::Multiply(mut first, mut second, third) => {
                first = match modes {
                    "1" | "01" | "11" => {
                        first
                    }
                    _ => {
                        program[first as usize].parse::<isize>()?
                    }
                };
                second = match modes {
                    "11" | "10" => {
                        second
                    }
                    _ => {
                        program[second as usize].parse::<isize>()?
                    }
                };
                if config.debug {
                    println!("args: {} {} {}", first, second, third);
                }
                program[third as usize] = (first * second).to_string();
            },
            _ => {
                return Err(GenericError::new(format!("unimplemented op {:?}", op)));
            },
        }
    }
    Ok(())
}

fn load(config: &Config) -> BoxResult<String> {
    if !config.quiet {
        println!("reading: {}", config.path);
    }
    let program = fs::read_to_string(&config.path)?;
    if !config.quiet {
        println!("running: {}", config.path);
    }
    return Ok(program);
}
