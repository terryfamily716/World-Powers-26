var LB_ENDPOINT="https://sfo.cloud.appwrite.io/v1";
var LB_PROJECT="6b02c0310015eb4d8908";
var LB_KEY="PLACEHOLDER_FLEETDVIRFULL_KEY";
var LB_DB="main";
var LB_COLLECTION="leaderboard";
var lbLimit=50;
var lbCache=[];

function lbHeaders(){
  return {"Content-Type":"application/json","X-Appwrite-Project":LB_PROJECT,"X-Appwrite-Key":LB_KEY};
}

function lbCreatePanel(){
  var panel=document.createElement("div");
  panel.id="lb-panel";
  panel.style.cssText="position:absolute;top:70px;right:12px;width:280px;max-height:70vh;background:#0f1419;border:1px solid #3b82f6;border-radius:10px;z-index:1000;display:none;flex-direction:column;font-family:sans-serif;color:#e0e0e0;box-shadow:0 4px 20px rgba(0,0,0,0.6);";
  var header=document.createElement("div");
  header.style.cssText="padding:10px 12px;border-bottom:1px solid #1a1f2e;display:flex;justify-content:space-between;align-items:center;";
  var title=document.createElement("span");
  title.textContent="World Power Leaders";
  title.style.cssText="font-weight:bold;font-size:15px;color:#60a5fa;";
  var closeBtn=document.createElement("button");
  closeBtn.textContent="\u00d7";
  closeBtn.style.cssText="background:none;border:none;color:#ef4444;font-size:20px;cursor:pointer;padding:0 4px;";
  closeBtn.onclick=function(){panel.style.display="none";};
  header.appendChild(title);header.appendChild(closeBtn);
  var controls=document.createElement("div");
  controls.style.cssText="padding:8px 12px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #1a1f2e;";
  var toggle=document.createElement("button");
  toggle.textContent="Top 50";
  toggle.style.cssText="background:#1a1f2e;border:1px solid #3b82f6;color:#60a5fa;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;";
  toggle.onclick=function(){
    lbLimit=lbLimit===50?25:50;
    toggle.textContent="Top "+lbLimit;
    lbRender(lbCache);
  };
  var refresh=document.createElement("button");
  refresh.textContent="Refresh";
  refresh.style.cssText="background:#1a1f2e;border:1px solid #3b82f6;color:#60a5fa;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;";
  refresh.onclick=function(){lbFetch();};
  controls.appendChild(toggle);controls.appendChild(refresh);
  var list=document.createElement("div");
  list.id="lb-list";
  list.style.cssText="overflow-y:auto;flex:1;padding:6px 0;";
  var postRow=document.createElement("div");
  postRow.style.cssText="padding:8px 12px;border-top:1px solid #1a1f2e;display:flex;gap:6px;";
  var nameInput=document.createElement("input");
  nameInput.placeholder="Your name";
  nameInput.style.cssText="flex:1;background:#1a1f2e;border:1px solid #3b82f6;color:#e0e0e0;border-radius:6px;padding:4px 8px;font-size:12px;";
  var postBtn=document.createElement("button");
  postBtn.textContent="Post Score";
  postBtn.style.cssText="background:#3b82f6;border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;";
  postBtn.onclick=function(){lbPost(nameInput.value);};
  postRow.appendChild(nameInput);postRow.appendChild(postBtn);
  panel.appendChild(header);panel.appendChild(controls);panel.appendChild(list);panel.appendChild(postRow);
  document.body.appendChild(panel);
  return panel;
}

function lbToggle(){
  var panel=document.getElementById("lb-panel")||lbCreatePanel();
  panel.style.display=panel.style.display==="none"?"flex":"none";
  if(panel.style.display==="flex"){lbFetch();}
}

function lbFetch(){
  var url=LB_ENDPOINT+"/databases/"+LB_DB+"/collections/"+LB_COLLECTION+"/documents?queries[]=orderDesc(\"money\")&queries[]=limit("+lbLimit+")";
  fetch(url,{headers:lbHeaders()}).then(function(r){return r.json();}).then(function(data){
    lbCache=data.documents||[];
    lbRender(lbCache);
  }).catch(function(e){console.log("LB fetch error",e);});
}

function lbRender(docs){
  var list=document.getElementById("lb-list");
  if(!list)return;
  list.innerHTML="";
  if(!docs.length){
    var empty=document.createElement("div");
    empty.textContent="No scores yet. Be the first.";
    empty.style.cssText="padding:12px;text-align:center;color:#888;font-size:13px;";
    list.appendChild(empty);
    return;
  }
  docs.forEach(function(d,i){
    var row=document.createElement("div");
    row.style.cssText="padding:6px 12px;display:flex;justify-content:space-between;font-size:13px;border-bottom:1px solid #1a1f2e;";
    var left=document.createElement("span");
    left.textContent=(i+1)+". "+(d.name||"Anonymous");
    var right=document.createElement("span");
    right.textContent="$"+Number(d.money||0).toLocaleString()+"B";
    right.style.color="#60a5fa";
    row.appendChild(left);row.appendChild(right);
    list.appendChild(row);
  });
}

function lbPost(name){
  if(!name||!name.trim()){alert("Enter a name first");return;}
  var money=typeof game!=="undefined"&&game.money?game.money:0;
  var body=JSON.stringify({documentId:"unique()",data:{name:name.trim(),money:money,createdAt:new Date().toISOString()}});
  fetch(LB_ENDPOINT+"/databases/"+LB_DB+"/collections/"+LB_COLLECTION+"/documents",{method:"POST",headers:lbHeaders(),body:body}).then(function(r){return r.json();}).then(function(){lbFetch();}).catch(function(e){console.log("LB post error",e);});
}

window.lbToggle=lbToggle;
window.lbPost=lbPost;