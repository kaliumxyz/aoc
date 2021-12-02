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
    let mut perms = vec![9, 8, 7, 6, 5];

    let rom: Vec<String> = program.split(",").map(|s| s.trim().to_string()).collect();
    let mut programs = vec![rom.clone(), rom.clone(), rom.clone(), rom.clone(), rom.clone()];
    let mut ips = vec![0, 0, 0, 0, 0];
    let mut output = String::from("0");

    loop {
        for n in 0..5 {
            let input = output.clone();
            output.clear();
            println!("{} {} {}", ips[n], n, perms[n]);
            match run(&mut programs[n], &config, &mut ips[n], vec![format!("{}", perms[n]), input], &mut output) {
                Ok(()) => {}
                e => {
                    println!("{:?}", ips);
                    println!("{:?}", n);
                    println!("{:?}", programs);
                    println!("{:?}", e);
                    return Ok(());
                }
            }
            println!("{} {} {}", ips[n], n, perms[n]);
            println!("{}", output);
        }
    }
    println!();
    Ok(())
}

fn run(program: &mut Vec<String>, config: &Config, pip: &mut usize, mut input: Vec<String>, output: &mut String) -> BoxResult<()> {
    let mut ip = *pip;
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
                if input.len() == 0 {
                    *pip = ip;
                    return Ok(());
                }
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
                println!("BEANS!                       ");
                println!("BEANS!                       ");
                println!("BEANS!                       ");
                println!("BEANS!                       ");
                println!("BEANS!                       ");
                println!("BEANS!                       ");
                println!("BEANS!                       ");
                println!("BEANS!                       ");
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
