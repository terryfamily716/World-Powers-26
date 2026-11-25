(function(){
  var v = document.querySelector(".version");
  if (v) v.textContent = "11.24.26 V0.09";

  var controls = document.querySelector(".controls");
  if (controls && !document.getElementById("lb-btn")) {
    var b = document.createElement("button");
    b.id = "lb-btn";
    b.className = "blue";
    b.textContent = "Leaders";
    b.onclick = function(){ if (window.lbToggle) lbToggle(); };
    controls.appendChild(b);
  }

  if (!document.querySelector("script[src=\"leaderboard.js\"]")) {
    var s = document.createElement("script");
    s.src = "leaderboard.js";
    document.body.appendChild(s);
  }

  if (typeof money !== "undefined") money = 50000;

  var _showStats = window.showStats;
  window.showStats = function(id) {
    _showStats(id);
    var card = document.getElementById("stats-card");
    var nameDiv = card.querySelector(".stat-name");
    if (nameDiv && !nameDiv.querySelector(".close-x")) {
      var x = document.createElement("button");
      x.className = "close-x";
      x.innerHTML = "&times;";
      x.style.cssText = "float:right;background:none;border:none;color:#ef4444;font-size:18px;cursor:pointer;padding:0 4px";
      x.onclick = function(){ card.className="stats-card"; selectedTarget=null; };
      nameDiv.appendChild(x);
    }
  };
})();