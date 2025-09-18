import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2'
});

Font.register({
  family: 'Roboto-Bold',
  src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.woff2'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FFA500',
  },
  logo: {
    width: 60,
    height: 40,
  },
  companyInfo: {
    flex: 1,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#B40000',
    marginBottom: 5,
  },
  companySubtitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: '#0050A0',
  },
  invoiceTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333333',
  },
  customerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  customerInfo: {
    width: '45%',
  },
  invoiceInfo: {
    width: '45%',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    marginBottom: 8,
    color: '#333333',
    borderBottomWidth: 1,
    borderBottomColor: '#FFA500',
    paddingBottom: 3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontFamily: 'Roboto-Bold',
    width: 80,
  },
  infoValue: {
    flex: 1,
  },
  itemsTable: {
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableHeader: {
    backgroundColor: '#F0F0F0',
    fontFamily: 'Roboto-Bold',
  },
  tableCell: {
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 10,
  },
  tableCellCenter: {
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 10,
    textAlign: 'center',
  },
  tableCellRight: {
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 10,
    textAlign: 'right',
  },
  itemCell: {
    flex: 2,
  },
  qtyCell: {
    flex: 0.5,
  },
  priceCell: {
    flex: 0.8,
  },
  totalCell: {
    flex: 0.8,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  totalTable: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  totalLabel: {
    flex: 1,
    fontFamily: 'Roboto-Bold',
  },
  totalValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Roboto-Bold',
  },
  grandTotalRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderTopWidth: 2,
    borderTopColor: '#FFA500',
  },
  grandTotalLabel: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  grandTotalValue: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 9,
    color: '#666666',
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    paddingTop: 10,
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
  },
  signatureBox: {
    width: '45%',
    textAlign: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 5,
    height: 20,
  },
  signatureText: {
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
  },
});

const InvoicePDF = ({ invoiceData }) => {
  const {
    invoiceNumber = 'INV-2025-001',
    date = new Date().toLocaleDateString('en-GB'),
    customer = {
      name: 'Sample Customer',
      address: '123 Main Street, City, State 12345',
      email: 'customer@example.com',
      phone: '+1-234-567-8900'
    },
    items = [
      { description: 'Concrete Cube Testing', qty: 3, price: 500.00 },
      { description: 'Material Analysis', qty: 1, price: 750.00 },
      { description: 'Quality Inspection', qty: 2, price: 300.00 }
    ],
    taxRate = 0.18,
    notes = 'Payment due within 30 days of invoice date.'
  } = invoiceData;

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/logo.png" />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>VITRAG ASSOCIATES LLP</Text>
            <Text style={styles.companySubtitle}>(Construction Material Testing Laboratory)</Text>
          </View>
        </View>

        {/* Invoice Title */}
        <Text style={styles.invoiceTitle}>INVOICE</Text>

        {/* Customer and Invoice Information */}
        <View style={styles.customerSection}>
          <View style={styles.customerInfo}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{customer.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>{customer.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{customer.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{customer.phone}</Text>
            </View>
          </View>

          <View style={styles.invoiceInfo}>
            <Text style={styles.sectionTitle}>Invoice Details:</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Invoice #:</Text>
              <Text style={styles.infoValue}>{invoiceNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Due Date:</Text>
              <Text style={styles.infoValue}>
                {new Date(new Date(date.split('/').reverse().join('-')).getTime() + 30 * 24 * 60 * 60 * 1000)
                  .toLocaleDateString('en-GB')}
              </Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.itemsTable}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.itemCell]}>Item Description</Text>
              <Text style={[styles.tableCellCenter, styles.qtyCell]}>Qty</Text>
              <Text style={[styles.tableCellRight, styles.priceCell]}>Unit Price</Text>
              <Text style={[styles.tableCellRight, styles.totalCell]}>Total</Text>
            </View>
            {items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.itemCell]}>{item.description}</Text>
                <Text style={[styles.tableCellCenter, styles.qtyCell]}>{item.qty}</Text>
                <Text style={[styles.tableCellRight, styles.priceCell]}>₹{item.price.toFixed(2)}</Text>
                <Text style={[styles.tableCellRight, styles.totalCell]}>₹{(item.qty * item.price).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalTable}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({(taxRate * 100).toFixed(0)}%):</Text>
              <Text style={styles.totalValue}>₹{tax.toFixed(2)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total:</Text>
              <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {notes && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Notes:</Text>
            <Text style={{ fontSize: 10, marginTop: 5 }}>{notes}</Text>
          </View>
        )}

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureText}>Authorized Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureText}>Customer Signature</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          System generated document | 34A/26 West, New Pachha Peth, Ashok Chowk, Solapur | 
          Mob. No.-9552529235, 8830263787, E-mail: vitragassociates3@gmail.com
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
