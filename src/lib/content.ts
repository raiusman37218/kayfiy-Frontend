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
          "WhatsApp: +92 300 0000000, 10am–7pm Monday to Saturday",
          "Email: hello@lisset.pk",
          "Instagram and Facebook: @lisset.pk",
        ],
      },
      {
        heading: "Wholesale and stockists",
        body: [
          "If you run a boutique or pharmacy and would like to stock Lisset, write to wholesale@lisset.pk with your shop name and city. We send the current line sheet and minimum order details the same week.",
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
        heading: "Signs the fit is wrong",
        list: [
          "The band rides up your back — go one band size down.",
          "The centre panel does not sit flat on your chest — go one cup up.",
          "Cups gape at the top edge — go one cup down or try a padded style.",
          "Straps dig in — the band, not the straps, should carry the weight.",
        ],
      },
      {
        heading: "Making it last",
        body: [
          "Hand wash in cool water with a mild detergent, press the water out rather than wringing, and dry flat away from direct sun. Rotate between at least three bras so the elastic has a day to recover between wears.",
        ],
      },
    ],
  },
  {
    slug: "shipping-and-return",
    title: "Shipping & Return",
    blurb: "Nationwide delivery, and a straightforward exchange window.",
    blocks: [
      {
        heading: "Delivery",
        list: [
          "Orders are packed Monday to Saturday, excluding public holidays.",
          "Karachi, Lahore and Islamabad: 2–3 working days.",
          "Rest of Pakistan: 3–5 working days.",
          "Flat delivery charge of Rs. 199, free on orders over Rs. 3,500.",
          "Cash on delivery is available everywhere our courier reaches.",
        ],
      },
      {
        heading: "Returns and exchanges",
        list: [
          "You have 7 days from delivery to request an exchange or return.",
          "Items must be unworn, unwashed and have their tags and hygiene seal intact.",
          "For hygiene reasons panties, sanitary pads and nursing pads cannot be returned once opened.",
          "Sale items can be exchanged for a different size, but are not refundable.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          "Message us on WhatsApp with your order number and a photo of the item. We arrange a courier pickup where the service is available, or share a drop-off address. Once the item reaches us and passes inspection, the exchange ships within two working days.",
        ],
      },
    ],
  },
  {
    slug: "size-guide",
    title: "Size Guide",
    blurb: "How Lisset sizing maps to your measurements.",
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
          "Yes, across Pakistan wherever our courier delivers. You pay the rider when the parcel arrives.",
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
          "Every order ships in a plain opaque bag with no product images and only Lisset in small print on the label.",
        ],
      },
      {
        heading: "Do you restock sold-out sizes?",
        body: [
          "Core styles are restocked every few weeks. Message us on WhatsApp with the style and size and we will tell you when it lands.",
        ],
      },
      {
        heading: "How should I wash my Lisset pieces?",
        body: [
          "Hand wash cool with a mild detergent, press out the water, and dry flat in the shade. Machine washing shortens the life of elastic considerably.",
        ],
      },
    ],
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    blurb: "The terms that apply when you shop with Lisset.",
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
          "We describe colours, fabrics and measurements as accurately as we can. Screen colours vary, and hand-finished items can differ slightly from the photographs.",
        ],
      },
      {
        heading: "Your account",
        body: [
          "You are responsible for keeping your account details accurate and your password private. Tell us straight away if you think someone else has used your account.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of Pakistan, and any dispute will be handled by the courts of Karachi.",
        ],
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    blurb: "When a refund applies and how long it takes.",
    blocks: [
      {
        heading: "When you can request a refund",
        list: [
          "The item arrived damaged, faulty or is not what you ordered.",
          "The item is unworn and unwashed with tags and hygiene seal intact, returned within 7 days of delivery.",
        ],
      },
      {
        heading: "What cannot be refunded",
        list: [
          "Panties, sanitary pads and nursing pads once the hygiene seal is opened.",
          "Sale items — these can be exchanged for a different size instead.",
          "Items returned after the 7-day window, or without tags.",
        ],
      },
      {
        heading: "How refunds are paid",
        body: [
          "Prepaid orders are refunded to the original payment method. Cash-on-delivery orders are refunded by bank transfer or JazzCash to an account in the name on the order. Refunds are issued within 5 working days of us receiving and inspecting the return, and your bank may take a few days more to show it.",
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
  head: ["Lisset size", "Underbust (in)", "Bust (in)", "Waist (in)", "Hip (in)"],
  rows: [
    ["S / 32B", "27–29", "33–35", "25–27", "35–37"],
    ["M / 34B–34C", "29–31", "35–37", "27–29", "37–39"],
    ["L / 36C", "31–33", "37–39", "29–32", "39–42"],
    ["XL / 38C–38D", "33–35", "39–42", "32–35", "42–45"],
    ["XXL / 40D–42D", "35–38", "42–45", "35–38", "45–48"],
  ],
};
