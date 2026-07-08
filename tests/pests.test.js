module.exports = async function(ctx) {
  // 1. Test pests catalog endpoint is accessible publicly (without authorization)
  try {
    const res = await fetch(`${ctx.baseUrl}/api/pests`);
    const data = await res.json();
    
    // Confirms response status is 200 OK and contains an array of pests with structural fields
    const isOk = res.status === 200 && Array.isArray(data) && data.length > 0 && data[0].name && data[0].description && data[0].solution;
    ctx.registerAssertion('GET /api/pests - Fetch pests catalog publicly', isOk);
  } catch (err) {
    ctx.registerAssertion('GET /api/pests - Fetch pests catalog publicly', false, err.message);
  }
};
