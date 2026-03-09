(function (global) {
  "use strict";

  const KEY_ACTIVE = "LL:activeProfileId";
  const KEY_PROFILES = "LL:profiles";

  function profileKey(id) {
    return `LL:profile:${String(id || "").trim()}:state`;
  }

  function parseJson(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeProfiles(input) {
    if (!Array.isArray(input)) return [];
    const out = [];
    const seen = new Set();
    for (const row of input) {
      if (!row || typeof row !== "object") continue;
      const id = String(row.id || "").trim();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      out.push({
        id,
        name: String(row.name || "Gast").trim() || "Gast",
        createdAt: Number(row.createdAt) || Date.now(),
        updatedAt: Number(row.updatedAt) || Number(row.createdAt) || Date.now(),
      });
    }
    return out;
  }

  function listProfiles() {
    const rows = parseJson(localStorage.getItem(KEY_PROFILES), []);
    const normalized = normalizeProfiles(rows);
    if (JSON.stringify(rows) !== JSON.stringify(normalized)) {
      try {
        saveJson(KEY_PROFILES, normalized);
      } catch (_) {}
    }
    return normalized;
  }

  function writeProfiles(profiles) {
    saveJson(KEY_PROFILES, normalizeProfiles(profiles));
  }

  function makeProfileId() {
    return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function touchProfile(id) {
    const pid = String(id || "").trim();
    if (!pid) return;
    const list = listProfiles();
    const idx = list.findIndex((p) => p.id === pid);
    if (idx < 0) return;
    list[idx] = { ...list[idx], updatedAt: Date.now() };
    try {
      writeProfiles(list);
    } catch (_) {}
  }

  function createProfile(name) {
    const list = listProfiles();
    const profile = {
      id: makeProfileId(),
      name: String(name || "Gast").trim() || "Gast",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    list.push(profile);
    writeProfiles(list);
    return profile.id;
  }

  function setActiveProfile(id) {
    const pid = String(id || "").trim();
    if (!pid) return false;
    const exists = listProfiles().some((p) => p.id === pid);
    if (!exists) return false;
    localStorage.setItem(KEY_ACTIVE, pid);
    touchProfile(pid);
    return true;
  }

  function getActiveProfile() {
    const pid = String(localStorage.getItem(KEY_ACTIVE) || "").trim();
    if (!pid) return null;
    const exists = listProfiles().some((p) => p.id === pid);
    return exists ? pid : null;
  }

  function logoutProfile() {
    localStorage.removeItem(KEY_ACTIVE);
  }

  function normalizeLoadedProfileState(input) {
    const state = input && typeof input === "object" ? input : null;
    if (!state) return null;
    if (!state.settings || typeof state.settings !== "object") state.settings = {};

    const s = state.settings;
    if (s.ttsMode == null && state.ttsMode != null) s.ttsMode = state.ttsMode;
    if (state.ttsMode == null && s.ttsMode != null) state.ttsMode = s.ttsMode;

    const rawTtsMode = s.ttsMode != null ? s.ttsMode : state.ttsMode;
    const rawTts = s.tts;
    let ttsMode = rawTtsMode != null ? rawTtsMode : rawTts;

    if (typeof ttsMode === "boolean") ttsMode = ttsMode ? "both" : "off";
    if (typeof ttsMode === "number") ttsMode = ttsMode > 0 ? "both" : "off";
    ttsMode = String(ttsMode == null ? "" : ttsMode).trim().toLowerCase();
    const modeMap = {
      off: "off",
      none: "off",
      "0": "off",
      false: "off",
      front: "front",
      de: "front",
      src: "front",
      source: "front",
      back: "back",
      en: "back",
      dst: "back",
      target: "back",
      both: "both",
      on: "both",
      "1": "both",
      true: "both",
    };
    const normMode = modeMap[ttsMode] || "both";
    s.ttsMode = normMode;
    state.ttsMode = normMode;
    // App uses `settings.tts` select values off|de|en|both.
    s.tts = normMode === "front" ? "de" : (normMode === "back" ? "en" : normMode);

    if (s.ttsRate == null && state.ttsRate != null) s.ttsRate = state.ttsRate;
    if (state.ttsRate == null && s.ttsRate != null) state.ttsRate = s.ttsRate;
    const rawSpeed = s.speed != null ? s.speed : (s.rate != null ? s.rate : (s.ttsRate != null ? s.ttsRate : state.ttsRate));
    const speed = Number(rawSpeed);
    s.speed = Number.isFinite(speed) && speed > 0 ? speed : 1;
    if ("rate" in s) s.rate = s.speed;
    s.ttsRate = s.speed;
    state.ttsRate = s.speed;

    // Do not carry voiceName-like persisted bindings across devices/profiles.
    for (const k of ["voiceName", "ttsVoiceName", "selectedVoice", "voice", "voiceId"]) {
      if (k in s) delete s[k];
    }
    return state;
  }

  function loadProfileState(profileId) {
    const pid = String(profileId || "").trim();
    if (!pid) return null;
    const payload = parseJson(localStorage.getItem(profileKey(pid)), null);
    if (!payload || typeof payload !== "object") return null;
    if ("state" in payload) return normalizeLoadedProfileState(payload.state || null);
    return null;
  }

  function saveProfileState(profileId, state) {
    const pid = String(profileId || "").trim();
    if (!pid) return false;
    const payload = {
      schema: 1,
      savedAt: Date.now(),
      state: state && typeof state === "object" ? state : {},
    };
    localStorage.setItem(profileKey(pid), JSON.stringify(payload));
    touchProfile(pid);
    return true;
  }

  function debounce(fn, ms) {
    let timer = 0;
    return function debounced() {
      const ctx = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        timer = 0;
        fn.apply(ctx, args);
      }, Math.max(0, Number(ms) || 0));
    };
  }

  global.LLPersistence = {
    KEY_ACTIVE,
    KEY_PROFILES,
    profileKey,
    listProfiles,
    createProfile,
    setActiveProfile,
    getActiveProfile,
    logoutProfile,
    loadProfileState,
    saveProfileState,
    debounce,
  };
})(window);
