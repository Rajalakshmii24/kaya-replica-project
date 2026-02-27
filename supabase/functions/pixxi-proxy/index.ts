const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const PIXXI_BASE = 'https://dataapi.pixxicrm.ae';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get('PIXXI_API_TOKEN');
    if (!token) {
      return new Response(JSON.stringify({ error: 'API token not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { endpoint, method = 'POST', payload } = body;

    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'Missing endpoint' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Whitelist allowed endpoints
    const allowedPrefixes = [
      '/pixxiapi/v1/properties',
      '/pixxiapi/v1/',
      '/pixxiapi/webhook/v1/form',
      '/pixxiapi/v1/lead/list',
      '/pixxiapi/v1/developer/list',
      '/pixxiapi/v1/search/',
      '/pixxiapi/v1/amenities',
      '/pixxiapi/v1/agent/list',
      '/pixxiapi/v1/reminder',
    ];

    const isAllowed = allowedPrefixes.some((p) => endpoint.startsWith(p));
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: 'Endpoint not allowed' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'X-PIXXI-TOKEN': token,
        'Content-Type': 'application/json',
      },
    };

    if (method.toUpperCase() !== 'GET' && payload) {
      fetchOptions.body = JSON.stringify(payload);
    }

    const response = await fetch(`${PIXXI_BASE}${endpoint}`, fetchOptions);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
