module.exports = async function(ctx) {
  // 1. Test weather risk route rejects unauthorized requests
  try {
    const res = await fetch(`${ctx.baseUrl}/api/weather/risk?lat=37.7749&lon=-122.4194`);
    const isUnauthorizedBlocked = res.status === 401;
    ctx.registerAssertion('GET /api/weather/risk - Reject unauthorized requests', isUnauthorizedBlocked);
  } catch (err) {
    ctx.registerAssertion('GET /api/weather/risk - Reject unauthorized requests', false, err.message);
  }

  // 2. Test weather risk succeeds with authentication and valid coordinates
  try {
    const res = await fetch(`${ctx.baseUrl}/api/weather/risk?lat=37.7749&lon=-122.4194`, {
      headers: { 'Authorization': `Bearer ${ctx.token}` }
    });
    const data = await res.json();
    
    // Confirms response structure contains location, weather details, and risk advice
    const isOk = res.status === 200 && data.location && data.weather && data.risks && data.advice;
    ctx.registerAssertion('GET /api/weather/risk - Fetch weather risk metrics (authenticated)', isOk);
  } catch (err) {
    ctx.registerAssertion('GET /api/weather/risk - Fetch weather risk metrics (authenticated)', false, err.message);
  }

  // 3. Test weather risk rejects out of bounds latitude (lat = 100)
  try {
    const res = await fetch(`${ctx.baseUrl}/api/weather/risk?lat=100&lon=-122.4194`, {
      headers: { 'Authorization': `Bearer ${ctx.token}` }
    });
    const isOutOfBoundLatBlocked = res.status === 400;
    ctx.registerAssertion('GET /api/weather/risk - Reject latitude > 90', isOutOfBoundLatBlocked);
  } catch (err) {
    ctx.registerAssertion('GET /api/weather/risk - Reject latitude > 90', false, err.message);
  }

  // 4. Test weather risk rejects out of bounds longitude (lon = -200)
  try {
    const res = await fetch(`${ctx.baseUrl}/api/weather/risk?lat=37.7749&lon=-200`, {
      headers: { 'Authorization': `Bearer ${ctx.token}` }
    });
    const isOutOfBoundLonBlocked = res.status === 400;
    ctx.registerAssertion('GET /api/weather/risk - Reject longitude < -180', isOutOfBoundLonBlocked);
  } catch (err) {
    ctx.registerAssertion('GET /api/weather/risk - Reject longitude < -180', false, err.message);
  }

  // 5. Test weather risk defaults coordinates when parameters are missing
  try {
    const res = await fetch(`${ctx.baseUrl}/api/weather/risk`, {
      headers: { 'Authorization': `Bearer ${ctx.token}` }
    });
    const data = await res.json();
    const isOk = res.status === 200 && data.location && data.location.lat && data.location.lon;
    ctx.registerAssertion('GET /api/weather/risk - Default coordinates when parameters are missing', isOk);
  } catch (err) {
    ctx.registerAssertion('GET /api/weather/risk - Default coordinates when parameters are missing', false, err.message);
  }
};
