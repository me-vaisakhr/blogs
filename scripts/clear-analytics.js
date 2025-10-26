// Script to clear all analytics data from the database
const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      value = value.replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

async function clearAnalytics() {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error('❌ POSTGRES_URL not found in .env.local');
    process.exit(1);
  }

  const sql = postgres(connectionString, {
    max: 1,
  });

  try {
    console.log('🗑️  Clearing analytics data...\n');

    // Delete from reading_analytics
    const readingResult = await sql`DELETE FROM reading_analytics`;
    console.log(`✅ Deleted ${readingResult.count} reading_analytics records`);

    // Delete from views
    const viewsResult = await sql`DELETE FROM views`;
    console.log(`✅ Deleted ${viewsResult.count} views records`);

    // Delete from feedback
    const feedbackResult = await sql`DELETE FROM feedback`;
    console.log(`✅ Deleted ${feedbackResult.count} feedback records`);

    console.log('\n✨ All analytics data cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

clearAnalytics();
