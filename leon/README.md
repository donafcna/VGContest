# 🕹️ The Impossible Maze

Leon's game for the family contest! (vgcontest.vercel.app)
Escape 3 GIANT dark mazes... your torch is your only light! 🔦

## How to play
- ⬅️➡️⬆️⬇️ (or WASD): move — your torch lights where you're facing!
- **X: shoot your equipped weapon** 💥
- **1-4: equip your weapons** | **B: open the shop anytime** 🛒
- P: pause | M: spooky music on/off 🎵
- Dodge spike traps, fight soldiers 💂, loot **coins 🪙 + materials 📦**
- Find the glowing exit door to escape each maze
- **🎁 DAILY GIFT: come back every day for free coins!**

## Weapons 🔫 (buy in the shop, equip with 1-4)
| Key | Weapon | Special | Price |
|---|---|---|---|
| 1 | 🔫 Pistol | you start with it | free |
| 2 | 💥 Shotgun | 3-way spread shot | 15 🪙 + 2 📦 |
| 3 | 🔥 Machine Gun | shoots super fast | 20 🪙 + 2 📦 |
| 4 | ⚡ Laser Rifle | mega damage (3) | 25 🪙 + 3 📦 |

## Also in the shop
| Key | Item | Price |
|---|---|---|
| 4 | 👟 Speed Boots | 10 🪙 + 1 📦 |
| 5 | ❤️ Extra Heart | 10 🪙 |
| 6 | 🎭 Costume (Adventurer, Ninja, Robot, Cowboy) | 5 🪙 |
| 7 | 🐾 Pet (🐶 🐱 🦖 🐉) — bites soldiers! | 12 🪙 (6 to swap) |

## Game designer secrets (make it YOUR game!)
Open `game.js` and change the **SETTINGS** at the top:
- `TORCH_LENGTH` and `TORCH_WIDTH` — a huge floodlight or a tiny candle?
- `PLAYER_SPEED`, `SOLDIER_SPEED`, `SOLDIER_RANGE`, `START_HEARTS`
- The mazes are **computer-generated**! In `LEVELS`, change `cols`/`rows`
  (odd numbers!) for even bigger mazes, or the counts of soldiers/traps/loot.
  Change `seed` to any number to get a completely different maze!
- Add a 4th maze: just add one more line to `LEVELS`!
- Weapon stats are in `WEAPONS` — invent your own gun!

## To test the game
Ask Claude, or open a terminal and run:
```
python -m http.server 8642 --directory C:\Users\donat\Desktop\vgcontest
```
then go to http://localhost:8642/leon/
