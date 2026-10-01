type Neuron = { x: number; y: number; z: number; layer: number; index: number };
type Synapse = { from: number; to: number; seed: number };
type ProjectedNeuron = { x: number; y: number; depth: number; activation: number };

const canvas = document.querySelector<HTMLCanvasElement>('#neural-network');
const context = canvas?.getContext('2d');

if (canvas && context) {
  const surface = canvas;
  const ctx = context;
  const scene = surface.parentElement!;
  const motionButton = document.querySelector<HTMLButtonElement>('#motion-toggle');
  const activateButton = document.querySelector<HTMLButtonElement>('#network-activate');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const neurons: Neuron[] = [];
  const synapses: Synapse[] = [];
  const layers: number[][] = [];

  // A five-layer diagram, with alternating depth to keep the structure legible in 3D.
  [4, 6, 7, 6, 3].forEach((count, layer) => {
    const ids: number[] = [];
    for (let row = 0; row < count; row++) {
      const index = neurons.length;
      ids.push(index);
      neurons.push({
        x: (layer - 2) * .44,
        y: (row - (count - 1) / 2) * .24,
        z: Math.sin(row * 1.6 + layer * .9) * .15,
        layer,
        index,
      });
    }
    layers.push(ids);
    if (layer > 0) {
      for (const from of layers[layer - 1]) {
        for (const to of ids) {
          synapses.push({ from, to, seed: ((from * 17 + to * 31) % 97) / 97 });
        }
      }
    }
  });

  let width = 0;
  let height = 0;
  let time = 0;
  let frame = 0;
  let previous: number | undefined;
  let paused = reduced.matches;
  let visible = true;
  let dark = document.documentElement.dataset.theme !== 'light';
  let rotationX = .10;
  let rotationY = -.20;
  let targetX = rotationX;
  let targetY = rotationY;
  let pointer: { x: number; y: number } | null = null;
  let impulse: { layer: number; started: number } | null = null;
  let projected: ProjectedNeuron[] = [];

  const color = (alpha: number) => dark
    ? `rgba(195,239,112,${alpha})`
    : `rgba(73,115,29,${alpha})`;

  function circle(x: number, y: number, radius: number) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
  }

  function draw(stamp?: number) {
    if (stamp !== undefined && previous !== undefined && !paused) {
      time += Math.min(stamp - previous, 48) / 1000;
    }
    previous = stamp;
    if (!paused) {
      rotationX += (targetX - rotationX) * .055;
      rotationY += (targetY - rotationY) * .055;
    }
    ctx.clearRect(0, 0, width, height);
    if (!width || !height) return;

    const scale = Math.min(width * .43, height * .39);
    const wave = (time % 5.8) / 5.8 * 6.5 - 1;
    const breathing = paused ? 0 : Math.sin(time * .6) * .025;
    const rx = rotationX + breathing;
    const ry = rotationY;

    projected = neurons.map(neuron => {
      const y = neuron.y * Math.cos(rx) - neuron.z * Math.sin(rx);
      const z = neuron.y * Math.sin(rx) + neuron.z * Math.cos(rx);
      const x = neuron.x * Math.cos(ry) + z * Math.sin(ry);
      const depth = -neuron.x * Math.sin(ry) + z * Math.cos(ry);
      const perspective = 3.7 / (3.7 - depth);
      const screenX = width / 2 + x * scale * perspective;
      const screenY = height / 2 + y * scale * perspective;
      const proximity = pointer
        ? Math.max(0, 1 - Math.hypot(pointer.x - screenX, pointer.y - screenY) / (scale * .7))
        : 0;
      const signal = Math.exp(-((neuron.layer - wave) ** 2) / .2);
      const injection = impulse
        ? Math.exp(-((Math.abs(neuron.layer - impulse.layer) - (time - impulse.started) * 2.5) ** 2) / .28)
        : 0;
      return { x: screenX, y: screenY, depth, activation: Math.min(1, signal * .6 + proximity * .9 + injection) };
    });

    // Quiet connections form the topology; selected paths carry traveling signal packets.
    for (const edge of synapses) {
      const a = projected[edge.from];
      const b = projected[edge.to];
      const activation = Math.max(a.activation, b.activation);
      ctx.lineWidth = .6 + activation * .45;
      ctx.strokeStyle = color((dark ? .09 : .13) + activation * .24);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      if (edge.seed > .24 && activation < .6) continue;
      const layer = neurons[edge.from].layer;
      const travel = ((time * .38 - layer * .2 + edge.seed * .8) % 1.6 + 1.6) % 1.6;
      if (travel > 1) continue;
      const strength = Math.sin(travel * Math.PI) * (.5 + activation * .5);
      const tail = Math.max(0, travel - .14);
      const x = a.x + (b.x - a.x) * travel;
      const y = a.y + (b.y - a.y) * travel;
      const trail = ctx.createLinearGradient(a.x + (b.x - a.x) * tail, a.y + (b.y - a.y) * tail, x, y);
      trail.addColorStop(0, color(0));
      trail.addColorStop(1, color(strength * .85));
      ctx.strokeStyle = trail;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(a.x + (b.x - a.x) * tail, a.y + (b.y - a.y) * tail);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = dark ? `rgba(230,255,192,${strength})` : color(strength);
      circle(x, y, 1.6);
      ctx.fill();
    }

    projected.forEach((point, index) => {
      const { x, y, depth, activation } = point;
      const radius = (neurons[index].layer === 4 ? 4.8 : 3.6) + depth * .6;
      const glowRadius = radius * (4 + activation * 2.5);
      const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      glow.addColorStop(0, color(.13 + activation * .28));
      glow.addColorStop(1, color(0));
      ctx.fillStyle = glow;
      circle(x, y, glowRadius);
      ctx.fill();

      ctx.strokeStyle = color(.35 + activation * .5);
      ctx.lineWidth = 1;
      circle(x, y, radius + 3 + activation * 2);
      ctx.stroke();
      ctx.fillStyle = dark ? '#171d12' : '#f1f5eb';
      circle(x, y, radius + .7);
      ctx.fill();
      ctx.fillStyle = color(.65 + activation * .35);
      circle(x, y, radius * (.7 + activation * .3));
      ctx.fill();
      ctx.fillStyle = dark ? `rgba(243,255,224,${.25 + activation * .75})` : color(.8);
      circle(x - .5, y - .5, 1.1 + activation * .7);
      ctx.fill();
    });

    // Diagram labels stay level while the network reacts to the cursor.
    ctx.font = `${width < 370 ? 9 : 10}px "IBM Plex Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.fillStyle = dark ? '#899879' : '#657458';
    const labelY = height / 2 + scale * .98;
    [['INPUT', 0], ['HIDDEN LAYERS', 2], ['OUTPUT', 4]].forEach(([label, layer]) => {
      const column = layers[layer as number];
      const x = column.reduce((total, id) => total + projected[id].x, 0) / column.length;
      ctx.fillText(label as string, x, labelY);
    });

    if (impulse && time - impulse.started > 2.5) impulse = null;
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(draw);
  }

  function restart() {
    cancelAnimationFrame(frame);
    previous = undefined;
    draw();
  }

  function resize() {
    const bounds = scene.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    surface.width = Math.round(width * dpr);
    surface.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    restart();
  }

  function updateButton() {
    motionButton?.setAttribute('aria-label', paused ? '그래픽 애니메이션 재생' : '그래픽 애니메이션 일시 정지');
    motionButton?.setAttribute('aria-pressed', String(paused));
    if (motionButton) motionButton.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="${paused ? 'm8 5 11 7-11 7Z' : 'M8 5v14M16 5v14'}"/></svg>`;
  }

  scene.addEventListener('pointermove', event => {
    if (paused || reduced.matches || event.pointerType === 'touch') return;
    const bounds = scene.getBoundingClientRect();
    pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    targetX = .10 + (pointer.y / height - .5) * .35;
    targetY = -.20 + (pointer.x / width - .5) * .45;
  });
  scene.addEventListener('pointerleave', () => {
    // Pausing freezes the current visual, including cursor activation.
    if (paused) return;
    pointer = null;
    targetX = .10;
    targetY = -.20;
  });
  surface.addEventListener('pointerdown', event => {
    if (paused || !projected.length) return;
    const bounds = surface.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    let closest = 0;
    for (let index = 1; index < projected.length; index++) {
      if (Math.hypot(projected[index].x - x, projected[index].y - y) < Math.hypot(projected[closest].x - x, projected[closest].y - y)) closest = index;
    }
    impulse = { layer: neurons[closest].layer, started: time };
  });
  activateButton?.addEventListener('click', () => {
    impulse = { layer: 0, started: time };
    // Reduced-motion users get a static highlighted input layer, without starting animation.
    restart();
  });
  motionButton?.addEventListener('click', () => {
    paused = !paused;
    if (!paused) pointer = null;
    updateButton();
    restart();
  });
  reduced.addEventListener('change', () => {
    paused = reduced.matches;
    pointer = null;
    impulse = null;
    updateButton();
    restart();
  });
  new ResizeObserver(resize).observe(scene);
  new MutationObserver(() => {
    dark = document.documentElement.dataset.theme !== 'light';
    restart();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) restart();
    else { cancelAnimationFrame(frame); previous = undefined; }
  }).observe(scene);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); previous = undefined; }
    else if (visible) restart();
  });
  updateButton();
}
