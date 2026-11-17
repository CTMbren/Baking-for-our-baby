/**
 * Receives orders from the website, saves them to this Google Sheet,
 * emails you a notification, and emails the customer a copy.
 *
 * SETUP: change NOTIFY_EMAIL below, then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone). See README.md.
 */

const NOTIFY_EMAIL = "you@example.com"; // <-- put YOUR email here
const SEND_CUSTOMER_COPY = true;        // set to false to skip the customer email
const SHEET_NAME = "Orders";
const CURRENCY = "$";
const SIGN_OFF = "Brendan & family"; // <-- how you want to sign the customer email

function doPost(e) {
  const p = e.parameter || {};

  // Spam trap: bots fill in the hidden "website" field, people don't.
  if (p.website) return ok_();

  const name = clean_(p.name), email = clean_(p.email);
  if (!name || !email) return ok_();

  let items = [];
  try { items = JSON.parse(p.items || "[]"); } catch (err) { return ok_(); }
  if (!items.length || items.length > 20) return ok_();

  const lines = items.map(function (i) {
    return Math.min(Number(i.qty) || 0, 20) + " x " + clean_(i.name) + " @ " + CURRENCY + Number(i.price).toFixed(2);
  });
  const total = items.reduce(function (s, i) {
    return s + (Math.min(Number(i.qty) || 0, 20) * (Number(i.price) || 0));
  }, 0);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet_();
    const orderNo = "BFB-" + String(sheet.getLastRow()).padStart(3, "0"); // header row = 1
    sheet.appendRow([
      new Date(), orderNo, name, email, clean_(p.phone), clean_(p.pickup),
      lines.join("\n"), total, clean_(p.notes), "New"
    ]);

    const summary =
      "Order " + orderNo + "\n\n" +
      "Name: " + name + "\nEmail: " + email + "\nPhone: " + clean_(p.phone) + "\n" +
      "Pickup/delivery: " + clean_(p.pickup) + "\n\n" +
      "Items:\n" + lines.join("\n") + "\n\n" +
      "Total: " + CURRENCY + total.toFixed(2) + "\n\n" +
      "Notes: " + clean_(p.notes) + "\n";

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: "New bake order " + orderNo + " from " + name,
      body: summary,
    });

    if (SEND_CUSTOMER_COPY) {
      MailApp.sendEmail({
        to: email,
        replyTo: NOTIFY_EMAIL,
        subject: "Your Baking for Our Baby order (" + orderNo + ")",
        body:
          "Hi " + name + ",\n\nThank you so much for your order! Here's what we received:\n\n" +
          lines.join("\n") + "\n\nTotal: " + CURRENCY + total.toFixed(2) + "\n\n" +
          "We'll be in touch soon to confirm pickup/delivery and how to pay. " +
          "Just reply to this email if you have any questions.\n\nWith gratitude,\n" + SIGN_OFF + "\n",
      });
    }
  } finally {
    lock.releaseLock();
  }
  return ok_();
}

// Visiting the web app URL in a browser just shows this message.
function doGet() {
  return ContentService.createTextOutput("Order system is running.");
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Received", "Order #", "Name", "Email", "Phone", "Pickup/Delivery", "Items", "Total", "Notes", "Status"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Trim, cap length, and neutralise spreadsheet formulas.
function clean_(v) {
  let s = String(v == null ? "" : v).trim().slice(0, 500);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function ok_() {
  return ContentService.createTextOutput("ok");
}
