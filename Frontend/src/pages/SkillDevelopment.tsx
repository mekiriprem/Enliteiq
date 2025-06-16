import React from 'react';
import { useNavigate } from 'react-router-dom';



const SkillDevelopmentSection = () => {
    const navigate = useNavigate();

  return (
    <section className="relative py-20  overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 rounded-full opacity-10 blur-3xl animate-spin-slow"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-200 rounded-full opacity-30 blur-2xl"></div>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="https://img.icons8.com/?size=100&id=11803&format=png" alt="Math Symbol" className="absolute top-10 left-20 opacity-10 w-16 h-16" />
        <img src="https://img.icons8.com/?size=100&id=12456&format=png" alt="Science Symbol" className="absolute bottom-20 right-20 opacity-10 w-16 h-16" />
        <img src="https://img.icons8.com/?size=100&id=11804&format=png" alt="Geometry Symbol" className="absolute top-1/2 left-10 opacity-10 w-16 h-16" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 animate-fade-in">
            Skill Development for Olympiad Excellence
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Prepare for Maths and Science Olympiads with our comprehensive skill-building program. Develop academic, cognitive, and competitive skills to excel in mock Olympiads and real competitions.
          </p>
        </div>

        {/* Mock Olympiad Info */}
        <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl mb-12 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <img src="https://img.icons8.com/?size=100&id=12345&format=png" alt="Trophy" className="w-12 h-12 mr-4" />
            <h3 className="text-2xl font-bold text-purple-800"> Olympiads: Your Path to Success</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Our mock Olympiads simulate real Maths and Science Olympiad conditions, helping students build confidence and hone their skills. With timed tests, detailed feedback, and leaderboards, students can track progress and prepare effectively.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Weekly mock tests covering algebra, geometry, physics, and chemistry.</li>
            <li>Adaptive difficulty levels for grades 6-12.</li>
            <li>Instant scoring with in-depth solution explanations.</li>
            <li>Virtual medals and certificates to boost motivation.</li>
            <li>Access to past Olympiad questions and practice sets.</li>
          </ul>
          
            <button
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/mock-tests')}>
                        Join a Mock Olympiad Now
          </button>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Academic Skills */}
          <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 flex flex-col">
            <div className="flex items-center mb-4">
              <img src="https://img.icons8.com/ios-filled/100/4A90E2/book.png" alt="Book" className="w-10 h-10 mr-3" />
              <h3 className="text-xl font-semibold text-blue-800">Academic Skills</h3>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2 flex-grow">
              <li>Advanced algebra and geometry</li>
              <li>Scientific experimentation</li>
              <li>Data analysis and interpretation</li>
              <li>Mathematical proofs</li>
              <li>Coding for problem-solving</li>
            </ul>
          </div>

          {/* Cognitive Skills */}
          <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 flex flex-col">
            <div className="flex items-center mb-4">
              <img src="https://img.icons8.com/ios-filled/100/4A90E2/brain.png" alt="Brain" className="w-10 h-10 mr-3" />
              <h3 className="text-xl font-semibold text-purple-800">Cognitive Skills</h3>
            </div>
            <p className="text-gray-600 mb-2 text-sm">Enhance problem-solving for Olympiad challenges.</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 flex-grow">
              <li>Lateral thinking for complex problems</li>
              <li>Pattern recognition</li>
              <li>Logical deduction</li>
              <li>Strategic planning</li>
              <li>Creative solution design</li>
            </ul>
          </div>

          {/* Communication Skills */}
          <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 flex flex-col">
            <div className="flex items-center mb-4">
              <img src="https://img.icons8.com/?size=100&id=11807&format=png" alt="Speech" className="w-10 h-10 mr-3" />
              <h3 className="text-xl font-semibold text-pink-800">Communication Skills</h3>
            </div>
            <p className="text-gray-600 mb-2 text-sm">Present solutions effectively in competitions.</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 flex-grow">
              <li>Articulating mathematical reasoning</li>
              <li>Writing clear scientific reports</li>
              <li>Presenting solutions confidently</li>
              <li>Collaborative problem discussions</li>
              <li>Effective note-taking</li>
            </ul>
          </div>

          {/* Personal Skills */}
          <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 flex flex-col">
            <div className="flex items-center mb-4">
              <img src="https://img.icons8.com/?size=100&id=11808&format=png" alt="Light Bulb" className="w-10 h-10 mr-3" />
              <h3 className="text-xl font-semibold text-yellow-800">Personal Skills</h3>
            </div>
            <p className="text-gray-600 mb-2 text-sm">Build discipline for competitive success.</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 flex-grow">
              <li>Time management under pressure</li>
              <li>Goal-oriented preparation</li>
              <li>Self-motivation</li>
              <li>Handling competition stress</li>
              <li>Continuous self-assessment</li>
            </ul>
          </div>

          {/* Social Skills */}
          <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 flex flex-col">
            <div className="flex items-center mb-4">
              <img src="https://img.icons8.com/?size=100&id=11809&format=png" alt="Globe" className="w-10 h-10 mr-3" />
              <h3 className="text-xl font-semibold text-green-800">Social & Emotional Skills</h3>
            </div>
            <p className="text-gray-600 mb-2 text-sm">Foster teamwork for group challenges.</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 flex-grow">
              <li>Collaborating in team Olympiads</li>
              <li>Empathy in peer learning</li>
              <li>Resilience after tough problems</li>
              <li>Respecting diverse approaches</li>
              <li>Building a supportive study community</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tailwind Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s infinite linear;
        }
      `}</style>
            <div className="floating-symbols">
  <span className="symbol">π</span>
  <span className="symbol">∑</span>
  <span className="symbol">√</span>
  <span className="symbol">≈</span>
  <span className="symbol">∫</span>
  <span className="symbol">⚛</span> {/* Atom symbol */}
  <span className="symbol">🧪</span> {/* Beaker */}
</div>
<div className="fixed-symbols">
  <span className="fixed-symbol" style={{ top: '10%', left: '5%' }}>π</span>
  <span className="fixed-symbol" style={{ top: '30%', right: '10%' }}>∑</span>
  <span className="fixed-symbol" style={{ top: '60%', left: '15%' }}>⚛</span>
  <span className="fixed-symbol" style={{ top: '80%', right: '20%' }}>🧪</span>
</div>
    </section>
  );
};

export default SkillDevelopmentSection;