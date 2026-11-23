import { useState, type FormEvent } from "react";
import { changePassword, changeUsername } from "../../services/adminApi";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminAccount() {
  const { admin, refresh } = useAuth();
  const [pwdCurrent, setPwdCurrent] = useState("");
  const [pwdNew, setPwdNew] = useState("");
  const [userCurrentPwd, setUserCurrentPwd] = useState("");
  const [newUsername, setNewUsername] = useState(admin?.username ?? "");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const handlePassword = async (e: FormEvent) => {
    e.preventDefault();
    setNotice("");
    setError("");
    try {
      await changePassword(pwdCurrent, pwdNew);
      setPwdCurrent("");
      setPwdNew("");
      setNotice("Mot de passe modifié avec succès.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du changement de mot de passe.");
    }
  };

  const handleUsername = async (e: FormEvent) => {
    e.preventDefault();
    setNotice("");
    setError("");
    try {
      await changeUsername(userCurrentPwd, newUsername.trim());
      setUserCurrentPwd("");
      await refresh();
      setNotice("Identifiant modifié avec succès.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du changement d'identifiant.");
    }
  };

  const inputClass =
    "w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-amber-500";

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mon compte</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Modifiez votre identifiant ou votre mot de passe administrateur.</p>
      </div>

      {notice && <p className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">{notice}</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}

      <form onSubmit={handlePassword} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Changer le mot de passe</h3>
        <input
          type="password"
          required
          placeholder="Mot de passe actuel"
          value={pwdCurrent}
          onChange={(e) => setPwdCurrent(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Nouveau mot de passe (8 caractères min.)"
          value={pwdNew}
          onChange={(e) => setPwdNew(e.target.value)}
          className={inputClass}
        />
        <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm cursor-pointer">
          Mettre à jour le mot de passe
        </button>
      </form>

      <form onSubmit={handleUsername} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Changer l'identifiant</h3>
        <input
          type="text"
          required
          minLength={3}
          placeholder="Nouvel identifiant"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          required
          placeholder="Mot de passe actuel"
          value={userCurrentPwd}
          onChange={(e) => setUserCurrentPwd(e.target.value)}
          className={inputClass}
        />
        <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm cursor-pointer">
          Mettre à jour l'identifiant
        </button>
      </form>
    </div>
  );
}
