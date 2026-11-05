/* Side Quest Club: articles from the Google Sheet (posts.js) */
(function(){
  var EP='https://script.google.com/macros/s/AKfycbzsehEV7gMd_Se-cc1NnHOnP_FbSXqxSJfgXA8fo4Sp9_C2dGFQXBFaWfLCZPCQYofK1A/exec';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function inline(s){
    s=esc(s);
    s=s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,function(m,t,u){
      if(!/^(https?:\/\/|mailto:|\/|#)/.test(u)) return m;
      return '<a href="'+u+'"'+(/^https?:/.test(u)?' target="_blank" rel="noopener"':'')+'>'+t+'</a>';
    });
    s=s.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*?)\*/g,'$1<i>$2</i>');
    return s;
  }
  /* tiny markdown: ## heading, ### subheading, - bullets, 1. numbers, > scribble, **bold**, *italic*, [text](url) */
  function md(text){
    var lines=String(text||'').replace(/\r/g,'').split('\n'), out=[], para=[], list=null;
    function flushP(){ if(para.length){ out.push('<p>'+inline(para.join(' '))+'</p>'); para=[]; } }
    function flushL(){ if(list){ out.push('</'+list+'>'); list=null; } }
    lines.forEach(function(raw){
      var l=raw.trim(), m;
      if(!l){ flushP(); flushL(); return; }
      if(/^-{3,}$/.test(l)){ flushP(); flushL(); return; }
      if((m=l.match(/^#{1,2}\s+(.*)$/))){ flushP(); flushL(); out.push('<h2>'+inline(m[1])+'</h2>'); return; }
      if((m=l.match(/^#{3,}\s+(.*)$/))){ flushP(); flushL(); out.push('<h3>'+inline(m[1])+'</h3>'); return; }
      if((m=l.match(/^>\s?(.*)$/))){ flushP(); flushL(); out.push('<p class="scribble">'+inline(m[1])+'</p>'); return; }
      if((m=l.match(/^[-*]\s+(.*)$/))){ flushP(); if(list!=='ul'){ flushL(); out.push('<ul>'); list='ul'; } out.push('<li>'+inline(m[1])+'</li>'); return; }
      if((m=l.match(/^\d+[.)]\s+(.*)$/))){ flushP(); if(list!=='ol'){ flushL(); out.push('<ol>'); list='ol'; } out.push('<li>'+inline(m[1])+'</li>'); return; }
      flushL(); para.push(l);
    });
    flushP(); flushL();
    return out.join('\n');
  }
  function readMin(t){
    t=String(t||''); var cjk=(t.match(/[㐀-鿿]/g)||[]).length;
    var words=t.replace(/[㐀-鿿]/g,' ').split(/\s+/).filter(Boolean).length;
    return Math.max(1,Math.round(words/220+cjk/450));
  }
  function fmtDate(d){ try{ return new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }catch(e){ return d; } }
  window.SQC_POSTS={md:md,esc:esc,readMin:readMin,endpoint:EP,fmtDate:fmtDate};

  function api(q){ return fetch(EP+'?'+q).then(function(r){return r.json();}); }

  function home(){
    var box=document.getElementById('latest'); if(!box||!EP) return;
    api('action=articles').then(function(j){
      if(!j||!j.ok||!j.articles||!j.articles.length) return;
      var html=j.articles.slice(0,8).map(function(a,i){
        return '<a class="post-card" href="/post/?s='+encodeURIComponent(a.slug)+'"><span class="tape"></span><span class="n">'+(i===0?'NEW':'')+'</span><h3>'+esc(a.title)+'</h3><p>'+esc(a.summary)+'</p><span class="meta">'+esc(a.label||'Article')+'</span></a>';
      }).join('');
      box.insertAdjacentHTML('afterbegin',html);
      var old=box.querySelector('a[href="/career/"] .n'); if(old) old.style.display='none';
      var lab=document.getElementById('latestLabel'); if(lab) lab.textContent='Latest articles';
    }).catch(function(){});
  }

  function post(){
    var root=document.getElementById('post'); if(!root) return;
    var slug=new URLSearchParams(location.search).get('s')||location.hash.replace('#','');
    function nf(){ root.innerHTML='<h1>Article not found</h1><p class="intro">It may have moved, or it\'s still a draft.</p><p><a class="cta" href="/">Back home</a></p>'; }
    if(!slug||!EP){ nf(); return; }
    api('action=article&slug='+encodeURIComponent(slug)).then(function(j){
      if(!j||!j.ok||!j.article){ nf(); return; }
      var a=j.article;
      root.innerHTML='<span class="label">'+esc(a.label||'Article')+'</span><h1>'+esc(a.title)+'</h1>'+(a.summary?'<p class="intro">'+esc(a.summary)+'</p>':'')+'<div class="actions" data-a="'+esc(a.slug)+'"></div>'+md(a.body)+'<p class="fine">Published '+esc(fmtDate(a.date))+'</p>';
      document.title=a.title+' | Side Quest Club';
      var md2=document.querySelector('meta[name="description"]'); if(md2) md2.setAttribute('content',a.summary||a.title);
      if(window.sqcSetArt) window.sqcSetArt(a.slug,a.title);
      if(window.sqcRefresh) window.sqcRefresh();
    }).catch(function(){ nf(); });
  }
  home(); post();
})();
