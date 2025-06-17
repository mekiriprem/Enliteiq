import React, { useState, useRef, useEffect } from 'react';
import { Clock, Calendar, Plus, Upload, X, FileText, Search, Trash2, Edit, User, Tag, BookOpen, Image as ImageIcon, Link as LinkIcon, Star } from 'lucide-react';

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  readTime: string;
  imageUrl?: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  featured: boolean;
  readTime: string;
  publishedDate: string;
}

interface BlogManagementProps {
  userType: 'admin';
}

const BlogManagement: React.FC<BlogManagementProps> = ({ userType }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [blogFilter, setBlogFilter] = useState<'all' | 'featured' | 'not_featured'>('all');

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [newBlog, setNewBlog] = useState<Partial<Blog>>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    tags: [],
    imageUrl: '',
    featured: false,
    readTime: ''
  });

  const [tagInput, setTagInput] = useState<string>('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/blogs');
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        alert('Failed to load blogs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleEditBlog = (blog: Blog) => {
    setIsEditing(true);
    setEditingBlogId(blog.id);
    setNewBlog({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      author: blog.author,
      category: blog.category,
      tags: blog.tags || [],
      imageUrl: blog.imageUrl || '',
      featured: blog.featured || false,
      readTime: blog.readTime || ''
    });
    setImagePreview(blog.imageUrl || '');
    setImageUploadType(blog.imageUrl ? 'url' : 'file');
    setShowAddBlog(true);
  };

  const handleDeleteBlog = async (blogId: string, blogTitle: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the blog "${blogTitle}"? This action cannot be undone.`);
    
    if (!confirmDelete) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete blog: ${response.status}`);
      }

      // Remove the blog from the local state
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));
      alert('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleImageFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (PNG, JPG, or JPEG)');
        return;
      }
      setImageFile(file);
      // Clear the URL since we're uploading a file
      setNewBlog({...newBlog, imageUrl: ''});
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBlog = async () => {
    console.log('handleSaveBlog called, isEditing:', isEditing, 'editingBlogId:', editingBlogId);
    console.log('newBlog:', newBlog);
    
    if (newBlog.title && newBlog.content && newBlog.author && newBlog.category) {
      try {
        setIsProcessing(true);
        
        const formData = new FormData();        const blogData: BlogFormData = {
          title: newBlog.title,
          content: newBlog.content,
          excerpt: newBlog.excerpt,
          author: newBlog.author,
          category: newBlog.category,
          tags: newBlog.tags,
          featured: newBlog.featured,
          readTime: newBlog.readTime
        };

        // Always include imageUrl in the JSON - the backend will handle prioritization
        if (newBlog.imageUrl) {
          blogData.imageUrl = newBlog.imageUrl;
        }

        formData.append('blog', JSON.stringify(blogData));
        
        // Append image file if uploading a file
        if (imageUploadType === 'file' && imageFile) {
          formData.append('image', imageFile);
        }        if (isEditing && editingBlogId) {
          console.log('Updating blog with ID:', editingBlogId);
          console.log('FormData contents:', {
            blog: JSON.stringify(blogData),
            hasImage: imageUploadType === 'file' && imageFile ? 'Yes' : 'No',
            imageUploadType: imageUploadType
          });
          
          const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/blogs/${editingBlogId}`, {
            method: 'PUT',
            body: formData,
          });
          
          console.log('Update response status:', response.status);
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Update error response:', errorText);
            throw new Error(`Failed to update blog: ${response.status} - ${errorText}`);
          }
          
          const updatedBlog = await response.json();
          console.log('Updated blog received:', updatedBlog);
          
          setBlogs(prevBlogs => 
            prevBlogs.map(blog => 
              blog.id === editingBlogId ? updatedBlog : blog
            )
          );
        } else {
          console.log('Creating new blog');
          console.log('FormData contents:', {
            blog: JSON.stringify(blogData),
            hasImage: imageUploadType === 'file' && imageFile ? 'Yes' : 'No',
            imageUploadType: imageUploadType
          });
          
          const response = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/blogs', {
            method: 'POST',
            body: formData,
          });
          
          console.log('Creation response status:', response.status);
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Creation error response:', errorText);
            throw new Error(`Failed to create blog: ${response.status} - ${errorText}`);
          }
          
          const newBlogData = await response.json();
          console.log('New blog created:', newBlogData);
          
          setBlogs(prevBlogs => [...prevBlogs, newBlogData]);
        }
        
        // Reset form
        setNewBlog({ title: '', content: '', excerpt: '', author: '', category: '', tags: [], imageUrl: '', featured: false, readTime: '' });
        setImageFile(null);
        setImagePreview('');
        setShowAddBlog(false);
        setIsEditing(false);
        setEditingBlogId(null);
        setTagInput('');
          alert(isEditing ? 'Blog updated successfully!' : 'Blog created successfully!');
      } catch (error) {
        console.error('Error saving blog:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`Failed to save blog: ${errorMessage}`);
      } finally {
        setIsProcessing(false);
      }
    } else {
      alert('Please fill in all required fields (Title, Content, Author, Category).');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !newBlog.tags?.includes(tagInput.trim())) {
      setNewBlog({
        ...newBlog,
        tags: [...(newBlog.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewBlog({
      ...newBlog,
      tags: newBlog.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = blogFilter === 'all' || 
                         (blogFilter === 'featured' && blog.featured) ||
                         (blogFilter === 'not_featured' && !blog.featured);
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {!showAddBlog ? (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Management</h1>
                <p className="text-gray-600">Manage your blog posts and content</p>
              </div>
              <button 
                onClick={() => {
                  setShowAddBlog(true);
                  setIsEditing(false);
                  setEditingBlogId(null);
                  setNewBlog({ title: '', content: '', excerpt: '', author: '', category: '', tags: [], imageUrl: '', featured: false, readTime: '' });
                  setImagePreview('');
                  setImageFile(null);
                  setTagInput('');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus size={16} />
                Add New Blog
              </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search blogs by title, author, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={blogFilter}
                onChange={(e) => setBlogFilter(e.target.value as 'all' | 'featured' | 'not_featured')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Blogs</option>
                <option value="featured">Featured</option>
                <option value="not_featured">Not Featured</option>
              </select>
            </div>

            {/* Blog Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map(blog => (
                  <div key={blog.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {blog.imageUrl && (
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 flex-1">
                          {blog.title}
                        </h3>
                        {blog.featured && (
                          <Star className="h-5 w-5 text-yellow-500 fill-current ml-2 flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4 text-blue-500" />
                          <span>{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen className="h-4 w-4 text-green-500" />
                          <span>{blog.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span>{blog.readTime} read</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-orange-500" />
                          <span>{formatDate(blog.publishedDate)}</span>
                        </div>
                      </div>

                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{blog.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      {userType === 'admin' && (
                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex-1 justify-center"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id, blog.title)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex-1 justify-center"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm !== '' 
                      ? `No blogs match your search "${searchTerm}".`
                      : 'Get started by creating your first blog post.'
                    }
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Add/Edit Blog Form */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{isEditing ? 'Edit Blog' : 'Add New Blog'}</h2>
              <button
                onClick={() => {
                  setShowAddBlog(false);
                  setIsEditing(false);
                  setEditingBlogId(null);
                  setNewBlog({ title: '', content: '', excerpt: '', author: '', category: '', tags: [], imageUrl: '', featured: false, readTime: '' });
                  setImagePreview('');
                  setImageFile(null);
                  setTagInput('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title *</label>
                  <input
                    type="text"
                    value={newBlog.title || ''}
                    onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                    placeholder="Enter blog title"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                  <input
                    type="text"
                    value={newBlog.author || ''}
                    onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                    placeholder="Enter author name"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <input
                    type="text"
                    value={newBlog.category || ''}
                    onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                    placeholder="Enter category"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={newBlog.readTime || ''}
                    onChange={(e) => setNewBlog({...newBlog, readTime: e.target.value})}
                    placeholder="e.g., 5 minutes"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  value={newBlog.excerpt || ''}
                  onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                  placeholder="Enter a short excerpt or summary"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  value={newBlog.content || ''}
                  onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                  placeholder="Enter the full blog content"
                  rows={10}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter a tag"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {newBlog.tags && newBlog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newBlog.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newBlog.featured || false}
                  onChange={(e) => setNewBlog({...newBlog, featured: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Blog
                </label>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Blog Image</label>
                <div className="flex gap-4 mb-4">                  <button 
                    type="button"
                    onClick={() => {
                      setImageUploadType('url');
                      setImageFile(null); // Clear file when switching to URL
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      imageUploadType === 'url' 
                        ? 'bg-blue-50 border-blue-300 text-blue-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <LinkIcon size={16} />
                    Image URL
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setImageUploadType('file');
                      setNewBlog({...newBlog, imageUrl: ''}); // Clear URL when switching to file
                      setImagePreview(''); // Clear preview
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      imageUploadType === 'file' 
                        ? 'bg-blue-50 border-blue-300 text-blue-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Upload size={16} />
                    Upload File
                  </button>
                </div>

                {imageUploadType === 'url' ? (
                  <input
                    type="url"
                    value={newBlog.imageUrl || ''}
                    onChange={(e) => {
                      setNewBlog({...newBlog, imageUrl: e.target.value});
                      setImagePreview(e.target.value);
                    }}
                    placeholder="Enter image URL"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ImageIcon size={16} />
                      Choose Image File
                    </button>
                  </div>
                )}                {imagePreview && (
                  <div className="mt-4">
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setImageFile(null);
                          setNewBlog({...newBlog, imageUrl: ''});
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddBlog(false);
                    setIsEditing(false);
                    setEditingBlogId(null);
                    setNewBlog({ title: '', content: '', excerpt: '', author: '', category: '', tags: [], imageUrl: '', featured: false, readTime: '' });
                    setImagePreview('');
                    setImageFile(null);
                    setTagInput('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBlog}
                  disabled={isProcessing || isUploadingImage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <FileText size={16} />
                      {isEditing ? 'Update Blog' : 'Create Blog'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
