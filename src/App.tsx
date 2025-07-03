import { useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("无法访问麦克风，请检查权限设置");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const recognizeSpeech = async () => {
    if (!audioUrl) return;

    setIsProcessing(true);
    setError("");
    
    try {
      // 将音频 blob 转换为字节数组
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioData = Array.from(new Uint8Array(arrayBuffer));
      
      // 创建临时文件路径
      const tempPath = `temp_recording_${Date.now()}.wav`;
      
      // 调用 Tauri 命令进行语音识别
      const text = await invoke("asr_recognize", { 
        audioData,
        audioPath: tempPath 
      }) as string;
      
      setRecognizedText(text);
    } catch (err) {
      setError(`识别失败: ${err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearResults = () => {
    setRecognizedText("");
    setAudioUrl(null);
    setError("");
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎤 语音识别应用</h1>
        <p>使用 Whisper 进行实时语音转文字</p>
      </header>

      <main className="app-main">
        <div className="recording-section">
          <div className="recording-controls">
            {!isRecording ? (
              <button 
                className="record-btn"
                onClick={startRecording}
                disabled={isProcessing}
              >
                🎤 开始录音
              </button>
            ) : (
              <button 
                className="stop-btn"
                onClick={stopRecording}
              >
                ⏹️ 停止录音
              </button>
            )}
          </div>

          {isRecording && (
            <div className="recording-indicator">
              <div className="pulse"></div>
              <span>正在录音...</span>
            </div>
          )}
        </div>

        {audioUrl && (
          <div className="audio-section">
            <h3>录音预览</h3>
            <audio controls src={audioUrl} className="audio-player" />
            <div className="audio-actions">
              <button 
                className="recognize-btn"
                onClick={recognizeSpeech}
                disabled={isProcessing}
              >
                {isProcessing ? "🔄 识别中..." : "🔍 开始识别"}
              </button>
              <button 
                className="clear-btn"
                onClick={clearResults}
                disabled={isProcessing}
              >
                🗑️ 清除
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {recognizedText && (
          <div className="result-section">
            <h3>识别结果</h3>
            <div className="result-text">
              {recognizedText}
            </div>
            <button 
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText(recognizedText)}
            >
              📋 复制文本
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
