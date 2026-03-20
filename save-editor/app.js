(function () {
    "use strict";

    const state = {
        profile: { raw: null, data: null, filename: "profile" },
        saveindex: { raw: null, data: null, filename: "saveindex" },
        survival: { raw: null, data: null, filename: "survival_1" },
        currentRawTab: "profile",
    };

    const CHARACTERS = [
        { id: "wilson", name: "Wilson", desc: "The Gentleman Scientist", unlock: "default", xpLevel: 0 },
        { id: "willow", name: "Willow", desc: "The Firestarter", unlock: "xp", xpLevel: 1, xpNeeded: 160 },
        { id: "wolfgang", name: "Wolfgang", desc: "The Strongman", unlock: "xp", xpLevel: 2, xpNeeded: 320 },
        { id: "wendy", name: "Wendy", desc: "The Bereaved", unlock: "xp", xpLevel: 3, xpNeeded: 640 },
        { id: "wx78", name: "WX-78", desc: "The Soulless Automaton", unlock: "xp", xpLevel: 4, xpNeeded: 960 },
        { id: "wickerbottom", name: "Wickerbottom", desc: "The Librarian", unlock: "xp", xpLevel: 5, xpNeeded: 1280 },
        { id: "woodie", name: "Woodie", desc: "The Lumberjack", unlock: "xp", xpLevel: 6, xpNeeded: 1600 },
        { id: "wes", name: "Wes", desc: "The Silent", unlock: "adventure", xpLevel: -1 },
        { id: "waxwell", name: "Maxwell", desc: "The Puppet Master", unlock: "adventure", xpLevel: -1 },
        { id: "wathgrithr", name: "Wigfrid", desc: "The Performance Artist", unlock: "xp", xpLevel: 7, xpNeeded: 1920 },
        { id: "webber", name: "Webber", desc: "The Indigestible", unlock: "adventure", xpLevel: -1 },
    ];

    const PREFABS = {
        log: "Log", rocks: "Rocks", flint: "Flint", goldnugget: "Gold Nugget",
        cutgrass: "Cut Grass", twigs: "Twigs", boards: "Boards", cutstone: "Cut Stone",
        rope: "Rope", gears: "Gears", nightmarefuel: "Nightmare Fuel",
        redgem: "Red Gem", bluegem: "Blue Gem", purplegem: "Purple Gem",
        greengem: "Green Gem", orangegem: "Orange Gem", yellowgem: "Yellow Gem",
        papyrus: "Papyrus", silk: "Silk", pigskin: "Pig Skin",
        houndstooth: "Hound's Tooth", stinger: "Stinger",
        transistor: "Transistor", charcoal: "Charcoal",
        marble: "Marble", thulecite: "Thulecite",
        meat: "Meat", cookedmeat: "Cooked Meat", monstermeat: "Monster Meat",
        berries: "Berries", carrot: "Carrot", honey: "Honey",
        drumstick: "Drumstick", fish: "Fish", froglegs: "Frog Legs",
        egg: "Egg", butter: "Butter",
        meatballs: "Meatballs", baconeggs: "Bacon and Eggs",
        dragonpie: "Dragonpie", pierogi: "Pierogi",
        taffy: "Taffy", honeynuggets: "Honey Nuggets",
        butterflymuffin: "Butter Muffin", mandrakesoup: "Mandrake Soup",
        fishsticks: "Fishsticks", turkeydinner: "Turkey Dinner",
        axe: "Axe", pickaxe: "Pickaxe", shovel: "Shovel",
        hammer: "Hammer", razor: "Razor", pitchfork: "Pitchfork",
        goldenaxe: "Golden Axe", goldenpickaxe: "Golden Pickaxe",
        goldenshovel: "Golden Shovel",
        spear: "Spear", hambat: "Ham Bat", nightsword: "Dark Sword",
        batbat: "Bat Bat", tentaclespike: "Tentacle Spike",
        icestaff: "Ice Staff", firestaff: "Fire Staff",
        panflute: "Pan Flute", blowdart_pipe: "Blow Dart",
        boomerang: "Boomerang", bugnet: "Bug Net",
        armorwood: "Log Suit", armormarble: "Marble Suit",
        armorruins: "Thulecite Suit", armorslurper: "Belt of Hunger",
        footballhat: "Football Helmet", slurtlehat: "Slurtle Shell Armor",
        strawhat: "Straw Hat", tophat: "Top Hat", beefalohat: "Beefalo Hat",
        winterhat: "Winter Hat", earmuffshat: "Rabbit Earmuffs",
        rainhat: "Rain Hat", catcoonhat: "Cat Cap",
        eyebrellahat: "Eyebrella", molehat: "Moggles",
        torch: "Torch", lantern: "Lantern", minerhat: "Miner Hat",
        backpack: "Backpack", piggyback: "Piggyback",
        krampus_sack: "Krampus Sack",
        campfire: "Campfire", firepit: "Fire Pit",
        homesign: "Sign", birdcage: "Birdcage",
        lightning_rod: "Lightning Rod", winterometer: "Thermal Measurer",
        rainometer: "Rain-o-Meter",
        sapling: "Sapling", grass: "Grass Tuft", reeds: "Reeds",
        flower: "Flower", berrybush: "Berry Bush",
        evergreen_tall: "Pine Tree (Tall)", deciduoustree_tall: "Birch (Tall)",
        mandrake: "Mandrake", cactus: "Cactus",
        beefalo: "Beefalo", pigman: "Pig Man", bunnyman: "Bunny Man",
        lightninggoat: "Lightning Goat", tallbird: "Tallbird",
        spider: "Spider", hound: "Hound", killerbee: "Killer Bee",
        adventure_portal: "Adventure Portal", wormhole: "Wormhole",
        cave_entrance: "Cave Entrance", chester_eyebone: "Eye Bone",
        resurrectionstone: "Touch Stone", statueglommer: "Glommer Statue",
        teleportato_base: "Teleportato Base", teleportato_ring: "Teleportato Ring",
        teleportato_crank: "Teleportato Crank", teleportato_box: "Teleportato Box",
        teleportato_potato: "Teleportato Potato Thing",
    };

    function $(sel) { return document.querySelector(sel); }
    function $$(sel) { return document.querySelectorAll(sel); }

    function escapeHTML(str) {
        const div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function showToast(msg, isError) {
        const toast = $("#toast");
        toast.textContent = msg;
        toast.classList.toggle("error", !!isError);
        toast.classList.remove("hidden");
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.add("hidden"), 3000);
    }

    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Uint8Array(reader.result));
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    function detectFileType(filename) {
        const name = filename.toLowerCase();
        if (name === "profile") return "profile";
        if (name === "saveindex") return "saveindex";
        if (name.startsWith("survival") || name.startsWith("adventure") || name.startsWith("shipwrecked")) return "survival";
        if (name === "modindex") return "modindex";
        return null;
    }

    async function loadFile(file, type) {
        const bytes = await readFileAsArrayBuffer(file);

        if (!KleiCodec.isKleiFile(bytes)) {
            throw new Error("Not a valid KLEI save file");
        }

        const decoded = KleiCodec.decode(bytes);
        const payload = KleiCodec.getPayload(decoded);

        if (type === "profile") {
            state.profile.raw = decoded.text;
            state.profile.data = JSON.parse(decoded.text);
            state.profile.filename = file.name;
            updateProfileUI();
            setFileStatus("profile", file.name);
        } else if (type === "saveindex") {
            state.saveindex.raw = payload.data;
            state.saveindex.data = LuaParser.parse(payload.data);
            state.saveindex.filename = file.name;
            updateSaveIndexUI();
            setFileStatus("saveindex", file.name);
        } else if (type === "survival") {
            state.survival.raw = payload.data;
            state.survival.data = LuaParser.parse(payload.data);
            state.survival.filename = file.name;
            updateSurvivalUI();
            setFileStatus("survival", file.name);
        }

        showTabs();
        showToast(`Loaded ${file.name} successfully`);
    }

    function setFileStatus(type, filename) {
        const el = $(`#status-${type}`);
        el.textContent = `Loaded: ${filename}`;
        el.classList.add("loaded");
        $(`#upload-${type}`).classList.add("loaded");
    }

    function showTabs() {
        $("#editor-tabs").classList.remove("hidden");
        $$(".tab").forEach(tab => {
            const panel = tab.dataset.tab;
            if (panel === "console-ref" || panel === "raw-editor") return;
            if (panel === "profile-editor" && !state.profile.data) {
                tab.classList.add("disabled");
            } else {
                tab.classList.remove("disabled");
            }
            if (panel === "saveindex-editor" && !state.saveindex.data) {
                tab.classList.add("disabled");
            } else {
                tab.classList.remove("disabled");
            }
            if (panel === "survival-editor" && !state.survival.data) {
                tab.classList.add("disabled");
            } else {
                tab.classList.remove("disabled");
            }
        });

        const activeTab = $(".tab.active");
        if (activeTab && !activeTab.classList.contains("disabled")) {
            switchTab(activeTab.dataset.tab);
        } else {
            const first = document.querySelector(".tab:not(.disabled)");
            if (first) switchTab(first.dataset.tab);
        }
    }

    function switchTab(tabId) {
        $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
        $$(".editor-panel").forEach(p => p.classList.toggle("hidden", p.id !== tabId));

        if (tabId === "raw-editor") {
            updateRawEditor();
        }
    }

    function updateProfileUI() {
        const d = state.profile.data;
        if (!d) return;

        $("#profile-xp").value = d.xp || 0;
        updateXPHint();
        $("#profile-throne").value = d.characterinthrone || "waxwell";
        $("#profile-renders").value = d.render_quality || 1;
        $("#profile-autosave").value = String(d.autosave !== false);
        $("#profile-starts").value = d.starts || 0;

        buildCharacterGrid();
    }

    function updateXPHint() {
        const xp = parseInt($("#profile-xp").value) || 0;
        const levels = [160, 320, 640, 960, 1280, 1600, 1920];
        const names = ["Willow", "Wolfgang", "Wendy", "WX-78", "Wickerbottom", "Woodie", "Wigfrid"];
        let level = 0;
        for (let i = 0; i < levels.length; i++) {
            if (xp >= levels[i]) level = i + 1;
        }
        const hint = level >= 7
            ? "Max level - all XP characters unlocked"
            : `Level ${level} - Next: ${names[level]} at ${levels[level]} XP`;
        $("#xp-level-hint").textContent = hint;
    }

    function buildCharacterGrid() {
        const grid = $("#character-grid");
        grid.innerHTML = "";
        const d = state.profile.data;
        const unlockedObj = (d.unlocked_characters && typeof d.unlocked_characters === "object" && !Array.isArray(d.unlocked_characters))
            ? d.unlocked_characters : {};

        CHARACTERS.forEach(char => {
            const card = document.createElement("div");
            card.className = "char-card";

            const isUnlocked = char.unlock === "default" || unlockedObj[char.id] === true;

            card.classList.add(isUnlocked ? "unlocked" : "locked");

            let badgeText = "";
            if (char.unlock === "default") badgeText = "DEFAULT";
            else if (char.unlock === "xp") badgeText = isUnlocked ? "UNLOCKED" : `${char.xpNeeded} XP`;
            else if (char.unlock === "adventure") badgeText = isUnlocked ? "UNLOCKED" : "ADVENTURE";

            card.innerHTML = `
                <div class="char-badge">${badgeText}</div>
                <div class="char-name">${char.name}</div>
                <div class="char-id">${char.id}</div>
                <div class="char-desc">${char.desc}</div>
            `;

            if (char.unlock !== "default") {
                card.addEventListener("click", () => {
                    toggleCharacterUnlock(char.id);
                });
                card.title = "Click to toggle unlock";
                card.style.cursor = "pointer";
            }

            grid.appendChild(card);
        });
    }

    function toggleCharacterUnlock(charId) {
        const d = state.profile.data;
        if (!d.unlocked_characters || Array.isArray(d.unlocked_characters)) {
            d.unlocked_characters = {};
        }

        if (d.unlocked_characters[charId]) {
            delete d.unlocked_characters[charId];
        } else {
            d.unlocked_characters[charId] = true;
        }
        buildCharacterGrid();
    }

    function syncXPUnlocks() {
        const d = state.profile.data;
        if (!d) return;
        if (!d.unlocked_characters || Array.isArray(d.unlocked_characters)) {
            d.unlocked_characters = {};
        }
        const xp = d.xp || 0;
        const xpRewards = [
            { xp: 160, id: "willow" },
            { xp: 320, id: "wolfgang" },
            { xp: 640, id: "wendy" },
            { xp: 960, id: "wx78" },
            { xp: 1280, id: "wickerbottom" },
            { xp: 1600, id: "woodie" },
            { xp: 1920, id: "wathgrithr" },
        ];
        for (const reward of xpRewards) {
            if (xp >= reward.xp) {
                d.unlocked_characters[reward.id] = true;
            }
        }
    }

    function collectProfileData() {
        const d = state.profile.data;
        if (!d) return null;
        d.xp = parseInt($("#profile-xp").value) || 0;
        d.characterinthrone = $("#profile-throne").value;
        d.render_quality = parseInt($("#profile-renders").value) || 1;
        d.autosave = $("#profile-autosave").value === "true";
        d.starts = parseInt($("#profile-starts").value) || 0;
        syncXPUnlocks();
        return d;
    }

    function updateSaveIndexUI() {
        const container = $("#saveindex-slots");
        container.innerHTML = "";
        const data = state.saveindex.data;
        if (!data) return;

        const slots = LuaParser.findValue(data, "slots");
        if (!slots || !slots.__luaTable) return;

        slots.entries.forEach((entry, idx) => {
            const slot = entry.value;
            if (!slot.__luaTable) return;

            const character = LuaParser.findValue(slot, "character");
            const currentMode = LuaParser.findValue(slot, "current_mode");
            const casual = LuaParser.findValue(slot, "casual");

            const modes = LuaParser.findValue(slot, "modes");
            const survival = modes ? LuaParser.findValue(modes, "survival") : null;
            const day = survival ? LuaParser.findValue(survival, "day") : null;
            const hasData = day !== null && day.value !== undefined;

            const slotDiv = document.createElement("div");
            slotDiv.className = `save-slot ${hasData ? "active" : "empty"}`;

            let html = `<h3>Slot ${idx + 1}</h3>`;

            if (hasData) {
                const charName = character ? character.value : "wilson";

                html += `
                    <div class="field-grid">
                        <div class="field-row">
                            <label>Character</label>
                            <select data-slot="${idx}" data-field="character">
                                ${CHARACTERS.map(c =>
                                    `<option value="${c.id}" ${c.id === charName ? "selected" : ""}>${c.name} (${c.id})</option>`
                                ).join("")}
                            </select>
                        </div>
                        <div class="field-row">
                            <label>Day</label>
                            <input type="number" min="0" value="${day ? day.value : 0}" data-slot="${idx}" data-field="day">
                        </div>
                        <div class="field-row">
                            <label>Mode</label>
                            <input type="text" value="${currentMode ? currentMode.value : "survival"}" data-slot="${idx}" data-field="current_mode" readonly>
                        </div>
                        <div class="field-row">
                            <label>Casual Mode</label>
                            <select data-slot="${idx}" data-field="casual">
                                <option value="false" ${(!casual || !casual.value) ? "selected" : ""}>No</option>
                                <option value="true" ${(casual && casual.value) ? "selected" : ""}>Yes</option>
                            </select>
                        </div>
                    </div>
                `;

                const dlc = LuaParser.findValue(slot, "dlc");
                if (dlc && dlc.__luaTable) {
                    const rogEntry = dlc.entries.find(e => e.key === "REIGN_OF_GIANTS");
                    const rogEnabled = rogEntry ? rogEntry.value.value : false;
                    html += `
                        <div class="field-row" style="margin-top:10px">
                            <label>Reign of Giants DLC</label>
                            <select data-slot="${idx}" data-field="rog_dlc">
                                <option value="true" ${rogEnabled ? "selected" : ""}>Enabled</option>
                                <option value="false" ${!rogEnabled ? "selected" : ""}>Disabled</option>
                            </select>
                        </div>
                    `;
                }
            } else {
                html += `<p style="color:var(--text-dim)">Empty save slot</p>`;
            }

            slotDiv.innerHTML = html;
            container.appendChild(slotDiv);
        });
    }

    function collectSaveIndexData() {
        const data = state.saveindex.data;
        if (!data) return null;
        const slots = LuaParser.findValue(data, "slots");
        if (!slots || !slots.__luaTable) return data;

        $$("[data-slot][data-field]").forEach(el => {
            const slotIdx = parseInt(el.dataset.slot);
            const field = el.dataset.field;
            const slot = slots.entries[slotIdx];
            if (!slot) return;

            const val = el.value;

            if (field === "character") {
                LuaParser.setValue(slot.value, "character", { type: "string", value: val });
            } else if (field === "day") {
                const modes = LuaParser.findValue(slot.value, "modes");
                if (modes) {
                    const survival = LuaParser.findValue(modes, "survival");
                    if (survival) {
                        LuaParser.setValue(survival, "day", { type: "number", value: parseInt(val) || 0, isFloat: false });
                    }
                }
            } else if (field === "casual") {
                LuaParser.setValue(slot.value, "casual", { type: "boolean", value: val === "true" });
            } else if (field === "rog_dlc") {
                const dlc = LuaParser.findValue(slot.value, "dlc");
                if (dlc && dlc.__luaTable) {
                    const rogEntry = dlc.entries.find(e => e.key === "REIGN_OF_GIANTS");
                    if (rogEntry) {
                        rogEntry.value = { type: "boolean", value: val === "true" };
                    } else if (val === "true") {
                        dlc.entries.push({ keyType: "named", key: "REIGN_OF_GIANTS", value: { type: "boolean", value: true } });
                    }
                }
            }
        });

        return data;
    }

    function updateSurvivalUI() {
        const data = state.survival.data;
        if (!data) return;

        const playerinfo = LuaParser.findValue(data, "playerinfo");
        if (playerinfo && playerinfo.__luaTable) {
            const day = LuaParser.findValue(playerinfo, "day");
            const x = LuaParser.findValue(playerinfo, "x");
            const y = LuaParser.findValue(playerinfo, "y");
            const z = LuaParser.findValue(playerinfo, "z");

            $("#surv-day").value = day ? day.value : 0;
            $("#surv-x").value = x ? x.value : 0;
            $("#surv-y").value = y ? y.value : 0;
            $("#surv-z").value = z ? z.value : 0;
        }

        const meta = LuaParser.findValue(data, "meta");
        if (meta && meta.__luaTable) {
            const seed = LuaParser.findValue(meta, "seed");
            const levelId = LuaParser.findValue(meta, "level_id");

            $("#surv-seed").value = seed ? seed.value : "";
            $("#surv-levelid").value = levelId ? levelId.value : "";
        }

        updateEntityList();
    }

    function updateEntityList() {
        const container = $("#entity-list");
        container.innerHTML = "";
        const data = state.survival.data;
        if (!data) return;

        const ents = LuaParser.findValue(data, "ents");
        if (!ents || !ents.__luaTable) return;

        const filter = ($("#entity-search").value || "").toLowerCase();

        const sortedEntries = [...ents.entries].sort((a, b) => {
            const aName = String(a.key).toLowerCase();
            const bName = String(b.key).toLowerCase();
            return aName.localeCompare(bName);
        });

        let count = 0;
        for (const entry of sortedEntries) {
            const name = String(entry.key);
            if (filter && !name.toLowerCase().includes(filter)) continue;

            const entityCount = entry.value.__luaTable ? entry.value.entries.length : 1;
            const displayName = PREFABS[name] || name.replace(/_/g, " ");
            const safeName = escapeHTML(name);
            const safeDisplay = escapeHTML(displayName);

            const item = document.createElement("div");
            item.className = "entity-item";
            item.innerHTML = `
                <div class="entity-info">
                    <span class="entity-type">${safeDisplay}</span>
                    <span class="entity-count">${entityCount} instance${entityCount !== 1 ? "s" : ""}</span>
                    <span class="entity-count" style="font-family:monospace;font-size:0.75rem">${safeName}</span>
                </div>
                <div class="entity-actions">
                    <button data-entity="${safeName}" data-action="duplicate" title="Duplicate all instances">Duplicate</button>
                    <button data-entity="${safeName}" data-action="remove" class="danger" title="Remove all instances">Remove</button>
                </div>
            `;
            container.appendChild(item);
            count++;
        }

        if (count === 0) {
            container.innerHTML = `<div class="entity-item"><span style="color:var(--text-dim)">No entities found</span></div>`;
        }
    }

    function addEntity(type, x, z) {
        const data = state.survival.data;
        if (!data) return;

        let ents = LuaParser.findValue(data, "ents");
        if (!ents || !ents.__luaTable) return;

        let entityEntry = ents.entries.find(e => e.key === type);
        if (!entityEntry) {
            const newTable = { __luaTable: true, entries: [] };
            entityEntry = { keyType: "named", key: type, value: newTable };
            ents.entries.push(entityEntry);
        }

        const instance = {
            __luaTable: true,
            entries: [
                { keyType: "named", key: "x", value: { type: "number", value: x, isFloat: x % 1 !== 0 } },
                { keyType: "named", key: "z", value: { type: "number", value: z, isFloat: z % 1 !== 0 } }
            ]
        };

        entityEntry.value.entries.push({ keyType: "auto", key: entityEntry.value.entries.length + 1, value: instance });
        updateEntityList();
        showToast(`Added ${PREFABS[type] || type} at (${x}, ${z})`);
    }

    function removeEntity(type) {
        const data = state.survival.data;
        if (!data) return;

        const ents = LuaParser.findValue(data, "ents");
        if (!ents || !ents.__luaTable) return;

        const idx = ents.entries.findIndex(e => e.key === type);
        if (idx >= 0) {
            ents.entries.splice(idx, 1);
            updateEntityList();
            showToast(`Removed all ${PREFABS[type] || type}`);
        }
    }

    function duplicateEntity(type) {
        const data = state.survival.data;
        if (!data) return;

        const ents = LuaParser.findValue(data, "ents");
        if (!ents || !ents.__luaTable) return;

        const entityEntry = ents.entries.find(e => e.key === type);
        if (!entityEntry || !entityEntry.value.__luaTable) return;

        const existing = entityEntry.value.entries;
        const newEntries = existing.map(e => {
            const cloned = JSON.parse(JSON.stringify(e.value));
            if (cloned.__luaTable) {
                const xEntry = cloned.entries.find(en => en.key === "x");
                if (xEntry && xEntry.value.type === "number") {
                    xEntry.value.value += 4;
                }
            }
            return { keyType: "auto", key: existing.length + 1, value: cloned };
        });

        entityEntry.value.entries.push(...newEntries);
        updateEntityList();
        showToast(`Duplicated ${existing.length} ${PREFABS[type] || type} instances`);
    }

    function collectSurvivalData() {
        const data = state.survival.data;
        if (!data) return data;

        const playerinfo = LuaParser.findValue(data, "playerinfo");
        if (playerinfo && playerinfo.__luaTable) {
            LuaParser.setValue(playerinfo, "day", { type: "number", value: parseInt($("#surv-day").value) || 0, isFloat: false });
            LuaParser.setValue(playerinfo, "x", { type: "number", value: parseFloat($("#surv-x").value) || 0, isFloat: true });
            LuaParser.setValue(playerinfo, "y", { type: "number", value: parseFloat($("#surv-y").value) || 0, isFloat: true });
            LuaParser.setValue(playerinfo, "z", { type: "number", value: parseFloat($("#surv-z").value) || 0, isFloat: true });
        }

        const meta = LuaParser.findValue(data, "meta");
        if (meta && meta.__luaTable) {
            const seedVal = parseInt($("#surv-seed").value);
            if (!isNaN(seedVal)) {
                LuaParser.setValue(meta, "seed", { type: "number", value: seedVal, isFloat: false });
            }
            LuaParser.setValue(meta, "level_id", { type: "string", value: $("#surv-levelid").value });
        }

        return data;
    }

    function updateRawEditor() {
        const tab = state.currentRawTab;
        const textarea = $("#raw-textarea");

        if (tab === "profile" && state.profile.data) {
            textarea.value = JSON.stringify(state.profile.data, null, 2);
        } else if (tab === "saveindex" && state.saveindex.data) {
            textarea.value = LuaParser.prettyPrint(state.saveindex.data);
        } else if (tab === "survival" && state.survival.data) {
            textarea.value = LuaParser.prettyPrint(state.survival.data);
        } else {
            textarea.value = `No ${tab} file loaded. Upload the file first.`;
        }
    }

    function applyRawChanges() {
        const tab = state.currentRawTab;
        const text = $("#raw-textarea").value;

        try {
            if (tab === "profile") {
                state.profile.data = JSON.parse(text);
                state.profile.raw = text;
                updateProfileUI();
                showToast("Profile raw data applied");
            } else if (tab === "saveindex") {
                state.saveindex.data = LuaParser.parse(text);
                state.saveindex.raw = text;
                updateSaveIndexUI();
                showToast("Save index raw data applied");
            } else if (tab === "survival") {
                state.survival.data = LuaParser.parse(text);
                state.survival.raw = text;
                updateSurvivalUI();
                showToast("Survival raw data applied");
            }
        } catch (e) {
            showToast("Parse error: " + e.message, true);
        }
    }

    function saveProfile() {
        const d = collectProfileData();
        if (!d) { showToast("No profile loaded", true); return; }
        const json = JSON.stringify(d);
        const encoded = KleiCodec.encode(json);
        downloadFile(encoded, state.profile.filename);
        showToast("Profile saved! Replace the original file on your device.");
    }

    function saveSaveIndex() {
        const d = collectSaveIndexData();
        if (!d) { showToast("No save index loaded", true); return; }
        const lua = "return " + LuaParser.serialize(d);
        const encoded = KleiCodec.encode(lua);
        downloadFile(encoded, state.saveindex.filename);
        showToast("Save index saved! Replace the original file on your device.");
    }

    function saveSurvival() {
        const d = collectSurvivalData();
        if (!d) { showToast("No survival save loaded", true); return; }
        const lua = "return " + LuaParser.serialize(d);
        const encoded = KleiCodec.encode(lua);
        downloadFile(encoded, state.survival.filename);
        showToast("Survival save saved! Replace the original file on your device.");
    }

    function saveRawFile() {
        const tab = state.currentRawTab;
        const text = $("#raw-textarea").value;

        let content, filename;
        if (tab === "profile") {
            content = KleiCodec.encode(text);
            filename = state.profile.filename || "profile";
        } else if (tab === "saveindex") {
            content = KleiCodec.encode("return " + text);
            filename = state.saveindex.filename || "saveindex";
        } else if (tab === "survival") {
            content = KleiCodec.encode("return " + text);
            filename = state.survival.filename || "survival_1";
        }

        if (content) {
            downloadFile(content, filename);
            showToast(`${filename} downloaded`);
        }
    }

    function buildPrefabGrid() {
        const grid = $("#prefab-grid");
        if (!grid) return;

        const sorted = Object.entries(PREFABS).sort((a, b) => a[1].localeCompare(b[1]));
        grid.innerHTML = sorted.map(([id, name]) =>
            `<div class="prefab-item"><span class="prefab-name">${id}</span><span class="prefab-label">${name}</span></div>`
        ).join("");
    }

    function setupCommandCopy() {
        document.addEventListener("click", (e) => {
            if (e.target.tagName === "CODE" && e.target.closest(".command")) {
                navigator.clipboard.writeText(e.target.textContent).then(() => {
                    showToast("Command copied to clipboard");
                }).catch(() => {
                    const range = document.createRange();
                    range.selectNode(e.target);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    showToast("Command selected - press Ctrl+C to copy");
                });
            }
        });
    }

    function bindEvents() {
        $("#file-profile").addEventListener("change", async (e) => {
            if (e.target.files[0]) {
                try { await loadFile(e.target.files[0], "profile"); }
                catch (err) { showToast("Error: " + err.message, true); }
            }
        });

        $("#file-saveindex").addEventListener("change", async (e) => {
            if (e.target.files[0]) {
                try { await loadFile(e.target.files[0], "saveindex"); }
                catch (err) { showToast("Error: " + err.message, true); }
            }
        });

        $("#file-survival").addEventListener("change", async (e) => {
            if (e.target.files[0]) {
                try { await loadFile(e.target.files[0], "survival"); }
                catch (err) { showToast("Error: " + err.message, true); }
            }
        });

        $("#file-bulk").addEventListener("change", async (e) => {
            for (const file of e.target.files) {
                const type = detectFileType(file.name);
                if (type && type !== "modindex") {
                    try { await loadFile(file, type); }
                    catch (err) { showToast(`Error loading ${file.name}: ${err.message}`, true); }
                }
            }
        });

        $$(".tab").forEach(tab => {
            tab.addEventListener("click", () => {
                if (tab.classList.contains("disabled")) return;
                switchTab(tab.dataset.tab);
            });
        });

        $$(".raw-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                $$(".raw-tab").forEach(t => t.classList.toggle("active", t === tab));
                state.currentRawTab = tab.dataset.raw;
                updateRawEditor();
            });
        });

        $$(".preset-btn[data-xp]").forEach(btn => {
            btn.addEventListener("click", () => {
                $("#profile-xp").value = btn.dataset.xp;
                updateXPHint();
                if (state.profile.data) {
                    state.profile.data.xp = parseInt(btn.dataset.xp);
                    syncXPUnlocks();
                    buildCharacterGrid();
                }
            });
        });

        $("#profile-xp").addEventListener("input", () => {
            updateXPHint();
            if (state.profile.data) {
                state.profile.data.xp = parseInt($("#profile-xp").value) || 0;
                syncXPUnlocks();
                buildCharacterGrid();
            }
        });

        $("#unlock-all-chars").addEventListener("click", () => {
            if (!state.profile.data) return;
            state.profile.data.unlocked_characters = {
                willow: true, wolfgang: true, wendy: true, wx78: true,
                wickerbottom: true, woodie: true, wes: true, waxwell: true,
                wathgrithr: true, webber: true
            };
            state.profile.data.xp = 1920;
            $("#profile-xp").value = 1920;
            updateXPHint();
            buildCharacterGrid();
            showToast("All characters unlocked!");
        });

        $("#lock-all-chars").addEventListener("click", () => {
            if (!state.profile.data) return;
            state.profile.data.unlocked_characters = {};
            state.profile.data.xp = 0;
            $("#profile-xp").value = 0;
            updateXPHint();
            buildCharacterGrid();
            showToast("Characters reset to default");
        });

        $("#save-profile").addEventListener("click", saveProfile);
        $("#save-saveindex").addEventListener("click", saveSaveIndex);
        $("#save-survival").addEventListener("click", saveSurvival);
        $("#apply-raw").addEventListener("click", applyRawChanges);
        $("#save-raw").addEventListener("click", saveRawFile);

        $("#entity-search").addEventListener("input", updateEntityList);

        $("#entity-list").addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;
            const entity = btn.dataset.entity;
            const action = btn.dataset.action;
            if (action === "remove") removeEntity(entity);
            else if (action === "duplicate") duplicateEntity(entity);
        });

        $("#add-entity-btn").addEventListener("click", () => {
            if (!state.survival.data) {
                showToast("Load a survival save first", true);
                return;
            }
            const type = $("#new-entity-type").value;
            const x = parseFloat($("#new-entity-x").value) || 0;
            const z = parseFloat($("#new-entity-z").value) || 0;
            addEntity(type, x, z);
        });

        $("#add-entity-at-player").addEventListener("click", () => {
            if (!state.survival.data) {
                showToast("Load a survival save first", true);
                return;
            }
            const type = $("#new-entity-type").value;
            const x = parseFloat($("#surv-x").value) || 0;
            const z = parseFloat($("#surv-z").value) || 0;
            addEntity(type, x, z);
        });
    }

    function init() {
        bindEvents();
        buildPrefabGrid();
        setupCommandCopy();
    }

    document.addEventListener("DOMContentLoaded", init);
})();
