import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>({
    students: [],
    teachers: [],
    classes: [],
    results: []
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ students: [], teachers: [], classes: [], results: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await serviceRequest<any>(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok && response.data) {
          setResults(response.data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const hasResults = Object.values(results).some((arr: any) => arr.length > 0);

  const handleResultClick = (url: string) => {
    setIsOpen(false);
    setQuery("");
    navigate(url);
  };

  return (
    <div ref={wrapperRef} className="relative max-w-[420px] w-full hidden xl:block">
      <AppIcon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Quick search... (Students, Teachers, Classes)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (query.trim()) setIsOpen(true); }}
        className="w-full rounded-lg border border-slate-100 bg-slate-50/50 py-1.5 pl-9 pr-3 text-[11px] font-bold text-slate-600 placeholder:text-slate-400/60 transition-all focus:border-blue-200 focus:bg-white focus:outline-none"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-[100] max-h-[400px] flex flex-col">
          {!hasResults && !loading ? (
            <div className="p-4 text-center text-xs text-slate-500 font-medium">No results found for "{query}"</div>
          ) : (
            <div className="overflow-y-auto custom-scrollbar p-2 space-y-3">
              {results.students?.length > 0 && (
                <div>
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Students</h4>
                  {results.students.map((s: any) => (
                    <button
                      key={s._id}
                      onClick={() => handleResultClick(s.url)}
                      className="w-full text-left flex flex-col p-2 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-700">{s.name}</span>
                      <span className="text-[10px] text-slate-500">{s.description}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.teachers?.length > 0 && (
                <div>
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Teachers</h4>
                  {results.teachers.map((t: any) => (
                    <button
                      key={t._id}
                      onClick={() => handleResultClick(t.url)}
                      className="w-full text-left flex flex-col p-2 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-700">{t.name}</span>
                      <span className="text-[10px] text-slate-500">{t.description}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.classes?.length > 0 && (
                <div>
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Classes</h4>
                  {results.classes.map((c: any) => (
                    <button
                      key={c._id}
                      onClick={() => handleResultClick(c.url)}
                      className="w-full text-left flex flex-col p-2 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-700">{c.name}</span>
                      <span className="text-[10px] text-slate-500">{c.description}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.results?.length > 0 && (
                <div>
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Results</h4>
                  {results.results.map((r: any) => (
                    <button
                      key={r._id}
                      onClick={() => handleResultClick(r.url)}
                      className="w-full text-left flex flex-col p-2 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-700">{r.name}</span>
                      <span className="text-[10px] text-slate-500">{r.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
