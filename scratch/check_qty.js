const fs = require('fs');
const html = fs.readFileSync('d:/lisset/scratch/sajiero_pdp.html', 'utf8');

const pos = html.indexOf('<quantity-input');
if (pos !== -1) {
  console.log(html.substring(pos - 400, pos + 800));
}
