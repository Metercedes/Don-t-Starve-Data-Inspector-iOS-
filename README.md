Don't Starve: Pocket Edition – Save Data Editing Guide (iOS)

Hello everyone,

I'm excited to share my latest exploration with you. In this guide, I will walk you through the process of modifying the save data of Don't Starve: Pocket Edition on iOS. By editing the game's save files, you can unlock all characters, modify your world, edit player stats, and more.

This method works for both jailbroken and non-jailbroken devices. The only difference is how you access the game files.

Disclaimer:
This guide is intended for educational and research purposes only.


Requirements

- iOS device
- Decrypted Don't Starve IPA
- Valid P12 certificate (for sideloading)
- A sideloading tool such as ESign / Feather
- Files app on iOS
- Don't Starve Save Editor

Decrypted IPA Download:
https://armconverter.com/decryptedappstore/us/app/dont-starve-pocket-edition/id1012298403

Save Editor:
https://dontstarveditor.netlify.app


Understanding the Save Files

Don't Starve uses the proprietary KLEI format for its save files. Each file is compressed and encoded, so they cannot be edited with a normal text editor.

The game stores three important files inside the Documents folder:

File: profile
Contents: Player XP, unlocked characters, settings

File: saveindex
Contents: Save slot metadata, character per slot, DLC flags

File: survival_1
Contents: Full game world, including entities, player position, and day count

The save editor handles all decoding and re-encoding automatically.


Available Characters (iOS v1.47)

Don't Starve: Pocket Edition on iOS includes the base game and Reign of Giants DLC. There are 11 playable characters total:

Wilson – Default (always unlocked)
Willow – 160 XP
Wolfgang – 320 XP
Wendy – 640 XP
WX-78 – 960 XP
Wickerbottom – 1280 XP
Woodie – 1600 XP
Wigfrid – 1920 XP
Wes – Adventure Mode
Maxwell – Adventure Mode
Webber – Adventure Mode

Characters like Walani, Warly, Wilbur, and Woodlegs are not available on iOS because they belong to the Shipwrecked DLC, which is not included in Pocket Edition.


Method 1 – Non-Jailbroken Devices

Step 1 – Download the IPA
Download the decrypted Don't Starve IPA from the link above.

Step 2 – Enable Document Browsing
When signing the IPA using ESign, Feather, or a similar sideloading tool, make sure that Document Browsing is enabled. This allows the game files to appear inside the iOS Files app.

Step 3 – Sign and Install
Use your P12 certificate to sign the IPA with Document Browsing enabled. Install the signed IPA onto your device.

Step 4 – Launch the Game Once
Open Don't Starve once after installation. This will generate the required save files. After launching it once, you can close the game.

Step 5 – Access the Save Files
Open the Files app. You should see a folder named "Don't Starve Pocket Edition". Open it and locate these files: profile, saveindex, survival_1. Copy or extract these files.

Step 6 – Edit the Save Files
Upload the files to the Don't Starve Save Editor: https://dontstarveditor.netlify.app

You can upload files individually or select multiple files at once. The editor will automatically detect which file is which.

Profile Editor allows you to modify:
- Experience Points (XP)
- Unlock characters or use Unlock All
- Nightmare Throne character
- Settings like render quality and autosave

Save Slots Editor allows you to modify:
- Character per save slot
- Day count
- Casual mode
- Reign of Giants toggle

Game World Editor allows you to modify:
- Current day
- Player position (X, Y, Z)
- World seed and level ID
- Entities such as items, creatures, and structures

Raw Data Editor (advanced):
- Direct editing of JSON (profile) or Lua tables (saveindex/survival)

After editing, download the modified files.

Step 7 – Replace the Save Files
Go back to the Don't Starve folder in Files. Delete the original files and replace them with the modified ones. Make sure filenames match exactly: profile, saveindex, survival_1.

Step 8 – Launch the Game
Open the game again. Your modifications should now be applied.


Method 2 – Jailbroken Devices

Step 1 – Install the Game
Download the game from the App Store.

Step 2 – Locate the Save Files
Using Filza, navigate to the app container and open the Documents folder. You will find profile, saveindex, survival_1.

Step 3 – Edit the Files
Extract the files and upload them to the save editor. Modify as needed and download the edited versions.

Step 4 – Replace the Files
Replace the original files with the modified ones.

Step 5 – Launch the Game
Open the game and your edited save data should load.


Quick Guide: Unlock All Characters

1. Upload the profile file to the editor
2. Go to the Profile tab
3. Click Unlock All
4. Download the modified profile
5. Replace the profile file on your device
6. Launch the game


Technical Details

KLEI Save Format:
"KLEI 1D" (11-byte header) plus Base64 encoded data containing a 16-byte binary header and zlib-compressed payload.

Binary Header (16 bytes, little-endian):
- Bytes 0–3: Version (always 1)
- Bytes 4–7: Flags (always 16)
- Bytes 8–11: Decompressed size
- Bytes 12–15: Compressed size

Payload:
- profile → JSON
- saveindex → Lua table with "return"
- survival_1 → Lua table with "return"

The unlocked_characters field is a dictionary mapping character IDs to true. The game checks this directly rather than calculating from XP. Both XP and the dictionary must be correct.


Final Notes

- Always keep a backup of original files
- Extreme edits may corrupt saves
- The editor preserves data exactly
- The game stores everything locally with no server validation
- Shipwrecked and Hamlet characters do not exist on iOS

If you try this method, feel free to share your results or feedback.
