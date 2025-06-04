
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ChevronDown, ChevronUp, Info, Shield } from "lucide-react";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // FAQ Data
  const faqs = [
    {
      question: "What is MyOlympiad?",
      answer: "MyOlympiad is an educational platform designed to help students prepare for academic competitions and olympiads through practice exams, mock tests, and comprehensive learning resources. We focus on subjects like mathematics, science, and language arts to help students excel in competitive examinations."
    },
    {
      question: "How do I register for an exam?",
      answer: "To register for an exam, create an account or log in to your existing account. Browse the available exams in the Exam Listing page, select the exam you're interested in, and click on the 'Register for Exam' button on the exam details page. Follow the instructions to complete your registration and payment process."
    },
    {
      question: "Are the mock tests free?",
      answer: "We offer both free and premium mock tests. Free mock tests give you a basic understanding of the exam format, while premium mock tests provide a more comprehensive experience with detailed solutions, performance analytics, and personalized feedback. Check each exam page for specific details about the mock tests available."
    },
    {
      question: "How are exams conducted?",
      answer: "Most exams are conducted online through our secure testing platform. You'll need a computer or tablet with a reliable internet connection. Some exams may have proctoring requirements such as webcam monitoring. Detailed instructions are provided before each exam. Certain special olympiads might be conducted in physical centers, which will be clearly specified in the exam details."
    },
    {
      question: "How do I view my results?",
      answer: "After completing an exam or mock test, your results will be available immediately for auto-graded assessments. For manually graded portions, results will be published within 3-5 business days. You can access all your results through your student dashboard under the 'Results' section. Detailed analysis, performance charts, and improvement suggestions are provided with each result."
    },
    {
      question: "Can parents monitor their child's progress?",
      answer: "Yes, parents can create a parent account and link it to their child's student account. This gives parents access to a specialized dashboard where they can monitor exam registrations, test results, performance analytics, and progress over time. Parents can also receive email notifications about upcoming exams and new results."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes, we offer a mobile app for both iOS and Android platforms. The app provides access to all core features including exam registration, mock tests, result viewing, and learning resources. However, for the best experience during actual exams, we recommend using a desktop or laptop computer."
    },
    {
      question: "How can schools participate?",
      answer: "Schools can register for a School Account which allows them to manage multiple students, organize group registrations for exams, track collective performance, and access special school resources. We also offer School Coordinator programs for teachers who want to facilitate olympiad participation at their institutions."
    }
  ];

  // About Content
  const aboutContent = {
    mission: "At MyOlympiad, our mission is to democratize access to high-quality academic competition preparation, enabling students from all backgrounds to showcase their talents and reach their full potential.",
    vision: "We envision a world where every student has the opportunity to participate in academic competitions that challenge their intellect, build confidence, and open doors to future educational and career opportunities.",
    story: "MyOlympiad was founded in 2020 by a group of education enthusiasts who saw a gap in the availability of quality preparation resources for academic competitions. What started as a small collection of practice tests has grown into a comprehensive platform serving students worldwide. Our team consists of educators, technologists, and former olympiad champions who understand what it takes to succeed in these competitive environments.",
    team: [
      {
        name: "Dr. Jane Wilson",
        role: "Founder & CEO",
        bio: "Former Mathematics Olympiad gold medalist with a Ph.D. in Education Technology from Stanford University.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
      },
      {
        name: "Prof. Michael Chen",
        role: "Chief Academic Officer",
        bio: "Mathematics professor with 15 years of experience training national olympiad teams.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
      },
      {
        name: "Sarah Johnson",
        role: "Head of Content",
        bio: "Education specialist with expertise in creating engaging assessment materials.",
        image: "https://images.unsplash.com/photo-1554727242-741c14fa561c?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
      },
      {
        name: "David Park",
        role: "CTO",
        bio: "Software engineer passionate about building educational technology platforms.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
      }
    ]
  };

  // Terms of Service Content
  const termsContent = {
    lastUpdated: "May 1, 2025",
    sections: [
      {
        title: "1. Acceptance of Terms",
        content: "By accessing or using the MyOlympiad platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
      },
      {
        title: "2. Use License",
        content: "Permission is granted to temporarily access the materials on MyOlympiad's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose; attempt to decompile or reverse engineer any software contained on MyOlympiad's website; remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or 'mirror' the materials on any other server."
      },
      {
        title: "3. User Accounts",
        content: "To access certain features of the platform, you will need to create a user account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activities that occur under your account. You must immediately notify MyOlympiad of any unauthorized use of your account or any other breach of security."
      },
      {
        title: "4. Exam and Test Rules",
        content: "When taking exams or tests on the platform, you agree to follow all instructions and rules provided. Any attempt to cheat, share exam content, or violate the integrity of the assessment process may result in immediate termination of your account and disqualification from current and future examinations."
      },
      {
        title: "5. Payment and Refunds",
        content: "Payments for premium services are processed through secure third-party payment processors. All fees are non-refundable unless otherwise specified in the specific exam or service description. In cases of technical failure that prevents completion of an exam, MyOlympiad may provide a retake opportunity or credit at its discretion."
      },
      {
        title: "6. Limitation of Liability",
        content: "MyOlympiad shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the platform or any content provided by MyOlympiad."
      }
    ]
  };

  // Privacy Policy Content
  const privacyContent = {
    lastUpdated: "May 1, 2025",
    sections: [
      {
        title: "1. Information Collection",
        content: "We collect information from you when you register on our site, place an order, subscribe to a newsletter, respond to a survey, fill out a form or enter information on our site. When registering, you may be asked for your name, email address, mailing address, phone number, or other information. For students under 13, we require verifiable parental consent before collecting personal information."
      },
      {
        title: "2. Information Use",
        content: "Any information we collect may be used to: personalize your experience, improve our website, improve customer service, process transactions, administer contests or promotions, send periodic emails related to your account or other products and services."
      },
      {
        title: "3. Information Protection",
        content: "We implement a variety of security measures to maintain the safety of your personal information. All supplied sensitive information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our payment gateway provider's database, accessible only to those authorized with special access rights who are required to keep the information confidential."
      },
      {
        title: "4. Cookie Usage",
        content: "We use cookies to understand and save your preferences for future visits, keep track of advertisements, and compile aggregate data about site traffic and site interaction so that we can offer better site experiences in the future."
      },
      {
        title: "5. Third-Party Disclosure",
        content: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as necessary to provide services you've requested (such as payment processing). This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential."
      },
      {
        title: "6. Children's Online Privacy Protection Act (COPPA)",
        content: "We comply with the requirements of COPPA. We do not knowingly collect personal information from children under 13 without verifiable parental consent. If we learn we have collected personal information from a child under 13 without parental consent, we will delete that information."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="education-container">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-education-dark mb-4">About MyOlympiad</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn more about our mission, values, and how we're helping students excel in academic competitions.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="about" className="text-base py-3">
              <Info className="mr-2 h-4 w-4" /> About Us
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-base py-3">
              <BookOpen className="mr-2 h-4 w-4" /> FAQ
            </TabsTrigger>
            <TabsTrigger value="terms" className="text-base py-3">
              <Shield className="mr-2 h-4 w-4" /> Terms & Privacy
            </TabsTrigger>
          </TabsList>

          {/* About Us Tab Content */}
          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full inline-block mb-2">
                      <svg className="h-8 w-8 text-education-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                  </div>
                  <p className="text-gray-700">{aboutContent.mission}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full inline-block mb-2">
                      <svg className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M16 10l-4 4-2-2"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                  </div>
                  <p className="text-gray-700">{aboutContent.vision}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="bg-yellow-100 p-3 rounded-full inline-block mb-2">
                      <svg className="h-8 w-8 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Our Values</h3>
                  </div>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <svg className="h-3 w-3 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      </span>
                      Excellence in Education
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <svg className="h-3 w-3 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      </span>
                      Accessibility for All
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <svg className="h-3 w-3 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      </span>
                      Innovation in Assessment
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <svg className="h-3 w-3 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      </span>
                      Integrity in Operations
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-education-dark">Our Story</h2>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <p className="text-gray-700 leading-relaxed">
                  {aboutContent.story}
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-50 px-3 text-lg font-medium text-gray-900">Our Milestones</span>
                </div>
              </div>

              <div className="mt-8 max-w-3xl mx-auto">
                <div className="flex flex-col space-y-6">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="h-10 w-10 rounded-full bg-education-blue flex items-center justify-center">
                        <span className="text-white font-semibold">1</span>
                      </div>
                      <div className="h-full w-0.5 bg-education-blue/30"></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex-1 mb-4">
                      <div className="font-semibold mb-1">2020: Foundation</div>
                      <p className="text-gray-600 text-sm">MyOlympiad was founded with a mission to democratize access to high-quality academic competition preparation.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="h-10 w-10 rounded-full bg-education-blue flex items-center justify-center">
                        <span className="text-white font-semibold">2</span>
                      </div>
                      <div className="h-full w-0.5 bg-education-blue/30"></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex-1 mb-4">
                      <div className="font-semibold mb-1">2021: First Olympiad</div>
                      <p className="text-gray-600 text-sm">Successfully hosted our first online Mathematics Olympiad with participants from 12 countries.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="h-10 w-10 rounded-full bg-education-blue flex items-center justify-center">
                        <span className="text-white font-semibold">3</span>
                      </div>
                      <div className="h-full w-0.5 bg-education-blue/30"></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex-1 mb-4">
                      <div className="font-semibold mb-1">2022: School Partnerships</div>
                      <p className="text-gray-600 text-sm">Launched our school partnership program, enabling institutions to easily register their students for olympiads.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="h-10 w-10 rounded-full bg-education-blue flex items-center justify-center">
                        <span className="text-white font-semibold">4</span>
                      </div>
                      <div className="h-full w-0.5 bg-education-blue/30 hidden"></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
                      <div className="font-semibold mb-1">2024: Global Expansion</div>
                      <p className="text-gray-600 text-sm">Reached 100,000 students across 50+ countries with exams available in 10 different languages.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-education-dark">Our Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {aboutContent.team.map((member, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <img src={member.image} alt={member.name} className="w-full h-48 object-cover object-center" />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-education-blue mb-2">{member.role}</p>
                      <p className="text-sm text-gray-600">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* FAQ Tab Content */}
          <TabsContent value="faq">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6 text-education-dark">Frequently Asked Questions</h2>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Collapsible 
                    key={index} 
                    open={openFaqs[index]} 
                    onOpenChange={() => toggleFaq(index)}
                    className="border border-gray-200 rounded-md"
                  >
                    <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left font-medium">
                      <span>{faq.question}</span>
                      {openFaqs[index] ? 
                        <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      }
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 pt-0 text-gray-600 border-t border-gray-200">
                      {faq.answer}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>

              <div className="mt-12 bg-education-blue/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Still Have Questions?</h3>
                <p className="mb-4">Can't find the answer you're looking for? Please reach out to our customer support team.</p>
                <div className="flex space-x-4">
                  <a href="/contact" className="bg-education-blue text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    Contact Us
                  </a>
                  <a href="mailto:support@myolympiad.com" className="bg-white text-education-blue px-4 py-2 rounded border border-education-blue hover:bg-blue-50 transition-colors">
                    Email Support
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Terms & Privacy Tab Content */}
          <TabsContent value="terms">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-4 text-education-dark">Terms of Service</h2>
                <p className="text-sm text-gray-500 mb-6">Last Updated: {termsContent.lastUpdated}</p>

                <div className="space-y-6">
                  {termsContent.sections.map((section, index) => (
                    <div key={index}>
                      <h3 className="font-semibold mb-2">{section.title}</h3>
                      <p className="text-gray-600 text-sm">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-4 text-education-dark">Privacy Policy</h2>
                <p className="text-sm text-gray-500 mb-6">Last Updated: {privacyContent.lastUpdated}</p>

                <div className="space-y-6">
                  {privacyContent.sections.map((section, index) => (
                    <div key={index}>
                      <h3 className="font-semibold mb-2">{section.title}</h3>
                      <p className="text-gray-600 text-sm">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-3">
                By using the MyOlympiad platform, you acknowledge that you have read and understood our Terms of Service and Privacy Policy.
              </p>
              <p className="text-sm text-gray-500">
                If you have any questions or concerns about these policies, please <a href="/contact" className="text-education-blue hover:underline">contact us</a>.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AboutPage;
