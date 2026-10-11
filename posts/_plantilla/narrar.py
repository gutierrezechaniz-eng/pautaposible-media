# Narrador sintético (sin grabar a nadie) para los carruseles animados.
# Uso: echo '{"voz":"dora","speed":1.0,"chunks":["Frase uno.","Frase dos."],"out":"x.wav"}' | python3 narrar.py
# Devuelve JSON con el inicio y fin de cada trozo (segundos). Modelos (sherpa-onnx, releases tts-models de k2-fsa/sherpa-onnx)
# en $TTS_MODELOS: kokoro-multi-lang-v1_0 (voces dora, alex, santa) o vits-piper-<voz>.
import sys, os, json, numpy as np, sherpa_onnx, soundfile as sf
M = os.environ.get('TTS_MODELOS', '.') + '/'
KOKORO = {'dora': 28, 'alex': 29, 'santa': 53}
cfg = json.load(sys.stdin)
voz = cfg.get('voz', 'dora')
if voz in KOKORO:
    d = M + 'kokoro-multi-lang-v1_0/'
    model = sherpa_onnx.OfflineTtsModelConfig(kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=d + 'model.onnx', voices=d + 'voices.bin', tokens=d + 'tokens.txt', data_dir=d + 'espeak-ng-data', lexicon='', lang='es'), num_threads=4)
    sid = KOKORO[voz]
else:
    d = M + f'vits-piper-{voz}/'
    model = sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=d + f'{voz}.onnx', tokens=d + 'tokens.txt', data_dir=d + 'espeak-ng-data'), num_threads=4)
    sid = cfg.get('sid', 0)
tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=model))
sr, parts, cues, t = None, [], [], cfg.get('lead', 0.35)
def trim(a, thr=0.01):
    idx = np.where(np.abs(a) > thr)[0]
    return a[max(0, idx[0] - 240): idx[-1] + 480] if len(idx) else a
for i, text in enumerate(cfg['chunks']):
    g = tts.generate(text, sid=sid, speed=cfg.get('speed', 1.0))
    sr = g.sample_rate; a = trim(np.array(g.samples, dtype=np.float32))
    gap = 0 if i == 0 else (0.32 if cfg['chunks'][i - 1].rstrip()[-1:] in '.?!:' else 0.14)
    t += gap; parts.append(np.zeros(int(gap * sr), np.float32)); parts.append(a)
    cues.append([round(t, 3), round(t + len(a) / sr, 3)]); t += len(a) / sr
audio = np.concatenate([np.zeros(int(cfg.get('lead', 0.35) * sr), np.float32)] + parts)
sf.write(cfg['out'], audio, sr)
print(json.dumps({'cues': cues, 'dur': round(len(audio) / sr, 3)}))
