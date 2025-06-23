
import { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Download, FileText, AlertCircle } from "lucide-react";

interface PDFResource {
  id: string;
  name: string;
  url: string;
  size?: string;
  uploadDate?: string;
}

interface ApiPDFResponse {
  id?: string;
  name?: string;
  filename?: string;
  url?: string;
  downloadUrl?: string;
  size?: string;
  uploadDate?: string;
  createdAt?: string;
}

interface ExamData {
  id: string;
  title: string;
  syllabus?: string;
  [key: string]: unknown;
}

interface ExamResourcesTabProps {
  examId: string;
  examData?: ExamData; // Pass the full exam data to get syllabus URL
}

const ExamResourcesTab = ({ examId, examData }: ExamResourcesTabProps) => {
  const [pdfs, setPdfs] = useState<PDFResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        setLoading(true);
        
        // If examData is passed and has syllabus URL, use it directly
        if (examData && examData.syllabus) {
          const pdfResource: PDFResource = {
            id: "syllabus",
            name: "Exam Syllabus",
            url: examData.syllabus,
            size: "Unknown",
            uploadDate: "N/A"
          };
          setPdfs([pdfResource]);
          return;
        }
        
        // Otherwise, fetch exam data to get syllabus URL
        const response = await fetch(`https://enlightiq.enlightiq.in/api/exams/${examId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch exam data: ${response.status}`);
        }
          const data = await response.json();
        
        // Check if exam has syllabus PDF
        if (data.syllabus) {
          const pdfResource: PDFResource = {
            id: "syllabus",
            name: "Exam Syllabus",
            url: data.syllabus,
            size: "Unknown",
            uploadDate: "N/A"
          };
          setPdfs([pdfResource]);
        } else {
          setPdfs([]); // No PDFs available
        }
      } catch (err) {
        console.error('Error fetching PDFs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchPDFs();
    }
  }, [examId, examData]);

  const handleDownload = (pdf: PDFResource) => {
    if (pdf.url && pdf.url !== '#') {
      window.open(pdf.url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-3 dark:text-white">Study Resources</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading resources...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-3 dark:text-white">Study Resources</h2>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="flex items-center p-6">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-3 dark:text-white">Study Resources</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Download the study materials and resources for this exam.
      </p>
      
      {pdfs.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">No study resources available yet.</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Resources will be uploaded closer to the exam date.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pdfs.map((pdf) => (
            <Card key={pdf.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{pdf.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        {pdf.size && <span>{pdf.size}</span>}
                        {pdf.uploadDate && (
                          <>
                            <span>•</span>
                            <span>Uploaded {new Date(pdf.uploadDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(pdf)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    disabled={!pdf.url || pdf.url === '#'}
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamResourcesTab;
