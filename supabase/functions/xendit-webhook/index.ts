import { createClient } from 'jsr:@supabase/supabase-js@2';

// Deployed with --no-verify-jwt because Xendit (not a logged-in user)
// calls this directly. We verify the request is really from Xendit using
// the callback token instead (set in your Xendit dashboard's webhook
// settings, and stored here as the XENDIT_WEBHOOK_TOKEN secret).

Deno.serve(async (req) => {
  try {
    const receivedToken = req.headers.get('x-callback-token');
    const expectedToken = Deno.env.get('XENDIT_WEBHOOK_TOKEN');

    if (!expectedToken || receivedToken !== expectedToken) {
      return new Response('Unauthorized', { status: 401 });
    }

    const event = await req.json();
    // event.external_id is the booking_id we passed in when creating the invoice
    const bookingId = event.external_id;
    const status = event.status; // 'PAID', 'EXPIRED', etc.

    if (status === 'PAID' && bookingId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      const { data: booking } = await supabase
        .from('bookings')
        .select('client_id')
        .eq('id', bookingId)
        .single();

      await supabase.from('payments').insert({
        booking_id: bookingId,
        client_id: booking?.client_id ?? null,
        amount: event.paid_amount ?? event.amount,
        currency: event.currency || 'PHP',
        method: event.payment_method || event.payment_channel || 'xendit',
        provider: 'xendit',
        provider_payment_id: event.id,
        status: 'paid',
        paid_at: new Date().toISOString(),
      });

      await supabase
        .from('bookings')
        .update({ status: 'CONFIRMED' })
        .eq('id', bookingId)
        .eq('status', 'PENDING_PAYMENT');
    }

    return new Response('ok');
  } catch (err) {
    console.error('xendit-webhook error:', err);
    // Return 200 anyway so Xendit doesn't endlessly retry on our bugs;
    // check `supabase functions logs xendit-webhook` to debug.
    return new Response('ok');
  }
});
