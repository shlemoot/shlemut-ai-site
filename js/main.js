// ── RGB Cursor ──
(function(){
  var dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');
  var mx=0,my=0,rx=0,ry=0,hue=0;
  document.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    dot.style.left=mx+'px';dot.style.top=my+'px';
    hue=(hue+0.5)%360;
    var c='hsl('+hue+',100%,50%)';
    document.documentElement.style.setProperty('--cursor-color',c);
  });
  function animRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing);}
  animRing();
  document.querySelectorAll('a,button,.faq-q,.cta-btn,.cta-btn-outline,.nav-cta,.plan .btn').forEach(function(el){
    el.addEventListener('mouseenter',function(){ring.classList.add('hover');});
    el.addEventListener('mouseleave',function(){ring.classList.remove('hover');});
  });
  document.addEventListener('mousedown',function(){ring.classList.add('click');});
  document.addEventListener('mouseup',function(){ring.classList.remove('click');});
  document.addEventListener('mouseleave',function(){dot.classList.add('hidden');ring.classList.add('hidden');});
  document.addEventListener('mouseenter',function(){dot.classList.remove('hidden');ring.classList.remove('hidden');});
})();

// ── FAQ Toggle ──
document.querySelectorAll('.faq-q').forEach(function(q){
  q.addEventListener('click',function(){this.parentElement.classList.toggle('open');});
});

// ── Scroll Animations ──
(function(){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';}
    });
  },{threshold:0.1});
  document.querySelectorAll('.fcard,.plan,.tcard,.step,.stat,.trial-box,.download-box,.mp-card,.mp-highlight,.tscr-card,.hero-explainer,.scr-card').forEach(function(el){
    el.style.opacity='0';el.style.transform='translateY(30px)';
    el.style.transition='opacity .6s ease, transform .6s ease';
    obs.observe(el);
  });
})();

// ── Download Form ──
function handleDownload(e){
  e.preventDefault();
  var email=document.getElementById('dl-email').value;
  var name=document.getElementById('dl-name').value;
  var coupon=document.getElementById('dl-coupon').value;
  // TODO: Connect to Kit (ConvertKit) API
  var box=document.querySelector('.download-box');
  box.innerHTML='<div style="padding:40px 0;"><h2 style="color:var(--gold);margin-bottom:12px;">&#10003; תודה!</h2><p style="color:var(--muted-light);font-size:.95rem;line-height:1.7;">קישור ההורדה נשלח ל-<strong style="color:var(--text);">'+email+'</strong><br>בדקו את תיבת הדואר (גם ספאם). ההורדה כוללת:<br>&#127873; 50 נקודות בונוס + מדריך התקנה מלא</p></div>';
  return false;
}

function validateCoupon(){
  var code=document.getElementById('dl-coupon').value.trim();
  var msg=document.getElementById('coupon-msg');
  if(!code){msg.textContent='';msg.className='coupon-msg';return;}
  // TODO: Validate against Lemon Squeezy API
  var validCodes=['WELCOME50','LAUNCH25','FRIEND20'];
  if(validCodes.indexOf(code.toUpperCase())!==-1){
    msg.innerHTML='&#10003; קופון תקין! ההנחה תופעל בעת הרכישה.';
    msg.className='coupon-msg valid';
  }else{
    msg.textContent='קוד קופון לא תקין. נסו שוב.';
    msg.className='coupon-msg invalid';
  }
}

// ── Parallax Hero ──
window.addEventListener('scroll',function(){
  var s=window.scrollY;
  var hero=document.querySelector('.hero-bg');
  if(hero)hero.style.transform='translateY('+s*0.3+'px)';
});

// ── Mouse-Tracking Parallax for Hero Mockup ──
(function(){
  var wrap=document.querySelector('.hero-mockup-side');
  if(!wrap)return;
  var img=wrap.querySelector('.hero-mockup');
  wrap.addEventListener('mousemove',function(e){
    var rect=wrap.getBoundingClientRect();
    var dx=(e.clientX-(rect.left+rect.width/2))/rect.width;
    var dy=(e.clientY-(rect.top+rect.height/2))/rect.height;
    img.style.transform='rotateX('+(-dy*8)+'deg) rotateY('+(dx*8)+'deg) scale(1.02)';
    img.style.animation='none';
  });
  wrap.addEventListener('mouseleave',function(){
    img.style.transform='';
    img.style.animation='mockupFloat 6s ease-in-out infinite';
  });
  wrap.style.perspective='800px';
})();

// ── Image Zoom on Click (event delegation) ──
(function(){
  var currentZoomed=null;
  function closeZoom(){
    if(currentZoomed){currentZoomed.classList.remove('zoomed');currentZoomed=null;}
    var ov=document.querySelector('.img-overlay');
    if(ov)ov.remove();
  }
  document.addEventListener('click',function(e){
    var img=e.target;
    if(img.classList.contains('tscr-img')||img.classList.contains('scr-img')){
      e.stopPropagation();
      if(img.classList.contains('zoomed')){closeZoom();return;}
      closeZoom();
      var overlay=document.createElement('div');
      overlay.className='img-overlay';
      overlay.onclick=closeZoom;
      document.body.appendChild(overlay);
      img.classList.add('zoomed');
      currentZoomed=img;
    }
  });
  document.addEventListener('keydown',function(ev){
    if(ev.key==='Escape')closeZoom();
  });
})();

// ── Explainer Video Placeholder ──
function playExplainer(el){
  // TODO: Replace with actual video embed URL
  el.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);font-size:1rem;">&#127910; סרטון ההסבר יעלה בקרוב — הישארו מעודכנים!</div>';
}

// ── Background Music ──
var bgMusic=document.getElementById('bgMusic');
var musicPlaying=false;
bgMusic.volume=0.2;
// Start at 25% of track once metadata loaded
bgMusic.addEventListener('loadedmetadata',function(){
  bgMusic.currentTime=bgMusic.duration*0.25;
});

function enterSite(){
  var splash=document.getElementById('entrySplash');
  splash.classList.add('hidden');
  setTimeout(function(){splash.style.display='none';},600);
  // Set start position before playing
  if(bgMusic.duration){bgMusic.currentTime=bgMusic.duration*0.25;}
  bgMusic.play().then(function(){
    musicPlaying=true;
    document.getElementById('musicPlayer').classList.add('show');
    document.getElementById('musicToggle').textContent='\u{1F3B5}';
  }).catch(function(){
    document.getElementById('musicPlayer').classList.add('show');
  });
}

function toggleMusic(){
  if(musicPlaying){
    bgMusic.pause();musicPlaying=false;
    document.getElementById('musicToggle').textContent='\u{1F507}';
  }else{
    bgMusic.play();musicPlaying=true;
    document.getElementById('musicToggle').textContent='\u{1F3B5}';
  }
}

function setVolume(v){
  var vol=v/100;
  bgMusic.volume=vol;
  document.getElementById('volLabel').textContent=v+'%';
  if(vol===0){document.getElementById('musicToggle').textContent='\u{1F507}';}
  else if(musicPlaying){document.getElementById('musicToggle').textContent='\u{1F3B5}';}
}
