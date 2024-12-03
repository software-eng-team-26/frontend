import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Clock, 
  BookOpen, 
  BarChart2, 
  Award, 
  CheckCircle, 
  User, 
  Star,
  Box,
  Users,
  Briefcase 
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { productApi, ProductDto } from '../services/productApi';
import { toast } from 'react-hot-toast';
import { Star as StarIcon } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { Comment } from '../types/comment';
import { commentApi } from '../services/commentApi';

interface ApiError extends Error {
  response?: {
    status: number;
    data: unknown;
  };
}

// Add this component for star rating
function StarRating({ rating, setRating }: { rating: number; setRating?: (rating: number) => void }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`h-5 w-5 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          } ${setRating ? 'cursor-pointer' : ''}`}
          onClick={() => setRating && setRating(star)}
        />
      ))}
    </div>
  );
}

export function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<ProductDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (courseId) {
      fetchCourse(parseInt(courseId));
      fetchComments(parseInt(courseId));
    }
  }, [courseId]);

  const fetchCourse = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await productApi.getProductById(id);
      if (response.data) {
        setCourse(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch course details');
      console.error('Error fetching course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async (id: number) => {
    try {
      console.log('Fetching comments for course:', id);
      const response = await commentApi.getApprovedComments(id);
      console.log('Comments response:', response);
      if (response.data?.data) {
        setComments(response.data.data);
      } else {
        setComments([]);
      }
    } catch (error) {
      const err = error as ApiError;
      console.error('Error fetching comments:', err);
      toast.error('Failed to fetch comments');
      setComments([]);
    }
  };

  const handleAddRating = async (rating: number) => {
    if (!currentUser) {
      toast.error('Please sign in to rate this course');
      return;
    }

    try {
      await commentApi.addRating({
        productId: parseInt(courseId!),
        rating: rating
      });
      
      // Fetch fresh course data and comments
      const [courseResponse, commentsResponse] = await Promise.all([
        productApi.getProductById(parseInt(courseId!)),
        commentApi.getApprovedComments(parseInt(courseId!))
      ]);

      if (courseResponse.data) {
        setCourse(courseResponse.data);
      }
      if (commentsResponse.data?.data) {
        setComments(commentsResponse.data.data);
      }
      
      toast.success('Rating added successfully');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      console.error('Rating error:', err);
      handleError(err, 'Failed to add rating');
    }
  };

  const handleError = (err: { response?: { status?: number; data?: { message?: string } } }, defaultMessage: string) => {
    console.error('Error:', err);
    if (err.response?.status === 403) {
      toast.error('Please sign in again to continue');
    } else if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error(defaultMessage);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please sign in to leave a comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const commentData = {
        productId: Number(courseId),
        userId: Number(currentUser.id),
        content: newComment.trim(),
        rating: newRating > 0 ? newRating : null
      };

      console.log('Sending comment data:', commentData);
      await commentApi.addComment(commentData);
      
      // Single toast message for both rating and comment
      toast.success(
        newRating > 0 
          ? 'Comment submitted for review and rating added' 
          : 'Comment submitted for review'
      );
      
      setNewComment('');
      setNewRating(0);
      
      // Refresh data
      await fetchCourse(parseInt(courseId!));
      await fetchComments(parseInt(courseId!));
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      console.error('Comment error:', err);
      handleError(err, 'Failed to add comment');
    }
  };

  const renderComments = () => (
    <div className="space-y-6">
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="border-b pb-6 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{comment.userName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              {comment.rating > 0 && <StarRating rating={comment.rating} />}
            </div>
            <p className="text-gray-700 mt-2">{comment.content}</p>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No reviews yet. Be the first to review!</p>
          {!currentUser && (
            <p className="text-sm text-gray-400">
              Please sign in to leave a review
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-xl text-gray-600">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
          <div className="flex items-center mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {course.category?.name}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{course.name}</h1>
          <p className="text-lg text-indigo-100 mb-6">{course.description}</p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              <span>{course.instructorRole}</span>
            </div>
            <div className="flex items-center">
              <Box className="h-5 w-5 mr-2" />
              <span>{course.brand}</span>
            </div>
            <div className="flex items-center">
              <StarRating rating={Math.round(course.averageRating || 0)} />
              <span className="ml-2">{course.averageRating?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Course Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-8 w-8 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium">{course.duration} Hours</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <BookOpen className="h-8 w-8 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium">{course.moduleCount} Modules</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-8 w-8 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium">{course.inventory} Seats</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Award className="h-8 w-8 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium">
                    {course.certification ? "Certificate Included" : "No Certificate"}
                  </span>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            {course.curriculum && course.curriculum.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.curriculum.map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructor */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Instructor</h2>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{course.instructor}</h3>
                  <p className="text-gray-600">{course.instructorRole}</p>
                </div>
              </div>
            </div>

            {/* Comments and Ratings Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
              <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
              
              {/* Show current average rating */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Course Rating</h3>
                <div className="flex items-center gap-2">
                  <StarRating rating={course.averageRating || 0} />
                  <span className="text-gray-600">({course.averageRating?.toFixed(1) || '0.0'})</span>
                </div>
              </div>
              
              {/* Add Rating Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Rate this course</h3>
                <StarRating 
                  rating={newRating} 
                  setRating={(rating) => {
                    setNewRating(rating);
                    handleAddRating(rating);
                  }} 
                />
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-8">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Comment
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    rows={4}
                    placeholder="Share your thoughts about this course..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Submit Review
                </button>
              </form>

              {/* Comments List */}
              {renderComments()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <img
                src={course.thumbnailUrl}
                alt={course.name}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${course.price.toString()}
                </span>
              </div>
              <button
                onClick={() => addItem(course)}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors mb-4"
              >
                Add to Cart
              </button>
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-4">This course includes:</h4>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-gray-600">
                    <Clock className="h-5 w-5 mr-3 text-gray-400" />
                    {course.duration} hours of content
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-5 w-5 mr-3 text-gray-400" />
                    {course.moduleCount} modules
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Users className="h-5 w-5 mr-3 text-gray-400" />
                    {course.inventory} available seats
                  </li>
                  {course.certification && (
                    <li className="flex items-center text-sm text-gray-600">
                      <Award className="h-5 w-5 mr-3 text-gray-400" />
                      Certificate of completion
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}