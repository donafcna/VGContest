(() => {
  const maze = document.currentScript.dataset.edition === 'leon';
  const status = () => maze ? (typingMode === 'friend' ? 'friend' : state) : etat;
  const controls = document.createElement('nav');
  controls.className = 'mobile-controls';
  controls.setAttribute('aria-label', maze ? 'Game controls' : 'Commandes du jeu');
  document.body.append(controls);
  const pressed = new Map();
  const send = (type, code, key = code) => {
    document.dispatchEvent(new KeyboardEvent(type, { code, key, bubbles: true, cancelable: true }));
  };
  function release(pointerId) {
    const code = pressed.get(pointerId);
    pressed.delete(pointerId);
    if (code && ![...pressed.values()].includes(code)) send('keyup', code);
  }
  function releaseAll() {
    for (const pointerId of pressed.keys()) release(pointerId);
    const held = maze ? keys : touches;
    for (const code of Object.keys(held)) held[code] = false;
  }
  function group() {
    const element = document.createElement('div');
    controls.append(element);
    return element;
  }
  function button(parent, label, action) {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = label;
    if (typeof action === 'function') element.addEventListener('click', action);
    else {
      element.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        element.setPointerCapture(event.pointerId);
        pressed.set(event.pointerId, action);
        send('keydown', action);
      });
      for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
        element.addEventListener(event, ({ pointerId }) => release(pointerId));
      }
      element.addEventListener('click', (event) => {
        if (event.detail === 0) tap(action);
      });
    }
    parent.append(element);
  }
  function tap(code) {
    send('keydown', code);
    if (['Space', 'KeyX', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
      requestAnimationFrame(() => send('keyup', code));
    } else send('keyup', code);
  }
  function nameEntry(kind) {
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.maxLength = 12;
    input.autocomplete = 'off';
    input.placeholder = kind === 'friend' ? 'Friend’s name' : 'Display name';
    input.setAttribute('aria-label', input.placeholder);
    input.addEventListener('keydown', (event) => event.stopPropagation());
    input.addEventListener('input', () => { typing = input.value; });
    const submit = document.createElement('button');
    submit.textContent = kind === 'friend' ? 'Add' : 'Start';
    form.append(input, submit);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      typing = input.value;
      input.blur();
      tap('Enter');
    });
    if (kind === 'friend') button(form, 'Cancel', () => tap('Escape'));
    controls.append(form);
  }
  function render(current) {
    releaseAll();
    controls.replaceChildren();
    if (current === 'name' || current === 'friend') {
      nameEntry(current);
      return;
    }
    const primary = group();
    const secondary = group();
    if (current === 'play' || current === 'jeu') {
      button(primary, '←', 'ArrowLeft');
      if (maze) {
        button(primary, '↑', 'ArrowUp');
        button(primary, '↓', 'ArrowDown');
      }
      button(primary, '→', 'ArrowRight');
      if (!maze) button(secondary, 'Sauter', 'Space');
      button(secondary, maze ? 'Fire' : 'Tirer', 'KeyX');
      if (maze) {
        button(secondary, 'Shop', () => tap('KeyB'));
        button(secondary, 'Items', () => tap('KeyI'));
      }
      button(secondary, 'Pause', () => tap('KeyP'));
    } else if (current === 'shop' || current === 'inventory') {
      const count = current === 'shop' ? 7 : 4;
      for (let index = 1; index <= count; index++) button(primary, String(index), () => tap('Digit' + index));
      if (current === 'inventory') button(primary, 'Costume', () => tap('KeyC'));
      button(secondary, current === 'shop' && shopMode === 'exit' ? 'Next maze' : 'Back', () => tap('Enter'));
    } else if (current === 'board') {
      button(primary, 'Add friend', () => tap('KeyF'));
      button(secondary, 'Back', () => tap('KeyL'));
    } else if (current === 'pause') {
      button(primary, maze ? 'Resume' : 'Reprendre', () => tap('KeyP'));
      if (maze) button(secondary, musicOn ? 'Mute' : 'Music', () => { tap('KeyM'); render('pause'); });
    } else if (!['intro', 'decollage'].includes(current)) {
      const start = maze ? (current === 'title' ? 'Play' : 'Play again') : (current === 'accueil' ? 'Jouer' : 'Rejouer');
      button(primary, start, () => tap('Space'));
      if (maze && current !== 'dead') button(secondary, 'Scores', () => tap('KeyL'));
    }
  }
  let displayed;
  function refresh() {
    const current = status();
    if (current !== displayed) {
      displayed = current;
      render(current);
    }
    requestAnimationFrame(refresh);
  }
  function pause() {
    releaseAll();
    if (status() === (maze ? 'play' : 'jeu')) tap('KeyP');
    if (maze && audioCtx?.state === 'running') audioCtx.suspend().catch(() => {});
  }
  window.addEventListener('blur', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  if (window.Capacitor?.isNativePlatform()) {
    window.Capacitor.Plugins.App?.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) pause();
    });
  }
  if (maze) document.addEventListener('click', () => {
    if (!document.hidden && audioCtx?.state === 'suspended') audioCtx.resume().catch(() => {});
  });
  document.addEventListener('contextmenu', (event) => event.preventDefault());
  refresh();
})();
