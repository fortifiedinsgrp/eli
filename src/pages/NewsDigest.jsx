import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Globe, Flag, Cpu, Trophy, ArrowLeft, Calendar, 
  ExternalLink, Newspaper, Clock, MapPin
} from 'lucide-react';

export default function NewsDigest() {
  const { date } = useParams();
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDigest();
  }, [date]);

  const loadDigest = async () => {
    // 1. Try localStorage first
    const key = `eli_digest_${date}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
      setDigest(JSON.parse(saved));
      setLoading(false);
      return;
    }
    
    // 2. Try fetching from public folder
    try {
      const res = await fetch(`/digests/${date}.json`);
      if (res.ok) {
        const data = await res.json();
        setDigest(data);
      }
    } catch (e) {
      console.warn(`Failed to load digest ${date}:`, e);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!digest) {
    return (
      <div className="p-8">
        <Link to="/news" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-600">No digest for {date}</h2>
          <p className="text-gray-500 mt-2">Check back later or ask Eli to generate one.</p>
        </div>
      </div>
    );
  }

  const categoryIcons = {
    global: Globe,
    countries: Flag,
    science: Cpu,
    sports: Trophy,
    us: MapPin,
  };

  const categoryColors = {
    global: 'blue',
    countries: 'purple',
    science: 'green',
    sports: 'orange',
    us: 'gray',
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/news" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to News
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-gray-400" />
          <span className="text-gray-500">{new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Daily News Digest</h1>
        {digest.generatedAt && (
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Generated at {new Date(digest.generatedAt).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {digest.categories?.map((category) => {
          const Icon = categoryIcons[category.id] || Globe;
          const color = categoryColors[category.id] || 'blue';
          
          return (
            <section key={category.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className={`px-6 py-4 bg-${color}-50 border-b border-${color}-100`}>
                <h2 className={`text-xl font-semibold text-${color}-900 flex items-center gap-3`}>
                  <Icon className={`w-6 h-6 text-${color}-600`} />
                  {category.title}
                </h2>
              </div>
              
              <div className="p-6">
                {/* Summary */}
                <div className="prose prose-sm max-w-none mb-6">
                  {category.summary.split('\n').map((para, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-3">{para}</p>
                  ))}
                </div>

                {/* Subcategories (for countries/sports) */}
                {category.subcategories?.map((sub) => (
                  <div key={sub.name} className="mb-6 last:mb-0">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      {sub.flag && <span className="text-lg">{sub.flag}</span>}
                      {sub.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{sub.summary}</p>
                    {sub.links?.length > 0 && (
                      <ul className="space-y-1">
                        {sub.links.map((link, i) => (
                          <li key={i}>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {link.title}
                              {link.source && <span className="text-gray-400">({link.source})</span>}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {/* Links */}
                {category.links?.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Sources & Further Reading</h4>
                    <ul className="space-y-2">
                      {category.links.map((link, i) => (
                        <li key={i}>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-start gap-2 group"
                          >
                            <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <span className="group-hover:underline">{link.title}</span>
                              {link.source && (
                                <span className="text-gray-400 text-sm ml-2">— {link.source}</span>
                              )}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
