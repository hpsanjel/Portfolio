"use client";
import { useState, useEffect } from "react";

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: string[];
  likeCount: number;
  replies?: Comment[];
}

interface CommentsProps {
  blogSlug: string;
}

export default function Comments({ blogSlug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: ''
  });
  const [errors, setErrors] = useState({
    author: '',
    email: '',
    content: ''
  });
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [likeLoading, setLikeLoading] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments?blogSlug=${blogSlug}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [blogSlug]);

  const validateForm = () => {
    const newErrors = {
      author: '',
      email: '',
      content: ''
    };

    if (!formData.author.trim()) {
      newErrors.author = 'Name is required';
    }
    if (formData.author.length > 100) {
      newErrors.author = 'Name must be 100 characters or less';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Comment is required';
    }
    if (formData.content.length < 10) {
      newErrors.content = 'Comment must be at least 10 characters';
    }
    if (formData.content.length > 2000) {
      newErrors.content = 'Comment must be 2000 characters or less';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const onSubmitComment = async () => {
    // Validate form
    const newErrors = {
      author: '',
      email: '',
      content: ''
    };

    if (!formData.author.trim()) {
      newErrors.author = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Comment is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Comment must be at least 10 characters';
    }

    setErrors(newErrors);

    if (newErrors.author || newErrors.email || newErrors.content) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogSlug,
          author: formData.author,
          email: formData.email,
          content: formData.content,
          parentId: replyingTo?.id || null
        })
      });

      if (res.ok) {
        // Clear form and reset reply state
        setFormData({ author: '', email: '', content: '' });
        setReplyingTo(null);
        
        // Fetch comments to update the list
        const response = await fetch(`/api/comments?blogSlug=${blogSlug}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
        
        alert(replyingTo ? 'Reply submitted successfully! It will be visible after approval.' : 'Comment submitted successfully! It will be visible after approval.');
      } else {
        const errorData = await res.json();
        alert(`Failed to submit ${replyingTo ? 'reply' : 'comment'}: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert(`Failed to submit ${replyingTo ? 'reply' : 'comment'}. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async (commentId: string) => {
    if (likeLoading.has(commentId)) return;
    
    const userIdentifier = formData.email || 'anonymous'; // Use email or fallback to anonymous
    
    setLikeLoading(prev => new Set(prev).add(commentId));
    
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdentifier })
      });

      if (res.ok) {
        const result = await res.json();
        // Update the comment in the state (handle both parent comments and replies)
        setComments(prev => prev.map(comment => {
          if (comment._id === commentId) {
            // Update parent comment
            return { ...comment, likeCount: result.likeCount, likes: [...comment.likes, userIdentifier] };
          } else if (comment.replies) {
            // Check if this is a reply
            const updatedReplies = comment.replies.map(reply => 
              reply._id === commentId 
                ? { ...reply, likeCount: result.likeCount, likes: [...reply.likes, userIdentifier] }
                : reply
            );
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        }));
        setLikedComments(prev => new Set(prev).add(commentId));
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setLikeLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleUnlike = async (commentId: string) => {
    if (likeLoading.has(commentId)) return;
    
    const userIdentifier = formData.email || 'anonymous';
    
    setLikeLoading(prev => new Set(prev).add(commentId));
    
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdentifier })
      });

      if (res.ok) {
        const result = await res.json();
        // Update the comment in the state (handle both parent comments and replies)
        setComments(prev => prev.map(comment => {
          if (comment._id === commentId) {
            // Update parent comment
            return { ...comment, likeCount: result.likeCount, likes: comment.likes.filter(id => id !== userIdentifier) };
          } else if (comment.replies) {
            // Check if this is a reply
            const updatedReplies = comment.replies.map(reply => 
              reply._id === commentId 
                ? { ...reply, likeCount: result.likeCount, likes: reply.likes.filter(id => id !== userIdentifier) }
                : reply
            );
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        }));
        setLikedComments(prev => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error unliking comment:', error);
    } finally {
      setLikeLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  // Initialize liked comments based on current user
  useEffect(() => {
    const userIdentifier = formData.email || 'anonymous';
    const liked = new Set<string>();
    
    comments.forEach(comment => {
      if (comment.likes.includes(userIdentifier)) {
        liked.add(comment._id);
      }
      // Also check replies
      if (comment.replies) {
        comment.replies.forEach(reply => {
          if (reply.likes.includes(userIdentifier)) {
            liked.add(reply._id);
          }
        });
      }
    });
    
    setLikedComments(liked);
  }, [comments, formData.email]);

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Comments</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      
      {/* Comment Form */}
      <div id="comment-form" className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {replyingTo ? `Replying to @${replyingTo.author}` : 'Leave a Comment'}
        </h4>
        
        {replyingTo && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Replying to <span className="font-semibold">@{replyingTo.author}</span>
              </p>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmitComment(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                type="text"
                id="author"
                className={`w-full px-3 py-2 border ${errors.author ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                placeholder="Your name"
                maxLength={100}
              />
              {errors.author && (
                <p className="text-red-600 text-sm mt-1">{errors.author}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                type="email"
                id="email"
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              id="content"
              rows={4}
              className={`w-full px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none`}
              placeholder="Share your thoughts..."
              maxLength={2000}
              minLength={10}
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span>{errors.content || '10-2000 characters'}</span>
              <span>{2000 - formData.content.length} characters remaining</span>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {submitting ? (replyingTo ? 'Replying...' : 'Submitting...') : (replyingTo ? 'Post Reply' : 'Post Comment')}
          </button>
        </form>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          * Your comment will be visible after approval. Please be respectful and constructive.
        </p>
      </div>

         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {comment.author}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                {comment.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Like Button and Reply Button */}
              <div className="mt-4 flex items-center gap-4">
                {/* Like Button */}
                <button
                  onClick={() => likedComments.has(comment._id) ? handleUnlike(comment._id) : handleLike(comment._id)}
                  disabled={likeLoading.has(comment._id)}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    likedComments.has(comment._id) 
                      ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300' 
                      : 'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <svg 
                    className="w-4 h-4" 
                    fill={likedComments.has(comment._id) ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  <span>
                    {likeLoading.has(comment._id) ? '...' : comment.likeCount || 0}
                  </span>
                </button>
                
                {/* Reply Button */}
                <button
                  onClick={() => {
                    setReplyingTo({ id: comment._id, author: comment.author });
                    // Scroll to form with offset for navbar - mobile and desktop compatible
                    const formElement = document.getElementById('comment-form');
                    if (formElement) {
                      // Use different navbar heights for mobile vs desktop
                      const isMobile = window.innerWidth <= 768;
                      const navbarHeight = isMobile ? 70 : 90; // Smaller navbar on mobile
                      
                      // Get the element's position
                      const elementPosition = formElement.getBoundingClientRect().top + window.pageYOffset;
                      const offsetPosition = elementPosition - navbarHeight;
                      
                      // Ensure we don't scroll past the top
                      const finalScrollPosition = Math.max(0, offsetPosition);
                      
                      // Use setTimeout to ensure DOM is updated before scrolling
                      setTimeout(() => {
                        window.scrollTo({
                          top: finalScrollPosition,
                          behavior: 'smooth'
                        });
                      }, 100);
                    }
                  }}
                  disabled={replyingTo?.id === comment._id}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reply
                </button>
              </div>
              
              {/* Display Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-3 ml-8 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}
                  </div>
                  {comment.replies.map((reply: any) => (
                    <div key={reply._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                            {reply.author}
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(reply.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                        {reply.content.split('\n').map((paragraph: any, index: number) => (
                          <p key={index} className="mb-2 text-sm">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      
                      {/* Like Button and Reply Button for Replies */}
                      <div className="mt-2 flex items-center gap-3">
                        {/* Like Button */}
                        <button
                          onClick={() => likedComments.has(reply._id) ? handleUnlike(reply._id) : handleLike(reply._id)}
                          disabled={likeLoading.has(reply._id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            likedComments.has(reply._id) 
                              ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300' 
                              : 'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <svg 
                            className="w-3 h-3" 
                            fill={likedComments.has(reply._id) ? 'currentColor' : 'none'} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                            />
                          </svg>
                          <span>
                            {likeLoading.has(reply._id) ? '...' : reply.likeCount || 0}
                          </span>
                        </button>
                        
                        {/* Reply to Reply Button */}
                        <button
                          onClick={() => {
                            setReplyingTo({ id: reply._id, author: reply.author });
                            // Scroll to form with offset for navbar - mobile and desktop compatible
                            const formElement = document.getElementById('comment-form');
                            if (formElement) {
                              // Use different navbar heights for mobile vs desktop
                              const isMobile = window.innerWidth <= 768;
                              const navbarHeight = isMobile ? 70 : 90; // Smaller navbar on mobile
                              
                              // Get the element's position
                              const elementPosition = formElement.getBoundingClientRect().top + window.pageYOffset;
                              const offsetPosition = elementPosition - navbarHeight;
                              
                              // Ensure we don't scroll past the top
                              const finalScrollPosition = Math.max(0, offsetPosition);
                              
                              // Use setTimeout to ensure DOM is updated before scrolling
                              setTimeout(() => {
                                window.scrollTo({
                                  top: finalScrollPosition,
                                  behavior: 'smooth'
                                });
                              }, 100);
                            }
                          }}
                          disabled={replyingTo?.id === reply._id}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
