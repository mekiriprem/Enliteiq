import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  Download, 
  Save, 
  X, 
  Clock, 
  BookOpen, 
  Users, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';

// Interfaces for mock test data
interface Question {
  id?: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface MockTest {
  id: number;
  title: string;
  subject: string;
  date: string;
  durationMinutes: number;
  questions: Question[];
  totalQuestions: number;
  status: 'draft' | 'published' | 'archived';
}

interface MockTestForm {
  title: string;
  subject: string;
  date: string;
  durationMinutes: number;
}

interface MockTestsProps {
  userType: 'admin' | 'school' | 'sales';
}

const MockTests: React.FC<MockTestsProps> = ({ userType }) => {
  // State management
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Modal states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);
  const [viewingTest, setViewingTest] = useState<MockTest | null>(null);
  const [showQuestionUpload, setShowQuestionUpload] = useState<MockTest | null>(null);
  const [viewingQuestions, setViewingQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<MockTestForm>({
    title: '',
    subject: '',
    date: '',
    durationMinutes: 60
  });

  // Questions management
  const [bulkQuestions, setBulkQuestions] = useState<Question[]>([]);
  const [singleQuestion, setSingleQuestion] = useState<Question>({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  // Fetch mock tests from backend
  useEffect(() => {
    fetchMockTests();
  }, []);

  const fetchMockTests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://enlightiq.enlightiq.in/api/matchsets', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch mock tests: ${response.status}`);
      }      const data = await response.json();
      
      // Transform API data to match our interface and fetch question counts
      const transformedData = await Promise.all(data.map(async (test: {
        id: number;
        title: string;
        subject: string;
        date?: string;
        durationMinutes?: number;
      }) => {
        // Fetch question count for each test
        let questionCount = 0;
        try {
          const questionsResponse = await fetch(`https://enlightiq.enlightiq.in/api/matchsets/${test.id}/questions`);
          if (questionsResponse.ok) {
            const questions = await questionsResponse.json();
            questionCount = questions.length;
          }
        } catch (error) {
          console.warn(`Failed to fetch questions for test ${test.id}:`, error);
        }

        return {
          id: test.id,
          title: test.title,
          subject: test.subject,
          date: test.date || new Date().toISOString().split('T')[0],
          durationMinutes: test.durationMinutes || 60,
          questions: [],
          totalQuestions: questionCount,
          status: 'published' as const
        };
      }));

      setMockTests(transformedData);

    } catch (err) {
      console.error('Error fetching mock tests:', err);
      setError(err instanceof Error ? err.message : 'Failed to load mock tests');
    } finally {
      setLoading(false);
    }
  };

