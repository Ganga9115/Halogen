// src/components/SinglePlayer/leaderBoard.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../utils/Footer";
import BottomNav from "../utils/BottomNav";
import { getTopStudents, getTopSchools, exportData, clearLeaderboard } from "../utils/leaderboardStorage";

function ProgressBar({ value, max = 100 }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="w-40 bg-slate-800/10 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg,#7c3aed,#6366f1)",
        }}
      />
    </div>
  );
}

export default function Leaderboard() {
  const [studentLeaders, setStudentLeaders] = useState([]);
  const [schoolLeaders, setSchoolLeaders] = useState([]);

  const load = () => {
    setStudentLeaders(getTopStudents(10));
    setSchoolLeaders(getTopSchools(10));
  };

  useEffect(() => {
    load();
    // update when someone writes to localStorage in other tab
    window.addEventListener("storage", load);
    // update when our helper dispatches in same tab
    window.addEventListener("leaderboardUpdated", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("leaderboardUpdated", load);
    };
  }, []);

  const maxSchoolPoints = Math.max(...schoolLeaders.map((s) => Number(s.points || 0)), 1000);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-sky-100 via-sky-50 to-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 rounded-3xl bg-white/80 border border-slate-100 shadow-2xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2
                className="text-3xl font-extrabold text-purple-700"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Leaderboards
              </h2>
              <p className="text-sm text-slate-600 mb-4">Top students & schools — climb the ranks</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm"
                title="Export leaderboard JSON"
              >
                Export
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Clear all leaderboard data? This cannot be undone.")) clearLeaderboard();
                }}
                className="px-3 py-1 rounded-md bg-rose-500 text-white text-sm"
                title="Clear local leaderboard"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Student Rankings */}
          <div className="space-y-4 mt-4">
            <div className="rounded-2xl p-4 bg-purple-50 border border-purple-100 shadow-sm">
              <h3 className="font-semibold text-purple-700 mb-2">Top Students</h3>
              <ol className="space-y-2">
                {studentLeaders.map((s, idx) => (
                  <motion.li
                    key={s.id || idx}
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-white shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-indigo-200 flex items-center justify-center font-semibold text-slate-800">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.school}{s.className ? ` • ${s.className}` : ""}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-indigo-600">{s.score}</div>
                  </motion.li>
                ))}
                {studentLeaders.length === 0 && <div className="text-sm text-slate-500">No scores yet — be the first!</div>}
              </ol>
            </div>

            {/* School Rankings */}
            <div className="rounded-2xl p-4 bg-purple-50 border border-purple-100 shadow-sm">
              <h3 className="font-semibold text-purple-700 mb-2">School Rankings</h3>
              <div className="grid gap-3">
                {schoolLeaders.map((sch, idx) => (
                  <div
                    key={sch.school + idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-white shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-sm font-semibold">
                        {sch.school.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-bold">{sch.school}</div>
                        <div className="text-xs text-slate-500">Points: {sch.points}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ProgressBar value={sch.points} max={maxSchoolPoints} />
                      <div className="text-sm font-semibold">{sch.points}</div>
                    </div>
                  </div>
                ))}
                {schoolLeaders.length === 0 && <div className="text-sm text-slate-500">No school data yet.</div>}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}
