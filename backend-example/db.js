const { Pool } = require("pg");

const pool = new Pool({
	connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
	// Fallback to local config if no connection string
	user: process.env.POSTGRES_URL || process.env.DATABASE_URL ? undefined : process.env.DB_USER || "hariprasadsanjel",
	host: process.env.POSTGRES_URL || process.env.DATABASE_URL ? undefined : process.env.DB_HOST || "localhost",
	database: process.env.POSTGRES_URL || process.env.DATABASE_URL ? undefined : process.env.DB_NAME || "portfolio_db",
	password: process.env.POSTGRES_URL || process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD || "",
	port: process.env.POSTGRES_URL || process.env.DATABASE_URL ? undefined : process.env.DB_PORT || 5432,
});

// Test connection
pool.on("connect", () => {
	console.log("✓ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
	console.error("PostgreSQL error:", err);
});

module.exports = pool;
