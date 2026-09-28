(function(){
  var fine = window.matchMedia('(pointer:fine)').matches;
  var lens = document.getElementById('lens'), lt = document.getElementById('lensText');
  var mode = '', px = 0, py = 0, raf = null;

  function setMode(m){ if(m!==mode){ lens.classList.remove('img','txt'); if(m) lens.classList.add(m); mode = m; } }
  function wordAt(x,y){
    var r = document.caretRangeFromPoint ? document.caretRangeFromPoint(x,y) : null;
    if(!r && document.caretPositionFromPoint){ var p = document.caretPositionFromPoint(x,y); if(p) r = {startContainer:p.offsetNode,startOffset:p.offset}; }
    if(!r || !r.startContainer || r.startContainer.nodeType !== 3) return null;
    var t = r.startContainer.textContent, i = r.startOffset, s = i, e = i;
    while(s>0 && /\S/.test(t[s-1])) s--;
    while(e<t.length && /\S/.test(t[e])) e++;
    var w = t.slice(s,e).trim(); if(!w) return null;
    var rg = document.createRange(); rg.setStart(r.startContainer,s); rg.setEnd(r.startContainer,e);
    var b = rg.getBoundingClientRect();
    if(x<b.left-3 || x>b.right+3 || y<b.top-3 || y>b.bottom+3) return null;
    return {w:w, el:r.startContainer.parentElement};
  }
  function update(){
    raf = null;
    lens.style.left = px+'px'; lens.style.top = py+'px'; lens.classList.add('on');
    var el = document.elementFromPoint(px,py);
    if(el && el.closest('input,textarea,select')){ lens.style.opacity = 0; return; }
    lens.style.opacity = '';
    if(el && el.closest('.zoomhover')){ setMode('img'); return; }
    var hit = wordAt(px,py);
    if(hit){
      var cs = getComputedStyle(hit.el), size = parseFloat(cs.fontSize) || 16;
      lt.textContent = hit.w;
      lt.style.fontSize = Math.min(Math.max(size*1.8,20),46)+'px';
      lt.style.fontFamily = cs.fontFamily; lt.style.fontWeight = cs.fontWeight;
      lt.style.textTransform = cs.textTransform; lt.style.letterSpacing = cs.letterSpacing;
      setMode('txt');
    } else { lt.textContent = ''; setMode(''); }
  }
  if(fine && lens){
    window.addEventListener('mousemove', function(e){ px = e.clientX; py = e.clientY; if(!raf) raf = requestAnimationFrame(update); });
    document.addEventListener('mouseleave', function(){ lens.classList.remove('on'); });
  } else if(lens){ lens.style.display = 'none'; }

  /* scroll progress */
  var bar = document.getElementById('progress');
  function prog(){ var h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (h>0 ? scrollY/h*100 : 0)+'%'; }
  addEventListener('scroll', prog, {passive:true}); prog();

  /* reveal on scroll + counters */
  function count(el){
    var m = el.textContent.match(/^(\d+)(.*)$/); if(!m) return;
    var n = +m[1], suf = m[2], st = null;
    (function step(t){ if(!st) st = t; var p = Math.min((t-st)/1400,1);
      el.textContent = Math.round(n*(1-Math.pow(1-p,3)))+suf; if(p<1) requestAnimationFrame(step); })(performance.now());
  }
  var items = document.querySelectorAll('.sec-title,.about-copy,.stat,.svc-card,.gallery>div,.bar,.tool-card,.cbox,.marquee');
  var groups = new Map();
  items.forEach(function(el){
    var par = el.parentElement, n = groups.get(par) || 0; groups.set(par,n+1);
    el.classList.add('reveal'); el.style.setProperty('--d',(n*0.09)+'s');
  });
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); if(e.target.classList.contains('stat')) count(e.target.querySelector('h3')); io.unobserve(e.target); } });
    },{threshold:.15});
    items.forEach(function(el){ io.observe(el); });
  } else { items.forEach(function(el){ el.classList.add('in'); }); }

  /* marquee: duplicate tracks for seamless loop */
  document.querySelectorAll('.track').forEach(function(t){ t.innerHTML += t.innerHTML; });

  /* contact form -> Gmail compose */
  var form = document.getElementById('cform');
  if(form) form.addEventListener('submit', function(e){
    e.preventDefault();
    var n = document.getElementById('cn').value, em = document.getElementById('ce').value,
        s = document.getElementById('cs').value, m = document.getElementById('cm').value;
    var subject = 'Project inquiry: '+s+' ('+n+')';
    var body = m+'\n\n— '+n+' ('+em+')';
    var url = 'https://mail.google.com/mail/?view=cm&fs=1&to=mimiyanwu@gmail.com&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    var w = window.open(url,'_blank');
    if(w){ w.opener = null; } else { location.href = 'mailto:mimiyanwu@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body); }
  });
})();
