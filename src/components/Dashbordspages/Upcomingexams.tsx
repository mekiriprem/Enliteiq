import React, { useState, useRef, useEffect } from 'react';
import { Clock, Calendar, Info, Download, Plus, Upload, X, FileText, Check, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

interface Exam {
  id: string;
  title: string;
  date: string;
  time: string;
  subject: string;
  description?: string;
  image?: string;
  status?: string | null;
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
  { name: 'template1', title: 'Classic', previewUrl: 'http://localhost:8081/api/templates/preview/template1' },
  { name: 'template2', title: 'Gold', previewUrl: 'http://localhost:8081/api/templates/preview/template2' },
  { name: 'template3', title: 'Blue', previewUrl: 'http://localhost:8081/api/templates/preview/template3' }
];

const UpcomingExams: React.FC<UpcomingExamsProps> = ({ userType }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddExam, setShowAddExam] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template1');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [templateImages, setTemplateImages] = useState<Map<string, string>>(new Map());
  const [loadingTemplates, setLoadingTemplates] = useState<Set<string>>(new Set());
  const [previewImage, setPreviewImage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [newExam, setNewExam] = useState<Partial<Exam>>({
    title: '',
    date: '',
    time: '',
    subject: '',
    description: '',
    image: '',
    status: null
  });

  const convertHtmlToPng = async (templateName: string, previewUrl: string): Promise<string> => {
    try {
      setLoadingTemplates(prev => new Set(prev).add(templateName));
      
      const response = await fetch(previewUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch template HTML: ${response.status}`);
      }
      
      const htmlContent = await response.text();
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.height = '600px';
      tempDiv.style.padding = '20px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      document.body.appendChild(tempDiv);
      
      try {
        const canvas = await html2canvas(tempDiv, {
          width: 800,
          height: 600,
          scale: 1,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        
        const pngDataUrl = canvas.toDataURL('image/png', 0.9);
        
        setTemplateImages(prev => new Map(prev).set(templateName, pngDataUrl));
        
        return pngDataUrl;
      } catch (canvasError) {
        console.warn('html2canvas failed, trying dom-to-image:', canvasError);
        
        const pngDataUrl = await domtoimage.toPng(tempDiv, {
          width: 800,
          height: 600,
          style: {
            backgroundColor: '#ffffff'
          }
        });
        
        setTemplateImages(prev => new Map(prev).set(templateName, pngDataUrl));
        return pngDataUrl;
      } finally {
        document.body.removeChild(tempDiv);
        setLoadingTemplates(prev => {
          const newSet = new Set(prev);
          newSet.delete(templateName);
          return newSet;
        });
      }
    } catch (error) {
      console.error(`Failed to convert template ${templateName} to PNG:`, error);
      setFailedImages(prev => new Set(prev).add(previewUrl));
      setLoadingTemplates(prev => {
        const newSet = new Set(prev);
        newSet.delete(templateName);
        return newSet;
      });
      throw error;
    }
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/exams');
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
    };
    fetchExams();
  }, []);

  useEffect(() => {
    setPreviewUrl(CERTIFICATE_TEMPLATES[0].previewUrl);
    
    const loadTemplateImages = async () => {
      try {
        const firstTemplate = CERTIFICATE_TEMPLATES[0];
        const pngDataUrl = await convertHtmlToPng(firstTemplate.name, firstTemplate.previewUrl);
        setPreviewImage(pngDataUrl);
        
        for (let i = 1; i < CERTIFICATE_TEMPLATES.length; i++) {
          const template = CERTIFICATE_TEMPLATES[i];
          try {
            await convertHtmlToPng(template.name, template.previewUrl);
          } catch (error) {
            console.error(`Failed to load template image for ${template.name}:`, error);
          }
        }
      } catch (error) {
        console.error('Failed to load initial template image:', error);
      }
    };
    
    loadTemplateImages();
  }, []);

  const handleUpdateExamStatus = async (id: String, recommend: boolean) => {
    try {
      setIsProcessing(true);
      const endpoint = recommend
        ? 'http://localhost:8081/api/exams/recommend' : {}
        
      const response = await fetch(`${endpoint}?examId=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Failed to update exam status: ${response.status}`);
      }
      const result = await response.text();
      console.log(result);
      setExams(prevExams => {
        if (recommend) {
          return prevExams.map(exam => 
            exam.id ===id 
              ? { ...exam, status: 'recommended' }
              : { ...exam, status: null }
          );
        } else {
          return prevExams.map(exam => 
            exam.id === id 
              ? { ...exam, status: null }
              : exam
          );
        }
      });
    } catch (error) {
      console.error('Error updating exam status:', error);
      alert(`Failed to update exam status: ${error}`);
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
      status: exam.status || null
    });
    setImagePreview(exam.image || '');
    setImageUploadType(exam.image ? 'url' : 'file');
    setShowAddExam(true);
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

  const uploadImageToServer = async (file: File): Promise<string> => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('http://localhost:8081/api/upload/image', {
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
    }
  };

  const handleSaveExam = async () => {
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
        }
        const examData = {
          title: newExam.title,
          date: newExam.date,
          time: newExam.time,
          subject: newExam.subject,
          description: newExam.description,
          image: finalImageUrl,
          status: newExam.status
        };
        if (isEditing && editingExamId) {
          const response = await fetch(`http://localhost:8081/api/exams/${editingExamId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examData),
          });
          if (!response.ok) {
            throw new Error(`Failed to update exam: ${response.status}`);
          }
          const updatedExam = await response.json();
          setExams(prevExams => prevExams.map(exam => 
            exam.id === editingExamId ? updatedExam : exam
          ));
        } else {
          const response = await fetch('http://localhost:8081/api/exams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examData),
          });
          if (!response.ok) {
            throw new Error(`Failed to add exam: ${response.status}`);
          }
          const newExamData = await response.json();
          setExams(prevExams => [...prevExams, newExamData]);
        }
        setNewExam({ title: '', date: '', time: '', subject: '', description: '', image: '', status: null });
        setImageFile(null);
        setImagePreview('');
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
  };

  const handleGenerateCertificate = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      setSelectedExam(exam);
      setShowCertificateModal(true);
      setStudentData([]);
      setCsvFile(null);
      setShowPreview(false);
      setSelectedTemplate('template1');
      setPreviewUrl(CERTIFICATE_TEMPLATES[0].previewUrl);
      setFailedImages(new Set());
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
      const response = await fetch('http://localhost:8081/api/templates/generate', {
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

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Upcoming Exams</h1>
        {(userType === 'admin' || userType === 'school') && (
          <button 
            onClick={() => {
              setShowAddExam(true);
              setIsEditing(false);
              setEditingExamId(null);
              setNewExam({ title: '', date: '', time: '', subject: '', description: '', image: '', status: null });
              setImagePreview('');
              setImageFile(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Exam
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
                    <h3 className="text-lg font-medium mb-4">Step 1: Select Certificate Template</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {CERTIFICATE_TEMPLATES.map((template) => (
                        <div
                          key={template.name}
                          onClick={() => {
                            setSelectedTemplate(template.name);
                            setPreviewUrl(template.previewUrl);
                            const templateImage = templateImages.get(template.name);
                            if (templateImage) {
                              setPreviewImage(templateImage);
                            } else {
                              convertHtmlToPng(template.name, template.previewUrl)
                                .then(pngDataUrl => {
                                  setPreviewImage(pngDataUrl);
                                })
                                .catch(error => {
                                  console.error('Failed to load template image:', error);
                                });
                            }
                          }}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedTemplate === template.name
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="h-32 bg-gray-100 rounded mb-3 overflow-hidden">
                            {loadingTemplates.has(template.name) ? (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                              </div>
                            ) : failedImages.has(template.previewUrl) ? (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <svg className="h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 2L15.09 8.26L22 9L15.09 15.74L12 22L8.91 15.74L2 9L8.91 8.26L12 2Z" fill="#999" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            ) : templateImages.has(template.name) ? (
                              <img
                                src={templateImages.get(template.name)!}
                                alt={template.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <svg className="h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 2L15.09 8.26L22 9L15.09 15.74L12 22L8.91 15.74L2 9L8.91 8.26L12 2Z" fill="#999" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          <h4 className="font-medium">{template.title}</h4>
                          <p className="text-sm text-gray-600">{template.title} Template</p>
                          {selectedTemplate === template.name && (
                            <div className="mt-2 flex items-center text-blue-600">
                              <Check size={16} className="mr-1" />
                              <span className="text-sm">Selected</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {previewImage && (
                      <div className="mt-6 border rounded shadow p-4 h-96">
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded">
                          <img
                            src={previewImage}
                            alt="Template Preview"
                            className="max-w-full max-h-full object-contain rounded"
                          />
                        </div>
                      </div>
                    )}
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
              <input
                type="time"
                value={newExam.time}
                onChange={(e) => setNewExam({...newExam, time: e.target.value})}
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
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ2iIgZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDIyTDE1LjA5IDguMjZMMjIgOUwxNS4wOSAxNS43NE0xMiAyMkw4LjkxIDE1Ljc0TDIgOUw5LjkxIDguMjZMMiAyWiIgZmlsbD0iIzk5OSIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==';
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
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowAddExam(false);
                setImagePreview('');
                setImageFile(null);
                setIsDragOver(false);
                setNewExam({ title: '', date: '', time: '', subject: '', description: '', image: '', status: null });
                setIsEditing(false);
                setEditingExamId(null);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveExam}
              disabled={isProcessing || isUploadingImage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing || isUploadingImage ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Exam' : 'Add Exam')}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exams.length > 0 ? (
          exams.map(exam => (
            <div key={exam.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {exam.image && (
                  <div className="md:w-48 h-48 md:h-auto overflow-hidden flex-shrink-0">
                    <img 
                      src={exam.image} 
                      alt={exam.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUuMDkgOC4yNjLMMiI9TDE4LjA5IDE1Ljc0TDEyIDIyTDguOTEgMTUuNzRMMiA5TDguOTEgOC4yNkwxMiAyWiIgZmlsbD0iIzk5OSIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==';
                        e.currentTarget.alt = 'Failed to load exam image';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex flex-col h-full">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{exam.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{formatDate(exam.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{exam.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span>{exam.subject}</span>
                      </div>
                    </div>
                    {exam.description && (
                      <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                    )}
                    {(userType === 'admin' || userType === 'school') && (
                      <div className="flex items-center gap-4 mb-3">
                        <label className="flex items-center text-sm text-gray-700">
                          <input
                            type="radio"
                            name={`status-${exam.id}`}
                            checked={exam.status === 'recommended'}
                            onChange={() => handleUpdateExamStatus(exam.id, true)}
                            disabled={isProcessing}
                            className="mr-2 accent-blue-600"
                          />
                          Recommend
                        </label>
                        <label className="flex items-center text-sm text-gray-700">
                          <input
                            type="radio"
                            name={`status-${exam.id}`}
                            checked={exam.status === null}
                            onChange={() => handleUpdateExamStatus(exam.id, false)}
                            disabled={isProcessing}
                            className="mr-2 accent-blue-600"
                          />
                          Not Recommended
                        </label>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-auto">
                      {userType === 'student' && (
                        <button 
                          className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          onClick={() => { /* Add download materials functionality */ }}
                        >
                          <Download size={16} />
                          Materials
                        </button>
                      )}
                      {(userType === 'admin' || userType === 'school') && (
                        <>
                          <button
                            onClick={() => handleGenerateCertificate(exam.id)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Generate Certificates
                          </button>
                          <button
                            onClick={() => handleEditExam(exam)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-3 flex items-center bg-white p-8 rounded-lg shadow-sm border border-gray-600 text-center justify-center">
            <p className="text-gray-500">
              {isLoading ? 'Loading exams...' : 'No upcoming exams.'}
            </p>
            {(userType === 'admin' || userType === 'school') && !isLoading && (
              <button
                onClick={() => {
                  setShowAddExam(true);
                  setIsEditing(false);
                  setEditingExamId(null);
                  setNewExam({ title: '', date: '', time: '', subject: '', description: '', image: '', status: null });
                  setImagePreview('');
                  setImageFile(null);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Exam
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingExams;