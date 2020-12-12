use std::env;
use std::fs;

static DIRECTIONS: &'static [String] = &["N", "E", "S", "W"];

trait Fly {
    fn face(&self, String, i32);
    fn fly(&self, String, i32);
}

struct Plane {
    direction: String,
}

impl Fly for Plane {
    fn face(&self, dir: String, deg: i32) {
        let inc = 0;

        match deg {
            _ => println!("default"),
        }
    }

    fn fly(&self, dir: String, dist: i32) {
        println!("Fly");
    }
}

fn load_input(filename: String) -> Vec<String> {
    let contents = fs::read_to_string(filename).expect("Something went wrong reading the file");
    let lines = contents.lines();
    let mut result: Vec<String> = Vec::new();

    for l in lines {
        let s = l.parse::<String>().unwrap();
        result.push(s);
    }

    return result;
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = &args[1];
    let mut inputs = load_input(filename.to_string());
    let plane = Plane{
        direction: String::from("E"),
    };
}
