# Prisma Setup Guide

## Files Added

- `prisma/schema.prisma` - Database schema definition
- `prisma/client.js` - Prisma Client instance
- `.env` - Environment variables (DATABASE_URL)
- `.env.example` - Example environment variables

## Commands

### Generate Prisma Client (after schema changes)

```bash
cd backend-example
npx prisma generate
```

### View Database in Prisma Studio

```bash
npx prisma studio
```

### Sync schema with database

```bash
npx prisma db push
```

### Pull database schema to Prisma

```bash
npx prisma db pull
```

## Usage Example

Replace the current `pool` queries with Prisma:

```javascript
// OLD (pg pool)
const result = await pool.query("SELECT * FROM blogs ORDER BY date DESC");
res.json(result.rows);

// NEW (Prisma)
const prisma = require("./prisma/client");
const blogs = await prisma.blog.findMany({
	orderBy: { date: "desc" },
});
res.json(blogs);
```

## Benefits

- ✅ Type-safe database queries
- ✅ Auto-completion in IDE
- ✅ Database migrations management
- ✅ Visual database browser (Prisma Studio)
- ✅ Easier to write complex queries
- ✅ Better for Vercel deployment

## Next Steps

1. Run `npx prisma studio` to view your database
2. Optionally migrate server.js to use Prisma instead of pg
3. Deploy to Vercel (Prisma works great with serverless)
