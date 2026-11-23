import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Globe2, MapPin, RefreshCw } from "lucide-react";
import { getAnalyticsSummary, type AnalyticsSummary } from "../../services/adminApi";
import { countryFlag, countryName } from "../../utils/geo";

function GeoBars({
  rows,
  total,
}: {
  rows: { key: string; label: ReactNode; visitors: number; pageviews: number }[];
  total: number;
}) {
  if (rows.length === 0) {
    return <p className="py-4 text-sm text-gray-500">Aucune donnée de localisation sur la période.</p>;
  }
  return (
    <ul className="space-y-3">
      {rows.map((r) => {
        const pct = total > 0 ? Math.round((r.visitors / total) * 100) : 0;
        return (
          <li key={r.key}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-gray-800 dark:text-gray-200">{r.label}</span>
              <span className="shrink-0 tabular-nums text-xs text-gray-500 dark:text-gray-400">
                <strong className="font-semibold text-amber-600 dark:text-amber-400">{r.visitors}</strong> visiteur{r.visitors > 1 ? "s" : ""} ·{" "}
                {r.pageviews} vue{r.pageviews > 1 ? "s" : ""} ({pct} %)
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.max(pct, 3)}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function AdminDashboard() {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [geoView, setGeoView] = useState<"countries" | "regions">("countries");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    getAnalyticsSummary(days)
      .then(setSummary)
      .catch((err) => setError(err instanceof Error ? err.message : "Impossible de charger les statistiques."))
      .finally(() => setLoading(false));
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const distinctCountries = summary?.countries.filter((c) => c.code).length ?? 0;
  const maxDaily = Math.max(1, ...(summary?.daily.map((d) => d.pageviews) ?? [1]));

  const countryRows =
    summary?.countries.slice(0, 10).map((c) => ({
      key: c.code || "inconnu",
      label: c.code ? (
        <>
          {countryFlag(c.code)} {countryName(c.code)}
        </>
      ) : (
        <span className="text-gray-500 dark:text-gray-400">Local / Pays inconnu</span>
      ),
      visitors: c.visitors,
      pageviews: c.pageviews,
    })) ?? [];

  const regionRows =
    summary?.regions.slice(0, 10).map((r) => ({
      key: `${r.country}-${r.region}`,
      label: (
        <>
          {countryFlag(r.country)} {r.region}{" "}
          {r.country && <span className="text-gray-500 dark:text-gray-400">· {countryName(r.country)}</span>}
        </>
      ),
      visitors: r.visitors,
      pageviews: r.pageviews,
    })) ?? [];

  const cardClass = "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Statistiques de visite sans cookies ni stockage d'IP (pays & région déduits localement)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${
                days === d
                  ? "bg-amber-500 text-white font-medium"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {d} jours
            </button>
          ))}
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer disabled:opacity-50"
            title="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-4">{error}</p>}

      {summary && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className={cardClass}>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Pages vues ({days}j)</p>
              <p className="text-3xl font-bold text-amber-500 mt-1">{summary.totals.pageviews}</p>
              <p className="text-xs text-gray-500 mt-1">Aujourd'hui : {summary.today.pageviews}</p>
            </div>
            <div className={cardClass}>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Visiteurs uniques ({days}j)</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{summary.totals.uniqueVisitors}</p>
              <p className="text-xs text-gray-500 mt-1">Aujourd'hui : {summary.today.uniqueVisitors}</p>
            </div>
            <div className={cardClass}>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Actions suivies ({days}j)</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{summary.totals.events}</p>
              <p className="text-xs text-gray-500 mt-1">Aujourd'hui : {summary.today.events}</p>
            </div>
            <div className={cardClass}>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Actifs (5 min)</p>
              <p className="text-3xl font-bold text-sky-600 dark:text-sky-400 mt-1">{summary.activeVisitors}</p>
            </div>
            <div className={cardClass}>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Pays détectés</p>
              <p className="text-3xl font-bold text-violet-600 dark:text-violet-400 mt-1">{distinctCountries}</p>
              <p className="text-xs text-gray-500 mt-1">{summary.geoAvailable ? "Base DB-IP active" : "Base géo absente"}</p>
            </div>
          </div>

          {/* Visiteurs par pays et région */}
          <div className={`${cardClass} space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-amber-500" />
                  Visiteurs par pays et région
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Localisation déduite localement de l'IP (jamais stockée ni transmise à un tiers).
                </p>
              </div>
              <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-950 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setGeoView("countries")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                    geoView === "countries" ? "bg-amber-500 text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Globe2 className="w-3.5 h-3.5" /> Pays
                </button>
                <button
                  onClick={() => setGeoView("regions")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                    geoView === "regions" ? "bg-amber-500 text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" /> Régions
                </button>
              </div>
            </div>

            {!summary.geoAvailable && (
              <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                La base locale DB-IP n'est pas installée. Lancez <code>uv run python -m db.download_geoip</code> dans{" "}
                <code>barry_back</code> pour activer la détection pays/région.
              </p>
            )}

            {geoView === "countries" ? (
              <GeoBars rows={countryRows} total={summary.totals.uniqueVisitors} />
            ) : (
              <GeoBars rows={regionRows} total={summary.totals.uniqueVisitors} />
            )}

            <p className="text-[11px] text-gray-500 pt-1 border-t border-gray-200 dark:border-gray-800/80">
              IP Geolocation by DB-IP (CC BY 4.0) · En local (127.0.0.1), les visites apparaissent comme « Local / Pays inconnu ».
            </p>
          </div>

          {/* Courbe journalière */}
          <div className={cardClass}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Visites par jour ({days} derniers jours)</h3>
            <div className="flex items-end gap-1 h-28">
              {summary.daily.map((d) => {
                const height = d.pageviews > 0 ? Math.max(8, Math.round((d.pageviews / maxDaily) * 100)) : 2;
                return (
                  <div
                    key={d.date}
                    title={`${d.date} : ${d.pageviews} vue(s), ${d.uniqueVisitors} visiteur(s)`}
                    className="flex-1 bg-amber-500/80 hover:bg-amber-400 rounded-t transition-all"
                    style={{ height: `${height}%`, opacity: d.pageviews > 0 ? 1 : 0.15 }}
                  />
                );
              })}
            </div>
          </div>

          {/* Répartitions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Pages les plus vues", items: summary.topPages },
              { title: "Provenances", items: summary.referrers },
              { title: "Appareils", items: summary.devices },
              { title: "Navigateurs", items: summary.browsers },
              { title: "Systèmes d'exploitation", items: summary.operatingSystems },
              { title: "Langues", items: summary.languages },
            ].map((block) => (
              <div key={block.title} className={cardClass}>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{block.title}</h3>
                {block.items.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune donnée sur la période.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {block.items.map((item) => (
                      <li key={item.name} className="flex justify-between gap-2">
                        <span className="text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400 shrink-0">{item.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className={cardClass}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Actions des visiteurs</h3>
            {summary.events.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune action enregistrée sur la période.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {summary.events.map((ev, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {ev.name}
                      {ev.label ? <span className="text-gray-500"> · {ev.label}</span> : null}
                    </span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">{ev.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
