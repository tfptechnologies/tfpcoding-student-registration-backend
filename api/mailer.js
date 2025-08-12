import nodemailer from "nodemailer";

const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_SECURE = process.env.MAIL_SECURE;
const MAIL_USER_NAME = process.env.MAIL_USER_NAME;
const MAIL_USER_PASS = process.env.MAIL_USER_PASS;
const MAIL_EMAIL = process.env.MAIL_EMAIL;

function generateSolt(slot) {
  const slotHtml = `<div class="product-item">
                <div class="product-info">
                  <div class="product-name">Starting Time : ${
                    slot.startTime
                  }</div>
                  <div class="product-details">Ending Time: ${
                    slot.endTime
                  }</div>
                  <div class="product-details">Price</div>
                </div>
                <div class="product-price">₹ ${slot.price.toFixed(2)}</div>
              </div>`;

  return slotHtml;
}

function generateMail({
  slots,
  amountPaid,
  name,
  bookingDate,
  bookingId,
  paymentDate,
  paymentId,
}) {
  let slotsHtml = ``;

  slots.forEach((slot) => {
    slotsHtml = slotsHtml + generateSolt(slot);
  });

  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Order Confirmation - Sun Sport Arena</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
  
        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          color: #333;
          line-height: 1.5;
        }
  
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          min-height: 100vh;
        }
  
        /* Header */
        .header {
          background-color: white;
          padding: 15px 20px;
          border-bottom: 1px solid #e0e0e0;
        }
  
        .logo {
          color: #f47f2e;
          font-size: 32px;
          font-weight: bold;
          text-align: center;
        }
  
        .nav {
          text-align: center;
          margin-top: 15px;
        }
  
        .nav a {
          color: #888;
          text-decoration: none;
          margin: 0 15px;
          font-size: 14px;
        }
  
        .nav a:hover {
          color: #f47f2e;
        }
  
        /* Main Content */
        .main-content {
          padding: 40px 20px;
        }
  
        .confirmation-header {
          text-align: center;
          margin-bottom: 30px;
        }
  
        .confirmation-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
  
        .confirmation-subtitle {
          color: #666;
          margin-bottom: 5px;
        }
  
        .seller-link {
          color: #f47f2e;
          text-decoration: none;
        }
  
        .seller-link:hover {
          text-decoration: underline;
        }
  
        /* Progress Bar */
        .progress-container {
          margin: 40px 0;
          position: relative;
        }
  
        .progress-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          margin-bottom: 20px;
        }
  
        .progress-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #e0e0e0;
          z-index: 1;
        }
  
        .progress-step {
          background-color: white;
          border: 3px solid #333;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          z-index: 2;
          position: relative;
        }
  
        .progress-step.completed {
          background-color: #333;
        }
  
        .progress-step.current {
          border-color: #666;
          background-color: white;
        }
  
        .progress-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }
  
        .progress-label {
          text-align: center;
          font-size: 12px;
          color: #666;
          flex: 1;
        }
  
        .view-order-btn {
          display: block;
          background-color: #333;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 25px;
          font-size: 14px;
          margin: 30px auto;
          cursor: pointer;
          text-decoration: none;
          width: fit-content;
        }
  
        .view-order-btn:hover {
          background-color: #555;
        }
  
        .delivery-note,
        .contact-links {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-bottom: 10px;
        }
  
        .contact-links a {
          color: #d4831c;
          text-decoration: none;
        }
  
        /* Order Details */
        .order-details {
          margin-top: 40px;
        }
  
        .order-details h2 {
          font-size: 20px;
          margin-bottom: 20px;
          text-align: center;
        }
  
        .confirmation-number {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
        }
  
        .confirmation-number a {
          color: #d4831c;
          text-decoration: none;
        }
  
        .product-list {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          padding: 20px 0;
        }
  
        /* Product card */
        .product-item {
          background-color: #fff;
          border: 2px solid #eee;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1 1 calc(50% - 20px);
          /* 2-column layout on wider screens */
          box-sizing: border-box;
        }
  
        /* Image container (optional if using) */
        .product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
        }
  
        /* Info block */
        .product-info {
          flex: 1;
          min-width: 200px;
          display: flex;
          flex-direction: column;
        }
  
        /* Price styling */
        .product-price {
          font-weight: bold;
          font-size: 16px;
          color: #333;
          margin-left: auto;
          align-self: flex-end;
          margin-top: auto;
        }
  
        /* Responsive design */
        @media (max-width: 768px) {
          /* .product-item {
      flex: 1 1 100%;
    } */
          .product-info {
            text-align: left;
          }
        }
  
        @media (max-width: 600px) {
          .product-item {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }
  
          .product-info {
            text-align: left;
          }
  
          .product-price {
            margin: 10px 0 0;
            font-size: 15px;
            align-self: flex-end;
          }
  
          .product-image {
            margin-bottom: 10px;
          }
        }
  
        /* Info Grid */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 30px;
        }
  
        .info-section h3 {
          font-size: 16px;
          margin-bottom: 15px;
        }
  
        .address,
        .payment-info {
          color: #666;
          font-size: 14px;
        }
  
        .payment-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
  
        .total-row {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          font-size: 18px;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
          margin-top: 10px;
        }
  
        /* Personal Detail Section */
        .personal-detail {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
  
        .info-item {
          background-color: #ffffff;
          display: flex;
          gap: 10px;
        }
  
        .info-item h2 {
          font-size: 16px;
          margin: 0;
          font-weight: 600;
        }
  
        .info-item p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #555;
        }
  
        /* Carbon Offset */
        .carbon-offset {
          text-align: center;
          margin: 30px 0;
          font-size: 12px;
          color: #666;
        }
  
        .carbon-offset::before {
          content: "🌱";
          margin-right: 5px;
        }
  
        /* Shop Info */
        .shop-info {
          margin-top: 40px;
          text-align: center;
        }
  
        .shop-info h2 {
          font-size: 20px;
          margin-bottom: 30px;
        }
  
        .shop-profile {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
        }
  
        .shop-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #f0f0f0;
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23f0f0f0"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20" fill="%23999">👤</text></svg>');
          background-size: cover;
        }
  
        .shop-details h3 {
          font-size: 16px;
          margin-bottom: 5px;
        }
  
        .shop-details p {
          color: #666;
          font-size: 14px;
          margin-bottom: 10px;
        }
  
        .stars-rating {
          color: #ffd700;
          font-size: 16px;
        }
  
        .help-btn {
          background-color: #333;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 25px;
          font-size: 14px;
          cursor: pointer;
          margin-top: 20px;
        }
  
        .help-btn:hover {
          background-color: #555;
        }
  
        /* Responsive */
        @media (max-width: 768px) {
          .main-content {
            padding: 20px 15px;
          }
  
          .nav a {
            margin: 0 8px;
            font-size: 12px;
          }
  
          .confirmation-title {
            font-size: 20px;
          }
  
          .info-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
  
          .product-item {
            flex-direction: column;
            text-align: center;
          }
  
          .product-image {
            margin-right: 0;
            margin-bottom: 15px;
          }
  
          .shop-profile {
            flex-direction: column;
          }
  
          .progress-labels {
            font-size: 10px;
          }
        }
  
        @media (max-width: 480px) {
          .header {
            padding: 10px 15px;
          }
  
          .logo {
            font-size: 28px;
          }
  
          .nav a {
            margin: 0 5px;
            font-size: 11px;
          }
  
          .personal-detail {
            gap: 2px;
            grid-template-columns: 1fr;
          }
  
          .confirmation-title {
            font-size: 18px;
          }
  
          .progress-labels {
            font-size: 9px;
          }
  
          .product-price {
            font-size: 16px;
          }
        }
      </style>
    </head>
  
    <body>
      <div class="container">
        <header class="header">
          <div class="logo"><img src="/download.png" alt="logo" /></div>
        </header>
  
        <main class="main-content">
          <div class="confirmation-header">
            <h1 class="confirmation-title">Woohoo! Your order is confirmed.</h1>
          </div>
  
          <section class="order-details">
            <h2>Order details</h2>
  
            <div class="personal-detail">
              <div class="personal-detail-1">
                <div class="info-item">
                  <h2>Name:</h2>
                  <p>${name}</p>
                </div>
                <div class="info-item">
                  <h2>Booking Date:</h2>
                  <p>${bookingDate.toISOString().split("T")[0]}</p>
                </div>
                <div class="info-item">
                  <h2>Booking Id:</h2>
                  <p>${bookingId}</p>
                </div>
              </div>
  
              <div class="personal-detail-2">
                <div class="info-item">
                  <h2>Payment Date :</h2>
                  <p>${paymentDate.toLocaleString()}</p>
                </div>
                <div class="info-item">
                  <h2>Payment ID:</h2>
                  <p>${paymentId}</p>
                </div>
              </div>
            </div>
  
            <div class="product-list">
              ${slotsHtml}
            </div>
            <div class="total-row">
              <span>Total</span>
              <span>₹ ${amountPaid.toFixed(2)}</span>
            </div>
          </section>
        </main>
      </div>
    </body>
  </html>
  `;

  return html;
}

export async function sendMail({ to, data }) {
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: MAIL_SECURE === "true",
    auth: {
      user: MAIL_USER_NAME,
      pass: MAIL_USER_PASS,
    },
  });

  await transporter.sendMail({
    from: `"sun spots arena" <${MAIL_EMAIL}>`,
    to,
    subject: "Booking Confirmed",
    html: generateMail(data),
  });
}
