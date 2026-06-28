// Vector2D Helper Class
class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mult(n) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  div(n) {
    if (n !== 0) {
      this.x /= n;
      this.y /= n;
    }
    return this;
  }

  magSq() {
    return this.x * this.x + this.y * this.y;
  }

  mag() {
    return Math.sqrt(this.magSq());
  }

  normalize() {
    const m = this.mag();
    if (m !== 0) this.div(m);
    return this;
  }

  copy() {
    return new Vector2D(this.x, this.y);
  }

  distSq(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  dist(v) {
    return Math.sqrt(this.distSq(v));
  }

  static sub(v1, v2) {
    return new Vector2D(v1.x - v2.x, v1.y - v2.y);
  }
}

// Particle Class
class Particle {
  static idCounter = 1;

  constructor(x, y, charge = 1.0, mass = 1.0) {
    this.id = Particle.idCounter++;
    this.pos = new Vector2D(x, y);
    this.vel = new Vector2D(0, 0);
    this.acc = new Vector2D(0, 0);
    this.force = new Vector2D(0, 0);
    this.charge = charge;
    this.mass = mass;
    this.trail = [];
    this.maxTrailLength = 40;
    this.updateRadius();
  }

  updateRadius() {
    // Radius visual mapping based on mass and charge magnitude
    const baseRadius = 8;
    const chargeEffect = Math.min(Math.abs(this.charge) * 4, 15);
    const massEffect = Math.min(Math.sqrt(this.mass) * 2, 8);
    this.radius = baseRadius + chargeEffect + massEffect;
  }

  update(dt, damping, width, height, topology, wallRepulsion) {
    this.updateRadius();

    // Store trail
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Verlet integration step:
    // Update velocity: v = v + a * dt - damping * v
    const drag = this.vel.copy().mult(damping);
    this.vel.add(this.acc.copy().mult(dt)).sub(drag);
    
    // Update position: x = x + v * dt
    this.pos.add(this.vel.copy().mult(dt));

    // Handle boundaries
    if (topology === 'box') {
      const bounce = -0.5; // coefficient of restitution
      
      // X boundaries
      if (this.pos.x < this.radius) {
        this.pos.x = this.radius;
        this.vel.x *= bounce;
      } else if (this.pos.x > width - this.radius) {
        this.pos.x = width - this.radius;
        this.vel.x *= bounce;
      }

      // Y boundaries
      if (this.pos.y < this.radius) {
        this.pos.y = this.radius;
        this.vel.y *= bounce;
      } else if (this.pos.y > height - this.radius) {
        this.pos.y = height - this.radius;
        this.vel.y *= bounce;
      }
    } else if (topology === 'torus') {
      // Periodic boundary wrapping
      this.pos.x = (this.pos.x % width + width) % width;
      this.pos.y = (this.pos.y % height + height) % height;
    }

    // Reset forces/acceleration for next step
    this.acc.set(0, 0);
  }

