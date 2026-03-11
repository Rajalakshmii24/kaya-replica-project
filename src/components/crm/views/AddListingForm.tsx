import { useState, useRef } from "react";
import {
  Info, FileText, Image, Globe, ChevronLeft, ChevronRight, Save,
  MapPin, User, UserPlus, FileInput, Calendar as CalendarIcon,
  Upload, X, Link, CheckSquare, Loader2, Home as HomeIcon, Plus, Search,
} from "lucide-react";
import usePlacesAutocomplete, {getGeocode, getLatLng,} from "use-places-autocomplete";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
const CHEQUE_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const PAYMENT_PLAN_OPTIONS = ["10/90", "20/80", "30/70", "40/60", "50/50", "60/40", "Post-handover"];

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

// Amenities with portal compatibility: pf = PropertyFinder, bd = Bayut/Dubizzle
const AMENITIES_LIST: { name: string; pf?: string; bd?: string }[] = [
  { name: "Study", pf: "Study", bd: undefined },
  { name: "Private Garden", pf: "Private Garden", bd: "Lawn or Garden" },
  { name: "Security", pf: "Security", bd: "Security" },
  { name: "Maids Room", pf: "Maids Room", bd: "Maids Room" },
  { name: "Pets Allowed", pf: "Pets Allowed", bd: "Pets Allowed" },
  { name: "Private Pool", pf: "Private Pool", bd: "Private Pool" },
  { name: "Children's Play Area", pf: "Children's Play Area", bd: "Kids Play Area" },
  { name: "Covered Parking", pf: "Covered Parking", bd: "Covered Parking" },
  { name: "Barbecue Area", pf: "Barbecue Area", bd: "Barbecue Area" },
  { name: "Lobby in Building", pf: "Lobby in Building", bd: "Lobby in Building" },
  { name: "Balcony", pf: "Balcony", bd: "Balcony or Terrace" },
  { name: "Private Jacuzzi", pf: "Private Jacuzzi", bd: "Jacuzzi" },
  { name: "Central A/C & Heating", pf: "Central A/C & Heating", bd: "Central A/C" },
  { name: "Private Gym", pf: undefined, bd: undefined },
  { name: "Shared Pool", pf: undefined, bd: undefined },
  { name: "Pantry", pf: undefined, bd: undefined },
  { name: "Mezzanine", pf: undefined, bd: undefined },
  { name: "Available Networked", pf: undefined, bd: undefined },
  { name: "Dinning in Building", pf: undefined, bd: undefined },
  { name: "Conference Room", pf: undefined, bd: undefined },
  { name: "Shared Spa", pf: undefined, bd: undefined },
  { name: "Shared Gym", pf: undefined, bd: undefined },
  { name: "Concierge Service", pf: undefined, bd: undefined },
  { name: "Maid Service", pf: undefined, bd: undefined },
  { name: "Built in Wardrobes", pf: undefined, bd: undefined },
  { name: "Walk-in Closet", pf: undefined, bd: undefined },
  { name: "Built in Kitchen Appliances", pf: undefined, bd: undefined },
  { name: "View of Water", pf: undefined, bd: undefined },
  { name: "View of Landmark", pf: undefined, bd: undefined },
  { name: "Vast-compliant", pf: undefined, bd: undefined },
  { name: "Children's Pool", pf: undefined, bd: undefined },
  { name: "Waste Disposal", pf: undefined, bd: undefined },
  { name: "Maintenance Staff", pf: undefined, bd: undefined },
  { name: "Reception/Waiting Room", pf: undefined, bd: undefined },
  { name: "Storage Room", pf: undefined, bd: undefined },
  { name: "Laundry Service", pf: undefined, bd: undefined },
  { name: "Broadband Ready", pf: undefined, bd: undefined },
  { name: "Business Center", pf: undefined, bd: undefined },
  { name: "Service Elevators", pf: undefined, bd: undefined },
  { name: "Satellite/Cable TV", pf: undefined, bd: undefined },
  { name: "Intercom", pf: undefined, bd: undefined },
  { name: "Gym", pf: undefined, bd: undefined },
  { name: "Gymnasium", pf: undefined, bd: undefined },
  { name: "Sauna", pf: undefined, bd: undefined },
  { name: "BBQ Area", pf: undefined, bd: undefined },
  { name: "Near Mall", pf: undefined, bd: undefined },
  { name: "Steam Room", pf: undefined, bd: undefined },
  { name: "Near School", pf: undefined, bd: undefined },
  { name: "Near Hospital", pf: undefined, bd: undefined },
  { name: "Swimming Pool", pf: undefined, bd: undefined },
  { name: "Community View", pf: undefined, bd: undefined },
  { name: "Fitness Center", pf: undefined, bd: undefined },
  { name: "Part Furnished", pf: undefined, bd: undefined },
  { name: "Public Parking", pf: undefined, bd: undefined },
  { name: "Central Heating", pf: undefined, bd: undefined },
  { name: "Parking Spaces", pf: undefined, bd: undefined },
  { name: "Bank/ATM Facility", pf: undefined, bd: undefined },
  { name: "24 Hours Concierge", pf: undefined, bd: undefined },
  { name: "Near to Shopping Mall", pf: undefined, bd: undefined },
  { name: "Security Staff", pf: undefined, bd: undefined },
  { name: "Gym or Health Club", pf: undefined, bd: undefined },
  { name: "Laundry Room", pf: undefined, bd: undefined },
  { name: "Broadband Internet", pf: undefined, bd: undefined },
  { name: "Storage Areas", pf: undefined, bd: undefined },
  { name: "First Aid Medical Center", pf: undefined, bd: undefined },
  { name: "Facilities for Disabled", pf: undefined, bd: undefined },
  { name: "Electricity Backup", pf: undefined, bd: undefined },
  { name: "Double Glazed Windows", pf: undefined, bd: undefined },
  { name: "Cafeteria or Canteen", pf: undefined, bd: undefined },
  { name: "Day Care Center", pf: undefined, bd: undefined },
  { name: "Nearby Public Transport", pf: undefined, bd: undefined },
  { name: "Centrally Air-Conditioned", pf: undefined, bd: undefined },
];

