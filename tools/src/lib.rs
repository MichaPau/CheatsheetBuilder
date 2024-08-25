pub mod parse_joplin;

#[cfg(test)]
mod tests {
    use std::env;


    #[test]
    fn check_something() {
        println!("{}", env::current_dir().unwrap().display());
        
        let md_input = std::fs::read_to_string("../data/Cheatsheets/Git cheat sheet.md").unwrap();
        let parser = pulldown_cmark::Parser::new(&md_input);

        for item in parser {
            println!("{:?}", item);
        }

        //println!("{}", md_input);
    }
}
