import socket,json,base64,pathlib,time,os
s=socket.create_connection(('127.0.0.1',int(os.environ.get('MARIONETTE_PORT', '2829')))); f=s.makefile('rb'); seq=0
def read():
 b=b''
 while (c:=f.read(1))!=b':': b+=c
 return json.loads(f.read(int(b)))
read()
def call(name,args={}):
 global seq
 seq+=1; b=json.dumps([0,seq,name,args]).encode(); s.sendall(str(len(b)).encode()+b':'+b); r=read()
 if r[2]: raise RuntimeError(r[2])
 return r[3]
def js(script): return call('WebDriver:ExecuteScript',{'script':script,'args':[],'newSandbox':False})['value']
try: call('WebDriver:DeleteSession')
except RuntimeError: pass
call('WebDriver:NewSession',{'capabilities':{'alwaysMatch':{'acceptInsecureCerts':True}}})
call('WebDriver:Navigate',{'url':'http://127.0.0.1:5001'})
out=pathlib.Path(__file__).resolve().parents[1] / 'docs/assets/contenido/evidencias/iteracion-03'
def snap(name):
 time.sleep(.3)
 r=call('WebDriver:TakeScreenshot',{'id':None,'full':True,'scroll':False})
 (out/name).write_bytes(base64.b64decode(r['value']))

call('WebDriver:SetWindowRect',{'width':1366,'height':1000})
assert js('return !!window.CircuitRush.createSession')
js('localStorage.clear(); location.reload(); return true')
time.sleep(.5)
assert js('return document.querySelectorAll(".tile").length')==16
assert js('return [...document.querySelectorAll("#levels button")].map(b=>b.disabled)')==[False,True,True]
snap('captura-09-selector.png')
js('document.querySelectorAll(".tile")[1].focus(); return true')
el=call('WebDriver:GetActiveElement')['value']; key=next(v for k,v in el.items() if 'element' in k)
call('WebDriver:ElementSendKeys',{'id':key,'text':'\ue007'})
assert js('return document.getElementById("moves").textContent')=='1'
call('WebDriver:ElementSendKeys',{'id':key,'text':' '})
assert js('return document.getElementById("moves").textContent')=='2'
time.sleep(2.2)
assert js('return document.getElementById("timer").textContent')!='2:00'
snap('captura-12-temporizador.png')
js('document.getElementById("restart").click(); for(const [i,n] of CircuitRush.LEVELS[0].solution)for(let j=0;j<n;j++)document.querySelectorAll(".tile")[i].click(); return true')
assert js('return document.getElementById("victory").open')
assert 'Puntuación: 1960' in js('return document.getElementById("victory-detail").textContent')
snap('captura-13-victoria.png')
js('document.getElementById("next-level").click(); return true')
assert js('return document.querySelectorAll(".tile").length')==25
snap('captura-10-nivel-02.png')
js('for(const [i,n] of CircuitRush.LEVELS[1].solution)for(let j=0;j<n;j++)document.querySelectorAll(".tile")[i].click(); return true')
assert js('return document.getElementById("victory").open')
js('document.getElementById("next-level").click(); return true')
assert js('return document.querySelectorAll(".tile").length')==36
snap('captura-11-nivel-03.png')
# Persistencia real por recarga; el nivel seleccionado vuelve al primero.
call('WebDriver:Refresh'); time.sleep(.3)
assert js('return [...document.querySelectorAll("#levels button")].every(b=>!b.disabled)')
assert '1960' in js('return document.querySelector("#levels button").textContent')
# Derrota con reloj inyectado, sin alterar el tiempo de espera de producción.
js("window.testTime=0; document.getElementById('board').replaceChildren(); window.testSession=CircuitRush.mount(document,{now:()=>window.testTime}); testSession.rotate(1); window.testTime=120000; testSession.tick(); return true")
assert js('return document.getElementById("victory-title").textContent')=='Tiempo agotado'
assert js('return [...document.querySelectorAll(".tile")].every(b=>b.disabled)')
snap('captura-14-derrota.png')
call('WebDriver:Refresh'); time.sleep(.3)
for width in [1366,768,500]:
 call('WebDriver:SetWindowRect',{'width':width,'height':1000})
 for level in range(3):
  js(f'document.querySelectorAll("#levels button")[{level}].click(); return true')
  result=js('return {viewport:[innerWidth,innerHeight],overflow:document.documentElement.scrollWidth>innerWidth,tiles:document.querySelectorAll(".tile").length,tile:document.querySelector(".tile").getBoundingClientRect().width}')
  assert not result['overflow'],result
  print(result)
assert js('return matchMedia("(prefers-reduced-motion: reduce)").matches')
assert js('return getComputedStyle(document.querySelector(".wires")).transitionDuration')=='0s'
print('PASS: selector, teclado, reloj real, victoria, niveles 2/3, recarga, derrota con reloj inyectado, responsive y movimiento reducido.')
call('WebDriver:DeleteSession')
