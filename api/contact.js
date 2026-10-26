// Vercel Serverless Function — GALAXIQURA Contact & Consultation Endpoint
// Supports direct delivery via SMTP/Nodemailer, Resend API, or Vercel Lead Logging

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { name, phone, email, topic, message, hp_check } = body;

    // 1. Anti-spam honeypot
    if (hp_check) {
      return res.status(200).json({ success: true, message: 'Your enquiry has been received.' });
    }

    // 2. Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (Name, Email, Message).'
      });
    }

    const recipient = process.env.CONTACT_RECIPIENT || 'kathirkjps007@gmail.com';
    const consultationTopic = topic || 'Strategic Consulting';
    let emailSent = false;

    // 3. Option A: Nodemailer SMTP (configured via Vercel Environment Variables)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"GALAXIQURA Portal" <${process.env.SMTP_USER}>`,
          to: recipient,
          replyTo: `"${name}" <${email}>`,
          subject: `[GALAXIQURA Portal] Consultation Request: ${consultationTopic} — ${name}`,
          text: `Name: ${name}\nPhone: ${phone || 'N/A'}\nEmail: ${email}\nTopic: ${consultationTopic}\n\nMessage:\n${message}\n\n---\nSent via GALAXIQURA Strategic Consultation Portal (Vercel Serverless)`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #14243b; border-radius: 8px; background: #080f1a; color: #f0f6fc;">
              <h2 style="color: #00e5ff; border-bottom: 2px solid #00e5ff; padding-bottom: 8px; margin-top: 0;">GALAXIQURA Consultation Request</h2>
              <p style="margin: 12px 0;"><strong>Client Name:</strong> ${name}</p>
              <p style="margin: 12px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p style="margin: 12px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2ed573;">${email}</a></p>
              <p style="margin: 12px 0;"><strong>Consultation Topic:</strong> <span style="background: rgba(0,229,255,0.15); color: #00e5ff; padding: 3px 8px; border-radius: 4px;">${consultationTopic}</span></p>
              <div style="margin-top: 16px; padding: 14px; background: rgba(255,255,255,0.03); border-left: 3px solid #f5b041; border-radius: 4px;">
                <strong>Strategic Brief / Scope:</strong>
                <p style="margin-top: 6px; white-space: pre-wrap; color: #e6edf3;">${message}</p>
              </div>
              <p style="margin-top: 24px; font-size: 11px; color: #8b949e; border-top: 1px solid #21262d; padding-top: 12px;">
                Delivered automatically via GALAXIQURA Vercel Serverless Function • Timestamp: ${new Date().toISOString()}
              </p>
            </div>
          `
        });
        emailSent = true;
      } catch (smtpErr) {
        console.error('SMTP transmission error:', smtpErr);
      }
    }

    // 4. Option B: Resend API (if RESEND_API_KEY is provided in Vercel)
    if (!emailSent && process.env.RESEND_API_KEY) {
      try {
        const resendResp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'GALAXIQURA <onboarding@resend.dev>',
            to: recipient,
            reply_to: email,
            subject: `[GALAXIQURA] Consultation Request: ${consultationTopic} — ${name}`,
            text: `Name: ${name}\nPhone: ${phone || 'N/A'}\nEmail: ${email}\nTopic: ${consultationTopic}\n\nMessage:\n${message}`,
          })
        });
        if (resendResp.ok) {
          emailSent = true;
        }
      } catch (resendErr) {
        console.error('Resend transmission error:', resendErr);
      }
    }

    // 5. Always log lead to Vercel Function logs as a guaranteed record
    console.log(`[GALAXIQURA_NEW_LEAD]`, JSON.stringify({
      timestamp: new Date().toISOString(),
      name,
      phone,
      email,
      topic: consultationTopic,
      message,
      emailSent
    }));

    return res.status(200).json({
      success: true,
      delivered: emailSent,
      message: `Thank you, ${name}! Your enquiry has been received and routed to our partners. We will reach out within 24 hours.`
    });

  } catch (err) {
    console.error('Vercel contact handler exception:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error processing enquiry. Please try again or reach out directly.'
    });
  }
};
