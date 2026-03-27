const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAIImport() {
  console.log('--- Testing AI Import API ---');
  try {
    const response = await fetch('http://localhost:3000/api/ai/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Test prompt', deckName: 'Test Deck' })
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Data:', JSON.stringify(data, null, 2));

    if (data.cards && Array.isArray(data.cards)) {
      console.log('✅ Success: Received cards array.');
    } else {
      console.error('❌ Failed: No cards array in response.');
    }
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  }
}

testAIImport();
