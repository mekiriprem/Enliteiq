import React from 'react';
import { Brain, Cpu, Zap, Code, Database } from 'lucide-react';

const AIPage = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[url('/images/neural-network-bg.png')] ">
      {/* Background Decorations */}
      <div className="background-layout">
        <div className="background-circles">
          <div className="circle-1"></div>
          <div className="circle-2"></div>
          <div className="circle-3"></div>
          <div className="circle-4"></div>
        </div>
        <div className="watermarks">
          <Brain size={48} className="math-symbol text-purple-600" />
          <Database size={48} className="science-symbol text-blue-600" />
          <img
            src="https://img.icons8.com/?size=100&id=11804&format=png"
            alt="Geometry Symbol"
            className="geometry-symbol"
          />
        </div>

        {/* Main Content */}
        <div className="content-wrapper ,url('/images/data-stream-bg.jpg')] ">
          <div className="container mx-auto px-6 relative z-10 text-center">
            {/* Header */}
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 animate-fade-in flex items-center justify-center space-x-2">
              <Cpu size={48} className="text-yellow-600" />
              <span>AI-Powered Olympiad Preparation</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Revolutionize your Maths and Science Olympiad journey with Enlighthiq's upcoming AI features. Personalized learning, smart insights, and adaptive challenges are on the way!
            </p>

            {/* Coming Soon Message */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-purple-600">
                AI Features Coming Soon!
              </h2>
              <p className="text-gray-500 mt-4">
                Stay tuned for an AI-driven experience launching later in 2025.
              </p>
            </div>

            {/* Inspirational Quote */}
            <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-lg max-w-2xl mx-auto mb-12 flex items-start space-x-4">
              <Code size={32} className="text-purple-600" />
              <div>
                <p className="text-xl md:text-2xl text-gray-800 italic">
                  "Artificial Intelligence is not about replacing human potential—it's about amplifying it to solve the toughest challenges."
                </p>
                <p className="text-gray-500 mt-4 text-sm">
                  — Inspired by the future of learning at Enlighthiq
                </p>
              </div>
            </div>

            {/* Motivational Saying */}
            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-semibold text-purple-600">
                "Unlock the Power of AI: Your Olympiad Success Awaits!"
              </h3>
            </div>

            {/* Call to Action */}
            <div className="flex items-center justify-center space-x-2">
              <Zap size={24} className="text-yellow-600" />
              <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                Stay Updated
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="floating-symbols">
        <span className="symbol">π</span>
        <span className="symbol">∑</span>
        <span className="symbol">√</span>
        <span className="symbol">≈</span>
        <span className="symbol">∫</span>
        <Cpu size={24} className="symbol text-blue-600" />
        <span className="symbol">🧪</span>
      </div>
      <div className="fixed-symbols">
        <span className="fixed-symbol" style={{ top: '10%', left: '5%' }}>π</span>
        <span className="fixed-symbol" style={{ top: '30%', right: '10%' }}>∑</span>
        <Brain size={24} className="fixed-symbol text-purple-600" style={{ top: '60%', left: '15%' }} />
        <span className="fixed-symbol" style={{ top: '80%', right: '20%' }}>🧪</span>
      </div>
    </section>
  );
};

export default AIPage;