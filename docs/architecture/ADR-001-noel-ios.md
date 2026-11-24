# ADR-001: Package Space Pirates as a native iPhone app

**Status:** Accepted  
**Date:** 2026-11-24  
**Decider:** Donatien Peigné

## Context

Space Pirates is a mature HTML5 Canvas game with extensive JavaScript gameplay, local progression, Web Audio, Supabase leaderboard access and PeerJS multiplayer. The goal is to ship an iPhone app without losing those features or maintaining two unrelated game engines.

## Decision

Use Capacitor 8 to package a self-contained copy of the existing game in a native WKWebView. Add a small native bridge for lifecycle, haptics, safe areas and offline state. Keep the public web game unchanged.

## Options considered

### Capacitor wrapper

| Dimension | Assessment |
|---|---|
| Complexity | Low |
| Feature parity | High |
| Performance | Appropriate for the existing Canvas engine |
| Maintenance | One shared gameplay codebase |

### Full Swift/Metal rewrite

| Dimension | Assessment |
|---|---|
| Complexity | Very high |
| Feature parity | High risk of regression |
| Performance | Potentially higher, but unnecessary for this game |
| Maintenance | Two separate engines |

## Consequences

- The app is a real signed iOS application with a native Xcode project.
- Existing gameplay and online services remain compatible.
- Final compilation, signing and App Store upload require macOS/Xcode and an Apple Developer account.
- Leon and Louis can reuse the same packaging pattern.
