# Blog API Backend

This is a simple Node.js/Express backend for managing blog posts for your portfolio.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend-example
npm install
```

### 2. Run the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 3. Update Frontend Configuration

In your `script.js` file, update the API URL:

```javascript
const BLOG_API_URL = "http://localhost:3000/api/blogs";
```

## API Endpoints

### Get All Blogs

- **URL**: `/api/blogs`
- **Method**: `GET`
- **Response**: Array of blog objects

### Get Single Blog

- **URL**: `/api/blogs/:id`
- **Method**: `GET`
- **Response**: Single blog object

### Create New Blog

- **URL**: `/api/blogs`
- **Method**: `POST`
- **Body**:

```json
{
	"title": "Blog Title",
	"excerpt": "Brief description...",
	"image": "./images/blog.jpg",
	"link": "#",
	"author": "Author Name",
	"tags": ["tag1", "tag2"]
}
```

### Update Blog

- **URL**: `/api/blogs/:id`
- **Method**: `PUT`
- **Body**: Updated blog fields

### Delete Blog

- **URL**: `/api/blogs/:id`
- **Method**: `DELETE`
- **Response**: Success message

## Blog Object Structure

```json
{
	"id": 1,
	"title": "Blog Title",
	"excerpt": "Brief description of the blog post",
	"image": "./images/blog-image.jpg",
	"link": "#",
	"date": "2024-01-15",
	"author": "Hari Prasad Sanjel",
	"tags": ["tag1", "tag2", "tag3"]
}
```

## Production Deployment

For production, consider:

1. **Database**: Use MongoDB, PostgreSQL, or another database instead of in-memory storage
2. **Authentication**: Add JWT authentication for admin routes
3. **Validation**: Implement request validation
4. **Environment Variables**: Use dotenv for configuration
5. **Hosting**: Deploy to services like Heroku, Railway, or Vercel

## Alternative: Using a CMS

Instead of building a custom backend, you can use:

- **Contentful** - Headless CMS
- **Strapi** - Open-source headless CMS
- **Sanity.io** - Structured content platform
- **WordPress REST API** - If you prefer WordPress
