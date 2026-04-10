/* ════════════════════════════════════════
   CORE UI SCRIPTS
════════════════════════════════════════ */

// Typed.js
var typed = new Typed('.text', {
  strings: ['Frontend Developer','Web Developer','Full Stack Developer','UI/UX Enthusiast'],
  typeSpeed: 75, backSpeed: 50, backDelay: 1500, loop: true
});

// Hamburger
var hamburger = document.getElementById('hamburger');
var navbar    = document.getElementById('navbar');
hamburger.addEventListener('click', function () {
  hamburger.classList.toggle('open'); navbar.classList.toggle('open');
});
navbar.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    hamburger.classList.remove('open'); navbar.classList.remove('open');
  });
});

// Scroll Reveal
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

// Progress Bars
var barsAnimated = false;
var skillsObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting && !barsAnimated) {
      barsAnimated = true;
      document.querySelectorAll('.progress-fill').forEach(function (bar) {
        setTimeout(function () { bar.style.width = bar.style.getPropertyValue('--w'); }, 200);
      });
    }
  });
}, { threshold: 0.2 });
var skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);

// Active Nav + Header + Top Btn
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.navbar a');
var header   = document.getElementById('header');
var topBtn   = document.getElementById('topBtn');
window.addEventListener('scroll', function () {
  var scrollY = window.pageYOffset;
  if (scrollY > 20) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  sections.forEach(function (section) {
    var top = section.offsetTop - 130, height = section.offsetHeight, id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) link.classList.add('active');
      });
    }
  });
  if (topBtn) { if (scrollY > 400) topBtn.classList.add('visible'); else topBtn.classList.remove('visible'); }
});

// Contact Form
function handleSubmit(event) {
  event.preventDefault(); // stops page from reloading

  const name    = document.getElementById('name').value;
  const email   = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  const text = `👋 Hello Lokesh!\n\n*Name:* ${name}\n*Email:* ${email}\n*Subject:* ${subject}\n\n*Message:*\n${message}`;

  const url = `https://wa.me/919345894255?text=${encodeURIComponent(text)}`;

  window.open(url, '_blank');
   window.location.href = url;
}

