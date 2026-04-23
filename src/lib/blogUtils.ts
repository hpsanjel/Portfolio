// Utility functions for blog system

// Calculate estimated reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const plainText = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  const wordCount = plainText.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format date for archive
export function formatDateForArchive(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });
}

// Get related posts based on categories and tags
export function getRelatedPosts(currentPost: any, allPosts: any[], limit: number = 3): any[] {
  if (!allPosts || allPosts.length === 0) return [];
  
  // Filter out current post
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);
  
  // Score posts based on matching categories and tags
  const scoredPosts = otherPosts.map(post => {
    let score = 0;
    
    // Category matches (higher weight)
    if (currentPost.categories && post.categories) {
      const commonCategories = currentPost.categories.filter((cat: string) => 
        post.categories.includes(cat)
      );
      score += commonCategories.length * 3;
    }
    
    // Tag matches (lower weight)
    if (currentPost.tags && post.tags) {
      const commonTags = currentPost.tags.filter((tag: string) => 
        post.tags.includes(tag)
      );
      score += commonTags.length;
    }
    
    return { ...post, score };
  });
  
  // Sort by score (descending) and take top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...post }) => post);
}

// Generate blog excerpt
export function generateExcerpt(content: string, maxLength: number = 150): string {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
}

// Validate blog data
export function validateBlogData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!data.content || data.content.trim().length === 0) {
    errors.push('Content is required');
  }
  
  if (!data.image || data.image.trim().length === 0) {
    errors.push('Image URL is required');
  }
  
  if (!data.date || data.date.trim().length === 0) {
    errors.push('Date is required');
  }
  
  // Validate categories array
  if (data.categories && !Array.isArray(data.categories)) {
    errors.push('Categories must be an array');
  }
  
  // Validate tags array
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  }
  
  // Validate status
  if (data.status && !['draft', 'published'].includes(data.status)) {
    errors.push('Status must be either "draft" or "published"');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
