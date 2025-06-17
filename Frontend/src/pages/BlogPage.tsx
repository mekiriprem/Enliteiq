import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Tag, User, Search, Newspaper, ArrowRight } from "lucide-react";

// Interface for Blog data based on backend model
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
  publishedDate: string; // ISO date string
}

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://olympiad-zynlogic.hardikgarg.me/api/blogs");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
        }
        
        const data: Blog[] = await response.json();
        setBlogPosts(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get all unique categories
  const allCategories = Array.from(new Set(blogPosts.map(post => post.category).filter(category => category)));

  // Get all unique tags
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags || []).filter(tag => tag)));
  
  // Filter blog posts based on search term, category, and tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesTag = selectedTag === "" || (post.tags && post.tags.includes(selectedTag));
    
    return matchesSearch && matchesCategory && matchesTag;
  });
  
  // Featured posts
  const featuredPosts = blogPosts.filter(post => post.featured);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="education-container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="education-container">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Newspaper className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Blog Posts</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="education-container">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-education-dark mb-4 animate-fade-in">Enlightiq Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, tips, and insights for academic olympiads and competitions.
          </p>
        </div>
        
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Newspaper className="mr-2 h-5 w-5 text-education-blue" />
              Featured Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <Link to={`/blog/${post.id}`} key={post.id} className="group">
                  <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="secondary" className="bg-white/90 text-education-blue">
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Tag className="h-4 w-4 mr-1" />
                        <span>{post.category}</span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-education-blue transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <CardDescription className="text-gray-600">
                        {post.excerpt}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex items-center justify-between w-full text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(post.publishedDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue"
            >
              <option value="all">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* All Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">All Articles</h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <Link to={`/blog/${post.id}`} key={post.id} className="group">
                  <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />
                      {post.featured && (
                        <div className="absolute top-4 left-4 z-10">
                          <Badge variant="secondary" className="bg-white/90 text-education-blue">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Tag className="h-4 w-4 mr-1" />
                        <span>{post.category}</span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-education-blue transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <CardDescription className="text-gray-600 line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex items-center justify-between w-full text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(post.publishedDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-education-blue to-education-teal rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-lg mb-6">
              Subscribe to our newsletter to get the latest articles and insights delivered to your inbox.
            </p>
            <Button variant="secondary" className="bg-white text-education-blue hover:bg-gray-100">
              Subscribe Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
