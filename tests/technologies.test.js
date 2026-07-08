module.exports = async function(ctx) {
  // 1. Test technologies directory is accessible publicly
  try {
    const res = await fetch(`${ctx.baseUrl}/api/technologies`);
    const data = await res.json();
    const isOk = res.status === 200 && Array.isArray(data) && data.length > 0;
    ctx.registerAssertion('GET /api/technologies - Retrieve active farming catalog', isOk);
  } catch (err) {
    ctx.registerAssertion('GET /api/technologies - Retrieve active farming catalog', false, err.message);
  }

  // 2. Test sync endpoint rejects unauthorized requests
  try {
    const res = await fetch(`${ctx.baseUrl}/api/technologies/sync`, { method: 'POST' });
    const isUnauthorizedBlocked = res.status === 401;
    ctx.registerAssertion('POST /api/technologies/sync - Reject unauthorized news sync requests', isUnauthorizedBlocked);
  } catch (err) {
    ctx.registerAssertion('POST /api/technologies/sync - Reject unauthorized news sync requests', false, err.message);
  }

  // 3. Test sync endpoint executes successfully and returns sorted elements
  try {
    // Sync process might take some time, so let's allow a longer fetch timeout
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 35000); // 35-second abort timeout

    const res = await fetch(`${ctx.baseUrl}/api/technologies/sync`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${ctx.token}` },
      signal: controller.signal
    });
    clearTimeout(id);
    const data = await res.json();
    
    // Confirms response status is 200 OK and contains news items
    const isOk = res.status === 200 && Array.isArray(data);
    ctx.registerAssertion('POST /api/technologies/sync - Perform news scraping and DB sync (authenticated)', isOk);

    if (isOk && data.length > 0) {
      // Check sorting rule (news items at the top)
      const firstIsNews = data[0].isNews === true;
      const staticAtBottom = data[data.length - 1].isNews !== true;
      ctx.registerAssertion('POST /api/technologies/sync - Confirms news sorted to top & default items at bottom', firstIsNews && staticAtBottom);
    } else {
      ctx.registerAssertion('POST /api/technologies/sync - Confirms news sorted to top & default items at bottom', false, 'Empty list returned');
    }
  } catch (err) {
    ctx.registerAssertion('POST /api/technologies/sync - Perform news scraping and DB sync (authenticated)', false, err.message);
  }
};
