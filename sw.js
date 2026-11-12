/* Mi Libro de Notas · Service Worker · v2.66
   PRIMERO EL DISPOSITIVO: las páginas (index.html, conversa.html) se abren al instante desde la copia
   guardada en el iPad; con internet, se busca en segundo plano si hay versión nueva y, si la hay, se
   guarda y se avisa a la app ("Versión nueva lista · Abrir ahora").
   Ajustes → "Buscar versión nueva al abrir" (modo 'red') vuelve a pedir primero a internet, con espera
   máxima de 3 s; si no hay copia guardada, siempre se pide a internet.
   Solo se acepta una página si es de este mismo sitio (se siguen las redirecciones de Tiiny / <-> /index.html)
   y trae su firma (su <title>). Una página de error o de otro sitio nunca reemplaza la copia guardada. */
var CACHE='mln-v2.66';
var AJUSTES='mln-ajustes';                // preferencia de apertura (no se borra al actualizar)
var CLAVE_MODO='./__modo-apertura';
var ARCHIVOS=['./index.html','./conversa.html','./icono-512.png','./sw.js'];
var FIRMAS={'index.html':'<title>Mi Libro de Notas</title>','conversa.html':'<title>Conversa</title>'};

function abs(u){ return new URL(u,self.location.href).href; }
function sinBusqueda(u){ var x=new URL(u); x.search=''; x.hash=''; return x.href; }
function nombreDe(url){ var p=new URL(url).pathname; var n=p.substring(p.lastIndexOf('/')+1); return n||'index.html'; }
function firmaDe(url){ return FIRMAS[nombreDe(url)]||FIRMAS['index.html']; }
function claveDe(url){ return sinBusqueda(abs('./'+nombreDe(url))); }   // "/" y "/index.html" comparten clave
function versionDe(t){ var m=/var VERSION='([^']+)'/.exec(t)||/VERSION\s*=\s*["']([^"']+)["']/.exec(t); return m?m[1]:null; }
function huella(t){ var h=0x811c9dc5; for(var i=0;i<t.length;i++){ h^=t.charCodeAt(i); h=Math.imul(h,16777619); } return t.length+':'+(h>>>0); }

/* Trae una página y la acepta solo si es la nuestra (igual que v2.47: sigue redirecciones del mismo
   sitio, evita copias viejas del servidor con _v y decide por la firma). Con tiempo máximo. */
function paginaValida(url,ms){
  var dir=new URL(url); dir.hash=''; dir.search=''; dir.searchParams.set('_v',Date.now());
  var ctl=(typeof AbortController!=='undefined')?new AbortController():null;
  var t=setTimeout(function(){ if(ctl) ctl.abort(); },ms||20000);
  return fetch(dir.href,{cache:'no-store',redirect:'follow',credentials:'same-origin',signal:ctl?ctl.signal:undefined}).then(function(r){
    if(!r || !r.ok) throw new Error('respuesta no válida');
    if(r.url && new URL(r.url).origin!==self.location.origin) throw new Error('otro sitio');
    return r.text();
  }).then(function(texto){
    clearTimeout(t);
    if(texto.indexOf(firmaDe(url))<0) throw new Error('no es la app');
    return texto;
  },function(err){ clearTimeout(t); throw err; });
}
/* Respuesta limpia: sin Content-Length/Content-Encoding del servidor (el texto ya viene descomprimido) */
function aRespuesta(texto){ return new Response(texto,{status:200,headers:{'Content-Type':'text/html; charset=utf-8','X-MLN-Huella':huella(texto)}}); }
function guardarPagina(c,url,texto){
  var k=claveDe(url), ps=[c.put(k,aRespuesta(texto))];
  if(nombreDe(url)==='index.html') ps.push(c.put(sinBusqueda(abs('./')),aRespuesta(texto)));
  return Promise.all(ps);
}
function copiaGuardada(url){
  return caches.match(claveDe(url),{ignoreSearch:true}).then(function(r){
    return r || (nombreDe(url)==='index.html' ? caches.match(sinBusqueda(abs('./'))) : null);
  });
}
function modoApertura(){
  return caches.open(AJUSTES).then(function(c){ return c.match(CLAVE_MODO); })
    .then(function(r){ return r ? r.text() : 'dispositivo'; }).catch(function(){ return 'dispositivo'; });
}
function avisarClientes(msg){
  return self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(cs){ cs.forEach(function(c){ c.postMessage(msg); }); });
}

self.addEventListener('install',function(e){
  // Cada página se descarga UNA vez (antes index.html se bajaba dos veces). Si no es válida, se
  // conserva la copia anterior. Nunca se queda colgada: tiempo máximo por archivo.
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(ARCHIVOS.map(function(u){
      var url=abs(u);
      if(/\.html$/.test(url)){
        return paginaValida(url,30000).then(function(t){ return guardarPagina(c,url,t); })
          .catch(function(){ return copiaGuardada(url).then(function(v){ if(v) return v.text().then(function(t){ return guardarPagina(c,url,t); }); }); });
      }
      return fetch(new Request(url,{cache:'reload'})).then(function(r){
        if(r && r.ok && !r.redirected && !/text\/html/i.test(r.headers.get('Content-Type')||'')) return c.put(sinBusqueda(url),r);
        return caches.match(sinBusqueda(url)).then(function(v){ if(v) return c.put(sinBusqueda(url),v); });
      }).catch(function(){ return caches.match(sinBusqueda(url)).then(function(v){ if(v) return c.put(sinBusqueda(url),v); }); });
    }));
  }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate',function(e){
  // Solo se borran las copias viejas si la nueva tiene la app guardada. Nunca se borra 'mln-ajustes'.
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.match(claveDe(abs('./index.html'))); })
    .then(function(tiene){
      if(!tiene) return;
      return caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==CACHE && /^mln-v/.test(k); }).map(function(k){ return caches.delete(k); })); });
    }).then(function(){ return self.clients.claim(); }));
});

