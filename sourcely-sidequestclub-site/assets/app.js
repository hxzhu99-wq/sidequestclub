(function(){
  /* ---------- nav state ---------- */
  var cur=document.body.getAttribute('data-page')||'home';
  [].forEach.call(document.querySelectorAll('nav a'),function(a){ if(a.getAttribute('data-nav')===cur) a.setAttribute('aria-current','page'); });

  /* ---------- map data ---------- */
  var TYPES=[
    {id:'E',name:'Electronics',color:'#2437FF'},
    {id:'A',name:'Apparel and textiles',color:'#FF8FC8'},
    {id:'S',name:'Shoes and bags',color:'#FF4B2B'},
    {id:'H',name:'Home and kitchen',color:'#F5FF3B'},
    {id:'T',name:'Toys and gifts',color:'#FF9F1C'},
    {id:'M',name:'Small commodities',color:'#FFFFFF'}
  ];
  var CL=[
    {n:'Shenzhen and Dongguan',p:'Guangdong',t:'E',lon:114.1,lat:22.9,dx:10,dy:18,tags:['consumer electronics','phone accessories','circuit boards','hardware'],know:'One of the densest electronics supply chains in the world. Dongguan also makes toys, shoes and furniture.',tip:'Search by the exact part or accessory. For electronics, ask for test reports such as CE (EU) and FCC (US).'},
    {n:'Foshan, Zhongshan and Guangzhou',p:'Guangdong',t:'H',lon:112.7,lat:23.3,dx:-12,dy:-14,tags:['ceramic tiles','furniture','home appliances','lighting','apparel wholesale'],know:'Foshan is known for tiles, furniture and appliances, Zhongshan for lighting, and Guangzhou for clothing and wholesale markets.',tip:'Lighting and appliances need safety certificates in the US and EU. Ask early.'},
    {n:'Shantou and Chenghai',p:'Guangdong',t:'T',lon:116.7,lat:23.4,dx:0,dy:-14,tags:['plastic toys','plush toys','gifts'],know:'A long-established toy-making area with many small and mid-size workshops.',tip:'Toys have strict safety rules for children. Ask for test reports first: CPSIA (US), EN71 (EU).'},
    {n:'Fujian coast',p:'Fujian',t:'S',lon:118.6,lat:24.8,dx:14,dy:4,tags:['sports shoes','sportswear','bags'],know:'Quanzhou and Jinjiang are known for athletic shoes and sportswear.',tip:'Ask for material specs and the minimum order per color and size.'},
    {n:'Wenzhou and Taizhou',p:'Zhejiang',t:'S',lon:120.7,lat:28.2,dx:14,dy:6,tags:['shoes','leather goods','low-voltage electrical parts','molds and plastics'],know:'Wenzhou is a shoe and leather hub. Yueqing nearby makes electrical parts, and Taizhou makes molds and plastics.',tip:'Match your product to the sub-area first. The region is broad.'},
    {n:'Yiwu',p:'Zhejiang',t:'M',lon:120.1,lat:29.3,dx:-12,dy:2,tags:['jewelry and accessories','stationery','party goods','daily items'],know:'Home of a huge wholesale market for small goods, popular with first-time importers.',tip:'Good for small mixed orders. Many sellers are traders, so ask who actually makes the item.'},
    {n:'Hangzhou Bay belt',p:'Zhejiang',t:'A',lon:121.0,lat:30.4,dx:16,dy:2,tags:['fabric (Keqiao)','kids’ clothing (Zhili)','small appliances (Ningbo, Cixi)'],know:'Shaoxing’s Keqiao is a major fabric center. Ningbo and Cixi make small appliances.',tip:'For clothing, start with fabric: ask for composition and colorfastness test results.'},
    {n:'Yangtze River Delta',p:'Shanghai, Jiangsu',t:'E',lon:120.0,lat:32.0,dx:16,dy:-6,tags:['electronic components','home textiles (Nantong)','eyeglass frames (Danyang)'],know:'A mix of advanced and traditional industries around Shanghai, Suzhou and Wuxi.',tip:'Search by the exact product, since the area makes everything from chips to bedding.'},
    {n:'Qingdao',p:'Shandong',t:'H',lon:120.4,lat:36.1,dx:14,dy:4,tags:['home appliances'],know:'A port city that is home to large appliance makers.',tip:'Appliances need safety approvals for your market. Ask for them before samples.'},
    {n:'Baigou',p:'Hebei',t:'S',lon:115.9,lat:39.1,dx:12,dy:6,tags:['luggage','bags'],know:'A town known for making bags and luggage.',tip:'Ask for sample photos of the stitching, zippers and lining, and for fabric specs.'},
    {n:'Zhengzhou',p:'Henan',t:'E',lon:113.6,lat:34.7,dx:12,dy:6,tags:['smartphone assembly'],know:'Home to one of the world’s largest smartphone assembly sites.',tip:'Mostly large contract manufacturing. Small sellers should look for accessory and component suppliers instead.'},
    {n:'Chengdu and Chongqing',p:'Sichuan, Chongqing',t:'E',lon:105.8,lat:30.2,dx:-4,dy:20,tags:['laptop and electronics assembly'],know:'Large inland electronics assembly and supply chains.',tip:'Useful for electronics assembly. Shipping to ports takes longer than from the coast.'}
  ];
  var OUT=[[73.6,39.4],[75,40.4],[77.8,41],[80.2,42.2],[80.3,45],[82.5,45.2],[83,47.2],[85.5,47],[87.4,49.1],[90,47.9],[91,45.1],[95.3,44.3],[96.4,42.7],[100.8,42.6],[105,41.6],[111.9,43.7],[116,45.7],[119.9,46.7],[117.4,49.6],[120,52.8],[122.2,53.5],[125.5,53.2],[126.9,51.3],[130.7,48.9],[134.8,48.4],[131.9,47.7],[133.1,45.1],[131,44.9],[131.2,42.9],[129.7,42.4],[128,41.4],[126,40],[124.4,39.9],[122,39],[121.5,40.9],[119.5,39.9],[118,39.2],[117.7,38.5],[119,37.2],[122.5,37.4],[120.5,36],[119.2,35],[120.4,34],[121.9,31.8],[121.9,30.9],[122.2,29.9],[121.8,28.6],[120.6,27],[119.7,25.6],[118,24.4],[116.5,23.2],[114.9,22.7],[113.5,22.2],[111.5,21.6],[110.5,20.9],[109.6,21.5],[108,21.5],[106.8,22],[105.3,23.3],[103,22.5],[101.6,21.2],[100.2,21.5],[99,22],[98,24],[97.6,25.5],[98.7,27.5],[97.4,28.3],[96,29],[92.5,27.8],[89,28],[86,28.1],[83.5,29.3],[81.2,30.2],[79,31],[78.8,32.3],[79.5,32.7],[78.2,34.2],[78,35.5],[76.2,35.9],[74.5,37.1]];
  var HAINAN=[[108.7,19.2],[109.5,20],[110.7,20.1],[111,19.5],[110.2,18.4],[109,18.3]];
  function X(lon){return (lon-73)*0.82*11.6+4;}
  function Y(lat){return (54-lat)*11.6+6;}
  function path(a){return 'M'+a.map(function(p){return X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1);}).join('L')+'Z';}
  function tp(id){return TYPES.filter(function(t){return t.id===id;})[0];}

  var filter='all', sel=0;
  var svg=document.getElementById('map'), chips=document.getElementById('chips'), detail=document.getElementById('detail');

  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}

  function drawChips(){
    var h='<button class="chip" type="button" data-f="all" aria-pressed="'+(filter==='all')+'">All types</button>';
    TYPES.forEach(function(t){
      h+='<button class="chip" type="button" data-f="'+t.id+'" aria-pressed="'+(filter===t.id)+'"><i style="background:'+t.color+'"></i>'+t.name+'</button>';
    });
    chips.innerHTML=h;
  }
  function drawMap(){
    var h='<path class="land" d="'+path(OUT)+'"/><path class="land" d="'+path(HAINAN)+'"/>';
    CL.forEach(function(c,i){
      var t=tp(c.t), x=X(c.lon), y=Y(c.lat), off=(filter!=='all'&&filter!==c.t);
      var anchor=c.dx<0?'end':'start';
      h+='<g class="mk'+(i===sel?' sel':'')+(off?' off':'')+'" data-i="'+i+'" tabindex="'+(off?-1:0)+'" role="button" aria-label="'+esc(c.n)+', '+t.name+'">'+
        (i===sel?'<circle class="ring" cx="'+x+'" cy="'+y+'" r="17"/>':'')+
        '<circle cx="'+x+'" cy="'+y+'" r="11" fill="'+t.color+'"/>'+
        '<text class="l" x="'+x+'" y="'+(y+4)+'" text-anchor="middle">'+t.id+'</text>'+
        (i===sel||filter!=='all'&&!off?'<text class="nm" x="'+(x+c.dx)+'" y="'+(y+c.dy)+'" text-anchor="'+anchor+'">'+esc(c.n)+'</text>':'')+
        '</g>';
    });
    svg.innerHTML=h;
  }
  function drawDetail(){
    var c=CL[sel], t=tp(c.t);
    detail.innerHTML='<span class="label">Cluster '+(sel+1)+' of '+CL.length+'</span>'+
      '<h3>'+esc(c.n)+'</h3>'+
      '<span class="badge"><i style="background:'+t.color+'"></i>'+t.name+' · '+esc(c.p)+'</span>'+
      '<div class="tags">'+c.tags.map(function(x){return '<span>'+esc(x)+'</span>';}).join('')+'</div>'+
      '<p>'+esc(c.know)+'</p>'+
      '<p class="dtip"><b>Tip:</b> '+esc(c.tip)+'</p>'+
      '<p class="fine">Based on general public knowledge. Not a list of vetted factories.</p>';
  }
  function render(){drawChips();drawMap();drawDetail();}
  if(chips) chips.addEventListener('click',function(e){
    var b=e.target.closest('.chip'); if(!b) return;
    filter=b.getAttribute('data-f');
    if(filter!=='all'&&CL[sel].t!==filter){
      for(var i=0;i<CL.length;i++){if(CL[i].t===filter){sel=i;break;}}
    }
    render();
  });
  function pick(g){var i=+g.getAttribute('data-i'); if(CL[i]&&(filter==='all'||filter===CL[i].t)){sel=i;render();}}
  if(svg) svg.addEventListener('click',function(e){var g=e.target.closest('.mk'); if(g) pick(g);});
  if(svg) svg.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){var g=e.target.closest('.mk'); if(g){e.preventDefault();pick(g);var again=svg.querySelector('.mk[data-i="'+sel+'"]'); if(again) again.focus();}}
  });
  if(svg) render();

  /* ---------- likes, saves, share, comments, sign-up ---------- */
  var BASE=location.href.split('#')[0];
  /* Paste your form or newsletter endpoint here (see README). Empty = sign-ups show a 'coming soon' note. */
  var SIGNUP_ENDPOINT='';
  var ARTS={ideas:'10 ideas to kick off your tiny business today',test:'3 ways to test an idea for under $50',map:'The factory map'};
  var S={db:null,uid:null,canWrite:false,comments:null,likeCount:{},mine:{},saved:{},signup:null,busy:{}};
  function lsGet(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}}
  function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  S.signup=lsGet('sqc_signup'); S.mine=lsGet('sqc_mine')||{}; S.saved=lsGet('sqc_saved')||{};
  var toastEl=document.getElementById('toast'), toastT;
  function toast(m){toastEl.textContent=m;toastEl.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){toastEl.hidden=true;},3800);}

  function renderActions(){
    [].forEach.call(document.querySelectorAll('.actions[data-a]'),function(box){
      var a=box.getAttribute('data-a'), n=S.likeCount[a]||0, liked=!!S.mine[a], saved=!!S.saved[a];
      box.innerHTML=
        '<button class="btn" type="button" data-act="like" data-a="'+a+'" aria-pressed="'+liked+'">'+(liked?'♥ Liked':'♡ Like')+(n?' · '+n:'')+'</button>'+
        '<button class="btn" type="button" data-act="save" data-a="'+a+'" aria-pressed="'+saved+'">'+(saved?'Saved ✓':'Save')+'</button>'+
        '<button class="btn" type="button" data-act="share" data-a="'+a+'">Share</button>'+
        (S.comments?'<button class="btn" type="button" data-act="comment" data-a="'+a+'">Comment</button>':'')+
        (S.db&&S.canWrite?'':'<span class="note-s">Likes and saves stay on this device.</span>');
    });
    var sb=document.getElementById('savedBox');
    if(sb){
      var ks=Object.keys(ARTS).filter(function(k){return S.saved[k];});
      sb.hidden=!ks.length;
      sb.innerHTML=ks.length?'<span class="label">Your saved guides</span><p style="margin-top:6px">'+ks.map(function(k){return '<a href="'+(k==='home'?'/':'/'+k+'/')+'">'+esc(ARTS[k])+'</a>';}).join(' · ')+'</p>':'';
    }
  }
  function signupInner(inDlg){
    var s=S.signup;
    if(s){
      return (inDlg?'':'<h3>You are in ✓</h3>')+'<p>Account: <b>'+esc(s.email)+'</b><br>Newsletter: <b>'+(s.newsletter?'on':'off')+'</b></p>'+
        (S.db?'<button class="btn" type="button" data-act="news">'+(s.newsletter?'Turn newsletter off':'Turn newsletter on')+'</button>':'')+'<div class="smsg" role="status"></div>';
    }
    return (inDlg?'':'<h3>Get the free newsletter</h3><p>New guides and tiny tests, plus a free account to like, save and comment.</p>')+
      '<form class="sform" novalidate><input type="text" name="name" placeholder="First name (optional)" autocomplete="given-name" aria-label="First name">'+
      '<input type="email" name="email" required placeholder="you@email.com" autocomplete="email" aria-label="Email address">'+
      '<label class="chk"><input type="checkbox" name="news" checked> <span>Send me the free newsletter</span></label>'+
      '<button class="btn" type="submit">Create free account</button></form><div class="smsg" role="status"></div>';
  }
  function renderSignup(){
    [].forEach.call(document.querySelectorAll('.signup-slot'),function(slot){
      var d=slot.hasAttribute('data-dialog');
      slot.innerHTML=d?signupInner(true):'<div class="signup">'+signupInner(false)+'</div>';
    });
    document.getElementById('joinBtn').textContent=S.signup?'Account ✓':'Join free';
  }
  function msg(el,t){var m=el&&el.querySelector?el.querySelector('.smsg'):null; if(m) m.textContent=t; else toast(t);}

  async function writeDoc(path,data,merge){
    var r=S.db.doc(path);
    try{ if(merge) await r.update(data); else await r.set(data); return true; }
    catch(e){ if(e&&e.code==='unavailable'){ await new Promise(function(r2){setTimeout(r2,600);}); try{ if(merge) await r.update(data); else await r.set(data); return true;}catch(e2){} } return false; }
  }
  async function toggleLike(a){
    if(S.busy.like) return; S.busy.like=1;
    var next=Object.assign({},S.mine); if(next[a]) delete next[a]; else next[a]=true;
    var ok=false;
    if(S.db&&S.canWrite){ ok=await writeDoc('likes/'+S.uid,{a:next,t:Date.now()},false); if(!ok) toast('Could not save your like. Kept on this device.'); }
    S.mine=next; lsSet('sqc_mine',next); S.busy.like=0; renderActions();
  }
  async function toggleSave(a){
    if(S.busy.save) return; S.busy.save=1;
    var next=Object.assign({},S.saved); if(next[a]) delete next[a]; else next[a]=true;
    if(S.db&&S.canWrite&&S.uid){ var ok=await writeDoc('data/users/'+S.uid+'/prefs',{saved:next},false); if(!ok) toast('Could not sync your save. Kept on this device.'); }
    S.saved=next; lsSet('sqc_saved',next); S.busy.save=0; renderActions();
  }
  function copyText(t){
    function fb(){var ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand('copy');}catch(e){}document.body.removeChild(ta);return ok;}
    if(navigator.clipboard&&navigator.clipboard.writeText){return navigator.clipboard.writeText(t).then(function(){return true;},function(){return fb();});}
    return Promise.resolve(fb());
  }
  function share(a){
    var data={title:ARTS[a]+' | Side Quest Club',text:ARTS[a],url:BASE};
    if(navigator.share){navigator.share(data).catch(function(){});return;}
    copyText(BASE).then(function(ok){toast(ok?'Link copied. Only people you share the page with can open it.':'Copy this link: '+BASE);});
  }
  function comment(a){
    if(!S.comments) return;
    var el=document.querySelector('[data-view="'+a+'"] article')||document.querySelector('[data-view="'+a+'"]');
    S.comments.openComposer({element:el}).then(function(r){ if(!r.opened) toast('Click on the page and try again.'); },function(){ toast('Comments are off for your account here.'); });
  }
  async function setNews(){
    if(!S.signup||!S.db||!S.canWrite) return;
    var v=!S.signup.newsletter;
    var ok=await writeDoc('signups/'+S.uid,{newsletter:v},true);
    if(!ok) toast('Could not update. Try again.');
  }
  async function submitSignup(form){
    var email=(form.elements.email.value||'').trim(), name=(form.elements.name.value||'').trim().slice(0,60);
    var holder=form.parentNode;
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){msg(holder,'Please enter a valid email.');return;}
    if(SIGNUP_ENDPOINT){
      var b0=form.querySelector('button[type=submit]'); b0.disabled=true;
      try{
        var rec={email:email.slice(0,120),name:name,newsletter:!!form.elements.news.checked,source:cur};
        var res=await fetch(SIGNUP_ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(rec)});
        if(!res.ok) throw new Error('bad');
        S.signup=rec; lsSet('sqc_signup',rec); renderSignup(); toast('Welcome to the club.');
      }catch(err){ msg(holder,'Could not sign you up. Please try again.'); }
      b0.disabled=false; return;
    }
    if(!S.db||!S.uid||!S.canWrite){msg(holder,'Sign-ups are opening soon. Please check back shortly.');return;}
    var btn=form.querySelector('button[type=submit]'); btn.disabled=true;
    var v=cur;
    var ok=await writeDoc('signups/'+S.uid,{email:email.slice(0,120),name:name,newsletter:!!form.elements.news.checked,createdAt:new Date().toISOString(),source:v},false);
    btn.disabled=false;
    if(!ok){msg(holder,'Could not save. Please try again.');return;}
    toast('Welcome to the club.');
  }

  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-act]'); if(!b) return;
    var act=b.getAttribute('data-act'), a=b.getAttribute('data-a');
    if(act==='like') toggleLike(a); else if(act==='save') toggleSave(a); else if(act==='share') share(a); else if(act==='comment') comment(a); else if(act==='news') setNews();
  });
  document.addEventListener('submit',function(e){ if(e.target.classList.contains('sform')){ e.preventDefault(); submitSignup(e.target); } });
  var dlg=document.getElementById('joinDlg');
  document.getElementById('joinBtn').addEventListener('click',function(){ if(dlg.showModal) dlg.showModal(); else dlg.setAttribute('open',''); });
  document.getElementById('joinX').addEventListener('click',function(){ dlg.close(); });
  dlg.addEventListener('click',function(e){ if(e.target===dlg) dlg.close(); });

  /* slots and saved box */
  [].forEach.call(document.querySelectorAll('[data-view]'),function(v){ var d=document.createElement('div'); d.className='signup-slot'; v.appendChild(d); });
  var firstBlock=document.querySelector('[data-view="home"] .block');
  if(firstBlock){ var sb=document.createElement('div'); sb.id='savedBox'; sb.hidden=true; sb.style.marginBottom='18px'; firstBlock.insertBefore(sb,firstBlock.firstChild); }
  renderActions(); renderSignup();

  /* capabilities light up later; the page works without them */
  (async function(){
    try{
      if(!(window.claude&&claude.use)) return;
      var user=await claude.use('user');
      if(user){ try{ S.uid=await user.id(); }catch(e){} try{ var cw=await user.can('data.write'); S.canWrite=cw!==false; }catch(e){ S.canWrite=true; } }
      S.comments=await claude.use('comments');
      S.db=await claude.use('db');
      renderActions();
      if(S.db&&S.uid){
        S.db.collection('likes').onSnapshot(function(snap){
          var c={}, mine=null;
          snap.docs.forEach(function(d){ var a=(d.data()||{}).a||{}; Object.keys(a).forEach(function(k){ if(a[k]) c[k]=(c[k]||0)+1; }); if(d.id===S.uid) mine=a; });
          S.likeCount=c; if(mine) S.mine=mine; renderActions();
        },function(){});
        S.db.doc('data/users/'+S.uid+'/prefs').onSnapshot(function(s){ if(s.exists){ S.saved=(s.data()||{}).saved||{}; renderActions(); } },function(){});
        S.db.doc('signups/'+S.uid).onSnapshot(function(s){
          var n=s.exists?s.data():null;
          if(JSON.stringify(n)!==JSON.stringify(S.signup)){ S.signup=n; renderSignup(); }
        },function(){});
      }
    }catch(e){}
  })();
})();