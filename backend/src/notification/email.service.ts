import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as qrcode from 'qrcode';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      const smtpHost = this.configService.get<string>('SMTP_HOST');
      const smtpPort = this.configService.get<number>('SMTP_PORT');
      const smtpSecure = this.configService.get<string>('SMTP_SECURE') === 'true';
      const smtpUser = this.configService.get<string>('SMTP_USER');
      const smtpPass = this.configService.get<string>('SMTP_PASS');

      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      this.logger.log('SMTP Transporter initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize SMTP Transporter', error);
    }
  }

  /**
   * Generate QR code as data URL
   * @param text - Text to encode in QR code (e.g., reservation ID)
   * @returns Data URL of QR code image
   */
  async generateQRCode(text: string): Promise<string> {
    try {
      const qrCodeDataUrl = await qrcode.toDataURL(text, {
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
      this.logger.error('Failed to generate QR code', error);
      throw new Error('QR Code generation failed');
    }
  }

  /**
   * Send reservation confirmation email with QR code
   * @param userEmail - User's email address
   * @param userName - User's name
   * @param stallName - Stall name
   * @param reservationId - Reservation ID (will be encoded in QR)
   * @param totalAmount - Reservation amount
   * @param reservationDate - Reservation date
   */
  async sendReservationConfirmation(
    userEmail: string,
    userName: string,
    stallName: string,
    reservationId: string,
    totalAmount: number,
    reservationDate: Date,
  ): Promise<void> {
    try {
      // Generate QR code
      const qrCodeDataUrl = await this.generateQRCode(reservationId);

      const smtpFrom = this.configService.get<string>('SMTP_FROM');
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

      const htmlContent = this.getEmailTemplate(
        userName,
        stallName,
        reservationId,
        totalAmount,
        reservationDate,
        qrCodeDataUrl,
        frontendUrl,
      );

      const mailOptions = {
        from: smtpFrom,
        to: userEmail,
        subject: `Bookfair Reservation Confirmed - ${stallName}`,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${userEmail}. Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send reservation email to ${userEmail}`, error);
      // Don't throw - log and continue (email is not critical for reservation)
    }
  }

  /**
   * Get HTML email template with QR code
   */
  private getEmailTemplate(
    userName: string,
    stallName: string,
    reservationId: string,
    totalAmount: number,
    reservationDate: Date,
    qrCodeDataUrl: string,
    frontendUrl: string,
  ): string {
    const formattedDate = new Date(reservationDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 4px;
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              margin: 20px 0;
            }
            .content p {
              margin: 10px 0;
              color: #333;
              line-height: 1.6;
            }
            .details {
              background-color: #f9f9f9;
              border-left: 4px solid #667eea;
              padding: 15px;
              margin: 15px 0;
              border-radius: 4px;
            }
            .details-row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
            }
            .details-label {
              font-weight: bold;
              color: #667eea;
            }
            .qr-code {
              text-align: center;
              margin: 30px 0;
            }
            .qr-code img {
              max-width: 300px;
              border: 2px solid #ddd;
              border-radius: 8px;
              padding: 10px;
            }
            .qr-instruction {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              color: #999;
              font-size: 12px;
              margin-top: 30px;
              border-top: 1px solid #eee;
              padding-top: 15px;
            }
            .button {
              display: inline-block;
              background-color: #667eea;
              color: white;
              padding: 12px 30px;
              border-radius: 4px;
              text-decoration: none;
              margin: 10px 0;
              font-weight: bold;
            }
            .total-amount {
              font-size: 20px;
              color: #667eea;
              font-weight: bold;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Reservation Confirmed!</h1>
            </div>

            <div class="content">
              <p>Dear <strong>${userName}</strong>,</p>
              <p>Thank you for booking with us! Your reservation has been confirmed. Please find your booking details below:</p>

              <div class="details">
                <div class="details-row">
                  <span class="details-label">Reservation ID:</span>
                  <span>${reservationId}</span>
                </div>
                <div class="details-row">
                  <span class="details-label">Stall Name:</span>
                  <span>${stallName}</span>
                </div>
                <div class="details-row">
                  <span class="details-label">Reservation Date:</span>
                  <span>${formattedDate}</span>
                </div>
              </div>

              <div class="total-amount">
                Total Amount: ₹${totalAmount.toFixed(2)}
              </div>

              <p style="color: #666; font-size: 14px;">
                Please save or take a screenshot of the QR code below. You will need to present it on the day of the event for entry:
              </p>

              <div class="qr-code">
                <img src="${qrCodeDataUrl}" alt="Reservation QR Code" />
                <p class="qr-instruction">Scan this QR code for verification</p>
              </div>

              <p>For any queries or to view your reservations, please visit:</p>
              <p style="text-align: center;">
                <a href="${frontendUrl}/dashboard" class="button">View Your Dashboard</a>
              </p>

              <p style="color: #999; font-size: 14px; margin-top: 20px;">
                If you need to cancel or modify your reservation, please log in to your dashboard and manage it from there.
              </p>
            </div>

            <div class="footer">
              <p>© Bookfair Stall Reservation System. All rights reserved.</p>
              <p>This is an automated email. Please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
