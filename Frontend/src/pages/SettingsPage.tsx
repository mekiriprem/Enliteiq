import React, { useState } from "react";
import { useAuth } from "../components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Shield,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Save,
  User,
  Mail,
  Database,
  Download,
  Trash2,
  AlertTriangle
} from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public", // public, private, friends
    showEmail: true,
    showPhone: false,
    allowDataCollection: true,
    marketingEmails: false,
    securityAlerts: true,
    loginNotifications: true,
    dataSharing: false
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    examReminders: true,
    resultNotifications: true,
    newsUpdates: false,
    promotionalEmails: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setIsSaving(true);
      
      // API call to change password would go here
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (response.ok) {
        setPasswordSuccess(true);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordError("An error occurred while changing password");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrivacyChange = (setting: string, value: boolean | string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      // API call to save settings
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          privacySettings,
          notificationSettings
        }),
      });

      if (response.ok) {
        // Show success message
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings");
      }
    } catch (error) {
      console.error("Save settings error:", error);
      alert("An error occurred while saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const downloadData = () => {
    // Generate and download user data
    const userData = {
      profile: {
        name: user?.name,
        email: user?.email,
        role: user?.role
      },
      settings: {
        privacy: privacySettings,
        notifications: notificationSettings
      },
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-data-${user?.name?.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const deleteAccount = async () => {
    try {
      // API call to delete account
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (response.ok) {
        alert("Account deleted successfully");
        // Logout and redirect
        navigate('/login');
      } else {
        alert("Failed to delete account");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      alert("An error occurred while deleting account");
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Settings" userName={user?.name || "User"} />
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/profile')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Profile
        </button>

        <div className="space-y-6">
          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Lock className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold">Security Settings</h2>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {passwordError}
                </div>
              )}
              
              {passwordSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
                  Password changed successfully!
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={16} />
                {isSaving ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold">Privacy Settings</h2>
            </div>

            <div className="space-y-6">
              {/* Profile Visibility */}
              <div>
                <h3 className="text-lg font-medium mb-3">Profile Visibility</h3>
                <div className="space-y-2">
                  {['public', 'private', 'friends'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value={option}
                        checked={privacySettings.profileVisibility === option}
                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                        className="mr-3"
                      />
                      <span className="capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Information Visibility */}
              <div>
                <h3 className="text-lg font-medium mb-3">Information Visibility</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span>Show email address</span>
                    <input
                      type="checkbox"
                      checked={privacySettings.showEmail}
                      onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                      className="toggle-checkbox"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Show phone number</span>
                    <input
                      type="checkbox"
                      checked={privacySettings.showPhone}
                      onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                      className="toggle-checkbox"
                    />
                  </label>
                </div>
              </div>

              {/* Data Settings */}
              <div>
                <h3 className="text-lg font-medium mb-3">Data & Analytics</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div>
                      <span>Allow data collection for analytics</span>
                      <p className="text-sm text-gray-500">Help us improve our services</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.allowDataCollection}
                      onChange={(e) => handlePrivacyChange('allowDataCollection', e.target.checked)}
                      className="toggle-checkbox"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <span>Share data with educational partners</span>
                      <p className="text-sm text-gray-500">Anonymous data for research</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.dataSharing}
                      onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                      className="toggle-checkbox"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bell className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span>Email notifications</span>
                  <p className="text-sm text-gray-500">General notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                  className="toggle-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span>SMS notifications</span>
                  <p className="text-sm text-gray-500">Important updates via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.smsNotifications}
                  onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                  className="toggle-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span>Exam reminders</span>
                  <p className="text-sm text-gray-500">Notifications before scheduled exams</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.examReminders}
                  onChange={(e) => handleNotificationChange('examReminders', e.target.checked)}
                  className="toggle-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span>Result notifications</span>
                  <p className="text-sm text-gray-500">When exam results are available</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.resultNotifications}
                  onChange={(e) => handleNotificationChange('resultNotifications', e.target.checked)}
                  className="toggle-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span>Security alerts</span>
                  <p className="text-sm text-gray-500">Account security notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.securityAlerts}
                  onChange={(e) => handlePrivacyChange('securityAlerts', e.target.checked)}
                  className="toggle-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span>Login notifications</span>
                  <p className="text-sm text-gray-500">Notify when account is accessed</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.loginNotifications}
                  onChange={(e) => handlePrivacyChange('loginNotifications', e.target.checked)}
                  className="toggle-checkbox"
                />
              </label>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Data Management</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Download your data</h3>
                  <p className="text-sm text-gray-600">Get a copy of all your account data</p>
                </div>
                <button
                  onClick={downloadData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h3 className="font-medium text-red-700">Delete account</h3>
                  <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save All Settings"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold">Delete Account</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
