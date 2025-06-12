import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, MapPin, Mail, User, Plus, Trash2, PenLine, Building, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SchoolData {
  schoolRegistrationId: string;
  schoolName: string;
  schoolAddress: string;
  schoolEmail: string;
  schoolAdminName: string;
  status: 'active' | 'inactive';
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
  const [editingSchool, setEditingSchool] = useState<FormSchoolData | null>(null);
  const [newSchool, setNewSchool] = useState<Omit<FormSchoolData, 'schoolRegistrationId'>>({
    schoolName: '',
    schoolAddress: '',
    schoolEmail: '',
    schoolAdminName: '',
    password: '',
    status: 'active',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/schools', {
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
        if (err instanceof Error) {
          setError('Error fetching schools: ' + err.message);
        } else {
          setError('Error fetching schools');
        }
      }
    };
    fetchSchools();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingSchool) {
      setEditingSchool((prev) =>
        prev
          ? {
              ...prev,
              [name]: value,
            }
          : null
      );
    } else {
      setNewSchool((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userType !== 'admin' && userType !== 'sales') {
      alert('Only admin or sales users can add schools');
      return;
    }
    if (!newSchool.password) {
      alert('Password is required for new schools');
      return;
    }
    try {
      const response = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/schools/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchool),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add school');
      }
      const savedSchool: SchoolData = await response.json();
      setSchools([...schools, savedSchool]);
      setShowAddForm(false);
      setNewSchool({
        schoolName: '',
        schoolAddress: '',
        schoolEmail: '',
        schoolAdminName: '',
        password: '',
        status: 'active',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Error adding school: ' + err.message);
      } else {
        alert('Error adding school');
      }
    }
  };

  const handleEditSchool = (school: SchoolData) => {
    if (userType !== 'admin' && userType !== 'sales') {
      alert('Only admin or sales users can edit schools');
      return;
    }
    setEditingSchool({ ...school, password: '' });
  };

  const handleUpdateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchool) return;
    try {
      const requestBody: FormSchoolData = {
        schoolRegistrationId: editingSchool.schoolRegistrationId,
        schoolName: editingSchool.schoolName,
        schoolAddress: editingSchool.schoolAddress,
        schoolEmail: editingSchool.schoolEmail,
        schoolAdminName: editingSchool.schoolAdminName,
        status: editingSchool.status,
      };
      if (editingSchool.password) {
        requestBody.password = editingSchool.password;
      }
      const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/schools/${editingSchool.schoolRegistrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update school');
      }
      const updatedSchool: SchoolData = await response.json();
      setSchools(schools.map((s) => (s.schoolRegistrationId === updatedSchool.schoolRegistrationId ? updatedSchool : s)));
      setEditingSchool(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Error updating school: ' + err.message);
      } else {
        alert('Error updating school');
      }
    }
  };

  const handleToggleStatus = async (school: SchoolData) => {
    if (userType !== 'admin' && userType !== 'sales') {
      alert('Only admin or sales users can toggle school status');
      return;
    }
    try {
      const newStatus = school.status === 'active' ? 'inactive' : 'active';
      const requestBody: SchoolData = {
        ...school,
        status: newStatus,
      };
      const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/schools/${school.schoolRegistrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to toggle school status');
      }
      const updatedSchool: SchoolData = await response.json();
      setSchools(schools.map((s) => (s.schoolRegistrationId === updatedSchool.schoolRegistrationId ? updatedSchool : s)));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Error toggling school status: ' + err.message);
      } else {
        alert('Error toggling school status');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingSchool(null);
  };

  const handleDeleteSchool = async (id: string) => {
    if (userType !== 'admin') {
      alert('Only admin users can delete schools');
      return;
    }
    try {
      const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/schools/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete school');
      }
      setSchools(schools.filter((school) => school.schoolRegistrationId !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Error deleting school: ' + err.message);
      } else {
        alert('Error deleting school');
      }
    }
  };

  const filteredSchools = schools.filter(
    (school) =>
      school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.schoolAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.schoolAdminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.schoolEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: 'active' | 'inactive') => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
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

      {(showAddForm || editingSchool) && (userType === 'admin' || userType === 'sales') && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingSchool ? 'Edit School' : 'Add New School'}</h2>
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
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                    name="schoolAdminName"
                    value={editingSchool ? editingSchool.schoolAdminName : newSchool.schoolAdminName}
                    onChange={handleInputChange}
                    placeholder="Enter admin name"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingSchool ? 'New Password (optional)' : 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={editingSchool ? editingSchool.password || '' : newSchool.password}
                    onChange={handleInputChange}
                    placeholder={editingSchool ? 'Enter new password (optional)' : 'Enter password'}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required={!editingSchool}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editingSchool ? editingSchool.status : newSchool.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={editingSchool ? handleCancelEdit : () => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingSchool ? 'Update School' : 'Add School'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold">Schools List</h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="px-4 py-3 text-sm font-medium text-gray-500">School Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Address</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Admin Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((school) => (
                <tr key={school.schoolRegistrationId} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-sm">{school.schoolName}</td>
                  <td className="px-4 py-3 text-sm">{school.schoolAddress}</td>
                  <td className="px-4 py-3 text-sm">{school.schoolEmail}</td>
                  <td className="px-4 py-3 text-sm">{school.schoolAdminName}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(school.status)}`}>
                      {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      {(userType === 'admin' || userType === 'sales') && (
                        <button
                          onClick={() => handleEditSchool(school)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit School"
                        >
                          <PenLine size={16} />
                        </button>
                      )}
                      {/* <button
                        onClick={() => navigate(`/school/${school.schoolRegistrationId}`)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View Details"
                      >
                        <School size={16} />
                      </button> */}
                      {(userType === 'admin' || userType === 'sales') && (
                        <button
                          onClick={() => handleToggleStatus(school)}
                          className="text-purple-500 hover:text-purple-700"
                          title={school.status === 'active' ? 'Deactivate School' : 'Activate School'}
                        >
                          {school.status === 'active' ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      )}
                      {/* {userType === 'admin' && (
                        <button
                          onClick={() => handleDeleteSchool(school.schoolRegistrationId)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete School"
                        >
                          <Trash2 size={16} />
                        </button>
                      )} */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          <div className="space-y-4">
            {filteredSchools.map((school) => (
              <div key={school.schoolRegistrationId} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">{school.schoolName}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(school.status)}`}>
                    {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                  </span>
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
                    <span className="text-sm">{school.schoolAdminName}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  {(userType === 'admin' || userType === 'sales') && (
                    <button
                      onClick={() => handleEditSchool(school)}
                      className="p-2 bg-gray-100 text-blue-600 rounded-md"
                      title="Edit School"
                    >
                      <PenLine size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/school/${school.schoolRegistrationId}`)}
                    className="p-2 bg-gray-100 text-blue-500 rounded-md"
                    title="View Details"
                  >
                    <School size={16} />
                  </button>
                  {(userType === 'admin' || userType === 'sales') && (
                    <button
                      onClick={() => handleToggleStatus(school)}
                      className="p-2 bg-gray-100 text-purple-500 rounded-md"
                      title={school.status === 'active' ? 'Deactivate School' : 'Activate School'}
                    >
                      {school.status === 'active' ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  )}
                  {userType === 'admin' && (
                    <button
                      onClick={() => handleDeleteSchool(school.schoolRegistrationId)}
                      className="p-2 bg-gray-100 text-red-500 rounded-md"
                      title="Delete School"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-center py-8">
            <School className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No schools found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schools;