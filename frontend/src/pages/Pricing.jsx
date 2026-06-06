export default function Pricing({ navigate }) {
  const tiers = [
    {
      name: "Free",
      price: "0",
      desc: "Everything you need for personal use.",
      features: [
        "Unlimited conversions",
        "All formats supported",
        "No signup required",
        "Markdown live preview",
        "Conversion history",
      ],
      highlighted: true,
      cta: "Start Converting",
      ctaAction: () => navigate("convert"),
    },
    {
      name: "Pro",
      price: "9",
      desc: "For power users and teams.",
      features: [
        "Everything in Free",
        "API access",
        "Batch file upload",
        "Priority speed",
        "Priority support",
      ],
      highlighted: false,
      comingSoon: true,
      cta: "Coming Soon",
    },
    {
      name: "Team",
      price: "29",
      desc: "For organizations and workflows.",
      features: [
        "Everything in Pro",
        "Team sharing",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated support",
      ],
      highlighted: false,
      comingSoon: true,
      cta: "Coming Soon",
    },
  ];

  const faq = [
    {
      q: "Do I need to create an account?",
      a: "No, just upload and convert. Markify is free and requires no signup.",
    },
    {
      q: "Is my data stored?",
      a: "No, files are deleted immediately after conversion. Your history is stored locally in your browser for the current session.",
    },
    {
      q: "What formats are supported?",
      a: "PDF, PPTX, DOCX, XLSX, HTML, TXT, CSV, JSON and more via Microsoft's MarkItDown engine.",
    },
    {
      q: "Can I use this for commercial projects?",
      a: "Yes, Markify is free for personal and commercial use.",
    },
  ];

  return (
    <div className="pricing-page page">
      <div className="page-header">
        <h1>Pricing</h1>
        <p>Simple, transparent pricing. No hidden fees.</p>
      </div>
      <div className="pricing-body">
        <div className="pricing-grid">
          {tiers.map((tier) => (
            <div
              className={`pricing-card ${tier.highlighted ? "highlighted" : ""}`}
              key={tier.name}
            >
              {tier.highlighted && (
                <div className="pricing-badge">Recommended</div>
              )}
              <div className="pricing-card-name">{tier.name}</div>
              <div className="pricing-price">
                ${tier.price}
                <span>/mo</span>
              </div>
              <div className="pricing-desc">{tier.desc}</div>
              {tier.comingSoon && (
                <div className="pricing-coming">Coming soon</div>
              )}
              <ul className="pricing-features">
                {tier.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <button
                className={tier.highlighted ? "btn-primary" : "action-btn"}
                style={
                  tier.highlighted
                    ? {}
                    : { width: "100%", textAlign: "center", padding: "12px" }
                }
                onClick={tier.ctaAction}
                disabled={tier.comingSoon}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="faq-section">
          <div className="faq-title">Frequently Asked Questions</div>
          <div className="faq-list">
            {faq.map((item, i) => (
              <div className="faq-item" key={i}>
                <div className="faq-q">{item.q}</div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
