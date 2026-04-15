import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const COLORS = {
  purple: '#7C3AED',
  blue: '#2563EB',
  dark: '#0F172A',
  surface: '#1E293B',
  border: '#334155',
  muted: '#94A3B8',
  white: '#FFFFFF',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const CATEGORIES = [
  { key: 'valueProposition', label: 'Value Proposition' },
  { key: 'featuresAndBenefits', label: 'Features & Benefits' },
  { key: 'ctaAnalysis', label: 'CTA Analysis' },
  { key: 'trustSignals', label: 'Trust Signals' },
];

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.dark,
    paddingTop: 48,
    paddingBottom: 64,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
  },
  coverPage: {
    backgroundColor: COLORS.dark,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
  },
  brandLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 48,
  },
  websiteLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 12,
  },
  websiteName: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  websiteUrl: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 36,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 36,
  },
  overallScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 36,
  },
  overallScoreBox: {
    width: 72,
    height: 72,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    borderRadius: 8,
  },
  overallScoreNumber: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  overallScoreLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 4,
  },
  overallScoreSubtext: {
    fontSize: 13,
    color: COLORS.white,
  },
  // Category tiles — two per row using margins instead of gap
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryTileLeft: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: '4%',
  },
  categoryTileRight: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryTileLabel: {
    fontSize: 10,
    color: COLORS.muted,
    marginBottom: 8,
  },
  categoryTileScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTileScore: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginRight: 10,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  coverFooter: {
    position: 'absolute',
    bottom: 48,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  footerText: {
    fontSize: 10,
    color: COLORS.muted,
  },
  // Category pages
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryTag: {
    fontSize: 10,
    color: COLORS.purple,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  scoreChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  scoreChipNumber: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
  },
  scoreChipLabel: {
    fontSize: 9,
    color: COLORS.muted,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 4,
  },
  bulletDash: {
    fontSize: 11,
    color: COLORS.muted,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 11,
    color: '#CBD5E1',
    flex: 1,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 32,
    right: 48,
    fontSize: 10,
    color: COLORS.muted,
  },
});

const getScoreColor = (score) => {
  const n = Number(score) || 0;
  if (n >= 70) return COLORS.green;
  if (n >= 40) return COLORS.amber;
  return COLORS.red;
};

const ScoreBar = ({ score }) => {
  const n = Math.max(0, Math.min(100, Number(score) || 0));
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${n}%`, backgroundColor: getScoreColor(n) }]} />
    </View>
  );
};

const CategoryTile = ({ label, score, tileStyle }) => (
  <View style={tileStyle}>
    <Text style={styles.categoryTileLabel}>{label}</Text>
    <View style={styles.categoryTileScoreRow}>
      <Text style={[styles.categoryTileScore, { color: getScoreColor(score) }]}>{score}</Text>
      <ScoreBar score={score} />
    </View>
  </View>
);

const CategoryPage = ({ label, score, insights, recommendations, pageNum, totalPages }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.pageHeader}>
      <View>
        <Text style={styles.categoryTag}>CATEGORY ANALYSIS</Text>
        <Text style={styles.categoryTitle}>{label}</Text>
      </View>
      <View style={styles.scoreChip}>
        <Text style={[styles.scoreChipNumber, { color: getScoreColor(score) }]}>{score}</Text>
        <Text style={styles.scoreChipLabel}>SCORE</Text>
      </View>
    </View>

    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: COLORS.blue }]} />
        <Text style={styles.sectionTitle}>INSIGHTS</Text>
      </View>
      {insights.map((insight, i) => (
        <View key={i} style={styles.bullet}>
          <Text style={styles.bulletDash}>–</Text>
          <Text style={styles.bulletText}>{insight}</Text>
        </View>
      ))}
    </View>

    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: COLORS.purple }]} />
        <Text style={styles.sectionTitle}>RECOMMENDATIONS</Text>
      </View>
      {recommendations.map((rec, i) => (
        <View key={i} style={styles.bullet}>
          <Text style={styles.bulletDash}>–</Text>
          <Text style={styles.bulletText}>{rec}</Text>
        </View>
      ))}
    </View>

    <Text style={styles.pageNumber}>{pageNum} / {totalPages}</Text>
  </Page>
);

const AuditReport = ({ data }) => {
  const {
    url = '',
    overallScore = 0,
    scores = {},
    insights = {},
    recommendations = {},
    timestamp = new Date().toISOString(),
  } = data || {};

  const domain = (() => {
    try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
  })();

  const date = new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const totalPages = 1 + CATEGORIES.length;

  const topRow = CATEGORIES.slice(0, 2);
  const bottomRow = CATEGORIES.slice(2, 4);

  const scoreLabel = overallScore >= 70
    ? 'Strong brand presence'
    : overallScore >= 40
    ? 'Room for improvement'
    : 'Needs significant work';

  return (
    <Document title={`Brand Audit – ${domain}`} author="BrandCamp">
      {/* Cover page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.brandLabel}>BRANDCAMP</Text>
        <Text style={styles.appTitle}>Brand Audit Report</Text>
        <Text style={styles.reportSubtitle}>Website analysis & recommendations</Text>

        <Text style={styles.websiteLabel}>ANALYSED WEBSITE</Text>
        <Text style={styles.websiteName}>{domain}</Text>
        <Text style={styles.websiteUrl}>{url}</Text>

        <View style={styles.divider} />

        <View style={styles.overallScoreRow}>
          <View style={styles.overallScoreBox}>
            <Text style={styles.overallScoreNumber}>{overallScore}</Text>
          </View>
          <View>
            <Text style={styles.overallScoreLabel}>OVERALL SCORE</Text>
            <Text style={styles.overallScoreSubtext}>{scoreLabel}</Text>
          </View>
        </View>

        <View style={styles.categoryRow}>
          <CategoryTile label={topRow[0].label} score={scores[topRow[0].key]} tileStyle={styles.categoryTileLeft} />
          <CategoryTile label={topRow[1].label} score={scores[topRow[1].key]} tileStyle={styles.categoryTileRight} />
        </View>
        <View style={styles.categoryRow}>
          <CategoryTile label={bottomRow[0].label} score={scores[bottomRow[0].key]} tileStyle={styles.categoryTileLeft} />
          <CategoryTile label={bottomRow[1].label} score={scores[bottomRow[1].key]} tileStyle={styles.categoryTileRight} />
        </View>

        <View style={styles.coverFooter}>
          <Text style={styles.footerText}>Generated {date}</Text>
          <Text style={styles.footerText}>1 / {totalPages}</Text>
        </View>
      </Page>

      {CATEGORIES.map(({ key, label }, i) => (
        <CategoryPage
          key={key}
          label={label}
          score={Number(scores[key]) || 0}
          insights={Array.isArray(insights[key]) ? insights[key] : []}
          recommendations={Array.isArray(recommendations[key]) ? recommendations[key] : []}
          pageNum={i + 2}
          totalPages={totalPages}
        />
      ))}
    </Document>
  );
};

export default AuditReport;