/* ════════════════════════════════════════
   3D LAPTOP / DEV UNIVERSE  (Three.js)
   Skills orbit a glowing laptop model
════════════════════════════════════════ */
window.addEventListener('load', function () {
  if (typeof THREE === 'undefined') { console.warn('Three.js not loaded'); return; }

  var canvas    = document.getElementById('skills-canvas');
  var container = canvas ? canvas.parentElement : null;
  if (!canvas || !container) return;

  var W = container.clientWidth;
  var H = container.clientHeight;

  /* ── RENDERER ── */
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x030014);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  /* ── SCENE ── */
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030014, 0.016);

  /* ── CAMERA ── */
  var camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 300);
  var TARGET = new THREE.Vector3(0, 0.4, 0);
  var camTheta = 0.18, camPhi = 0.34, camR = 13.5;
  var autoSpin = true;

  function applyCamera() {
    camera.position.set(
      camR * Math.sin(camTheta) * Math.cos(camPhi),
      camR * Math.sin(camPhi),
      camR * Math.cos(camTheta) * Math.cos(camPhi)
    );
    camera.lookAt(TARGET);
  }
  applyCamera();

  /* ── CAMERA DRAG ── */
  var dragging = false, px = 0, py = 0;
  canvas.addEventListener('mousedown', function (e) { dragging = true; autoSpin = false; px = e.clientX; py = e.clientY; });
  window.addEventListener('mouseup',   function () { dragging = false; });
  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    camTheta -= (e.clientX - px) * 0.007;
    camPhi   -= (e.clientY - py) * 0.004;
    camPhi    = Math.max(0.08, Math.min(1.1, camPhi));
    px = e.clientX; py = e.clientY;
    applyCamera();
  });
  canvas.addEventListener('touchstart', function (e) { dragging = true; autoSpin = false; px = e.touches[0].clientX; py = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend',   function () { dragging = false; });
  window.addEventListener('touchmove',  function (e) {
    if (!dragging) return;
    camTheta -= (e.touches[0].clientX - px) * 0.007;
    camPhi   -= (e.touches[0].clientY - py) * 0.004;
    camPhi    = Math.max(0.08, Math.min(1.1, camPhi));
    px = e.touches[0].clientX; py = e.touches[0].clientY;
    applyCamera();
  }, { passive: false });
  canvas.addEventListener('wheel', function (e) {
    camR = Math.max(6, Math.min(22, camR + e.deltaY * 0.012));
    applyCamera();
  }, { passive: true });
  canvas.addEventListener('dblclick', function () {
    camTheta = 0.18; camPhi = 0.34; camR = 13.5; autoSpin = true; applyCamera();
  });

  /* ── RESIZE ── */
  var resizeObs = new ResizeObserver(function () {
    W = container.clientWidth; H = container.clientHeight;
    renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
  });
  resizeObs.observe(container);

  /* ── LIGHTS ── */
  scene.add(new THREE.AmbientLight(0x060320, 1.4));
  var keyLight = new THREE.DirectionalLight(0x6ec6ff, 2.2);
  keyLight.position.set(5, 12, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1; keyLight.shadow.camera.far = 30;
  keyLight.shadow.camera.left = keyLight.shadow.camera.bottom = -8;
  keyLight.shadow.camera.right = keyLight.shadow.camera.top = 8;
  scene.add(keyLight);

  var screenPL = new THREE.PointLight(0x4cc9f0, 10, 12);
  screenPL.position.set(0, 0.9, 1.2);
  scene.add(screenPL);

  var rimPL = new THREE.PointLight(0xf72585, 3.5, 18);
  rimPL.position.set(-5, -1, 2);
  scene.add(rimPL);

  var topPL = new THREE.PointLight(0x7c3aed, 2.5, 20);
  topPL.position.set(0, 8, -3);
  scene.add(topPL);

  /* ── FLOOR ── */
  var FLOOR_Y = -1.3;
  var floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: 0x010009, metalness: 0.9, roughness: 0.35 })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = FLOOR_Y;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  var grid = new THREE.GridHelper(60, 60, 0x1a054a, 0x0a0222);
  grid.position.y = FLOOR_Y + 0.002;
  scene.add(grid);

  function addFloorGlow(color, r, op) {
    var m = new THREE.Mesh(
      new THREE.CircleGeometry(r, 64),
      new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = FLOOR_Y + 0.003;
    scene.add(m);
    return m;
  }
  var fglow1 = addFloorGlow(0x7c3aed, 5, 0.10);
  var fglow2 = addFloorGlow(0x4cc9f0, 2.5, 0.08);

  /* ── LAPTOP MODEL ── */
  var laptopGroup = new THREE.Group();
  laptopGroup.position.y = FLOOR_Y;
  scene.add(laptopGroup);

  var metalDark = new THREE.MeshStandardMaterial({ color: 0x0c1018, metalness: 0.95, roughness: 0.12 });
  var metalMid  = new THREE.MeshStandardMaterial({ color: 0x141c26, metalness: 0.85, roughness: 0.25 });
  var rubber    = new THREE.MeshStandardMaterial({ color: 0x080c0f, metalness: 0.1,  roughness: 0.95 });

  function addMesh(geo, mat, px2, py2, pz2, parent) {
    var m = new THREE.Mesh(geo, mat);
    m.position.set(px2, py2, pz2);
    m.castShadow = true; m.receiveShadow = true;
    (parent || laptopGroup).add(m);
    return m;
  }

  // Base
  addMesh(new THREE.BoxGeometry(4.1, 0.22, 2.75), metalDark, 0, 0.11, 0);
  addMesh(new THREE.BoxGeometry(3.55, 0.01, 2.15), metalMid, 0, 0.225, 0.06);
  addMesh(new THREE.BoxGeometry(1.05, 0.008, 0.65), metalMid, 0, 0.226, 0.88);
  [[-1.8,-1.25],[1.8,-1.25],[-1.8,1.2],[1.8,1.2]].forEach(function(p) {
    addMesh(new THREE.CylinderGeometry(0.085,0.085,0.04,10), rubber, p[0], 0.02, p[1]);
  });

  // Hinges
  var hingeMat = new THREE.MeshStandardMaterial({ color: 0x1e2535, metalness: 0.9, roughness: 0.2 });
  [-1.5, 1.5].forEach(function (x) {
    var h = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.32, 16), hingeMat);
    h.rotation.z = Math.PI / 2;
    h.position.set(x, 0.22, -1.375);
    h.castShadow = true;
    laptopGroup.add(h);
  });

  // Screen assembly
  var screenGroup = new THREE.Group();
  screenGroup.position.set(0, 0.22, -1.375);
  screenGroup.rotation.x = -0.22;
  laptopGroup.add(screenGroup);

  addMesh(new THREE.BoxGeometry(3.95, 2.58, 0.11), metalDark, 0, 1.29, 0, screenGroup);
  addMesh(new THREE.BoxGeometry(3.72, 2.38, 0.02), new THREE.MeshStandardMaterial({ color: 0x080c10, metalness: 0.5, roughness: 0.7 }), 0, 1.29, 0.065, screenGroup);

  // Screen canvas
  var SCW = 640, SCH = 400;
  var screenCanvas2 = document.createElement('canvas');
  screenCanvas2.width = SCW; screenCanvas2.height = SCH;
  var sctx = screenCanvas2.getContext('2d');
  var screenTex = new THREE.CanvasTexture(screenCanvas2);
  screenTex.minFilter = THREE.LinearFilter;

  var screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.38, 2.1),
    new THREE.MeshBasicMaterial({ map: screenTex })
  );
  screenMesh.position.set(0, 1.29, 0.077);
  screenGroup.add(screenMesh);

  var sglowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 2.25),
    new THREE.MeshBasicMaterial({ color: 0x4cc9f0, transparent: true, opacity: 0.055, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  );
  sglowMesh.position.set(0, 1.29, 0.09);
  screenGroup.add(sglowMesh);

  var sLight = new THREE.PointLight(0x4cc9f0, 6, 7);
  sLight.position.set(0, 1.3, 0.5);
  screenGroup.add(sLight);

  // Logo on lid back
  var logoC = document.createElement('canvas'); logoC.width = 128; logoC.height = 128;
  var logoCx = logoC.getContext('2d');
  logoCx.font = 'bold 72px Syne, sans-serif';
  logoCx.textAlign = 'center'; logoCx.textBaseline = 'middle';
  logoCx.fillStyle = 'rgba(255,255,255,0.12)';
  logoCx.fillText('LP', 64, 64);
  var logoMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(logoC), transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  logoMesh.position.set(0, 1.29, -0.058);
  logoMesh.rotation.y = Math.PI;
  screenGroup.add(logoMesh);

  /* ── SCREEN CONTENT ── */
  var CODE_LINES = [
    {t:'// Lokesh P — Full Stack Developer',    c:'#546e7a'},
    {t:'',c:''},
    {t:'import React, { useState, useEffect }', c:'#c792ea'},
    {t:'  from "react";',                       c:'#c792ea'},
    {t:'import { ThreeScene } from "./scene";', c:'#c792ea'},
    {t:'',c:''},
    {t:'const Portfolio = () => {',             c:'#82aaff'},
    {t:'  const [skills] = useState([',         c:'#eeffff'},
    {t:"    'HTML5','CSS3','JS','React',",       c:'#c3e88d'},
    {t:"    'Java','MySQL'",                    c:'#c3e88d'},
    {t:'  ]);',                                  c:'#eeffff'},
    {t:'',c:''},
    {t:'  return (',                             c:'#82aaff'},
    {t:'    <ThreeScene',                        c:'#f07178'},
    {t:'      skills={skills}',                 c:'#c3e88d'},
    {t:'      orbit={true}',                    c:'#c3e88d'},
    {t:'      neon={["violet","cyan","pink"]}', c:'#c3e88d'},
    {t:'    />',                                 c:'#f07178'},
    {t:'  );',                                   c:'#eeffff'},
    {t:'};',                                     c:'#82aaff'},
    {t:'',c:''},
    {t:'// Java Backend',                        c:'#546e7a'},
    {t:'@RestController',                       c:'#c792ea'},
    {t:'@RequestMapping("/api")',               c:'#c792ea'},
    {t:'public class DevController {',         c:'#82aaff'},
    {t:'  @GetMapping("/skills")',              c:'#c792ea'},
    {t:'  public List<Skill> getSkills() {',   c:'#82aaff'},
    {t:'    return skillRepo.findAll();',       c:'#f78c6c'},
    {t:'  }',                                    c:'#82aaff'},
    {t:'}',                                      c:'#82aaff'},
    {t:'',c:''},
    {t:'/* MySQL */',                            c:'#546e7a'},
    {t:'SELECT s.name, s.level',               c:'#89ddff'},
    {t:'FROM skills s',                         c:'#89ddff'},
    {t:'WHERE s.active = 1',                   c:'#89ddff'},
    {t:'ORDER BY s.level DESC;',               c:'#89ddff'},
  ];

  function drawScreen(t) {
    var W2 = SCW, H2 = SCH, lh = 17;
    var scroll = (t * 22) % (CODE_LINES.length * lh);

    sctx.fillStyle = '#040d1a'; sctx.fillRect(0, 0, W2, H2);
    sctx.fillStyle = '#0b1527'; sctx.fillRect(0, 0, W2, 26);

    [['#ff5f57',14],['#febc2e',34],['#28c840',54]].forEach(function(b) {
      sctx.beginPath(); sctx.arc(b[1], 13, 5.5, 0, Math.PI*2);
      sctx.fillStyle = b[0]; sctx.fill();
    });

    sctx.fillStyle = '#060f22'; sctx.fillRect(72, 2, 120, 22);
    sctx.fillStyle = '#4cc9f0'; sctx.font = '10px JetBrains Mono, monospace';
    sctx.textAlign = 'left'; sctx.fillText('● Portfolio.jsx', 78, 16);

    sctx.fillStyle = '#1a2dcc'; sctx.fillRect(0, H2 - 18, W2, 18);
    sctx.fillStyle = 'rgba(255,255,255,0.9)'; sctx.font = '9px JetBrains Mono, monospace';
    sctx.fillText('  ⎇ main  ·  React  ·  UTF-8  ·  Ln ' + ((Math.floor(t*1.3)%CODE_LINES.length)+1), 0, H2 - 5);

    sctx.save();
    sctx.beginPath(); sctx.rect(0, 28, W2, H2 - 46); sctx.clip();
    for (var i = 0; i < CODE_LINES.length + 5; i++) {
      var y = 44 + i * lh - scroll;
      if (y < 26 || y > H2 - 18) continue;
      var idx = ((i % CODE_LINES.length) + CODE_LINES.length) % CODE_LINES.length;
      var line = CODE_LINES[idx];
      if (idx === Math.floor(t * 1.3) % CODE_LINES.length) {
        sctx.fillStyle = 'rgba(76,201,240,0.06)'; sctx.fillRect(0, y - lh + 3, W2, lh);
      }
      sctx.fillStyle = 'rgba(255,255,255,0.18)'; sctx.font = '9px JetBrains Mono, monospace';
      sctx.textAlign = 'right'; sctx.fillText((idx + 1).toString(), 28, y);
      if (line.t) {
        sctx.fillStyle = line.c || '#eeffff'; sctx.font = '10px JetBrains Mono, monospace';
        sctx.textAlign = 'left'; sctx.fillText(line.t, 38, y);
      }
    }
    var curRow = Math.floor(t * 1.3) % CODE_LINES.length;
    var curY   = 44 + curRow * lh - scroll;
    if (curY > 28 && curY < H2 - 20 && Math.floor(t * 2.2) % 2 === 0) {
      sctx.font = '10px JetBrains Mono, monospace';
      var tw = CODE_LINES[curRow].t ? sctx.measureText(CODE_LINES[curRow].t).width : 0;
      sctx.fillStyle = '#00e5ff'; sctx.fillRect(38 + tw, curY - lh + 4, 7, 13);
    }
    sctx.restore();

    sctx.fillStyle = 'rgba(0,0,0,0.055)';
    for (var y2 = 0; y2 < H2; y2 += 4) sctx.fillRect(0, y2, W2, 2);
    screenTex.needsUpdate = true;
  }

  /* ── TECH PANELS (orbiting holographic cards) ── */
  var TECHS = [
    { name:'HTML5',      short:'</>',  desc:'Markup Language',  pct:90, color:'#e44d26', hex:0xe44d26, orb:{ r:4.3, spd:0.42, tx:12,  tz:0,   phase:0              }},
    { name:'CSS3',       short:'{;}',  desc:'Styling & Layout', pct:75, color:'#1572b6', hex:0x1572b6, orb:{ r:4.6, spd:0.34, tx:-22, tz:14,  phase:Math.PI/3      }},
    { name:'JavaScript', short:'JS',   desc:'Dynamic Logic',    pct:85, color:'#f7df1e', hex:0xf7df1e, orb:{ r:4.1, spd:0.51, tx:28,  tz:-9,  phase:2*Math.PI/3    }},
    { name:'React',      short:'⚛',   desc:'UI Framework',     pct:75, color:'#61dafb', hex:0x61dafb, orb:{ r:4.5, spd:0.38, tx:-14, tz:20,  phase:Math.PI        }},
    { name:'Java Core',  short:'♨',   desc:'Backend & OOP',    pct:65, color:'#ff8c00', hex:0xff8c00, orb:{ r:4.8, spd:0.46, tx:34,  tz:6,   phase:4*Math.PI/3    }},
    { name:'Java Adv.',  short:'⚙',   desc:'Advanced Java',    pct:55, color:'#b44fdb', hex:0xb44fdb, orb:{ r:5.0, spd:0.36, tx:-28, tz:-12, phase:5*Math.PI/3    }},
    { name:'MySQL',      short:'⊗DB', desc:'Database & SQL',   pct:70, color:'#00b4d8', hex:0x00b4d8, orb:{ r:4.4, spd:0.29, tx:-30, tz:-16, phase:5*Math.PI/3+1  }},
  ];

  function buildPanelCanvas(tech) {
    var W2 = 200, H2 = 230;
    var c = document.createElement('canvas'); c.width = W2; c.height = H2;
    var cx = c.getContext('2d');
    cx.fillStyle = '#020610'; cx.fillRect(0, 0, W2, H2);
    var grad = cx.createRadialGradient(100,95,5,100,95,95);
    grad.addColorStop(0, tech.color + '28'); grad.addColorStop(1, 'transparent');
    cx.fillStyle = grad; cx.fillRect(0, 0, W2, H2);
    cx.fillStyle = 'rgba(0,0,0,0.18)';
    for (var y = 0; y < H2; y += 3) cx.fillRect(0, y, W2, 1);
    cx.shadowColor = tech.color; cx.shadowBlur = 14;
    cx.strokeStyle = tech.color + 'cc'; cx.lineWidth = 1.5; cx.strokeRect(4, 4, W2-8, H2-8);
    cx.shadowBlur = 0;
    cx.strokeStyle = tech.color + '40'; cx.lineWidth = 0.5; cx.strokeRect(7, 7, W2-14, H2-14);
    var cs = 12, cl = 2.5;
    cx.strokeStyle = tech.color; cx.lineWidth = cl;
    [[4,4,1,1],[W2-4,4,-1,1],[4,H2-4,1,-1],[W2-4,H2-4,-1,-1]].forEach(function(p) {
      cx.beginPath(); cx.moveTo(p[0]+p[2]*cs, p[1]); cx.lineTo(p[0],p[1]); cx.lineTo(p[0],p[1]+p[3]*cs); cx.stroke();
    });
    cx.shadowColor = tech.color; cx.shadowBlur = 25;
    cx.font = 'bold 44px JetBrains Mono, monospace'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillStyle = tech.color; cx.fillText(tech.short, W2/2, 78); cx.shadowBlur = 0;
    cx.strokeStyle = tech.color + '55'; cx.lineWidth = 1;
    cx.beginPath(); cx.moveTo(18, 118); cx.lineTo(W2-18, 118); cx.stroke();
    cx.fillStyle = '#ffffff'; cx.font = 'bold 14px Syne, sans-serif'; cx.textBaseline = 'alphabetic';
    cx.fillText(tech.name, W2/2, 142);
    cx.fillStyle = tech.color + 'bb'; cx.font = '10px JetBrains Mono, monospace';
    cx.fillText(tech.desc, W2/2, 160);
    var barX = 20, barY = 175, barW = W2-40, barH = 5;
    cx.fillStyle = 'rgba(255,255,255,0.08)'; cx.fillRect(barX, barY, barW, barH);
    cx.fillStyle = tech.color; cx.shadowColor = tech.color; cx.shadowBlur = 8;
    cx.fillRect(barX, barY, barW * (tech.pct / 100), barH); cx.shadowBlur = 0;
    cx.fillStyle = '#fff'; cx.font = 'bold 10px JetBrains Mono, monospace';
    cx.fillText(tech.pct + '%', W2/2, 194);
    cx.fillStyle = tech.color + '80';
    [30,70,100,130,170].forEach(function(x, i) {
      cx.beginPath(); cx.arc(x, 210, 2, 0, Math.PI*2); cx.fill();
      if (i < 4) {
        cx.strokeStyle = tech.color + '40'; cx.lineWidth = 0.8;
        cx.beginPath(); cx.moveTo(x+2, 210); cx.lineTo(x+38, 210); cx.stroke();
      }
    });
    return c;
  }

  var ORBIT_CENTER = new THREE.Vector3(0, 0.55, 0);
  var techObjs = [];

  TECHS.forEach(function (tech) {
    var tx = tech.orb.tx * Math.PI / 180;
    var tz = tech.orb.tz * Math.PI / 180;

    var ringGroup = new THREE.Group();
    ringGroup.rotation.x = tx; ringGroup.rotation.z = tz;
    ringGroup.position.copy(ORBIT_CENTER);
    scene.add(ringGroup);

    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(tech.orb.r, 0.013, 8, 140),
      new THREE.MeshBasicMaterial({ color: tech.hex, transparent: true, opacity: 0.20, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    ringGroup.add(ring);

    var trailGeo = new THREE.TorusGeometry(tech.orb.r, 0.022, 8, 48, Math.PI * 0.4);
    var trailMesh = new THREE.Mesh(trailGeo, new THREE.MeshBasicMaterial({ color: tech.hex, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }));
    ringGroup.add(trailMesh);

    var panelTex = new THREE.CanvasTexture(buildPanelCanvas(tech));
    panelTex.minFilter = THREE.LinearFilter;
    var panel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.88, 1.01),
      new THREE.MeshBasicMaterial({ map: panelTex, transparent: true, side: THREE.DoubleSide, alphaTest: 0.01 })
    );
    scene.add(panel);

    var halo = new THREE.Mesh(
      new THREE.PlaneGeometry(1.05, 1.2),
      new THREE.MeshBasicMaterial({ color: tech.hex, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
    );
    panel.add(halo); halo.position.z = -0.01;

    var panelRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.52, 0.015, 8, 60),
      new THREE.MeshBasicMaterial({ color: tech.hex, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    panel.add(panelRing);

    var pl = new THREE.PointLight(tech.hex, 2.0, 6);
    scene.add(pl);

    techObjs.push({ tech: tech, panel: panel, pl: pl, trailMesh: trailMesh, ringGroup: ringGroup,
      angle: tech.orb.phase, r: tech.orb.r, spd: tech.orb.spd, tx: tx, tz: tz });
  });

  /* ── BEAM LINES (laptop ↔ panels) ── */
  var beams = TECHS.map(function (tech) {
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    var ln = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: tech.hex, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(ln);
    return ln;
  });

  /* ── STAR FIELD ── */
  var STARS = 2400;
  var spos = new Float32Array(STARS * 3), scol = new Float32Array(STARS * 3);
  var pal = [[1,1,1],[0.49,0.2,0.93],[0.3,0.8,0.95],[0.97,0.14,0.52],[0.6,0.6,1]];
  for (var i = 0; i < STARS; i++) {
    var r = 55 + Math.random() * 55, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    spos[i*3] = r*Math.sin(ph)*Math.cos(th); spos[i*3+1] = r*Math.sin(ph)*Math.sin(th); spos[i*3+2] = r*Math.cos(ph);
    var cp = pal[Math.floor(Math.random() * pal.length)];
    scol[i*3] = cp[0]; scol[i*3+1] = cp[1]; scol[i*3+2] = cp[2];
  }
  var starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(spos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(scol, 3));
  var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.065, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(stars);

  /* ── AMBIENT PARTICLES ── */
  var AMB = 600;
  var ambPos = new Float32Array(AMB * 3), ambVel = new Float32Array(AMB * 3);
  for (var j = 0; j < AMB; j++) {
    ambPos[j*3] = (Math.random()-0.5)*16; ambPos[j*3+1] = (Math.random()-0.5)*10; ambPos[j*3+2] = (Math.random()-0.5)*16;
    ambVel[j*3] = (Math.random()-0.5)*0.006; ambVel[j*3+1] = Math.random()*0.007+0.002; ambVel[j*3+2] = (Math.random()-0.5)*0.006;
  }
  var ambGeo = new THREE.BufferGeometry();
  ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos, 3));
  scene.add(new THREE.Points(ambGeo, new THREE.PointsMaterial({ color: 0x7c3aed, size: 0.048, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false })));

  /* ── ORBITAL DUST ── */
  var DUST = 400;
  var dustPos = new Float32Array(DUST * 3);
  for (var k = 0; k < DUST; k++) {
    var da = Math.random() * Math.PI * 2, dr = 3.5 + Math.random() * 1.5;
    dustPos[k*3] = Math.cos(da)*dr; dustPos[k*3+1] = (Math.random()-0.5)*3; dustPos[k*3+2] = Math.sin(da)*dr;
  }
  var dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  var dustPts = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xf72585, size: 0.03, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  dustPts.position.copy(ORBIT_CENTER);
  scene.add(dustPts);

  /* ── ANIMATION LOOP ── */
  var clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    var t = clock.getElapsedTime();

    if (autoSpin) { camTheta += 0.0025; applyCamera(); }

    drawScreen(t);
    sglowMesh.material.opacity = 0.04 + Math.sin(t * 2.1) * 0.018;
    sLight.intensity  = 5 + Math.sin(t * 2.8) * 1.5;
    screenPL.intensity = 9 + Math.sin(t * 1.9) * 2;
    laptopGroup.rotation.y = Math.sin(t * 0.25) * 0.035;

    techObjs.forEach(function (obj, i) {
      obj.angle += obj.spd * 0.0075;
      var r = obj.r;
      var cx2 = Math.cos(obj.angle) * r, cz2 = Math.sin(obj.angle) * r;
      var cosX = Math.cos(obj.tx), sinX = Math.sin(obj.tx);
      var y1 = -cz2 * sinX, z1 = cz2 * cosX;
      var cosZ = Math.cos(obj.tz), sinZ = Math.sin(obj.tz);
      var x2 = cx2 * cosZ - y1 * sinZ, y2 = cx2 * sinZ + y1 * cosZ;
      var wx = ORBIT_CENTER.x + x2;
      var wy = ORBIT_CENTER.y + y2 + Math.sin(t * 1.3 + i * 1.05) * 0.06;
      var wz = ORBIT_CENTER.z + z1;

      obj.panel.position.set(wx, wy, wz);
      obj.panel.lookAt(camera.position);
      obj.pl.position.set(wx, wy, wz);
      obj.pl.intensity = 1.6 + Math.sin(t * 2.2 + i * 0.7) * 0.7;
      obj.trailMesh.rotation.y = t * obj.spd * 0.8;

      var bp = beams[i].geometry.attributes.position.array;
      bp[0] = ORBIT_CENTER.x; bp[1] = ORBIT_CENTER.y; bp[2] = ORBIT_CENTER.z;
      bp[3] = wx; bp[4] = wy; bp[5] = wz;
      beams[i].geometry.attributes.position.needsUpdate = true;
      beams[i].material.opacity = 0.10 + Math.sin(t * 1.8 + i * 0.9) * 0.07;
    });

    var ap = ambGeo.attributes.position.array;
    for (var ii = 0; ii < AMB; ii++) {
      ap[ii*3] += ambVel[ii*3]; ap[ii*3+1] += ambVel[ii*3+1]; ap[ii*3+2] += ambVel[ii*3+2];
      if (ap[ii*3+1] > 5) { ap[ii*3+1] = -5; ap[ii*3] = (Math.random()-0.5)*16; ap[ii*3+2] = (Math.random()-0.5)*16; }
      if (Math.abs(ap[ii*3]) > 8) ap[ii*3] *= -0.97;
      if (Math.abs(ap[ii*3+2]) > 8) ap[ii*3+2] *= -0.97;
    }
    ambGeo.attributes.position.needsUpdate = true;

    stars.rotation.y = t * 0.004;
    dustPts.rotation.y = t * 0.06;

    rimPL.position.x = Math.cos(t * 0.4) * 6;
    rimPL.position.z = Math.sin(t * 0.4) * 6;
    rimPL.intensity  = 3 + Math.sin(t * 0.7) * 1.2;

    fglow1.rotation.z = t * 0.05;
    fglow2.rotation.z = -t * 0.08;

    renderer.render(scene, camera);
  }
  tick();
});
