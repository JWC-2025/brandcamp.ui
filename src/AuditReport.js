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
    padding: 48,
    fontFamily: 'Helvetica',
  },
  // Cover page
  coverPage: {
    backgroundColor: COLORS.dark,
    padding: 48,
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverHeader: {
    marginBottom: 48,
  },
  brandLabel: {
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
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
  },
  coverBody: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 48,
  },
  websiteLabel: {
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  websiteName: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  websiteUrl: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 40,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 40,
  },
  overallScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  overallScoreBox: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  overallScoreNumber: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  overallScoreLabel: {
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  overallScoreSubtext: {
    fontSize: 13,
    color: COLORS.white,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryTile: {
    width: '47%',
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
    color: COLORS.white,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 20,
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
  pageHeaderLeft: {},
  categoryTag: {
    fontSize: 10,
    color: COLORS.purple,
    letterSpacing: 2,
    textTransform: 'uppercase',
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
    color: COLORS.white,
  },
  scoreChipLabel: {
    fontSize: 9,
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    letterSpacing: 1,
    textTransform: 'uppercase',
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
    marginTop: 1,
  },
  bulletText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 1.6,
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
  if (score >= 70) return COLORS.green;
  if (score >= 40) return COLORS.amber;
  return COLORS.red;
};

const ScoreBar = ({ score }) => (
  <View style={styles.barTrack}>
    <View
      style={[
        styles.barFill,
        { width: `${score}%`, backgroundColor: getScoreColor(score) },
      ]}
    />
  </View>
);

const CategoryPage = ({ label, score, insights, recommendations, pageNum, totalPages }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderLeft}>
        <Text style={styles.categoryTag}>Category Analysis</Text>
        <Text style={styles.categoryTitle}>{label}</Text>
      </View>
      <View style={styles.scoreChip}>
        <Text style={[styles.scoreChipNumber, { color: getScoreColor(score) }]}>{score}</Text>
        <Text style={styles.scoreChipLabel}>Score</Text>
      </View>
    </View>

    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: COLORS.blue }]} />
        <Text style={styles.sectionTitle}>Insights</Text>
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
        <Text style={styles.sectionTitle}>Recommendations</Text>
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
  const { url, overallScore, scores, insights, recommendations, timestamp } = data;
  const domain = (() => {
    try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
  })();
  const date = new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const totalPages = 1 + CATEGORIES.length;

  return (
    <Document title={`Brand Audit – ${domain}`} author="BrandCamp">
      {/* Cover page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverHeader}>
          <Text style={styles.brandLabel}>BrandCamp</Text>
          <Text style={styles.appTitle}>Brand Audit Report</Text>
          <Text style={styles.reportSubtitle}>Website analysis & recommendations</Text>
        </View>

        <View style={styles.coverBody}>
          <Text style={styles.websiteLabel}>Analysed website</Text>
          <Text style={styles.websiteName}>{domain}</Text>
          <Text style={styles.websiteUrl}>{url}</Text>

          <View style={styles.divider} />

          <View style={styles.overallScoreRow}>
            <View style={styles.overallScoreBox}>
              <Text style={styles.overallScoreNumber}>{overallScore}</Text>
            </View>
            <View>
              <Text style={styles.overallScoreLabel}>Overall Score</Text>
              <Text style={styles.overallScoreSubtext}>
                {overallScore >= 70 ? 'Strong brand presence' : overallScore >= 40 ? 'Room for improvement' : 'Needs significant work'}
              </Text>
            </View>
          </View>

          <View style={styles.categoryGrid}>
            {CATEGORIES.map(({ key, label }) => (
              <View key={key} style={styles.categoryTile}>
                <Text style={styles.categoryTileLabel}>{label}</Text>
                <View style={styles.categoryTileScoreRow}>
                  <Text style={[styles.categoryTileScore, { color: getScoreColor(scores[key]) }]}>
                    {scores[key]}
                  </Text>
                  <ScoreBar score={scores[key]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.coverFooter}>
          <Text style={styles.footerText}>Generated {date}</Text>
          <Text style={styles.footerText}>1 / {totalPages}</Text>
        </View>
      </Page>

      {/* One page per category */}
      {CATEGORIES.map(({ key, label }, i) => (
        <CategoryPage
          key={key}
          label={label}
          score={scores[key]}
          insights={insights[key] || []}
          recommendations={recommendations[key] || []}
          pageNum={i + 2}
          totalPages={totalPages}
        />
      ))}
    </Document>
  );
};

export default AuditReport;
