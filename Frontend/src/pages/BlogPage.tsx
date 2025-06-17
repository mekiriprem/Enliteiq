import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Tag, User, Search, Newspaper, ArrowRight } from "lucide-react";

// Sample blog post data
const blogPosts = [
  {
    id: "effective-olympiad-prep",
    title: "Effective Strategies for Olympiad Preparation",
    excerpt: "Learn proven techniques to excel in mathematics olympiads with our comprehensive guide to structured preparation.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Dr. Jane Wilson",
    date: "May 1, 2025",
    readTime: "8 min read",
    category: "Study Tips",
    tags: ["Mathematics", "Olympiad", "Preparation", "Study Techniques"],
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "science-olympiad-guide",
    title: "Complete Guide to Science Olympiads",
    excerpt: "Discover the different types of science olympiads available and how to prepare for each one with our detailed guide.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Prof. Michael Chen",
    date: "April 28, 2025",
    readTime: "10 min read",
    category: "Olympiad Guide",
    tags: ["Science", "Physics", "Chemistry", "Biology"],
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "mock-test-benefits",
    title: "5 Benefits of Regular Mock Tests",
    excerpt: "Find out how taking regular mock tests can significantly improve your performance in competitive exams.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Sarah Johnson",
    date: "April 22, 2025",
    readTime: "6 min read",
    category: "Test Preparation",
    tags: ["Mock Tests", "Exam Strategy", "Performance"],
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "math-problem-solving",
    title: "Advanced Problem-Solving Techniques for Math Competitions",
    excerpt: "Master advanced mathematical problem-solving strategies that are essential for success in high-level competitions.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Dr. Jane Wilson",
    date: "April 15, 2025",
    readTime: "12 min read",
    category: "Mathematics",
    tags: ["Problem Solving", "Advanced Math", "Competition"],
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "parent-support-guide",
    title: "How Parents Can Support Their Child's Olympiad Journey",
    excerpt: "Practical tips for parents to effectively support and motivate their children participating in academic olympiads.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Emily Parker",
    date: "April 8, 2025",
    readTime: "7 min read",
    category: "Parenting",
    tags: ["Parenting", "Support", "Motivation"],
    image: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "olympiad-success-stories",
    title: "Inspiring Stories of Olympiad Champions",
    excerpt: "Read about the journeys of past olympiad champions and the lessons we can learn from their experiences.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "David Park",
    date: "April 1, 2025",
    readTime: "9 min read",
    category: "Success Stories",
    tags: ["Success", "Champions", "Inspiration"],
    image: "https://images.unsplash.com/photo-1530099486328-e021101a494a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "online-learning-resources",
    title: "Top 10 Online Resources for Olympiad Preparation",
    excerpt: "Discover the best websites, courses, and tools to enhance your preparation for academic competitions.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Sarah Johnson",
    date: "March 25, 2025",
    readTime: "8 min read",
    category: "Resources",
    tags: ["Online Learning", "Resources", "Tools"],
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "physics-olympiad-prep",
    title: "Physics Olympiad: From Fundamentals to Advanced Topics",
    excerpt: "A comprehensive guide to preparing for physics olympiads, covering essential concepts and advanced problem-solving.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Prof. Michael Chen",
    date: "March 18, 2025",
    readTime: "11 min read",
    category: "Physics",
    tags: ["Physics", "Science", "Advanced Topics"],
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: false
  }
];

// Get all unique categories
const allCategories = Array.from(new Set(blogPosts.map(post => post.category)));

// Get all unique tags
const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  
  // Filter blog posts based on search term, category, and tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesTag = selectedTag === "" || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });
  
  // Featured posts
  const featuredPosts = blogPosts.filter(post => post.featured);
  
  return (
    <div className="min-h-scre py-12">      <div className="education-container">
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
                        src={post.image} 
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
                          <span>{post.date}</span>
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
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <Tabs 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
                className="w-full"
              >
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  {allCategories.slice(0, 3).map(category => (
                    <TabsTrigger key={category} value={category} className="flex-1">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            {/* Tag Filter */}
            <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
              <Button 
                variant={selectedTag === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag("")}
                className="whitespace-nowrap"
              >
                All Tags
              </Button>
              {allTags.slice(0, 5).map(tag => (
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
        
        {/* Blog Posts Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Newspaper className="mr-2 h-5 w-5 text-education-blue" />
            {selectedCategory === 'all' ? 'All Articles' : selectedCategory + ' Articles'}
            {selectedTag && ` - Tagged with "${selectedTag}"`}
          </h2>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <Link to={`/blog/${post.id}`} key={post.id} className="group">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={post.image} 
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
                          {post.date}
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
              <div className="mb-4">
                <Search className="h-12 w-12 mx-auto text-gray-400" />
              </div>
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
  <span className="symbol">⚛</span> {/* Atom symbol */}
  <span className="symbol">🧪</span> {/* Beaker */}
</div>
<div className="fixed-symbols">
  <span className="fixed-symbol" style={{ top: '10%', left: '5%' }}>π</span>
  <span className="fixed-symbol" style={{ top: '30%', right: '10%' }}>∑</span>
  <span className="fixed-symbol" style={{ top: '60%', left: '15%' }}>⚛</span>
  <span className="fixed-symbol" style={{ top: '80%', right: '20%' }}>🧪</span>
</div>
    </div>
  );
};

export default BlogPage;
