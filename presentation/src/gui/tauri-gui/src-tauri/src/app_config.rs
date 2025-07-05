use std::{
    fmt::Display, fs::{self, File, OpenOptions}, io::{Error, ErrorKind, Read, Write}, path::PathBuf
};

use directories::ProjectDirs;
use serde::{Deserialize, Serialize};

#[derive(Debug)]
pub enum ConfigError {
    SpannedError(ron::error::SpannedError),
    RonError(ron::error::Error),
    IOError(std::io::Error),
    NotImplemented,
}

impl From<ron::error::SpannedError> for ConfigError {
    fn from(err: ron::error::SpannedError) -> Self {
        ConfigError::SpannedError(err)
    }
}

impl From<ron::error::Error> for ConfigError {
    fn from(err: ron::error::Error) -> Self {
        ConfigError::RonError(err)
    }
}
impl From<std::io::Error> for ConfigError {
    fn from(err: std::io::Error) -> Self {
        ConfigError::IOError(err)
    }
}

impl Display for ConfigError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ConfigError::SpannedError(e) => write!(f, "{:?}", e.to_string()),
            ConfigError::RonError(e) => write!(f, "{:?}", e.to_string()),
            ConfigError::IOError(e) => write!(f, "{:?}", e.to_string()),
            ConfigError::NotImplemented => write!(f, "NotImplemented"),
        }
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub struct ConfigState {
    pub id: String,
    pub db_path: PathBuf,
}

impl ConfigState {

    pub fn load_config(projects_path: (&str, &str, &str), filename: &str) -> Result<ConfigState, ConfigError> {
        
        if let Some(project_dir) = ProjectDirs::from(projects_path.0, projects_path.1, projects_path.2) {
            let config_dir = project_dir.config_dir();
            let mut p = PathBuf::from(config_dir);
            p.push(filename);

            if !p.starts_with(config_dir) {
                return Err(ConfigError::IOError(std::io::Error::new(ErrorKind::InvalidData, format!("filename contains path elements: {filename}"))));
            }

            let config = ron::from_str::<ConfigState>(&ConfigState::read_config_file(p)?)?;
            Ok(config)
        
        } else {
            Err(ConfigError::IOError(std::io::Error::other( "directories-rs: no valid home directory path could be retrieved from the operating system")))
        }
    }

    pub fn create_config(projects_path: (&str, &str, &str), filename: &str) -> Result<ConfigState, ConfigError> {
        
        if let Some(project_dir) = ProjectDirs::from(projects_path.0, projects_path.1, projects_path.2) {
            let config_dir = project_dir.config_dir();
            if !config_dir.exists() {
                fs::create_dir_all(config_dir)?;
            }
            let mut p = PathBuf::from(config_dir);
            let mut db_path = p.clone();
            db_path.push("cheatsheetbuilder_db.db");
            p.push(filename);

            if !p.starts_with(config_dir) {
                return Err(ConfigError::IOError(std::io::Error::new(ErrorKind::InvalidData, format!("filename contains path elements: {filename}"))));
            }

            let default_config = ConfigState {
                db_path,
                id: "default_config".into(),
            };

            ConfigState::write_config_file(p, ron::ser::to_string_pretty(&default_config, ron::ser::PrettyConfig::default())?)?;

            Ok(default_config)
        
        } else {
            Err(ConfigError::IOError(std::io::Error::other( "directories-rs: no valid home directory path could be retrieved from the operating system")))
        }
        // Err(ConfigError::NotImplemented)    
    }
    pub fn read_config_file(path: PathBuf) -> Result<String, Error> {
        let mut file: File = OpenOptions::new()
            .read(true)
            .create(false)
            .open(path)?;
        let mut buffer = String::new();
        let _ = file.read_to_string(&mut buffer)?;
        Ok(buffer)
    }

    pub fn write_config_file(path: PathBuf, config_string: String) -> Result<(), Error> {
        let mut file: File = OpenOptions::new()
            .write(true)
            .create(true)
            .open(path)?;
        let r = file.write_all(&config_string.as_bytes())?;
        Ok(r)
    }
}
