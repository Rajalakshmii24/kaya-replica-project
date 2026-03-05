import { useState, useEffect, useCallback } from "react";
import { MapPin, Search, Plus, Loader2, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { searchAreas } from "@/lib/pixxi";

const defaultAreas = [
  { id: 1, name: "Dubai Marina", properties: 245, status: "Active" },
  { id: 2, name: "Downtown Dubai", properties: 189, status: "Active" },
  { id: 3, name: "Palm Jumeirah", properties: 156, status: "Active" },
  { id: 4, name: "Business Bay", properties: 312, status: "Active" },
  { id: 5, name: "JBR", properties: 98, status: "Active" },
  { id: 6, name: "Dubai Hills", properties: 167, status: "Active" },
  { id: 7, name: "Arabian Ranches", properties: 78, status: "Active" },
  { id: 8, name: "DIFC", properties: 45, status: "Active" },
  { id: 9, name: "JVC", properties: 234, status: "Active" },
  { id: 10, name: "Dubai Creek Harbour", properties: 89, status: "Active" },
  { id: 11, name: "MBR City", properties: 112, status: "Active" },
  { id: 12, name: "Dubai South", properties: 67, status: "Active" },
  { id: 13, name: "Al Barsha", properties: 54, status: "Active" },
  { id: 14, name: "Jumeirah Village Triangle", properties: 143, status: "Active" },
  { id: 15, name: "Motor City", properties: 36, status: "Active" },
];

const AreasView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newArea, setNewArea] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = searchQuery
    ? defaultAreas.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : defaultAreas;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Areas</h1>
          <p className="font-raleway text-sm text-muted-foreground">{defaultAreas.length} areas</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90">
          <Plus size={14} /> Add Area
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-lg p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search areas..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">#</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Area Name</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Properties</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Status</th>
                <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((area) => (
                <tr key={area.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-raleway text-sm text-muted-foreground">{area.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-kaya-olive" />
                      <span className="font-raleway text-sm font-medium text-foreground">{area.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-raleway text-sm text-foreground">{area.properties}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 text-[10px] font-raleway rounded bg-green-100 text-green-800">{area.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginated.length === 0 && (
          <div className="px-5 py-12 text-center">
            <MapPin size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="font-raleway text-sm text-muted-foreground">No areas found</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="font-raleway text-xs text-muted-foreground">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40"><ChevronLeft size={16} /></button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card border border-border rounded-xl w-full max-w-md mx-4 p-6 shadow-xl">
            <h2 className="font-raleway text-lg font-medium text-foreground mb-4">Add New Area</h2>
            <div>
              <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Area Name</label>
              <input value={newArea} onChange={(e) => setNewArea(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" placeholder="e.g. Dubai Marina" />
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 font-raleway text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-sm font-medium hover:bg-kaya-olive/90">Save Area</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreasView;
