import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export interface ReservationData {
  id: string;
  stallName: string;
  size: string;
  userEmail: string;
  userName: string;
  totalAmount?: number;
  reservationDate?: string;
  genres?: string[];
}

/**
 * Generate QR code as Canvas element
 */
export const generateQRCodeCanvas = async (text: string): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Failed to generate QR code', error);
    throw new Error('QR Code generation failed');
  }
};

/**
 * Download QR code as image or PDF
 */
export const downloadQRCodeAsImage = async (
  reservationData: ReservationData,
): Promise<void> => {
  try {
    const qrCodeDataUrl = await generateQRCodeCanvas(reservationData.id);

    // Create a temporary canvas to build the pass
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    canvas.width = 600;
    canvas.height = 800;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 800);

    // Title
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BOOKFAIR STALL PASS', 300, 60);

    // Reservation ID
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText(`Reservation: ${reservationData.id}`, 300, 100);

    // Stall Details
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Stall: ${reservationData.stallName}`, 300, 150);

    ctx.font = '14px Arial';
    ctx.fillText(`Size: ${reservationData.size}`, 300, 180);

    // Load and draw QR code
    const qrImage = new Image();
    qrImage.src = qrCodeDataUrl;
    await new Promise((resolve) => {
      qrImage.onload = resolve;
    });

    const qrSize = 300;
    const qrX = (600 - qrSize) / 2;
    ctx.drawImage(qrImage, qrX, 250, qrSize, qrSize);

    // Genres
    if (reservationData.genres && reservationData.genres.length > 0) {
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Genres: ${reservationData.genres.join(', ')}`, 300, 600);
    }

    // Footer
    ctx.fillStyle = '#999';
    ctx.font = '10px Arial';
    ctx.fillText('Present this pass at entry', 300, 750);
    ctx.fillText('Bookfair Stall Reservation System', 300, 770);

    // Download as image
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `bookfair-pass-${reservationData.id}.png`;
    link.click();

    toast.success('QR Pass downloaded successfully!');
  } catch (error) {
    console.error('Failed to download QR code', error);
    toast.error('Failed to download QR Pass');
    throw error;
  }
};

/**
 * Send QR code to email via backend API
 */
export const sendQRCodeToEmail = async (
  reservationData: ReservationData,
): Promise<void> => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/reservations/${reservationData.id}/send-qr-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userEmail: reservationData.userEmail,
          userName: reservationData.userName,
          stallName: reservationData.stallName,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to send QR code to email');
    }

    toast.success('QR code sent to your email!');
  } catch (error) {
    console.error('Failed to send QR code to email', error);
    toast.error('Failed to send QR code to email');
    throw error;
  }
};

/**
 * Generate PDF with reservation details and QR code
 */
export const generateReservationPDF = async (
  reservationData: ReservationData,
): Promise<void> => {
  try {
    const qrCodeDataUrl = await generateQRCodeCanvas(reservationData.id);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(102, 126, 234); // Purple color
    pdf.text('Bookfair Stall Reservation', margin, 30);

    // Divider
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, 40, pageWidth - margin, 40);

    // Reservation Details
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    let yPosition = 55;
    const lineHeight = 10;

    pdf.text(`Reservation ID: ${reservationData.id}`, margin, yPosition);
    yPosition += lineHeight;

    pdf.text(`Name: ${reservationData.userName}`, margin, yPosition);
    yPosition += lineHeight;

    pdf.text(`Email: ${reservationData.userEmail}`, margin, yPosition);
    yPosition += lineHeight;

    pdf.text(`Stall: ${reservationData.stallName}`, margin, yPosition);
    yPosition += lineHeight;

    pdf.text(`Size: ${reservationData.size}`, margin, yPosition);
    yPosition += lineHeight;

    if (reservationData.totalAmount) {
      pdf.text(`Amount: ₹${reservationData.totalAmount.toFixed(2)}`, margin, yPosition);
      yPosition += lineHeight;
    }

    if (reservationData.genres && reservationData.genres.length > 0) {
      pdf.text(`Genres: ${reservationData.genres.join(', ')}`, margin, yPosition);
      yPosition += lineHeight;
    }

    // QR Code
    const qrSize = 80;
    const qrX = (pageWidth - qrSize) / 2;
    yPosition += 20;
    pdf.addImage(qrCodeDataUrl, 'PNG', qrX, yPosition, qrSize, qrSize);

    yPosition += qrSize + 20;

    // Instructions
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Please present this pass at the entry', margin, yPosition);
    yPosition += 7;
    pdf.text('Bookfair Stall Reservation System', margin, yPosition);

    // Download PDF
    pdf.save(`bookfair-pass-${reservationData.id}.pdf`);

    toast.success('Reservation PDF downloaded successfully!');
  } catch (error) {
    console.error('Failed to generate PDF', error);
    toast.error('Failed to generate reservation PDF');
    throw error;
  }
};
