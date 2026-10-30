# Voces de los personajes para los vídeos de YouTube (órganos que hablan).
# Uso: TTS_MODELOS=<carpeta> python3 voces.py <guion.json> <carpeta-salida>
# Deja en la salida: voz.wav (todo el audio, 48 kHz mono) y tiempos.json (inicio/fin de cada línea,
# volumen por fotograma para mover la boca y duración total). Modelo: kokoro-multi-lang-v1_0 (sherpa-onnx).
import sys, os, json, subprocess, tempfile, numpy as np, sherpa_onnx, soundfile as sf

# Personaje -> voz Kokoro (sid), velocidad y cambio de tono (rubberband, conserva los formantes)
VOCES = {
    'narrador': dict(sid=53, speed=1.0, pitch=1.0),   # «santa», la voz de Pauta Posible
    'pancreas': dict(sid=29, speed=1.02, pitch=1.06),  # alex
    'higado':   dict(sid=25, speed=0.95, pitch=0.9),   # grave y tranquilo
    'musculo':  dict(sid=43, speed=1.1, pitch=1.0),    # enérgico
    'grasa':    dict(sid=11, speed=0.95, pitch=0.86),  # grave y lento
    'insulina': dict(sid=28, speed=1.05, pitch=1.08),  # dora
    'glucosa':  dict(sid=35, speed=1.12, pitch=1.15),  # aguda y rápida
}
SR, FPS = 48000, 30
GAP, GAP_ESCENA, ROTULO, INICIO, FINAL = 0.4, 0.8, 2.6, 4.0, 5.0

guion = json.load(open(sys.argv[1]))
out = sys.argv[2]
# Formato vertical (reels y Shorts): la voz empieza enseguida, sin rótulos de escena y con un cierre corto
VERTICAL = bool(guion.get('vertical'))
if VERTICAL: INICIO, FINAL, ROTULO, GAP_ESCENA = 0.3, 2.5, 0.0, 0.4
os.makedirs(out, exist_ok=True)
d = os.environ.get('TTS_MODELOS', '.') + '/kokoro-multi-lang-v1_0/'
tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=d + 'model.onnx', voices=d + 'voices.bin', tokens=d + 'tokens.txt',
                                                   data_dir=d + 'espeak-ng-data', lexicon='', lang='es'), num_threads=4)))

def trim(a, thr=0.01):
    idx = np.where(np.abs(a) > thr)[0]
    return a[max(0, idx[0] - 480): idx[-1] + 960] if len(idx) else a

def linea(who, text):
    v = VOCES[who]
    g = tts.generate(text, sid=v['sid'], speed=v['speed'])
    with tempfile.TemporaryDirectory() as tmp:
        sf.write(tmp + '/a.wav', np.array(g.samples, np.float32), g.sample_rate)
        af = f'aresample={SR}' + (f',rubberband=pitch={v["pitch"]}:formant=preserved' if v['pitch'] != 1 else '')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp + '/a.wav', '-af', af, '-ac', '1', tmp + '/b.wav'], check=True)
        a, _ = sf.read(tmp + '/b.wav', dtype='float32')
    return trim(a)

parts, t, escenas = [np.zeros(int(INICIO * SR), np.float32)], INICIO, []
for i, esc in enumerate(guion['escenas']):
    e = {'id': esc['id'], 'rotulo': esc.get('rotulo', ''), 'ini': round(t, 3), 'lineas': []}
    if esc.get('rotulo') and ROTULO:
        parts.append(np.zeros(int(ROTULO * SR), np.float32)); t += ROTULO
    for j, (who, text, *pega) in enumerate(esc['lineas']):
        if j: parts.append(np.zeros(int(GAP * SR), np.float32)); t += GAP
        a = linea(who, text)
        e['lineas'].append({'who': who, 'text': text, 'pega': pega[0] if pega else '', 'ini': round(t, 3), 'fin': round(t + len(a) / SR, 3)})
        parts.append(a); t += len(a) / SR
        print(f'{t:7.2f}  {who:9s} {text[:60]}', flush=True)
    parts.append(np.zeros(int(GAP_ESCENA * SR), np.float32)); t += GAP_ESCENA
    e['fin'] = round(t, 3)
    escenas.append(e)
parts.append(np.zeros(int(FINAL * SR), np.float32)); t += FINAL
audio = np.concatenate(parts)
audio *= 0.89 / max(1e-6, np.abs(audio).max())
sf.write(out + '/voz-bruta.wav', audio, SR)
# Volumen igualado (≈ -16 LUFS, lo que pide YouTube)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', out + '/voz-bruta.wav', '-af', 'highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR), '-ac', '1', out + '/voz.wav'], check=True)
os.remove(out + '/voz-bruta.wav')

# Envolvente por fotograma (0-1) para la boca de quien habla
a, _ = sf.read(out + '/voz.wav', dtype='float32')
hop = SR // FPS
rms = np.array([np.sqrt((a[k:k + hop] ** 2).mean()) for k in range(0, len(a), hop)])
p95 = np.percentile(rms[rms > 0.005], 95) if (rms > 0.005).any() else 1
env, prev = [], 0
for v in np.clip(rms / p95, 0, 1):
    prev = 0.65 * v + 0.35 * prev if v > prev else 0.35 * v + 0.65 * prev
    env.append(round(float(prev), 3))
json.dump({'dur': round(len(a) / SR, 3), 'fps': FPS, 'inicio': INICIO, 'final': FINAL, 'rotulo': ROTULO, 'titulo': guion['titulo'], 'subtitulo': guion.get('subtitulo', ''), 'vertical': VERTICAL, 'gancho': guion.get('gancho', ''), 'cierre': guion.get('cierre', ''),
           'escenas': escenas, 'env': env}, open(out + '/tiempos.json', 'w'), ensure_ascii=False)
print('duración', round(len(a) / SR, 1), 's')
