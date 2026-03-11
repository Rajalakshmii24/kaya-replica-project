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
  

  "Downtown Dubai","Business Bay","Dubai Creek Harbour","Dubai Marina","Jumeirah Beach Residence",
  "Jumeirah Lake Towers (JLT)","Jumeirah Village Circle (JVC)","Palm Jumeirah","Arjan",
  "Dubai Silicon Oasis","Bluewaters Island","Dubai Sports City","Motor City","Al Furjan",
  "Dubai Hills Estate","City Walk","Al Wasl","Mohammed Bin Rashid City","Damac Lagoons",
  "DAMAC Hills","Dubailand","Tilal Al Ghaf","DAMAC Hills 2 (Akoya by DAMAC)","Meydan City",
  "EMAAR South","Dubai South","Jumeirah","Arabian Ranches","Town Square","Arabian Ranches 2",
  "Al Jaddaf","Arabian Ranches 3","Bur Dubai","Jumeirah Park","Mudon","Umm Suqeim",
  "Jumeirah Village Triangle (JVT)","Reem","The Springs","Dubai Science Park","Nad Al Sheba",
  "Dubai Residence Complex","Al Sufouh","Dubai Production City (IMPZ)","The Valley",
  "Remraam","Jumeirah Golf Estates","The Villa","Dubai Investment Park (DIP)","Serena",
  "The Views","Mirdif","Al Barari","The Greens","Jebel Ali","Za'abeel","DIFC",
  "Culture Village","Dubai Maritime City","The Meadows","Green Community","Liwan",
  "Dubai World Central","Discovery Gardens","The Hills","Al Barsha","Golf City",
  "Barsha Heights (Tecom)","Jumeirah Islands","Emirates Hills","Dubai Media City",
  "Dubai Studio City","The Lakes","Downtown Jebel Ali","Wasl Gate","The World Islands",
  "Pearl Jumeirah","Al Quoz","Sheikh Zayed Road","Dubai Festival City","Dubai Waterfront",
  "World Trade Center","Al Mamzar","Al Warsan","Al Warqaa","Dubai Industrial City","Deira",
  "Al Satwa","The Sustainable City","Al Khawaneej","Umm Al Sheif","Al Manara","Wadi Al Safa 2",
  "Al Safa","Dubai Islands","Mina Rashid","Al Rashidiya","Al Twar","Al Badaa","City of Arabia",
  "Al Mizhar","Liwan 2","Jumeirah Heights","Nad Al Hammar","Al Qusais","Al Garhoud",
  "Al Jafiliya","Dubai Internet City","Al Lisaili","Wadi Al Shabak","Dubai Pearl",
  "Umm Ramool","Bukadra","Academic City","Dubai Promenade","Murqquab","Technology Park",
  "Dubai Airport Freezone (DAFZA)","Dragon City","Al Hudaiba","Nad Shamma",
  "International City","Old Town","Al Nahda","Oud Al Muteena","Al Mina","Al karama",
  "Ras Al Khor ","Al Aweer","Knowledge Village","Palm Jebel Ali","Expo City",
  "Dubai Harbour","Dubai Design District","Majan","Umm Al Thuoob","Umm Dir",
  "Green Belt","Al Barqaa","Al Salam City","Umm Al Quwain Marina","Emirates Modern Industrial",
  "Khor Al Beidah","White Bay","Al Raas","Al Dar Al Baida'a","Al Riqqa","Al Humra",
  "Falaj Al Moalla","Al Salamah","Al Ramla","Al Maidan","Al Surra","Al Haditha",
  "Al Kaber","Old Industrial Area","Al Madar","Old Town Area","Al Qurm",
  "Al Juwais","Al Turfa","Khatt","Dafan Al Nakheel","Al Hudaibah","The Old Market",
  "Dafan Al Khor","Al Mataf","Seih Al Bana","Sifuni","Mudfak","Seih Al Burairat",
  "Al Sharisha","Al Ghail Industrial Zone","Al Sewaan","Al Mukawwrah","Al Hamra Village",
  "Al Marjan Island","Cornich Ras Al Khaima","Ras Al Khaimah Creek","Mina Al Arab",
  "Ras Al Khaimah Waterfront","Yasmin Village","Ras al Khaimah Gateway","Shamal Julphar",
  "City Downtown","Saraya Islands","Al Qusaidat","Sheikh Mohammed Bin Zayed Road",
  "Al Nakheel","RAK FTZ","Al Mamourah","Khuzam","Sheikh Muhammad Bin Salem Road",
  "Al Riffa","Al Jazirah Al Hamra","Al Seer","Al Dhait","Al Kharran","Seih Al Harf",
  "Al Rams","Dahan","Sidroh","Al Mairid","Seih Al Ghubb","Al Uraibi","Seih Al Uraibi",
  "Al Dhaid","Maryam Island","Al Muntazah","Al Madam","Al Bataeh","Sharjah Sustainable City",
  "Sharjah RTI Park","Sharjah Garden City","Emirates Industrial City","Hayyan",
  "Uptown Al Zahia","Kalba","Al Butina","Al Ghafeyah area","Al Khan","Al Khaldeia Area",
  "Al Majaz","Al Nujoom Islands","Al Ettihad Street","Al Qasba","Al Qasemiya","Al Wahda",
  "Cornich Al Buhaira","Hamriyah Free Zone","Rolla Area","Sharjah Airport Freezone (SAIF)",
  "Sharjah Industrial Area","Umm Khanoor","Abu shagara","Al Mamzar - Sharjah","Maysaloon",
  "Wasit","Halwan","Al Taawun","Al Nouf","Al Nasreya","Al Fayha","Al Nabba","Al Gulayaa",
  "Al Mujarrah","Mughaidir","Al Garayen","Al Qarain","Al Tai","Al Jurainah","Al Rahmaniya",
  "Jwezaa","Al Badie","Muwaileh Commercial","Al Suyoh","Al Sharq","Al Gharb","Al Heerah",
  "Al Zubair","Tilal City","Al Tayy Suburb","Al Sajaa","Muwaileh","Um Altaraffa","Al Shuwaihean",
  "Al Musalla","Al Shahba","Aljada","Sharjah Waterfront City","Al Owan","Al Zahya","Al Alia",
  "Liwara 1","Al Jurf Industrial","Al Nakhil","Al Tallah 2","Al Bahia","Ain Ajman",
  "Corniche Ajman","Ajman Industrial Area","Ajman Meadows","Al Ameera Village","Al Humaid City",
  "Al Ittihad Village","Al Naemiyah","Al Zahraa","Awali City","Ajman Corniche Road","Ajman Downtown",
  "Ajman Uptown","Emirates City","Green City","Marmooka City","Park View City","Manama","Al Mwaihat",
  "New industrial area","Musheiref","Al Rumaila","Al Bustan","Garden City","Al Sawan","Masfoot",
  "Sheikh Khalifa Bin Zayed Street","Al Zorah","Al Rawda","Al Hamidiya","Al Raqaib","Al Helio",
  "Al Yasmeen","Sheikh Maktoum Bin Rashid Street","Al Amerah","Mafraq Industrial Area","Al Shalila",
  "Dalma Island","Madinat Al Riyad","Al Jubail Island","Al Mirfa","Al Danah","Al Ajban","Rimah",
  "Bu Krayyah","Ramhan Island","Rabdan","Airport Road","Al Nahyan Camp","Al Bateen","Al Baraha",
  "Al Hudayriat Island","Al Dhafrah","Al Falah City","Al Ghadeer","Al Ittihad Road","Al Karamah",
  "Al Zaab","Al Khalidiya","Al Maffraq","Al Manhal","Al Manaseer","Al Maqtaa","Al Markaziyah",
  "Al Mushrif","Al Najda Street","Al Raha Gardens","Al Raha Beach","Al Rahba","Al Rawdah",
  "Al Reef","Al Reem Island","Al Samha","Al Shahama","Al Shamkha","Al Maryah","Al Wathba",
  "Between Two Bridges","Baniyas","Building Materials City","Corniche Road","Danet Abu Dhabi",
  "Desert Village","Eastern Road","Electra Street","Grand Mosque District","Hamdan Street",
  "Hydra Village","Jawazat Street","Khalifa City","Khalifa Street","Lulu Island","Madinat Zayed",
  "Marina Village","Masdar City","Mohamed Bin Zayed City","Muroor Area","Mussafah","Nurai Island",
  "Abu Dhabi Gate City","Saadiyat Island","Sas Al Nakheel","Tourist Club Area","Yas Island",
  "Zayed Military City","Ghantoot","Al Raha Golf Gardens","Al Ruwais","Al Salam Street",
  "Zayed Sports City","Umm Al Nar","Liwa","Hameem","Al Shawamekh","Capital Centre","Al Khatim",
  "Al Sila'a","Al Rayhan","Al Gurm","Al Gurm West","Mina Zayed","Defense Road","Dana Island",
  "The Marina","Al Maryah Island","Al Tibbiya","Nareel Island","Shakhbout City","Happiness Island",
  "Rawdhat Abu Dhabi","Al Zahiyah","Al Nahyan","Al Aman","Al Fahid","Sakamkam","Thouban","Al Faseel",
  "Al Bithnah","Al Hayl","Al Bidya","Rul Dhadna","Al Aqah","Qidfa","Mirbah","Al Owaid","Al Farfar",
  "Ishwais","Downtown Fujairah","Sheikh Hamad Bin Abdullah St.","Corniche Al Fujairah",
  "Dibba Al Fujairah","Al Hilal City","Sharm","Khor Fakkan","Um Ghaffa","Khaldiya",
  "Al Dhahir","Al Shuibah","Al Rawdah Al Sharqiyah","Ain Al Faydah","Al Dhahrah","Al Ajayyiz",
  "Ni'mah","Shi'bat Al Wutah","Al Qattarah","Al Salamat","Al Iqabiyya","Al Hili","Al Buraymi",
  "Al Sinaiya","Zakher","Al Tawiya","Tawam","Al Ain Industrial Area","Al Faqa'a","Al Maqam",
  "Al Khabisi","Al Markhaniya","Al Mutarad","Al Jaheli","Al Oyoun Village","Al Jimi","Al Muwaiji",
  "Al Murabaa","Al Neyadat","Al Muwahie","Wahat AlZaweya","Asharej","Central District","Al Telah",
  "Sweihan","Al Yahar","Falaj Hazzaa","Al Foah","Al Mutawaa","Al Niyadat","Al Sarooj","Al Masoodi",
  "Al Towayya","Falcon city of Wonders","Living Legends","The Oasis by Emaar","Rukan","Al Muhaisnah",
  "Dubai Healthcare city","Al Nahda","The Gardens","Al Kifaf","Wadi Al Safa 3","Al Hamriyah","Al Qurm",
  "Hayat Island","Sobha Hartland","Bloom Living","Sobha Hartland 2","Riverside","Abu Dhabi","Dubai",
  "Sharjah","Ajman","Ras Al Khaimah","Fujairah","Umm Al Quwain","Al Ain","Al Wahda","AlJurf Gardens ",
  "Wadi Al Safa 5","Jumeirah Garden City","Al Yelayiss 2","Dubai Land Residence Complex","Ghadeer Al Tair",
  "The Acres","RAK Central","Wadi Al Safa 7","Grand Polo Club and Resort","Ghaf Woods","International City Phase 2",
  "Wasl 1","Al Sehma","Wadi Al Amardi","Al Athbah","Umm Al Sheif","Hadaeq Sheikh Mohammed Bin Rashid",
  "Dubai Lifestyle City","Al Menhaz","Meydan Horizon","The Heights","DAMAC Islands 2","Al Yelayiss 1",
  "Sobha Sanctuary","Al Raudah","Damac Islands",
];

