import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";

const ITEMS_PER_PAGE = 6;

const Properties = () => {
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const types = ["All", ...Array.from(new Set(properties.map((p) => p.type)))];
  const statuses = ["All", "ready", "offplan", "secondary"];

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (typeFilter !== "All" && p.type !== typeFilter) return false;
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      return true;
    });
  }, [typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilterChange = () => setPage(1);

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero title="Properties" subtitle="Find Your Dream Property" />

      <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
          <div>
            <label className="font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground block mb-2">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); handleFilterChange(); }}
              className="kaya-input !py-2 !px-3 !border !border-border bg-background min-w-[160px]"
            >
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground block mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange(); }}
              className="kaya-input !py-2 !px-3 !border !border-border bg-background min-w-[160px]"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All" : s === "ready" ? "Ready" : s === "offplan" ? "Off Plan" : "Secondary"}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <p className="font-raleway font-light text-sm text-muted-foreground mb-8">
          Showing {paginated.length} of {filtered.length} properties
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginated.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center font-raleway font-light text-muted-foreground py-16">
            No properties match your criteria.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 font-raleway text-sm transition-colors ${
                  page === i + 1
                    ? "bg-kaya-olive text-primary-foreground"
                    : "border border-border text-foreground hover:bg-kaya-light"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
