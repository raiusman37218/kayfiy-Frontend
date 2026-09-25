const fs = require('fs');

async function run() {
  const res = await fetch('https://inunder.com/');
  const html = await res.text();
  const start = html.indexOf('<hero-slider');
  const end = html.indexOf('</hero-slider');
  if (start !== -1 && end !== -1) {
    const sliderHtml = html.slice(start, end + 20);
    fs.writeFileSync('scratch/slider.html', sliderHtml);
    console.log('Saved slider.html, length:', sliderHtml.length);
  } else {
    console.log('Hero slider tag not found');
  }
}
run();
