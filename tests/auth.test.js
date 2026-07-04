const assert = require('assert');

module.exports = async function(ctx) {
  const email = `test_user_${Date.now()}@example.com`;
  const password = 'Password123';
  const name = 'Automated Tester';

  // 1. Test registration
  try {
    const res = await fetch(`${ctx.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    
    const isOk = res.status === 201 && data.token && data.user.email === email;
    ctx.registerAssertion('POST /api/auth/register - Register new account', isOk);
    if (isOk) {
      // Save token for subsequent tests
      ctx.token = data.token;
    }
  } catch (err) {
    ctx.registerAssertion('POST /api/auth/register - Register new account', false, err.message);
  }

  // 2. Test duplicate email registration
  try {
    const res = await fetch(`${ctx.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    
    const isDuplicateBlocked = (res.status === 409 || res.status === 400) && data.error && data.error.toLowerCase().includes('already exists');
    ctx.registerAssertion('POST /api/auth/register - Reject duplicate registration', isDuplicateBlocked);
  } catch (err) {
    ctx.registerAssertion('POST /api/auth/register - Reject duplicate registration', false, err.message);
  }

  // 3. Test missing fields
  try {
    const res = await fetch(`${ctx.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const isMissingFieldsBlocked = res.status === 400;
    ctx.registerAssertion('POST /api/auth/register - Reject registration with missing fields', isMissingFieldsBlocked);
  } catch (err) {
    ctx.registerAssertion('POST /api/auth/register - Reject registration with missing fields', false, err.message);
  }

  // 4. Test login
  try {
    const res = await fetch(`${ctx.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    const isOk = res.status === 200 && data.token && data.user;
    ctx.registerAssertion('POST /api/auth/login - Login successful with valid credentials', isOk);
  } catch (err) {
    ctx.registerAssertion('POST /api/auth/login - Login successful with valid credentials', false, err.message);
  }

  // 5. Test login invalid password
  try {
    const res = await fetch(`${ctx.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'WrongPassword' })
    });
    const isWrongPasswordBlocked = res.status === 401 || res.status === 400;
    ctx.registerAssertion('POST /api/auth/login - Reject login with invalid password', isWrongPasswordBlocked);
  } catch (err) {
    ctx.registerAssertion('POST /api/auth/login - Reject login with invalid password', false, err.message);
  }

  // 6. Test short password registration validation (must be >= 6 characters)
  try {
    const res = await fetch(`${ctx.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email: `short_pwd_${Date.now()}@example.com`, password: '12345' })
    });
    const data = await res.json();
    const isShortPasswordBlocked = res.status === 400 && data.error && data.error.toLowerCase().includes('at least 6 characters');
    ctx.registerAssertion('POST /api/auth/register - Reject registration with passwords < 6 characters', isShortPasswordBlocked);
  } catch (err) {
    ctx.registerAssertion('POST /api/auth/register - Reject registration with passwords < 6 characters', false, err.message);
  }
};
