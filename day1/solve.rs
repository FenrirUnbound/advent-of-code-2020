use std::env;
use std::fs::File;
use std::io::{BufReader, BufRead};
use std::process;

fn load_input(filename: String) -> Vec<i32>{
    let fp = File::open(filename).expect("no such file");
    let buf = BufReader::new(fp);
    let mut result = Vec::new();

    for line in buf.lines() {
        let val: i32 = line.unwrap().parse().unwrap();
        result.push(val);
    }

    result.sort();
    return result;
}

fn find_sum(inputs: Vec<i32>, target: i32) -> (i32, i32) {
    let mut i = 0;
    let mut j = inputs.len() - 1;

    while i < j {
        let first = inputs[i];
        let last = inputs[j];

        let sum = first + last;

        if sum == target {
            return (first, last);
        }
        if sum < target {
            i += 1;
        } else if sum > target {
            j -= 1;
        }
    }

    return (0, 0);
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let arg_size = args.len();
    if arg_size != 2 {
        println!("Invalid number of arguments passed-in: {}", arg_size);
        process::exit(1);
    }

    let filename = &args[1];
    let inputs = load_input(filename.to_string());
    let results = find_sum(inputs, 2020);

    let result = results.0 * results.1;
    println!("Result: {}", result);
}