  draw(ctx, isSelected, showGlow) {
    if (!isFinite(this.pos.x) || !isFinite(this.pos.y) || !isFinite(this.radius) || this.radius <= 0) {
      return;
    }
    // Color determined by charge
    let color = 'var(--color-neutral)';
    let glowColor = 'rgba(160, 174, 192, 0.2)';
    
    if (this.charge > 0.01) {
      color = '#FF3B69'; // var(--color-pos)
      glowColor = `rgba(255, 59, 105, ${0.15 + Math.min(Math.abs(this.charge) * 0.1, 0.45)})`;
    } else if (this.charge < -0.01) {
      color = '#00F0FF'; // var(--color-neg)
      glowColor = `rgba(0, 240, 255, ${0.15 + Math.min(Math.abs(this.charge) * 0.1, 0.45)})`;
    }

    ctx.save();

    // 1. Draw glowing aura
    if (showGlow && Math.abs(this.charge) > 0.01) {
      const grad = ctx.createRadialGradient(
        this.pos.x, this.pos.y, this.radius * 0.5,
        this.pos.x, this.pos.y, this.radius * 3.5
      );
      grad.addColorStop(0, color);
      grad.addColorStop(0.2, glowColor);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius * 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw Selection highlight ring
    if (isSelected) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius + 5, 0, Math.PI * 2);
      ctx.stroke();

      // Dash pattern overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Draw core body
    const bodyGrad = ctx.createRadialGradient(
      this.pos.x - this.radius * 0.25, this.pos.y - this.radius * 0.25, this.radius * 0.1,
      this.pos.x, this.pos.y, this.radius
    );
    bodyGrad.addColorStop(0, '#FFFFFF');
    bodyGrad.addColorStop(0.4, color);
    bodyGrad.addColorStop(1, this.darkenColor(color, 40));
    ctx.fillStyle = bodyGrad;

    ctx.shadowBlur = isSelected ? 12 : 6;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // reset

    // 4. Draw charge symbol inside
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(this.radius * 0.9, 10)}px var(--font-sans)`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let symbol = '';
    if (this.charge > 0.01) symbol = '+';
    else if (this.charge < -0.01) symbol = '−';
    else symbol = '0';
    ctx.fillText(symbol, this.pos.x, this.pos.y + (symbol === '−' ? -0.5 : 0.5));

    ctx.restore();
  }

  darkenColor(hex, percent) {
    // Hex to RGB
    let num = parseInt(hex.replace("#",""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) - amt,
        G = (num >> 8 & 0x00FF) - amt,
        B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R<0?0:R>255?255:R)*0x10000 + (G<0?0:G>255?255:G)*0x100 + (B<0?0:B>255?255:B)).toString(16).slice(1);
  }
}

// App State Management
const State = {
  particles: [],
  selectedParticle: null,
  draggedParticle: null,
  isPaused: true,
  isSolving: false,
  
  // Parameters (read directly from DOM or stored here)
  ke: 500,
  lawPower: 2, // 1 for 1/r, 2 for 1/r²
  dt: 0.05,
  damping: 0.005,
  wallRepulsion: 100,
  softening: 15,
  
  spawnQ: 1.0,
  spawnM: 1.0,

  // Vis options
  visHeatmap: true,
  visVectors: true,
  visForce: true,
  visGlow: true,
  visTrails: true,
  
  topology: 'box', // 'box' or 'torus'
  aspectRatio3: false,
  
  // Stats
  totalEnergy: 0,
  maxForce: 0,
  stabilityStatus: 'stable',
  
  // Canvas Resolution
  width: 800,
  height: 600,
  
  // Offscreen buffer for potential heatmap
  heatmapCanvas: null,
  heatmapCtx: null,
  heatmapScale: 0.12, // 1/8 resolution for speed
};

// Vector field coordinates
let gridCols = 24;
let gridRows = 18;

// Initialize DOM elements
let canvas, ctx;
let btnPlay, btnPause, btnStep, btnMinimize, btnClear;
let topologyToggle, lawToggle, presetSelect;
let inspectorPanel, inspectorEmpty, inspectorContent;
let inspectId, inspectPos, inspectCharge, inspectMass, inspectVel, inspectForce, inspectDelete, inspectClose;
let statCount, statEnergy, statMaxForce, statStatus;

// Parameter inputs
let inputKe, inputDt, inputDamping, inputWall, inputSoftening, inputSpawnQ, inputSpawnM;
let valKe, valDt, valDamping, valWall, valSoftening, valSpawnQ, valSpawnM;
let visHeatmap, visVectors, visForce, visGlow, visTrails;
let toggleHexAspect;
let btnSetNeg, btnSetNeu, btnSetPos;

function initDOM() {
  canvas = document.getElementById('sim-canvas');
  ctx = canvas.getContext('2d');
  
  // Buttons
  btnPlay = document.getElementById('btn-play');
  btnPause = document.getElementById('btn-pause');
  btnStep = document.getElementById('btn-step');
  btnMinimize = document.getElementById('btn-minimize');
  btnClear = document.getElementById('btn-clear');
  
  // Selects & Toggles
  topologyToggle = document.getElementById('topology-toggle');
  lawToggle = document.getElementById('law-toggle');
  presetSelect = document.getElementById('preset-select');
  
  // Inspector
  inspectorPanel = document.getElementById('inspector');
  inspectorEmpty = document.getElementById('inspector-empty');
  inspectorContent = document.getElementById('inspector-content');
  inspectId = document.getElementById('inspect-id');
  inspectPos = document.getElementById('inspect-pos');
  inspectCharge = document.getElementById('inspect-charge');
  inspectMass = document.getElementById('inspect-mass');
  inspectVel = document.getElementById('inspect-vel');
  inspectForce = document.getElementById('inspect-force');
  inspectDelete = document.getElementById('inspect-delete');
  inspectClose = document.getElementById('inspector-close');
  
  // Stats
  statCount = document.getElementById('stat-count');
  statEnergy = document.getElementById('stat-energy');
  statMaxForce = document.getElementById('stat-maxforce');
  statStatus = document.getElementById('stat-status');
  
  // Sliders and Displays
  inputKe = document.getElementById('param-ke');
  valKe = document.getElementById('val-ke');
  
  inputDt = document.getElementById('param-dt');
  valDt = document.getElementById('val-dt');
  
  inputDamping = document.getElementById('param-damping');
  valDamping = document.getElementById('val-damping');
  
  inputWall = document.getElementById('param-wall');
  valWall = document.getElementById('val-wall');
  
  inputSoftening = document.getElementById('param-softening');
  valSoftening = document.getElementById('val-softening');
  
  inputSpawnQ = document.getElementById('param-spawn-q');
  valSpawnQ = document.getElementById('val-spawn-q');
  
  inputSpawnM = document.getElementById('param-spawn-m');
  valSpawnM = document.getElementById('val-spawn-m');

  // Mini spawn buttons
  btnSetNeg = document.getElementById('btn-set-neg');
  btnSetNeu = document.getElementById('btn-set-neu');
  btnSetPos = document.getElementById('btn-set-pos');
  
  // Checkboxes
  visHeatmap = document.getElementById('vis-heatmap');
  visVectors = document.getElementById('vis-vectors');
  visForce = document.getElementById('vis-force');
  visGlow = document.getElementById('vis-glow');
  visTrails = document.getElementById('vis-trails');
  toggleHexAspect = document.getElementById('toggle-hex-aspect');

  // Create offscreen canvas for potential field heatmap
  State.heatmapCanvas = document.createElement('canvas');
  State.heatmapCtx = State.heatmapCanvas.getContext('2d');

  // Setup Event Listeners
  setupEventListeners();
  updateParameterDisplay();
  resizeCanvas();
}

function updateHeatmapResolution() {
  if (State.heatmapCanvas) {
    State.heatmapCanvas.width = Math.ceil(State.width * State.heatmapScale);
    State.heatmapCanvas.height = Math.ceil(State.height * State.heatmapScale);
  }
}

function resizeCanvas() {
  const container = canvas.parentElement;
  const rect = container.getBoundingClientRect();
  
  let w = rect.width;
  let h = rect.height;
  
  if (State.aspectRatio3) {
    const ratio = Math.sqrt(3) / 2;
    if (h / w > ratio) {
      h = w * ratio;
    } else {
      w = h / ratio;
    }
  } else {
    const size = Math.min(w, h);
    w = size;
    h = size;
  }
  
  State.width = Math.floor(w);
  State.height = Math.floor(h);
  canvas.width = State.width;
  canvas.height = State.height;
  
  canvas.style.width = State.width + 'px';
  canvas.style.height = State.height + 'px';
  
  updateHeatmapResolution();
}

function updateParameterDisplay() {
  valKe.textContent = inputKe.value;
  valDt.textContent = inputDt.value;
  valDamping.textContent = inputDamping.value;
  valWall.textContent = inputWall.value;
  valSoftening.textContent = inputSoftening.value;
  
  const qVal = parseFloat(inputSpawnQ.value);
  valSpawnQ.textContent = qVal > 0 ? `+${qVal.toFixed(1)}` : qVal.toFixed(1);
  valSpawnM.textContent = parseFloat(inputSpawnM.value).toFixed(1);

  // Sync state
  State.ke = parseFloat(inputKe.value);
  State.dt = parseFloat(inputDt.value);
  State.damping = parseFloat(inputDamping.value);
  State.wallRepulsion = parseFloat(inputWall.value);
  State.softening = parseFloat(inputSoftening.value);
  State.spawnQ = parseFloat(inputSpawnQ.value);
  State.spawnM = parseFloat(inputSpawnM.value);
  
  State.visHeatmap = visHeatmap.checked;
  State.visVectors = visVectors.checked;
  State.visForce = visForce.checked;
  State.visGlow = visGlow.checked;
  State.visTrails = visTrails.checked;
  State.aspectRatio3 = toggleHexAspect.checked;
}

function setupEventListeners() {
  // Resize handler
  window.addEventListener('resize', () => {
    resizeCanvas();
    draw();
  });

  // Slider inputs
  const sliders = [inputKe, inputDt, inputDamping, inputWall, inputSoftening, inputSpawnQ, inputSpawnM];
  sliders.forEach(slider => {
    slider.addEventListener('input', () => {
      updateParameterDisplay();
      if (State.isPaused) {
        computePhysicsForces(); // update forces visually when paused
        draw();
      }
    });
  });

  // Mini spawn buttons
  btnSetNeg.addEventListener('click', () => { inputSpawnQ.value = -1; updateParameterDisplay(); });
  btnSetNeu.addEventListener('click', () => { inputSpawnQ.value = 0; updateParameterDisplay(); });
  btnSetPos.addEventListener('click', () => { inputSpawnQ.value = 1; updateParameterDisplay(); });

  // Toggles & Checkboxes
  visHeatmap.addEventListener('change', updateParameterDisplay);
  visVectors.addEventListener('change', updateParameterDisplay);
  visForce.addEventListener('change', updateParameterDisplay);
  visGlow.addEventListener('change', updateParameterDisplay);
  visTrails.addEventListener('change', updateParameterDisplay);
  
  toggleHexAspect.addEventListener('change', () => {
    updateParameterDisplay();
    const container = canvas.parentElement;
    container.style.aspectRatio = State.aspectRatio3 ? "1 / 0.8660254" : "1 / 1";
    container.style.maxWidth = State.aspectRatio3 ? "calc((100vh - 200px) / 0.8660254)" : "calc(100vh - 200px)";
    resizeCanvas();
    if (State.isPaused) {
      computePhysicsForces();
      draw();
    }
  });

  // Topology Toggle
  topologyToggle.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      topologyToggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      State.topology = e.target.getAttribute('data-value');
      
      const wallContainer = document.getElementById('wall-repulsion-container');
      if (State.topology === 'torus') {
        wallContainer.style.opacity = '0.3';
        wallContainer.style.pointerEvents = 'none';
      } else {
        wallContainer.style.opacity = '1';
        wallContainer.style.pointerEvents = 'auto';
      }
      
      // Reset trails to prevent visual jumping when wrap mode changes
      State.particles.forEach(p => p.trail = []);
      if (State.isPaused) {
        computePhysicsForces();
        draw();
      }
    });
  });

  // Law Toggle
  lawToggle.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      lawToggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      State.lawPower = parseInt(e.target.getAttribute('data-value'));
      if (State.isPaused) {
        computePhysicsForces();
        draw();
      }
    });
  });

  // Preset Select
  presetSelect.addEventListener('change', (e) => {
    loadPreset(e.target.value);
    presetSelect.value = ""; // Reset select so same preset can be clicked again
  });

  // Play / Pause / Step Controls
  btnPlay.addEventListener('click', () => {
    State.isPaused = false;
    State.isSolving = false;
    btnPlay.disabled = true;
    btnPause.disabled = false;
    updateStatusOverlay();
  });

  btnPause.addEventListener('click', () => {
    State.isPaused = true;
    State.isSolving = false;
    btnPlay.disabled = false;
    btnPause.disabled = true;
    updateStatusOverlay();
  });

  btnStep.addEventListener('click', () => {
    State.isPaused = true;
    State.isSolving = false;
    btnPlay.disabled = false;
    btnPause.disabled = true;
    stepPhysics();
    draw();
  });

  btnMinimize.addEventListener('click', () => {
    State.isSolving = true;
    State.isPaused = false;
    btnPlay.disabled = false;
    btnPause.disabled = false;
    updateStatusOverlay();
  });

  btnClear.addEventListener('click', () => {
    State.particles = [];
    deselectParticle();
    if (State.isPaused) {
      draw();
    }
  });

  // Inspector actions
  inspectClose.addEventListener('click', deselectParticle);
  inspectDelete.addEventListener('click', () => {
    if (State.selectedParticle) {
      deleteParticle(State.selectedParticle);
    }
  });

  inspectCharge.addEventListener('input', (e) => {
    if (State.selectedParticle) {
      State.selectedParticle.charge = parseFloat(e.target.value) || 0;
      State.selectedParticle.updateRadius();
      if (State.isPaused) {
        computePhysicsForces();
        draw();
      }
    }
  });

  inspectMass.addEventListener('input', (e) => {
    if (State.selectedParticle) {
      State.selectedParticle.mass = Math.max(0.1, parseFloat(e.target.value) || 0.1);
      State.selectedParticle.updateRadius();
      if (State.isPaused) {
        computePhysicsForces();
        draw();
      }
    }
  });

  // Mouse / Touch Interaction with Canvas
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  
  // Context menu (right click) deletion handler
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const target = getParticleAt(mouseX, mouseY);
    if (target) {
      deleteParticle(target);
    }
  });
}

// Particle Interaction
function getParticleAt(x, y) {
  for (let i = State.particles.length - 1; i >= 0; i--) {
    const p = State.particles[i];
    // Check with a slight buffer for easier clicking
    const clickRadius = Math.max(p.radius, 15);
    let dist = p.pos.dist(new Vector2D(x, y));
    
    // In Torus, check wrapped distance as well
    if (State.topology === 'torus') {
      const wrappedDist = getTorusDistance(p.pos, new Vector2D(x, y)).mag();
      if (wrappedDist < clickRadius) return p;
    } else {
      if (dist < clickRadius) return p;
    }
  }
  return null;
}

function handleMouseDown(e) {
  // Ignore right clicks (deletions handled by contextmenu listener)
  if (e.button === 2 || e.ctrlKey) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
  const mouseY = ((e.clientY - rect.top) / rect.height) * canvas.height;
  const target = getParticleAt(mouseX, mouseY);
  
  if (target) {
    // Select and start dragging
    State.selectedParticle = target;
    State.draggedParticle = target;
    updateInspector();
    
    // Stop moving while dragging
    target.vel.set(0, 0);
    target.acc.set(0, 0);
  } else {
    // Clicked on empty space: Add a particle
    deselectParticle();
    const p = new Particle(mouseX, mouseY, State.spawnQ, State.spawnM);
    State.particles.push(p);
    State.selectedParticle = p;
    updateInspector();
    
    if (State.isPaused) {
      computePhysicsForces();
      draw();
    }
  }
}

function handleMouseMove(e) {
  if (State.draggedParticle) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    
    // Smooth boundary clamp for dragging in box mode
    if (State.topology === 'box') {
      State.draggedParticle.pos.set(
        Math.max(State.draggedParticle.radius, Math.min(State.width - State.draggedParticle.radius, mouseX)),
        Math.max(State.draggedParticle.radius, Math.min(State.height - State.draggedParticle.radius, mouseY))
      );
    } else {
      State.draggedParticle.pos.set(mouseX, mouseY);
    }
    
    State.draggedParticle.vel.set(0, 0); // Pin velocity
    
    if (State.isPaused) {
      computePhysicsForces();
      draw();
    }
    updateInspector();
  }
}

function handleMouseUp() {
  if (State.draggedParticle) {
    State.draggedParticle = null;
  }
}

function deleteParticle(p) {
  State.particles = State.particles.filter(item => item !== p);
  if (State.selectedParticle === p) {
    deselectParticle();
  }
  if (State.isPaused) {
    computePhysicsForces();
    draw();
  }
}

function deselectParticle() {
  State.selectedParticle = null;
  State.draggedParticle = null;
  inspectorEmpty.style.display = 'block';
  inspectorContent.style.display = 'none';
}

function updateInspector() {
  const p = State.selectedParticle;
  if (!p) {
    deselectParticle();
    return;
  }
  
  inspectorEmpty.style.display = 'none';
  inspectorContent.style.display = 'block';
  
  inspectId.textContent = p.id;
  inspectPos.textContent = `x: ${Math.round(p.pos.x)}, y: ${Math.round(p.pos.y)}`;
  inspectVel.textContent = `${p.vel.mag().toFixed(1)} px/s`;
  inspectForce.textContent = `${p.force.mag().toFixed(1)} N`;
  
  // Set inputs if they aren't currently focused by user
  if (document.activeElement !== inspectCharge) {
    inspectCharge.value = p.charge.toFixed(2);
  }
  if (document.activeElement !== inspectMass) {
    inspectMass.value = p.mass.toFixed(2);
  }
}

function updateStatusOverlay() {
  statCount.textContent = State.particles.length;
  statEnergy.textContent = `${State.totalEnergy.toFixed(1)} J`;
  statMaxForce.textContent = `${State.maxForce.toFixed(1)} N`;
  
  statStatus.className = 'val-status';
  if (State.isPaused) {
    statStatus.textContent = 'Paused';
    statStatus.classList.add('paused');
  } else if (State.isSolving) {
    statStatus.textContent = 'Solving';
    statStatus.classList.add('relaxing');
  } else {
    // Stability calculation: if kinetic energy is low and max force is low
    let kineticEnergy = 0;
    State.particles.forEach(p => kineticEnergy += 0.5 * p.mass * p.vel.magSq());
    if (State.maxForce < 2.0 && kineticEnergy < 5.0) {
      statStatus.textContent = 'Stable';
      statStatus.classList.add('stable');
    } else {
      statStatus.textContent = 'Unstable';
      statStatus.classList.add('unstable');
    }
  }
}

// PHYSICS ENGINES & SOLVER
/**
 * Calculates periodic vector distance using Minimum Image Convention
 */
function getTorusDistance(v1, v2) {
  let dx = v1.x - v2.x;
  let dy = v1.y - v2.y;
  
  // Minimum image wrap
  if (dx > State.width / 2) dx -= State.width;
  else if (dx < -State.width / 2) dx += State.width;
  
  if (dy > State.height / 2) dy -= State.height;
  else if (dy < -State.height / 2) dy += State.height;
  
  return new Vector2D(dx, dy);
}

/**
 * Calculates the force vector between two particles
 */
function calculateForce(p1, p2) {
  let rVec;
  if (State.topology === 'torus') {
    rVec = getTorusDistance(p1.pos, p2.pos);
  } else {
    rVec = Vector2D.sub(p1.pos, p2.pos);
  }
  
  const rSq = rVec.magSq();
  const r = Math.sqrt(rSq);
  
  // Coulomb's force with softening
  const softenedR = Math.sqrt(rSq + State.softening * State.softening);
  
  // Power law exponent
  // For n=2 (3D law): F = ke * q1 * q2 / (r² + ε²)^(1.5) * rVec
  // For n=1 (2D law): F = ke * q1 * q2 / (r² + ε²) * rVec
  const exponent = State.lawPower + 1;
  const denominator = Math.pow(softenedR, exponent);
  
  const forceMag = (State.ke * p1.charge * p2.charge) / denominator;
  
  // Return force vector on p1 (directed away if charges repel)
  return rVec.mult(forceMag);
}

/**
 * Calculates electrostatic potential at point (x,y)
 */
function getPotentialAt(x, y) {
  let potential = 0;
  const pVec = new Vector2D(x, y);
  
  for (const p of State.particles) {
    if (Math.abs(p.charge) < 0.01) continue;
    
    let r;
    if (State.topology === 'torus') {
      r = getTorusDistance(p.pos, pVec).mag();
    } else {
      r = p.pos.dist(pVec);
    }
    
    const softenedR = Math.sqrt(r * r + State.softening * State.softening);
    
    if (State.lawPower === 2) {
      // V = ke * q / sqrt(r² + ε²)
      potential += (State.ke * p.charge) / softenedR;
    } else {
      // V = -ke * q * ln(sqrt(r² + ε²))
      // Scale logarithmic potential to be visualizable
      potential += -State.ke * 0.15 * p.charge * Math.log(softenedR / 50.0);
    }
  }
  return potential;
}

/**
 * Calculates net electric field vector at point (x,y)
 */
function getElectricFieldAt(x, y) {
  const eField = new Vector2D(0, 0);
  const pVec = new Vector2D(x, y);
  
  for (const p of State.particles) {
    if (Math.abs(p.charge) < 0.01) continue;
    
    let rVec;
    if (State.topology === 'torus') {
      rVec = getTorusDistance(pVec, p.pos); // Direction: from particle to point
    } else {
      rVec = Vector2D.sub(pVec, p.pos);
    }
    
    const rSq = rVec.magSq();
    const softenedR = Math.sqrt(rSq + State.softening * State.softening);
    const exponent = State.lawPower + 1;
    const denominator = Math.pow(softenedR, exponent);
    
    const fieldMag = (State.ke * p.charge) / denominator;
    eField.add(rVec.normalize().mult(fieldMag));
  }
  return eField;
}

/**
 * Main physics loop: calculate all forces, wall interactions, and update positions
 */
function computePhysicsForces() {
  const N = State.particles.length;
  
  // Reset forces
  State.particles.forEach(p => p.force.set(0, 0));
  
  let potentialEnergy = 0;
  let maxF = 0;
  
  // 1. Particle-Particle interactions
  for (let i = 0; i < N; i++) {
    const p1 = State.particles[i];
    for (let j = i + 1; j < N; j++) {
      const p2 = State.particles[j];
      
      const forceVec = calculateForce(p1, p2);
      p1.force.add(forceVec);
      p2.force.sub(forceVec); // Newton's 3rd Law
      
      // Calculate potential energy contrib
      let r;
      if (State.topology === 'torus') {
        r = getTorusDistance(p1.pos, p2.pos).mag();
      } else {
        r = p1.pos.dist(p2.pos);
      }
      
      const softenedR = Math.sqrt(r * r + State.softening * State.softening);
      if (State.lawPower === 2) {
        potentialEnergy += (State.ke * p1.charge * p2.charge) / softenedR;
      } else {
        potentialEnergy += -State.ke * 0.15 * p1.charge * p2.charge * Math.log(softenedR / 50.0);
      }
    }
  }

  // 2. Box boundary potential repulsion (prevents particles from sticking to borders)
  if (State.topology === 'box' && State.wallRepulsion > 0) {
    const thresh = 60.0; // range of boundary force
    
    for (const p of State.particles) {
      // Left Wall (x = 0)
      if (p.pos.x < thresh) {
        const d = Math.max(1, p.pos.x);
        const f = State.wallRepulsion * Math.abs(p.charge) / (d * d);
        p.force.x += f;
        potentialEnergy += State.wallRepulsion * Math.abs(p.charge) / d;
      }
      // Right Wall (x = W)
      if (State.width - p.pos.x < thresh) {
        const d = Math.max(1, State.width - p.pos.x);
        const f = State.wallRepulsion * Math.abs(p.charge) / (d * d);
        p.force.x -= f;
        potentialEnergy += State.wallRepulsion * Math.abs(p.charge) / d;
      }
      // Top Wall (y = 0)
      if (p.pos.y < thresh) {
        const d = Math.max(1, p.pos.y);
        const f = State.wallRepulsion * Math.abs(p.charge) / (d * d);
        p.force.y += f;
        potentialEnergy += State.wallRepulsion * Math.abs(p.charge) / d;
      }
      // Bottom Wall (y = H)
      if (State.height - p.pos.y < thresh) {
        const d = Math.max(1, State.height - p.pos.y);
        const f = State.wallRepulsion * Math.abs(p.charge) / (d * d);
        p.force.y -= f;
        potentialEnergy += State.wallRepulsion * Math.abs(p.charge) / d;
      }
    }
  }

  // 3. Accumulate acceleration and kinetic energy
  let kineticEnergy = 0;
  for (const p of State.particles) {
    // If being dragged, force and velocity are locked
    if (p === State.draggedParticle) {
      p.vel.set(0, 0);
      p.force.set(0, 0);
      continue;
    }
    
    p.acc.add(p.force.copy().div(p.mass));
    
    const fMag = p.force.mag();
    if (fMag > maxF) maxF = fMag;
    
    kineticEnergy += 0.5 * p.mass * p.vel.magSq();
  }

  State.totalEnergy = potentialEnergy + kineticEnergy;
  State.maxForce = maxF;
}

function stepPhysics() {
  computePhysicsForces();
  
  // Decide damping level: if solving/minimizing, use high damping. Otherwise, use user slider.
  let activeDamping = State.damping;
  if (State.isSolving) {
    // Mimic relaxation: high damping
    activeDamping = Math.max(0.20, State.damping);
  }
  
  State.particles.forEach(p => {
    p.update(State.dt, activeDamping, State.width, State.height, State.topology, State.wallRepulsion);
  });
  
  // Filter out any NaN/infinite particles to prevent cascading crashes
  State.particles = State.particles.filter(p => {
    return isFinite(p.pos.x) && isFinite(p.pos.y) && isFinite(p.vel.x) && isFinite(p.vel.y);
  });
  
  // Stop solving if we are in equilibrium (forces are very small)
  if (State.isSolving && State.maxForce < 0.1 && State.particles.length > 0) {
    State.isSolving = false;
    State.isPaused = true;
    btnPlay.disabled = false;
    btnPause.disabled = true;
    updateStatusOverlay();
  }
}

// RENDERING GRAPHICS
function drawHeatmap() {
  const hW = State.heatmapCanvas.width;
  const hH = State.heatmapCanvas.height;
  const imgData = State.heatmapCtx.createImageData(hW, hH);
  const data = imgData.data;
  const scale = 1.0 / State.heatmapScale;

  for (let y = 0; y < hH; y++) {
    const worldY = y * scale;
    for (let x = 0; x < hW; x++) {
      const worldX = x * scale;
      const potential = getPotentialAt(worldX, worldY);
      
      const idx = (y * hW + x) * 4;
      
      // Potential mapping to colors (Red/Pink for +, Blue/Cyan for -)
      // Cap visual sensitivity
      const normPot = potential / 30.0;
      
      if (normPot > 0) {
        // Positive: Red tint
        data[idx] = Math.min(255, 11 + normPot * 50);
        data[idx + 1] = Math.min(255, 15 + normPot * 5);
        data[idx + 2] = Math.min(255, 25 + normPot * 10);
      } else {
        // Negative: Blue/Cyan tint
        data[idx] = Math.min(255, 11 + Math.abs(normPot) * 1);
        data[idx + 1] = Math.min(255, 15 + Math.abs(normPot) * 35);
        data[idx + 2] = Math.min(255, 25 + Math.abs(normPot) * 60);
      }
      // Opacity: stronger field = brighter, background is dark blue-ish black
      data[idx + 3] = 255;
    }
  }

  State.heatmapCtx.putImageData(imgData, 0, 0);
  
  // Draw background heatmap scaled to fit
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(State.heatmapCanvas, 0, 0, State.width, State.height);
  ctx.restore();
}

function drawElectricFieldVectors() {
  const cellW = State.width / gridCols;
  const cellH = State.height / gridRows;
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;

  for (let r = 0; r < gridRows; r++) {
    const y = (r + 0.5) * cellH;
    for (let c = 0; c < gridCols; c++) {
      const x = (c + 0.5) * cellW;
      
      const eField = getElectricFieldAt(x, y);
      const mag = eField.mag();
      if (mag < 0.05) continue;
      
      // Limit length using log-scale so small vectors are visible and large ones don't explode
      const logMag = Math.log(1 + mag) * 4.5;
      const len = Math.min(Math.max(2.0, logMag), Math.min(cellW, cellH) * 0.85);
      
      const dir = eField.normalize();
      const endX = x + dir.x * len;
      const endY = y + dir.y * len;
      
      // Gradient fade out for field vector lines
      const opacity = Math.min(0.35, mag / 30);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + opacity})`;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + opacity})`;
      
      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Arrowhead
      const arrowSize = 2.5;
      const angle = Math.atan2(dir.y, dir.x);
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI/6), endY - arrowSize * Math.sin(angle - Math.PI/6));
      ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI/6), endY - arrowSize * Math.sin(angle + Math.PI/6));
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawParticleTrails() {
  ctx.save();
  for (const p of State.particles) {
    if (p.trail.length < 2) continue;
    
    let color = 'rgba(255, 255, 255, 0.15)';
    if (p.charge > 0.01) color = 'rgba(255, 59, 105, 0.25)';
    else if (p.charge < -0.01) color = 'rgba(0, 240, 255, 0.25)';
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(p.trail[0].x, p.trail[0].y);
    
    for (let i = 1; i < p.trail.length; i++) {
      const prev = p.trail[i-1];
      const curr = p.trail[i];
      
      // Torus wrapping check: if they jumped boundary, do not draw line across screen
      if (State.topology === 'torus' && (Math.abs(curr.x - prev.x) > State.width/2 || Math.abs(curr.y - prev.y) > State.height/2)) {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(curr.x, curr.y);
      } else {
        ctx.lineTo(curr.x, curr.y);
      }
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawForceVectors() {
  ctx.save();
  ctx.lineWidth = 2.0;
  
  for (const p of State.particles) {
    const fMag = p.force.mag();
    if (fMag < 0.2) continue;
    
    // Scale force visually
    const len = Math.min(fMag * 0.1, 80);
    const dir = p.force.copy().normalize();
    const endX = p.pos.x + dir.x * len;
    const endY = p.pos.y + dir.y * len;
    
    ctx.strokeStyle = '#FBBF24'; // Bright yellow for force
    ctx.fillStyle = '#FBBF24';
    
    // Line
    ctx.beginPath();
    ctx.moveTo(p.pos.x, p.pos.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Arrowhead
    const angle = Math.atan2(dir.y, dir.x);
    const size = 5;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - size * Math.cos(angle - Math.PI/6), endY - size * Math.sin(angle - Math.PI/6));
    ctx.lineTo(endX - size * Math.cos(angle + Math.PI/6), endY - size * Math.sin(angle + Math.PI/6));
    ctx.fill();
  }
  ctx.restore();
}

function drawGridLines() {
  // Simple layout grid for periodic torus
  if (State.topology === 'torus') {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    
    // Grid lines spacing
    const spacing = 100;
    
    ctx.beginPath();
    for (let x = spacing; x < State.width; x += spacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, State.height);
    }
    for (let y = spacing; y < State.height; y += spacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(State.width, y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

function draw() {
  // Clear canvas with base background color if not using heatmap
  if (!State.visHeatmap) {
    ctx.fillStyle = '#050810';
    ctx.fillRect(0, 0, State.width, State.height);
  } else {
    drawHeatmap();
  }
  
  drawGridLines();
  
  if (State.visVectors) {
    drawElectricFieldVectors();
  }
  
  if (State.visTrails) {
    drawParticleTrails();
  }
  
  // Draw particles
  State.particles.forEach(p => {
    p.draw(ctx, p === State.selectedParticle, State.visGlow);
  });
  
  if (State.visForce) {
    drawForceVectors();
  }
}

// MAIN ANIMATION LOOP
function loop() {
  if (!State.isPaused) {
    // If solving, run multiple steps per frame for faster relaxation
    const stepsPerFrame = State.isSolving ? 25 : 1;
    for (let s = 0; s < stepsPerFrame; s++) {
      stepPhysics();
    }
    updateInspector();
  }
  
  draw();
  updateStatusOverlay();
  
  requestAnimationFrame(loop);
}

// PRESETS LOADER
function loadPreset(presetName) {
  deselectParticle();
  State.particles = [];
  Particle.idCounter = 1;
  
  const midX = State.width / 2;
  const midY = State.height / 2;
  
  switch(presetName) {
    case 'single':
      State.particles.push(new Particle(midX, midY, 1.0, 1.0));
      break;
      
    case 'dipole':
      State.particles.push(new Particle(midX - 120, midY, 2.0, 1.0));
      State.particles.push(new Particle(midX + 120, midY, -2.0, 1.0));
      break;
      
    case 'quadrupole':
      State.particles.push(new Particle(midX - 100, midY - 100, 2.0, 1.0));
      State.particles.push(new Particle(midX + 100, midY + 100, 2.0, 1.0));
      State.particles.push(new Particle(midX + 100, midY - 100, -2.0, 1.0));
      State.particles.push(new Particle(midX - 100, midY + 100, -2.0, 1.0));
      break;
      
    case 'wigner-10':
      // 10 positive charges repelling in a box, will form symmetry
      for (let i = 0; i < 10; i++) {
        const theta = (i / 10) * Math.PI * 2;
        const radius = 100 + Math.random() * 20;
        State.particles.push(new Particle(
          midX + radius * Math.cos(theta),
          midY + radius * Math.sin(theta),
          1.5,
          1.0
        ));
      }
      break;
      
    case 'wigner-37':
      // Shell model configuration. Generates nested rings + core particle
      State.particles.push(new Particle(midX, midY, 1.5, 1.0)); // core
      // First shell (6 particles)
      for (let i = 0; i < 6; i++) {
        const theta = (i / 6) * Math.PI * 2 + 0.1;
        State.particles.push(new Particle(midX + 70 * Math.cos(theta), midY + 70 * Math.sin(theta), 1.5, 1.0));
      }
      // Second shell (12 particles)
      for (let i = 0; i < 12; i++) {
        const theta = (i / 12) * Math.PI * 2 + 0.2;
        State.particles.push(new Particle(midX + 140 * Math.cos(theta), midY + 140 * Math.sin(theta), 1.5, 1.0));
      }
      // Third shell (18 particles)
      for (let i = 0; i < 18; i++) {
        const theta = (i / 18) * Math.PI * 2 + 0.3;
        State.particles.push(new Particle(midX + 210 * Math.cos(theta), midY + 210 * Math.sin(theta), 1.5, 1.0));
      }
      break;
      
    case 'ring':
      // Outer ring of positive charges, inner ring of negative charges
      for (let i = 0; i < 12; i++) {
        const theta = (i / 12) * Math.PI * 2;
        State.particles.push(new Particle(midX + 180 * Math.cos(theta), midY + 180 * Math.sin(theta), 1.5, 1.0));
      }
      for (let i = 0; i < 6; i++) {
        const theta = (i / 6) * Math.PI * 2 + Math.PI / 6;
        State.particles.push(new Particle(midX + 80 * Math.cos(theta), midY + 80 * Math.sin(theta), -1.5, 1.0));
      }
      break;
      
    case 'random-15':
      for (let i = 0; i < 15; i++) {
        const rx = 80 + Math.random() * (State.width - 160);
        const ry = 80 + Math.random() * (State.height - 160);
        const rq = (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 2);
        State.particles.push(new Particle(rx, ry, rq, 1.0));
      }
      break;
      
    case 'capacitor':
      // Parallel rows of opposite charge grids
      const startX = midX - 250;
      const count = 12;
      const gap = 45;
      for (let i = 0; i < count; i++) {
        // Top plate (positive charges)
        State.particles.push(new Particle(startX + i * gap, midY - 80, 2.0, 1.0));
        // Bottom plate (negative charges)
        State.particles.push(new Particle(startX + i * gap, midY + 80, -2.0, 1.0));
      }
      break;
  }
  
  if (State.isPaused) {
    computePhysicsForces();
    draw();
  }
}

// Expose tools trigger helpers to window scope if needed
window.setSpawnCharge = function(q) {
  inputSpawnQ.value = q;
  updateParameterDisplay();
};

// Start the application when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  initDOM();
  // Load default preset
  loadPreset('dipole');
  // Trigger rendering loop
  loop();
});
