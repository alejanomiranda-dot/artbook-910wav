# Booking Email Edge Function

Esta función envía notificaciones por email usando **Resend** cuando se crea una nueva solicitud de show.

## 1. Despliegue

Para desplegar la función en Supabase:

```bash
supabase functions deploy send-booking-email --no-verify-jwt
```
*(Usamos `--no-verify-jwt` para permitir acceso público desde el frontend, ya validamos los campos internamente)*

## 2. Variables de Entorno (Secrets)

Es necesario configurar la API Key de Resend. Ejecutá el siguiente comando:

```bash
supabase secrets set RESEND_API_KEY=re_123456789
```

**Opcional:** Para personalizar el remitente, configurá:

```bash
supabase secrets set RESEND_FROM_EMAIL="Artbook 910.WAV <contacto@910wav.com>"
```

*Si no configurás `RESEND_FROM_EMAIL`, se usará por defecto `Artbook 910.WAV <contacto@910wav.com>`.  
Asegurate de que el dominio `910wav.com` esté verificado en tu panel de Resend.*

## 3. Prueba Local

Para probar localmente:

1.  Creá un archivo `.env` en `supabase/functions/` con `RESEND_API_KEY=...`.
2.  Corré:
    ```bash
    supabase functions serve --no-verify-jwt --env-file ./supabase/functions/.env
    ```
3.  Hacé un POST a `http://localhost:54321/functions/v1/send-booking-email` con el payload de prueba.