const DEVELOPERS: string[] = [
  "Emaar","Damac","Binghatti","Sobha","Ellington","Azizi","Aldar","Imtiaz Developments","Object One Real Estate Development","Nshama","Samana","Meraas","Reportage Properties","RAK Properties",
  "Danube","Arada","Nakheel","Eagle Hills","Omniyat","Tiger Properties","Mashriq Elite","Leos Development","Deyaar","Vincitore Real Estate Development","Majid Al Futtaim","Modon","BnW Developments",
  "Beyond Developments","H&H Investments and Development","Taraf Properties DMCC","Prestige One","London Gate","HRE Development","Peace Homes Group","Mr Eight Development","Reef Luxury Developments",
  "Pantheon Properties Limited","Expo City Dubai","DarGlobal","Al Hamra Real Estate","Deca Properties","Dugasta","Select Group","Bloom Properties","Wasl","Octa Properties","Range Developments","Tarrad Development",
  "GFS Developers","AHS Properties","MAG","Sol Properties Development LLC","LIV Real Estate Development","Iman Developers","TownX","Meydan","Dubai South Properties","Tabeer Real Estate","Meteora","Ginco Properties",
  "Empire Development","Alef Group","Citi Developers","Ohana Development","Esnaad","QUBE Development","Radiant Real Estate","Majid Developments","Burtville Real Estate Development","Kasco Developments","Al Helal Al Zahaby Real Estate",
  "Fakhruddin Properties","Al Habtoor Group","Dubai Investment Properties","Riviera Properties Development","Arabian Gulf Properties","Condor Group","Continental Investments","Palma Holdings","UniEstate","Lucky Aeon Real Estate Development",
  "Meraki Developers","Union Properties","Vakson Real Estate","Aqua Properties","Invest Group Overseas","Segrex Development LLC","Prescott Developers","Wasl Properties","Acube","Marquis","Irth Development","Alta Real Estate Developments",
  "Amali Properties","Sankari Properties","Dubai International Financial Centre","The Luxe Developers","Durar Group","Al Zorah Development","Arista Properties","Mira Developments","AA HMB Developments","Rabdan Developments","Metac",
  "IMKAN Properties","Shamal Holding","Major Developers","Amwaj Development","Aura Infinite Real Estate Development","ARIB Developments","Main Realty","Al Marina Investment","Ahmadyar Developments","Enso Development","City View Developments",
  "MAK Developers","Source of Fate Properties","Arsenal East Real Estate Development","Wellington Developments","Bam Development","Elysian Developments","True Future","Avenew Development","One Development","4Direction Developers","Maakdream Properties",
  "WADAN Developments","PRYSM Real Estate Development","Sanzen","Dubai Properties","SAAS Properties","Al Sayyah & Sons Investment (LLC)","Al Seeb Real Estate Development","Grovy Real Estate Development LLC","Green Group","RSG International","Al Zarooni",
  "Seven Tides","IFA Hotels & Resorts","Heilbronn Properties Ltd","Dalands","Tasmeer Development","Prescott Real Estate Development","Rijas Aces Property","Gulf Land Property Developers","Takmeel Real Estate Development","Muraba","AYS Property Development",
  "Oro 24 Developments","ANK Developers","Pure Gold Real Estate Development","Vision Avenue Homes","Mada'in","Golden Wood","Royal Centurion","Al Barari Development","Solanki Real Estate","BNH Real Estate","IGO Property Development","Me Do Re","Symbolic",
  "Roya Lifestyle Development","Peak Summit Real Estate Development","Amis Properties","Mered","East and West Properties","Fortimo","R.Evolution","Prestigious investment company","Miral Development","Nine Yards","Q Properties","The Solidere International",
  "Skyline Builders Real Estate","DHG Properties","JRP Development","PMR Property","Royal Development","Nabni Developments","Forum Group","Divine One Group","Aras Development","Aqasa Developers","Aark Developers","MGS Development","ABA Group","Oriental Pearls",
  "Sama Ezdan","AMBS Real Estate Development","Tuscany","Deviate For Real Estate Development","Urban Properties Development (UPD)","Iraz Properties","Refine","Shurooq","ANAX Developments","MIRFA","Soho Development","Baraka Real Estate Development",
  "Crystal Bay Development","Swank Development","Century 7 Properties","Zimaya Properties","Nine Developments","Galaxy Realty","Vantage Properties","Amaya Properties","Rokane Group","HMB Homes","LMD","Signature Developers","Wow Resorts","Karma",
  "ARTE Developments","Laya Developers","Pinnacle Developers","Stamn Development","Amaal","OKSA Developer","Lacasa Living","Mill Hill Riviera Development","Saba Properties JLT","Lapis Properties","Kamdar Developments","Ever Glory Developments",
  "Zenith Group","S and S","Alaia Developments","Skyland Properties","Hamrk Real Estate Development","Amirah Developments","Nexus Developer","Cirerra","Ayat Development","Hayaat Developments","Asak Real Estate Development","Richmind Development",
  "Sharafi Real Estate","Seven Mayfair Real Estate Development","Ajmal Makan","Cosmo Developments","Ora Developers","Regent Properties","Cledor","SCC Vertex Development","BT Properties","Tomorrow World Properties","Confident Group","AG Properties",
  "MVS Real Estate Development","JHK Heights Development","Al Tareq Star Real Estate Development","Ardee Developments","Elton Real Estate Development","Sunrise Capital","Blanco Thornton","AGN Skyline Developers","Shakirov Developments",
  "Pearlshire Development","Emirates Properties","Amer Al Ghurair","Nova Power Real Estate","Unique Saray","Arete","Gulf House","IQUNA Properties","Nuri Living","Pasha1","Neoterra","Vision Developments","Atara Development","Abu Dhabi National Hotels",
  "Tissoli","Topero Properties","Mantra","Elevate","Kora Properties","CDS Developments","Viva Development","Zoya Developments","Alishaan Developments","Enaam Properties Development","Eight Square Developers","7th Key Development","Alain","Enzo Developers",
  "Azure Premier Developments","Deniz Properties","Preston Properties","Sanama","The First Group","RKM Real Estate LLC","Jarvis Corporation Limited","Dunya Investment","RP Global","Juma Al Majid Holding Group","Althuraya Real Estate Development","RKM Real Estate LLC",
  "Avantime Limited","Sunflower FZE","Al Tayer","Tanmiyat Global","GPD Investments SPV One Limited","Triplanet Range Investments","National Trading & Developing Est.","Rose Homes Investment LLC","Bando Housing Corp","Akar Properties LLC","Tameer Holdings","Al Massaleh Group",
  "Emirates National Investment","Corporate Finance House","Mismak Properties","Credo Investments FZE","The Developer Properties LLC","Sheth Estate International Limited","Xtreme Vision","MAG Group","Abdulrahman Mohammed Taher Wali","Mr Gheyath Mohammed Gheyath","Markaz",
  "Al Ansari Real Estate","Eastshine Properties Limited","Sunflower FZE","Elite City Real Estate","Citymax Limited","World of Wonders Real Estate Development","Zabeel Investments","Time Properties LLC","Seastar Properties Limited","KM Properties","ETA Star",
  "Tasameem Real Estate","Rani International Development LLC","New Dubai Properties LLC","Jupiter Estates Limited","IAH Project Development","Al Madar Holdings","Al Shafar Investment","Reef Real Estate","Qatari Diar Real Estate Company","SRG Holding Limited",
  "Bonyan Emirates Properties","Signature Estates Limited","The Emirates Group","RTS Investments","Artar Real Estate Development","Nashat Farhan Awad Sahawneh","Ahmad Abul Rahim Al Attar","Arabia Group Investment Limited","Innovate Development","Green Tree Property Management",
  "Sweid & Sweid","Al Attar Properties LLC","Tulip Business Development","Pacific Ventures Ltd","Al Jaziri Brothers","Fortune 5","Farida Farnood","Marya Investments","Ezz Watson","Orion Real Estate Development","Mercury Investment Holding","Faisal Muhsen Barakat","HDS Group",
  "Ramee Group","Ahmed Ali Alabdulla Al Ansari","Khamas Group of Investment Companies","Goldline Real Estate Development LLC","Moufaq Alkaissi","Gemini Property Developers","Define Properties","Dar AL Arkan","Eng. Adnan Saffarini","Ali Mohammad Obaid Alqutami Alsuwaidi",
  "Al Ali Property Investment","Etjar Investments","Abdulrazaq Ali Hassan Al-Zarouni","Aakar Developers Ltd","Kingston","Khamas Group of Investment Companies","Al Garhood Real Estate Co. LLC","Gemstone Real Estate Development","United Arab Bank",
  "Islamic Affairs & Charitable Activities Department","Bonyan International Investment Group Holding","Gulf General Investments","Gulfstream","Bait Al Bahar Investment","Dubai Real Estate Centre","Suliman Essop Dockrat","Imran Haroon & Zeeshan Haroon","Alpha Properties",
  "Talal Mir Abdul Qader Ahmed Khoori","Waleed Mohammed Mohammed","Dr Samih Bakri Tarabichi","Realty One","Global Capital Partners","Raj Singh","Watan Properties Development LLC","Orient Gate Real Estate","Lootah Real Estate Development","Mr Hadeer Maimaitili","Hussain Mohd Hussain Al Marzouqi",
  "Al Nahda International LLC","Dr Hassan Oudah","Ahmad Matar Majed Taresh Alkhyeli","Westar Properties","Marina 3K Limited","Tebyan Real Estate Clarity","Delta Properties","Hircon International","Cayan Group","Dheeraj and East Coast","32 Group","Chaimaa Holding Limited",
  "Al Manal Development","Abdul Rahman Nassar Al Moufairij","Aurora Real Estate Development","Mr Sonali Sundeep Tolani","Michel Shafik Kostandy Tawedrous","Mr Ziyad Ghazal","Shadi Kassermally","Arivon Properties","SNM Holdings Limited","KRS Developments","KRS Developments",
  "Al Sondos Real Estate LLC","Mr Tarek Zouhair El Mdaka","Al Zubaidi Real Estate","Landbanc","Adel Abdullah Fadhel","Mr Khalid Ahmed Qasem Al-Khatib","Othman Moahmed Sharif Abdullah Zaman","ASF Investments LLC","Hatim Al Ghaouti","Ghassan Aboud Group","Al Tajir Real Estate",
  "AB Properties","Beney Investments Limited","G&G Partners","Five Real Estate Development LLC","Mr Mahmood A Al-Farhan","Global Realty Partners FZC","New World Development","Fortis Plus Holdings","Gulf Technical Construction Company","Sandstone Properties","Linkage Developers LLC",
  "Aces Property Ltd","Escan","Mr Mehmet Sirin Akyuz","Mian Asad Bashir & Shahnaz Asad","Gul Mohamed Akhter","Zaya Living Real Estate Development LLC","KGN Investments Limited","Evan Lim Penta Construction LLC","Mr Ahmed Muneir Mohammed Dahab","Mr Mohamed Bakri & Mr Majed Hawayy",
  "Apparel Group","Atwaar","Evershine Dubai Limited","Landmark Holdings","Ronald Friedrich Heinrich Herbert Crone","Falgris Holding Limited","Bavaria Gulf Sandoval Limited","Shaksy Properties","JVC Ventures Limited","Mr Abdulla Abdulwahed Abdulla Mohammed","Gulf Shores",
  "Mustafa bin Abdul Latif Group","Minc Property","Halcon Real Estate","Bin Hamoodah Group","Dorra Group","Trident International Holdings","Al Ain Properties","ARY Group","B&M Riviera","Manchester Properties","Diamond Investments LLC","New City Developers","Al Fattan Properties",
  "Al Rostamani","Sheffield Holding","Scope Investment","Abdullah Ahmed Almoosa","NYC Holdings Limited","Fayez Saeed Mohammed Ibbini","Al Fara'a Properties","AKA International","Grovy Real Estate Development LLC","Anas Omar Mohammed Al Haj","Dune Properties","Crown One Holding Ltd",
  "ACW Holding Limited","Indigo Group","Badr Development Company Limited","Masihullah Rahimullah","Plazzo Development Real Estate","Reef Real Estate","Artistic Property Development LLC","Virtue Properties","Diamond Developers","Mr Hassan Omar Kalas","GHD Developments",
  "Akshara Global Real Estate Development LLC","International Merchant House Real Estate Dev. LLC","Revi Real Estate Development LLC","Abbar Holding Limited","Remax Group Limited","Mr Fayez Saeed Mohamed Ibbini","Hassan Hamad Ali Al Amir","The Continent Limited","ACW Holdings",
  "Al Masarat Real Estate","Oasis","Cayan Investment & Development","Rooya Real Estate Development Co LLC","Skai Holdings","Al Mana Global","ICI Investment","MBAL","Five Elements Real Estate Development LLC","Myra Real Estate Developments","Anwar Abd Alrahim Mohamed Abd Algafour",
  "Al Mada Marble","Kerzner International","Atma Ram Rochani","Khander Hamdi Hussein","Azhar Ali Toor","Emerald Palace Group","Hussein Alhutheily","Mohhammed Hassan Baba Hassan","Adel Abdulrahim Abdulla Mod'd Alsaeedi","Al Waleed Real Estate","QVC Holdings Limited",
  "Rashid Murad Taher Al Balooshi","Saleh Bin Lahej Real Estate","Boission Limited","IFC Developers LLC","Al Yousuf LLC","Element Middle East","Green Yard Properties Development LLC","Tawakina Real Estate Development LLC","Burj Residency Limited","National Bonds","Ishraqah",
  "Al Rimal Development Limited","Abdulraouf Mohammad Saleh Alavi","Al Qabdah Global Building Contractors","Samana International Real Estate Development","Sumer Contracting Company","Dr Hassan Oudah","Amsa 2 Holdings FZE","West Star Investment Limited",
  "Golden Homes Investments Limited","Exim Management Limited","Byblos Real Estate","AA Global Limited","Saad Al Mutairi","Memon Investments","Salem Amer Mubarak Bu Kassim","Artistic Legend Real Estate Development","2020 Holdings Limited","Mohammad Sajid",
  "Ahdaaf Real Estate Development","Jersey Properties","AE Developments","Green Valley Real Estate","Mimosa Investments Limited","Saule Nurseitova","Ellis Don","Port Fino Real Estate Development LLC","Waseem Haider Ghulam Haider","Triveni Builders and Promoters Limited (TBPL)",
  "Marriott International","Takaful Emarat","Payamod International","Ghala Realty & Development","Huston International Holdings Limited","Syann Properties","Maximus Group","Sunrise transcon real estate development","Al Mizan","Geepas","Sun and Sand Developers",
  "Pearl Properties","Mazen Fahmi Moustafa Akela","Safe Builders & Developers","Dubai Sports City","Al Fahim","Bay View Investments Limited","Falak Properties","Hamza Namera International FZC","Gold Vision Developments Ltd","Innovation SEZ Developers Ltd",
  "Brighton Holdings Ltd","Middle East Development LLC","Pan Global Development","Zenith Smart Real Estate Development","Shaikhani Group","Bangash Builders & Developers Ltd","Mandate International Ltd","Jamal Mohammed Alhassan","Arthur & Hardman Real Estate Development LLC",
  "Tabeer Starwood Holding Limited","Titans Real Estate Developer","Lokhandwala Builders International LLC","PAL Developments","The Fern Limited","Sabrine Land Development Limited","Mr Hussin Meseh Iskandar","Grand Properties","Grace Holdings Limited","Ice Investments Limited",
  "Muhammad Noman","National Properties","CPL Real Estate Development","prime real estate","Boston Real Estate Development","Fatima International FZC","SP International","Ribbon Of Light Trading","Dubai Silicon Oasis Authority","Modern Real Estate","JSCOM Real Estate",
  "Abdul Salam M.Rafi M.Saeed Group","Sevanam Holdings Ltd","Earth Developers","Time Properties LLC","City Engineering","Yorkshire Corporation Ltd","Mr Nasser Abdul Karim Al Arif","Al Hathboor Group LLC","Al Sondos Property Developers LLC","Mohamed Abdulla Abdul Latif Al Mulla",
  "Mr Saeed Abdul Al Mehairi","GGICO Properties","Dubai Holding","Ocean Estate Company Limited","007 Properties","Ithra Dubai","Faddul Brothers","Mr Muhammad Nasir Muhammad Iqbal","Mr Jamal M Abuhijleh & Partners","Al Ghurair Real Estate","Mr Abdulla Nasser Ben Huwaileel Al Mansouri",
  "Made'in","Sariin Investment Group","W Motors Automotive Group","Emirates Integrated Telecommunications Company","Mr Juma Saif Rashid Bin Bikhit","Manazil Global property","Al Aryam Phase One LLC","Al Aryam Phase Two LLC","Zazen","TECOM Group","Abyaar Real Estate",
  "Al Reem Real Estate Development","Durar Al Emarat","Behnam Ali Keivan","The Towers FZ LLC","SAIFO","Al Sondos Holding","Jumeirah Golf Estates","Shaikh Holdings","Chi Development Group","Jumeirah Luxury Living","Olive Point Limited","Sienna Lakes","Links Properties",
  "Oscar Real Estate Limited","Abwab","One Zaabeel","Enshaa","Radiant Star","Dubai International Real Estate","Daman Real Estate Capital Partners","Al Mazaya Holdings","Target Engineering Construction Company","Properties Investment LLC","Realty Capital","Kleindienst Group",
  "Al Khail Heights L.L.C","Ascott The Residence","Arenco Real Estate","Naseer Abdullah Lootah Group","Jumeirah International","Dubai World Trade Centre Authority","Makeen Properties","API","Ralph Baldwin & Associates","City Properties","Asteco Property","Al Naboodah Construction",
  "Arkiteknik International Consulting Engineers","Modelux Real Estate","Awazi Gargash Properties LLC","xiaojinli","Adam dev","Capital United","United Engineering Construction","kaizen developements","Generic","Rufi properties","Gulf Asia Contracting","Empire Arabia",
  "Mars Estates Limited","Al Fajer Properties","Maysan","Quality Group","ASA 1 Developers Ltd","Platinum Development Company","Al Basha Properties","GMC Ventures","Sky Overseas Real Estate Development LLC","Naresco Group","Desert Dream","KG International FZCO",
  "Verve Developments","Green Oasis General Contracting Co. L.L.C","Abdul Salam Al Rafi Group","Madain Properties","Bin Shafar Holding","Wealthcare Investments","Horizon Infrastructure","Jamal Al Hassan & Bachar Almradi","Metrical Real Estate Development",
  "Al Turath Engineering Consultants","Bollineni Developers","Madison holdings","Emirates D1 Limited","RMG Limited","Alshafar Development","Sharaf Group","MASAAR VILA ABY LIMITED","Ilyas & Mustafa Galadari Group","Al Osaimi Group","Proline Engineering Consultants","Bahjat Awda Musabh Abu Al Hussain",
  "Wasl Asset Management Group","Utmost properties","Mr Marzuk Rashid Abdullah Mohammed Al Rashdan.","Gargash Real Estate","AJD Real Estate","Asteco Properties","FAB Properties","Ayedh Dajem Real Estate Development","Ali Abdulla Mohammad Alshirawa",
  "AWR Properties","Al Jaddaf Real Estate","Swiss Property","Al Bannai Investment","Mr Hesham Mohamad","Texture Holding","Sajaya Properties","Emerald Properties LLC","Gulf Marketing Group","Al Etqan Real Estates","Asam Investment and Real Estate",
  "Al Mazroui Group","RDK Group","Rockwell Real Estate Development","G&Co","Aswan Developers Inc","Meilenstein Developments","AHK","AHK holding LLC","test","123","Myka Luxe Real Estate","Orra","Devmark","The Family Group","PCI Real Estate Developers",
  "Urban Wellness","Digo Real Estate Development","Serene Real Estate Developments","RVL Real Estate","Cirrus Developments","Ikarus Real Estate","Aldar Development","Albait Al Duwaliy","Stallion Properties","Zarwah Developments","Silver Lining Properties",
  "Kappa Acca Real Estate","Adventz Group","Murano","ACICO","Wisal","Dar Al Karama Real Estate","Hijazi Real Estate Development","Meteora Developers","ASNN Group","Grid Properties","KBW Real Estate Development","Avelon Developments",
  "HABN Real Estate Development","ASAS Real Estate","Matrix Developments","Sentro Realty","Khamas Group Investment","Manazel Group","Evera Real Estate","Mizin Real Estate","Alzahra Properties","Palladium Prime Real Estate Development",
  "MS Homes Developers","ADE Properties","Ayana Holding","District One","Siroya Ventures Realty","Svarn Real Estate Development","One Yard Development","Keymaven","Al Raqeeba Development","Dia Development","HVM Living","Loutraki Real Estate",
  "Savills","DIFC Authority","Maaia Developers","Arloid Real Estate Development","Das Real Estate","Bling Development","AAA Real Estate Development","Valores Property Development","DGM Vision House Real Estate Development","Al Yakka Developers",
  "West F5 Development","GFH Real Estate","YAS Developers","Humaid Bin Drai","Siadah Development","Koro Development","Ned Properties","Vision Platinum Real Estate Development","Aristocrat Star Real Estate","Jaiedco","The Weave Real Estate Development",
  "North 43 developers","Amber Developments","Manam Real Estate Development","Equiti","Glorious","Arady Properties","IKR Development","Laraix Developers","Januss Real Estate Developers","Alkayem Real Estate Development","Sido Development","Newbury",
  "New MFOUR Real Estate","Calgary Properties","MBR Mansions Real Estate Development","Atkins Middle East","Ocean Pearl Property Development","ADNH","AUM Real Estate","Griffin Real Estate Development","Nord","Green Horizon","infracorp","El Prime",
  "Jad Global Real Estate Development","Emirates Development","ROZ Real Estate Development LLC","Al Rasikhoon Real Estate","Casagrand Developers LLC","Ozean Real Estate Development","ARY & MAZ Developments","Saion Properties","Gutti Real Estate Development",
  "Suncrest Hills Developer","Al Marwan Development","Urban Venture Real Estate","Madar Developments","CG Developers","Crystal Group","HOLM Developments","Azimuth Developments","NYX PROPERTIES","Lion Stone Properties","Eminent Developments",
  "VHS Developments","ALA Developments","GJ Properties","Shapoorji Pallonji Real Estate","YIGO Development","Wyndham",
  
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
