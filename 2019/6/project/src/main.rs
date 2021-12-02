use std::error::Error;
use std::env;
use std::fmt;

pub type BoxResult<T> = Result<T, Box<dyn Error>>;

pub struct InvalidArgError {
    details: String,
}

impl InvalidArgError {
    pub fn new(msg: String) -> Box<InvalidArgError> {
        Box::new(InvalidArgError { details: msg })
    }
}

impl fmt::Debug for InvalidArgError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self.details)
    }
}

impl fmt::Display for InvalidArgError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.details)
    }
}

impl Error for InvalidArgError {
    fn description(&self) -> &str {
        &self.details
    }
}

struct Config {
    quiet: bool,
    debug: bool,
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

    Ok(())
}
