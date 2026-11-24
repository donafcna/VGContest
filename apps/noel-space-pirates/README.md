# Space Pirates — iPhone edition

Native iPhone packaging of Noel's Space Pirates game using Capacitor 8.

## Included

- Full offline single-player game bundled in the app
- Online leaderboard and WebRTC fleet mode when connected
- Landscape-only iPhone presentation
- Safe-area support for the Dynamic Island and Home indicator
- Automatic pause when the app enters the background
- Native haptics on controls, damage and rewards
- Generated App Store icon and iOS launch assets

## Build on macOS

Requirements: macOS, Xcode 16 or newer, an Apple Developer team for device/App Store signing.

```bash
npm install
npm run sync
npm run open:ios
```

In Xcode, choose the `App` target, select the Apple Developer team, then build or Archive.

## Project identity

- App name: `Space Pirates`
- Bundle ID: `ch.vgcontest.noel.spacepirates`
- Version: `1.0.0`
