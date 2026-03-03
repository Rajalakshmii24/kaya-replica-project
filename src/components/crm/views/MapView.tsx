import { MapPin, Search, Filter, Layers, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useState } from "react";

const areas = [
  { name: "Dubai Marina", count: 245 },
  { name: "Downtown Dubai", count: 189 },
  { name: "Palm Jumeirah", count: 156 },
  { name: "Business Bay", count: 312 },
  { name: "JBR", count: 98 },
  { name: "Dubai Hills", count: 167 },
  { name: "Arabian Ranches", count: 78 },
  { name: "DIFC", count: 45 },
  { name: "JVC", count: 234 },
  { name: "Dubai Creek", count: 89 },
  { name: "MBR City", count: 112 },
  { name: "Dubai South", count: 67 },
];

const MapView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const filtered = searchQuery
    ? areas.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : areas;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Interactive Map</h1>
          <p className="font-raleway text-sm text-muted-foreground">Property locations overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs font-raleway text-muted-foreground hover:text-foreground">
            <Filter size={14} /> Filters
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs font-raleway text-muted-foreground hover:text-foreground">
            <Layers size={14} /> Layers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area..."
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50"
            />
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden max-h-[450px] overflow-y-auto">
            {filtered.map((area) => (
              <button
                key={area.name}
                onClick={() => setSelectedArea(selectedArea === area.name ? null : area.name)}
                className={`w-full flex items-center justify-between px-4 py-3 font-raleway text-xs border-b border-border last:border-0 transition-colors ${
                  selectedArea === area.name
                    ? "bg-kaya-olive/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-kaya-olive" />
                  {area.name}
                </div>
                <span className="px-2 py-0.5 bg-muted rounded-full text-[10px]">{area.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3 bg-card border border-border rounded-lg overflow-hidden relative">
          <div className="relative w-full h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.3011806427!2d54.89784018564417!3d25.076280455498805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Properties Map"
            />
          </div>
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1">
            <button className="p-2 bg-card border border-border rounded-lg shadow-sm hover:bg-muted">
              <ZoomIn size={16} className="text-foreground" />
            </button>
            <button className="p-2 bg-card border border-border rounded-lg shadow-sm hover:bg-muted">
              <ZoomOut size={16} className="text-foreground" />
            </button>
            <button className="p-2 bg-card border border-border rounded-lg shadow-sm hover:bg-muted">
              <Maximize2 size={16} className="text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="font-raleway text-lg font-semibold text-foreground">{areas.reduce((s, a) => s + a.count, 0).toLocaleString()}</p>
            <p className="font-raleway text-[10px] text-muted-foreground uppercase tracking-wide">Total Properties</p>
          </div>
          <div className="text-center">
            <p className="font-raleway text-lg font-semibold text-foreground">{areas.length}</p>
            <p className="font-raleway text-[10px] text-muted-foreground uppercase tracking-wide">Active Areas</p>
          </div>
          <div className="text-center">
            <p className="font-raleway text-lg font-semibold text-foreground">Business Bay</p>
            <p className="font-raleway text-[10px] text-muted-foreground uppercase tracking-wide">Top Area</p>
          </div>
          <div className="text-center">
            <p className="font-raleway text-lg font-semibold text-foreground">312</p>
            <p className="font-raleway text-[10px] text-muted-foreground uppercase tracking-wide">Most Listings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
