// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn asr_recognize(audio_path: &str) -> Result<String, String> {
    let output = Command::new("python")
        .arg("src-tauri/whisper_asr.py")
        .arg(audio_path)
        .output()
        .map_err(|e| format!("Failed to run python: {}", e))?;
    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    let text = String::from_utf8_lossy(&output.stdout).trim().to_string();
    Ok(text)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, asr_recognize])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
