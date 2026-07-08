module.exports = async function(ctx) {
  // 1. Test outbreaks listing rejects unauthorized requests
  try {
    const res = await fetch(`${ctx.baseUrl}/api/outbreaks`);
    const isUnauthorizedBlocked = res.status === 401;
    ctx.registerAssertion('GET /api/outbreaks - Reject unauthorized requests', isUnauthorizedBlocked);
  } catch (err) {
    ctx.registerAssertion('GET /api/outbreaks - Reject unauthorized requests', false, err.message);
  }

  // 2. Test outbreaks listing succeeds with auth
  try {
    const res = await fetch(`${ctx.baseUrl}/api/outbreaks`, {
      headers: { 'Authorization': `Bearer ${ctx.token}` }
    });
    const data = await res.json();
    const isOk = res.status === 200 && Array.isArray(data);
    ctx.registerAssertion('GET /api/outbreaks - Fetch community sightings (authenticated)', isOk);
  } catch (err) {
    ctx.registerAssertion('GET /api/outbreaks - Fetch community sightings (authenticated)', false, err.message);
  }

  // 3. Test submitting valid report
  try {
    const res = await fetch(`${ctx.baseUrl}/api/outbreaks/report`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`
      },
      body: JSON.stringify({
        pestName: 'beetle',
        city: 'Davis',
        severity: 'Medium',
        notes: 'Spotted on tomato plants.'
      })
    });
    const data = await res.json();
    const isOk = res.status === 201 && data.pestName === 'beetle' && data.city === 'Davis';
    ctx.registerAssertion('POST /api/outbreaks/report - File new sighting report', isOk);
  } catch (err) {
    ctx.registerAssertion('POST /api/outbreaks/report - File new sighting report', false, err.message);
  }

  // 4. Test rejecting invalid pest name
  try {
    const res = await fetch(`${ctx.baseUrl}/api/outbreaks/report`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`
      },
      body: JSON.stringify({
        pestName: 'invalid_dinosaur',
        city: 'Davis',
        severity: 'Medium',
        notes: 'Not a real insect'
      })
    });
    const isInvalidPestBlocked = res.status === 400;
    ctx.registerAssertion('POST /api/outbreaks/report - Reject unsupported pest classification', isInvalidPestBlocked);
  } catch (err) {
    ctx.registerAssertion('POST /api/outbreaks/report - Reject unsupported pest classification', false, err.message);
  }

  // 5. Test rejecting invalid severity string
  try {
    const res = await fetch(`${ctx.baseUrl}/api/outbreaks/report`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`
      },
      body: JSON.stringify({
        pestName: 'beetle',
        city: 'Davis',
        severity: 'Extreme',
        notes: 'Extreme is not a valid severity level'
      })
    });
    const isInvalidSeverityBlocked = res.status === 400;
    ctx.registerAssertion('POST /api/outbreaks/report - Reject out-of-spec severity level', isInvalidSeverityBlocked);
  } catch (err) {
    ctx.registerAssertion('POST /api/outbreaks/report - Reject out-of-spec severity level', false, err.message);
  }

  // 6. Test rejecting too short city name
  try {
    const res = await fetch(`${ctx.baseUrl}/api/outbreaks/report`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`
      },
      body: JSON.stringify({
        pestName: 'beetle',
        city: 'D',
        severity: 'Low',
        notes: 'Notes match rules'
      })
    });
    const isShortCityBlocked = res.status === 400;
    ctx.registerAssertion('POST /api/outbreaks/report - Reject city names shorter than 2 chars', isShortCityBlocked);
  } catch (err) {
    ctx.registerAssertion('POST /api/outbreaks/report - Reject city names shorter than 2 chars', false, err.message);
  }

  // 7. Test rejecting notes exceeding 500 characters
  try {
    const longNotes = 'a'.repeat(501);
    const res = await fetch(`${ctx.baseUrl}/api/outbreaks/report`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`
      },
      body: JSON.stringify({
        pestName: 'beetle',
        city: 'Davis',
        severity: 'Medium',
        notes: longNotes
      })
    });
    const isLongNotesBlocked = res.status === 400;
    ctx.registerAssertion('POST /api/outbreaks/report - Reject description notes exceeding 500 chars', isLongNotesBlocked);
  } catch (err) {
    ctx.registerAssertion('POST /api/outbreaks/report - Reject description notes exceeding 500 chars', false, err.message);
  }
};
