import jsPDF from 'jspdf';

// RGB colour helpers
const C = {
  dark:    [15,  23,  42],
  surface: [30,  41,  59],
  border:  [51,  65,  85],
  muted:   [148, 163, 184],
  light:   [203, 213, 225],
  white:   [255, 255, 255],
  purple:  [124, 58,  237],
  blue:    [37,  99,  235],
  green:   [34,  197, 94],
  amber:   [245, 158, 11],
  red:     [239, 68,  68],
};

const CATEGORIES = [
  { key: 'valueProposition',   label: 'Value Proposition' },
  { key: 'featuresAndBenefits', label: 'Features & Benefits' },
  { key: 'ctaAnalysis',        label: 'CTA Analysis' },
  { key: 'trustSignals',       label: 'Trust Signals' },
];

const W = 210;   // A4 width  (mm)
const H = 297;   // A4 height (mm)
const ML = 18;   // margin left/right
const CW = W - ML * 2; // content width

const scoreColor = (n) => {
  const s = Number(n) || 0;
  if (s >= 70) return C.green;
  if (s >= 40) return C.amber;
  return C.red;
};

const fill   = (doc, rgb) => doc.setFillColor(...rgb);
const stroke = (doc, rgb) => doc.setDrawColor(...rgb);
const text   = (doc, rgb) => doc.setTextColor(...rgb);

const bg = (doc) => { fill(doc, C.dark); doc.rect(0, 0, W, H, 'F'); };

const divider = (doc, y) => {
  stroke(doc, C.border);
  doc.setLineWidth(0.25);
  doc.line(ML, y, W - ML, y);
};

// Wrap + clip text to a max height, returns final y
const bulletList = (doc, items, startY, maxY) => {
  let y = startY;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  for (const item of items) {
    if (y >= maxY) break;
    text(doc, C.muted); doc.text('–', ML + 2, y);
    text(doc, C.light);
    const lines = doc.splitTextToSize(item, CW - 8);
    for (const line of lines) {
      if (y >= maxY) break;
      doc.text(line, ML + 7, y);
      y += 4.2;
    }
    y += 1.5;
  }
  return y;
};

