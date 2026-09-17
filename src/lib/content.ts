export type Block = {
  heading?: string;
  body?: string[];
  list?: string[];
};

export type StaticPage = {
  slug: string;
  title: string;
  blurb: string;
  blocks: Block[];
  /** Interactive block rendered above the copy. */
  widget?: "calculator" | "contact" | "size-table";
};

export const staticPages: StaticPage[] = [
  {
    slug: "contact",
    title: "Contact",
    blurb: "Questions about fit, an order or a return — we answer within one working day.",
    widget: "contact",
    blocks: [
      {
        heading: "Other ways to reach us",
        list: [
          "WhatsApp: +92 305 3530008, 10am–7pm Monday to Saturday",
          "Email: hello@kayfiy.pk",
          "Instagram and Facebook: @kayfiy.pk",
        ],
      },
      {
        heading: "Wholesale and stockists",
        body: [
          "If you run a boutique or store and would like to stock KAYFIY, write to wholesale@kayfiy.pk with your shop name and city. We send the current catalog and wholesale order details promptly.",
        ],
      },
    ],
  },
  {
    slug: "how-to-wear-a-bra",
    title: "How to Wear a Bra",
    blurb: "Most fit problems are wearing problems. Five minutes here fixes them.",
    blocks: [
      {
        heading: "Put it on the right way",
        list: [
          "Lean forward and let your bust fall into the cups before you fasten anything.",
          "Fasten on the loosest hook when the bra is new — you will move inward as elastic relaxes.",
          "Scoop the tissue at your underarm forward into the cup with your opposite hand.",
          "Set the straps so two fingers slide under them with slight resistance.",
        ],
      },
      {
        heading: "Check the signs of a correct fit",
        list: [
          "The centre gore sits flat against your chest bone.",
          "The underband runs horizontally straight across your back, not riding up.",
          "No spillage over the cup edges and no empty wrinkling in the cups.",
          "The underwire rests flat against your ribcage without poking into delicate tissue.",
        ],
      },
      {
        heading: "When to change size",
        body: [
          "If the band rides up your back, your band is too loose — go down a band size and up a cup size.",
          "If the wires dig in at the sides, the cups are too small — go up one cup size in the same band.",
        ],
      },
    ],
  },
  {
    slug: "shipping-and-return",
    title: "Shipping & Return",
    blurb: "Simple nationwide delivery and a hassle-free 7-day exchange window.",
    blocks: [
      {
        heading: "Delivery times and charges",
        list: [
          "Karachi, Lahore & Islamabad: 2–3 working days.",
          "Rest of Pakistan: 3–5 working days.",
          "Standard delivery is Rs. 199 flat nationwide.",
          "Free delivery on all orders over Rs. 3,500.",
        ],
      },
      {
        heading: "Discreet Packaging",
        body: [
          "We understand privacy is essential. Every KAYFIY parcel is securely packed in an opaque, unbranded outer bag with no product names displayed on the courier slip.",
        ],
      },
      {
        heading: "7-day exchange policy",
        body: [
          "We gladly exchange any unwashed, unworn item with tags intact within 7 days of delivery. For hygiene reasons, briefs and sanitary pads cannot be returned once opened.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          "Message us on WhatsApp with your order reference number and photo. We will guide you through the fast exchange process.",
        ],
      },
    ],
  },
  {
    slug: "size-guide",
    title: "Size Guide",
    blurb: "How KAYFIY sizing maps to your measurements.",
    widget: "size-table",
    blocks: [
      {
        heading: "How to measure",
        list: [
          "Underbust: wrap the tape directly under your bust, snug and level.",
          "Bust: measure around the fullest part, tape parallel to the floor.",
          "Waist: measure at the narrowest point, usually just above the navel.",
          "Hips: measure around the widest part of your hips and seat.",
        ],
      },
      {
        heading: "Between two sizes?",
        body: [
          "Take the smaller band and the larger cup — a firm band is what holds a bra up. For briefs, nightwear and shapewear, size up if your hip measurement sits at the top of a range.",
        ],
      },
    ],
  },
  {
    slug: "bra-size-calculator",
    title: "Calculate Your Bra Size",
    blurb: "Two measurements, thirty seconds, and a size you can actually wear all day.",
    widget: "calculator",
    blocks: [
      {
        heading: "Before you measure",
        list: [
          "Measure over a thin, non-padded bra or bare skin.",
          "Keep the tape level all the way around and breathe normally.",
          "Round to the nearest half inch rather than pulling the tape tight.",
        ],
      },
      {
        heading: "A calculator is a starting point",
        body: [
          "Cup volume changes with style — a padded t-shirt bra and a soft bralette in the same size can feel different. Order your calculated size first, and message us if it needs adjusting; the first exchange is always on us.",
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    blurb: "The questions we are asked most.",
    blocks: [
      {
        heading: "Do you offer cash on delivery?",
        body: [
          "Yes, across Pakistan wherever courier services deliver. You pay the rider when the parcel arrives.",
        ],
      },
      {
        heading: "How do I know which size to order?",
        body: [
          "Use the bra size calculator for bras and the size guide for everything else. If you are between sizes, take the smaller band and one cup up.",
        ],
      },
      {
        heading: "Can I exchange a sale item?",
        body: [
          "Sale items can be exchanged for a different size within 7 days, but they are not refundable.",
        ],
      },
      {
        heading: "Is my parcel discreet?",
        body: [
          "Every order ships in a plain opaque bag with no product images and only KAYFIY in small print on the label.",
        ],
      },
      {
        heading: "Do you restock sold-out sizes?",
        body: [
          "Core styles are restocked every few weeks. Message us on WhatsApp with the style and size and we will tell you when it lands.",
        ],
      },
      {
        heading: "How should I wash my KAYFIY pieces?",
        body: [
          "Hand wash cool with a mild detergent, press out the water, and dry flat in the shade. Machine washing shortens the life of elastic considerably.",
        ],
      },
    ],
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    blurb: "The terms that apply when you shop with KAYFIY.",
    blocks: [
      {
        heading: "About these terms",
        body: [
          "By placing an order on this website you agree to the terms below. We may update them from time to time, and the version published here at the moment you order is the one that applies.",
        ],
      },
      {
        heading: "Orders and pricing",
        list: [
          "All prices are shown in Pakistani Rupees and include applicable taxes.",
          "An order is confirmed only once we send you a confirmation message.",
          "We may cancel an order if an item is out of stock or a price was listed in error, and will refund any amount already paid.",
        ],
      },
      {
        heading: "Product information",
        body: [
          "We make every effort to display fabric colors accurately, but display settings vary. Product measurements are given with a 0.5-inch tolerance.",
        ],
      },
    ],
  },
  {
    slug: "about",
    title: "About Us",
    blurb: "Comfort wear designed and fit-tested for Pakistani women, delivered nationwide.",
    blocks: [
      {
        heading: "Our story",
        body: [
          "KAYFIY started with a simple frustration: most everyday bras and comfort wear sold here weren't designed or fit-tested for the women wearing them. We set out to fix that — soft, breathable fabrics, true-to-size cuts from 30A to 44DD, and prices that don't punish you for wanting something that actually fits.",
        ],
      },
      {
        heading: "What we stand for",
        list: [
          "Fit first — every style is tested across real bodies before it goes on sale.",
          "Honest pricing — no inflated 'compare at' prices, discounts are real.",
          "Discreet, respectful service — from packaging to how we talk about our products.",
          "Nationwide reach — cash on delivery so anyone, anywhere in Pakistan, can shop with confidence.",
        ],
      },
      {
        heading: "Where we're headed",
        body: [
          "We're a small, growing team based in Pakistan. Every order and every message helps us stock better sizes and fabrics — write to us any time, we read everything.",
        ],
      },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    blurb: "How KAYFIY collects, uses and protects your information.",
    blocks: [
      {
        heading: "Information we collect",
        list: [
          "Contact and delivery details you give us at checkout or when creating an account — name, phone, email and address.",
          "Order history and preferences linked to your account, if you create one.",
          "Basic technical data (device, browser) used only to keep the site working and secure.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To process and deliver your orders, respond to your messages, and — only if you opt in — send you occasional offers and new-arrival updates. We never sell your information to third parties.",
        ],
      },
      {
        heading: "Payment information",
        body: [
          "We do not store card details. Cash-on-delivery orders are paid to the courier; bank and wallet transfers are confirmed manually and no payment credentials pass through our servers.",
        ],
      },
      {
        heading: "Your choices",
        list: [
          "You can request a copy of your data or ask us to delete your account at any time by emailing hello@kayfiy.pk.",
          "You can unsubscribe from marketing messages at any time via the link in any email or by messaging us directly.",
        ],
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    blurb: "Our policy on returns, exchanges and refunds.",
    blocks: [
      {
        heading: "7-day exchange window",
        body: [
          "You may request an exchange within 7 days of receiving your order. Items must be unworn, unwashed and in their original packaging with all tags attached.",
        ],
      },
      {
        heading: "Hygiene exceptions",
        body: [
          "For hygiene reasons, briefs, adhesive accessories and opened sanitary pad boxes cannot be returned or exchanged unless they arrive defective.",
        ],
      },
      {
        heading: "How refunds are paid",
        body: [
          "Prepaid orders are refunded to the original payment method. Cash-on-delivery orders are refunded by bank transfer or JazzCash/EasyPaisa. Refunds are issued within 5 working days of us receiving and inspecting the return.",
        ],
      },
      {
        heading: "Delivery charges",
        body: [
          "Delivery charges are refunded only when the return is because of a fault on our side. Otherwise the original delivery charge is not refunded.",
        ],
      },
    ],
  },
];

export const staticPageSlugs = staticPages.map((page) => page.slug);

export const getStaticPage = (slug: string) =>
  staticPages.find((page) => page.slug === slug);

export const SIZE_TABLE = {
  head: ["KAYFIY size", "Underbust (in)", "Bust (in)", "Waist (in)", "Hip (in)"],
  rows: [
    ["S / 32B", "27–29", "33–35", "25–27", "35–37"],
    ["M / 34B–34C", "29–31", "35–37", "27–29", "37–39"],
    ["L / 36C", "31–33", "37–39", "29–32", "39–42"],
    ["XL / 38C–38D", "33–35", "39–42", "32–35", "42–45"],
    ["XXL / 40D–42D", "35–38", "42–45", "35–38", "45–48"],
  ],
};
