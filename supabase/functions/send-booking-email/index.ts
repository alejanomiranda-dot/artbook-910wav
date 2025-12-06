// supabase/functions/send-booking-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@3.2.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ARTBOOK_ADMIN_EMAIL = Deno.env.get("ARTBOOK_ADMIN_EMAIL") ?? "";
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "Artbook 910.WAV <contacto@910wav.com>";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const resend = RESEND_API_KEY
    ? new Resend(RESEND_API_KEY)
    : null;

const headersBase = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request): Promise<Response> => {
    // Preflight CORS
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: headersBase });
    }

    if (req.method !== "POST") {
        return new Response(
            JSON.stringify({ error: "Method not allowed" }),
            { status: 405, headers: headersBase },
        );
    }

    try {
        if (!resend) {
            return new Response(
                JSON.stringify({ error: "RESEND_API_KEY not configured" }),
                { status: 500, headers: headersBase },
            );
        }

        const body = await req.json();

        const {
            artistId,
            artistSlug,
            artistName,
            artistEmail,
            name,
            email,
            phone,
            eventType,
            date,
            city,
            budget,
            message,
        } = body ?? {};

        // Validaciones mínimas
        if (!artistId || !artistSlug || !artistName || !artistEmail) {
            return new Response(
                JSON.stringify({ error: "Datos del artista incompletos." }),
                { status: 400, headers: headersBase },
            );
        }

        if (!name || !email || !phone || !eventType || !city) {
            return new Response(
                JSON.stringify({
                    error: "Faltan campos obligatorios del solicitante.",
                }),
                { status: 400, headers: headersBase },
            );
        }

        // Crear cliente de Supabase con service role para insertar en la tabla
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: { persistSession: false },
        });

        // Insertar oportunidad en la tabla 'booking_requests'
        // Se usan las columnas existentes conocidas. 'artist_name' y 'artist_email'
        // se omiten del insert si la tabla no las tiene (segun definición previa solo tiene artist_id/slug),
        // pero si el usuario actualizó la tabla, se pueden descomentar.
        // Por seguridad, insertamos lo que sabemos que existe en 'booking_requests'.
        const { error: dbError } = await supabase
            .from("booking_requests")
            .insert([
                {
                    artist_id: artistId,
                    artist_slug: artistSlug,
                    // artist_name: artistName, // Descomentar si la columna existe
                    // artist_email: artistEmail, // Descomentar si la columna existe
                    name,
                    email,
                    phone,
                    event_type: eventType,
                    date,
                    city,
                    budget,
                    message,
                },
            ]);

        if (dbError) {
            console.error("DB insert error:", dbError);
            return new Response(
                JSON.stringify({ error: "No se pudo registrar la solicitud." }),
                { status: 500, headers: headersBase },
            );
        }

        // Armar destinatarios: artista + admin (si existe)
        const recipients: string[] = [];
        if (artistEmail) recipients.push(artistEmail);
        if (ARTBOOK_ADMIN_EMAIL) {
            recipients.push(ARTBOOK_ADMIN_EMAIL);
        }

        const subject = `Nueva solicitud de show para ${artistName}`;
        const htmlBody = `
      <h2>Nueva solicitud de show / presupuesto</h2>
      <p><b>Artista:</b> ${artistName} (${artistSlug})</p>
      <p><b>Cliente:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Teléfono:</b> ${phone}</p>
      <p><b>Tipo de evento:</b> ${eventType}</p>
      <p><b>Ciudad del evento:</b> ${city}</p>
      <p><b>Fecha estimada:</b> ${date || "No especificada"}</p>
      <p><b>Presupuesto estimado:</b> ${budget || "No especificado"}</p>
      <p><b>Mensaje:</b></p>
      <p>${message ? message.replace(/\n/g, "<br>") : "Sin detalles adicionales."}</p>
      <hr />
      <p>Esta solicitud fue enviada desde Artbook by 910.WAV.</p>
    `;

        const { error: emailError } = await resend.emails.send({
            from: RESEND_FROM_EMAIL,
            to: recipients,
            subject,
            html: htmlBody,
        });

        if (emailError) {
            console.error("Resend error:", emailError);
            return new Response(
                JSON.stringify({
                    ok: true,
                    warning: "La solicitud se guardó, pero el email no pudo enviarse.",
                }),
                { status: 200, headers: headersBase },
            );
        }

        return new Response(
            JSON.stringify({ ok: true }),
            { status: 200, headers: headersBase },
        );
    } catch (err) {
        console.error("Unhandled error in send-booking-email:", err);
        return new Response(
            JSON.stringify({
                error: "Error inesperado al procesar la solicitud.",
            }),
            { status: 500, headers: headersBase },
        );
    }
});
