import { useState, useMemo } from "react";
import {
  MapPin, Info, FileText, Image, Layers, CreditCard, Globe,
  ChevronLeft, ChevronRight, Save, X, Plus, Upload, Trash2, Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

/* ───────────── constants ───────────── */

const TABS = [
  { key: "location", label: "Location", icon: MapPin },
  { key: "information", label: "Information", icon: Info },
  { key: "description", label: "Description", icon: FileText },
  { key: "media", label: "Media & Documents", icon: Image },
  { key: "floorplans", label: "Floor Plans", icon: Layers },
  { key: "payment", label: "Payment Plan", icon: CreditCard },
  { key: "portals", label: "Portals", icon: Globe },
] as const;
type TabKey = typeof TABS[number]["key"];

const AREAS: string[] = [
  "Downtown Dubai, Dubai","Business Bay, Dubai","Dubai Creek Harbour, Dubai","Dubai Marina, Dubai",
  "Jumeirah Beach Residence, Dubai","Jumeirah Lake Towers (JLT), Dubai","Jumeirah Village Circle (JVC), Dubai",
  "Palm Jumeirah, Dubai","Arjan, Dubai","Dubai Silicon Oasis, Dubai","Bluewaters Island, Dubai",
  "Dubai Sports City, Dubai","Motor City, Dubai","Al Furjan, Dubai","Dubai Hills Estate, Dubai",
  "City Walk, Dubai","Al Wasl, Dubai","Mohammed Bin Rashid City, Dubai","Damac Lagoons, Dubai",
  "DAMAC Hills, Dubai","Dubailand, Dubai","Tilal Al Ghaf, Dubai","DAMAC Hills 2 (Akoya by DAMAC), Dubai",
  "Meydan City, Dubai","EMAAR South, Dubai","Dubai South, Dubai","Jumeirah, Dubai",
  "Arabian Ranches, Dubai","Town Square, Dubai","Arabian Ranches 2, Dubai","Al Jaddaf, Dubai",
  "Arabian Ranches 3, Dubai","Bur Dubai, Dubai","Jumeirah Park, Dubai","Mudon, Dubai",
  "Umm Suqeim, Dubai","Jumeirah Village Triangle (JVT), Dubai","Reem, Dubai","The Springs, Dubai",
  "Dubai Science Park, Dubai","Nad Al Sheba, Dubai","Dubai Residence Complex, Dubai","Al Sufouh, Dubai",
  "Dubai Production City (IMPZ), Dubai","The Valley, Dubai","Remraam, Dubai","Jumeirah Golf Estates, Dubai",
  "The Villa, Dubai","Dubai Investment Park (DIP), Dubai","Serena, Dubai","The Views, Dubai",
  "Mirdif, Dubai","Al Barari, Dubai","The Greens, Dubai","Jebel Ali, Dubai","Za'abeel, Dubai",
  "DIFC, Dubai","Culture Village, Dubai","Dubai Maritime City, Dubai","The Meadows, Dubai",
  "Green Community, Dubai","Liwan, Dubai","Dubai World Central, Dubai","Discovery Gardens, Dubai",
  "The Hills, Dubai","Al Barsha, Dubai","Golf City, Dubai","Barsha Heights (Tecom), Dubai",
  "Jumeirah Islands, Dubai","Emirates Hills, Dubai","Dubai Media City, Dubai","Dubai Studio City, Dubai",
  "The Lakes, Dubai","Downtown Jebel Ali, Dubai","Wasl Gate, Dubai","The World Islands, Dubai",
  "Pearl Jumeirah, Dubai","Al Quoz, Dubai","Sheikh Zayed Road, Dubai","Dubai Festival City, Dubai",
  "Dubai Waterfront, Dubai","World Trade Center, Dubai","Al Mamzar, Dubai","Al Warsan, Dubai",
  "Al Warqaa, Dubai","Dubai Industrial City, Dubai","Deira, Dubai","Al Satwa, Dubai",
  "The Sustainable City, Dubai","Al Khawaneej, Dubai","Umm Al Sheif, Dubai","Al Manara, Dubai",
  "Wadi Al Safa 2, Dubai","Al Safa, Dubai","Dubai Islands, Dubai","Mina Rashid, Dubai",
  "Al Rashidiya, Dubai","Al Twar, Dubai","Al Badaa, Dubai","City of Arabia, Dubai",
  "Al Mizhar, Dubai","Liwan 2, Dubai","Jumeirah Heights, Dubai","Nad Al Hammar, Dubai",
  "Al Qusais, Dubai","Al Garhoud, Dubai","Al Jafiliya, Dubai","Dubai Internet City, Dubai",
  "Al Lisaili, Dubai","Wadi Al Shabak, Dubai","Dubai Pearl, Dubai","Umm Ramool, Dubai",
  "Bukadra, Dubai","Academic City, Dubai","Dubai Promenade, Dubai","Murqquab, Dubai",
  "Technology Park, Dubai","Dubai Airport Freezone (DAFZA), Dubai","Dragon City, Dubai",
  "Al Hudaiba, Dubai","Nad Shamma, Dubai","International City, Dubai","Old Town, Dubai",
  "Al Nahda, Dubai","Oud Al Muteena, Dubai","Al Mina, Dubai","Al karama, Dubai",
  "Ras Al Khor, Dubai","Al Aweer, Dubai","Knowledge Village, Dubai","Palm Jebel Ali, Dubai",
  "Expo City, Dubai","Dubai Harbour, Dubai","Dubai Design District, Dubai","Majan, Dubai",
  "Falcon city of Wonders, Dubai","Living Legends, Dubai","The Oasis by Emaar, Dubai",
  "Rukan, Dubai","Al Muhaisnah, Dubai","Dubai Healthcare city, Dubai","Al Nahda, Sharjah",
  "The Gardens, Dubai","Al Kifaf, Dubai","Wadi Al Safa 3, Dubai","Sobha Hartland, Dubai",
  "Sobha Hartland 2, Dubai","Riverside, Dubai","Wadi Al Safa 5, Dubai",
  "Jumeirah Garden City, Dubai","Al Yelayiss 2, Dubai","Dubai Land Residence Complex, Dubai",
  "Ghadeer Al Tair, Dubai","The Acres","Wadi Al Safa 7, Dubai",
  "Grand Polo Club and Resort, Dubai","Ghaf Woods, Dubai","International City Phase 2, Dubai",
  "Wasl 1, Dubai","Wadi Al Amardi, Dubai","Al Athbah, Dubai","Umm Al Sheif, Dubai",
  "Hadaeq Sheikh Mohammed Bin Rashid, Dubai","Dubai Lifestyle City, Dubai","Meydan Horizon, Dubai",
  "The Heights, Dubai","DAMAC Islands 2, Dubai","Al Yelayiss 1, Dubai","Sobha Sanctuary, Dubai",
  "Damac Islands, Dubai",
  // Umm Al Quwain
  "Umm Al Thuoob, Umm al-Quwain","Umm Dir, Umm al-Quwain","Green Belt, Umm al-Quwain",
  "Al Barqaa, Umm al-Quwain","Al Salam City, Umm al-Quwain","Umm Al Quwain Marina, Umm al-Quwain",
  "Emirates Modern Industrial, Umm al-Quwain","Khor Al Beidah, Umm al-Quwain","White Bay, Umm al-Quwain",
  "Al Raas, Umm al-Quwain","Al Raudah, Umm al-Quwain",
  // RAK
  "Al Qurm, Ras Al Khaimah","Al Hamra Village, Ras Al Khaimah","Al Marjan Island, Ras Al Khaimah",
  "Mina Al Arab, Ras Al Khaimah","Ras Al Khaimah Waterfront, Ras Al Khaimah",
  "Hayat Island, Ras Al Khaimah","RAK Central, Ras Al Khaimah",
  // Sharjah
  "Maryam Island, Sharjah","Sharjah Sustainable City, Sharjah","Aljada, Sharjah",
  "Sharjah Waterfront City, Sharjah","Tilal City, Sharjah","Al Rahmaniya, Sharjah",
  // Ajman
  "Ajman Downtown, Ajman","Al Zorah, Ajman","Emirates City, Ajman","Corniche Ajman, Ajman",
  // Abu Dhabi
  "Al Reem Island, Abu Dhabi","Saadiyat Island, Abu Dhabi","Yas Island, Abu Dhabi",
  "Masdar City, Abu Dhabi","Khalifa City, Abu Dhabi","Al Raha Beach, Abu Dhabi",
  "Al Maryah Island, Abu Dhabi","Bloom Living, Abu Dhabi",
  // Fujairah
  "Downtown Fujairah, Fujairah","Dibba Al Fujairah, Fujairah",
  // Al Ain
  "Al Jimi, Al Ain","Falaj Hazzaa, Al Ain",
  // Emirates
  "Abu Dhabi","Dubai","Sharjah","Ajman","Ras Al Khaimah","Fujairah","Umm Al Quwain","Al Ain",
];

const DEVELOPERS: string[] = [
  "Emaar Properties","DAMAC Properties","Nakheel","Meraas","Dubai Properties",
  "Sobha Realty","Azizi Developments","Danube Properties","Omniyat","Ellington Properties",
  "MAG Group","Aldar Properties","Reportage Properties","Samana Developers","Binghatti Developers",
  "Tiger Group","Deyaar Development","Select Group","ORO24 Developments","Imtiaz Developments",
  "Vincitore","Object 1","Eagle Hills","ARADA","Bloom Holding","Mubadala","Modon Properties",
  "RAK Properties","Al Hamra","Union Properties","Nshama","Dubai Holding","Wasl Properties",
  "Meydan","Majid Al Futtaim","ICD Brookfield","Leos Developments","Seven Tides","Palma Holding",
  "AHS Properties","Aark Developers","First Group","Kleindienst Group","G&Co","JA Resorts",
  "Aqua Properties","Refine Development","Riviera Group","DHG Properties","Al Barari",
  "Gemini Property Developers","National Properties","SRTIP","Sapphire Group","Arenco Real Estate",
  "Peninsula Real Estate","Al Fahim Group","Dar Global","Tebyan","Prestige One","Haven Developments",
  "Qube Development","Credo Investments","Pantheon Development","Sunrise Bay","Condor Developers",
  "La Casa Development","Al Habtoor Group","Al Ghurair","Majilis Property","Luxury Living Development",
  "Taraf","Dubai Asset Group","Palm Hills","Marriott International","Accor","Hilton","Kerzner",
  "Address Hotels","Vida Hotels","The First Group","Nikki Beach","St Regis","Ritz-Carlton",
  "W Hotels","JW Marriott","Bvlgari","Six Senses","Fairmont","One&Only",
];

const PROPERTY_TYPES = {
  Residential: ["Apartment","Villa","Townhouse","Penthouse","Hotel Apartment","Duplex","Residential Floor","Residential Plot","Residential Building","Compound"],
  Commercial: ["Office","Shop","Commercial Building","Commercial Floor","Commercial Plot","Labor Camp","Retail","Show Room","Staff Accommodation","Commercial Villa","Warehouse","Farm","Factory","Hotel","Hospital","Co-Working Space","Business Centre","Mixed Use Land"],
};

const BEDROOMS = ["Studio","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","20+"];
const BATHROOMS = ["1","2","3","4","5","6","7","8","9","10"];

const AMENITIES = [
  "Study","Private Garden","Maid's Room","Built in Wardrobes","Central A/C","Balcony",
  "Private Pool","Shared Pool","Children's Play Area","Gym","Sauna/Steam Room","Covered Parking",
  "Pets Allowed","Security","Concierge","Beach Access","View of Water","View of Landmark",
  "Lobby in Building","Broadband Ready","Networked","Private Jacuzzi","Shared Spa",
  "Walk-in Closet","Built in Kitchen Appliances","Maids Room","Storage Room","Laundry Room",
  "Driver's Room","Private Gym","View of Garden","City View","Community View","Marina View",
  "Sea View","Pool View","Golf View","Canal View","Burj Khalifa View","Park View",
  "Courtyard View","Skyline View","Street View","Lake View","Resort View",
  "Smart Home System","Furnished Kitchen","Marble Flooring","Double Glazed Windows",
  "Centrally Air-Conditioned","Disposal","Conference Room","Business Centre","Reception/Waiting Room",
  "Available Furnished","Available Networked","Maintenance","Cleaning Services","Electricity Backup",
  "ATM Facility","Kids Play Area","Day Care Centre","Mosque","Shopping and Retail",
  "Restaurants","Cafeteria","Public Parks","Public Transport","Hospital/Medical Centre","Schools Nearby",
];

const PORTALS = ["Website"];

/* ───────────── types ───────────── */
interface FloorPlanEntry {
  id: string;
  title: string;
  bedrooms: string;
  price: string;
  size: string;
  file: File | null;
}

interface Props {
  onSave: () => void;
  onCancel: () => void;
}

/* ───────────── component ───────────── */
const AddNewProjectForm = ({ onSave, onCancel }: Props) => {
  const [tab, setTab] = useState<TabKey>("location");
  const [saving, setSaving] = useState(false);

  // Location state
  const [projectName, setProjectName] = useState("");
  const [area, setArea] = useState("");
  const [areaSearch, setAreaSearch] = useState("");
  const [areaOpen, setAreaOpen] = useState(false);
  const [developer, setDeveloper] = useState("");
  const [devSearch, setDevSearch] = useState("");
  const [devOpen, setDevOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [exactLocation, setExactLocation] = useState(false);

  // Information state
  const [propCategory, setPropCategory] = useState<"Residential" | "Commercial">("Residential");
  const [propType, setPropType] = useState("");
  const [sizeMin, setSizeMin] = useState("");
  const [sizeMax, setSizeMax] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [handoverDate, setHandoverDate] = useState<Date>();
  const [startingPrice, setStartingPrice] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");

  // Description
  const [description, setDescription] = useState("");

  // Media
  const [images, setImages] = useState<File[]>([]);
  const [brochures, setBrochures] = useState<File[]>([]);

  // Floor Plans
  const [floorPlans, setFloorPlans] = useState<FloorPlanEntry[]>([]);
  const [fpTitle, setFpTitle] = useState("");
  const [fpBeds, setFpBeds] = useState("");
  const [fpPrice, setFpPrice] = useState("");
  const [fpSize, setFpSize] = useState("");
  const [fpFile, setFpFile] = useState<File | null>(null);
  const [fpError, setFpError] = useState("");

  // Payment Plan
  const [firstInstall, setFirstInstall] = useState("");
  const [underConstruction, setUnderConstruction] = useState("");
  const [onHandover, setOnHandover] = useState("");
  const [postHandover, setPostHandover] = useState("");

  // Portals
  const [enabledPortals, setEnabledPortals] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [amenitiesModal, setAmenitiesModal] = useState(false);

  const tabIndex = TABS.findIndex((t) => t.key === tab);

  const paymentTotal = useMemo(() => {
    const vals = [firstInstall, underConstruction, onHandover, postHandover].map(Number);
    if (vals.some(isNaN)) return "NaN%";
    return vals.reduce((a, b) => a + b, 0) + "%";
  }, [firstInstall, underConstruction, onHandover, postHandover]);

  const filteredAreas = AREAS.filter((a) => a.toLowerCase().includes(areaSearch.toLowerCase()));
  const filteredDevs = DEVELOPERS.filter((d) => d.toLowerCase().includes(devSearch.toLowerCase()));

  /* validation */
  const validateTab = (): boolean => {
    if (tab === "location") {
      if (!projectName.trim()) { toast.error("Project Name is required"); return false; }
      if (!area) { toast.error("Area is required"); return false; }
      if (!developer) { toast.error("Developer is required"); return false; }
    }
    if (tab === "information" && !propType) { toast.error("Property Type is required"); return false; }
    return true;
  };

  const goNext = () => {
    if (!validateTab()) return;
    if (tabIndex < TABS.length - 1) setTab(TABS[tabIndex + 1].key);
  };
  const goPrev = () => { if (tabIndex > 0) setTab(TABS[tabIndex - 1].key); };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Project saved successfully!");
    setSaving(false);
    onSave();
  };

  const addFloorPlan = () => {
    if (!fpTitle.trim()) { setFpError("Title cannot be empty!"); return; }
    if (!fpBeds) { setFpError("Bedrooms is required"); return; }
    setFpError("");
    setFloorPlans((prev) => [...prev, { id: crypto.randomUUID(), title: fpTitle, bedrooms: fpBeds, price: fpPrice, size: fpSize, file: fpFile }]);
    setFpTitle(""); setFpBeds(""); setFpPrice(""); setFpSize(""); setFpFile(null);
  };

  /* ───── render helpers ───── */
  const label = (text: string, required = false) => (
    <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">
      {text} {required && <span className="text-destructive">*</span>}
    </label>
  );

  const inputCls = "w-full px-3 py-2.5 bg-background border border-border rounded-xl font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50";
  const selectCls = inputCls + " appearance-none";

  /* ───── tab renderers ───── */

  const renderLocation = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Project Name */}
        <div>
          {label("Project Name", true)}
          <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className={inputCls} placeholder="Enter project name" />
        </div>

        {/* Area Dropdown */}
        <div className="relative">
          {label("Area", true)}
          <input
            value={areaOpen ? areaSearch : area}
            onChange={(e) => { setAreaSearch(e.target.value); setAreaOpen(true); }}
            onFocus={() => setAreaOpen(true)}
            className={inputCls}
            placeholder="Search area..."
          />
          {areaOpen && (
            <div className="absolute z-30 w-full mt-1 max-h-48 overflow-y-auto bg-card border border-border rounded-xl shadow-lg">
              {filteredAreas.slice(0, 50).map((a) => (
                <button key={a} onClick={() => { setArea(a); setAreaSearch(""); setAreaOpen(false); }}
                  className="w-full text-left px-3 py-2 font-raleway text-xs hover:bg-muted/50 text-foreground truncate">
                  {a}
                </button>
              ))}
              {filteredAreas.length === 0 && <p className="px-3 py-2 font-raleway text-xs text-muted-foreground">No areas found</p>}
            </div>
          )}
        </div>

        {/* Developer Dropdown */}
        <div className="relative">
          {label("Developer", true)}
          <input
            value={devOpen ? devSearch : developer}
            onChange={(e) => { setDevSearch(e.target.value); setDevOpen(true); }}
            onFocus={() => setDevOpen(true)}
            className={inputCls}
            placeholder="Search developer..."
          />
          {devOpen && (
            <div className="absolute z-30 w-full mt-1 max-h-48 overflow-y-auto bg-card border border-border rounded-xl shadow-lg">
              {filteredDevs.slice(0, 50).map((d) => (
                <button key={d} onClick={() => { setDeveloper(d); setDevSearch(""); setDevOpen(false); }}
                  className="w-full text-left px-3 py-2 font-raleway text-xs hover:bg-muted/50 text-foreground truncate">
                  {d}
                </button>
              ))}
              {filteredDevs.length === 0 && <p className="px-3 py-2 font-raleway text-xs text-muted-foreground">No developers found</p>}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div>
        {label("Location on Map")}
        <input value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} className={cn(inputCls, "mb-3")} placeholder="Search location on map..." />
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => setExactLocation(!exactLocation)}
            className={`relative w-10 h-5 rounded-full transition-colors ${exactLocation ? "bg-kaya-olive" : "bg-muted"}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${exactLocation ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
          <span className="font-raleway text-xs text-muted-foreground">Exact Location</span>
        </div>
        <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center border border-border">
          <div className="text-center">
            <MapPin size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="font-raleway text-xs text-muted-foreground">Map placeholder — Google Maps integration</p>
            {locationSearch && <p className="font-raleway text-xs text-kaya-olive mt-1">Searching: {locationSearch}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInformation = () => (
    <div className="space-y-5">
      {/* Property Type */}
      <div>
        {label("Property Type", true)}
        <div className="flex gap-2 mb-2">
          {(["Residential", "Commercial"] as const).map((cat) => (
            <button key={cat} onClick={() => { setPropCategory(cat); setPropType(""); }}
              className={`px-4 py-1.5 rounded-lg font-raleway text-xs font-medium transition-colors ${propCategory === cat ? "bg-kaya-olive text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>
        <select value={propType} onChange={(e) => setPropType(e.target.value)} className={selectCls}>
          <option value="">Select type...</option>
          {PROPERTY_TYPES[propCategory].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          {label("Size Min (sqft)")}
          <input type="number" value={sizeMin} onChange={(e) => setSizeMin(e.target.value)} className={inputCls} placeholder="Min sqft" />
        </div>
        <div>
          {label("Size Max (sqft)")}
          <input type="number" value={sizeMax} onChange={(e) => setSizeMax(e.target.value)} className={inputCls} placeholder="Max sqft" />
        </div>
        <div>
          {label("Bedrooms")}
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={selectCls}>
            <option value="">Select...</option>
            {BEDROOMS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          {label("Bathrooms")}
          <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className={selectCls}>
            <option value="">Select...</option>
            {BATHROOMS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          {label("Total Units")}
          <input type="number" value={totalUnits} onChange={(e) => setTotalUnits(e.target.value)} className={inputCls} placeholder="Units" />
        </div>
        <div>
          {label("Total Floors")}
          <input type="number" value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} className={inputCls} placeholder="Floors" />
        </div>
      </div>

      {/* Handover Date */}
      <div>
        {label("Handover Date")}
        <Popover>
          <PopoverTrigger asChild>
            <button className={cn(inputCls, "flex items-center justify-between text-left", !handoverDate && "text-muted-foreground")}>
              {handoverDate ? format(handoverDate, "PPP") : "Pick handover date"}
              <CalendarIcon size={16} className="text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={handoverDate} onSelect={setHandoverDate} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          {label("Starting Price (AED)")}
          <input type="number" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} className={inputCls} placeholder="AED" />
        </div>
        <div>
          {label("Service Charge (AED)")}
          <input type="number" value={serviceCharge} onChange={(e) => setServiceCharge(e.target.value)} className={inputCls} placeholder="AED" />
        </div>
      </div>
    </div>
  );

  const renderDescription = () => (
    <div className="space-y-4">
      {label("Add Description")}
      <textarea
        value={description}
        onChange={(e) => { if (e.target.value.length <= 3000) setDescription(e.target.value); }}
        className={cn(inputCls, "h-60 resize-none")}
        placeholder="Write a detailed project description..."
      />
      <p className="font-raleway text-xs text-muted-foreground text-right">{description.length} / 3,000</p>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-6">
      {/* Images */}
      <div>
        {label("Images (up to 30)")}
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-kaya-olive/50 transition-colors">
          <Upload size={24} className="text-muted-foreground mb-2" />
          <span className="font-raleway text-xs text-muted-foreground">Click to upload images</span>
          <input type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => { if (e.target.files) setImages((prev) => [...prev, ...Array.from(e.target.files!)].slice(0, 30)); }} />
        </label>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {images.map((f, i) => (
              <div key={i} className="relative group">
                <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Image size={16} className="text-muted-foreground" />
                </div>
                <button onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
                <p className="font-raleway text-[9px] text-muted-foreground truncate w-20 mt-0.5">{f.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brochures */}
      <div>
        {label("Developer Brochures (up to 30)")}
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-kaya-olive/50 transition-colors">
          <Upload size={24} className="text-muted-foreground mb-2" />
          <span className="font-raleway text-xs text-muted-foreground">Click to upload brochures</span>
          <input type="file" multiple className="hidden"
            onChange={(e) => { if (e.target.files) setBrochures((prev) => [...prev, ...Array.from(e.target.files!)].slice(0, 30)); }} />
        </label>
        {brochures.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {brochures.map((f, i) => (
              <div key={i} className="relative group">
                <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <FileText size={16} className="text-muted-foreground" />
                </div>
                <button onClick={() => setBrochures((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
                <p className="font-raleway text-[9px] text-muted-foreground truncate w-20 mt-0.5">{f.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderFloorPlans = () => (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-raleway text-sm font-medium text-foreground">Add Floor Plan</h3>
        {fpError && <p className="font-raleway text-xs text-destructive">{fpError}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            {label("Title", true)}
            <input value={fpTitle} onChange={(e) => setFpTitle(e.target.value)} className={inputCls} placeholder="e.g. Type A - 1BR" />
          </div>
          <div>
            {label("Bedrooms", true)}
            <select value={fpBeds} onChange={(e) => setFpBeds(e.target.value)} className={selectCls}>
              <option value="">Select...</option>
              {BEDROOMS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            {label("Price (AED)")}
            <input type="number" value={fpPrice} onChange={(e) => setFpPrice(e.target.value)} className={inputCls} placeholder="AED" />
          </div>
          <div>
            {label("Size (sqft)")}
            <input type="number" value={fpSize} onChange={(e) => setFpSize(e.target.value)} className={inputCls} placeholder="sqft" />
          </div>
          <div>
            {label("Layout File")}
            <label className="flex items-center gap-2 px-3 py-2.5 bg-background border border-border rounded-xl cursor-pointer hover:border-kaya-olive/50">
              <Upload size={14} className="text-muted-foreground" />
              <span className="font-raleway text-xs text-muted-foreground truncate">{fpFile ? fpFile.name : "Upload layout"}</span>
              <input type="file" className="hidden" onChange={(e) => setFpFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button onClick={() => { setFpTitle(""); setFpBeds(""); setFpPrice(""); setFpSize(""); setFpFile(null); setFpError(""); }}
            className="px-4 py-2 font-raleway text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={addFloorPlan}
            className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs font-medium hover:bg-kaya-olive/90">
            <Plus size={14} className="inline mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Floor Plan List */}
      {floorPlans.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <h3 className="font-raleway text-sm font-medium text-foreground px-5 py-3 border-b border-border">Floor Plan List</h3>
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-5 py-2 font-raleway text-xs font-medium text-foreground">Title</th>
                <th className="text-left px-5 py-2 font-raleway text-xs font-medium text-foreground">Beds</th>
                <th className="text-left px-5 py-2 font-raleway text-xs font-medium text-foreground">Price</th>
                <th className="text-left px-5 py-2 font-raleway text-xs font-medium text-foreground">Size</th>
                <th className="text-right px-5 py-2 font-raleway text-xs font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {floorPlans.map((fp) => (
                <tr key={fp.id} className="hover:bg-muted/30">
                  <td className="px-5 py-2 font-raleway text-sm text-foreground">{fp.title}</td>
                  <td className="px-5 py-2 font-raleway text-xs text-muted-foreground">{fp.bedrooms}</td>
                  <td className="px-5 py-2 font-raleway text-xs text-muted-foreground">{fp.price ? `AED ${Number(fp.price).toLocaleString()}` : "—"}</td>
                  <td className="px-5 py-2 font-raleway text-xs text-muted-foreground">{fp.size ? `${fp.size} sqft` : "—"}</td>
                  <td className="px-5 py-2 text-right">
                    <button onClick={() => setFloorPlans((prev) => prev.filter((x) => x.id !== fp.id))}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          {label("First Installment (%)")}
          <input type="number" value={firstInstall} onChange={(e) => setFirstInstall(e.target.value)} className={inputCls} placeholder="%" />
        </div>
        <div>
          {label("Under Construction (%)")}
          <input type="number" value={underConstruction} onChange={(e) => setUnderConstruction(e.target.value)} className={inputCls} placeholder="%" />
        </div>
        <div>
          {label("On Handover (%)")}
          <input type="number" value={onHandover} onChange={(e) => setOnHandover(e.target.value)} className={inputCls} placeholder="%" />
        </div>
        <div>
          {label("Post Handover (%)")}
          <input type="number" value={postHandover} onChange={(e) => setPostHandover(e.target.value)} className={inputCls} placeholder="%" />
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
        <span className="font-raleway text-sm font-medium text-foreground">Total</span>
        <span className={`font-raleway text-lg font-bold ${paymentTotal === "NaN%" ? "text-destructive" : "text-kaya-olive"}`}>
          {paymentTotal}
        </span>
      </div>
    </div>
  );

  const renderPortals = () => (
    <div className="space-y-6">
      {/* Portal Toggles */}
      <div>
        {label("Enable Portals")}
        <div className="space-y-3">
          {PORTALS.map((p) => (
            <div key={p} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
              <span className="font-raleway text-sm text-foreground">{p}</span>
              <button onClick={() => setEnabledPortals((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])}
                className={`relative w-10 h-5 rounded-full transition-colors ${enabledPortals.includes(p) ? "bg-kaya-olive" : "bg-muted"}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${enabledPortals.includes(p) ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        {label("Amenities")}
        <button onClick={() => setAmenitiesModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-kaya-olive text-primary-foreground rounded-xl font-raleway text-xs font-medium hover:bg-kaya-olive/90">
          <Plus size={14} /> Add Amenities
        </button>
        {selectedAmenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedAmenities.map((a) => (
              <span key={a} className="inline-flex items-center gap-1 px-3 py-1 bg-kaya-olive/10 text-foreground rounded-full font-raleway text-xs">
                {a}
                <button onClick={() => setSelectedAmenities((prev) => prev.filter((x) => x !== a))}>
                  <X size={12} className="text-muted-foreground hover:text-destructive" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Amenities Modal */}
      <Dialog open={amenitiesModal} onOpenChange={setAmenitiesModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-raleway">Select Amenities</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 mt-4">
            {AMENITIES.map((a, i) => {
              const isSelected = selectedAmenities.includes(a);
              // Color code: even index = PF (red), odd = Bayut (green)
              const colorCls = i % 2 === 0 ? "text-red-600" : "text-green-600";
              return (
                <button
                  key={a}
                  onClick={() => setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a])}
                  className={`px-3 py-1.5 rounded-lg border font-raleway text-xs transition-all ${
                    isSelected
                      ? "bg-kaya-olive text-primary-foreground border-kaya-olive"
                      : `bg-card border-border hover:border-foreground/30 ${colorCls}`
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => setAmenitiesModal(false)}
              className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-sm font-medium hover:bg-kaya-olive/90">
              Save Amenities
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderTab = () => {
    switch (tab) {
      case "location": return renderLocation();
      case "information": return renderInformation();
      case "description": return renderDescription();
      case "media": return renderMedia();
      case "floorplans": return renderFloorPlans();
      case "payment": return renderPayment();
      case "portals": return renderPortals();
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb + Save */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-raleway text-xs text-muted-foreground">
          <button onClick={onCancel} className="hover:text-foreground">Home</button>
          <ChevronRight size={12} />
          <button onClick={onCancel} className="hover:text-foreground">New Projects</button>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">Add New Project</span>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs font-medium hover:bg-kaya-olive/90 disabled:opacity-60">
          {saving ? <span className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" /> : <Save size={14} />}
          Save
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex overflow-x-auto border-b border-border">
          {TABS.map((t, i) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 font-raleway text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "border-kaya-olive text-foreground bg-kaya-olive/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-5 md:p-6">
          {renderTab()}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button onClick={goPrev} disabled={tabIndex === 0}
          className="flex items-center gap-2 px-4 py-2 font-raleway text-xs text-muted-foreground hover:text-foreground disabled:opacity-40">
          <ChevronLeft size={14} /> Previous Step
        </button>
        <button onClick={goNext} disabled={tabIndex === TABS.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs font-medium hover:bg-kaya-olive/90 disabled:opacity-40">
          Next Step <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default AddNewProjectForm;
