import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Country, State, City } from "country-state-city";
import Hero from "../components/home/Hero";
import ExamCard from "../components/exams/ExamCard";
import TestimonialCard from "../components/home/TestimonialCard";

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

interface SchoolFormData {
  areYou: string;
  yourName: string;
  yourEmail: string;
  yourMobile: string;
  schoolName: string;
  schoolAddress: string;
  schoolCity: string;
  schoolState: string;
  schoolCountry: string;
  schoolPincode: string;
  schoolEmail: string;
  schoolPhone: string;
  principalName: string;
  principalContact: string;
}

interface CoordinatorFormData {
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  age: string;
  educationalQualifications: string;
  otherQualifications: string;
  profession: string;
  experienceWithSchools: "Yes" | "No";
  reasonToWork: string;
  yearsOfExperience: string;
  principalsKnown: string;
  knowAnyoneInEnlighthiq: "Yes" | "No";
  additionalInfo: string;
  howHeardAbout: string;
}

const HomePage = ({ onRegisterClick, isLoggedIn = false }: { onRegisterClick: () => void; isLoggedIn?: boolean }) => {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    schoolEmail: "",
    schoolAdminName: "",
    password: "",
    confirmPassword: "",
  });
  const [schoolFormData, setSchoolFormData] = useState<SchoolFormData>({
    areYou: "",
    yourName: "",
    yourEmail: "",
    yourMobile: "",
    schoolName: "",
    schoolAddress: "",
    schoolCity: "",
    schoolState: "",
    schoolCountry: "",
    schoolPincode: "",
    schoolEmail: "",
    schoolPhone: "",
    principalName: "",
    principalContact: "",
  });
  const [coordinatorFormData, setCoordinatorFormData] = useState<CoordinatorFormData>({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    age: "",
    educationalQualifications: "",
    otherQualifications: "",
    profession: "",
    experienceWithSchools: "No",
    reasonToWork: "",
    yearsOfExperience: "",
    principalsKnown: "",
    knowAnyoneInEnlighthiq: "No",
    additionalInfo: "",
    howHeardAbout: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPartnerSchoolModalOpen, setIsPartnerSchoolModalOpen] = useState(false);
  const [isCoordinatorModalOpen, setIsCoordinatorModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [schoolSubmitError, setSchoolSubmitError] = useState<string | null>(null);
  const [schoolSubmitSuccess, setSchoolSubmitSuccess] = useState(false);
  const [schoolEmailError, setSchoolEmailError] = useState<string | null>(null);
  const [coordinatorSubmitError, setCoordinatorSubmitError] = useState<string | null>(null);
  const [coordinatorSubmitSuccess, setCoordinatorSubmitSuccess] = useState(false);
  const [coordinatorEmailError, setCoordinatorEmailError] = useState<string | null>(null);
  // Country, State, City dropdown state
  const [countries, setCountries] = useState<{ isoCode: string; name: string }[]>([]);
  const [states, setStates] = useState<{ isoCode: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");

  // Country codes for phone numbers
  const [yourMobileCountryCode, setYourMobileCountryCode] = useState<string>("+91");
  const [schoolPhoneCountryCode, setSchoolPhoneCountryCode] = useState<string>("+91");
  const [principalContactCountryCode, setPrincipalContactCountryCode] = useState<string>("+91");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "schoolEmail") {
      if (value.trim() === "") {
        setEmailError(null);
      } else if (!isValidEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError(null);
      }
    }

    if (name === "confirmPassword" || name === "password") {
      const currentPassword = name === "password" ? value : formData.password;
      const currentConfirmPassword = name === "confirmPassword" ? value : formData.confirmPassword;
      if (currentConfirmPassword.trim() === "") {
        setPasswordError(null);
      } else if (currentPassword !== currentConfirmPassword) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError(null);
      }
    }
  };
  const handleSchoolInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSchoolFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Handle country selection
    if (name === "schoolCountry") {
      setSelectedCountry(value);
      setSchoolFormData((prev) => ({
        ...prev,
        schoolState: "",
        schoolCity: "",
      }));
    }

    // Handle state selection
    if (name === "schoolState") {
      setSelectedState(value);
      setSchoolFormData((prev) => ({
        ...prev,
        schoolCity: "",
      }));
    }

    if (name === "yourEmail" || name === "schoolEmail") {
      if (value.trim() === "") {
        setSchoolEmailError(null);
      } else if (!isValidEmail(value)) {
        setSchoolEmailError("Please enter a valid email address");
      } else {
        setSchoolEmailError(null);
      }
    }
  };

  const handleCoordinatorInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCoordinatorFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      if (value.trim() === "") {
        setCoordinatorEmailError(null);
      } else if (!isValidEmail(value)) {
        setCoordinatorEmailError("Please enter a valid email address");
      } else {
        setCoordinatorEmailError(null);
      }
    }

    if (name === "address" && value.length > 500) {
      setCoordinatorFormData((prev) => ({
        ...prev,
        address: value.slice(0, 500),
      }));
    }

    if (name === "additionalInfo" && value.length > 500) {
      setCoordinatorFormData((prev) => ({
        ...prev,
        additionalInfo: value.slice(0, 500),
      }));
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.schoolName.trim()) errors.push("School name is required");
    if (!formData.schoolAddress.trim()) errors.push("School address is required");
    if (!formData.schoolEmail.trim()) errors.push("School email is required");
    if (!formData.schoolAdminName.trim()) errors.push("School admin name is required");
    if (!formData.password.trim()) errors.push("Password is required");
    if (!formData.confirmPassword.trim()) errors.push("Confirm password is required");
    if (formData.schoolEmail && !isValidEmail(formData.schoolEmail)) {
      errors.push("Please enter a valid email address");
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }
    if (formData.password && formData.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    return errors;
  };

  const validateSchoolForm = () => {
    const errors: string[] = [];
    if (!schoolFormData.areYou.trim()) errors.push("Please select your role");
    if (!schoolFormData.yourName.trim()) errors.push("Your name is required");
    if (!schoolFormData.yourEmail.trim()) errors.push("Your email is required");
    if (!schoolFormData.yourMobile.trim()) errors.push("Your mobile number is required");
    if (!schoolFormData.schoolName.trim()) errors.push("School name is required");
    if (!schoolFormData.schoolAddress.trim()) errors.push("School address is required");
    if (!schoolFormData.schoolCity.trim()) errors.push("School city is required");
    if (!schoolFormData.schoolState.trim()) errors.push("School state is required");
    if (!schoolFormData.schoolCountry.trim()) errors.push("School country is required");
    if (!schoolFormData.schoolPincode.trim()) errors.push("School pincode is required");
    if (!schoolFormData.schoolEmail.trim()) errors.push("School email is required");
    if (!schoolFormData.schoolPhone.trim()) errors.push("School phone number is required");
    if (!schoolFormData.principalName.trim()) errors.push("Principal name is required");
    if (!schoolFormData.principalContact.trim()) errors.push("Principal contact number is required");

    if (schoolFormData.yourEmail && !isValidEmail(schoolFormData.yourEmail)) {
      errors.push("Please enter a valid email address for yourself");
    }
    if (schoolFormData.schoolEmail && !isValidEmail(schoolFormData.schoolEmail)) {
      errors.push("Please enter a valid school email address");
    }
    if (schoolFormData.yourMobile && !isValidPhone(schoolFormData.yourMobile)) {
      errors.push("Please enter a valid 10-digit mobile number");
    }
    if (schoolFormData.principalContact && !isValidPhone(schoolFormData.principalContact)) {
      errors.push("Please enter a valid 10-digit principal contact number");
    }
    if (schoolFormData.schoolPhone && !isValidPhone(schoolFormData.schoolPhone)) {
      errors.push("Please enter a valid 10-digit school phone number");
    }
    return errors;
  };

  const validateCoordinatorForm = () => {
    const errors: string[] = [];
    if (!coordinatorFormData.fullName.trim()) errors.push("Full name is required");
    if (!coordinatorFormData.email.trim()) errors.push("Email is required");
    if (!coordinatorFormData.mobile.trim()) errors.push("Mobile number is required");
    if (!coordinatorFormData.address.trim()) errors.push("Address is required");
    if (!coordinatorFormData.city.trim()) errors.push("City is required");
    if (!coordinatorFormData.district.trim()) errors.push("District is required");
    if (!coordinatorFormData.state.trim()) errors.push("State is required");
    if (!coordinatorFormData.pinCode.trim()) errors.push("Pin code is required");
    if (!coordinatorFormData.age.trim()) errors.push("Age is required");
    if (!coordinatorFormData.educationalQualifications.trim()) errors.push("Educational qualifications are required");
    if (!coordinatorFormData.profession.trim()) errors.push("Profession is required");
    if (!coordinatorFormData.reasonToWork.trim()) errors.push("Reason to work with Enlighthiq is required");
    if (!coordinatorFormData.yearsOfExperience.trim()) errors.push("Years of experience is required");
    if (!coordinatorFormData.principalsKnown.trim()) errors.push("Number of school principals known is required");
    if (!coordinatorFormData.howHeardAbout.trim()) errors.push("Please select how you heard about Enlighthiq");

    if (coordinatorFormData.email && !isValidEmail(coordinatorFormData.email)) {
      errors.push("Please enter a valid email address");
    }
    if (coordinatorFormData.age && !/^\d+$/.test(coordinatorFormData.age)) {
      errors.push("Age must be a number");
    }
    if (coordinatorFormData.yearsOfExperience && !/^\d+$/.test(coordinatorFormData.yearsOfExperience)) {
      errors.push("Years of experience must be a number");
    }
    if (coordinatorFormData.principalsKnown && !/^\d+$/.test(coordinatorFormData.principalsKnown)) {
      errors.push("Number of school principals known must be a number");
    }
    if (coordinatorFormData.reasonToWork.trim().split(/\s+/).length > 3) {
      errors.push("Reason to work with Enlighthiq must be 3 words or fewer");
    }
    return errors;
  };

  // const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   if (e) e.preventDefault();
  //   setSubmitError(null);
  //   setSubmitSuccess(false);
  //   setEmailError(null);
  //   setPasswordError(null);

  //   const validationErrors = validateForm();
  //   if (validationErrors.length > 0) {
  //     setSubmitError(validationErrors.join(". "));
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const apiData = {
  //       schoolName: formData.schoolName.trim(),
  //       schoolAddress: formData.schoolAddress.trim(),
  //       schoolEmail: formData.schoolEmail.trim(),
  //       schoolAdminName: formData.schoolAdminName.trim(),
  //       password: formData.password,
  //     };

  //     const response = await fetch("http://localhost:8080/api/schools/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(apiData),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.text();
  //       throw new Error(`Registration failed: ${response.status} - ${errorData}`);
  //     }

  //     const result = await response.json();
  //     console.log("School registration successful:", result);
  //     setSubmitSuccess(true);
  //     setFormData({
  //       schoolName: "",
  //       schoolAddress: "",
  //       schoolEmail: "",
  //       schoolAdminName: "",
  //       password: "",
  //       confirmPassword: "",
  //     });
  //     setEmailError(null);
  //     setPasswordError(null);
  //     setTimeout(() => {
  //       setIsModalOpen(false);
  //       setSubmitSuccess(false);
  //     }, 2000);
  //   } catch (error) {
  //     console.error("Error registering school:", error);
  //     setSubmitError(error instanceof Error ? error.message : "Registration failed. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

 const handleSchoolSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSchoolSubmitError(null);
  setSchoolSubmitSuccess(false);
  setSchoolEmailError(null);

  const validationErrors = validateSchoolForm();
  if (validationErrors.length > 0) {
    setSchoolSubmitError(validationErrors.join(". "));
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:8081/api/schools/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schoolFormData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    console.log("School registered successfully:", data);
    setSchoolSubmitSuccess(true);

    // Reset the form
    setSchoolFormData({
      areYou: "",
      yourName: "",
      yourEmail: "",
      yourMobile: "",
      schoolName: "",
      schoolAddress: "",
      schoolCity: "",
      schoolState: "",
      schoolCountry: "",
      schoolPincode: "",
      schoolEmail: "",
      schoolPhone: "",
      principalName: "",
      principalContact: "",
    });

    // Close modal after 2s
    setTimeout(() => {
      setIsPartnerSchoolModalOpen(false);
      setSchoolSubmitSuccess(false);
    }, 2000);
  } catch (error) {
    console.error("Error submitting school partner form:", error);
    setSchoolSubmitError(error instanceof Error ? error.message : "Submission failed. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


const handleCoordinatorSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setCoordinatorSubmitError(null);
  setCoordinatorSubmitSuccess(false);
  setCoordinatorEmailError(null);

  const validationErrors = validateCoordinatorForm();
  if (validationErrors.length > 0) {
    setCoordinatorSubmitError(validationErrors.join(". "));
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:8081/api/coordinators/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coordinatorFormData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const result = await response.json();
    console.log("Coordinator registered:", result);
    setCoordinatorSubmitSuccess(true);

    setCoordinatorFormData({
      fullName: "",
      email: "",
      mobile: "",
      address: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      age: "",
      educationalQualifications: "",
      otherQualifications: "",
      profession: "",
      experienceWithSchools: "No",
      reasonToWork: "",
      yearsOfExperience: "",
      principalsKnown: "",
      knowAnyoneInEnlighthiq: "No",
      additionalInfo: "",
      howHeardAbout: "",
    });

    setTimeout(() => {
      setIsCoordinatorModalOpen(false);
      setCoordinatorSubmitSuccess(false);
    }, 2000);
  } catch (error) {
    console.error("Error submitting coordinator form:", error);
    setCoordinatorSubmitError(
      error instanceof Error ? error.message : "Submission failed. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const [featuredExams, setFeaturedExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedExams = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://olympiad-zynlogic.hardikgarg.me/api/recommended");
        if (!response.ok) {
          throw new Error(`Failed to fetch recommended exams: ${response.status} ${response.statusText}`);
        }
        const exams = await response.json();
        console.log("Fetched recommended exams:", exams);
        setFeaturedExams(exams.slice(0, 3));
      } catch (error) {
        console.error("Error fetching recommended exams:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch exams");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendedExams();
  }, []);

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = () => {
      const countryList = Country.getAllCountries();
      setCountries(countryList);
    };
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry);
      setStates(stateList);
      setCities([]);
      setSelectedState("");
    } else {
      setStates([]);
      setCities([]);
      setSelectedState("");
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cityList = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(cityList);
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  const mapExamToCardFormat = (exam: Exam) => ({
    id: exam.id,
    title: exam.title,
    subject: exam.subject,
    date: exam.date,
    duration: "2 hours",
    image: exam.image || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  });

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Student, Grade 10",
      content: "Enlighthiq helped me prepare for my science olympiad. The mock tests were incredibly similar to the actual exam, which gave me the confidence I needed to succeed.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Parent",
      content: "As a parent, I appreciate the detailed progress reports that help me understand where my child needs additional support. The platform is intuitive and comprehensive.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 4,
    },
    {
      name: "Emma Wilson",
      role: "School Coordinator",
      content: "Managing multiple students through Enlighthiq has streamlined our exam preparation process. The analytics provide valuable insights for our teaching strategy.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5,
    },
  ];

  return (
    <div>
      <Hero />      {/* Featured Exams Section */}
      <section className="py-16 relative">
        <div className="container relative z-10">
          <div className="flex justify-between items-center mb-10">
            <Link to="/exams">
              <h2 className="text-3xl font-bold text-gray-800">Featured Exams</h2>
            </Link>
            <Link to="/exams" className="text-blue-600 hover:text-blue-700 flex items-center font-medium">
              View All <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading featured exams...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : featuredExams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredExams.map((exam) => (
                <ExamCard key={exam.id} {...mapExamToCardFormat(exam)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured exams available at the moment.</p>
              <Link to="/exams" className="text-blue-600 hover:text-blue-700 font-medium">
                View All Exams
              </Link>
            </div>
          )}
        </div>      </section>

      {/* Become a Partner School and Olympiad Coordinator Sections - Hidden when user is logged in */}
      {!isLoggedIn && (
        <>
          {/* Become a Partner School Section */}
          <section className="py-16 relative">
        <div className="container relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Become a Partner School
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Schools interested in allowing their students to appear in Enlighthiq Olympiad exams may fill in the following details & submit.
            </p>
            <p className="text-md text-gray-600 max-w-2xl mx-auto mb-6">
              An Enlighthiq representative will contact you & assist you in registering with & appearing in Enlighthiq Olympiads.
            </p>
            <div className="text-center mt-8 pt -10">
              <button
                onClick={() => {
                  setIsPartnerSchoolModalOpen(true);
                  setIsCoordinatorModalOpen(false);
                  setIsModalOpen(false);
                }}
                className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
              >
                Register as a Partner School
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner School Modal */}
      {isPartnerSchoolModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-all duration-500"
          onClick={() => setIsPartnerSchoolModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-0 sm:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
              Become a Partner School
            </h2>
            {schoolSubmitSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-sm text-center">
                  Application submitted successfully! We'll be in touch soon.
                </p>
              </div>
            )}
            {schoolSubmitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{schoolSubmitError}</p>
              </div>
            )}
            <form onSubmit={handleSchoolSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="areYou">
                  Are You *
                </label>
                <select
                  name="areYou"
                  value={schoolFormData.areYou}
                  onChange={handleSchoolInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Principal">Principal</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Parent">Parent</option>
                  <option value="Student">Student</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="yourName">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="yourName"
                  value={schoolFormData.yourName}
                  onChange={handleSchoolInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="yourEmail">
                  Your Email ID *
                </label>
                <input
                  type="email"
                  name="yourEmail"
                  value={schoolFormData.yourEmail}
                  onChange={handleSchoolInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base transition-all duration-200 ${
                    schoolEmailError 
                      ? "border-red-300 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter your email"
                  required
                />
                {schoolEmailError && (
                  <p className="mt-1 text-sm text-red-600">{schoolEmailError}</p>
                )}
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="yourMobile">
                  Your Mobile No * (10 digits)
                </label>
                <div className="flex">                  <select
                    value={yourMobileCountryCode}
                    onChange={(e) => setYourMobileCountryCode(e.target.value)}
                    className="w-20 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+86">+86</option>
                    <option value="+33">+33</option>
                    <option value="+49">+49</option>
                    <option value="+81">+81</option>
                    <option value="+82">+82</option>
                    <option value="+65">+65</option>
                  </select>
                  <input
                    type="text"
                    name="yourMobile"
                    value={schoolFormData.yourMobile}
                    onChange={handleSchoolInputChange}
                    className="flex-1 p-3 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolName">
                  School Name *
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={schoolFormData.schoolName}
                  onChange={handleSchoolInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter complete school name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolAddress">
                  School Address *
                </label>
                <textarea
                  name="schoolAddress"
                  value={schoolFormData.schoolAddress}
                  onChange={handleSchoolInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter complete school address"
                  rows={3}
                  required
                />              </div>              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolCountry">
                    School Country *
                  </label>
                  <select
                    name="schoolCountry"
                    value={schoolFormData.schoolCountry}
                    onChange={handleSchoolInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolState">
                    School State *
                  </label>
                  <select
                    name="schoolState"
                    value={schoolFormData.schoolState}
                    onChange={handleSchoolInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                    required
                    disabled={states.length === 0}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolCity">
                    School City *
                  </label>
                  <select
                    name="schoolCity"
                    value={schoolFormData.schoolCity}
                    onChange={handleSchoolInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                    required
                    disabled={cities.length === 0}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolPincode">
                    School Pincode *
                  </label>
                  <input
                    type="text"
                    name="schoolPincode"
                    value={schoolFormData.schoolPincode}
                    onChange={handleSchoolInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                    placeholder="Enter school pincode"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolEmail">
                  School Email ID *
                </label>
                <input
                  type="email"
                  name="schoolEmail"
                  value={schoolFormData.schoolEmail}
                  onChange={handleSchoolInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base transition-all duration-200 ${
                    schoolEmailError 
                      ? "border-red-300 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter school email"
                  required
                />
                {schoolEmailError && (
                  <p className="mt-1 text-sm text-red-600">{schoolEmailError}</p>
                )}
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolPhone">
                  School Phone No * (10 digits)
                </label>
                <div className="flex">
                  <select
                    value={schoolPhoneCountryCode}
                    onChange={(e) => setSchoolPhoneCountryCode(e.target.value)}
                    className="w-20 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+86">+86</option>
                    <option value="+33">+33</option>
                    <option value="+49">+49</option>
                    <option value="+81">+81</option>
                    <option value="+82">+82</option>
                    <option value="+65">+65</option>
                  </select>
                  <input
                    type="text"
                    name="schoolPhone"
                    value={schoolFormData.schoolPhone}
                    onChange={handleSchoolInputChange}
                    className="flex-1 p-3 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                    placeholder="Enter school phone number"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="principalName">
                  Principal Name *
                </label>
                <input
                  type="text"
                  name="principalName"
                  value={schoolFormData.principalName}
                  onChange={handleSchoolInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter principal name"
                  required
                />
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="principalContact">
                  Principal Contact No * (10 digits)
                </label>
                <div className="flex">
                  <select
                    value={principalContactCountryCode}
                    onChange={(e) => setPrincipalContactCountryCode(e.target.value)}
                    className="w-20 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+86">+86</option>
                    <option value="+33">+33</option>
                    <option value="+49">+49</option>
                    <option value="+81">+81</option>
                    <option value="+82">+82</option>
                    <option value="+65">+65</option>
                  </select>
                  <input
                    type="text"
                    name="principalContact"
                    value={schoolFormData.principalContact}
                    onChange={handleSchoolInputChange}
                    className="flex-1 p-3 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                    placeholder="Enter principal contact number"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                <button
                  onClick={() => setIsPartnerSchoolModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-all duration-300"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold transition-all duration-300"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Olympiad Coordinator Section */}
      <section className="py-16 relative">
        <div className="container relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Become an Olympiad Coordinator
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              FREELANCE WORK IN YOUR REGION. If you are a working/retired Teacher, Principal, Educational Consultant, Social Worker, Housewife, or a professional with a passion for education, you can join us as an Enlighthiq Program Coordinator.
            </p>
            <p className="text-md text-gray-600 max-w-2xl mx-auto mb-6">
              Please fill in the following details and submit the form; we will connect with you to join hands to boost education in your area:
            </p>
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setIsCoordinatorModalOpen(true);
                  setIsPartnerSchoolModalOpen(false);
                  setIsModalOpen(false);
                }}
                className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
              >
                Apply as an Olympiad Coordinator
              </button>
            </div>
            <div className="text-center mt-6">
              <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Olympiad Coordinator Modal */}
      {isCoordinatorModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-all duration-500"
          onClick={() => setIsCoordinatorModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-0 sm:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
              Become an Olympiad Coordinator
            </h2>
            {coordinatorSubmitSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-sm text-center">
                  Application submitted successfully! We'll be in touch soon.
                </p>
              </div>
            )}
            {coordinatorSubmitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{coordinatorSubmitError}</p>
              </div>
            )}
            <form onSubmit={handleCoordinatorSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={coordinatorFormData.fullName}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Your E-Mail ID *
                </label>
                <input
                  type="email"
                  name="email"
                  value={coordinatorFormData.email}
                  onChange={handleCoordinatorInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base transition-all duration-200 ${
                    coordinatorEmailError 
                      ? "border-red-300 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter your email"
                  required
                />
                {coordinatorEmailError && (
                  <p className="mt-1 text-sm text-red-600">{coordinatorEmailError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="mobile">
                  Mobile No./Resi. No. *
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={coordinatorFormData.mobile}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                  Address * (Max 500 characters)
                </label>
                <textarea
                  name="address"
                  value={coordinatorFormData.address}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter your address"
                  rows={3}
                  maxLength={500}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {coordinatorFormData.address.length}/500 characters
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={coordinatorFormData.city}
                    onChange={handleCoordinatorInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                    placeholder="Enter your city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="district">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={coordinatorFormData.district}
                    onChange={handleCoordinatorInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                    placeholder="Enter your district"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="state">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={coordinatorFormData.state}
                    onChange={handleCoordinatorInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                    placeholder="Enter your state"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pinCode">
                    Pin Code *
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={coordinatorFormData.pinCode}
                    onChange={handleCoordinatorInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                    placeholder="Enter your pin code"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="age">
                  Your Age * (Only in Numbers)
                </label>
                <input
                  type="text"
                  name="age"
                  value={coordinatorFormData.age}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter your age"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="educationalQualifications">
                  Educational Qualifications *
                </label>
                <input
                  type="text"
                  name="educationalQualifications"
                  value={coordinatorFormData.educationalQualifications}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter your educational qualifications"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="otherQualifications">
                  Other Qualifications
                </label>
                <input
                  type="text"
                  name="otherQualifications"
                  value={coordinatorFormData.otherQualifications}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter other qualifications (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profession">
                  Profession *
                </label>
                <input
                  type="text"
                  name="profession"
                  value={coordinatorFormData.profession}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter your profession"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Do you have experience of working with schools? *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="experienceWithSchools"
                      value="Yes"
                      checked={coordinatorFormData.experienceWithSchools === "Yes"}
                      onChange={handleCoordinatorInputChange}
                      className="mr-2"
                      required
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="experienceWithSchools"
                      value="No"
                      checked={coordinatorFormData.experienceWithSchools === "No"}
                      onChange={handleCoordinatorInputChange}
                      className="mr-2"
                      required
                    />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reasonToWork">
                  Why do you want to work with Enlighthiq? Give 3 words which capture your reply. *
                </label>
                <input
                  type="text"
                  name="reasonToWork"
                  value={coordinatorFormData.reasonToWork}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="E.g., Passion Education Impact"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="yearsOfExperience">
                  How many years of total work experience do you have? *
                </label>
                <input
                  type="text"
                  name="yearsOfExperience"
                  value={coordinatorFormData.yearsOfExperience}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter years of experience"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="principalsKnown">
                  How many school principals do you know in your area? *
                </label>
                <input
                  type="text"
                  name="principalsKnown"
                  value={coordinatorFormData.principalsKnown}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter number of principals"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Do you know anyone in Enlighthiq? *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="knowAnyoneInEnlighthiq"
                      value="Yes"
                      checked={coordinatorFormData.knowAnyoneInEnlighthiq === "Yes"}
                      onChange={handleCoordinatorInputChange}
                      className="mr-2"
                      required
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="knowAnyoneInEnlighthiq"
                      value="No"
                      checked={coordinatorFormData.knowAnyoneInEnlighthiq === "No"}
                      onChange={handleCoordinatorInputChange}
                      className="mr-2"
                      required
                    />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="additionalInfo">
                  Any other useful information you would like to share (Max 500 characters)
                </label>
                <textarea
                  name="additionalInfo"
                  value={coordinatorFormData.additionalInfo}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter additional information (optional)"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {coordinatorFormData.additionalInfo.length}/500 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="howHeardAbout">
                  How did you come to know about Enlighthiq? *
                </label>
                <select
                  name="howHeardAbout"
                  value={coordinatorFormData.howHeardAbout}
                  onChange={handleCoordinatorInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="School">School</option>
                  <option value="Student">Student</option>
                  <option value="Internet">Internet</option>
                  <option value="News Paper">News Paper</option>
                  <option value="From Somebody">From Somebody</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                <button
                  onClick={() => setIsCoordinatorModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-all duration-300"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold transition-all duration-300"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>        </div>
      )}

      {/* Modal for School Registration Form */}
        </>
      )}
    
      {/* Testimonials Section */}
      <section className="py-16 relative">
        <div className="container relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Hear from students, parents, and schools who have experienced success with Enlighthiq.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
