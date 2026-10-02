import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, updateDoc,
  query, where, orderBy, onSnapshot,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

// ---- local-storage demo-mode fallback -------------------------------
const LS = {
  users: "ihde_users",
  documents: "ihde_documents",
  content: "ihde_content",
  inquiries: "ihde_inquiries",
  tasks: "ihde_tasks",
  kpi: "ihde_kpi",
  campaigns: "ihde_campaigns",
  donations: "ihde_donations",
};
function lsGet(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function lsSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function uid() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// =====================================================================
// GENERIC COLLECTION HELPERS
// =====================================================================
async function listAll(collectionName, lsKey, orderField) {
  if (!isFirebaseConfigured) {
    const all = lsGet(lsKey);
    return orderField ? [...all].sort((a, b) => (a[orderField] > b[orderField] ? -1 : 1)) : all;
  }
  const q = orderField
    ? query(collection(db, collectionName), orderBy(orderField, "desc"))
    : collection(db, collectionName);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function createItem(collectionName, lsKey, data) {
  const record = { ...data, createdAt: new Date().toISOString() };
  if (!isFirebaseConfigured) {
    const all = lsGet(lsKey);
    const item = { id: uid(), ...record };
    all.push(item);
    lsSet(lsKey, all);
    return item;
  }
  const ref = await addDoc(collection(db, collectionName), record);
  return { id: ref.id, ...record };
}

async function updateItem(collectionName, lsKey, id, patch) {
  if (!isFirebaseConfigured) {
    const all = lsGet(lsKey);
    const idx = all.findIndex((x) => x.id === id);
    if (idx >= 0) all[idx] = { ...all[idx], ...patch };
    lsSet(lsKey, all);
    return;
  }
  await updateDoc(doc(db, collectionName, id), patch);
}

async function removeItem(collectionName, lsKey, id) {
  if (!isFirebaseConfigured) {
    lsSet(lsKey, lsGet(lsKey).filter((x) => x.id !== id));
    return;
  }
  await deleteDoc(doc(db, collectionName, id));
}

// =====================================================================
// USERS / PROFILES
// =====================================================================
export async function upsertUserProfile(uidVal, data) {
  if (!isFirebaseConfigured) {
    const all = lsGet(LS.users);
    const idx = all.findIndex((u) => u.uid === uidVal);
    if (idx >= 0) all[idx] = { ...all[idx], ...data };
    else all.push({ uid: uidVal, ...data });
    lsSet(LS.users, all);
    return;
  }
  await setDoc(doc(db, "users", uidVal), data, { merge: true });
}
export async function getUserProfile(uidVal) {
  if (!isFirebaseConfigured) {
    return lsGet(LS.users).find((u) => u.uid === uidVal) || null;
  }
  const snap = await getDoc(doc(db, "users", uidVal));
  return snap.exists() ? { uid: uidVal, ...snap.data() } : null;
}
export async function getAllUsers() {
  return listAll("users", LS.users);
}

// =====================================================================
// DOCUMENT LIBRARY  (Blueprint + 20 implementation docs + future uploads)
// =====================================================================
export const DOC_CATEGORIES = [
  "Master Blueprint", "Team Manual", "SOP", "Policy", "Curriculum",
  "Form / Template", "Strategy", "Campaign Manual", "Other",
];
export const getDocuments = () => listAll("documents", LS.documents, "createdAt");
export const addDocument = (data) => createItem("documents", LS.documents, data);
export const deleteDocument = (id) => removeItem("documents", LS.documents, id);

// The compiled Blueprint PDF is hosted at this path (served from public/)
// with one entry per document, deep-linked to its exact page via the
// #page= fragment most PDF viewers honor (desktop/Chrome reliably;
// some mobile viewers ignore it and just open at page 1 — still usable).
const BLUEPRINT_PDF = "/documents/Ignite_Hope_Master_Blueprint.pdf";
export const STANDARD_LIBRARY = [
  { title: "Master Blueprint — Edition 1.0", category: "Master Blueprint", url: `${BLUEPRINT_PDF}#page=1` },
  { title: "1. Ignite Hope Digital Evangelism Team Manual", category: "Team Manual", url: `${BLUEPRINT_PDF}#page=34` },
  { title: "2. Digital Bible Worker Manual", category: "Team Manual", url: `${BLUEPRINT_PDF}#page=36` },
  { title: "3. Digital Missionary Training Manual", category: "Team Manual", url: `${BLUEPRINT_PDF}#page=38` },
  { title: "4. Content Creation SOP", category: "SOP", url: `${BLUEPRINT_PDF}#page=39` },
  { title: "5. Bible Study Follow-Up SOP", category: "SOP", url: `${BLUEPRINT_PDF}#page=41` },
  { title: "6. Digital Safeguarding Policy", category: "Policy", url: `${BLUEPRINT_PDF}#page=42` },
  { title: "7. Ignite Hope 90-Day Launch Calendar", category: "Other", url: `${BLUEPRINT_PDF}#page=44` },
  { title: "8. Digital Bible School Curriculum", category: "Curriculum", url: `${BLUEPRINT_PDF}#page=45` },
  { title: "9. Content Calendar Template", category: "Form / Template", url: `${BLUEPRINT_PDF}#page=47` },
  { title: "10. Bible Study Registration Form", category: "Form / Template", url: `${BLUEPRINT_PDF}#page=48` },
  { title: "11. Bible Worker Follow-Up Form", category: "Form / Template", url: `${BLUEPRINT_PDF}#page=49` },
  { title: "12. Digital Missionary Registration Form", category: "Form / Template", url: `${BLUEPRINT_PDF}#page=50` },
  { title: "13. Content Review Form", category: "Form / Template", url: `${BLUEPRINT_PDF}#page=52` },
  { title: "14. Digital Evangelism KPI Dashboard", category: "Other", url: `${BLUEPRINT_PDF}#page=53` },
  { title: "15. Ignite Hope AI-Assisted Ministry SOP", category: "SOP", url: `${BLUEPRINT_PDF}#page=54` },
  { title: "16. 21 Days With Jesus Campaign Manual", category: "Campaign Manual", url: `${BLUEPRINT_PDF}#page=56` },
  { title: "17. YouTube Evangelism Strategy", category: "Strategy", url: `${BLUEPRINT_PDF}#page=57` },
  { title: "18. WhatsApp Evangelism Strategy", category: "Strategy", url: `${BLUEPRINT_PDF}#page=58` },
  { title: "19. Telegram Bible School Strategy", category: "Strategy", url: `${BLUEPRINT_PDF}#page=59` },
  { title: "20. Local Church Integration Protocol", category: "Policy", url: `${BLUEPRINT_PDF}#page=60` },
];
export async function seedStandardLibrary() {
  const existing = await getDocuments();
  const existingTitles = new Set(existing.map((d) => d.title));
  const toAdd = STANDARD_LIBRARY.filter((d) => !existingTitles.has(d.title));
  for (const doc of toAdd) {
    await addDocument(doc);
  }
  return toAdd.length;
}

// =====================================================================
// CONTENT CALENDAR  (Content Creation SOP pipeline)
// =====================================================================
export const CONTENT_PILLARS = ["Christ", "Bible Truth", "Christian Experience", "Health", "Hope", "Mission"];
export const LADDER_LEVELS = ["1 — Hook", "2 — Answer", "3 — Study", "4 — Course", "5 — Personal Study", "6 — Discipleship"];
export const CONTENT_STATUSES = ["Idea", "Scripted", "In Review", "In Production", "Scheduled", "Published", "Repurposed"];
export const getContentItems = () => listAll("content", LS.content, "createdAt");
export const addContentItem = (data) => createItem("content", LS.content, { status: "Idea", ...data });
export const updateContentItem = (id, patch) => updateItem("content", LS.content, id, patch);
export const deleteContentItem = (id) => removeItem("content", LS.content, id);

// =====================================================================
// FOLLOW-UP CRM  (the 10-status Bible Study pipeline)
// =====================================================================
export const FOLLOWUP_STATUSES = [
  "New inquiry", "Contact attempted", "Contact established", "Study scheduled",
  "Study active", "Study completed", "Decision/response",
  "Connected to local church", "Continuing discipleship", "Digital missionary",
];
export const getInquiries = () => listAll("inquiries", LS.inquiries, "createdAt");
export const submitInquiry = (data) => createItem("inquiries", LS.inquiries, { status: FOLLOWUP_STATUSES[0], ...data });
export const updateInquiry = (id, patch) => updateItem("inquiries", LS.inquiries, id, patch);
export const logContactAttempt = async (id, note) => {
  const all = await getInquiries();
  const item = all.find((x) => x.id === id);
  const log = item?.contactLog || [];
  log.push({ date: new Date().toISOString(), note });
  await updateInquiry(id, { contactLog: log });
};

// =====================================================================
// TEAM WORKSPACES
// =====================================================================
export const TEAMS = [
  "Digital Evangelism Director", "Spiritual/Theological Director", "Content Director",
  "Research", "Script", "Production", "Design", "Distribution", "Engagement",
  "Bible Worker", "Prayer", "Data/Analytics", "Safeguarding/Moderation",
];
export const TASK_STATUSES = ["To Do", "In Progress", "Blocked", "Done"];
export const getTasks = () => listAll("tasks", LS.tasks, "createdAt");
export const addTask = (data) => createItem("tasks", LS.tasks, { status: "To Do", ...data });
export const updateTask = (id, patch) => updateItem("tasks", LS.tasks, id, patch);
export const deleteTask = (id) => removeItem("tasks", LS.tasks, id);

// =====================================================================
// KPI DASHBOARD  (5 levels)
// =====================================================================
export const KPI_LEVELS = [
  { level: 1, name: "Reach", metrics: ["Impressions", "Views", "Unique viewers", "Followers/Subscribers"] },
  { level: 2, name: "Engagement", metrics: ["Comments", "Questions", "Shares", "Saves", "Watch time", "Returning viewers"] },
  { level: 3, name: "Spiritual Response", metrics: ["Prayer requests", "Bible-study requests", "Course registrations", "Discussion participation"] },
  { level: 4, name: "Discipleship", metrics: ["Studies started", "Studies completed", "Course completion", "Mentoring", "Church connections"] },
  { level: 5, name: "Mission", metrics: ["Digital missionaries trained", "People personally reached", "Studies initiated by missionaries", "New groups established"] },
];
export const getKpiRecords = () => listAll("kpi", LS.kpi, "createdAt");
export const addKpiRecord = (data) => createItem("kpi", LS.kpi, data);

// =====================================================================
// CITY CAMPAIGN  (Part XIX)
// =====================================================================
export const getCampaigns = () => listAll("campaigns", LS.campaigns, "createdAt");
export const addCampaign = (data) => createItem("campaigns", LS.campaigns, { stage: "Planning", ...data });
export const updateCampaign = (id, patch) => updateItem("campaigns", LS.campaigns, id, patch);

// =====================================================================
// DONATIONS  (ledger only — actual charge happens via the payment
// processor once connected; this records the donor's intent/result)
// =====================================================================
export const getDonations = () => listAll("donations", LS.donations, "createdAt");
export const recordDonationIntent = (data) => createItem("donations", LS.donations, { status: "pending", ...data });

// =====================================================================
// CONNECT LINKS — admin-editable social/channel URLs, shown publicly
// =====================================================================
const LS_SETTINGS = "ihde_settings";
const SETTINGS_DOC_ID = "connectLinks";
export const CONNECT_PLATFORMS = [
  { key: "whatsapp", label: "WhatsApp" },
  { key: "telegram", label: "Telegram" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "website", label: "Website" },
  { key: "email", label: "Email" },
];
export async function getConnectLinks() {
  if (!isFirebaseConfigured) {
    return lsGet(LS_SETTINGS, {});
  }
  const snap = await getDoc(doc(db, "settings", SETTINGS_DOC_ID));
  return snap.exists() ? snap.data() : {};
}
export async function updateConnectLinks(patch) {
  if (!isFirebaseConfigured) {
    lsSet(LS_SETTINGS, { ...lsGet(LS_SETTINGS, {}), ...patch });
    return;
  }
  await setDoc(doc(db, "settings", SETTINGS_DOC_ID), patch, { merge: true });
}
