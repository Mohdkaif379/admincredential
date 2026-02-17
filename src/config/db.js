const mysql = require("mysql2");
require("dotenv").config();

function getConnectionConfig() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);

    const config = {
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ""),
      timezone: "+05:30",
      dateStrings: true,
      multipleStatements: true
    };

    const useSsl =
      process.env.DB_SSL === "true" || url.hostname.includes("aivencloud.com");

    if (useSsl) {
      config.ssl = {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true"
      };
    }

    return config;
  }

  return {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timezone: "+05:30",
    dateStrings: true,
    multipleStatements: true
  };
}

const db = mysql.createConnection(getConnectionConfig());

const syncDatabase = async () => {
  const fs = require('fs');
  const path = require('path');
  const dbDir = path.join(__dirname, '../../database');

  console.log("first sync all table");

  try {
    const files = fs.readdirSync(dbDir).filter(file => file.endsWith('.sql')).sort();
    console.log("Found SQL files:", files);

    for (const file of files) {
      const filePath = path.join(dbDir, file);
      // Strip BOM and whitespace
      const sql = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trim();

      if (!sql) continue;

      try {
        console.log(`Executing ${file}...`);
        // console.log(`SQL Content: ${sql.substring(0, 50)}...`); 
        await db.promise().query(sql);
        // console.log(`Executed: ${file}`);
      } catch (err) {
        // Ignore specific errors:
        // 1050: Table already exists
        // 1051: Unknown table (DROP)
        // 1054: Unknown column (ALTER)
        // 1060: Duplicate column name
        // 1061: Duplicate key name
        // 1091: Can't DROP 'x'; check that column/key exists
        const ignoredErrors = [1050, 1051, 1054, 1060, 1061, 1091];
        // console.log(`Debug: errno type: ${typeof err.errno}, value: ${err.errno}`);
        if (ignoredErrors.includes(Number(err.errno))) {
          // console.log(`Skipping ${file}: ${err.message}`);
        } else {
          console.error(`Error executing ${file}:`, err);
        }
      }
    }
    // console.log("All tables synced successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

db.connect((err) => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    // Enable multiple statements for the connection to run scripts
    db.config.multipleStatements = true;

    syncDatabase().then(() => {
      console.log("MySQL Connected...");
    });
  }
});

module.exports = db;
