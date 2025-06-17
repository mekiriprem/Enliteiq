
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Tag, User, Search, Newspaper } from "lucide-react";

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

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Blog[]>("http://localhost:8080/api/blogs");
        setBlogs(response.data);
      } catch (err) {
        setError("Failed to fetch blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const allCategories = Array.from(new Set(blogs.map((post) => post.category)));
  const allTags = Array.from(new Set(blogs.flatMap((post) => post.tags || [])));

  const filteredPosts = blogs.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesTag = selectedTag === "" || (post.tags || []).includes(selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  const featuredPosts = blogs.filter((post) => post.featured);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen py-12">
      <div className="education-container">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-education-dark mb-4 animate-fade-in">
            Enlightiq Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, tips, and insights for academic olympiads and competitions.
          </p>
        </div>

        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Newspaper className="mr-2 h-5 w-5 text-education-blue" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="group">
                  <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.imageUrl}
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
                      <CardDescription className="text-gray-600">{post.excerpt}</CardDescription>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex items-center justify-between w-full text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{post.publishedDate}</span>
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

        <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  {allCategories.slice(0, 3).map((category) => (
                    <TabsTrigger key={category} value={category} className="flex-1">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
              <Button
                variant={selectedTag === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag("")}
                className="whitespace-nowrap"
              >
                All Tags
              </Button>
              {allTags.slice(0, 5).map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
                  className="whitespace-nowrap"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Newspaper className="mr-2 h-5 w-5 text-education-blue" />
            {selectedCategory === "all" ? "All Articles" : selectedCategory + " Articles"}
            {selectedTag && ` - Tagged with "${selectedTag}"`}
          </h2>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="group">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Badge variant="outline" className="bg-gray-50">
                          {post.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-education-blue transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <CardDescription className="text-gray-600 text-sm line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="pt-2 text-xs text-gray-500">
                      <div className="flex justify-between w-full">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {post.publishedDate}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readTime}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No Articles Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn't find any articles matching your search criteria. Try adjusting your filters or search term.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedTag("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="floating-symbols">
        <span className="symbol">π</span>
        <span className="symbol">∑</span>
        <span className="symbol">√</span>
        <span className="symbol">≈</span>
        <span className="symbol">∫</span>
        <span className="symbol">⚛</span>
        <span className="symbol">🧪</span>
      </div>
      <div className="fixed-symbols">
        <span className="fixed-symbol" style={{ top: "10%", left: "5%" }}>
          π
        </span>
        <span className="fixed-symbol" style={{ top: "30%", right: "10%" }}>
          ∑
        </span>
        <span className="fixed-symbol" style={{ top: "60%", left: "15%" }}>
          ⚛
        </span>
        <span className="fixed-symbol" style={{ top: "80%", right: "20%" }}>
          🧪
        </span>
      </div>
    </div>
  );
};

export default BlogPage;
