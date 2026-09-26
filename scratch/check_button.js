const fs = require('fs');
const html = fs.readFileSync('d:/lisset/scratch/sajiero_pdp.html', 'utf8');

const pos = html.indexOf('product_submit_button');
if (pos !== -1) {
  console.log(html.substring(pos - 200, pos + 600));
} else {
  console.log('Not found');
}
