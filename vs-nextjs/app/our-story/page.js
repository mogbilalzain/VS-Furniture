'use client';

import React from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const OurStoryPage = () => {

  // Timeline data
  const timelineEvents = [
    {
      year: '2004',
      location: 'Sharjah, UAE',
      title: 'VS Middle East Factory Established',
      description: 'Under visionary leadership, the VS Middle East factory was built in the UAE. It became a regional hub of innovation, precision manufacturing, and unmatched production standards.'
    },
    {
      year: '2006',
      location: 'Sharjah SAIF Zone, UAE',
      title: 'Official Launch of VS Furniture Middle East HQ',
      description: 'Regional operations formally established to serve the GCC. Sharjah SAIF Zone becomes the headquarters for VS Germany in the Middle East, supporting projects across the UAE, Qatar, Oman, Kuwait, and beyond'
    },
    {
      year: '2012–2013',
      location: 'Riyadh, Saudi Arabia',
      title: 'Landmark Project: King Saud University',
      description: 'A monumental milestone — VS Middle East secured and delivered a 15 million AED project for King Saud University.',
      details: [
        'Supplied: 45,000+ furniture pieces',
        'Impact: Cemented VS Middle East\'s reputation for delivering large-scale, high-quality educational solutions.'
      ]
    },
    {
      year: 'Innovation Milestone',
      location: '',
      title: 'The Compass Lecture Chair is Born',
      description: 'In the VS Middle East factory, the original concept of the Compass Lecture Chair was created — with 400 chairs produced locally. The design later evolved in Germany and became one of VS Germany\'s iconic global products.'
    },
    {
      year: 'Innovation Milestone',
      location: '',
      title: 'Panto Move with Writing Tablet',
      description: 'Another product innovation from the region — the enhanced Panto Move Chair with an integrated writing tablet — conceptualized and prototyped in the Middle East, now manufactured by VS Germany for global markets.'
    },
    {
      year: 'Coming Soon',
      location: 'Saudi Arabia',
      title: 'New VS Presence in KSA',
      description: 'With growing demand and a legacy of past success in the Kingdom, VS Furniture Middle East is preparing to establish a dedicated local presence in Saudi Arabia.'
    }
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero bg-white h-screen flex items-center justify-center">
          <div className="w-full h-full">
            <Image 
              src="/hero.jpg" 
              alt="VS America's journey and commitment to educational furniture" 
              width={1920}
              height={1080}
              className="w-full h-full object-cover object-center"
              priority
            />
          </div>
        </section>

        {/* Header Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-6">
                  Our Story
                </h1>
                <p className="text-base text-gray-600 leading-relaxed mb-8">
                  For over 120 years, VS America has been at the forefront of educational furniture design, 
                  creating innovative solutions that transform learning environments. Our journey is rooted in 
                  the belief that the physical space plays a crucial role in fostering engagement, collaboration, 
                  and academic success.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="h-1 w-20 bg-[#FFD700]"></div>
                  <span className="text-gray-500 italic">Since 1898</span>
                </div>
              </div>
              
              {/* Right Image */}
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="/classroom-design.jpg"
                  alt="Modern classroom with VS furniture showcasing our design philosophy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-medium">Innovative Design</p>
                  <p className="text-xs opacity-80">Transforming Learning Spaces</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Introduction */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              At VS Furniture Middle East, our story is built on a foundation of innovation, design excellence, and a deep commitment to creating inspiring spaces for learning, collaboration, and creativity.
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              We are the regional arm of VS Vereinigte Spezialmöbelfabriken, a globally renowned German manufacturer with over 125 years of experience in educational and ergonomic furniture design. As a trusted partner in the Middle East, we bring the quality, craftsmanship, and pedagogical insight of the VS brand directly to institutions across the region.
            </p>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A Global Vision, Regionally Grounded</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              VS is present in Germany, the United States, the UAE, and Australia — with Saudi Arabia coming soon. Every location shares one mission: to create environments that inspire learning and growth.
            </p>
          </div>

          {/* World Map Placeholder */}
          <div className="relative h-[400px] bg-gray-200 rounded-lg mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">VS LOCATIONS MAP</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            VS Furniture Middle East – Timeline
          </h2>

          <div className="max-w-4xl mx-auto">
            {timelineEvents.map((event, index) => (
              <div 
                key={index}
                className="relative pl-8 pb-12 border-l-2 border-[#FFD700] last:border-0"
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#FFD700]" />
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-[#FFD700] font-bold">{event.year}</span>
                    {event.location && (
                      <span className="text-gray-600">– {event.location}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-700 mb-2">{event.description}</p>
                  {event.details && (
                    <ul className="list-disc list-inside text-gray-700 ml-4">
                      {event.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="quote-section quote-section-enhanced text-white py-16 md:py-24 text-center px-4 min-h-[60vh] flex items-center justify-center relative">
        {/* Icon at the top */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" style={{ top: "-3rem" }}>
          <div className="w-24 h-24 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg">
            <i className="fas fa-lightbulb text-[#2c2c2c] text-3xl"></i>
          </div>
        </div>
        {/* Animated background elements */}
        <div className="bg-element"></div>
        <div className="bg-element"></div>
        <div className="bg-element"></div>
        
        <div className="container mx-auto max-w-4xl quote-content">
          <p className="text-3xl md:text-4xl italic font-normal leading-relaxed quote-enhanced-text">
            <em>"At the heart of everything we do is the belief that furniture should move with people, not the other way around."</em>
            <span className="quote-hyphen"></span>
            <br />
            <span className="block mt-4 font-bold">
              Our systems are designed to encourage movement, engagement, and well-being, rooted in decades of pedagogical and ergonomic research and built with the future in mind.
            </span>
          </p>
        </div>
      </section>

      {/* Regional Impact */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Our journey in the Middle East began in 2006, when we established our regional headquarters in the Sharjah Airport International Free Zone (SAIF Zone) in the United Arab Emirates. As the UAE emerged as a hub for educational innovation and development, it became the ideal launching point for VS\'s regional operations.
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Since then, VS Furniture Middle East has successfully delivered projects across the UAE, Saudi Arabia, Kuwait, Bahrain, and Oman. From international schools and government initiatives to private universities and corporate learning spaces, our solutions are helping to redefine what modern educational and collaborative environments can be.
            </p>
            <p className="text-lg md:text-xl text-gray-700">
              More than just a supplier, VS Furniture Middle East is a long-term partner, committed to shaping the learning and working environments where the region's next generation will thrive.
            </p>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
};

export default OurStoryPage;