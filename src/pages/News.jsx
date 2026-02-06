import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Newspaper, Calendar, ChevronRight, Globe, Flag, 
  Cpu, Trophy, Clock, RefreshCw
} from 'lucide-react';

export default function News() {
  const [digests, setDigests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDigests();
  }, []);

  const loadDigests = async () => {
    const digestList = [];
    
    // 1. Load from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('eli_digest_')) {
        const date = key.replace('eli_digest_', '');
        const data = JSON.parse(localStorage.getItem(key));
        digestList.push({ date, ...data, source: 'local' });
      }
    }
    
    // 2. Load from public digests folder
    try {
      const indexRes = await fetch('/digests/index.json');
      if (indexRes.ok) {
        const index = await indexRes.json();
        for (const item of index.digests || []) {
          // Skip if already loaded from localStorage
          if (!digestList.find(d => d.date === item.date)) {
            try {
              const digestRes = await fetch(`/digests/${item.date}.json`);
              if (digestRes.ok) {
                const data = await digestRes.json();
                digestList.push({ ...data, source: 'remote' });
              }
            } catch (e) {
              console.warn(`Failed to load digest ${item.date}:`, e);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load digest index:', e);
    }
    
    // Sort by date descending
    digestList.sort((a, b) => new Date(b.date) - new Date(a.date));
    setDigests(digestList);
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    // Parse YYYY-MM-DD as local date (not UTC)
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.getTime() === today.getTime()) {
      return "Today's Digest";
    } else if (date.getTime() === yesterday.getTime()) {
      return "Yesterday's Digest";
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryIcons = (categories) => {
    const icons = [];
    if (categories?.some(c => c.id === 'global')) icons.push({ icon: Globe, color: 'blue' });
    if (categories?.some(c => c.id === 'countries')) icons.push({ icon: Flag, color: 'purple' });
    if (categories?.some(c => c.id === 'science')) icons.push({ icon: Cpu, color: 'green' });
    if (categories?.some(c => c.id === 'sports')) icons.push({ icon: Trophy, color: 'orange' });
    return icons;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-blue-500" />
            News Digests
          </h1>
          <p className="text-slate-400 mt-1">
            Curated daily briefings on global events, science, and sports
          </p>
        </div>

        {/* Categories Legend */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Global Events</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Flag className="w-4 h-4 text-purple-500" />
              <span>Country Focus</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span>Science & Tech</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Trophy className="w-4 h-4 text-orange-500" />
              <span>Sports</span>
            </div>
          </div>
        </div>

        {/* Digest List */}
        {digests.length === 0 ? (
          <div className="text-center py-16 bg-slate-800 rounded-xl border border-slate-700">
            <Newspaper className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-300 mb-2">No digests yet</h2>
            <p className="text-slate-400">
              Ask Eli to generate your first daily news digest.
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Say: "Generate my daily news digest"
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {digests.map((digest) => {
              const icons = getCategoryIcons(digest.categories);
              return (
                <Link
                  key={digest.date}
                  to={`/news/${digest.date}`}
                  className="block bg-slate-800 rounded-xl border border-slate-700 p-5 hover:bg-slate-750 hover:border-slate-600 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-400">{digest.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
                        {formatDate(digest.date)}
                      </h3>
                      {digest.headline && (
                        <p className="text-slate-300 text-sm mt-1 line-clamp-2">
                          {digest.headline}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        {icons.map(({ icon: Icon, color }, i) => (
                          <Icon key={i} className={`w-4 h-4 text-${color}-500`} />
                        ))}
                        {digest.generatedAt && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(digest.generatedAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
