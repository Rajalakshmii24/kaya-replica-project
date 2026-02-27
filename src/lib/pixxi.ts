import { supabase } from "@/integrations/supabase/client";

export async function pixxiRequest(endpoint: string, method = "POST", payload?: any) {
  const { data, error } = await supabase.functions.invoke("pixxi-proxy", {
    body: { endpoint, method, payload },
  });

  if (error) throw new Error(error.message);
  return data;
}

// Listings
export async function fetchListings(params: {
  listingType?: "NEW" | "SELL" | "RENT";
  page?: number;
  size?: number;
  propertyType?: string[];
  bedRoomNum?: number[];
  name?: string;
  sortType?: "ASC" | "DESC";
  startPrice?: number;
  endPrice?: number;
}) {
  return pixxiRequest("/pixxiapi/v1/properties", "POST", {
    size: 20,
    page: 1,
    sort: "ID",
    sortType: "DESC",
    ...params,
  });
}

export async function fetchSingleListing(propertyId: string) {
  return pixxiRequest(`/pixxiapi/v1/${propertyId}`, "GET");
}

// Leads
export async function fetchLeads(params: {
  page?: number;
  size?: number;
  status?: "ACTIVE" | "INACTIVE" | "DEAL";
  clientType?: "BUY" | "RENT";
  sort?: string;
  sortType?: "ASC" | "DESC";
}) {
  return pixxiRequest("/pixxiapi/v1/lead/list", "POST", {
    sort: "ID",
    sortType: "DESC",
    size: 20,
    page: 1,
    ...params,
  });
}

// Submit lead
export async function submitLead(leadData: {
  formId: string;
  name: string;
  email: string;
  phone: string;
  propertyReference?: string;
  extraData?: Record<string, string>;
}) {
  return pixxiRequest("/pixxiapi/webhook/v1/form", "POST", {
    extraData: {},
    ...leadData,
  });
}

// Agents
export async function fetchAgents() {
  return pixxiRequest("/pixxiapi/v1/agent/list", "GET");
}

// Developers
export async function fetchDevelopers(params?: { name?: string; size?: number; page?: number }) {
  return pixxiRequest("/pixxiapi/v1/developer/list", "POST", {
    size: 50,
    page: 1,
    ...params,
  });
}

// Areas search
export async function searchAreas(areaName: string) {
  return pixxiRequest(`/pixxiapi/v1/search/${encodeURIComponent(areaName)}`, "POST", {
    size: 20,
    page: 1,
  });
}

// Reminders
export async function fetchReminders(params?: { size?: number; page?: number }) {
  return pixxiRequest("/pixxiapi/v1/reminder/list", "POST", {
    size: 20,
    page: 1,
    ...params,
  });
}
