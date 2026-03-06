import { useState, useRef } from "react";
import {
  Info, FileText, Image, Globe, ChevronLeft, ChevronRight, Save,
  MapPin, User, UserPlus, FileInput, Calendar as CalendarIcon,
  Upload, X, Link, CheckSquare, Loader2, Home as HomeIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ListingType = "RENT" | "SELL";

interface AddListingFormProps {
  type: ListingType;
  onSave: () => void;
  onCancel: () => void;
}

const PROPERTY_TYPES = [
  "Apartment", "Villa", "Commercial Building", "Retail", "Townhouse",
  "Penthouse", "Duplex", "Studio", "Office", "Warehouse",
  "Commercial Floor", "Commercial Plot", "Labor Camp", "Show Room",
  "Staff Accommodation", "Land",
];

const FURNITURE_OPTIONS = ["Furnished", "Semi-furnished", "Unfurnished"];
const SOURCE_OPTIONS = ["Direct Owner", "Agent Referral", "Portal", "Walk-in", "Phone Inquiry", "Website", "Social Media"];
const CHEQUE_OPTIONS = Array.from({ length: 10 }, (_, i) => String(i + 1));

const PORTALS = [
  { id: "property-finder", name: "Property Finder", color: "bg-red-500" },
  { id: "bayut", name: "Bayut", color: "bg-blue-500" },
  { id: "dubizzle", name: "Dubizzle", color: "bg-orange-500" },
  { id: "houza", name: "Houza", color: "bg-purple-500" },
  { id: "just-property", name: "Just Property", color: "bg-green-500" },
  { id: "propertyguru", name: "PropertyGuru", color: "bg-teal-500" },
  { id: "yalla-deals", name: "Yalla Deals", color: "bg-yellow-500" },
  { id: "kaya-website", name: "KAYA Website", color: "bg-kaya-olive" },
];

const TABS = [
  { key: "info", label: "Information", icon: Info },
  { key: "desc", label: "Description", icon: FileText },
  { key: "media", label: "Media & Documents", icon: Image },
  { key: "portals", label: "Portals", icon: Globe },
] as const;

type TabKey = typeof TABS[number]["key"];

const AddListingForm = ({ type, onSave, onCancel }: AddListingFormProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Info state
  const [propertyType, setPropertyType] = useState("");
  const [listingIdMode, setListingIdMode] = useState<"auto" | "custom">("auto");
  const [customId, setCustomId] = useState("");
  const [location, setLocation] = useState("");
  const [developer, setDeveloper] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [size, setSize] = useState("");
  const [buildYear, setBuildYear] = useState<Date | undefined>();
  const [plotSize, setPlotSize] = useState("");
  const [occupancy, setOccupancy] = useState("");
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>();
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parking, setParking] = useState("");
  const [furniture, setFurniture] = useState("");
  const [publicUnitNo, setPublicUnitNo] = useState("");
  const [privateUnitNo, setPrivateUnitNo] = useState("");
  const [sourceOfListing, setSourceOfListing] = useState("");
  const [priceType, setPriceType] = useState(type === "RENT" ? "Yearly" : "Fixed");
  const [price, setPrice] = useState("");
  const [cheques, setCheques] = useState("1");
  const [deposit, setDeposit] = useState("");

  // Description state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Media state
  const [images, setImages] = useState<File[]>([]);
  const [ownerDocs, setOwnerDocs] = useState<File[]>([]);
  const [videoLink, setVideoLink] = useState("");
  const [view360Link, setView360Link] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Portals state
  const [selectedPortals, setSelectedPortals] = useState<string[]>([]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInfo = () => {
    const e: Record<string, string> = {};
    if (!size) e.size = "Size is required";
    if (!bedrooms) e.bedrooms = "Bedrooms is required";
    if (!publicUnitNo) e.publicUnitNo = "Public Unit No is required";
    if (!privateUnitNo) e.privateUnitNo = "Private Unit No is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateDesc = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const tabIndex = TABS.findIndex((t) => t.key === activeTab);

  const goNext = () => {
    if (activeTab === "info" && !validateInfo()) return;
    if (activeTab === "desc" && !validateDesc()) return;
    setErrors({});
    if (tabIndex < TABS.length - 1) setActiveTab(TABS[tabIndex + 1].key);
  };

  const goPrev = () => {
    setErrors({});
    if (tabIndex > 0) setActiveTab(TABS[tabIndex - 1].key);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => onSave(), 1200);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, 30));
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setOwnerDocs((prev) => [...prev, ...files].slice(0, 30));
  };

  const togglePortal = (id: string) => {
    setSelectedPortals((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const label = type === "RENT" ? "Rent" : "Sell";

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-kaya-olive/10 flex items-center justify-center mb-4">
          <CheckSquare className="text-kaya-olive" size={32} />
        </div>
        <h2 className="font-raleway text-xl font-medium text-foreground mb-2">Listing Saved!</h2>
        <p className="font-raleway text-sm text-muted-foreground">Redirecting to {label} Listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 font-raleway text-xs text-muted-foreground">
        <button onClick={onCancel} className="hover:text-foreground transition-colors flex items-center gap-1">
          <HomeIcon size={12} /> Home
        </button>
        <ChevronRight size={12} />
        <button onClick={onCancel} className="hover:text-foreground transition-colors">{label} Listings</button>
        <ChevronRight size={12} />
        <span className="text-foreground font-medium">Add {label}</span>
      </div>

      {/* Header with Save */}
      <div className="flex items-center justify-between">
        <h1 className="font-raleway text-xl font-medium text-foreground">Add {label} Listing</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs font-medium hover:bg-kaya-olive/90 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Tab Nav */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex border-b border-border">
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  if (idx <= tabIndex) { setErrors({}); setActiveTab(tab.key); }
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3.5 font-raleway text-xs font-medium transition-colors border-b-2",
                  active
                    ? "border-kaya-olive text-foreground bg-kaya-olive/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* STEP 1: Information */}
          {activeTab === "info" && (
            <div className="space-y-6 animate-fade-in">
              {/* Type & Listing ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Type" error={errors.propertyType}>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="crm-input">
                    <option value="">Select Type</option>
                    {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormField>

                <div>
                  <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-2">Listing ID</label>
                  <div className="flex items-center gap-4 mb-2">
                    <label className="flex items-center gap-2 font-raleway text-xs cursor-pointer">
                      <input type="radio" name="listingIdMode" checked={listingIdMode === "auto"} onChange={() => setListingIdMode("auto")} className="accent-kaya-olive" />
                      Auto Generate
                    </label>
                    <label className="flex items-center gap-2 font-raleway text-xs cursor-pointer">
                      <input type="radio" name="listingIdMode" checked={listingIdMode === "custom"} onChange={() => setListingIdMode("custom")} className="accent-kaya-olive" />
                      Custom
                    </label>
                  </div>
                  <input
                    type="text"
                    value={listingIdMode === "auto" ? "Auto Generated" : customId}
                    onChange={(e) => setCustomId(e.target.value.slice(0, 40))}
                    disabled={listingIdMode === "auto"}
                    placeholder="Enter custom id"
                    className="crm-input disabled:bg-muted/50 disabled:text-muted-foreground"
                  />
                  {listingIdMode === "custom" && (
                    <span className="font-raleway text-[10px] text-muted-foreground mt-1 block">{customId.length}/40</span>
                  )}
                </div>
              </div>

              {/* Location + Map */}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-2">Location</label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-3 text-muted-foreground" />
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location or click on map" className="crm-input pl-9" />
                  </div>
                  <div className="h-48 bg-muted/50 border border-border rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <MapPin size={24} className="mx-auto text-muted-foreground mb-1" />
                      <p className="font-raleway text-xs text-muted-foreground">Google Maps Integration</p>
                      <p className="font-raleway text-[10px] text-muted-foreground mt-0.5">Click to pin location</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-2">Owner Info</label>
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-raleway text-xs hover:bg-muted/30 transition-colors">
                    <User size={14} /> Select Owner
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-raleway text-xs hover:bg-muted/30 transition-colors">
                    <UserPlus size={14} /> Add Owner
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-raleway text-xs hover:bg-muted/30 transition-colors">
                    <FileInput size={14} /> Form
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <FormField label="Developer">
                  <input type="text" value={developer} onChange={(e) => setDeveloper(e.target.value)} placeholder="Developer name" className="crm-input" />
                </FormField>
                <FormField label="Total Floors">
                  <input type="number" value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} placeholder="0" className="crm-input" />
                </FormField>
                <FormField label="Floor No">
                  <input type="number" value={floorNo} onChange={(e) => setFloorNo(e.target.value)} placeholder="0" className="crm-input" />
                </FormField>
                <FormField label="Size (sqft) *" error={errors.size}>
                  <input type="number" value={size} onChange={(e) => setSize(e.target.value)} placeholder="0" className={cn("crm-input", errors.size && "border-destructive")} />
                </FormField>
                <FormField label="Build Year">
                  <DatePickerField value={buildYear} onChange={setBuildYear} placeholder="Select year" />
                </FormField>
                <FormField label="Plot Size">
                  <input type="number" value={plotSize} onChange={(e) => setPlotSize(e.target.value)} placeholder="0" className="crm-input" />
                </FormField>
                <FormField label="Occupancy">
                  <input type="text" value={occupancy} onChange={(e) => setOccupancy(e.target.value)} placeholder="e.g. Vacant" className="crm-input" />
                </FormField>
                <FormField label="Availability Date">
                  <DatePickerField value={availabilityDate} onChange={setAvailabilityDate} placeholder="Select date" />
                </FormField>
                <FormField label="Bedrooms *" error={errors.bedrooms}>
                  <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder="0" className={cn("crm-input", errors.bedrooms && "border-destructive")} />
                </FormField>
                <FormField label="Bathrooms">
                  <input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} placeholder="0" className="crm-input" />
                </FormField>
                <FormField label="Parking">
                  <input type="number" value={parking} onChange={(e) => setParking(e.target.value)} placeholder="0" className="crm-input" />
                </FormField>
                <FormField label="Furniture">
                  <select value={furniture} onChange={(e) => setFurniture(e.target.value)} className="crm-input">
                    <option value="">Select</option>
                    {FURNITURE_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </FormField>
              </div>

              {/* Unit Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <FormField label="Public Unit No *" error={errors.publicUnitNo}>
                  <input type="text" value={publicUnitNo} onChange={(e) => setPublicUnitNo(e.target.value)} placeholder="Unit number" className={cn("crm-input", errors.publicUnitNo && "border-destructive")} />
                </FormField>
                <FormField label="Private Unit No *" error={errors.privateUnitNo}>
                  <input type="text" value={privateUnitNo} onChange={(e) => setPrivateUnitNo(e.target.value)} placeholder="Unit number" className={cn("crm-input", errors.privateUnitNo && "border-destructive")} />
                </FormField>
                <FormField label="Source of Listing">
                  <select value={sourceOfListing} onChange={(e) => setSourceOfListing(e.target.value)} className="crm-input">
                    <option value="">Select</option>
                    {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </FormField>
              </div>

              {/* Pricing */}
              <div className="border-t border-border pt-5">
                <h3 className="font-raleway text-sm font-medium text-foreground mb-4">Pricing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <FormField label="Price Type">
                    <select value={priceType} onChange={(e) => setPriceType(e.target.value)} className="crm-input">
                      {type === "RENT" ? (
                        <>
                          <option value="Yearly">Yearly</option>
                          <option value="Monthly">Monthly</option>
                        </>
                      ) : (
                        <>
                          <option value="Fixed">Fixed</option>
                          <option value="Negotiable">Negotiable</option>
                        </>
                      )}
                    </select>
                  </FormField>
                  <FormField label="Price (AED)">
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" className="crm-input" />
                  </FormField>
                  {type === "RENT" && (
                    <FormField label="Cheques">
                      <select value={cheques} onChange={(e) => setCheques(e.target.value)} className="crm-input">
                        {CHEQUE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </FormField>
                  )}
                  <FormField label="Deposit (AED)">
                    <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="0" className="crm-input" />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Description */}
          {activeTab === "desc" && (
            <div className="space-y-5 animate-fade-in">
              <FormField label="Title *" error={errors.title}>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter listing title" className={cn("crm-input", errors.title && "border-destructive")} />
              </FormField>
              <FormField label="Description *" error={errors.description}>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 3000))}
                  placeholder="Please enter content"
                  rows={10}
                  className={cn("crm-input min-h-[200px] resize-none", errors.description && "border-destructive")}
                />
                <span className="font-raleway text-[10px] text-muted-foreground mt-1 block text-right">{description.length}/3000</span>
              </FormField>
            </div>
          )}

          {/* STEP 3: Media & Documents */}
          {activeTab === "media" && (
            <div className="space-y-6 animate-fade-in">
              {/* Images */}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-2">Images</label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-kaya-olive/50 hover:bg-kaya-olive/5 transition-colors"
                >
                  <Upload size={28} className="mx-auto text-muted-foreground mb-2" />
                  <p className="font-raleway text-sm text-muted-foreground">Click to upload images</p>
                  <p className="font-raleway text-[10px] text-muted-foreground mt-1">{images.length}/30</p>
                </div>
                <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
                {images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                    {images.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <button
                          onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Owner Docs */}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-2">Owner Docs <span className="text-muted-foreground/60">(Optional)</span></label>
                <div
                  onClick={() => docInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-kaya-olive/50 hover:bg-kaya-olive/5 transition-colors"
                >
                  <Upload size={24} className="mx-auto text-muted-foreground mb-1" />
                  <p className="font-raleway text-xs text-muted-foreground">Upload documents</p>
                  <p className="font-raleway text-[10px] text-muted-foreground mt-0.5">{ownerDocs.length}/30</p>
                </div>
                <input ref={docInputRef} type="file" multiple hidden onChange={handleDocUpload} />
                {ownerDocs.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {ownerDocs.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-lg">
                        <span className="font-raleway text-xs text-foreground truncate">{file.name}</span>
                        <button onClick={() => setOwnerDocs((prev) => prev.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-destructive"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Link */}
              <FormField label="Video Link (Optional)">
                <div className="relative">
                  <Link size={14} className="absolute left-3 top-3 text-muted-foreground" />
                  <input type="url" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} placeholder="Please enter link for video" className="crm-input pl-9" />
                </div>
              </FormField>

              {/* View 360 */}
              <FormField label="View 360 (Optional)">
                <div className="relative">
                  <Link size={14} className="absolute left-3 top-3 text-muted-foreground" />
                  <input type="url" value={view360Link} onChange={(e) => setView360Link(e.target.value)} placeholder="Please enter link for view 360" className="crm-input pl-9" />
                </div>
              </FormField>
            </div>
          )}

          {/* STEP 4: Portals */}
          {activeTab === "portals" && (
            <div className="space-y-5 animate-fade-in">
              <p className="font-raleway text-sm text-muted-foreground">Select portals to publish this listing:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {PORTALS.map((portal) => {
                  const selected = selectedPortals.includes(portal.id);
                  return (
                    <button
                      key={portal.id}
                      onClick={() => togglePortal(portal.id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all font-raleway text-sm",
                        selected
                          ? "border-kaya-olive bg-kaya-olive/5 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-border/80 hover:bg-muted/20"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold", portal.color)}>
                        {portal.name.charAt(0)}
                      </div>
                      <span className="flex-1 text-left text-xs font-medium">{portal.name}</span>
                      <div className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                        selected ? "bg-kaya-olive border-kaya-olive" : "border-border"
                      )}>
                        {selected && <CheckSquare size={12} className="text-primary-foreground" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <button
            onClick={goPrev}
            disabled={tabIndex === 0}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg font-raleway text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} /> Previous Step
          </button>
          {tabIndex < TABS.length - 1 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs font-medium hover:bg-kaya-olive/90 transition-colors"
            >
              Next Step <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs font-medium hover:bg-kaya-olive/90 transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? "Saving..." : "Save Listing"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* Reusable sub-components */
const FormField = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-2">{label}</label>
    {children}
    {error && <p className="font-raleway text-[10px] text-destructive mt-1">{error}</p>}
  </div>
);

const DatePickerField = ({ value, onChange, placeholder }: { value?: Date; onChange: (d: Date | undefined) => void; placeholder: string }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button className={cn("crm-input text-left flex items-center gap-2", !value && "text-muted-foreground")}>
        <CalendarIcon size={14} />
        {value ? format(value, "PPP") : placeholder}
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar mode="single" selected={value} onSelect={onChange} initialFocus className="p-3 pointer-events-auto" />
    </PopoverContent>
  </Popover>
);

export default AddListingForm;
