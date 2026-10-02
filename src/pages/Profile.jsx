import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { upsertUserProfile } from "../lib/store";

export default function Profile() {
  const { profile, currentUser, refreshProfile, changeOwnPassword, isFirebaseConfigured } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");

  async function handleSaveProfile(e) {
    e.preventDefault();
    await upsertUserProfile(currentUser.uid, { name });
    await refreshProfile();
    setProfileMsg("Saved.");
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwMsg(""); setPwErr("");
    if (newPassword !== confirmPassword) { setPwErr("New passwords don't match."); return; }
    try {
      await changeOwnPassword(currentPassword, newPassword);
      setPwMsg("Password updated.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) { setPwErr(err.message); }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h2 className="font-display text-2xl text-flame-950 dark:text-white">My Profile</h2>

      <div className="mt-6 rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-5">
        <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-flame-300">Role</p>
        <p className="mt-1 capitalize text-ink dark:text-white">{(profile?.role || "public").replace("_", " ")}{profile?.team ? ` — ${profile.team}` : ""}</p>
      </div>

      <form onSubmit={handleSaveProfile} className="mt-6 space-y-3 rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-5">
        <h3 className="font-display text-lg text-ink dark:text-white">Name</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
        {profileMsg && <p className="text-xs text-flame-700 dark:text-gold-500">{profileMsg}</p>}
        <button type="submit" className="rounded-md bg-flame-700 px-4 py-2 text-sm font-medium text-white hover:bg-flame-800">Save</button>
      </form>

      <form onSubmit={handleChangePassword} className="mt-6 space-y-3 rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-5">
        <h3 className="font-display text-lg text-ink dark:text-white">Change password</h3>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" required
          name="currentPassword" autoComplete="current-password" className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" required
          name="newPassword" autoComplete="new-password" className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required
          name="confirmPassword" autoComplete="new-password" className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
        {pwErr && <p className="text-xs text-red-600">{pwErr}</p>}
        {pwMsg && <p className="text-xs text-flame-700 dark:text-gold-500">{pwMsg}</p>}
        <button type="submit" className="rounded-md bg-flame-700 px-4 py-2 text-sm font-medium text-white hover:bg-flame-800">Update password</button>
        {!isFirebaseConfigured && <p className="text-xs text-ink-soft dark:text-flame-300">Demo mode — updates your local demo password only.</p>}
      </form>
    </div>
  );
}
