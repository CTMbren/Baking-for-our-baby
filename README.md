# Baking for Our Baby

A simple order page for our baking fundraiser. Hosted free on GitHub Pages. Orders go into a Google Sheet and are emailed to us. No payments are taken on the site.

## What's in here

| File | What it does |
|---|---|
| `menu.js` | **The only file you normally edit.** Menu items, prices, text, pickup options. |
| `images/` | Photos of the baked goods (see below). |
| `index.html`, `app.js`, `style.css` | The page itself. |
| `apps-script/Code.gs` | The Google script that records and emails orders. |

## Setup (about 15 minutes)

### 1. Turn on GitHub Pages
Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
After a minute your site is live at `https://ctmbren.github.io/Baking-for-our-baby/`.

### 2. Create the order sheet and script
1. Go to [sheets.new](https://sheets.new) and name the sheet "Baking for Our Baby orders".
2. **Extensions → Apps Script**. Delete the default code and paste in everything from `apps-script/Code.gs`.
3. Change `NOTIFY_EMAIL` at the top to your email address. Save.

### 3. Publish the script and connect it to the page
1. In Apps Script: **Deploy → New deployment**, type **Web app**.
2. *Execute as:* **Me**. *Who has access:* **Anyone**. Click **Deploy**.
3. Approve the permissions. Google shows an "unverified app" warning because it's your own script: **Advanced → Go to (project) → Allow**.
4. Copy the **Web app URL** and paste it into `menu.js` as `orderEndpoint`.

> If you change `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the change goes live. The URL stays the same.

### 4. Test
Open your site, place a test order, and check that it shows up in the sheet and your inbox (check spam the first time and mark "not spam"). Then delete the test row.

## Changing the menu or prices
Open `menu.js` on GitHub, click the pencil icon, edit, and commit. The site updates in about a minute.

## Adding photos
1. Resize photos to roughly 1000 px wide (phone photos are several MB and make the page slow).
2. Name them to match `menu.js`: `chocolate-chip-cookies.jpg`, `banana-bread.jpg`, `brownies.jpg`.
3. Upload into the `images/` folder (**Add file → Upload files**). Until a photo exists, an emoji placeholder is shown.

To add a new treat, copy one block in `MENU` inside `menu.js`, give it a unique `id`, and add its photo.

## Tracking orders
Each order is a row in the sheet. Use the **Status** column (New, Confirmed, Baked, Picked up, Paid) to keep track.
