const targetUrl = 'https://dating-arizona-selections-newman.trycloudflare.com';

async function testShorteners() {
  // Test is.gd
  try {
    const res = await fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(targetUrl) + '&shorturl=agmedia-crm');
    const json = await res.json();
    console.log('is.gd custom:', json);
  } catch(e) {
    console.log('is.gd error:', e.message);
  }

  // Test ulvis.net
  try {
    const res = await fetch('https://ulvis.net/api.php?url=' + encodeURIComponent(targetUrl) + '&custom=agmedia-crm');
    const text = await res.text();
    console.log('ulvis custom:', text);
  } catch(e) {
    console.log('ulvis error:', e.message);
  }

  // Test cleanuri.com
  try {
    const res = await fetch('https://cleanuri.com/api/v1/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'url=' + encodeURIComponent(targetUrl)
    });
    const json = await res.json();
    console.log('cleanuri:', json);
  } catch(e) {
    console.log('cleanuri error:', e.message);
  }
}

testShorteners();
