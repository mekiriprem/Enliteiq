import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, Bookmark, Facebook, Twitter, Linkedin, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample blog post data (duplicated from BlogPage for simplicity)
const blogPosts = [
  {
    id: "effective-olympiad-prep",
    title: "Effective Strategies for Olympiad Preparation",
    excerpt: "Learn proven techniques to excel in mathematics olympiads with our comprehensive guide to structured preparation.",
    content: `
      <p>Academic olympiads represent the pinnacle of scholastic competition, challenging students to stretch their intellectual boundaries and showcase their problem-solving abilities. Whether you're preparing for a mathematics, science, or computing olympiad, the journey requires dedication, strategic planning, and effective study techniques.</p>

      <h2>Start with a Strong Foundation</h2>
      
      <p>Before diving into advanced olympiad problems, ensure you have a solid grasp of the fundamentals. Many students rush to tackle complex problems without mastering the basics, leading to frustration and diminishing returns. Spend time reviewing core concepts and building a strong conceptual foundation.</p>
      
      <p>Key actions to take:</p>
      <ul>
        <li>Review your school textbooks thoroughly</li>
        <li>Work through basic problem sets methodically</li>
        <li>Address any conceptual weaknesses before moving forward</li>
        <li>Use online resources to supplement your understanding</li>
      </ul>
      
      <h2>Structured Practice Approach</h2>
      
      <p>Olympiad preparation requires a balanced approach between learning new concepts and practicing problems. We recommend the following structure:</p>
      
      <h3>Daily Routine</h3>
      <p>Establish a consistent daily study routine with these components:</p>
      <ul>
        <li><strong>Theory review</strong> (30-45 minutes): Study one topic or concept in depth</li>
        <li><strong>Problem solving</strong> (1-1.5 hours): Work through problems of increasing difficulty</li>
        <li><strong>Review and reflection</strong> (30 minutes): Analyze mistakes and identify areas for improvement</li>
      </ul>
      
      <h3>Weekly Schedule</h3>
      <p>Structure your week to ensure comprehensive coverage:</p>
      <ul>
        <li>Monday-Thursday: Focus on specific topics (e.g., number theory, geometry, combinatorics)</li>
        <li>Friday: Mixed problems across multiple topics</li>
        <li>Saturday: Take a full-length practice test under timed conditions</li>
        <li>Sunday: Review test performance and plan for the upcoming week</li>
      </ul>
      
      <h2>Problem-Solving Techniques</h2>
      
      <p>Developing effective problem-solving strategies is crucial for olympiad success:</p>
      
      <h3>1. Understand the problem thoroughly</h3>
      <p>Before attempting a solution, make sure you understand what the problem is asking. Identify the given information and the goal. Restate the problem in your own words if necessary.</p>
      
      <h3>2. Start with simpler cases</h3>
      <p>If faced with a complex problem, try solving simpler versions first to identify patterns or approaches that might work for the original problem.</p>
      
      <h3>3. Use multiple approaches</h3>
      <p>Don't restrict yourself to one method. Consider algebraic, geometric, and combinatorial approaches to the same problem.</p>
      
      <h3>4. Learn to write clear proofs</h3>
      <p>Many olympiads require formal proofs. Practice writing clear, logical arguments that proceed step-by-step from the given information to the conclusion.</p>
      
      <h2>Resources for Preparation</h2>
      
      <p>Utilize these resources to enhance your preparation:</p>
      <ul>
        <li><strong>Books</strong>: "Problem-Solving Strategies" by Arthur Engel, "Mathematical Olympiad Challenges" by Titu Andreescu</li>
        <li><strong>Online platforms</strong>: Art of Problem Solving, Brilliant.org, Khan Academy</li>
        <li><strong>Past papers</strong>: Work through previous olympiad papers to familiarize yourself with the style and difficulty level</li>
        <li><strong>Study groups</strong>: Join or form a study group to discuss problems and learn from peers</li>
      </ul>
      
      <h2>Mental Preparation and Test-Taking Strategies</h2>
      
      <p>Success in olympiads isn't just about knowledge—it's also about mental preparation and effective test-taking strategies:</p>
      <ul>
        <li>Practice under timed conditions regularly to build stamina and time management skills</li>
        <li>Learn when to move on from a challenging problem and return to it later</li>
        <li>Develop stress management techniques to maintain focus during the actual competition</li>
        <li>Ensure proper rest and nutrition, especially in the days leading up to the competition</li>
      </ul>
      
      <p>Remember that olympiad preparation is a marathon, not a sprint. Consistent effort over time yields better results than last-minute cramming. Embrace the learning process, celebrate small victories, and maintain a growth mindset throughout your preparation journey.</p>
    `,
    author: "Dr. Jane Wilson",
    authorBio: "Former Mathematics Olympiad gold medalist with a Ph.D. in Education Technology from Stanford University. Dr. Wilson has coached numerous students to success in international competitions.",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
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
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Prof. Michael Chen",
    authorBio: "Mathematics professor with 15 years of experience training national olympiad teams.",
    authorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
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
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Sarah Johnson",
    authorBio: "Education specialist with expertise in creating engaging assessment materials.",
    authorImage: "https://images.unsplash.com/photo-1554727242-741c14fa561c?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
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
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Dr. Jane Wilson",
    authorBio: "Former Mathematics Olympiad gold medalist with a Ph.D. in Education Technology from Stanford University.",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
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
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Emily Parker",
    authorBio: "Education specialist with expertise in creating engaging assessment materials.",
    authorImage: "https://images.unsplash.com/photo-1554727242-741c14fa561c?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
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
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "David Park",
    authorBio: "Software engineer passionate about building educational technology platforms.",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
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
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Sarah Johnson",
    authorBio: "Education specialist with expertise in creating engaging assessment materials.",
    authorImage: "https://images.unsplash.com/photo-1554727242-741c14fa561c?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
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
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Prof. Michael Chen",
    authorBio: "Mathematics professor with 15 years of experience training national olympiad teams.",
    authorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    date: "March 18, 2025",
    readTime: "11 min read",
    category: "Physics",
    tags: ["Physics", "Science", "Advanced Topics"],
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: false
  }
];

