import { useEffect, useState } from "react";

const STORAGE_KEY = "site_visits";

export default function VisitorCounter() {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const current = stored ? parseInt(stored, 10) : 0;
    // Increment on each visit
    const newVisits = current + 1;
    localStorage.setItem(STORAGE_KEY, String(newVisits));
    setVisits(newVisits);
  }, []);

  const formatNumber = (n: number) => {
    return n.toLocaleString();
  };

  return (
    <div className="flex items-center gap-2 font-mono text-sm text-[var(--text-muted)]">
      <i className="fa-solid fa-eye text-[var(--accent-primary)]"></i>
      <span>总访问量: </span>
      <span className="text-[var(--accent-primary)] font-bold">{formatNumber(visits)}</span>
    </div>
  );
}