# Player Asset Replacement Walkthrough v1

Date: 2026-06-14 17:57

## Summary

Replaced the temporary `O Gyejang` player SVG placeholder with the approved final PNG candidate.

This change only updates the player visual asset reference and saved player image.

## Changed Files

```text
public/assets/characters/player/o_gyejang_idle.png
public/assets/characters/player/o_gyejang_idle.svg
src/assets/AssetRegistry.ts
```

## Asset Result

```text
Final player asset:
public/assets/characters/player/o_gyejang_idle.png

Removed temporary placeholder:
public/assets/characters/player/o_gyejang_idle.svg
```

## Transparency Validation

```text
PixelFormat: Format32bppArgb
HasAlpha: True
CornerAlpha: 0,0,0,0
```

The saved PNG has a real alpha channel and transparent corners.

## Registry Update

`PLAYER_ASSETS.o_gyejang_idle.path` now points to:

```text
assets/characters/player/o_gyejang_idle.png
```

## Verification

```powershell
npm.cmd run typecheck
```

Result: passed

```powershell
npm.cmd run build
```

Result: passed

Note: the first build attempt failed inside sandbox because Vite/esbuild could not read the project config path. The same command passed after running with elevated sandbox permission.

## Restricted Areas

No changes were made to:

```text
src/systems/
data/
public/assets/monsters/
public/assets/icons/
public/assets/effects/
```

## Visual Validation

Browser visual validation is deferred.

Recommended next check:

```text
Open the game and confirm O Gyejang appears correctly in the first combat screen and portrait area.
```

