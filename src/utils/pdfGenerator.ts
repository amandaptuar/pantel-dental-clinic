import jsPDF from 'jspdf';
import { Prescription, Invoice, ConsentForm, Patient } from '../types';
import { CLINIC_INFO } from '../data/mockData';

export const PDFGenerator = {
  // 1. Generate Prescription PDF
  generatePrescriptionPDF(prescription: Prescription, patient?: Patient) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header Banner
    doc.setFillColor(14, 116, 144); // Primary Teal/Cyan #0e7490
    doc.rect(0, 0, pageWidth, 28, 'F');

    // Clinic Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(CLINIC_INFO.name.toUpperCase(), 14, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`${CLINIC_INFO.tagline} | Phone: ${CLINIC_INFO.phone}`, 14, 18);
    doc.text(`${CLINIC_INFO.address}`, 14, 23);

    // Doctor info & Date
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Consultant: ${prescription.doctorName}`, 14, 36);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${prescription.date}`, pageWidth - 45, 36);

    // Patient Details Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 40, pageWidth - 28, 22, 2, 2, 'FD');

    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Patient Name: ${prescription.patientName}`, 18, 47);
    doc.text(`Age / Gender: ${prescription.patientAge} Yrs / ${prescription.patientGender}`, 18, 54);
    if (patient) {
      doc.text(`Patient ID: ${patient.uniqueId}`, 110, 47);
      doc.text(`Phone: ${patient.phone}`, 110, 54);
      if (patient.allergies && patient.allergies !== 'None') {
        doc.setTextColor(220, 38, 38);
        doc.text(`Allergies: ${patient.allergies}`, 18, 60);
        doc.setTextColor(51, 65, 85);
      }
    }

    // Diagnosis
    doc.setFont('helvetica', 'bold');
    doc.text(`Diagnosis: ${prescription.diagnosis}`, 14, 69);
    doc.setLineWidth(0.3);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 71, pageWidth - 14, 71);

    // Rx Symbol
    doc.setFontSize(22);
    doc.setTextColor(14, 116, 144);
    doc.text('Rx', 14, 82);

    // Medicine Table Header
    let y = 88;
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, pageWidth - 28, 8, 'F');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('#', 17, y + 5.5);
    doc.text('Medicine & Strength', 25, y + 5.5);
    doc.text('Frequency', 105, y + 5.5);
    doc.text('Duration', 140, y + 5.5);
    doc.text('Instructions', 165, y + 5.5);

    y += 10;
    doc.setFont('helvetica', 'normal');
    prescription.items.forEach((item, index) => {
      doc.setTextColor(71, 85, 105);
      doc.text(`${index + 1}`, 17, y);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${item.medicineName}`, 25, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`${item.frequency}`, 105, y);
      doc.text(`${item.duration}`, 140, y);
      doc.text(`${item.instruction}`, 165, y);

      // Marathi Sub-line
      if (item.frequencyMarathi || item.instructionMarathi) {
        y += 4.5;
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`(मराठी: ${item.frequencyMarathi || ''} - ${item.instructionMarathi || ''})`, 25, y);
        doc.setFontSize(9);
      }

      y += 6;
      doc.setDrawColor(241, 245, 249);
      doc.line(14, y, pageWidth - 14, y);
      y += 4;
    });

    // Special Instructions
    if (prescription.specialInstructions) {
      y += 6;
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'F');
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(146, 64, 14);
      doc.text('Advice / Special Instructions:', 18, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.text(prescription.specialInstructions, 18, y + 10);
      if (prescription.specialInstructionsMarathi) {
        doc.text(`सूचना: ${prescription.specialInstructionsMarathi}`, 18, y + 14);
      }
      y += 20;
    }

    // Footer & Signature
    const bottomY = doc.internal.pageSize.getHeight() - 32;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Doctor Signature / Stamp:', pageWidth - 65, bottomY);
    doc.line(pageWidth - 65, bottomY + 14, pageWidth - 14, bottomY + 14);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`${prescription.doctorName}`, pageWidth - 65, bottomY + 18);
    doc.text(CLINIC_INFO.regNo, pageWidth - 65, bottomY + 22);

    // Disclaimer
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.text('Valid for 15 days from date of issue. Please consult before substituting any medicines.', 14, bottomY + 22);

    doc.save(`Prescription_${prescription.patientName.replace(/\s+/g, '_')}_${prescription.date}.pdf`);
  },

  // 2. Generate Invoice PDF
  generateInvoicePDF(invoice: Invoice, patient?: Patient) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Top Header Banner
    doc.setFillColor(15, 118, 110); // Secondary Teal #0f766e
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(CLINIC_INFO.name.toUpperCase(), 14, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`TAX INVOICE / RECEIPT | Phone: ${CLINIC_INFO.phone}`, 14, 18);
    doc.text(CLINIC_INFO.address, 14, 23);

    // Invoice Meta
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`INVOICE: ${invoice.invoiceNumber}`, 14, 36);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${invoice.date}`, pageWidth - 45, 36);

    // Patient Info Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 40, pageWidth - 28, 20, 2, 2, 'FD');

    doc.setTextColor(51, 65, 85);
    doc.text(`Billed To: ${invoice.patientName}`, 18, 47);
    doc.text(`Contact: ${invoice.patientPhone}`, 18, 54);
    if (patient) {
      doc.text(`Patient ID: ${patient.uniqueId}`, 110, 47);
      doc.text(`Address: ${patient.address || 'Maharashtra'}`, 110, 54);
    }

    // Line Items Header
    let y = 68;
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, pageWidth - 28, 8, 'F');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('#', 17, y + 5.5);
    doc.text('Treatment / Procedure Description', 25, y + 5.5);
    doc.text('Tooth #', 140, y + 5.5);
    doc.text('Amount (INR)', pageWidth - 35, y + 5.5);

    y += 12;
    doc.setFont('helvetica', 'normal');
    invoice.items.forEach((item, idx) => {
      doc.setTextColor(71, 85, 105);
      doc.text(`${idx + 1}`, 17, y);
      doc.setTextColor(15, 23, 42);
      doc.text(`${item.description}`, 25, y);
      doc.setTextColor(71, 85, 105);
      doc.text(item.toothNumber ? `#${item.toothNumber}` : '-', 140, y);
      doc.setFont('helvetica', 'bold');
      doc.text(`Rs. ${item.cost.toLocaleString('en-IN')}`, pageWidth - 35, y);
      doc.setFont('helvetica', 'normal');

      y += 8;
      doc.setDrawColor(241, 245, 249);
      doc.line(14, y - 2, pageWidth - 14, y - 2);
    });

    // Summary Box
    y += 4;
    const summaryX = pageWidth - 80;
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('Subtotal:', summaryX, y);
    doc.text(`Rs. ${invoice.subtotal.toLocaleString('en-IN')}`, pageWidth - 20, y, { align: 'right' });

    if (invoice.discount > 0) {
      y += 6;
      doc.setTextColor(22, 163, 74);
      doc.text('Discount:', summaryX, y);
      doc.text(`- Rs. ${invoice.discount.toLocaleString('en-IN')}`, pageWidth - 20, y, { align: 'right' });
    }

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Grand Total:', summaryX, y);
    doc.text(`Rs. ${invoice.grandTotal.toLocaleString('en-IN')}`, pageWidth - 20, y, { align: 'right' });

    y += 6;
    doc.setTextColor(2, 132, 199);
    doc.text('Amount Paid:', summaryX, y);
    doc.text(`Rs. ${invoice.amountPaid.toLocaleString('en-IN')}`, pageWidth - 20, y, { align: 'right' });

    y += 6;
    doc.setTextColor(invoice.balanceDue > 0 ? 220 : 22, invoice.balanceDue > 0 ? 38 : 163, invoice.balanceDue > 0 ? 38 : 74);
    doc.text('Balance Due:', summaryX, y);
    doc.text(`Rs. ${invoice.balanceDue.toLocaleString('en-IN')}`, pageWidth - 20, y, { align: 'right' });

    // Payment History Box
    if (invoice.payments && invoice.payments.length > 0) {
      y += 12;
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Receipt History:', 14, y);
      y += 4;

      invoice.payments.forEach(p => {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`• ${p.date} - Rs. ${p.amount.toLocaleString('en-IN')} via ${p.paymentMode} (Rcpt: ${p.receiptNumber}) ${p.notes ? `[${p.notes}]` : ''}`, 16, y + 2);
        y += 5;
      });
    }

    // Payment UPI Details
    y += 8;
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'F');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 118, 110);
    doc.setFont('helvetica', 'bold');
    doc.text('UPI / Digital Payment Details:', 18, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(`GPay / PhonePe / Paytm: +91 95796 49009 | UPI ID: 9579649009@upi`, 18, y + 11);

    // Footer Signature
    const bottomY = doc.internal.pageSize.getHeight() - 25;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Authorized Signatory:', pageWidth - 60, bottomY);
    doc.line(pageWidth - 60, bottomY + 10, pageWidth - 14, bottomY + 10);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Patil Dental Clinic Accounts', pageWidth - 60, bottomY + 14);

    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  },

  // 3. Generate Consent Form PDF with Signature & Biometric Verification
  generateConsentPDF(consent: ConsentForm, patient?: Patient) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(14, 116, 144);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(CLINIC_INFO.name.toUpperCase(), 14, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`PATIENT INFORMED CONSENT & BIOMETRIC RECORD | Phone: ${CLINIC_INFO.phone}`, 14, 18);
    doc.text(CLINIC_INFO.address, 14, 23);

    // Meta
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Treatment: ${consent.treatmentType}`, 14, 36);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${consent.date}`, pageWidth - 45, 36);

    // Patient Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 40, pageWidth - 28, 18, 2, 2, 'FD');

    doc.setTextColor(51, 65, 85);
    doc.text(`Patient Name: ${consent.patientName}`, 18, 47);
    if (patient) {
      doc.text(`Patient ID: ${patient.uniqueId}`, 110, 47);
      doc.text(`Phone: ${patient.phone}`, 18, 53);
      doc.text(`Doctor: ${consent.doctorName}`, 110, 53);
    }

    // Consent Text
    let y = 66;
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Consent Agreement (${consent.language} Version):`, 14, y);
    y += 5;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(consent.contentSummary, pageWidth - 28);
    doc.text(splitSummary, 14, y);
    y += splitSummary.length * 5 + 6;

    // Biometric & Signature Verification Section
    doc.setDrawColor(148, 163, 184);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, pageWidth - 28, 45, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('VERIFICATION & AUTHENTICATION', 18, y + 7);

    // Left: Biometric Fingerprint Box
    doc.rect(20, y + 12, 45, 25);
    if (consent.fingerprintScanned) {
      doc.setFillColor(220, 252, 231);
      doc.rect(20, y + 12, 45, 25, 'F');
      doc.setTextColor(22, 101, 52);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('USB BIOMETRIC VERIFIED', 22, y + 20);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(`Scan ID: ${consent.fingerprintId || 'USB-SCAN-OK'}`, 22, y + 26);
      doc.text(`Time: ${consent.fingerprintTimestamp ? new Date(consent.fingerprintTimestamp).toLocaleTimeString() : 'Verified'}`, 22, y + 31);
    } else {
      doc.setTextColor(148, 163, 184);
      doc.text('No Biometric Scan', 24, y + 24);
    }

    // Right: Signature Box
    doc.rect(pageWidth - 75, y + 12, 55, 25);
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7.5);
    doc.text('Patient / Guardian Signature', pageWidth - 70, y + 16);

    if (consent.patientSignature) {
      try {
        doc.addImage(consent.patientSignature, 'PNG', pageWidth - 73, y + 18, 50, 16);
      } catch (e) {
        doc.text('Signed Digitally', pageWidth - 60, y + 26);
      }
    }

    y += 52;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Witness / Assistant: ${consent.witnessName || 'Clinic Staff'}`, 14, y);
    doc.text(`Treating Dentist: ${consent.doctorName}`, pageWidth - 75, y);

    doc.save(`Consent_${consent.treatmentType.replace(/\s+/g, '_')}_${consent.patientName.replace(/\s+/g, '_')}.pdf`);
  }
};
