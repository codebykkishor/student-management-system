import React, { useState, useEffect, useCallback } from "react";
import { fetchLowAttendance, formatApiError } from "./api";

const THRESHOLDS = [60, 65, 70, 75, 80, 85];

/**
 * Low Attendance Alerts
 * Lists students whose attendance is below a chosen threshold (default 75%).
 * Admins see every student; faculty only see their own department
 * (the backend enforces this scoping).
 */
const LowAttendanceAlerts = ({ onNavigateTab }) => {
  const [threshold, setThreshold] = useState(75);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLowAttendance(threshold);
      setResult(res.data);
    } catch (err) {
      setError(formatApiError(err, "Could not load attendance alerts."));
    } finally {
      setLoading(false);
    }
  }, [threshold]);

  useEffect(() => {
    load();
  }, [load]);

  const severity = (pct) => (pct < 50 ? "critical" : pct < 65 ? "warning" : "watch");

  return (
    <div className="dash-card low-att-card">
      <div className="dash-card-header low-att-header">
        <h3>⚠️ Low Attendance Alerts</h3>
        <label className="low-att-filter">
          <span>Below</span>
          <select
            id="low-att-threshold"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            aria-label="Attendance threshold percentage"
          >
            {THRESHOLDS.map((t) => (
              <option key={t} value={t}>
                {t}%
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="dash-card-body">
        {loading && <p className="empty-subtext">Checking attendance records…</p>}

        {!loading && error && <p className="empty-subtext low-att-error">{error}</p>}

        {!loading && !error && result && result.count === 0 && (
          <p className="empty-subtext">
            ✅ Everyone with recorded attendance is at or above {threshold}%.
          </p>
        )}

        {!loading && !error && result && result.count > 0 && (
          <>
            <p className="low-att-summary">
              <strong>{result.count}</strong> student{result.count === 1 ? "" : "s"} below{" "}
              {result.threshold}%
            </p>
            <div className="low-att-list">
              {result.students.slice(0, 8).map((s) => (
                <div key={s.student_id} className={`low-att-row sev-${severity(s.percentage)}`}>
                  <div className="low-att-info">
                    <strong>{s.name}</strong>
                    <span>
                      {s.department} · Year {s.year} · {s.absent_days} absent, {s.late_days} late of{" "}
                      {s.total_days} days
                    </span>
                  </div>
                  <span className="low-att-pct">{s.percentage}%</span>
                </div>
              ))}
            </div>
            {result.count > 8 && (
              <p className="low-att-more">…and {result.count - 8} more</p>
            )}
            {onNavigateTab && (
              <button
                type="button"
                className="btn btn-secondary btn-sm low-att-link"
                onClick={() => onNavigateTab("attendance")}
              >
                📋 Open Attendance Management
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LowAttendanceAlerts;
