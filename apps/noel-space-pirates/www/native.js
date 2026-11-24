(function nativeSpacePiratesBridge() {
  const isNative = Boolean(window.Capacitor && window.Capacitor.isNativePlatform?.());
  if (!isNative) return;

  document.documentElement.classList.add('native-ios');
  document.documentElement.setAttribute('data-platform', window.Capacitor.getPlatform?.() || 'native');

  const getPlugin = (name) => window.Capacitor?.Plugins?.[name];
  const App = getPlugin('App');
  const Haptics = getPlugin('Haptics');
  const StatusBar = getPlugin('StatusBar');

  StatusBar?.hide?.().catch(() => {});

  const pauseGame = () => {
    if (typeof window.togglePause === 'function') {
      const overlay = document.getElementById('pauseoverlay');
      if (overlay?.classList.contains('hidden')) window.togglePause();
      return;
    }
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', key: 'Escape' }));
  };

  App?.addListener?.('appStateChange', ({ isActive }) => {
    if (!isActive) pauseGame();
  });

  App?.addListener?.('backButton', pauseGame);

  const vibrate = (style) => {
    if (!Haptics) return;
    if (style === 'heavy') Haptics.impact?.({ style: 'HEAVY' }).catch(() => {});
    else if (style === 'medium') Haptics.impact?.({ style: 'MEDIUM' }).catch(() => {});
    else Haptics.impact?.({ style: 'LIGHT' }).catch(() => {});
  };

  document.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button, .tab-btn, .dpad-btn, .brawl-btn')) vibrate('light');
  }, { passive: true });

  window.addEventListener('spacepirates:damage', () => vibrate('heavy'));
  window.addEventListener('spacepirates:reward', () => vibrate('medium'));

  if (typeof window.damageShip === 'function') {
    const originalDamageShip = window.damageShip;
    window.damageShip = function nativeDamageFeedback(...args) {
      vibrate('heavy');
      return originalDamageShip.apply(this, args);
    };
  }

  if (typeof window.addAlert === 'function') {
    const originalAddAlert = window.addAlert;
    window.addAlert = function nativeRewardFeedback(text, sound) {
      if (['coin', 'trophy', 'super', 'map'].includes(sound)) vibrate('medium');
      return originalAddAlert.apply(this, arguments);
    };
  }

  const badge = document.createElement('div');
  badge.id = 'native-offline-badge';
  badge.textContent = 'Offline — solo mode';
  badge.classList.toggle('hidden', navigator.onLine);
  document.body.appendChild(badge);

  const updateNetworkBadge = () => badge.classList.toggle('hidden', navigator.onLine);
  window.addEventListener('online', updateNetworkBadge);
  window.addEventListener('offline', updateNetworkBadge);

  document.addEventListener('contextmenu', (event) => event.preventDefault());
})();
