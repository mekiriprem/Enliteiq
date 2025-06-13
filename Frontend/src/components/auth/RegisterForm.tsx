import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Country, State, City } from "country-state-city";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    userClass: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [manualSchoolName, setManualSchoolName] = useState("");
  const [manualSchoolAddress, setManualSchoolAddress] = useState("");

  // Get all countries from country-state-city
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch schools on mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/schools/active");
        if (!response.ok) {
          throw new Error(`Failed to fetch schools: ${response.statusText}`);
        }
        const data = await response.json();
        setSchools(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load schools:", err);
        setError("Unable to load schools. Please try again later.");
        setSchools([]);
      }
    };
    fetchSchools();
  }, []);
  // Update states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
    } else {
      setStates([]);
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedCountry]);

  // Update cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(stateCities);
      setSelectedCity("");
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedCountry, selectedState]);

  // Filter schools based on selected country and state
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const selectedCountryName = countries.find((c) => c.isoCode === selectedCountry)?.name;
      const selectedStateName = states.find((s) => s.isoCode === selectedState)?.name;
      const filtered = schools.filter((school) => {
        const matchesCountry = school.schoolCountry === selectedCountry || 
          school.schoolCountry === selectedCountryName;
        const matchesState = school.schoolState === selectedState || 
          school.schoolState === selectedStateName;
        return matchesCountry && matchesState;
      });
      setFilteredSchools(filtered);
      setSelectedSchoolId("");
    } else {
      setFilteredSchools(schools);
      setSelectedSchoolId("");
    }
  }, [selectedCountry, selectedState, schools, countries, states]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!selectedSchoolId || (selectedSchoolId === "other" && (!manualSchoolName || !manualSchoolAddress))) {
      setError("Please select a school or provide manual school details");
      return;
    }

    setIsLoading(true);

    try {
      const selectedSchool = selectedSchoolId !== "other"
        ? schools.find((school) => school.schoolRegistrationId.toString() === selectedSchoolId)
        : null;

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        userClass: formData.userClass,
        password: formData.password,
        school: selectedSchoolId === "other"
          ? `${manualSchoolName.toUpperCase()}, ${manualSchoolAddress.toUpperCase()}`
          : selectedSchool
            ? `${selectedSchool.schoolName}, ${selectedSchool.schoolAddress}`
            : "",
      };

      console.log("Sending payload:", payload);

      // Try application/json
      let response = await fetch(" http://localhost:8081/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = await response.json();
      console.log("JSON response:", { status: response.status, data });

      if (!response.ok) {
        if (response.status === 415) {
          console.warn("Retrying with multipart/form-data");
          const formDataPayload = new FormData();
          Object.entries(payload).forEach(([key, value]) => {
            formDataPayload.append(key, value);
          });

          response = await fetch(" http://localhost:8081/api/signup", {
            method: "POST",
            body: formDataPayload, // No Content-Type header for FormData
          });

          data = await response.json();
          console.log("FormData response:", { status: response.status, data });

          if (!response.ok) {
            throw new Error(data.message || `Registration failed with status ${response.status}`);
          }
        } else {
          throw new Error(data.message || `Registration failed with status ${response.status}`);
        }
      }

      console.log("User registered:", data.userId);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-red-600">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-6">
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>          {/* Country */}
          <div className="mb-6">
            <label className="block mb-1">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Country</option>
              {countries
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
            </select>
          </div>

          {/* State */}
          <div className="mb-6">
            <label className="block mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              required
              disabled={!selectedCountry || states.length === 0}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select State</option>
              {states
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
            </select>
          </div>

          {/* City */}
          <div className="mb-6">
            <label className="block mb-1">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              required
              disabled={!selectedState || cities.length === 0}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select City</option>
              {cities
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Class */}
          <div className="mb-6">
            <label className="block mb-1">Class</label>
            <input
              type="text"
              name="userClass"
              value={formData.userClass}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* School Dropdown */}
          <div className="mb-6">
            <label className="block mb-1">School</label>
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              required
              disabled={!selectedCountry || !selectedState}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select School</option>
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <option key={school.schoolRegistrationId} value={school.schoolRegistrationId}>
                    {school.schoolName}, {school.schoolAddress}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No schools available
                </option>
              )}
              <option value="other">Other (Manual Entry)</option>
            </select>
          </div>

          {selectedSchoolId === "other" && (
            <>
              <div className="mb-6">
                <label className="block mb-1">School Name</label>
                <input
                  type="text"
                  value={manualSchoolName}
                  onChange={(e) => setManualSchoolName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-1">School Address</label>
                <input
                  type="text"
                  value={manualSchoolAddress}
                  onChange={(e) => setManualSchoolAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </>
          )}

          {/* Password */}
          <div className="mb-6">
            <label className="block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;