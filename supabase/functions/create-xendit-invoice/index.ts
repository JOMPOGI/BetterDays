const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { bookingId, amount, email, description, successUrl, failureUrl } = await req.json();

    if (!bookingId || !amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Missing bookingId or invalid amount' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const secretKey = Deno.env.get('XENDIT_SECRET_KEY');
    if (!secretKey) {
      return new Response(JSON.stringify({ error: 'Server missing XENDIT_SECRET_KEY' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const auth = 'Basic ' + btoa(secretKey + ':');

    // external_id = our booking's id. The webhook uses this to find the
    // booking again once Xendit confirms payment.
    const res = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify({
        external_id: bookingId,
        amount,
        currency: 'PHP',
        payer_email: email,
        description: description || 'Better Days Studios — Booking Downpayment',
        // No payment_methods restriction here on purpose: this lets the
        // customer pick from every method you've enabled in your Xendit
        // dashboard (cards, GCash, Maya, etc.) on Xendit's hosted page.
        success_redirect_url: successUrl,
        failure_redirect_url: failureUrl,
      }),
    });

    const invoice = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify(invoice), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ invoice_url: invoice.invoice_url, id: invoice.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
