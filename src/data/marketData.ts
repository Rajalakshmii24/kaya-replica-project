export interface Transaction {
  id: number;
  location: string;
  area: string;
  type: "Apartment" | "Villa" | "Plot" | "Commercial";
  status: "Ready" | "Off-plan";
  beds: string;
  sqft: number;
  price: number;
  pricePerSqft: number;
  date: string;
  soldBy: "Developer" | "Resale";
  isNew: boolean;
}

export interface RentalTransaction {
  id: number;
  location: string;
  area: string;
  type: "Apartment" | "Villa" | "Commercial";
  beds: string;
  sqft: number;
  rental: number;
  duration: string;
  startDate: string;
  endDate: string;
  isNew: boolean;
  rentalYield?: number;
}

export interface AreaStats {
  name: string;
  transactions: number;
  slug: string;
}

export const popularAreas: AreaStats[] = [
  { name: "Al Barsha South Fourth", transactions: 1959, slug: "al-barsha-south-fourth" },
  { name: "Jumeirah Village Circle", transactions: 1958, slug: "jvc" },
  { name: "Dubai South", transactions: 1700, slug: "dubai-south" },
  { name: "Business Bay", transactions: 1594, slug: "business-bay" },
  { name: "Dubai Islands", transactions: 1047, slug: "dubai-islands" },
  { name: "Dubai Creek Harbour", transactions: 952, slug: "dubai-creek-harbour" },
  { name: "Nad Al Sheba First", transactions: 773, slug: "nad-al-sheba" },
  { name: "Downtown Dubai", transactions: 488, slug: "downtown-dubai" },
  { name: "Dubai Marina", transactions: 395, slug: "dubai-marina" },
  { name: "Dubai Hills", transactions: 393, slug: "dubai-hills" },
  { name: "Palm Jumeirah", transactions: 239, slug: "palm-jumeirah" },
  { name: "Palm Jebel Ali", transactions: 105, slug: "palm-jebel-ali" },
  { name: "Emaar Beachfront", transactions: 89, slug: "emaar-beachfront" },
  { name: "Emirates Living", transactions: 85, slug: "emirates-living" },
  { name: "Bluewaters Island", transactions: 36, slug: "bluewaters" },
];

export const saleTransactions: Transaction[] = [
  { id: 1, location: "Dubai South, Madinat Al Mataar", area: "Dubai South", type: "Apartment", status: "Off-plan", beds: "Studio", sqft: 1133, price: 1697828, pricePerSqft: 1499, date: "23 Feb 2026", soldBy: "Developer", isNew: false },
  { id: 2, location: "Maybach 6 - Tower B, Nad Al Shiba First", area: "Nad Al Sheba First", type: "Apartment", status: "Off-plan", beds: "Studio", sqft: 341, price: 1324000, pricePerSqft: 3883, date: "23 Feb 2026", soldBy: "Developer", isNew: false },
  { id: 3, location: "Ellington Sands I Tower B, Dubai Islands", area: "Dubai Islands", type: "Apartment", status: "Off-plan", beds: "1 Bed", sqft: 812, price: 2377828, pricePerSqft: 2928, date: "23 Feb 2026", soldBy: "Developer", isNew: false },
  { id: 4, location: "The Crest Tower A, Dubai Creek Harbour", area: "Dubai Creek Harbour", type: "Apartment", status: "Ready", beds: "2 Beds", sqft: 1245, price: 3150000, pricePerSqft: 2530, date: "22 Feb 2026", soldBy: "Resale", isNew: false },
  { id: 5, location: "Marina Gate 2, Dubai Marina", area: "Dubai Marina", type: "Apartment", status: "Ready", beds: "1 Bed", sqft: 780, price: 1850000, pricePerSqft: 2372, date: "22 Feb 2026", soldBy: "Resale", isNew: false },
  { id: 6, location: "Burj Vista T1, Downtown Dubai", area: "Downtown Dubai", type: "Apartment", status: "Ready", beds: "2 Beds", sqft: 1420, price: 4200000, pricePerSqft: 2958, date: "22 Feb 2026", soldBy: "Resale", isNew: false },
  { id: 7, location: "Park Heights 2, Dubai Hills", area: "Dubai Hills", type: "Apartment", status: "Ready", beds: "3 Beds", sqft: 1650, price: 3100000, pricePerSqft: 1879, date: "21 Feb 2026", soldBy: "Resale", isNew: false },
  { id: 8, location: "Jumeirah Village Circle, District 15", area: "Jumeirah Village Circle", type: "Apartment", status: "Off-plan", beds: "Studio", sqft: 450, price: 750000, pricePerSqft: 1667, date: "21 Feb 2026", soldBy: "Developer", isNew: true },
  { id: 9, location: "Al Barsha South Fourth, Villanova", area: "Al Barsha South Fourth", type: "Villa", status: "Off-plan", beds: "3 Beds", sqft: 2100, price: 2800000, pricePerSqft: 1333, date: "21 Feb 2026", soldBy: "Developer", isNew: true },
  { id: 10, location: "Palm Jumeirah, FIVE Residences", area: "Palm Jumeirah", type: "Apartment", status: "Ready", beds: "2 Beds", sqft: 1890, price: 8500000, pricePerSqft: 4497, date: "20 Feb 2026", soldBy: "Resale", isNew: false },
  { id: 11, location: "Business Bay, Paramount Tower", area: "Business Bay", type: "Apartment", status: "Ready", beds: "1 Bed", sqft: 820, price: 1650000, pricePerSqft: 2012, date: "20 Feb 2026", soldBy: "Resale", isNew: false },
  { id: 12, location: "Dubai South, Expo Valley", area: "Dubai South", type: "Villa", status: "Off-plan", beds: "4 Beds", sqft: 3200, price: 3900000, pricePerSqft: 1219, date: "20 Feb 2026", soldBy: "Developer", isNew: true },
  { id: 13, location: "Emaar Beachfront, Address Residences", area: "Emaar Beachfront", type: "Apartment", status: "Ready", beds: "3 Beds", sqft: 2100, price: 6800000, pricePerSqft: 3238, date: "19 Feb 2026", soldBy: "Resale", isNew: false },
  { id: 14, location: "Dubai Creek Harbour, Creek Edge T2", area: "Dubai Creek Harbour", type: "Apartment", status: "Off-plan", beds: "1 Bed", sqft: 750, price: 1950000, pricePerSqft: 2600, date: "19 Feb 2026", soldBy: "Developer", isNew: false },
  { id: 15, location: "Jumeirah Village Circle, Bloom Heights", area: "Jumeirah Village Circle", type: "Apartment", status: "Ready", beds: "2 Beds", sqft: 1050, price: 1200000, pricePerSqft: 1143, date: "19 Feb 2026", soldBy: "Resale", isNew: false },
];

