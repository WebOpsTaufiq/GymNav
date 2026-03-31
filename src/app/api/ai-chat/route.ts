import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedGymId } from '@/lib/supabase/get-verified-gym-id';
import { checkGymAccess } from '@/lib/supabase/check-gym-access';
import { getAdminClient } from '@/lib/supabase/admin';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

export async function POST(req: NextRequest) {
  try {
    let gymId: string;
    let userId: string;

    const supabaseAdmin = getAdminClient();
    const supabase = await (await import('@/lib/supabase/server')).createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = user.id;

    try { gymId = await getVerifiedGymId(); }
    catch (res) { return res as Response; }

    if (!checkRateLimit(userId)) {
       return new Response(JSON.stringify({ error: 'Too many requests' }), {
         status: 429,
         headers: { 'Retry-After': '60', 'Content-Type': 'application/json' }
       });
    }

    await checkGymAccess(gymId);

    const { messages } = await req.json();

    if (!messages?.length) {
      return new Response(JSON.stringify({ error: 'Missing messages' }), { status: 400 });
    }

    // --- Fetch comprehensive gym context using service role (bypasses RLS) ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const [
      { data: gym },
      { data: activeMembers },
      { count: checkinsToday },
      { count: failedPayments },
      { data: renewingSoon },
      { data: atRiskMembers },
      { data: recentPayments },
      { data: recentLeads }
    ] = await Promise.all([
      supabaseAdmin.from('gyms').select('name, city, plan').eq('id', gymId).single(),
      supabaseAdmin.from('members').select('id, full_name, plan_name, plan_price, status, renewal_date, phone, email').eq('gym_id', gymId).eq('status', 'active'),
      supabaseAdmin.from('checkins').select('*', { count: 'exact', head: true }).eq('gym_id', gymId).gte('checked_in_at', today.toISOString()),
      supabaseAdmin.from('payments').select('*', { count: 'exact', head: true }).eq('gym_id', gymId).eq('status', 'failed'),
      supabaseAdmin.from('members').select('full_name, renewal_date, phone').eq('gym_id', gymId).gte('renewal_date', today.toISOString().split('T')[0]).lte('renewal_date', sevenDaysLater.toISOString().split('T')[0]),
      supabaseAdmin.from('members').select('full_name, phone, email, plan_name').eq('gym_id', gymId).eq('status', 'at-risk'),
      supabaseAdmin.from('payments').select('amount, status, paid_at, members(full_name)').eq('gym_id', gymId).order('created_at', { ascending: false }).limit(10),
      supabaseAdmin.from('leads').select('name, source, status, created_at').eq('gym_id', gymId).order('created_at', { ascending: false }).limit(10)
    ]);

    const totalActive = activeMembers?.length || 0;
    const mrr = activeMembers?.reduce((acc, m) => acc + (Number(m.plan_price) || 0), 0) || 0;
    const renewList = renewingSoon?.map(m => `${m.full_name} (renews ${m.renewal_date})`).join(', ') || 'None';
    const atRiskList = atRiskMembers?.map(m => `${m.full_name} (${m.plan_name || 'No plan'}, ${m.phone || 'no phone'})`).join(', ') || 'None';
    const recentPaymentsList = recentPayments?.map(p => `₹${p.amount} - ${p.status} by ${(p.members as any)?.full_name || 'Unknown'}`).join('; ') || 'None';
    const leadsList = recentLeads?.map(l => `${l.name} (${l.source}, ${l.status})`).join(', ') || 'None';

    const systemPrompt = `You are GymNav AI — the 24/7 AI Operations Manager for "${gym?.name || 'this gym'}" located in ${gym?.city || 'India'}. You are not just a chatbot. You are an autonomous AI employee who manages this entire gym's operations. You think proactively, flag problems before they escalate, draft communications, analyze trends, and make actionable recommendations.

YOUR LIVE OPERATIONAL DATA (as of ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 KEY METRICS:
- Active Members: ${totalActive}
- Monthly Recurring Revenue (MRR): ₹${mrr.toLocaleString()}
- Today's Check-ins: ${checkinsToday || 0}
- Failed/Pending Payments: ${failedPayments || 0}

⚠️ MEMBERS RENEWING IN 7 DAYS:
${renewList}

🔴 AT-RISK MEMBERS (need immediate attention):
${atRiskList}

💰 RECENT PAYMENTS:
${recentPaymentsList}

🎯 RECENT LEADS:
${leadsList}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR BEHAVIORAL GUIDELINES:
1. PROACTIVE: Don't just answer questions. If you see problems in the data (at-risk members, failed payments, low check-ins), flag them immediately even if not asked.
2. ACTIONABLE: Every insight must come with a specific next step. Never say "you should consider" — say exactly what to do.
3. DRAFT-READY: When asked to write messages (WhatsApp, SMS, email), write the COMPLETE message ready to copy-paste. Use a friendly, professional Indian gym owner tone.
4. DATA-DRIVEN: Always reference specific numbers, names, and dates from the live data above. Never make up data.
5. CONCISE: Keep responses focused and scannable. Use bullet points, bold text, and clear sections.
6. BUSINESS-MINDED: Think like a gym business consultant. Focus on retention, revenue recovery, lead conversion, and operational efficiency.
7. INDIAN CONTEXT: Use ₹ for currency. Understand Indian gym culture, festival seasons, and local context.

When formatting responses, use markdown. Use **bold** for emphasis, bullet points for lists, and clear section headers. Keep responses concise but comprehensive.`;

    // --- Build Gemini request payload ---
    const geminiMessages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I am GymNav AI, the autonomous operations manager for this gym. I have full access to the live operational data. I will be proactive, actionable, and data-driven in all my responses. How can I help manage the gym today?' }] },
      ...messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    ];

    const geminiPayload = {
      contents: geminiMessages,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    // --- Stream from Gemini ---
    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', errText);
      return new Response(JSON.stringify({ error: 'AI service unavailable. Please try again.' }), { status: 502 });
    }

    // --- Transform SSE stream into a clean text stream for the client ---
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiRes.body!.getReader();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6).trim();
                if (jsonStr === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(jsonStr);
                  const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch {}
              }
            }
          }
        } catch (err) {
          console.error('Stream processing error:', err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('AI Chat route error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
}
