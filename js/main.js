(function(){
  var lens = document.getElementById('lens');
  if (!lens) return;
  var raf = null, tx=0, ty=0;
  window.addEventListener('mousemove', function(e){
    tx = e.clientX; ty = e.clientY;
    if (!raf) {
      raf = requestAnimationFrame(function(){
        lens.style.left = tx+'px'; lens.style.top = ty+'px'; raf = null;
      });
    }
  });
  document.querySelectorAll('.zoomhover').forEach(function(el){
    el.addEventListener('mouseenter', function(){ lens.classList.add('big'); });
    el.addEventListener('mouseleave', function(){ lens.classList.remove('big'); });
  });
})();
