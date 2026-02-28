import { useEffect, useState, useCallback } from "react";
import { Users, Search, Loader2, Phone, Mail, User, Plus } from "lucide-react";
import { fetchLeads } from "@/lib/pixxi";

const ContactsView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchLeads({ page: 1, size: 50 });
      setData(res);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  const contacts = data?.data?.list || [];
  const filtered = searchQuery
    ? contacts.filter((c: any) =>
        (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Contacts</h1>
          <p className="font-raleway text-sm text-muted-foreground">{contacts.length} contacts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90">
          <Plus size={14} /> Add Contact
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((contact: any) => (
            <div key={contact.id} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-kaya-olive/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-kaya-olive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-raleway text-sm font-medium text-foreground">{contact.name || "Unknown"}</p>
                  {contact.email && (
                    <p className="font-raleway text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
                      <Mail size={10} /> {contact.email}
                    </p>
                  )}
                  {contact.phone && (
                    <p className="font-raleway text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone size={10} /> {contact.phone}
                    </p>
                  )}
                  <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-raleway rounded ${
                    contact.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                    contact.status === "DEAL" ? "bg-blue-100 text-blue-800" :
                    "bg-muted text-muted-foreground"
                  }`}>{contact.clientType} · {contact.status}</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-raleway text-sm text-muted-foreground">No contacts found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactsView;
