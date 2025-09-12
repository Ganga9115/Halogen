// src/components/utils/leaderboardStorage.js
const STORAGE_KEY = "halogen_users_v1";

function safeParse(json) {
  try {
    return JSON.parse(json) || [];
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function loadUsers() {
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function makeKey(name = "", school = "", className = "") {
  return `${(name || "").trim().toLowerCase()}|${(school || "")
    .trim()
    .toLowerCase()}|${(className || "").trim().toLowerCase()}`;
}

/**
 * Save a game result locally.
 * - name, school are required (use 'Anonymous' / 'Unknown' fallback if empty)
 * - className optional
 * - score should be numeric
 * - game is optional (string label)
 */
export function saveResult({ name, school, className = "", score = 0, game = "" }) {
  name = (name || "Anonymous").trim();
  school = (school || "Unknown School").trim();
  className = (className || "").trim();
  score = Number(score) || 0;

  const users = loadUsers();
  const key = makeKey(name, school, className);
  const ts = Date.now();

  let user = users.find((u) => u.key === key);
  if (user) {
    // add to cumulative score and push history
    user.score = Number(user.score || 0) + score;
    user.history = user.history || [];
    user.history.push({ score, game, ts });
  } else {
    user = {
      id: `u_${ts}`,
      key,
      name,
      school,
      className,
      score,
      history: [{ score, game, ts }],
    };
    users.push(user);
  }

  saveUsers(users);
  // notify listeners (same-tab)
  window.dispatchEvent(new Event("leaderboardUpdated"));
  return user;
}

export function getTopStudents(limit = 10) {
  const users = loadUsers();
  return users
    .slice()
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
    .slice(0, limit)
    .map((u) => ({ id: u.id, name: u.name, school: u.school, className: u.className, score: u.score }));
}

export function getTopSchools(limit = 10) {
  const users = loadUsers();
  const map = {};
  users.forEach((u) => {
    const sc = u.school || "Unknown School";
    map[sc] = (map[sc] || 0) + (Number(u.score) || 0);
  });
  const arr = Object.entries(map).map(([school, points]) => ({ school, points }));
  return arr.sort((a, b) => b.points - a.points).slice(0, limit);
}

export function clearLeaderboard() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("leaderboardUpdated"));
}

export function exportData() {
  const data = JSON.stringify(loadUsers(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leaderboard.json";
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * importData(jsonString, { merge: true })
 * - merge=true will add scores to existing users (matching by key)
 * - merge=false will replace stored users
 */
export function importData(jsonString, { merge = true } = {}) {
  let incoming;
  try {
    incoming = JSON.parse(jsonString);
  } catch (e) {
    throw new Error("Invalid JSON");
  }
  if (!Array.isArray(incoming)) throw new Error("Imported JSON must be an array of user objects");

  if (!merge) {
    saveUsers(incoming);
    window.dispatchEvent(new Event("leaderboardUpdated"));
    return;
  }

  const existing = loadUsers();
  const map = {};
  existing.forEach((u) => (map[u.key] = u));

  incoming.forEach((n) => {
    // ensure there is a key (if missing, build it)
    if (!n.key) n.key = makeKey(n.name || "Anonymous", n.school || "Unknown School", n.className || "");
    if (map[n.key]) {
      map[n.key].score = Number(map[n.key].score || 0) + Number(n.score || 0);
      map[n.key].history = (map[n.key].history || []).concat(n.history || []);
    } else {
      map[n.key] = n;
    }
  });

  saveUsers(Object.values(map));
  window.dispatchEvent(new Event("leaderboardUpdated"));
}
