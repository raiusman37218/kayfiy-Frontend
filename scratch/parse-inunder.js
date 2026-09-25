async function run() {
  const res = await fetch('https://inunder.com/');
  const html = await res.text();
  const slideRegex = /<div class="[^"]*ai-hero-slider__slide[^"]*" data-slide-index="(\d+)"([\s\S]*?)<\/div>\s*<\/div>/g;
  let match;
  while ((match = slideRegex.exec(html)) !== null) {
    const idx = match[1];
    const slideContent = match[2];
    const dImg = slideContent.match(/src="([^"]+)"[^>]*desktop/i) || slideContent.match(/desktop[^"]*src="([^"]+)"/i);
    const mImg = slideContent.match(/src="([^"]+)"[^>]*mobile/i) || slideContent.match(/mobile[^"]*src="([^"]+)"/i);
    const link = slideContent.match(/href="([^"]+)"/i);
    console.log(JSON.stringify({
      index: idx,
      link: link ? link[1] : null,
      desktop: dImg ? dImg[1] : null,
      mobile: mImg ? mImg[1] : null,
    }, null, 2));
  }
}
run();