/* Busca en segundo plano la versión publicada; si es distinta de la guardada, la guarda y avisa */
function revisarEnFondo(url,guardada){
  return paginaValida(url,20000).then(function(texto){
    var antes=guardada?guardada.headers.get('X-MLN-Huella'):null;
    var p=(antes?Promise.resolve(antes):(guardada?guardada.clone().text().then(huella):Promise.resolve(null)));
    return p.then(function(hAntes){
      if(hAntes===huella(texto)) return;
      return caches.open(CACHE).then(function(c){ return guardarPagina(c,url,texto); }).then(function(){
        return avisarClientes({tipo:'mln-version-nueva',pagina:nombreDe(url),version:versionDe(texto)});
      });
    });
  }).catch(function(){ /* sin internet o respuesta no válida: no pasa nada, se sigue con la copia */ });
}

self.addEventListener('message',function(e){
  if(e.data && e.data.tipo==='mln-buscar-version'){ /* v2.58: revisa también Conversa */
    var us=[abs('./index.html'),abs('./conversa.html')];
    e.waitUntil(Promise.all(us.map(function(u){ return copiaGuardada(u).then(function(g){ return revisarEnFondo(u,g); }); }))); }
});

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  var url=new URL(e.request.url);
  if(url.origin!==self.location.origin) return;
  // La comprobación "Versión publicada en el sitio" de Ajustes (fetch con _v) va directo a internet
  if(e.request.mode!=='navigate' && url.searchParams.has('_v')) return;
  var esPagina = e.request.mode==='navigate' || /\.html$|\/$/.test(url.pathname);

  if(esPagina){
    var terminarFondo; e.waitUntil(new Promise(function(r){ terminarFondo=r; }));
    e.respondWith(Promise.all([modoApertura(),copiaGuardada(e.request.url)]).then(function(x){
      var modo=x[0], guardada=x[1];
      if(guardada && modo!=='red'){
        // Al instante desde el iPad; la revisión sigue en segundo plano
        revisarEnFondo(e.request.url,guardada.clone()).then(terminarFondo,terminarFondo);
        return guardada;
      }
      // Modo "Buscar versión nueva al abrir", o todavía no hay copia: primero internet
      return new Promise(function(resolver){
        var hecho=false, listo=function(r){ if(!hecho && r){ hecho=true; resolver(r); } };
        var t=guardada ? setTimeout(function(){ listo(guardada.clone()); },3000) : null;
        paginaValida(e.request.url,guardada?20000:60000).then(function(texto){
          clearTimeout(t);
          return caches.open(CACHE).then(function(c){ return guardarPagina(c,e.request.url,texto); }).then(function(){
            if(hecho) return avisarClientes({tipo:'mln-version-nueva',pagina:nombreDe(e.request.url),version:versionDe(texto)});
            listo(aRespuesta(texto));
          });
        }).catch(function(){
          clearTimeout(t);
          if(guardada) listo(guardada.clone());
          else if(!hecho){ hecho=true; resolver(fetch(e.request).catch(function(){ return Response.error(); })); }
        }).then(terminarFondo,terminarFondo);
      });
    }).catch(function(){ terminarFondo(); return fetch(e.request); }));
    return;
  }

  // Ícono y demás: copia guardada primero; solo se actualiza con una respuesta válida
  var clave=sinBusqueda(e.request.url);
  e.respondWith(caches.match(clave,{ignoreSearch:true}).then(function(res){
    var red=fetch(e.request).then(function(r){
      if(r && r.ok && !r.redirected && !/text\/html/i.test(r.headers.get('Content-Type')||'')){ var copia=r.clone(); caches.open(CACHE).then(function(c){ c.put(clave,copia); }); return r; }
      return res || r;
    }).catch(function(){ return res; });
    if(res){ e.waitUntil(red.then(function(){},function(){})); return res; }
    return red;
  }));
});
