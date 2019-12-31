use crate::error::BoxResult;
use std::fmt;

#[derive(Debug)]
pub enum Op {
    Add(isize, isize, isize),
    Multiply(isize, isize, isize),
    Read(isize),
    Write(isize),
    JumpIfTrue(isize, isize),
    JumpIfFalse(isize, isize),
    LessThan(isize, isize, isize),
    Equals(isize, isize, isize),
    Halt,
}

struct State {
}

pub fn read() -> BoxResult<usize> {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input)?;
    let input: usize = input.parse()?;

    Ok(input)
}

// impl fmt::Debug for Op {
//     fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
//         write!(f, "{:?}", self)
//     }
// }

// impl fmt::Display for Op {
//     fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
//         write!(f, "{}", self)
//     }
// }
