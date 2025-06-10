import React, { useState, useEffect } from "react";

interface SalesPerson {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

interface NewSalesPersonForm {
  name: string;
  email: string;
  password: string;
}

const SalesTeam: React.FC = () => {
  // State for sales persons
  const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Toggle state for Add Sales Person section
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for adding a new sales person
  const [formData, setFormData] = useState<NewSalesPersonForm>({
    name: "",
    email: "",
    password: "",
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Real-time validation states
  const [emailError, setEmailError] = useState<string | null>(null);

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handler for input changes with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time email validation
    if (name === 'email') {
      if (value.trim() === '') {
        setEmailError(null);
      } else if (!isValidEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError(null);
      }
    }
  };
  // Fetch all sales persons
  const fetchSalesPersons = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/salesman/all');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sales persons: ${response.status} ${response.statusText}`);
      }
        const data = await response.json();
      // Handle null status by setting default to 'inactive'
      const processedData = data.map((person: SalesPerson & { status: string | null }) => ({
        ...person,
        status: (person.status as 'active' | 'inactive') || 'inactive'
      }));
      setSalesPersons(processedData);
    } catch (error) {
      console.error('Error fetching sales persons:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch sales persons');
    } finally {
      setLoading(false);
    }
  };

  // Add new sales person
  const handleAddSalesPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous errors/success
    setSubmitError(null);
    setSubmitSuccess(false);
    setEmailError(null);

    // Validation
    const errors: string[] = [];
    if (!formData.name.trim()) errors.push("Name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.password.trim()) errors.push("Password is required");
    
    if (formData.email && !isValidEmail(formData.email)) {
      errors.push("Please enter a valid email address");
    }
    
    if (formData.password && formData.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (errors.length > 0) {
      setSubmitError(errors.join('. '));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8081/api/salesman/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Registration failed: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Sales person registration successful:', result);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Clear validation errors
      setEmailError(null);

      // Refresh the sales persons list
      fetchSalesPersons();

      // Hide form after success
      setTimeout(() => {
        setShowAddForm(false);
        setSubmitSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error registering sales person:', error);
      setSubmitError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Update sales person status
  const handleStatusChange = async (id: number, newStatus: 'active' | 'inactive') => {
    try {
      const response = await fetch(`http://localhost:8081/api/salesman/${id}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status} ${response.statusText}`);
      }

      // Update local state
      setSalesPersons(prev => 
        prev.map(person => 
          person.id === id ? { ...person, status: newStatus } : person
        )
      );

    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  useEffect(() => {
    // Fetch sales persons on component mount
    fetchSalesPersons();
  }, []);

  return (
    <div className="p-6">
      {/* Header with Add Sales Person Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Team</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            showAddForm
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {showAddForm ? 'Cancel' : 'Add Sales Person'}
        </button>
      </div>

      {/* Add Sales Person Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Sales Person</h2>
          
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">
                Sales person registered successfully!
              </p>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">
                {submitError}
              </p>
            </div>
          )}

          <form onSubmit={handleAddSalesPerson} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter sales person name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  emailError 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter email address"
                required
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password (minimum 6 characters)"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding...' : 'Add Sales Person'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sales Team List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Sales Team Members</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sales team...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchSalesPersons}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : salesPersons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 font-medium text-gray-700">ID</th>
                  <th className="text-left p-4 font-medium text-gray-700">Name</th>
                  <th className="text-left p-4 font-medium text-gray-700">Email</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesPersons.map((person) => (
                  <tr key={person.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{person.id}</td>
                    <td className="p-4 font-medium">{person.name}</td>
                    <td className="p-4 text-gray-600">{person.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        person.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {person.status.charAt(0).toUpperCase() + person.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={person.status}
                        onChange={(e) => handleStatusChange(person.id, e.target.value as 'active' | 'inactive')}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No sales team members found.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add First Sales Person
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesTeam;
