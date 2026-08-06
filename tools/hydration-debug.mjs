import { chromium } from "@playwright/test";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
let routeErrors = {};
page.on("console", (msg) => {
  if (msg.type() === "error") {
    errors.push(msg.text());
    const key = msg.text().includes("418") ? "REACT_418" : msg.text().slice(0, 40);
    routeErrors = { ...routeErrors, [key]: (routeErrors[key] ?? 0) + 1 };
  }
});
page.on("pageerror", (err) => {
  errors.push(String(err));
  const key = String(err).includes("418") ? "REACT_418" : String(err).slice(0, 40);
  routeErrors = { ...routeErrors, [key]: (routeErrors[key] ?? 0) + 1 };
});

const base = process.env.CA_DEBUG_BASE || "http://127.0.0.1:4173";
const routes = [
  "/",
  "/dashboard/",
  "/courses/",
  "/courses/01-intro/what-is-a-computer/",
  "/courses/02-windows/",
  "/roadmap/",
  "/skill-tree/",
  "/achievements/",
  "/stats/",
  "/settings/",
  "/wrong-answers/",
  "/notes/",
];
for (const route of routes) {
  routeErrors = {};
  await page.goto(base + route, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);
  console.log("ROUTE " + route + " -> " + JSON.stringify(routeErrors));
}
console.log("---- ERRORS ----");
console.log([...new Set(errors)].slice(0, 8).join("\n\n"));
await browser.close();
