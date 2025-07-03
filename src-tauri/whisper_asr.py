import sys
import whisper

if len(sys.argv) < 2:
    print("Usage: python whisper_asr.py <audio_file>")
    sys.exit(1)

audio_file = sys.argv[1]

model = whisper.load_model("base")
result = model.transcribe(audio_file)
print(result["text"]) 