(function(){
  var P=window.SQC_POSTS, EP=P.endpoint, $=function(id){return document.getElementById(id);};
  var token='', posts=[], editing=null;
  try{ token=sessionStorage.getItem('sqc_admin')||''; }catch(e){}
  function call(action,payload){
    var body=Object.assign({action:action,token:token},payload||{});
    return fetch(EP,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)}).then(function(r){return r.json();});
  }
  function setMsg(el,t,bad){ el.textContent=t; el.style.color=bad?'#c0210a':'#111'; }
  function today(){ var d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function slugify(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60); }

  function showApp(){ $('lock').hidden=true; $('app').hidden=false; loadList(); }
  function loadList(){
    call('admin_list').then(function(j){
      if(!j.ok){ if(j.error==='unauthorized'){ lock('Wrong password.'); } else setMsg($('msg'),'Could not load articles.',true); return; }
      posts=j.articles||[]; renderList();
    }).catch(function(){ setMsg($('lockmsg'),'Could not reach the server.',true); });
  }
  function renderList(){
    var tb=$('plist').querySelector('tbody');
    if(!posts.length){ tb.innerHTML='<tr><td>No articles yet. Click "New article".</td></tr>'; return; }
    tb.innerHTML=posts.map(function(a,i){
      return '<tr><td><b>'+P.esc(a.title)+'</b><br><span class="hint">'+P.esc(a.date)+' · /post/?s='+P.esc(a.slug)+'</span></td>'+
        '<td><span class="pill '+(a.status==='published'?'pub':'')+'">'+(a.status==='published'?'LIVE':'DRAFT')+'</span></td>'+
        '<td style="text-align:right"><button class="btn" data-edit="'+i+'" type="button">Edit</button> '+(a.status==='published'?'<a class="btn" href="/post/?s='+encodeURIComponent(a.slug)+'" target="_blank" rel="noopener" style="text-decoration:none">View</a>':'')+'</td></tr>';
    }).join('');
  }
  function lock(msg){ token=''; try{sessionStorage.removeItem('sqc_admin');}catch(e){} $('app').hidden=true; $('lock').hidden=false; $('pw').value=''; setMsg($('lockmsg'),msg||'',!!msg); }
  function preview(){ $('prev').innerHTML='<h1>'+P.esc($('title').value||'Title')+'</h1>'+($('summary').value?'<p class="intro">'+P.esc($('summary').value)+'</p>':'')+P.md($('body').value); }
  function openEditor(a){
    editing=a?a.slug:null;
    $('edTitle').textContent=a?'Edit article':'New article';
    $('title').value=a?a.title:''; $('summary').value=a?a.summary:''; $('body').value=a?a.body:'';
    $('date').value=a?a.date:today(); $('slug').value=a?a.slug:'';
    var kind=(a&&a.label?a.label.split(' · ')[0]:'Essay'); $('kind').value=['Essay','Guide','News','Note'].indexOf(kind)>-1?kind:'Essay';
    $('del').hidden=!a; setMsg($('msg'),''); $('editor').hidden=false; preview();
    $('editor').scrollIntoView({behavior:'smooth'});
  }
  function save(status){
    var title=$('title').value.trim(), body=$('body').value;
    if(!title){ setMsg($('msg'),'Add a title first.',true); return; }
    if(!body.trim()){ setMsg($('msg'),'The article text is empty.',true); return; }
    var slug=slugify($('slug').value||title)||('post-'+Date.now().toString(36));
    var payload={title:title,summary:$('summary').value.trim(),body:body,slug:slug,originalSlug:editing||'',date:$('date').value,status:status,label:$('kind').value+' · '+P.readMin(body)+' min'};
    setMsg($('msg'),'Saving…');
    call('admin_save',payload).then(function(j){
      if(!j.ok){ setMsg($('msg'),j.error==='slug_taken'?'That web address is already used. Change the ending.':(j.error==='unauthorized'?'Session expired. Unlock again.':'Could not save ('+(j.error||'error')+').'),true); if(j.error==='unauthorized') lock('Session expired.'); return; }
      editing=j.slug; $('slug').value=j.slug; $('del').hidden=false;
      setMsg($('msg'),status==='published'?'Published. It is live now.':'Saved as draft. Only you can see it.');
      loadList();
    }).catch(function(){ setMsg($('msg'),'Could not reach the server.',true); });
  }

  $('unlock').addEventListener('click',function(){
    token=$('pw').value; if(!token) return; setMsg($('lockmsg'),'Checking…');
    call('admin_list').then(function(j){
      if(!j.ok){ lock(j.error==='unauthorized'?'Wrong password.':'Something went wrong.'); return; }
      try{ sessionStorage.setItem('sqc_admin',token); }catch(e){}
      posts=j.articles||[]; showApp(); renderList();
    }).catch(function(){ setMsg($('lockmsg'),'Could not reach the server.',true); });
  });
  $('pw').addEventListener('keydown',function(e){ if(e.key==='Enter') $('unlock').click(); });
  $('lockBtn').addEventListener('click',function(){ lock(''); $('editor').hidden=true; });
  $('newBtn').addEventListener('click',function(){ openEditor(null); });
  $('plist').addEventListener('click',function(e){ var b=e.target.closest('[data-edit]'); if(b) openEditor(posts[+b.getAttribute('data-edit')]); });
  ['title','summary','body'].forEach(function(id){ $(id).addEventListener('input',preview); });
  $('pub').addEventListener('click',function(){ save('published'); });
  $('draft').addEventListener('click',function(){ save('draft'); });
  $('cancel').addEventListener('click',function(){ $('editor').hidden=true; });
  $('del').addEventListener('click',function(){
    if(!editing||!confirm('Delete this article for good?')) return;
    call('admin_delete',{slug:editing}).then(function(j){
      if(j.ok){ $('editor').hidden=true; editing=null; loadList(); } else setMsg($('msg'),'Could not delete.',true);
    });
  });
  $('file').addEventListener('change',function(){
    var f=this.files&&this.files[0]; if(!f) return;
    var r=new FileReader(); r.onload=function(){
      var t=String(r.result||'').replace(/\r/g,'').replace(/^﻿/,''), lines=t.split('\n'), i=0;
      while(i<lines.length&&!lines[i].trim()) i++;
      if(i<lines.length&&!$('title').value.trim()){ $('title').value=lines[i].replace(/^#+\s*/,'').trim(); lines.splice(0,i+1); }
      $('body').value=lines.join('\n').trim(); preview();
    }; r.readAsText(f); this.value='';
  });
  if(token) showApp();
})();
