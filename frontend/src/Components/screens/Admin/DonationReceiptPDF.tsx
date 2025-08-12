// DonationReceiptPDF.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from '@react-pdf/renderer';
import colors from '../../../assets/styles/colors';
import { pdflogo, signaturelogo } from '../../../assets';
const numberToWords = require('number-to-words');

// Replace with your actual logo path if needed (must be base64 or public URL)


// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 10 },
  logo: { width: 60, height: 60, marginBottom: 5, alignSelf: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  subtext: { fontSize: 10, marginBottom: 2 },
  section: { marginBottom: 8, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" },
  label: { fontWeight: '500', fontSize: 10, },
  signature: { marginTop: 30, fontSize: 10 },
  note: { marginTop: 10, fontSize: 9 },
});



// Component
const DonationReceiptPDF = ({ data }: { data: any }) => {

  return (
    <Document>
      <Page size="A4" style={{ ...styles.page, color: colors.graniteGrey, paddingTop: "20px" }}>
        {/* Header */}
        {/* <View style={styles.header}> */}
        <View style={{ display: "flex", justifyContent: 'space-between', flexDirection: "row", alignItems: "flex-start", paddingTop: "20px", borderBottom: '1px solid #000', }}>
          <View style={{ ...styles.section, padding: "5px", gap: '3px' }}>
            {/* Optional Logo */}

            <Text style={{ ...styles.title, fontSize: 12, fontWeight: '600' }}>TSI Tech Solutions Cooperative Foundation</Text>
            <Text style={styles.subtext}>83 Sakthi ArumLily, 10th street,</Text>
            <Text style={styles.subtext}>E R Mohan Nagar, Kalapatti,</Text>
            <Text style={styles.subtext}>Coimbatore 641048, India</Text>
            <Text style={styles.subtext}>CIN: U85500TZ2024NPL032620</Text>
            <Text style={styles.subtext}>PAN: AALCT2963P</Text>
            <Text style={styles.subtext}>80G Reg No: AALCT2963PF20241</Text>
            <Text style={styles.subtext}>Email: admin@tsicoop.org</Text>
          </View>

          <Image src={pdflogo} style={{ width: '120px', height: '45px', marginTop: '30px' }} />
        </View>
        <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 5, textAlign: "center", paddingTop: '20px' }}>DONATION RECEIPT</Text>
        {/* Receipt Info */}
        <View style={{ ...styles.section, padding: "5px", }}>

          <Text style={styles.label}><Text style={styles.label}>Receipt No.:</Text>
            {/* TSI-COOP-002 */}
            TSI-COOP-{data?.id}
          </Text>
          <Text style={styles.label}><Text style={styles.label}>Date:</Text> {new Date(data.posted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>

        {/* Donor Info */}
        <View style={{ ...styles.section, padding: "5px" }}>
          <Text style={styles.label}><Text style={styles.label}>Received from:</Text> {data.account_name}</Text>
          <Text style={styles.label}><Text style={styles.label}>Address:</Text> {data.address}</Text>
          <Text style={styles.label}><Text style={styles.label}>PAN:</Text> {data.kyc_value}</Text>
          <Text style={styles.label}><Text style={styles.label}>Email:</Text> {data.email_contact}</Text>
        </View>

        {/* Payment Info */}
        <View style={{ ...styles.section, padding: "5px" }}>
          <Text style={styles.label}>
            Amount Received (in INR): RS {data.amount.toLocaleString()}
          </Text>

          <Text style={styles.label}>
            <Text style={styles.label}>Amount in Words:</Text>
            Rupees {numberToWords.toWords(data.amount)} Only
          </Text>
          <Text style={styles.label}><Text style={styles.label}>Payment Mode:</Text> {data.payment_mode}</Text>
          <Text style={styles.label}><Text style={styles.label}>Transaction Details:</Text> {data?.transaction_details}</Text>
          <Text style={styles.label}><Text style={styles.label}>Date of Payment:</Text> {data.payment_date}</Text>
          <Text style={styles.label}><Text style={styles.label}>Purpose of Payment:</Text> Donation</Text>
          <Text style={styles.label}><Text style={styles.label}>Category:</Text> {data.donation_type}</Text>
        </View>

        {/* Footer */}
        <View style={{ ...styles.signature, padding: "5px", }}>
          <Text>For TSI Tech Solutions Cooperative Foundation</Text>
          <Text>(A Section 8 Company)</Text>
          <Image src={signaturelogo} style={{ width: '60px', height: '60px', marginLeft: '10px' }} />
          <Text style={{ marginTop: 8 }}>Authorised Signatory</Text>
          <Text>Name: Satish Ayyaswami</Text>
          <Text>Designation: Director</Text>
        </View>

        <Text style={{ ...styles.note, padding: "5px", }}>
          Note: This is a system-generated receipt and does not require a physical signature. This donation is eligible
          for tax benefits under 80G of Income Tax Act. Please keep this receipt for your records.
        </Text>
      </Page>
    </Document>
  );
};

export default DonationReceiptPDF;
