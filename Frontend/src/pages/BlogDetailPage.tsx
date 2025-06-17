import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, User, ArrowLeft } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl: string;
  featured: boolean;
  readTime: string;
  publishedDate: string;
}

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError("Blog ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<Blog>(`https://olympiad-zynlogic.hardikgarg.me/api/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError("Blog not found");
          } else {
            setError("Failed to fetch blog. Please try again later.");
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="education-container">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="education-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-red-500 mb-4">
              <h1 className="text-2xl font-bold mb-2">Error</h1>
              <p>{error}</p>
            </div>
            <div className="space-x-4">
              <Button onClick={() => navigate("/blog")} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen py-12">
        <div className="education-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
            <Button onClick={() => navigate("/blog")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="education-container">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Button onClick={() => navigate("/blog")} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </div>

          {/* Blog header */}
          <div className="mb-8">
            {blog.featured && (
              <Badge variant="secondary" className="mb-4">
                Featured
              </Badge>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold text-education-dark mb-4 animate-fade-in">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span>{blog.category}</span>
              </div>
            </div>
          </div>

          {/* Blog image */}
          {blog.imageUrl && (
            <div className="mb-8">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Blog content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="border-t pt-8">
            <div className="flex justify-between items-center">
              <Button onClick={() => navigate("/blog")} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Blogs
              </Button>
              
              <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} variant="ghost">
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