const sectionHeading = (doc, label, dotColor, y) => {
  fill(doc, dotColor);
  doc.circle(ML + 1.8, y - 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  text(doc, C.white);
  doc.text(label, ML + 6, y);
  return y + 5;
};

// ─── Cover page ───────────────────────────────────────────────────────────────
const drawCover = (doc, { domain, url, overallScore, scores, date, totalPages }) => {
  bg(doc);

  // Header
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  text(doc, C.muted);  doc.text('BRANDCAMP', ML, ML + 4);
  doc.setFont('helvetica', 'bold');  doc.setFontSize(22);
  text(doc, C.white);  doc.text('Brand Audit Report', ML, ML + 13);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
  text(doc, C.muted);  doc.text('Website analysis & recommendations', ML, ML + 21);

  // Website
  let y = ML + 42;
  doc.setFontSize(8); text(doc, C.muted); doc.text('ANALYSED WEBSITE', ML, y); y += 7;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(24);
  text(doc, C.white); doc.text(domain, ML, y); y += 7;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  text(doc, C.muted); doc.text(url, ML, y); y += 10;

  divider(doc, y); y += 10;

  // Overall score
  const sc = Number(overallScore) || 0;
  fill(doc, C.purple); doc.roundedRect(ML, y, 18, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
  text(doc, C.white); doc.text(String(sc), ML + 9, y + 11, { align: 'center' });

  text(doc, C.muted); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  doc.text('OVERALL SCORE', ML + 22, y + 5);
  const lbl = sc >= 70 ? 'Strong brand presence' : sc >= 40 ? 'Room for improvement' : 'Needs significant work';
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  text(doc, C.white); doc.text(lbl, ML + 22, y + 13);
  y += 26;

  // Category tiles — 2 × 2
  const tW = (CW - 4) / 2;
  const tH = 20;
  CATEGORIES.forEach((cat, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const tx  = ML + col * (tW + 4);
    const ty  = y  + row * (tH + 4);
    const s   = Number(scores[cat.key]) || 0;
    const col2 = scoreColor(s);

    fill(doc, C.surface); doc.roundedRect(tx, ty, tW, tH, 2, 2, 'F');
    stroke(doc, C.border); doc.setLineWidth(0.2); doc.roundedRect(tx, ty, tW, tH, 2, 2, 'S');

    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
    text(doc, C.muted); doc.text(cat.label, tx + 3, ty + 6);

    doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
    text(doc, col2); doc.text(String(s), tx + 3, ty + 15);

    // Score bar
    const bx = tx + 18; const by = ty + 13; const bw = tW - 22;
    fill(doc, C.border); doc.roundedRect(bx, by, bw, 2, 0.5, 0.5, 'F');
    if (s > 0) { fill(doc, col2); doc.roundedRect(bx, by, (bw * s) / 100, 2, 0.5, 0.5, 'F'); }
  });

  // Footer
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
  text(doc, C.muted);
  doc.text(`Generated ${date}`, ML, H - 10);
  doc.text(`1 / ${totalPages}`, W - ML, H - 10, { align: 'right' });
};

// ─── Category page ────────────────────────────────────────────────────────────
const drawCategoryPage = (doc, { label, score, insights, recommendations, pageNum, totalPages }) => {
  bg(doc);
  const s = Number(score) || 0;
  const col = scoreColor(s);

  // Header
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  text(doc, C.purple); doc.text('CATEGORY ANALYSIS', ML, ML + 4);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
  text(doc, C.white); doc.text(label, ML, ML + 13);

  // Score chip
  fill(doc, C.surface); doc.roundedRect(W - ML - 20, ML - 2, 20, 17, 2, 2, 'F');
  stroke(doc, C.border); doc.setLineWidth(0.2); doc.roundedRect(W - ML - 20, ML - 2, 20, 17, 2, 2, 'S');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
  text(doc, col); doc.text(String(s), W - ML - 10, ML + 7, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
  text(doc, C.muted); doc.text('SCORE', W - ML - 10, ML + 13, { align: 'center' });

  // Divider
  let y = ML + 20;
  divider(doc, y); y += 8;

  // Insights
  y = sectionHeading(doc, 'INSIGHTS', C.blue, y);
  y = bulletList(doc, insights, y, H - 55);

  y += 4;

  // Recommendations
  if (y < H - 50) {
    y = sectionHeading(doc, 'RECOMMENDATIONS', C.purple, y);
    bulletList(doc, recommendations, y, H - 18);
  }

  // Footer
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
  text(doc, C.muted);
  doc.text(`${pageNum} / ${totalPages}`, W - ML, H - 10, { align: 'right' });
};

// ─── Public API ───────────────────────────────────────────────────────────────
export const generateAuditPDF = (data) => {
  const {
    url = '',
    overallScore = 0,
    scores = {},
    insights = {},
    recommendations = {},
    timestamp = new Date().toISOString(),
  } = data || {};

  const domain = (() => { try { return new URL(url).hostname.replace('www.', ''); } catch { return url; } })();
  const date   = new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const totalPages = 1 + CATEGORIES.length;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  drawCover(doc, { domain, url, overallScore, scores, date, totalPages });

  CATEGORIES.forEach((cat, i) => {
    doc.addPage();
    drawCategoryPage(doc, {
      label:           cat.label,
      score:           scores[cat.key],
      insights:        Array.isArray(insights[cat.key])        ? insights[cat.key]        : [],
      recommendations: Array.isArray(recommendations[cat.key]) ? recommendations[cat.key] : [],
      pageNum:         i + 2,
      totalPages,
    });
  });

  return doc;
};
