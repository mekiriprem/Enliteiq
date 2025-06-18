import React, { useState, useEffect } from "react";
import { Building, TrendingUp, PhoneCall, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SalesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [totalSchools, setTotalSchools] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch total number of schools
  useEffect(() => {
    const fetchSchoolsCount = async () => {
      try {
        const response = await fetch('https://api.infororg.com/api/schools', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch schools');
        }
        
        const schools = await response.json();
        setTotalSchools(schools.length);
      } catch (error) {
        console.error('Error fetching schools count:', error);
        // Keep default value of 0 if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolsCount();
  }, []);
  return (
    <div className="p-6">
      <div className="mb-4 md:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <Building className="h-6 w-6 text-education-blue" />
          </div>          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Schools</h3>
            <p className="text-2xl font-semibold">
              {loading ? "..." : totalSchools}
            </p>
          </div>
        </div>        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
            <TrendingUp className="h-6 w-6 text-education-teal" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">New Leads</h3>
            <p className="text-2xl font-semibold">42</p>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <PhoneCall className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Calls Made</h3>
            <p className="text-2xl font-semibold">128</p>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <CreditCard className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <p className="text-2xl font-semibold">₹45K</p>
          </div>
        </div>
      </div>      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex border-b border-gray-200">
            <button className="px-6 py-3 text-sm font-medium text-education-blue border-b-2 border-education-blue">
              Schools Management
            </button>
          </div>
          <div className="p-6">
            <button 
              onClick={() => navigate('/sales-schools')}
              className="w-full bg-education-blue text-white p-3 rounded-md hover:bg-blue-700 transition-colors mb-4"
            >
              Manage Schools
            </button>
            <p className="text-gray-600 text-sm">
              Add new schools, update existing school information, and track school onboarding status.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex border-b border-gray-200">
            <button className="px-6 py-3 text-sm font-medium text-education-blue border-b-2 border-education-blue">
              Task Management
            </button>
          </div>
          <div className="p-6">
            <button 
              onClick={() => navigate('/sales-tasks')}
              className="w-full bg-education-blue text-white p-3 rounded-md hover:bg-blue-700 transition-colors mb-4"
            >
              View Tasks
            </button>
            <p className="text-gray-600 text-sm">
              View your assigned tasks, update their status, and provide comments on your progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
