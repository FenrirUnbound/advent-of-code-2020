use std::env;
use std::fs;

fn load_input(filename: String) -> Vec<i32> {
    let contents = fs::read_to_string(filename).expect("Something went wrong reading the file");
    let lines = contents.lines();
    let mut result: Vec<i32> = Vec::new();

    for l in lines {
        let num = l.parse::<i32>().unwrap();
        result.push(num);
    }

    result.sort();

    return result;
}

fn append_builtin_adapter(adapters: &mut Vec<i32>) -> Vec<i32> {
    let max = adapters.last().copied();

    let to_add = max.unwrap() + i32::from(3);
    adapters.push(to_add);

    return adapters.to_vec();
}

fn process(adapters: Vec<i32>) -> (i32, i32) {
    let mut singles = 0;
    let mut triples = 0;

    let mut start = 0;
    for i in &adapters {
        let diff = i - start;

        if diff == 1 {
            singles += 1;
        } else if diff == 3 {
            triples += 1;
        }

        start = *i;
    }


    return (singles, triples);
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = &args[1];
    let mut inputs = load_input(filename.to_string());

    inputs = append_builtin_adapter(&mut inputs);

    let (s, t) = process(inputs);

    println!("Results: {} {}", s, t);
}
