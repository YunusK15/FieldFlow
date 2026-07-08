const test = async () => {
  const email = `test_${Date.now()}@example.com`;
  const password = 'password123';
  const name = 'Test User';

  try {
    // 1. Register User
    console.log('Registering user...');
    const registerRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    if (!registerRes.ok) {
      const errText = await registerRes.text();
      throw new Error(`Register failed: ${registerRes.status} - ${errText}`);
    }
    
    const registerData = await registerRes.json();
    const token = registerData.token;
    console.log('Registration success! Token retrieved.');

    // 2. Call Sync Endpoint
    console.log('Calling /api/technologies/sync...');
    const syncRes = await fetch('http://localhost:5000/api/technologies/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Sync Response status:', syncRes.status);
    const syncText = await syncRes.text();
    console.log('Sync Response body:', syncText);

  } catch (err) {
    console.error('Error during API test:', err);
  }
};

test();
