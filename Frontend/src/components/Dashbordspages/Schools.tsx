import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, MapPin, Mail, User, Phone, Plus, Trash2, PenLine, Building, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SchoolData {
  schoolRegistrationId: string;
  schoolName: string;
  schoolAddress: string;
  schoolEmail: string;
  yourName: string; // Maps to admin name
  schoolPhone: string;
  status: 'active' | 'inactive';
  areYou?: string;
  yourEmail?: string;
  yourMobile?: string;
  schoolCity?: string;
  schoolState?: string;
  schoolCountry?: string;
  schoolPincode?: string;
  principalName?: string;
  principalContact?: string;
}

interface FormSchoolData extends SchoolData {
  password?: string;
}

interface SchoolsProps {
  userType: 'admin' | 'sales' | 'student' | 'school';
}

const Schools: React.FC<SchoolsProps> = ({ userType }) => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<FormSchoolData | null>(null);  const [newSchool, setNewSchool] = useState<Omit<FormSchoolData, 'schoolRegistrationId'>>({
    schoolName: '',
    schoolAddress: '',
    schoolEmail: '',
    yourName: '',
    schoolPhone: '',
    status: 'active',
    areYou: 'Principal',
    yourEmail: '',
    yourMobile: '',
    schoolCity: '',
    schoolState: '',
    schoolCountry: '',
    schoolPincode: '',
    principalName: '',
    principalContact: '',
  });
  const [searchTerm, setSearchTerm] = useState('');  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Fetch schools based on filter
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const url = filterStatus === 'active' 
          ? 'https://enlightiq.enlightiq.in/api/schools/active'
          : 'https://enlightiq.enlightiq.in/api/schools';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch schools');
        }
        const data: SchoolData[] = await response.json();
        setSchools(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Error fetching schools: ${errorMessage}`);
      }
    };
    fetchSchools();
  }, [filterStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingSchool) {
      setEditingSchool((prev) => prev ? { ...prev, [name]: value } : null);
    } else {
      setNewSchool((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userType !== 'admin' && userType !== 'sales') {
      setError('Only admin or sales users can add schools');
      return;    }
    try {
      const payload = {
        schoolName: newSchool.schoolName,
        schoolAddress: newSchool.schoolAddress,
        schoolEmail: newSchool.schoolEmail,
        yourName: newSchool.yourName,
        schoolPhone: newSchool.schoolPhone,
        areYou: newSchool.areYou,
        yourEmail: newSchool.yourEmail,
        yourMobile: newSchool.yourMobile,
        schoolCity: newSchool.schoolCity,
        schoolState: newSchool.schoolState,
        schoolCountry: newSchool.schoolCountry,
        schoolPincode: newSchool.schoolPincode,
        principalName: newSchool.principalName,
        principalContact: newSchool.principalContact,
      };

      console.log('Adding school payload:', payload);

      // Try application/json
      let response = await fetch('https://enlightiq.enlightiq.in/api/schools/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data = await response.json();
      console.log('JSON response:', { status: response.status, data });

      if (!response.ok) {
        if (response.status === 415) {
          console.warn('Retrying with multipart/form-data');
          const formDataPayload = new FormData();          Object.entries(payload).forEach(([key, value]) => {
            formDataPayload.append(key, value as string);
          });

          response = await fetch('https://enlightiq.enlightiq.in/api/schools/register', {
            method: 'POST',
            body: formDataPayload,
          });

          data = await response.json();
          console.log('FormData response:', { status: response.status, data });

          if (!response.ok) {
            throw new Error(data.message || `Failed to add school with status ${response.status}`);
          }
        } else {
          throw new Error(data.message || `Failed to add school with status ${response.status}`);
        }
      }

      const savedSchool: SchoolData = data;
      setSchools([...schools, savedSchool]);
      setShowAddForm(false);      setNewSchool({
        schoolName: '',
        schoolAddress: '',
        schoolEmail: '',
        yourName: '',
        schoolPhone: '',
        status: 'active',
        areYou: 'Principal',
        yourEmail: '',
        yourMobile: '',
        schoolCity: '',
        schoolState: '',
        schoolCountry: '',
        schoolPincode: '',
        principalName: '',
        principalContact: '',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error adding school: ${errorMessage}`);
    }
  };

  const handleEditSchool = (school: SchoolData) => {
    if (userType !== 'admin' && userType !== 'sales') {
      setError('Only admin or sales users can edit schools');
      return;
    }
    setEditingSchool({ ...school });
  };

  const handleUpdateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchool) return;
    try {      const payload: Partial<FormSchoolData> = {
        schoolRegistrationId: editingSchool.schoolRegistrationId,
        schoolName: editingSchool.schoolName,
        schoolAddress: editingSchool.schoolAddress,
        schoolEmail: editingSchool.schoolEmail,
        yourName: editingSchool.yourName,
        schoolPhone: editingSchool.schoolPhone,
        areYou: editingSchool.areYou,
        yourEmail: editingSchool.yourEmail,
        yourMobile: editingSchool.yourMobile,
        schoolCity: editingSchool.schoolCity,
        schoolState: editingSchool.schoolState,
        schoolCountry: editingSchool.schoolCountry,
        schoolPincode: editingSchool.schoolPincode,
        principalName: editingSchool.principalName,
        principalContact: editingSchool.principalContact,
      };

      console.log('Updating school payload:', payload);

      const response = await fetch(`https://enlightiq.enlightiq.in/api/schools/${editingSchool.schoolRegistrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Update response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || `Failed to update school with status ${response.status}`);
      }

      const updatedSchool: SchoolData = data;
      setSchools(schools.map((s) => (s.schoolRegistrationId === updatedSchool.schoolRegistrationId ? updatedSchool : s)));
      setEditingSchool(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error updating school: ${errorMessage}`);
    }  };

  const handleToggleStatus = async (school: SchoolData) => {
    if (userType !== 'admin' && userType !== 'sales') {
      setError('Only admin or sales users can toggle school status');
      return;
    }
    try {
      const response = await fetch(`https://enlightiq.enlightiq.in/api/schools/toggle-status/${school.schoolRegistrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Toggle status response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || `Failed to toggle school status with status ${response.status}`);
      }

      setSchools(schools.map((s) => (s.schoolRegistrationId === school.schoolRegistrationId ? { ...s, status: data.newStatus } : s)));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error toggling school status: ${errorMessage}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingSchool(null);
  };

  const handleDeleteSchool = async (id: string) => {
    if (userType !== 'admin') {
      setError('Only admin users can delete schools');
      return;
    }
    try {
      const response = await fetch(`https://enlightiq.enlightiq.in/api/schools/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.status === 204 ? {} : await response.json();
      console.log('Delete response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || `Failed to delete school with status ${response.status}`);
      }

      setSchools(schools.filter((school) => school.schoolRegistrationId !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error deleting school: ${errorMessage}`);
    }
  };  const filteredSchools = schools.filter(
    (school) =>
      school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.schoolAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.yourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.schoolEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.schoolPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: 'active' | 'inactive') => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-sm underline">Dismiss</button>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schools Management</h1>
        {(userType === 'admin' || userType === 'sales') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add School
          </button>
        )}
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">All Schools</option>
          <option value="active">Active Schools</option>
          <option value="inactive">Inactive Schools</option>
        </select>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {(showAddForm || editingSchool) && (userType === 'admin' || userType === 'sales') && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingSchool ? 'Edit School' : 'Add New School'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingSchool ? handleUpdateSchool : handleAddSchool}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <School className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="schoolName"
                      value={editingSchool ? editingSchool.schoolName : newSchool.schoolName}
                      onChange={handleInputChange}
                      placeholder="Enter school name"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="schoolAddress"
                      value={editingSchool ? editingSchool.schoolAddress : newSchool.schoolAddress}
                      onChange={handleInputChange}
                      placeholder="Enter school address"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="schoolEmail"
                      value={editingSchool ? editingSchool.schoolEmail : newSchool.schoolEmail}
                      onChange={handleInputChange}
                      placeholder="Enter school email"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="yourName"
                      value={editingSchool ? editingSchool.yourName : newSchool.yourName}
                      onChange={handleInputChange}
                      placeholder="Enter admin name"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="schoolPhone"
                      value={editingSchool ? editingSchool.schoolPhone : newSchool.schoolPhone}
                      onChange={handleInputChange}
                      placeholder="Enter school phone"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="yourEmail"
                      value={editingSchool ? editingSchool.yourEmail : newSchool.yourEmail}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Mobile</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="yourMobile"
                      value={editingSchool ? editingSchool.yourMobile : newSchool.yourMobile}
                      onChange={handleInputChange}
                      placeholder="Enter your mobile"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School City</label>
                  <input
                    type="text"
                    name="schoolCity"
                    value={editingSchool ? editingSchool.schoolCity : newSchool.schoolCity}
                    onChange={handleInputChange}
                    placeholder="Enter school city"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School State</label>
                  <input
                    type="text"
                    name="schoolState"
                    value={editingSchool ? editingSchool.schoolState : newSchool.schoolState}
                    onChange={handleInputChange}
                    placeholder="Enter school state"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Country</label>
                  <input
                    type="text"
                    name="schoolCountry"
                    value={editingSchool ? editingSchool.schoolCountry : newSchool.schoolCountry}
                    onChange={handleInputChange}
                    placeholder="Enter school country"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Pincode</label>
                  <input
                    type="text"
                    name="schoolPincode"
                    value={editingSchool ? editingSchool.schoolPincode : newSchool.schoolPincode}
                    onChange={handleInputChange}
                    placeholder="Enter school pincode"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
                  <input
                    type="text"
                    name="principalName"
                    value={editingSchool ? editingSchool.principalName : newSchool.principalName}
                    onChange={handleInputChange}
                    placeholder="Enter principal name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Principal Contact</label>
                  <input
                    type="tel"
                    name="principalContact"
                    value={editingSchool ? editingSchool.principalContact : newSchool.principalContact}
                    onChange={handleInputChange}
                    placeholder="Enter principal contact"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Are You</label>
                  <select
                    name="areYou"
                    value={editingSchool ? editingSchool.areYou : newSchool.areYou}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="Principal">Principal</option>
                    <option value="Admin">Admin</option>
                    <option value="Other">Other</option>
                  </select>                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={editingSchool ? handleCancelEdit : () => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingSchool ? 'Update School' : 'Add School'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Schools List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block overflow-x-auto">            <table className="w-full table-auto">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">School Name</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Address</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Admin Name</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Phone</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>              <tbody>
                {filteredSchools.map((school) => (
                  <tr key={school.schoolRegistrationId} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm">{school.schoolName}</td>
                    <td className="px-4 py-3 text-sm">{school.schoolAddress}</td>
                    <td className="px-4 py-3 text-sm">{school.schoolEmail}</td>
                    <td className="px-4 py-3 text-sm">{school.yourName}</td>
                    <td className="px-4 py-3 text-sm">{school.schoolPhone}</td>                    <td className="px-4 py-3 text-sm">
                      {(userType === 'admin' || userType === 'sales') ? (
                        <button
                          onClick={() => handleToggleStatus(school)}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${getStatusBadgeClass(school.status)}`}
                          title={`Click to toggle to ${school.status === 'active' ? 'inactive' : 'active'}`}
                        >
                          {school.status}
                        </button>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(school.status)}`}>
                          {school.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">                      <div className="flex items-center space-x-2">
                        {(userType === 'admin' || userType === 'sales') && (
                          <button
                            onClick={() => handleEditSchool(school)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Edit School"
                          >
                            <PenLine size={16} />
                          </button>
                        )}
                        {userType === 'admin' && (
                          <button
                            onClick={() => handleDeleteSchool(school.schoolRegistrationId)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete School"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>          <div className="md:hidden space-y-4">
            {filteredSchools.map((school) => (
              <div key={school.schoolRegistrationId} className="border border-gray-100 rounded-lg p-4 bg-gray-50">                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">{school.schoolName}</h3>
                  </div>                  <div className="flex items-center space-x-2">
                    {(userType === 'admin' || userType === 'sales') ? (
                      <button
                        onClick={() => handleToggleStatus(school)}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${getStatusBadgeClass(school.status)}`}
                        title={`Click to toggle to ${school.status === 'active' ? 'inactive' : 'active'}`}
                      >
                        {school.status}
                      </button>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(school.status)}`}>
                        {school.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{school.schoolAddress}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{school.schoolEmail}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <User className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{school.yourName}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{school.schoolPhone}</span>
                  </div>
                </div>                <div className="mt-4 flex justify-end space-x-2">
                  {(userType === 'admin' || userType === 'sales') && (
                    <button
                      onClick={() => handleEditSchool(school)}
                      className="p-2 bg-gray-100 text-blue-600 rounded-md"
                      title="Edit School"
                    >
                      <PenLine size={16} />
                    </button>
                  )}
                  {userType === 'admin' && (
                    <button
                      onClick={() => handleDeleteSchool(school.schoolRegistrationId)}
                      className="p-2 bg-gray-100 text-red-600 rounded-md"
                      title="Delete School"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredSchools.length === 0 && (
            <div className="text-center py-8">
              <School className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No schools found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Schools;