use std::error::Error;
type BoxResult<T> = Result<T, Box<dyn Error>>;

fn main() -> BoxResult<()> {
    let args: Vec<String> = std::env::args().collect();
    if let Ok(data) = std::fs::read_to_string(&args[1]) {
        let input: Vec<&str> = data.split("\n").collect();
        let mut total: isize = 0;
        for line in input {
            if let Ok(iarg) = line.parse() {
                let mut res = eoc(iarg);
                total = total + res;
                loop {
                    res = eoc(res);
                    if !res > 0 {
                        break
                    }
                    total = total + res;
                }
            }
        }
        print!("{}", total)
    }
    Ok(())
}

fn eoc(mass: isize) -> isize {
    mass / 3 - 2
}