// Get related posts by matching tags or category
const getRelatedPosts = (currentPostId: string, currentPostTags: string[], currentPostCategory: string) => {
  return blogPosts
    .filter(post => post.id !== currentPostId) // Exclude current post
    .filter(post => 
      post.category === currentPostCategory || // Same category
      post.tags.some(tag => currentPostTags.includes(tag)) // Common tags
    )
    .slice(0, 3); // Limit to 3 related posts
};

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  
  // Find the blog post by id
  useEffect(() => {
    const foundPost = blogPosts.find(post => post.id === id);
    if (foundPost) {
      setPost(foundPost);
      setRelatedPosts(getRelatedPosts(foundPost.id, foundPost.tags, foundPost.category));
    } else {
      navigate("/blog"); // Redirect if post not found
    }
  }, [id, navigate]);
  
  // Copy current URL to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setIsLinkCopied(true);
        toast({
          title: "Link Copied",
          description: "The article link has been copied to your clipboard.",
        });
        
        // Reset icon after 2 seconds
        setTimeout(() => {
          setIsLinkCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Could not copy the link to your clipboard.",
          variant: "destructive",
        });
      });
  };
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="education-container">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-education-blue mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="education-container">
        {/* Back to Blog Link */}
        <div className="mb-8">
          <Link to="/blog" className="flex items-center text-education-blue hover:underline font-medium">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
          </Link>
        </div>
        
        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-80 w-full">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2 bg-white/90 text-education-blue">
                  {post.category}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-200 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              {/* Article Content */}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }}></div>
              
              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  {post.tags.map((tag: string) => (
                    <Link to={`/blog?tag=${tag}`} key={tag}>
                      <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Share Options */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium mb-3">Share this article:</p>
                <div className="flex space-x-3">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <span className="sr-only">Share on Facebook</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Twitter className="h-5 w-5 text-blue-400" />
                    <span className="sr-only">Share on Twitter</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Linkedin className="h-5 w-5 text-blue-700" />
                    <span className="sr-only">Share on LinkedIn</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full" onClick={handleCopyLink}>
                    {isLinkCopied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-gray-600" />}
                    <span className="sr-only">Copy Link</span>
                  </Button>
                </div>
              </div>
              
              {/* Author Bio */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-start space-x-4">
                  <img 
                    src={post.authorImage} 
                    alt={post.author} 
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{post.author}</h3>
                    <p className="text-gray-600 text-sm mt-1">{post.authorBio}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation Between Articles */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <Button variant="ghost" className="flex items-center text-gray-600 hover:text-education-blue">
                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous Article
                  </Button>
                  <Button variant="ghost" className="flex items-center text-gray-600 hover:text-education-blue">
                    Next Article <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Related Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Related Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedPosts.length > 0 ? (
                  relatedPosts.map(relatedPost => (
                    <Link to={`/blog/${relatedPost.id}`} key={relatedPost.id} className="block group">
                      <div className="flex space-x-3">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm group-hover:text-education-blue line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {relatedPost.date} · {relatedPost.readTime}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No related articles found.</p>
                )}
                
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <Link to="/blog" className="text-education-blue text-sm hover:underline font-medium">
                    View all articles
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(blogPosts.map(p => p.category))).map(category => (
                    <Link 
                      key={category} 
                      to={`/blog?category=${category}`} 
                      className="flex justify-between items-center py-2 border-b border-gray-100 text-gray-700 hover:text-education-blue"
                    >
                      <span>{category}</span>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        {blogPosts.filter(p => p.category === category).length}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(blogPosts.flatMap(p => p.tags)))
                    .slice(0, 12)
                    .map(tag => (
                      <Link to={`/blog?tag=${tag}`} key={tag}>
                        <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                          {tag}
                        </Badge>
                      </Link>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
            
            {/* Save for later */}
            <Card className="bg-education-blue/5 border-education-blue/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Bookmark className="h-10 w-10 text-education-blue mb-2" />
                  <h3 className="font-semibold mb-2">Save for Later</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create an account to bookmark articles and access them anytime.
                  </p>
                  <div className="flex space-x-3">
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="text-education-blue border-education-blue">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm" className="bg-education-blue hover:bg-blue-700">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
