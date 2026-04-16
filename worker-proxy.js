const ADMIN_PASSWORD = 'shlemut2026!';
const PAGES_ORIGIN = 'https://shlemut-ai-site.pages.dev';

const CMS_INJECT = `<script>
(function(){
  var API_URL = location.origin + '/api/content';
  fetch(API_URL).then(function(r){return r.json()}).then(function(c){
    if(!c||!c._meta||c._meta.version<=1)return;
    if(c.hero){
      var b=document.querySelector('.hero-badge');if(b&&c.hero.badge)b.textContent=c.hero.badge;
      var h=document.querySelector('.hero h1');if(h&&c.hero.title)h.innerHTML=c.hero.title.replace(/\\n/g,'<br>');
      var s=document.querySelector('.hero .subtitle');if(s&&c.hero.subtitle)s.textContent=c.hero.subtitle;
      var cp=document.querySelector('.cta-btn');if(cp&&c.hero.cta_primary)cp.textContent=c.hero.cta_primary;
      var cs=document.querySelector('.cta-btn-outline');if(cs&&c.hero.cta_secondary)cs.textContent=c.hero.cta_secondary;
      if(c.hero.features&&c.hero.features.length){
        var hs=document.querySelector('.hero-sub');
        if(hs)hs.innerHTML=c.hero.features.map(function(f){return '<span><span class=\\"dot\\"></span> '+f+'</span>'}).join('');
      }
    }
    if(c.stats&&c.stats.length){
      var sg=document.querySelector('.stats-grid');
      if(sg)sg.innerHTML=c.stats.map(function(st){return '<div class=\\"stat\\"><span class=\\"num\\">'+st.value+'</span><span class=\\"lab\\">'+st.label+'</span></div>'}).join('');
    }
    if(c.features){
      var fs=document.querySelector('.features');
      if(fs){
        var ft=fs.querySelector('.section-title');if(ft&&c.features.title)ft.textContent=c.features.title;
        var fu=fs.querySelector('.section-sub');if(fu&&c.features.subtitle)fu.textContent=c.features.subtitle;
        if(c.features.items&&c.features.items.length){
          var fg=fs.querySelector('.features-grid');
          if(fg)fg.innerHTML=c.features.items.map(function(f){return '<div class=\\"feat-card\\"><h3>'+f.title+'</h3><p>'+f.description+'</p></div>'}).join('');
        }
      }
    }
    if(c.testimonials){
      var ts=document.querySelector('.testimonials');
      if(ts){
        var tt=ts.querySelector('.section-title');if(tt&&c.testimonials.title)tt.textContent=c.testimonials.title;
        var tu=ts.querySelector('.section-sub');if(tu&&c.testimonials.subtitle)tu.textContent=c.testimonials.subtitle;
        if(c.testimonials.items&&c.testimonials.items.length){
          var tg=ts.querySelector('.test-grid');
          if(tg)tg.innerHTML=c.testimonials.items.map(function(t){return '<div class=\\"test-card\\"><div class=\\"stars\\">'+'\\u2605'.repeat(t.stars||5)+'</div><p class=\\"test-quote\\">\\"'+t.text+'\\"</p><div class=\\"test-author\\">'+t.name+'</div><div class=\\"test-role\\">'+t.role+'</div></div>'}).join('');
        }
      }
    }
    if(c.pricing){
      var ps=document.querySelector('.pricing');
      if(ps){
        var pt=ps.querySelector('.section-title');if(pt&&c.pricing.title)pt.textContent=c.pricing.title;
        var pu=ps.querySelector('.section-sub');if(pu&&c.pricing.subtitle)pu.textContent=c.pricing.subtitle;
        if(c.pricing.plans&&c.pricing.plans.length){
          var pg=ps.querySelector('.plans');
          if(pg)pg.innerHTML=c.pricing.plans.map(function(p){
            var featHtml=p.features?p.features.map(function(f){return '<li>'+f+'</li>'}).join(''):'';
            return '<div class=\\"plan'+(p.popular?' popular':'')+'\\">'+(p.popular?'<div class=\\"pop-badge\\">\\u2B50 הכי פופולרי</div>':'')+'<h3>'+p.name+'</h3><div class=\\"price\\">'+p.price+'</div><p class=\\"plan-desc\\">'+(p.description||'')+'</p><ul class=\\"plan-feats\\">'+featHtml+'</ul><a class=\\"plan-btn\\" href=\\"#contact\\">'+(p.cta||'התחילו עכשיו')+'</a></div>';
          }).join('');
        }
      }
    }
    if(c.faq){
      var qs=document.querySelector('.faq');
      if(qs){
        var qt=qs.querySelector('.section-title');if(qt&&c.faq.title)qt.textContent=c.faq.title;
        if(c.faq.items&&c.faq.items.length){
          var ql=qs.querySelector('.faq-list');
          if(ql)ql.innerHTML=c.faq.items.map(function(q){return '<div class=\\"faq-item\\"><div class=\\"faq-q\\">'+q.question+'<span class=\\"faq-icon\\">+</span></div><div class=\\"faq-a\\"><p>'+q.answer+'</p></div></div>'}).join('');
        }
      }
    }
    if(c.contact){
      var cs2=document.querySelector('.contact');
      if(cs2){
        var ct2=cs2.querySelector('.section-title');if(ct2&&c.contact.title)ct2.textContent=c.contact.title;
        var cu2=cs2.querySelector('.section-sub');if(cu2&&c.contact.subtitle)cu2.textContent=c.contact.subtitle;
      }
    }
    console.log('CMS v'+c._meta.version+' loaded');
  }).catch(function(e){console.log('CMS: static mode')});
})();
</script>`;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

