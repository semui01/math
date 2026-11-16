import sys, json
sys.path.insert(0, '/root/.claude/skills/synced/d2b73c59-10cc-465e-b3c6-2cb6b574d3d5_2e752f92-3bdd-49e5-9740-a35b2d979c94/script-to-motion-video/scripts')
import soundkit as S
EV = json.load(open('stills/ev/events.json')); M = EV['marks']; DUR = 105.0
k = S.Kit(DUR, seed=7)
# D minor / F major, curious and unresolved
Dm=[50,57,62,65]; Bb=[46,53,58,62]; F=[53,57,60,65]; C=[48,55,60,64]; Gm=[43,50,58,62]; A=[45,52,57,61]
bpm=92
k.pad([50,57,64], 0, M['chen']+1.5, g=.45, bright=1200, att=2.5)                 # sparse intro drone
for i,t in enumerate([1.2, 3.0, 5.3, 7.6, 10.2, 12.4]): k.bell([74,77,81,76,72,69][i], t, g=.06, pan=(-.4,.4)[i%2])
k.progression([Dm,Bb,F,C], M['chen'], M['chenLad'], bpm=bpm, pulse=True, kick_from=M['chenEx'], bright=1500)
k.progression([Gm,Bb,Dm,A], M['chenLad'], M['helf'], bpm=bpm, pulse=True, bright=1300, pad_g=.45)
k.progression([F,C,Dm,Bb], M['helf'], M['helfPf'], bpm=bpm, pulse=True, kick_from=M['helf'], hats_from=M['helfEx'], bright=1900)
k.progression([Bb,C,Dm,F], M['helfPf'], M['stand'], bpm=bpm, pulse=True, kick_from=M['helfPf'], hats_from=M['helfPf'], bright=2200)
k.progression([Dm,Bb,Gm,A], M['stand'], M['ques'], bpm=bpm, pulse=True, bright=1300, pad_g=.45)
k.pad([45,52,57,64], M['ques'], M['qmark']-M['ques']+.3, g=.5, bright=1100, att=1.5, rel=.4)   # suspended A, then near-silence
k.pad([38,50,57], M['qmark'], M['time']-M['qmark']+1, g=.22, bright=700, att=.3, rel=1.2)
k.progression([Dm,Bb,F,C], M['time'], M['close'], bpm=bpm, pulse=True, kick_from=M['time'], hats_from=M['time']+2, bright=1800)
k.progression([Bb,C], M['close'], M['end'], bpm=bpm, pulse=True, kick_from=M['close'], bright=2000)
k.pad([38,50,57,62,69], M['end'], DUR-M['end'], g=.6, bright=2200, att=.2, rel=2.2)           # final open D chord, no third: unresolved
# sfx
for i,t in enumerate(EV['pop']): k.blip(t, .13, [880,988,1175,1320][i%4], .12, pan=(-.3,.3)[i%2]); k.click(t, .12)
for t in EV['whoosh']: k.whoosh(t, .8, .4)
for t in EV['boom']: k.boom(t, .8)
for i,t in enumerate(EV['bell']): k.bell([86,81,89,84,93,74,86,88][i%8], t, g=.12, buf='sfx')
tk = EV['tick']
k.ticks(tk['verify'][0], tk['verify'][1], g=.07, start_gap=.14, accel=.95)
k.ticks(tk['grid'][0], tk['grid'][1], g=.06, start_gap=.12, accel=.96)
k.ticks(tk['years'][0], tk['years'][1], g=.08, start_gap=.05, accel=1.04)
k.beeps(tk['scan'][0], tk['scan'][1], f=660, every=.6, g=.04)
k.sparkle(M['qmark'], 1.6, 120, .025); k.sparkle(M['end']+.2, 1.5, 140, .025)
k.mix('vo_full.wav', 'mix.wav'); k.mix(None, 'mix_novo.wav')
