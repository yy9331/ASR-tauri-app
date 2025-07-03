// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use std::fs;

#[tauri::command]
async fn asr_recognize(audio_data: Vec<u8>, audio_path: String) -> Result<String, String> {
    // 保存音频数据到文件
    let temp_dir = std::env::temp_dir();
    let file_path = temp_dir.join(&audio_path);
    
    fs::write(&file_path, audio_data)
        .map_err(|e| format!("Failed to write audio file: {}", e))?;
    
    // 计算 whisper_asr.py 的绝对路径
    let script_path = std::env::current_dir()
        .map_err(|e| format!("Failed to get current dir: {}", e))?
        .join("whisper_asr.py");
    
    // 调用 Python 脚本进行识别
    let output = Command::new("python")
        .arg(script_path)
        .arg(file_path.to_str().unwrap())
        .output()
        .map_err(|e| format!("Failed to run python: {}", e))?;
    
    // 清理临时文件
    let _ = fs::remove_file(file_path);
    
    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    let text = String::from_utf8_lossy(&output.stdout).trim().to_string();
    Ok(text)
}

#[tauri::command]
async fn polish_text(text: String, language: Option<String>) -> Result<String, String> {
    // 计算 text_polish.py 的绝对路径
    let script_path = std::env::current_dir()
        .map_err(|e| format!("Failed to get current dir: {}", e))?
        .join("text_polish.py");
    
    // 准备命令参数
    let mut args = vec![script_path.to_string_lossy().to_string(), text];
    if let Some(lang) = language {
        args.push(lang);
    }
    
    // 调用 Python 脚本进行文本修饰
    let output = Command::new("python")
        .args(&args)
        .output()
        .map_err(|e| format!("Failed to run python: {}", e))?;
    
    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    
    let result = String::from_utf8_lossy(&output.stdout).trim().to_string();
    Ok(result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, asr_recognize, polish_text])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
