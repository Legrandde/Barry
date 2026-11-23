import { useState, type FormEvent } from "react";
import { Copy, ShieldCheck, ShieldOff } from "lucide-react";
import { changePassword, changeUsername, disable2FA, enable2FA, setup2FA } from "../../services/adminApi";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/toast";

export default function AdminAccount() {
  const { admin, refresh } = useAuth();
  const toast = useToast();

  const [pwdCurrent, setPwdCurrent] = useState("");
  const [pwdNew, setPwdNew] = useState("");
  const [userCurrentPwd, setUserCurrentPwd] = useState("");
  const [newUsername, setNewUsername] = useState(admin?.username ?? "");

  // 2FA state
  const [setupData, setSetupData] = useState<{ secret: string; otpauthUri: string } | null>(null);
  const [enableCode, setEnableCode] = useState("");
  const [disablePwd, setDisablePwd] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [busy2FA, setBusy2FA] = useState(false);

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
      toast.success("Mot de passe modifié avec succès.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors du changement de mot de passe.";
      setError(msg);
      toast.error(msg);
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
      toast.success("Identifiant modifié avec succès.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors du changement d'identifiant.";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleStart2FA = async () => {
    setNotice("");
    setError("");
    setBusy2FA(true);
    try {
      const res = await setup2FA();
      setSetupData(res);
      setEnableCode("");
      toast.info("Scannez le QR code avec Google Authenticator ou Authy.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Impossible d'initialiser la 2FA.";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy2FA(false);
    }
  };

  const handleEnable2FA = async (e: FormEvent) => {
    e.preventDefault();
    setNotice("");
    setError("");
    setBusy2FA(true);
    try {
      await enable2FA(enableCode.trim());
      setSetupData(null);
      setEnableCode("");
      await refresh();
      setNotice("Authentification à deux facteurs (2FA) activée !");
      toast.success("2FA activée avec succès !");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Code invalide.";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy2FA(false);
    }
  };

  const handleDisable2FA = async (e: FormEvent) => {
    e.preventDefault();
    setNotice("");
    setError("");
    setBusy2FA(true);
    try {
      await disable2FA(disablePwd, disableCode.trim());
      setDisablePwd("");
      setDisableCode("");
      await refresh();
      setNotice("Authentification à deux facteurs (2FA) désactivée.");
      toast.info("2FA désactivée.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Impossible de désactiver la 2FA.";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy2FA(false);
    }
  };

  const copySecret = () => {
    if (!setupData) return;
    navigator.clipboard.writeText(setupData.secret).catch(() => {});
    toast.info("Clé secrète copiée !");
  };

  const inputClass =
    "w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-amber-500";

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mon compte</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gérez votre authentification à deux facteurs (2FA), votre identifiant et votre mot de passe.
        </p>
      </div>

      {notice && <p className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">{notice}</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}

      {/* Authentification à deux facteurs (2FA) */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {admin?.totpEnabled ? (
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            ) : (
              <ShieldOff className="w-5 h-5 text-amber-500" />
            )}
            <h3 className="font-semibold text-gray-900 dark:text-white">Authentification à deux facteurs (2FA)</h3>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              admin?.totpEnabled
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            {admin?.totpEnabled ? "Activée" : "Désactivée"}
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Protégez votre accès sur <code>/lamougoun</code> avec un code temporaire à 6 chiffres généré par Google
          Authenticator, Authy ou Microsoft Authenticator.
        </p>

        {!admin?.totpEnabled && !setupData && (
          <button
            type="button"
            onClick={handleStart2FA}
            disabled={busy2FA}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold text-sm cursor-pointer"
          >
            {busy2FA ? "Préparation..." : "Configurer et activer la 2FA"}
          </button>
        )}

        {!admin?.totpEnabled && setupData && (
          <form onSubmit={handleEnable2FA} className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(setupData.otpauthUri)}`}
                alt="QR Code 2FA"
                className="w-44 h-44 rounded-lg border border-gray-200 dark:border-gray-700 bg-white p-2"
              />
              <div className="space-y-2 flex-1 text-sm">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  1. Scannez ce QR code avec votre application Authenticator.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ou saisissez manuellement cette clé secrète :</p>
                <div className="flex items-center gap-2">
                  <code className="px-2.5 py-1.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono text-amber-600 dark:text-amber-400 break-all">
                    {setupData.secret}
                  </code>
                  <button
                    type="button"
                    onClick={copySecret}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    title="Copier la clé"
                  >
                    <Copy className="w-4 h-4 text-amber-500" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                2. Saisissez le code à 6 chiffres affiché dans l'application
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                placeholder="000000"
                value={enableCode}
                onChange={(e) => setEnableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className={`${inputClass} font-mono tracking-[0.35em] text-center text-lg`}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy2FA || enableCode.length !== 6}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm cursor-pointer"
              >
                {busy2FA ? "Activation..." : "Confirmer et activer"}
              </button>
              <button
                type="button"
                onClick={() => setSetupData(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {admin?.totpEnabled && (
          <form onSubmit={handleDisable2FA} className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Pour désactiver la 2FA, confirmez votre mot de passe et votre code actuel :
            </p>
            <input
              type="password"
              required
              placeholder="Mot de passe actuel"
              value={disablePwd}
              onChange={(e) => setDisablePwd(e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="Code 2FA à 6 chiffres"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={busy2FA || disableCode.length !== 6}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold text-sm cursor-pointer"
            >
              {busy2FA ? "Désactivation..." : "Désactiver la 2FA"}
            </button>
          </form>
        )}
      </div>

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
