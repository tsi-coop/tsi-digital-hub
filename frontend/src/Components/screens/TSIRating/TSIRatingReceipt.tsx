import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import colors from '../../../assets/styles/colors';
import { pdflogo } from '../../../assets';

// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 10 },
  logo: { width: 60, height: 60, marginBottom: 5, alignSelf: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  subtext: { fontSize: 10, marginBottom: 2 },
  section: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  label: { fontWeight: '500', fontSize: 10 },
  textBlock: { marginBottom: 4 }, // Uniform spacing
  signature: { marginTop: 30, fontSize: 10 },
  note: { marginTop: 10, fontSize: 9 },
});

// Component
const TSIRatingReceipt = ({ data, name }: { data: any, name: any }) => {
  return (
    <Document>
      <Page
        size="A4"
        style={{
          ...styles.page,
          color: colors.graniteGrey,
          paddingTop: 20,
        }}
      >
        {/* Header */}
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingTop: 20,
            paddingBottom: 20,
            borderBottom: '1px solid #000',
          }}
        >
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              gap: '5px',
              alignItems: 'flex-start',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                marginBottom: 5,
                textAlign: 'center',
                paddingTop: 20,
              }}
            >
              {name}
            </Text>

          </View>


          <Image
            src={pdflogo}
            style={{ width: 120, height: 45 }}
          />
        </View>

        {/* Summary Info */}
        <View style={{ ...styles.section, gap: '10px', marginTop: '10px' }}>
          <Text style={[styles.label, styles.textBlock]}>
            <Text style={{ fontWeight: 'bold' }}>Report Date:</Text>{' '}
            {data.report_date || "N/A"}
          </Text>
          <Text style={[styles.label, styles.textBlock]}>
            <Text style={{ fontWeight: 'bold' }}>Organisation Name:</Text>{' '}
            {data.org_name || "N/A"}
          </Text>

          <Text style={[styles.label, styles.textBlock]}>
            <Text style={{ fontWeight: 'bold' }}>Title:</Text>{' '}
            {data.title || "N/A"}
          </Text>
          <Text style={[styles.label, styles.textBlock]}>
            <Text style={{ fontWeight: 'bold' }}>Rating Summary:</Text>{' '}
            {data.rating_summary}
          </Text>
          <Text style={[styles.label, styles.textBlock]}>
            <Text style={{ fontWeight: 'bold' }}>Overall Score:</Text>{' '}
            {data.score}
          </Text>
          <Text style={[styles.label, styles.textBlock]}>
            <Text style={{ fontWeight: 'bold' }}>Description:</Text>{' '}
            {data.description}
          </Text>
          <Text style={[styles.label, styles.textBlock]}>
            <Text style={{ fontWeight: 'bold' }}>Characteristics:</Text>{' '}
            {data.characteristics}
          </Text>
        </View>

        {/* Areas for Improvement */}
        <View style={styles.section}>
          <Text style={[styles.label, styles.textBlock, { fontWeight: 'bold' }]}>
            Areas For Improvement:
          </Text>
          {data?.areas_for_improvement?.map((item: string, index: number) => (
            <Text key={index} style={[styles.label, styles.textBlock]}>
              • {item}
            </Text>
          ))}
        </View>

        {/* Strengths */}
        <View style={styles.section}>
          <Text style={[styles.label, styles.textBlock, { fontWeight: 'bold' }]}>
            Strengths:
          </Text>
          {data?.strengths?.map((item: string, index: number) => (
            <Text key={index} style={[styles.label, styles.textBlock]}>
              • {item}
            </Text>
          ))}
        </View>

        {/* Recommendation */}
        {data.recommendation && (
          <View style={styles.section}>
            <Text style={[styles.label, styles.textBlock, { fontWeight: 'bold' }]}>
              Recommendation:
            </Text>
            <Text style={[styles.label, styles.textBlock]}>
              {data.recommendation}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.label, styles.textBlock, { fontWeight: 'bold' }]}>
            Benchmark:
          </Text>
          <Text style={[styles.label, styles.textBlock]}>
            Benchmark Against Peers (TSI Index)
            <Text style={{ color: colors.red, marginLeft: 25, fontSize: 8 }}> Coming soon</Text>
          </Text>

        </View>
      </Page>
    </Document>
  );
};

export default TSIRatingReceipt;
