// Placement Preparation Portal — local authentication.
//
// Everything is stored in the browser's localStorage as JSON:
//   cc-users    -> [{ id, name, email, salt, hash, createdAt }]
//   cc-session  -> { id, email, loggedInAt }
//   cc-resets   -> { [token]: { email, expires } }
//
// Passwords are never stored as plain text: each user gets a random salt and the
// password is hashed with PBKDF2 (SHA-256). NOTE: this is a front-end prototype —
// localStorage lives in the user's own browser, so this is NOT real security.
// Swap this module for a real backend when you add one; the function names below
// are the only thing script.js depends on.

const USERS_KEY = "cc-users";
const SESSION_KEY = "cc-session";
const RESETS_KEY = "cc-resets";
const PBKDF2_ITERATIONS = 100000;
const RESET_TTL_MS = 15 * 60 * 1000; // reset links live for 15 minutes
const MIN_PASSWORD = 6;

export const AUTH_EVENT = "cc-auth-change";

/* ------------------------------------------------------------- storage -- */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    throw new Error("Could not save data. Please allow site storage in your browser.");
  }
}

function getUsers() {
  const users = readJSON(USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

/* -------------------------------------------------------------- hashing -- */
function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

async function hashPassword(password, saltHex) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Secure hashing needs https or localhost. Open the site over https.");
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: fromHex(saltHex), iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return toHex(bits);
}

function randomHex(bytes) {
  return toHex(crypto.getRandomValues(new Uint8Array(bytes)));
}

/* ------------------------------------------------------------ validation -- */
function normaliseEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function assertEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
}

function cleanName(name) {
  const n = String(name || "").trim().replace(/\s+/g, " ");
  if (n.length < 2) throw new Error("Please enter your full name.");
  return n.slice(0, 60);
}

function displayName(user) {
  // Accounts made before names existed fall back to the part of the email before "@".
  return user.name || user.email.split("@")[0];
}

function assertPassword(password) {
  if (String(password || "").length < MIN_PASSWORD) {
    throw new Error("Password must be at least " + MIN_PASSWORD + " characters long.");
  }
}

/* --------------------------------------------------------------- session -- */
function notify() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function startSession(user) {
  writeJSON(SESSION_KEY, { id: user.id, email: user.email, loggedInAt: Date.now() });
  notify();
}

export function getCurrentUser() {
  const session = readJSON(SESSION_KEY, null);
  if (!session || !session.email) return null;
  // The session is only valid while the account it points at still exists.
  const user = getUsers().find((u) => u.id === session.id);
  return user ? { id: user.id, email: user.email, name: displayName(user) } : null;
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    /* ignore */
  }
  notify();
}

/* ------------------------------------------------------------------- api -- */
export async function register(nameInput, emailInput, password) {
  const name = cleanName(nameInput);
  const email = normaliseEmail(emailInput);
  assertEmail(email);
  assertPassword(password);

  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists. Try logging in.");
  }

  const salt = randomHex(16);
  const user = {
    id: randomHex(8),
    name: name,
    email: email,
    salt: salt,
    hash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeJSON(USERS_KEY, users);
  startSession(user);
  return { id: user.id, email: user.email, name: user.name };
}

export async function login(emailInput, password) {
  const email = normaliseEmail(emailInput);
  const user = getUsers().find((u) => u.email === email);
  // Same message for "no such user" and "wrong password" on purpose.
  const invalid = new Error("Invalid email or password. Please try again.");
  if (!user) throw invalid;
  const hash = await hashPassword(String(password || ""), user.salt);
  if (hash !== user.hash) throw invalid;
  startSession(user);
  return { id: user.id, email: user.email, name: displayName(user) };
}

// There is no mail server in a front-end prototype, so instead of emailing a link
// this returns a short-lived reset token that the app opens straight away.
export function requestPasswordReset(emailInput) {
  const email = normaliseEmail(emailInput);
  assertEmail(email);
  if (!getUsers().some((u) => u.email === email)) {
    throw new Error("No account found with that email address.");
  }
  const resets = readJSON(RESETS_KEY, {});
  const now = Date.now();
  Object.keys(resets).forEach((t) => {
    if (!resets[t] || resets[t].expires < now) delete resets[t];
  });
  const token = randomHex(16);
  resets[token] = { email: email, expires: now + RESET_TTL_MS };
  writeJSON(RESETS_KEY, resets);
  return token;
}

export function isResetTokenValid(token) {
  const resets = readJSON(RESETS_KEY, {});
  const entry = resets[token];
  return Boolean(entry && entry.expires > Date.now());
}

export async function resetPassword(token, newPassword) {
  assertPassword(newPassword);
  const resets = readJSON(RESETS_KEY, {});
  const entry = resets[token];
  if (!entry || entry.expires < Date.now()) {
    throw new Error("This reset link has expired. Please request a new one.");
  }
  const users = getUsers();
  const user = users.find((u) => u.email === entry.email);
  if (!user) throw new Error("Account not found.");

  user.salt = randomHex(16);
  user.hash = await hashPassword(newPassword, user.salt);
  writeJSON(USERS_KEY, users);

  delete resets[token];
  writeJSON(RESETS_KEY, resets);
}