// Mock owners data
const MOCK_OWNERS = [
  { id: "1", name: "Ahmed Al Maktoum", email: "ahmed@example.com", phone: "+971501234567", nationality: "UAE" },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", phone: "+971502345678", nationality: "UK" },
  { id: "3", name: "Mohammad Ali", email: "mohammad@example.com", phone: "+971503456789", nationality: "Pakistan" },
  { id: "4", name: "Elena Petrova", email: "elena@example.com", phone: "+971504567890", nationality: "Russia" },
  { id: "5", name: "John Smith", email: "john@example.com", phone: "+971505678901", nationality: "USA" },
];

const TABS = [
  { key: "info", label: "Information", icon: Info },
  { key: "desc", label: "Description", icon: FileText },
  { key: "media", label: "Media & Documents", icon: Image },
  { key: "portals", label: "Portals", icon: Globe },
] as const;

type TabKey = typeof TABS[number]["key"];

interface OwnerData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
}

const AddListingForm = ({ type, onSave, onCancel }: AddListingFormProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [isMapMaximized, setIsMapMaximized] = useState(false);
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
  const [paymentPlan, setPaymentPlan] = useState("");

  // Owner state
  const [selectedOwner, setSelectedOwner] = useState<OwnerData | null>(null);
  const [showSelectOwner, setShowSelectOwner] = useState(false);
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState("");
  const [newOwner, setNewOwner] = useState<OwnerData>({ name: "", email: "", phone: "", nationality: "" });

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
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [tempAmenities, setTempAmenities] = useState<string[]>([]);

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

  const handleTabClick = (key: TabKey) => {
    setErrors({});
    setActiveTab(key);
  };

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

  const handleSelectOwner = (owner: OwnerData) => {
    setSelectedOwner(owner);
    setShowSelectOwner(false);
  };

  const handleAddNewOwner = () => {
    if (!newOwner.name.trim() || !newOwner.phone.trim()) return;
    setSelectedOwner({ ...newOwner, id: `new-${Date.now()}` });
    setNewOwner({ name: "", email: "", phone: "", nationality: "" });
    setShowAddOwner(false);
  };

  const openAmenitiesModal = () => {
    setTempAmenities([...selectedAmenities]);
    setShowAmenitiesModal(true);
  };

  const toggleTempAmenity = (name: string) => {
    setTempAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const saveAmenities = () => {
    setSelectedAmenities([...tempAmenities]);
    setShowAmenitiesModal(false);
  };

  const removeAmenity = (name: string) => {
    setSelectedAmenities((prev) => prev.filter((a) => a !== name));
  };

  const filteredOwners = MOCK_OWNERS.filter((o) =>
    o.name.toLowerCase().includes(ownerSearch.toLowerCase()) ||
    o.email.toLowerCase().includes(ownerSearch.toLowerCase()) ||
    o.phone.includes(ownerSearch)
  );

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
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3.5 font-raleway text-xs font-medium transition-colors border-b-2 cursor-pointer",
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
                <FormField label="Property Type" error={errors.propertyType}>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="crm-input">
                    <option value="">Select Type</option>
                    {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormField>

                <div>
                  <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-2">Listing ID</label>
                  <div className="flex items-center gap-4 mb-2">
                    <label className="flex items-center gap-2 font-raleway text-xs cursor-pointer">
                      <input type="radio" name="listingIdMode" checked={listingIdMode === "auto"} onChange={() => setListingIdMode("auto")} className="accent-[hsl(var(--kaya-olive))]" />
                      Auto Generate
                    </label>
                    <label className="flex items-center gap-2 font-raleway text-xs cursor-pointer">
                      <input type="radio" name="listingIdMode" checked={listingIdMode === "custom"} onChange={() => setListingIdMode("custom")} className="accent-[hsl(var(--kaya-olive))]" />
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

              {/* Information Tab -> Location Section */}
              <div className="space-y-4">
                <FormField label="Location">
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-3 text-muted-foreground z-10" />
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Search for community or location..." 
                      className="crm-input pl-9" 
                    />
                    
                    {/* Dropdown List: Only shows when user types and matches exist */}
                    {location.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-auto">
                        {["Jumeirah", "Business Bay", "Downtown Dubai", "Dubai Marina", "Palm Jumeirah"]
                          .filter(item => item.toLowerCase().includes(location.toLowerCase()))
                          .map((community) => (
                            <button
                              key={community}
                              type="button"
                              onClick={() => setLocation(community)}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-kaya-olive/10 transition-colors font-raleway border-b border-border last:border-0"
                            >
                              {community}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </FormField>

                {/* Functional Map Container  */}
                <div className={cn(
                  "relative rounded-xl overflow-hidden border border-border transition-all duration-300 bg-muted/30",
                  isMapMaximized ? "fixed inset-0 z-[100] m-0 rounded-none h-screen w-screen" : "h-64"
                )}>
                  <div className="absolute top-3 right-3 z-[101] flex flex-col gap-2">
                    <button 
                      type="button" 
                      onClick={() => setIsMapMaximized(!isMapMaximized)}
                      className="p-2 bg-white rounded shadow-md hover:bg-gray-100 text-foreground"
                    >
                      {isMapMaximized ? <X size={18} /> : <Plus size={18} />}
                    </button>
                  </div>
                  
                  {/* Use a valid Google Maps Embed URL or API Key */}
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115512.11588825785!2d55.158485203308014!3d25.194689027878783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai!5e0!3m2!1sen!2sae!4v1709720000000!5m2!1sen!2sae" 
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                  
                  {isMapMaximized && (
                    <button 
                      onClick={() => setIsMapMaximized(false)}
                      className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-kaya-olive text-white px-6 py-2 rounded-full shadow-xl font-bold z-[102]"
                    >
                      Confirm Location & Close
                    </button>
                  )}
                </div>
              </div>

              {/* Owner Info */}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-2">Owner Info</label>
                {selectedOwner && (
                  <div className="mb-3 p-3 bg-kaya-olive/5 border border-kaya-olive/20 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-raleway text-sm font-medium text-foreground">{selectedOwner.name}</span>
                      <button onClick={() => setSelectedOwner(null)} className="text-muted-foreground hover:text-destructive"><X size={14} /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] font-raleway text-muted-foreground">
                      <span>{selectedOwner.email}</span>
                      <span>{selectedOwner.phone}</span>
                      
                      <span>{selectedOwner.nationality}</span>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setShowSelectOwner(true)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-raleway text-xs hover:bg-muted/30 transition-colors">
                    <User size={14} /> Select Owner
                  </button>
                  <button onClick={() => setShowAddOwner(true)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-raleway text-xs hover:bg-muted/30 transition-colors">
                    <UserPlus size={14} /> Add Owner
                  </button>
                  <button onClick={() => setShowOwnerForm(true)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-raleway text-xs hover:bg-muted/30 transition-colors">
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
                  <FormField label={type === "RENT" ? "Price (AED)" : "Sale Price (AED)"}>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" className="crm-input" />
                  </FormField>
                  {type === "RENT" ? (
                    <>
                      <FormField label="Cheques">
                        <select value={cheques} onChange={(e) => setCheques(e.target.value)} className="crm-input">
                          {CHEQUE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </FormField>
                      <FormField label="Deposit (AED)">
                        <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="0" className="crm-input" />
                      </FormField>
                    </>
                  ) : (
                    <FormField label="Payment Plan">
                      <select value={paymentPlan} onChange={(e) => setPaymentPlan(e.target.value)} className="crm-input">
                        <option value="">Select</option>
                        {PAYMENT_PLAN_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </FormField>
                  )}
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

              <FormField label="Video Link (Optional)">
                <div className="relative">
                  <Link size={14} className="absolute left-3 top-3 text-muted-foreground" />
                  <input type="url" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} placeholder="Please enter link for video" className="crm-input pl-9" />
                </div>
              </FormField>

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
            <div className="space-y-6 animate-fade-in">
              <p className="font-raleway text-sm text-muted-foreground">Select portals to publish this listing:</p>
              <div className="flex flex-wrap gap-4 items-center">
                {PORTALS.map((portal) => {
                  const selected = selectedPortals.includes(portal.id);
                  return (
                    <div key={portal.id} className="flex items-center gap-2">
                      <button
                        onClick={() => togglePortal(portal.id)}
                        className={cn(
                          "relative w-10 h-5 rounded-full transition-colors",
                          selected ? "bg-kaya-olive" : "bg-muted"
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                          selected ? "left-5" : "left-0.5"
                        )} />
                      </button>
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white text-[10px] font-bold border", portal.color)}>
                        {portal.name.charAt(0)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Amenities Section */}
              <div className="border-t border-border pt-5">
                <div className="flex items-center gap-4 mb-3">
                  <span className="font-raleway text-sm font-medium text-foreground">Amenities</span>
                  {selectedAmenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedAmenities.map((amenity) => (
                        <span key={amenity} className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-kaya-olive/30 bg-kaya-olive/5 font-raleway text-xs text-foreground">
                          {amenity}
                          <button onClick={() => removeAmenity(amenity)} className="text-muted-foreground hover:text-destructive ml-1"><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={openAmenitiesModal}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-full font-raleway text-xs hover:bg-muted/30 transition-colors"
                  >
                    <Plus size={12} /> Add Amenities
                  </button>
                </div>
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

      {/* Select Owner Modal */}
      <Dialog open={showSelectOwner} onOpenChange={setShowSelectOwner}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-raleway">Select Owner</DialogTitle>
          </DialogHeader>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={ownerSearch}
              onChange={(e) => setOwnerSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="crm-input pl-9"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filteredOwners.map((owner) => (
              <button
                key={owner.id}
                onClick={() => handleSelectOwner(owner)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-kaya-olive/5 border border-transparent hover:border-kaya-olive/20",
                  selectedOwner?.id === owner.id && "bg-kaya-olive/10 border-kaya-olive/30"
                )}
              >
                <p className="font-raleway text-sm font-medium text-foreground">{owner.name}</p>
                <p className="font-raleway text-[11px] text-muted-foreground">{owner.email} • {owner.phone} • {owner.nationality}</p>
              </button>
            ))}
            {filteredOwners.length === 0 && (
              <p className="font-raleway text-xs text-muted-foreground text-center py-6">No owners found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Owner Modal */}
      <Dialog open={showAddOwner} onOpenChange={setShowAddOwner}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-raleway">Add New Owner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField label="Name *">
              <input type="text" value={newOwner.name} onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })} placeholder="Full name" className="crm-input" />
            </FormField>
            <FormField label="Email">
              <input type="email" value={newOwner.email} onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })} placeholder="Email" className="crm-input" />
            </FormField>
            <FormField label="Phone *">
              <input type="tel" value={newOwner.phone} onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })} placeholder="+971..." className="crm-input" />
            </FormField>
            <FormField label="Nationality">
              <input type="text" value={newOwner.nationality} onChange={(e) => setNewOwner({ ...newOwner, nationality: e.target.value })} placeholder="Nationality" className="crm-input" />
            </FormField>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddOwner(false)} className="px-4 py-2 border border-border rounded-lg font-raleway text-xs hover:bg-muted/30">Cancel</button>
              <button onClick={handleAddNewOwner} className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs hover:bg-kaya-olive/90">Save Owner</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Owner Form Modal (inline entry) */}
      <Dialog open={showOwnerForm} onOpenChange={setShowOwnerForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-raleway">Owner Details Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField label="Owner Name">
              <input type="text" value={selectedOwner?.name || ""} onChange={(e) => setSelectedOwner((prev) => prev ? { ...prev, name: e.target.value } : { name: e.target.value, email: "", phone: "", nationality: "" })} placeholder="Full name" className="crm-input" />
            </FormField>
            <FormField label="Email">
              <input type="email" value={selectedOwner?.email || ""} onChange={(e) => setSelectedOwner((prev) => prev ? { ...prev, email: e.target.value } : { name: "", email: e.target.value, phone: "", nationality: "" })} placeholder="Email" className="crm-input" />
            </FormField>
            <FormField label="Phone">
              <input type="tel" value={selectedOwner?.phone || ""} onChange={(e) => setSelectedOwner((prev) => prev ? { ...prev, phone: e.target.value } : { name: "", email: "", phone: e.target.value, nationality: "" })} placeholder="Phone" className="crm-input" />
            </FormField>
            <FormField label="Nationality">
              <input type="text" value={selectedOwner?.nationality || ""} onChange={(e) => setSelectedOwner((prev) => prev ? { ...prev, nationality: e.target.value } : { name: "", email: "", phone: "", nationality: e.target.value })} placeholder="Nationality" className="crm-input" />
            </FormField>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowOwnerForm(false)} className="px-4 py-2 border border-border rounded-lg font-raleway text-xs hover:bg-muted/30">Close</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Amenities Modal */}
      <Dialog open={showAmenitiesModal} onOpenChange={setShowAmenitiesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-raleway">Amenities</DialogTitle>
              <div className="font-raleway text-xs text-muted-foreground">
                Notice: <span className="text-red-500 font-medium">Red</span> for PropertyFinder &nbsp;&nbsp; <span className="text-green-500 font-medium">Green</span> for Dubizzle/Bayut
              </div>
            </div>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 py-4">
            {AMENITIES_LIST.map((amenity) => {
              const isSelected = tempAmenities.includes(amenity.name);
              const hasPf = !!amenity.pf;
              const hasBd = !!amenity.bd;

              return (
                <button
                  key={amenity.name}
                  onClick={() => toggleTempAmenity(amenity.name)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border font-raleway text-xs transition-all",
                    isSelected
                      ? "border-kaya-olive bg-kaya-olive/10 ring-1 ring-kaya-olive/30"
                      : "border-border hover:border-muted-foreground/40"
                  )}
                >
                  {hasPf && hasBd ? (
                    <span>
                      <span className="text-red-500">{amenity.pf}</span>
                      {" / "}
                      <span className="text-green-500">{amenity.bd}</span>
                    </span>
                  ) : hasPf ? (
                    <span className="text-red-500">{amenity.pf}</span>
                  ) : hasBd ? (
                    <span className="text-green-500">{amenity.bd}</span>
                  ) : (
                    <span className="text-foreground">{amenity.name}</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button onClick={() => setShowAmenitiesModal(false)} className="px-4 py-2 border border-border rounded-lg font-raleway text-xs hover:bg-muted/30">Cancel</button>
            <button onClick={saveAmenities} className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs hover:bg-kaya-olive/90">Save Amenities</button>
          </div>
        </DialogContent>
      </Dialog>
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
