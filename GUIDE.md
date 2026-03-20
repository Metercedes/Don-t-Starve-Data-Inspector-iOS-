# Don't Starve: Pocket Edition – Save Data Editing Guide (iOS)

Hello everyone,

I'm excited to share my latest exploration with you. In this guide, I will walk you through the process of modifying the save data of Don't Starve: Pocket Edition on iOS. By editing the game's save files, you can unlock all characters, modify your world, edit player stats, and more.

This method works for both jailbroken and non-jailbroken devices. The only difference is how you access the game files.

**Disclaimer:**
This guide is intended for educational and research purposes only.


---

## Requirements

- iOS device
- Decrypted Don't Starve IPA
- Valid P12 certificate (for sideloading)
- A sideloading tool such as ESign / Feather
- Files app on iOS
- Don't Starve Save Editor

**Decrypted IPA Download:**
https://armconverter.com/decryptedappstore/us/app/dont-starve-pocket-edition/id1012298403

**Save Editor:**
https://dontstarveditor.netlify.app


---

## Understanding the Save Files

Don't Starve uses the proprietary KLEI format for its save files. Each file is compressed and encoded — they cannot be edited with a normal text editor.

The game stores three important files inside the `Documents/` folder:

| File | Contents |
|------|----------|
| `profile` | Player XP, unlocked characters, settings |
| `saveindex` | Save slot metadata, character per slot, DLC flags |
| `survival_1` | Full game world — entities, player position, day count |

The save editor handles all the decoding and re-encoding automatically.


---

## Available Characters (iOS v1.47)

Don't Starve: Pocket Edition on iOS includes the base game and Reign of Giants DLC. There are 11 playable characters total:

| Character | Unlock Method |
|-----------|--------------|
| Wilson | Default (always unlocked) |
| Willow | 160 XP |
| Wolfgang | 320 XP |
| Wendy | 640 XP |
| WX-78 | 960 XP |
| Wickerbottom | 1280 XP |
| Woodie | 1600 XP |
| Wigfrid | 1920 XP |
| Wes | Adventure Mode |
| Maxwell | Adventure Mode |
| Webber | Adventure Mode |

Characters like Walani, Warly, Wilbur, and Woodlegs are **not available** on iOS — they belong to the Shipwrecked DLC which is not included in the Pocket Edition.


---

## Method 1 – Non-Jailbroken Devices

### Step 1 – Download the IPA

Download the decrypted Don't Starve IPA from the link above.


### Step 2 – Enable Document Browsing

When signing the IPA using ESign, Feather, or a similar sideloading tool, make sure that **"Document Browsing"** is enabled.

This allows the game files to appear inside the iOS Files app.


### Step 3 – Sign and Install

Use your P12 certificate to sign the IPA with Document Browsing enabled.

Install the signed IPA onto your device.


### Step 4 – Launch the Game Once

Open Don't Starve once after installation.

This will generate the required save files.

After launching it once, you can close the game.


### Step 5 – Access the Save Files

Open the **Files** app.

You should see a folder named:

> Don't Starve Pocket Edition

Open it and locate these files:

> `profile`
> `saveindex`
> `survival_1`

Copy or extract these files.


### Step 6 – Edit the Save Files

Upload the files to the Don't Starve Save Editor:

https://dontstarveditor.netlify.app

You can upload files individually or use the **"Select multiple files"** button to upload all at once. The editor will automatically detect which file is which.

**Profile Editor** — modify:
- Experience Points (XP)
- Unlock individual characters or use "Unlock All"
- Character in the Nightmare Throne
- Render quality, auto-save, and other settings

**Save Slots Editor** — modify:
- Character assigned to each save slot
- Day count per slot
- Casual mode toggle
- Reign of Giants DLC toggle

**Game World Editor** — modify:
- Current day
- Player position (X, Y, Z coordinates)
- World seed and level ID
- Add, duplicate, or remove entities (items, creatures, structures)

**Raw Data Editor** — for advanced users:
- Directly edit the decoded JSON (profile) or Lua table (saveindex/survival)

After editing, download the modified files using the green download buttons.


### Step 7 – Replace the Save Files

Return to the Don't Starve folder inside the Files app.

Delete the original files and replace them with the modified versions you downloaded.

Make sure the filenames match exactly: `profile`, `saveindex`, `survival_1`.


### Step 8 – Launch the Game

Open Don't Starve again.

Your modified save data should now be applied.


---

## Method 2 – Jailbroken Devices

If your device is jailbroken, the process is easier since you can directly access the app files.


### Step 1 – Install the Game

Download Don't Starve: Pocket Edition directly from the App Store.


### Step 2 – Locate the Save Files

Using Filza, navigate to the game's container directory.

Inside the `Documents` folder you will find:

> `profile`
> `saveindex`
> `survival_1`


### Step 3 – Edit the Files

Extract the files and upload them to the save editor:

https://dontstarveditor.netlify.app

Modify the values you want and download the edited files.


### Step 4 – Replace the Files

Replace the original files with the modified versions.


### Step 5 – Launch the Game

Open Don't Starve and the edited save data should now be loaded.


---

## Quick Guide: Unlock All Characters

If you just want to unlock every character, here is the fastest method:

1. Upload your `profile` file to the save editor
2. Go to the **Profile** tab
3. Click **"Unlock All"**
4. Click **"Download Modified Profile"**
5. Replace the `profile` file on your device
6. Launch the game — all 11 characters will be available in the selection screen


---

## Technical Details

For those interested in how the save format works:

**KLEI Save Format:**
```
"KLEI     1D" (11 bytes static header)
+ Base64( 16-byte binary header + zlib-compressed data )
```

**Binary Header (16 bytes, little-endian):**
- Bytes 0–3: Version (always 1)
- Bytes 4–7: Flags (always 16)
- Bytes 8–11: Decompressed size
- Bytes 12–15: Compressed size

**Payload:**
- `profile` → JSON encoded via `json.encode(self.persistdata)`
- `saveindex` → `return ` + Lua table
- `survival_1` → `return ` + Lua table

The `unlocked_characters` field is a dictionary where each key is a character ID mapped to `true`. The game's `IsCharacterUnlocked()` function checks this dictionary — it does not derive unlocks from XP at load time. Both the XP value and the character dictionary must be set correctly.


---

## Final Notes

- Always keep a backup of the original save files.
- Extreme value changes may corrupt the save or cause unexpected behavior.
- The save editor performs lossless round-trip encoding — your save data is preserved exactly as the game expects it.
- This works because Don't Starve stores all progress data locally in the KLEI format without server-side validation.
- Shipwrecked and Hamlet DLC characters do **not** exist in the iOS version — do not attempt to add them.

If you try this method, feel free to share your results or feedback below.