function isAuthorized(request) {
  const auth = request.headers.get('Authorization');
  if (!auth) return false;
  return auth.replace('Bearer ', '') === ADMIN_PASSWORD;
}

function getDefaultContent() {
  return {
    site: { title: '', description: '' },
    hero: { badge: '', title: '', subtitle: '', cta_primary: '', cta_secondary: '', features: [] },
    stats: [],
    features: { title: '', subtitle: '', items: [] },
    testimonials: { title: '', subtitle: '', items: [], screenshots: [] },
    pricing: { title: '', subtitle: '', plans: [] },
    faq: { title: '', items: [] },
    contact: { title: '', subtitle: '' },
    _meta: { version: 1, lastModified: new Date().toISOString(), modifiedBy: 'system' }
  };
}

class BodyEndHandler {
  element(element) {
    element.before(CMS_INJECT, { html: true });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // === API Routes ===
    if (path.startsWith('/api/')) {
      if (path === '/api/content' && request.method === 'GET') {
        const content = await env.CMS_KV.get('site_content', 'json');
        return jsonResponse(content || getDefaultContent());
      }

      if (path === '/api/auth' && request.method === 'POST') {
        try {
          const { password } = await request.json();
          if (password === ADMIN_PASSWORD) return jsonResponse({ success: true, token: ADMIN_PASSWORD });
          return jsonResponse({ error: 'Wrong password' }, 401);
        } catch (e) { return jsonResponse({ error: 'Invalid' }, 400); }
      }

      if (!isAuthorized(request)) return jsonResponse({ error: 'Unauthorized' }, 401);

      if (path === '/api/content' && request.method === 'PUT') {
        try {
          const content = await request.json();
          content._meta = { ...content._meta, lastModified: new Date().toISOString(), modifiedBy: 'admin', version: (content._meta?.version || 0) + 1 };
          await env.CMS_KV.put('site_content', JSON.stringify(content));
          return jsonResponse({ success: true, meta: content._meta });
        } catch (e) { return jsonResponse({ error: 'Save failed: ' + e.message }, 500); }
      }

      if (path.startsWith('/api/content/') && request.method === 'PUT') {
        try {
          const section = path.replace('/api/content/', '');
          let content = await env.CMS_KV.get('site_content', 'json') || getDefaultContent();
          content[section] = await request.json();
          content._meta = { ...content._meta, lastModified: new Date().toISOString(), modifiedBy: 'admin', version: (content._meta?.version || 0) + 1 };
          await env.CMS_KV.put('site_content', JSON.stringify(content));
          return jsonResponse({ success: true, section, meta: content._meta });
        } catch (e) { return jsonResponse({ error: 'Save failed: ' + e.message }, 500); }
      }

      if (path === '/api/content' && request.method === 'DELETE') {
        await env.CMS_KV.delete('site_content');
        return jsonResponse({ success: true });
      }

      return jsonResponse({ error: 'Not found' }, 404);
    }

    // === Proxy to Pages ===
    const pagesUrl = PAGES_ORIGIN + path + url.search;
    const pagesResp = await fetch(pagesUrl, {
      headers: request.headers,
      redirect: 'follow',
    });

    const ct = pagesResp.headers.get('content-type') || '';

    // Inject CMS script into HTML pages (but NOT admin.html)
    if (ct.includes('text/html') && !path.includes('admin')) {
      return new HTMLRewriter()
        .on('body', new BodyEndHandler())
        .transform(pagesResp);
    }

    // Pass through everything else (images, CSS, JS, etc.)
    return new Response(pagesResp.body, {
      status: pagesResp.status,
      headers: pagesResp.headers,
    });
  }
};
