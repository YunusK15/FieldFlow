module.exports = async function(ctx) {
  // 1. Test analytics rejects unauthorized requests
  try {
    const res = await fetch(`${ctx.baseUrl}/api/predictions/analytics`);
    const isUnauthorizedBlocked = res.status === 401;
    ctx.registerAssertion('GET /api/predictions/analytics - Reject unauthorized requests', isUnauthorizedBlocked);
  } catch (err) {
    ctx.registerAssertion('GET /api/predictions/analytics - Reject unauthorized requests', false, err.message);
  }

  // 2. Test analytics succeeds with authentication
  try {
    const res = await fetch(`${ctx.baseUrl}/api/predictions/analytics`, {
      headers: { 'Authorization': `Bearer ${ctx.token}` }
    });
    const data = await res.json();
    
    // Confirms response structure contains totalScans, average confidence, timeline, and confidence spread
    const isOk = res.status === 200 && 'totalScans' in data && 'avgConfidence' in data && data.timeline && data.confidenceSpread;
    ctx.registerAssertion('GET /api/predictions/analytics - Fetch user prediction metrics (authenticated)', isOk);
  } catch (err) {
    ctx.registerAssertion('GET /api/predictions/analytics - Fetch user prediction metrics (authenticated)', false, err.message);
  }

  // 3. Test prediction upload rejects unauthorized requests
  try {
    const res = await fetch(`${ctx.baseUrl}/api/predict`, { method: 'POST' });
    const isUnauthorizedBlocked = res.status === 401;
    ctx.registerAssertion('POST /api/predict - Reject unauthorized image classification requests', isUnauthorizedBlocked);
  } catch (err) {
    ctx.registerAssertion('POST /api/predict - Reject unauthorized image classification requests', false, err.message);
  }

  // 4. Test prediction upload rejects missing image payload
  try {
    const res = await fetch(`${ctx.baseUrl}/api/predict`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${ctx.token}` }
    });
    const isMissingPayloadBlocked = res.status === 400;
    ctx.registerAssertion('POST /api/predict - Reject classification requests with missing image file', isMissingPayloadBlocked);
  } catch (err) {
    ctx.registerAssertion('POST /api/predict - Reject classification requests with missing image file', false, err.message);
  }
};
