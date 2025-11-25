#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/../.env' });
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const fetch = globalThis.fetch || (() => { try { return require('node-fetch'); } catch { return null; } })();

(async () => {
  const prisma = new PrismaClient();
  try {
    const reservation = await prisma.reservation.findFirst({ include: { user: true }, orderBy: { createdAt: 'desc' } });
    if (!reservation) {
      console.error('No reservation found in DB.');
      process.exit(1);
    }
    const user = reservation.user;
    if (!user) {
      console.error('Reservation has no user relation.');
      process.exit(1);
    }

    const secret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || process.env['JWT_SECRET'];
    if (!secret) {
      console.error('JWT_SECRET not found in backend .env');
      process.exit(1);
    }

    // Token payload should match what AuthService.createToken produces: { email, id, name }
    const token = jwt.sign({ email: user.email, id: user.id, name: user.name }, secret, { expiresIn: '1h' });

    const url = `http://localhost:5000/reservations/${reservation.id}/send-qr-email`;
    console.log('Using reservation id:', reservation.id);
    console.log('User email:', user.email);
    console.log('POST', url);

    const realFetch = typeof fetch === 'function' ? fetch : (await import('node-fetch')).default;
    // Try sending token as a cookie (server appears to read JWT from cookie named `jwt`).
    const res = await realFetch(url, { method: 'POST', headers: { Cookie: 'jwt=' + token } });
    let body;
    try { body = await res.text(); } catch (e) { body = '<no body>'; }
    console.log('Status:', res.status);
    console.log('Response body:', body);
    process.exit(res.ok ? 0 : 1);
  } catch (err) {
    console.error('Error during smoke test:', err);
    process.exit(1);
  } finally {
    try { await prisma.$disconnect(); } catch (e) {}
  }
})();
