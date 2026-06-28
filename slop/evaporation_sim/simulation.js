const CELL_AIR = 0;
const CELL_WALL = 1;
const CELL_WATER = 2;
const CELL_VAPOUR = 3;

const GRID_WIDTH = 100;
const GRID_HEIGHT = 100;
const SCALE = 6; // Canvas pixels per grid cell

const COLORS = {
    [CELL_AIR]: [0, 0, 0, 255],
    [CELL_WALL]: [128, 128, 128, 255],
    [CELL_WATER]: [30, 144, 255, 255], // Dodson Blue
    [CELL_VAPOUR]: [200, 255, 255, 100] // Faint cyan
};

class Simulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.width = GRID_WIDTH;
        this.height = GRID_HEIGHT;

        this.canvas.width = this.width * SCALE;
        this.canvas.height = this.height * SCALE;

        this.grid = new Uint8Array(this.width * this.height);
        this.tempGrid = new Uint8Array(this.width * this.height); // For synch updates if needed, though MC is usually asynch

        // Physics Parameters
        this.params = {
            gravity: 0.5,
            cohesion: 1.5, // Stronger default
            adhesion: 1.0,
            evapRate: 0.002, // Slower default
            temperature: 0.5 // Lower default for stability
        };

        this.currentTool = CELL_WATER;
        this.isPaused = false;
        this.stepCount = 0;

        // Precompute random moves
        this.moves = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            // Diagonals? optional, maybe later for smoother drops
        ];

        this.initInput();
        this.initUI();
    }

    initUI() {
        // Wiring up sliders
        const bindParam = (id, key) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', (e) => { // Use 'input' for real-time
                    this.params[key] = parseFloat(e.target.value);
                });
                // Set initial JS value from DOM (which was set in HTML or by browser cache)
                // Actually, let's sync JS -> DOM to be safe, or DOM -> JS.
                // Best to read from DOM on init to match what user sees.
                this.params[key] = parseFloat(el.value);
            }
        };

        bindParam('param-gravity', 'gravity');
        bindParam('param-cohesion', 'cohesion');
        bindParam('param-adhesion', 'adhesion');
        bindParam('param-evap', 'evapRate');
        bindParam('param-temp', 'temperature');

        document.getElementById('btn-reset').addEventListener('click', () => this.reset());
        document.getElementById('btn-pause').addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            document.getElementById('btn-pause').textContent = this.isPaused ? "Resume" : "Pause";
        });

        const btnDemo = document.getElementById('btn-demo-box');
        if (btnDemo) {
            btnDemo.addEventListener('click', () => this.spawnDemoBox());
        }
    }

    spawnDemoBox() {
        this.reset();
        // Draw a box in the middle
        const pad = 20;
        for (let y = pad; y < this.height - pad; y++) {
            for (let x = pad; x < this.width - pad; x++) {
                if (y === pad || y === this.height - pad - 1 || x === pad || x === this.width - pad - 1) {
                    this.grid[y * this.width + x] = CELL_WALL;
                } else if (y > this.height - pad - 10) {
                    // Add some water at bottom of box
                    this.grid[y * this.width + x] = CELL_WATER;
                }
            }
        }
        this.draw();
    }

    initInput() {
        let isDrawing = false;

        const getGridPos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / SCALE);
            const y = Math.floor((e.clientY - rect.top) / SCALE);
            return { x, y };
        };

        const paint = (e) => {
            const { x, y } = getGridPos(e);
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.grid[y * this.width + x] = this.currentTool;
            }
        };

        this.canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            paint(e);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDrawing) paint(e);
        });

        window.addEventListener('mouseup', () => {
            isDrawing = false;
        });
    }

    setTool(tool) {
        this.currentTool = tool;
        document.querySelectorAll('#controls button').forEach(b => b.classList.remove('active'));
        if (tool === CELL_WATER) document.getElementById('btn-water').classList.add('active');
        if (tool === CELL_WALL) document.getElementById('btn-wall').classList.add('active');
        if (tool === CELL_AIR) document.getElementById('btn-erase').classList.add('active');
    }

    reset() {
        this.grid.fill(CELL_AIR);
        this.stepCount = 0;
        this.draw();
    }

    // --- Core Physics ---

    getEnergy(index, type) {
        // Calculate Hamiltonian (Energy) for a cell at index if it were of `type`
        if (type === CELL_AIR) return 0; // Air is neutral medium
        if (type === CELL_WALL) return 0; // Walls are static

        const x = index % this.width;
        const y = Math.floor(index / this.width);

        let energy = 0;

        // Gravity: Minimize y (go to bottom, larger y)
        // Energy = -Mass * Gravity * y
        // Water Mass = 1.0, Vapour Mass = 0.05
        let mass = (type === CELL_WATER ? 1.0 : (type === CELL_VAPOUR ? 0.05 : 0));

        energy -= this.params.gravity * y * mass;

        // Surface Tension (Bond Energies)
        const neighbors = [
            (y - 1) * this.width + x,
            (y + 1) * this.width + x,
            y * this.width + (x - 1),
            y * this.width + (x + 1)
        ];

        for (let nIdx of neighbors) {
            if (nIdx < 0 || nIdx >= this.grid.length) continue;

            const nType = this.grid[nIdx];

            // Interaction Energies (Negative = Attractive/Favorable)
            if (type === CELL_WATER) {
                if (nType === CELL_WATER) energy -= this.params.cohesion;
                if (nType === CELL_WALL) energy -= this.params.adhesion;
            }
            // Vapour doesn't clump (no cohesion)
        }

        return energy;
    }

    monteCarloStep() {
        const N = this.width * this.height;

        for (let i = 0; i < N; i++) {
            const idx1 = Math.floor(Math.random() * this.grid.length);
            const x = idx1 % this.width;
            const y = Math.floor(idx1 / this.width);

            // Pick rand neighbor
            const move = this.moves[Math.floor(Math.random() * this.moves.length)];
            const nx = x + move.dx;
            const ny = y + move.dy;

            if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) continue;

            const idx2 = ny * this.width + nx;

            const type1 = this.grid[idx1];
            const type2 = this.grid[idx2];

            if (type1 === type2) continue;
            if (type1 === CELL_WALL || type2 === CELL_WALL) continue;

            // Calculate Energy Change
            const e1_initial = this.getEnergy(idx1, type1);
            const e2_initial = this.getEnergy(idx2, type2);

            // Swap
            this.grid[idx1] = type2;
            this.grid[idx2] = type1;

            const e1_final = this.getEnergy(idx1, type2);
            const e2_final = this.getEnergy(idx2, type1);

            const deltaE = (e1_final + e2_final) - (e1_initial + e2_initial);

            let accept = false;
            // Lower energy is better
            if (deltaE <= 0) {
                accept = true;
            } else {
                // Boltzmann probability
                const p = Math.exp(-deltaE / this.params.temperature);
                if (Math.random() < p) {
                    accept = true;
                }
            }

            if (!accept) {
                // Revert
                this.grid[idx1] = type1;
                this.grid[idx2] = type2;
            }
        }
    }

    phaseChangeStep() {
        const N = this.width * this.height * 0.5; // Update frequent enough

        for (let i = 0; i < N; i++) {
            const idx = Math.floor(Math.random() * this.grid.length);
            const type = this.grid[idx];

            if (type === CELL_WATER) {
                // Evaporation: Check if exposed to Air or Vapour (Surface)
                // If surrounded by water, unlikely to evaporate (bulk)
                // We'll trust random selection to eventually hit surface.

                // Simple probabilistic rule:
                if (Math.random() < this.params.evapRate) {
                    // Check if it has space to become vapour (at least one non-water/wall neighbor?)
                    // Actually, just converting it is fine, the MC step will move it if it's crowded.
                    // But strictly, evaporation needs energy.
                    this.grid[idx] = CELL_VAPOUR;
                }
            } else if (type === CELL_VAPOUR) {
                // Condensation: Vapour -> Water
                // Occurs if crowded or near surface?
                // To balance "Evaporation accord to humidity", we can say:
                // Rate(Condense) = k * Density.
                // If we convert Vapour -> Water with small prob, it creates dynamic equilibrium.
                // If we want "Condense on contact", check neighbors.

                // Let's implement simple condensation to ensure closed system equilibrium
                // Probability slightly lower than evap to maintain some vapour.
                // Or better: Condense if touching Water or Wall (nucleation sites).

                let nearNucleator = false;
                const x = idx % this.width;
                const y = Math.floor(idx / this.width);
                const neighbors = [
                    (y - 1) * this.width + x,
                    (y + 1) * this.width + x,
                    y * this.width + (x - 1),
                    y * this.width + (x + 1)
                ];
                for (let nIdx of neighbors) {
                    if (nIdx >= 0 && nIdx < this.grid.length) {
                        const nType = this.grid[nIdx];
                        if (nType === CELL_WATER || nType === CELL_WALL) {
                            nearNucleator = true;
                            break;
                        }
                    }
                }

                if (nearNucleator) {
                    // Higher chance to condense if near water/wall
                    if (Math.random() < this.params.evapRate * 0.5) {
                        this.grid[idx] = CELL_WATER;
                    }
                } else {
                    // Spontaneous nucleation in air (clouds) - very rare
                    if (Math.random() < this.params.evapRate * 0.01) {
                        this.grid[idx] = CELL_WATER;
                    }
                }
            }
        }
    }

    update() {
        if (this.isPaused) return;
        this.monteCarloStep();
        this.phaseChangeStep();
        this.stepCount++;
        document.getElementById('steps-count').innerText = this.stepCount;
    }

    draw() {
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imgData.data;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const type = this.grid[y * this.width + x];
                const color = COLORS[type];

                // Draw a simple rect of SCALE x SCALE pixels
                // Direct pixel manipulation for speed
                for (let py = 0; py < SCALE; py++) {
                    for (let px = 0; px < SCALE; px++) {
                        const pixelIndex = ((y * SCALE + py) * this.canvas.width + (x * SCALE + px)) * 4;
                        data[pixelIndex] = color[0];
                        data[pixelIndex + 1] = color[1];
                        data[pixelIndex + 2] = color[2];
                        data[pixelIndex + 3] = color[3];
                    }
                }
            }
        }

        this.ctx.putImageData(imgData, 0, 0);
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// Global hook
const sim = new Simulation('simCanvas');

// expose for HTML onclicks
window.setTool = (t) => sim.setTool(t);

sim.loop();