  // Create new mock test
  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType !== 'admin' && userType !== 'school') {
      alert('Only admin and school users can create mock tests');
      return;
    }

    try {
      const testData = {
        title: formData.title,
        subject: formData.subject,
        date: formData.date,
        durationMinutes: formData.durationMinutes,
        questions: []
      };

      const response = await fetch('https://enlightiq.enlightiq.in/api/matchsets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create mock test');
      }

      const newTest = await response.json();
      setMockTests(prev => [...prev, {
        ...newTest,
        questions: [],
        totalQuestions: 0,
        status: 'draft'
      }]);
      
      setShowCreateForm(false);
      setFormData({
        title: '',
        subject: '',
        date: '',
        durationMinutes: 60
      });

    } catch (err) {
      console.error('Error creating mock test:', err);
      alert(err instanceof Error ? err.message : 'Failed to create mock test');
    }
  };
  // Delete mock test
  const handleDeleteTest = async (testId: number) => {
    if (userType !== 'admin') {
      alert('Only admin users can delete mock tests');
      return;
    }

    if (!confirm('Are you sure you want to delete this mock test? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`https://enlightiq.enlightiq.in/api/matchsets/${testId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete mock test');
      }

      // Remove from local state
      setMockTests(prev => prev.filter(test => test.id !== testId));
      
      // Show success message
      alert('Mock test deleted successfully!');

    } catch (err) {
      console.error('Error deleting mock test:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete mock test');
    }
  };

  // Upload questions to mock test
  const handleUploadQuestions = async (testId: number, questions: Question[]) => {
    try {
      const response = await fetch(`https://enlightiq.enlightiq.in/api/matchsets/${testId}/questions/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questions),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload questions');
      }      // Refresh the test data to get updated question count
      await fetchMockTests();

      setShowQuestionUpload(null);
      setBulkQuestions([]);
      alert('Questions uploaded successfully!');

    } catch (err) {
      console.error('Error uploading questions:', err);
      alert(err instanceof Error ? err.message : 'Failed to upload questions');
    }
  };

  // Parse CSV file for bulk question upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const questions: Question[] = [];

      // Skip header row and parse CSV
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [questionText, option1, option2, option3, option4, correctAnswer] = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
        
        if (questionText && option1 && option2 && option3 && option4 && correctAnswer) {
          questions.push({
            questionText,
            options: [option1, option2, option3, option4],
            correctAnswer
          });
        }
      }

      setBulkQuestions(questions);
    };

    reader.readAsText(file);
  };

  // Download CSV template
  const downloadCSVTemplate = () => {
    const csvContent = 'Question,Option A,Option B,Option C,Option D,Correct Answer\n"What is 2+2?","2","3","4","5","4"\n"Capital of France?","London","Berlin","Paris","Madrid","Paris"';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Add single question
  const handleAddSingleQuestion = () => {
    if (!singleQuestion.questionText || singleQuestion.options.some(opt => !opt) || !singleQuestion.correctAnswer) {
      alert('Please fill all fields for the question');
      return;
    }

    setBulkQuestions(prev => [...prev, { ...singleQuestion }]);
    setSingleQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
  };
  // Fetch questions for viewing
  const fetchQuestionsForView = async (testId: number) => {
    try {
      setLoadingQuestions(true);
      const response = await fetch(`https://enlightiq.enlightiq.in/api/matchsets/${testId}/details`);
      
      if (response.ok) {
        const data = await response.json();
        const questions = data.questions.map((q: {
          id: number;
          questionText: string;
          options: string[];
          correctAnswer?: string;
        }) => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer || ''
        }));
        setViewingQuestions(questions);
      } else {
        console.warn('Failed to fetch questions for viewing');
        setViewingQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching questions for view:', error);
      setViewingQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Handle view test with questions
  const handleViewTest = async (test: MockTest) => {
    setViewingTest(test);
    await fetchQuestionsForView(test.id);
  };

  // Filter mock tests
  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'All' || test.subject === filterSubject;
    const matchesStatus = filterStatus === 'All' || test.status === filterStatus;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Get unique subjects for filter
  const subjects = ['All', ...Array.from(new Set(mockTests.map(test => test.subject)))];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mock Tests Management</h1>
          <p className="text-gray-600">Create and manage mock tests with questions</p>
        </div>        {(userType === 'admin' || userType === 'school') && (
          <div className="flex gap-2">
            <button
              onClick={fetchMockTests}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400"
            >
              <Download size={16} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={downloadCSVTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              CSV Template
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Create Test
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search mock tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading mock tests...</span>
        </div>
      )}

      {/* Mock Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Test Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{test.title}</h3>
                <p className="text-sm text-gray-600">{test.subject}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                test.status === 'published' ? 'bg-green-100 text-green-800' :
                test.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
              </span>
            </div>

            {/* Test Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} />
                <span>{new Date(test.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={14} />
                <span>{test.durationMinutes} minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen size={14} />
                <span>{test.totalQuestions} questions</span>
              </div>
            </div>            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleViewTest(test)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Eye size={14} />
                View
              </button>
              
              {(userType === 'admin' || userType === 'school') && (
                <>
                  <button
                    onClick={() => setShowQuestionUpload(test)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <Upload size={14} />
                    Questions
                  </button>
                  
                  {userType === 'admin' && (
                    <button
                      onClick={() => handleDeleteTest(test.id)}
                      className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {!loading && filteredTests.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mock tests found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterSubject !== 'All' || filterStatus !== 'All' 
              ? 'Try adjusting your search or filters.'
              : 'Get started by creating your first mock test.'
            }
          </p>
          {(userType === 'admin' || userType === 'school') && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Create Mock Test
            </button>
          )}
        </div>
      )}

      {/* Create Test Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Mock Test</h2>
            
            <form onSubmit={handleCreateTest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} />
                  Create Test
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Upload Modal */}
      {showQuestionUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Upload Questions for "{showQuestionUpload.title}"</h2>
              <button
                onClick={() => setShowQuestionUpload(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Upload Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Bulk Upload */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Bulk Upload (CSV)</h3>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={downloadCSVTemplate}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    <Download size={16} />
                    Download Template
                  </button>
                </div>
              </div>

              {/* Single Question */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Add Single Question</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Question text"
                    value={singleQuestion.questionText}
                    onChange={(e) => setSingleQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {singleQuestion.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...singleQuestion.options];
                        newOptions[index] = e.target.value;
                        setSingleQuestion(prev => ({ ...prev, options: newOptions }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  ))}
                  <input
                    type="text"
                    placeholder="Correct answer"
                    value={singleQuestion.correctAnswer}
                    onChange={(e) => setSingleQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={handleAddSingleQuestion}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <Plus size={16} />
                    Add Question
                  </button>
                </div>
              </div>
            </div>

            {/* Questions Preview */}
            {bulkQuestions.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Questions to Upload ({bulkQuestions.length})</h3>
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                  {bulkQuestions.map((question, index) => (
                    <div key={index} className="p-3 border-b border-gray-100 last:border-b-0">
                      <p className="font-medium mb-2">{index + 1}. {question.questionText}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {question.options.map((option, optIndex) => (
                          <span key={optIndex} className={`px-2 py-1 rounded ${
                            option === question.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                          }`}>
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleUploadQuestions(showQuestionUpload.id, bulkQuestions)}
                disabled={bulkQuestions.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300"
              >
                <Upload size={16} />
                Upload {bulkQuestions.length} Questions
              </button>
              <button
                onClick={() => setBulkQuestions([])}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}      {/* View Test Modal */}
      {viewingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Test Details: {viewingTest.title}</h2>
              <button
                onClick={() => {
                  setViewingTest(null);
                  setViewingQuestions([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Test Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Subject</span>
                    <p className="font-semibold">{viewingTest.subject}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date</span>
                    <p className="font-semibold">{new Date(viewingTest.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration</span>
                    <p className="font-semibold">{viewingTest.durationMinutes} minutes</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Questions</span>
                    <p className="font-semibold">{viewingTest.totalQuestions}</p>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen size={20} />
                  Questions ({viewingQuestions.length})
                </h3>

                {/* Loading State */}
                {loadingQuestions && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Loading questions...</span>
                  </div>
                )}

                {/* Questions List */}
                {!loadingQuestions && viewingQuestions.length > 0 && (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {viewingQuestions.map((question, index) => (
                      <div key={question.id || index} className="border border-gray-200 rounded-lg p-4">                        <h4 className="font-medium mb-3">
                          {index + 1}. {question.questionText}
                        </h4>
                        {/* Debug info - remove this in production */}
                        <div className="text-xs text-gray-500 mb-2">
                          Correct Answer: "{question.correctAnswer}" (Type: {typeof question.correctAnswer})
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded-md border ${
                                option === question.correctAnswer
                                  ? 'bg-green-100 border-green-300 text-green-800'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <span className="font-medium">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>{' '}
                              {option}
                              {/* Debug info - show comparison */}
                              <span className="text-xs text-gray-400 ml-2">
                                (Match: {(option === question.correctAnswer).toString()})
                              </span>
                              {option === question.correctAnswer && (
                                <CheckCircle className="inline ml-2" size={16} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Questions */}
                {!loadingQuestions && viewingQuestions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No questions found for this test</p>
                    <p className="text-sm">Questions may not have been uploaded yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              {userType === 'admin' && (
                <button
                  onClick={() => {
                    setViewingTest(null);
                    setViewingQuestions([]);
                    setShowQuestionUpload(viewingTest);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Questions
                </button>
              )}
              <button
                onClick={() => {
                  setViewingTest(null);
                  setViewingQuestions([]);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTests;
