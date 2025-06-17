import React, { useState, useRef, useEffect } from 'react';
import { Clock, Calendar, Info, Download, Plus, Upload, X, FileText, Check, Image as ImageIcon, Link as LinkIcon, Search, Trash2 } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  date: string;
  time: string;
  subject: string;
  description?: string;
  image?: string;
  status?: string | null;
  duration?: string;
}

interface ExamResult {
  studentName: string;
  certificateUrl: string;
  percentage: number;
  examTitle: string;
}

interface UpcomingExamsProps {
  userType: 'student' | 'school' | 'admin' | 'sales';
}

interface StudentData {
  userId: number;
  percentage: string;
  eligible: boolean;
}

interface Template {
  name: string;
  title: string;
  previewUrl: string;
}

const CERTIFICATE_TEMPLATES: Template[] = [
  { name: 'template1', title: 'Classic', previewUrl: 'https://olympiad-zynlogic.hardikgarg.me/api/templates/preview/template1' },
  { name: 'template2', title: 'Gold', previewUrl: 'https://olympiad-zynlogic.hardikgarg.me/api/templates/preview/template2' },
  { name: 'template3', title: 'Blue', previewUrl: 'https://olympiad-zynlogic.hardikgarg.me/api/templates/preview/template3' }
];

const UpcomingExams: React.FC<UpcomingExamsProps> = ({ userType }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddExam, setShowAddExam] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template1');
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [examFilter, setExamFilter] = useState<'all' | 'recommended' | 'not_recommended'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedExamResults, setSelectedExamResults] = useState<ExamResult[]>([]);
  const [selectedExamForResults, setSelectedExamForResults] = useState<Exam | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [isUploadingPdfs, setIsUploadingPdfs] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);  const [newExam, setNewExam] = useState<Partial<Exam>>({
    title: '',
    date: '',
    time: '',
    subject: '',
    description: '',
    image: '',
    status: null,
    duration: ''
  });

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/exams');
        if (!response.ok) {
          throw new Error(`Failed to fetch exams: ${response.status}`);
        }
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error('Error fetching exams:', error);
        alert('Failed to load exams. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };    fetchExams();
  }, []);

  // Handle escape key for certificate modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showCertificateModal) {
          setShowCertificateModal(false);
        }
        if (showResultsModal) {
          setShowResultsModal(false);
        }
      }
    };

    if (showCertificateModal || showResultsModal) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };  }, [showCertificateModal, showResultsModal]);

  // Handle viewing exam results
  const handleViewResults = async (examId: string) => {
    try {
      setLoadingResults(true);
      setSelectedExamResults([]);
      setSelectedExamForResults(null);
      setShowResultsModal(true);

      // Find the exam details
      const exam = exams.find(e => e.id === examId);
      if (exam) {
        setSelectedExamForResults(exam);
      }

      // Fetch exam results from API
      const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/exam/${examId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch exam results: ${response.status} ${response.statusText}`);
      }

      const results = await response.json();
      console.log('Fetched exam results:', results);
      setSelectedExamResults(results);

    } catch (error) {
      console.error('Error fetching exam results:', error);
      alert(`Failed to fetch exam results: ${error.message || error}`);
      setShowResultsModal(false);
    } finally {
      setLoadingResults(false);
    }
  };
  const handleUpdateExamStatus = async (id: string, recommend: boolean) => {
    try {
      setIsProcessing(true);
      
      // Always use the recommend API since it toggles the status
      const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/recommend?examId=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to toggle exam recommendation: ${response.status}`);
      }
      
      const result = await response.text();
      console.log('API Response:', result);
      
      // Update the local state - toggle the current status
      setExams(prevExams => 
        prevExams.map(exam => {
          if (exam.id === id) {
            const newStatus = exam.status === 'recommended' ? null : 'recommended';
            return { ...exam, status: newStatus };
          }
          return exam;
        })
      );
      
    } catch (error) {
      console.error('Error updating exam status:', error);
      alert(`Failed to update exam status: ${error.message || error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    if (imageFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(imageFile.type)) {
        alert('Please upload a valid image file (PNG, JPG, or JPEG)');
        return;
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      setImageFile(imageFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setNewExam(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(imageFile);
    } else {
      alert('Please drop a valid image file (PNG, JPG, or JPEG)');
    }
  };
  const handleEditExam = (exam: Exam) => {
    setIsEditing(true);
    setEditingExamId(exam.id);
    setNewExam({
      title: exam.title,
      date: exam.date,
      time: exam.time,
      subject: exam.subject,
      description: exam.description || '',
      image: exam.image || '',
      status: exam.status || null,
      duration: exam.duration || ''
    });
    setImagePreview(exam.image || '');
    setImageUploadType(exam.image ? 'url' : 'file');
    setShowAddExam(true);
  };

  const handleDeleteExam = async (examId: string, examTitle: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the exam "${examTitle}"? This action cannot be undone.`);
    
    if (!confirmDelete) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/exams/${examId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete exam: ${response.status}`);
      }

      // Remove the exam from the local state
      setExams(prevExams => prevExams.filter(exam => exam.id !== examId));
      alert('Exam deleted successfully!');
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Failed to delete exam. Please try again.');
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
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewExam(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    setNewExam(prev => ({ ...prev, image: url }));
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validPdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (validPdfFiles.length !== files.length) {
      alert('Please upload only PDF files.');
      return;
    }
    
    // Check file sizes (limit to 10MB per file)
    const oversizedFiles = validPdfFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Each PDF file should be less than 10MB.');
      return;
    }
    
    setPdfFiles(prev => [...prev, ...validPdfFiles]);
  };

  const removePdfFile = (index: number) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPdfsToServer = async (examId: string, files: File[]): Promise<void> => {
    if (files.length === 0) return;
    
    setIsUploadingPdfs(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('pdf', file);
        
        const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/${examId}/pdf`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Error uploading PDFs:', error);
      throw error;
    } finally {
      setIsUploadingPdfs(false);
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
      }
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }  };  const uploadPdfToExam = async (examId: string, pdfFile: File): Promise<void> => {
    console.log('uploadPdfToExam called with examId:', examId, 'file:', pdfFile.name);
    const formData = new FormData();
    formData.append('file', pdfFile);

    const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/${examId}/pdf`, {
      method: 'POST',
      body: formData,
    });

    console.log('PDF upload response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('PDF upload error:', errorText);
      throw new Error(`PDF upload failed: ${response.status} - ${errorText}`);
    }
    const responseText = await response.text();
    console.log('PDF upload success response:', responseText);
  };
  const handleSaveExam = async () => {
    console.log('handleSaveExam called, isEditing:', isEditing, 'editingExamId:', editingExamId);
    console.log('pdfFiles:', pdfFiles);
    console.log('newExam:', newExam);
    
    if (newExam.title && newExam.date && newExam.time && newExam.subject) {
      try {
        setIsProcessing(true);
        let finalImageUrl = newExam.image || '';
        if (imageUploadType === 'file' && imageFile) {
          try {
            finalImageUrl = await uploadImageToServer(imageFile);
          } catch (error) {
            console.warn('Image upload failed, proceeding without server upload');
            finalImageUrl = imagePreview;
          }
        }        const examData = {
          title: newExam.title,
          date: newExam.date,
          time: newExam.time,
          subject: newExam.subject,
          description: newExam.description,
          image: finalImageUrl,
          status: newExam.status,
          duration: newExam.duration
        };if (isEditing && editingExamId) {
          console.log('Updating exam with ID:', editingExamId);
          const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/exams/${editingExamId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examData),
          });
          console.log('Update response status:', response.status);
          if (!response.ok) {
            throw new Error(`Failed to update exam: ${response.status}`);
          }
          const updatedExam = await response.json();
          console.log('Updated exam received:', updatedExam);
          
          // Upload PDF if one is selected during editing
          if (pdfFiles.length > 0) {
            console.log('Uploading PDF for editing exam:', pdfFiles[0].name);
            try {
              setIsUploadingPdfs(true);
              await uploadPdfToExam(editingExamId, pdfFiles[0]); // Upload first PDF only
              console.log('PDF upload successful');
              // Refresh the exam data to get the updated syllabus URL
              const refreshResponse = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/exams/${editingExamId}`);
              if (refreshResponse.ok) {
                const refreshedExam = await refreshResponse.json();
                console.log('Refreshed exam after PDF upload:', refreshedExam);
                setExams(prevExams => prevExams.map(exam => 
                  exam.id === editingExamId ? refreshedExam : exam
                ));
              } else {
                console.log('Failed to refresh exam data');
                setExams(prevExams => prevExams.map(exam => 
                  exam.id === editingExamId ? updatedExam : exam
                ));
              }
            } catch (pdfError) {
              console.error('PDF upload failed:', pdfError);
              alert('Exam updated but PDF upload failed. You can upload the PDF later.');
              setExams(prevExams => prevExams.map(exam => 
                exam.id === editingExamId ? updatedExam : exam
              ));
            } finally {
              setIsUploadingPdfs(false);
            }
          } else {
            console.log('No PDF to upload, just updating exam list');
            setExams(prevExams => prevExams.map(exam => 
              exam.id === editingExamId ? updatedExam : exam
            ));
          }
        } else {
          const response = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/exams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examData),
          });          if (!response.ok) {
            throw new Error(`Failed to add exam: ${response.status}`);
          }
          const newExamData = await response.json();
          
          // Upload PDF if one is selected
          if (pdfFiles.length > 0) {
            try {
              setIsUploadingPdfs(true);
              await uploadPdfToExam(newExamData.id, pdfFiles[0]); // Upload first PDF only
              // Refresh the exam data to get the updated syllabus URL
              const refreshResponse = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/exams/${newExamData.id}`);
              if (refreshResponse.ok) {
                const refreshedExam = await refreshResponse.json();
                setExams(prevExams => [...prevExams.filter(e => e.id !== newExamData.id), refreshedExam]);
              } else {
                setExams(prevExams => [...prevExams, newExamData]);
              }
            } catch (pdfError) {
              console.error('PDF upload failed:', pdfError);
              alert('Exam created but PDF upload failed. You can upload the PDF later.');
              setExams(prevExams => [...prevExams, newExamData]);
            } finally {
              setIsUploadingPdfs(false);
            }
          } else {
            setExams(prevExams => [...prevExams, newExamData]);
          }
        }
          // Reset form
        setNewExam({ title: '', date: '', time: '', subject: '', description: '', image: '', status: null, duration: '' });
        setImageFile(null);
        setImagePreview('');
        setPdfFiles([]);
        setIsDragOver(false);
        setShowAddExam(false);
        setIsEditing(false);
        setEditingExamId(null);
      } catch (error) {
        console.error(`Error ${isEditing ? 'updating' : 'adding'} exam:`, error);
        alert(`Failed to ${isEditing ? 'update' : 'add'} exam. Please try again.`);
      } finally {
        setIsProcessing(false);
      }
    } else {
      alert('Please fill in all required fields (Title, Subject, Date, Time).');
    }
  };  const handleGenerateCertificate = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      setSelectedExam(exam);
      setShowCertificateModal(true);
      setStudentData([]);
      setCsvFile(null);
      setShowPreview(false);
      setSelectedTemplate('template1');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      parseCSV(file);
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  const parseCSV = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const data: StudentData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const [userIdStr, percentage] = line.split(',').map(item => item.trim());
          const userId = parseInt(userIdStr);
          const cleanPercentage = percentage?.replace(/"/g, '');
          if (!isNaN(userId) && cleanPercentage && !isNaN(parseFloat(cleanPercentage))) {
            data.push({
              userId,
              percentage: cleanPercentage,
              eligible: parseFloat(cleanPercentage) > 75
            });
          } else {
            console.warn(`Invalid CSV line ${i + 1}: ${line}`);
          }
        }
      }
      if (data.length === 0) {
        alert('No valid data found in CSV. Expected format: userId,Percentage (e.g., 101,92).');
      }
      setStudentData(data);
      setIsProcessing(false);
      setShowPreview(true);
    };
    reader.onerror = () => {
      alert('Error reading CSV file. Please try again.');
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleGenerateCertificates = async () => {
    if (!selectedExam) return;
    setIsProcessing(true);
    const payload = studentData.map(student => ({
      userId: student.userId,
      percentage: student.percentage,
      subject: selectedExam.subject,
      examId: selectedExam.id,
      templateName: selectedTemplate
    }));
    try {
      const response = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/templates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Raw server response:', errorText);
        throw new Error(`Failed to generate certificates: ${response.status} ${response.statusText} - ${errorText}`);
      }
      let result;
      try {
        result = await response.json();
        console.log('API Response:', result);
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        throw new Error('Invalid JSON response from server');
      }
      if (result.status === 'error') {
        throw new Error(result.message);
      }
      alert('Certificates generated successfully!');
      setShowCertificateModal(false);
    } catch (error) {
      console.error('Error generating certificates:', error);
      alert(`Error generating certificates: ${error.message}. Please check the server logs and ensure user IDs exist in the database.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const downloadSampleCSV = () => {
    const csvContent = 'userId,Percentage\n101,92\n102,85\n103,67\n104,78';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_student_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Upcoming Exams</h1>
        {(userType === 'admin' || userType === 'school') && (          <button 
            onClick={() => {
              if (showAddExam) {
                // Hide the form
                setShowAddExam(false);
                setIsEditing(false);
                setEditingExamId(null);
                setNewExam({ title: '', date: '', time: '', subject: '', description: '', image: '', status: null, duration: '' });
                setImagePreview('');
                setImageFile(null);
              } else {
                // Show the form
                setShowAddExam(true);
                setIsEditing(false);
                setEditingExamId(null);
                setNewExam({ title: '', date: '', time: '', subject: '', description: '', image: '', status: null, duration: '' });
                setImagePreview('');
                setImageFile(null);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            {showAddExam ? 'Cancel' : 'Add Exam'}
          </button>
        )}
      </div>

      {showCertificateModal && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowCertificateModal(false)}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">
                    Generate Certificates - {selectedExam?.title}
                  </h2>
                  <button
                    onClick={() => setShowCertificateModal(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Step 1: Select Certificate Template</h3>                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {CERTIFICATE_TEMPLATES.map((template) => (
                        <div
                          key={template.name}
                          onClick={() => {
                            setSelectedTemplate(template.name);
                          }}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedTemplate === template.name
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >                          <div className="h-0 bg-gray-100 rounded mb-3 overflow-hidden flex items-center justify-center">
                            <div className="text-center">
                              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">PDF Template</p>
                            </div>
                          </div>
                          <h4 className="font-medium">{template.title}</h4>
                          <p className="text-sm text-gray-600">{template.title} Template</p>
                          <div className="mt-2 flex items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(template.previewUrl, '_blank');
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                              Preview
                            </button>
                            {selectedTemplate === template.name && (
                              <div className="flex items-center text-blue-600">
                                <Check size={16} className="mr-1" />
                                <span className="text-sm">Selected</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}                    </div>
                  </div>
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Step 2: Upload Student Data (CSV)</h3>
                    <div className="mb-4">
                      <button
                        onClick={downloadSampleCSV}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download Sample CSV Format
                      </button>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Choose CSV File
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          Upload a CSV file with columns: userId,Percentage (e.g., 101,92)
                        </p>
                      </div>
                    </div>
                    {csvFile && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-800">
                          File uploaded: <strong>{csvFile.name}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                  {showPreview && studentData.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Step 3: Preview Student Data</h3>
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800">Total Students</h4>
                          <p className="text-2xl font-bold text-blue-600">{studentData.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800">Eligible for Certificate</h4>
                          <p className="text-2xl font-bold text-green-600">
                            {studentData.filter(s => s.eligible).length}
                          </p>
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                        <table className="w-full">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">User ID</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Percentage</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {studentData.map((student, index) => (
                              <tr key={index} className={student.eligible ? 'bg-green-50' : 'bg-red-50'}>
                                <td className="px-4 py-3 text-sm text-gray-900">{student.userId}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{student.percentage}%</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    student.eligible 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {student.eligible ? 'Eligible' : 'Not Eligible'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowCertificateModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerateCertificates}
                      disabled={isProcessing || studentData.length === 0}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Generating...' : `Generate ${studentData.length} Certificates`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showAddExam && (userType === 'admin' || userType === 'school') && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Exam' : 'Add New Exam'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title *</label>
              <input
                type="text"
                value={newExam.title}
                onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                placeholder="Enter exam title"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                value={newExam.subject}
                onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                placeholder="Enter subject"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
              <input
                type="time"
                value={newExam.time}
                onChange={(e) => setNewExam({...newExam, time: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={newExam.duration || ''}
                onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                placeholder="e.g., 2 hours, 90 minutes"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newExam.description}
              onChange={(e) => setNewExam({...newExam, description: e.target.value})}
              placeholder="Enter exam description"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Exam Image</label>
            <div className="flex gap-4 mb-4">
              <button 
                type="button"
                onClick={() => setImageUploadType('url')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  imageUploadType === 'url' 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LinkIcon size={16} />
                Image URL
              </button>
              <button 
                type="button" 
                onClick={() => setImageUploadType('file')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  imageUploadType === 'file' 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100' 
                }`}
              >
                <Upload size={16} />
                Upload File
              </button>
            </div>
            {imageUploadType === 'url' && (
              <div>
                <input
                  type="url"
                  placeholder="Enter image URL (https://...)"
                  value={newExam.image || ''}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a direct link to an image (PNG, JPG, or JPEG)
                </p>
              </div>
            )}
            {imageUploadType === 'file' && (
              <div>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choose Image File
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      or drag and drop an image here
                    </p>
                  </div>
                </div>
                {imageFile && (
                  <div className="mt-2 p-2 bg-green-100 rounded text-sm text-green-800">
                    Selected: {imageFile.name}
                  </div>
                )}
              </div>
            )}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Exam preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2iIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDIyTDE1LjA5IDguMjZMMjIgOUwxNS4wOSAxNS43NE0xMiAyMkw4LjkxIDE1Ljc0TDIgOUw5LjkxIDguMjZMMiAyWiIgZmlsbD0iIzk5OSIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==';
                      e.currentTarget.alt = 'Failed to load image';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                      setNewExam(prev => ({ ...prev, image: '' }));
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>            )}
          </div>
          
          {/* PDF Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Syllabus PDF (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                  multiple={false}
                />
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  disabled={isUploadingPdfs}
                >
                  {isUploadingPdfs ? 'Uploading...' : 'Choose PDF File'}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  PDF files up to 10MB
                </p>
              </div>
            </div>
            {pdfFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {pdfFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-100 rounded text-sm text-green-800">
                    <span className="flex items-center">
                      <FileText size={16} className="mr-2" />
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPdfFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {                setShowAddExam(false);
                setImagePreview('');
                setImageFile(null);                setPdfFiles([]);
                setIsDragOver(false);
                setNewExam({ title: '', date: '', time: '', subject: '', description: '', image: '', status: null, duration: '' });
                setIsEditing(false);
                setEditingExamId(null);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveExam}              disabled={isProcessing || isUploadingImage || isUploadingPdfs}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing || isUploadingImage || isUploadingPdfs ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Exam' : 'Add Exam')}
            </button>
          </div>        </div>
      )}

      {/* Search and Filter Section - moved below the form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search exams by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="filter-buttons">
          <div className="btn-group flex">
            <button
              className={`px-4 py-2 rounded-l-lg border-2 border-blue-600 transition-colors ${
                examFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setExamFilter('all')}
            >
              All Exams
            </button>
            <button
              className={`px-4 py-2 border-t-2 border-b-2 border-green-600 transition-colors ${
                examFilter === 'recommended' ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50'
              }`}
              onClick={() => setExamFilter('recommended')}
            >
              Recommended
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg border-2 border-gray-600 transition-colors ${
                examFilter === 'not_recommended' ? 'bg-gray-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setExamFilter('not_recommended')}
            >
              Not Recommended
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">        {exams.length > 0 ? (
          exams
            .filter(exam => {
              // Filter by status
              const statusMatch = (() => {
                if (examFilter === 'all') return true;
                if (examFilter === 'recommended') return exam.status === 'recommended';
                if (examFilter === 'not_recommended') return exam.status === null;
                return true;
              })();

              // Filter by search term
              const searchMatch = searchTerm === '' || 
                exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exam.subject.toLowerCase().includes(searchTerm.toLowerCase());

              return statusMatch && searchMatch;
            })
            .map(exam => (
            <div key={exam.id} className="group bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
              {/* Image on top */}
              {exam.image && (
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={exam.image} 
                    alt={exam.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUuMDkgOC4yNkwyMiA9TDE1LjA5IDE1Ljc0TDEyIDIyTDguOTEgMTUuNzRMMiA9TDE4LjA5IDguMjZMMiAyWiIgZmlsbD0iIzk5OSIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==';
                      e.currentTarget.alt = 'Failed to load exam image';
                    }}
                  />
                  {/* Status indicator overlay */}
                  {exam.status === 'recommended' && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Recommended
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
              )}
              
              {/* Content below image */}
              <div className="p-6">
                <div className="flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {exam.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>{formatDate(exam.date)}</span>
                    </div>                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{exam.time}</span>
                    </div>
                    {exam.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span>Duration: {exam.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{exam.subject}</span>
                    </div>
                  </div>
                  
                  {exam.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exam.description}</p>
                  )}
                  
                  {/* Status controls for admin/school */}
                  {(userType === 'admin' || userType === 'school') && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name={`status-${exam.id}`}
                            checked={exam.status === 'recommended'}
                            onChange={() => handleUpdateExamStatus(exam.id, true)}
                            disabled={isProcessing}
                            className="mr-2 accent-green-600"
                          />
                          <span className="text-green-700 font-medium">Recommend</span>
                        </label>
                        <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name={`status-${exam.id}`}
                            checked={exam.status === null}
                            onChange={() => handleUpdateExamStatus(exam.id, false)}
                            disabled={isProcessing}
                            className="mr-2 accent-gray-600"
                          />
                          <span className="text-gray-700 font-medium">Not Recommended</span>
                        </label>
                      </div>
                    </div>
                  )}
                    {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {userType === 'student' && (
                      <>
                        <button 
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex-1 justify-center"
                          onClick={() => { /* Add download materials functionality */ }}
                        >
                          <Download size={16} />
                          Materials
                        </button>
                        <button
                          onClick={() => handleViewResults(exam.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex-1 justify-center"
                        >
                          <Info size={16} />
                          Results
                        </button>
                      </>
                    )}
                    {(userType === 'admin' || userType === 'school') && (
                      <>
                        <button
                          onClick={() => handleGenerateCertificate(exam.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex-1 justify-center"
                        >
                          <FileText size={16} />
                          Certificates
                        </button>
                        <button
                          onClick={() => handleViewResults(exam.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex-1 justify-center"
                        >
                          <Info size={16} />
                          Results
                        </button>
                        <button
                          onClick={() => handleEditExam(exam)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExam(exam.id, exam.title)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm !== '' 
                ? `No exams match your search "${searchTerm}".`
                : examFilter === 'recommended' 
                ? 'No recommended exams available.' 
                : examFilter === 'not_recommended' 
                ? 'No non-recommended exams available.' 
                : isLoading 
                ? 'Loading exams...' 
                : 'No upcoming exams scheduled.'}
            </p>            {(userType === 'admin' || userType === 'school') && !isLoading && searchTerm === '' && examFilter === 'all' && (
              <button
                onClick={() => {
                  setShowAddExam(true);                  setIsEditing(false);
                  setEditingExamId(null);
                  setNewExam({ title: '', date: '', time: '', subject: '', description: '', image: '', status: null, duration: '' });
                  setImagePreview('');
                  setImageFile(null);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus size={16} />
                Add Your First Exam
              </button>            )}
          </div>
        )}
      </div>

      {/* Results Modal */}
      {showResultsModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Exam Results</h2>
                    {selectedExamForResults && (
                      <p className="text-purple-100 mt-1">
                        {selectedExamForResults.title} - {selectedExamForResults.subject}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowResultsModal(false)}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {loadingResults ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-gray-600">Loading results...</span>
                  </div>
                ) : selectedExamResults.length > 0 ? (
                  <div>
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">
                        Results Summary
                      </h3>
                      <p className="text-blue-700">
                        Total Students: <span className="font-bold">{selectedExamResults.length}</span>
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                              Student Name
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                              Percentage
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                              Grade
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                              Certificate
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedExamResults.map((result, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-4 py-3">
                                <div className="font-medium text-gray-900">
                                  {result.studentName || 'Unknown Student'}
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-3">
                                <div className="flex items-center">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    result.percentage >= 80 
                                      ? 'bg-green-100 text-green-800'
                                      : result.percentage >= 60 
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {result.percentage !== null ? `${result.percentage}%` : 'N/A'}
                                  </span>
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-3">
                                <span className={`font-medium ${
                                  result.percentage >= 80 
                                    ? 'text-green-600'
                                    : result.percentage >= 60 
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`}>
                                  {result.percentage >= 80 ? 'A' 
                                   : result.percentage >= 60 ? 'B'
                                   : result.percentage >= 40 ? 'C'
                                   : 'F'}
                                </span>
                              </td>
                              <td className="border border-gray-300 px-4 py-3">
                                {result.certificateUrl ? (
                                  <a
                                    href={result.certificateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                  >
                                    <FileText size={14} />
                                    View Certificate
                                  </a>
                                ) : (
                                  <span className="text-gray-400 text-sm">Not Available</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Info className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                    <p className="text-gray-500">
                      No results are available for this exam yet.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowResultsModal(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UpcomingExams;