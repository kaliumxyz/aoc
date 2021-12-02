use std::fmt;
use std::error::Error;

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

pub struct GenericError {
    details: String,
}

impl GenericError {
    pub fn new(msg: String) -> Box<GenericError> {
        Box::new(GenericError { details: msg })
    }
}

impl fmt::Debug for GenericError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self.details)
    }
}

impl fmt::Display for GenericError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.details)
    }
}

impl Error for GenericError {
    fn description(&self) -> &str {
        &self.details
    }
}
