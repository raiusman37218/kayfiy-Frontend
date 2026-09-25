async function test() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();
  const desktop = html.includes('banner-1-desktop.png') && html.includes('banner-2-desktop.png');
  const mobile = html.includes('banner-1-mobile.png') && html.includes('banner-2-mobile.png');
  console.log('Homepage Banner check:', {
    status: res.status,
    hasDesktopBanners: desktop,
    hasMobileBanners: mobile
  });
}
test().catch(console.error);
