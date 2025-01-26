use reqwest::blocking::{RequestBuilder, Response};
use reqwest::{header::AUTHORIZATION, Error};
use serde_json::Value;

trait Query {
    fn gql(self, query: String, variables: Option<Value>) -> Result<Response, Error>;
}

impl Query for RequestBuilder {
    fn gql(self, query: String, variables: Option<Value>) -> Result<Response, Error> {
        let payload = {
            let mut playload = serde_json::Map::default();
            playload.insert("query".to_string(), Value::String(query));
            if let Some(vars) = variables {
                playload.insert("variables".to_string(), vars);
            }
            playload
        };

        let response = self.json(&payload).send()?;
        Ok(response)
    }
}

#[tauri::command]
fn gql(url: &str, query: &str, variables: Option<Value>, token: Option<&str>) -> Value {
    let client = reqwest::blocking::Client::new();
    let mut request = client.post(url);
    if let Some(token) = token {
        request = request.header(AUTHORIZATION, token);
    }
    let response = request.gql(query.to_string(), variables).unwrap();
    response.json().unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![gql])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