export const rentalTransactions: RentalTransaction[] = [
  { id: 1, location: "France Cluster, International City", area: "International City", type: "Apartment", beds: "1 Bed", sqft: 732, rental: 34939, duration: "12 Months", startDate: "24 Feb 2026", endDate: "23 Feb 2027", isNew: false },
  { id: 2, location: "Business Bay, Executive Tower", area: "Business Bay", type: "Apartment", beds: "3 Beds", sqft: 1647, rental: 122000, duration: "12 Months", startDate: "24 Feb 2026", endDate: "23 Feb 2027", isNew: false },
  { id: 3, location: "Town Square Warda 2", area: "Town Square", type: "Apartment", beds: "2 Beds", sqft: 976, rental: 73500, duration: "12 Months", startDate: "24 Feb 2026", endDate: "23 Feb 2027", isNew: false, rentalYield: 8.88 },
  { id: 4, location: "Jumeirah Village Circle, Bloom Towers", area: "JVC", type: "Villa", beds: "4 Beds", sqft: 1823, rental: 210000, duration: "12 Months", startDate: "24 Feb 2026", endDate: "23 Feb 2027", isNew: false, rentalYield: 12.35 },
  { id: 5, location: "The Wings - C, Arjan", area: "Arjan", type: "Apartment", beds: "1 Bed", sqft: 822, rental: 80000, duration: "12 Months", startDate: "24 Feb 2026", endDate: "23 Feb 2027", isNew: false, rentalYield: 10.0 },
  { id: 6, location: "Cedre Villas, Dubai Silicon Oasis", area: "DSO", type: "Villa", beds: "3 Beds", sqft: 3392, rental: 159390, duration: "12 Months", startDate: "24 Feb 2026", endDate: "23 Feb 2027", isNew: false },
  { id: 7, location: "Dubai Marina, Marina Pinnacle", area: "Dubai Marina", type: "Apartment", beds: "2 Beds", sqft: 1200, rental: 125000, duration: "12 Months", startDate: "23 Feb 2026", endDate: "22 Feb 2027", isNew: false, rentalYield: 6.5 },
  { id: 8, location: "Downtown Dubai, Burj Views", area: "Downtown Dubai", type: "Apartment", beds: "1 Bed", sqft: 850, rental: 95000, duration: "12 Months", startDate: "23 Feb 2026", endDate: "22 Feb 2027", isNew: true },
  { id: 9, location: "Dubai Hills, Park Point", area: "Dubai Hills", type: "Apartment", beds: "Studio", sqft: 420, rental: 48000, duration: "12 Months", startDate: "23 Feb 2026", endDate: "22 Feb 2027", isNew: true, rentalYield: 7.2 },
  { id: 10, location: "Zahra Breeze 3b, Town Square", area: "Town Square", type: "Apartment", beds: "Studio", sqft: 316, rental: 36000, duration: "12 Months", startDate: "24 Feb 2026", endDate: "23 Feb 2027", isNew: false, rentalYield: 10.29 },
];

export const developers = [
  "Emaar", "Nakheel", "DAMAC", "Sobha", "Meraas", "Azizi", "Binghatti", "Danube", "Select Group", "MAG",
];

export const marketStats = {
  medianPrice: 1942478,
  medianPriceChange: 9,
  medianPriceSqft: 1856,
  medianPriceSqftChange: -3,
  totalTransactions: 1994,
  transactionsChange: -27,
};
