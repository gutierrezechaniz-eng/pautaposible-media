"""Prepara el aviso de voz para Iván a partir de voz/GUIONES.md.

Escribe el título en aviso_titulo.txt y el cuerpo en aviso_cuerpo.md; el workflow
abre con ellos un issue que menciona a Iván, y GitHub se lo envía por email.
- Lunes: los reels de la semana con guion y sin grabar.
- Miércoles: el reel del jueves.
- Otro día (lanzamiento manual de prueba): el próximo reel con guion y sin grabar.
"""
import datetime as dt
import re
import sys
from zoneinfo import ZoneInfo

MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
         'septiembre', 'octubre', 'noviembre', 'diciembre']
DIAS = {'martes': 1, 'jueves': 3}
USUARIO = '@gutierrezechaniz-eng'

hoy = dt.datetime.now(ZoneInfo('Europe/Madrid')).date()
if len(sys.argv) > 1 and sys.argv[1]:
    hoy = dt.date.fromisoformat(sys.argv[1])

reels = []
semana = None
actual = None
for linea in open('voz/GUIONES.md', encoding='utf-8'):
    linea = linea.rstrip('\n')
    m = re.match(r'# Guiones de voz · semana del (\d+) de (\w+) de (\d{4})', linea)
    if m:
        semana = dt.date(int(m[3]), MESES.index(m[2]) + 1, int(m[1]))
        continue
    m = re.match(r'## Reel del (martes|jueves)\b[^·]*·\s*(.*)', linea)
    if m and semana:
        actual = {'dia': m[1], 'fecha': semana + dt.timedelta(days=DIAS[m[1]]),
                  'tema': m[2].strip(), 'grabado': 'Ya grabado' in linea, 'guion': ''}
        reels.append(actual)
        continue
    if actual and linea.startswith('> '):
        actual['guion'] = linea[2:].strip()

lunes = hoy - dt.timedelta(days=hoy.weekday())
de_la_semana = [r for r in reels if lunes <= r['fecha'] <= lunes + dt.timedelta(days=6)]
if hoy.weekday() == 0:
    elegidos, prueba = [r for r in de_la_semana if r['fecha'] >= hoy], False
elif hoy.weekday() == 2:
    elegidos, prueba = [r for r in de_la_semana if r['dia'] == 'jueves'], False
else:
    futuros = [r for r in reels if r['fecha'] >= hoy and r['guion'] and not r['grabado']]
    elegidos, prueba = futuros[:1], True

pendientes = [r for r in elegidos if r['guion'] and not r['grabado']]
grabados = [r for r in elegidos if r['grabado']]
fecha = lambda r: f"{r['dia']} {r['fecha'].day}/{r['fecha'].month:02d}"

if pendientes:
    titulo = '🎙️ Graba tu voz: ' + ' y '.join(f"reel del {fecha(r)}" for r in pendientes)
elif grabados:
    titulo = '🎙️ Aviso de voz: no hay nada más que grabar'
else:
    titulo = '🎙️ Aviso de voz: esta semana todavía no hay guion'

c = [f'{USUARIO}']
if prueba:
    c.append('(Envío de prueba: a partir de ahora te llegará cada lunes y miércoles a las 8:51.)')
for r in grabados:
    c.append(f"✔ El reel del {fecha(r)} ya está grabado: no hace falta nada más.")
if not pendientes and not grabados:
    c.append('Esta semana todavía no hay guion: abre Claude y di «sigue con lo pendiente».')
for r in pendientes:
    c += [f"## Reel del {fecha(r)} · {r['tema']}",
          f"**Plazo:** antes del {r['dia']} a las 12:00.",
          'Texto para leer (unos 25 segundos, con calma, como si se lo contaras a un amigo):',
          f"> {r['guion']}"]
if pendientes:
    c += ['**Cómo grabar:** con el móvil cerca, en una habitación tranquila y sin ruido de fondo. Usa la grabadora de notas de voz del móvil.',
          '**Cómo enviarla:** abre Claude, entra en el proyecto Pauta Posible y, en una conversación, adjunta el audio diciendo «nota de voz del reel del ' + ' / '.join(r['dia'] for r in pendientes) + '».',
          'Si no llega a tiempo, el reel se publica igual, pero sin tu voz (llega a menos gente).']

open('aviso_titulo.txt', 'w', encoding='utf-8').write(titulo)
open('aviso_cuerpo.md', 'w', encoding='utf-8').write('\n\n'.join(c) + '\n')
print(titulo)
