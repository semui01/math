import sys, json
sys.path.insert(0, 'scripts')
from soundkit import *
EV = json.load(open('stills/ev/events.json'))
sk = Kit(duration=74)
Dm, Bb, F_, C_, Gm, A_ = [50,57,62,65], [46,53,58,62], [41,53,57,60], [48,55,60,64], [43,55,58,62], [45,52,57,61]
# ch0: sparse wonder
sk.pad([38,50,57,62,69], 0, 9.5, g=.55, bright=1200, att=2.5)
for i, m in enumerate([74, 77, 81, 79]): sk.bell(m, 1.2 + i * 1.6, g=.05, pan=(-.4 + i * .25))
sk.hum(0, 8.5, f=55, g=.08)
# ch1: pulse begins with launch
sk.progression([Dm, Bb, F_, C_], 8.48, 21.9, bpm=96, pulse=True, hats_from=15.0, bright=1500, pad_g=.45)
# ch2: the jump
sk.rumble(21.9, 23.69, g=.7, cut=180)
sk.pad([38,45,50,57,62,65,69], 23.69, 6.0, g=.7, bright=2200, att=.05, rel=3)
sk.progression([Dm, Gm, Bb, A_], 26.0, 34.2, bpm=80, pulse=False, bright=1300, pad_g=.4)
for i in range(8): sk.bell(81 + [0,-3,-5,-7,-8,-10,-12,-15][i], 29.7 + i * .52, g=.04, pan=.3)
# ch3: parallax, curious plucks
sk.progression([Dm, Bb, Gm, A_], 34.22, 51.66, bpm=96, pulse=True, kick_from=38.7, hats_from=42.0, bright=1500, pad_g=.38)
# ch4: Leavitt — rhythm locks to Polaris beat (1.3 s)
sk.progression([F_, C_, Dm, Bb], 51.66, 62.95, bpm=92, pulse=False, bright=1700, pad_g=.45)
t = 51.661 + .3
while t < 62.9: sk.kick(t, .4); sk.bell(69, t, g=.025); t += 1.3
# ch5: resolution into major and final chord
sk.progression([Bb, F_, C_], 62.95, 69.66, bpm=92, pulse=True, kick_from=62.95, hats_from=64.0, bright=1900, pad_g=.45)
sk.pad([38,50,54,57,62,66,69], 69.66, 4.4, g=.75, bright=2400, att=.3, rel=2.5)
for i, m in enumerate([74, 78, 81, 86]): sk.bell(m, 70.3 + i * .22, g=.06, pan=-.5 + i * .3)
# SFX
for w in EV['whoosh']: sk.whoosh(w, g=.5)
sk.boom(EV['boom'][0], g=1.0); sk.boom(EV['boom'][1], g=.6)
for s in EV['sparkle']: sk.sparkle(s, g=.025)
for r in EV['ret']: sk.blip(r, g=.12, f=1760)
for k in ('ticksYear', 'ticks447', 'ticks8m'): sk.ticks(*EV[k], g=.1)
a, b = EV['pingOut']; sk.blip(a, g=.2, f=990); sk.bell(86, b, g=.12, buf='sfx'); sk.beeps(a, b, f=1200, every=.35, g=.03)
a, b = EV['pingBack']; sk.blip(a, g=.2, f=740); sk.bell(81, b, g=.12, buf='sfx'); sk.beeps(a, b, f=900, every=.35, g=.03)
a, b = EV['photon']; sk.whoosh(a + 2.1, d=4.2, g=.25); sk.sparkle(b - .2, d=.8, g=.02)
a, b = EV['blinkFrom']; t = a
while t < b: sk.click(t, g=.18, f=1800); t += .55
sk.whoosh(EV['earth'][0] + 1.5, d=3.0, g=.2)
sk.blip(EV['coin'][0], g=.2, f=2200); sk.click(EV['coin'][1], g=.2)
for l in EV['leavitt']: sk.blip(l, g=.15, f=1480)
for p in EV['planes']: sk.click(p, g=.25, f=1500)
for m in EV['math']: sk.blip(m, g=.18, f=1320)
sk.mix('vo_full.wav', 'mix.wav'); sk.mix(None, 'mix_novo.wav')
print('ok')
