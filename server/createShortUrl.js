const targetUrl = 'https://dating-arizona-selections-newman.trycloudflare.com';
const aliases = ['agmedia-crm', 'agmedia-system', 'agmedia-agency', 'agmedia-app', 'ag-media-crm', 'agmedia-egypt'];

async function testAliases() {
  for (const alias of aliases) {
    try {
      const url = 'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(targetUrl) + '&alias=' + encodeURIComponent(alias);
      const res = await fetch(url);
      const text = await res.text();
      console.log('Alias:', alias, '->', text);
      if (text.startsWith('https://tinyurl.com/')) {
        console.log('SUCCESS! Active custom short URL:', text);
        return;
      }
    } catch(e) {
      console.error('Error with', alias, e.message);
    }
  }

  // Fallback without custom alias:
  const res = await fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(targetUrl));
  const text = await res.text();
  console.log('Default short URL:', text);
}

testAliases();
