// lib/mailer.ts
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
export function sendMail(to: string, subject: string, html: string) {
  return sgMail.send({ to, from: 'no-reply@yourdomain.com', subject, html });
}
