async function run() {
  const res = await fetch('https://developer.android.com/studio');
  const text = await res.text();
  const matches = text.match(/https:\/\/[^"'\s]+android-studio[^"'\s]+windows\.exe/gi);
  console.log('Matches:', matches);
}
run();
