use reqwest::blocking::{RequestBuilder, Response};
use reqwest::{header::AUTHORIZATION, Error};
use serde_json::Value;

trait Gql {
    fn gql(self, query: &str, variables: Option<Value>) -> Result<Response, Error>;
}

impl Gql for RequestBuilder {
    fn gql(self, query: &str, variables: Option<Value>) -> Result<Response, Error> {
        let payload = serde_json::json!({
            "query": query,
            "variables": serde_json::json!(variables)
        });

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

    match request.gql(query, variables) {
        Ok(response) => response.json().unwrap(),
        Err(err) => serde_json::json!(
            {
                "message": "An error occurred while processing your request.",
                "err": err.to_string()
            }
        ),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![gql])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
