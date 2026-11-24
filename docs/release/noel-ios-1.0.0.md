# Release checklist: Space Pirates iOS 1.0.0

**Date:** 2026-11-24  
**Owner:** Donatien Peigné

## Completed before push

- [x] Existing Space Pirates gameplay preserved in a standalone app bundle
- [x] iPhone landscape viewport smoke-tested at 844 × 390
- [x] Touch controls, pause button and game start verified
- [x] Automatic pause on backgrounding implemented
- [x] iPhone safe areas and full-screen layout implemented
- [x] Native haptics implemented
- [x] Offline solo mode implemented
- [x] Supabase leaderboard isolated, protected by RLS and tested through the public REST API
- [x] Generated iOS icon and launch assets
- [x] Privacy manifest added
- [x] Capacitor project verification passed
- [x] NPM dependency audit passed

## Automated after push

- [ ] GitHub Actions builds the app for the generic iPhone Simulator
- [ ] Simulator `.app` artifact is uploaded

## Final App Store operations

- [ ] Select the Apple Developer team in Xcode
- [ ] Replace the placeholder signing configuration with the production team
- [ ] Archive for `Any iOS Device (arm64)`
- [ ] Validate the archive in Xcode Organizer
- [ ] Upload to App Store Connect / TestFlight
- [ ] Complete App Privacy, age rating and store metadata

## Rollback

The public web games are untouched. Reverting the iOS commit removes only `apps/noel-space-pirates`, its workflow and the dedicated Supabase leaderboard table. Existing player progress stays local on each device.
