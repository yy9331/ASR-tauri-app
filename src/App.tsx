import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

// 兼容 Tauri 2.x/1.x 的环境检测
const isTauri = navigator.userAgent.includes("Tauri");

interface PolishResult {
  original: string;
  polished: string;
  language: string;
  changes: string[];
}

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [polishResult, setPolishResult] = useState<PolishResult | null>(null);
  const [isPolishing, setIsPolishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'recognition' | 'polish'>('recognition');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 主题切换功能
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // 默认使用黑夜模式
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
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
      // 桌面端，调用 Whisper
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioData = Array.from(new Uint8Array(arrayBuffer));
      const tempPath = `temp_recording_${Date.now()}.webm`;

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

  const polishText = async (text: string, language?: string) => {
    if (!text.trim()) return;

    setIsPolishing(true);
    setError("");
    
    try {
      const result = await invoke("polish_text", {
        text,
        language
      }) as string;

      const polishData: PolishResult = JSON.parse(result);
      setPolishResult(polishData);
    } catch (err) {
      setError(`文本修饰失败: ${err}`);
    } finally {
      setIsPolishing(false);
    }
  };

  const clearResults = () => {
    setRecognizedText("");
    setAudioUrl(null);
    setError("");
    setPolishResult(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* 主题切换按钮 */}
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        title={theme === 'light' ? '切换到夜晚模式' : '切换到白天模式'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-content">
            🎤 智能语音识别与文本修饰
          </h1>
          <p className="text-lg mb-4 text-muted">
            使用 Whisper 进行实时语音转文字，并提供智能文本修饰功能
          </p>
          {!isTauri && (
            <div className="inline-flex items-center px-4 py-2 rounded-lg text-sm bg-warning">
              🌐 网页端模式 - 录音功能可用，语音识别为演示模式
            </div>
          )}
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex rounded-lg shadow-md p-1 card">
            <button
              onClick={() => setActiveTab('recognition')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'recognition'
                  ? 'text-white shadow-md'
                  : 'text-muted hover:text-content'
              }`}
              style={{
                backgroundColor: activeTab === 'recognition' ? 'var(--accent-primary)' : 'transparent'
              }}
            >
              🎤 语音识别
            </button>
            <button
              onClick={() => setActiveTab('polish')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'polish'
                  ? 'text-white shadow-md'
                  : 'text-muted hover:text-content'
              }`}
              style={{
                backgroundColor: activeTab === 'polish' ? 'var(--accent-primary)' : 'transparent'
              }}
            >
              ✨ 文本修饰
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Speech Recognition Tab */}
          {activeTab === 'recognition' && (
            <div className="space-y-6">
              {/* Recording Section */}
              <div className="card">
                <h2 className="text-2xl font-semibold mb-4 text-content">
                  录音控制
                </h2>
                <div className="flex flex-col items-center space-y-4">
                  {!isRecording ? (
                    <button 
                      className="btn-primary text-lg px-8 py-4"
                      onClick={startRecording}
                      disabled={isProcessing}
                    >
                      🎤 开始录音
                    </button>
                  ) : (
                    <button 
                      className="btn-danger text-lg px-8 py-4"
                      onClick={stopRecording}
                    >
                      ⏹️ 停止录音
                    </button>
                  )}

                  {isRecording && (
                    <div className="flex items-center space-x-3 text-content">
                      <div className="w-3 h-3 bg-red-500 rounded-full recording-pulse"></div>
                      <span className="font-medium">正在录音...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Audio Preview Section */}
              {audioUrl && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4 text-content">
                    录音预览
                  </h3>
                  <div className="space-y-4">
                    <audio 
                      controls 
                      src={audioUrl} 
                      className="w-full rounded-lg"
                    />
                    <div className="flex space-x-3">
                      <button 
                        className="btn-primary"
                        onClick={recognizeSpeech}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "🔄 识别中..." : "🔍 开始识别"}
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={clearResults}
                        disabled={isProcessing}
                      >
                        🗑️ 清除
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Recognition Result */}
              {recognizedText && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4 text-content">
                    识别结果
                  </h3>
                  <div className="space-y-4">
                    <div className="rounded-lg p-4 border bg-success">
                      <p className="leading-relaxed text-content">{recognizedText}</p>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        className="btn-primary"
                        onClick={() => copyToClipboard(recognizedText)}
                      >
                        📋 复制文本
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => {
                          setActiveTab('polish');
                        }}
                      >
                        ✨ 修饰文本
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Polish Tab */}
          {activeTab === 'polish' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-2xl font-semibold mb-4 text-content">
                  文本修饰
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-content">
                      输入文本
                    </label>
                    <textarea
                      className="input-field min-h-[120px] resize-none"
                      placeholder="请输入需要修饰的文本..."
                      value={recognizedText}
                      onChange={(e) => setRecognizedText(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      className="btn-primary"
                      onClick={() => polishText(recognizedText)}
                      disabled={isPolishing || !recognizedText.trim()}
                    >
                      {isPolishing ? "🔄 修饰中..." : "✨ 智能修饰"}
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => polishText(recognizedText, 'zh')}
                      disabled={isPolishing || !recognizedText.trim()}
                    >
                      🇨🇳 中文修饰
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => polishText(recognizedText, 'en')}
                      disabled={isPolishing || !recognizedText.trim()}
                    >
                      🇺🇸 英文修饰
                    </button>
                  </div>
                </div>
              </div>

              {/* Polish Result */}
              {polishResult && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4 text-content">
                    修饰结果
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-muted">原始文本</h4>
                        <div className="rounded-lg p-3 border bg-success">
                          <p className="text-sm text-content">{polishResult.original}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-muted">修饰后文本</h4>
                        <div className="rounded-lg p-3 border bg-success">
                          <p className="text-sm text-content">{polishResult.polished}</p>
                        </div>
                      </div>
                    </div>
                    
                    {polishResult.changes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-muted">修改内容</h4>
                        <div className="rounded-lg p-3 border bg-warning">
                          <ul className="space-y-1">
                            {polishResult.changes.map((change, index) => (
                              <li key={index} className="text-sm text-content flex items-center">
                                <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--accent-primary)'}}></span>
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <button 
                        className="btn-primary"
                        onClick={() => copyToClipboard(polishResult.polished)}
                      >
                        📋 复制修饰文本
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => setRecognizedText(polishResult.polished)}
                      >
                        📝 使用修饰文本
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg p-4 border bg-error">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                <span className="text-content">{error}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
