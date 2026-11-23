require("dotenv").config({ quiet: true });
const firebaseAuth = require("../src/config/firebase");

async function main() {
  const [operation, email, expectedProject] = process.argv.slice(2);
  if (!["grant", "revoke"].includes(operation) || !email || !expectedProject ||
      process.env.FIREBASE_PROJECT_ID !== expectedProject) {
    throw new Error("Usage: node scripts/admin-role.js grant|revoke EMAIL PROJECT_ID (matching FIREBASE_PROJECT_ID)");
  }
  const user = await firebaseAuth.getUserByEmail(email);
  if (operation === "grant" && (!user.emailVerified || user.disabled)) {
    throw new Error("The account must be active with a verified email.");
  }
  const { role, ...claims } = user.customClaims || {};
  await firebaseAuth.setCustomUserClaims(user.uid, operation === "grant" ? { ...claims, role: "admin" } : claims);
  if (operation === "revoke") await firebaseAuth.revokeRefreshTokens(user.uid);
  console.info(JSON.stringify({ event: "admin.role", operation, uid: user.uid, previousRole: role || "user" }));
}

main().catch((error) => {
  console.error(error.code || error.message);
  process.exitCode = 1;
});
