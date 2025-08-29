'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Contact() {
  const [showForm, setShowForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    questions: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setFormData({
      fullName: '',
      email: '',
      contactNumber: '',
      questions: '',
      message: ''
    });
    setSelectedFiles([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple form validation
    if (!formData.fullName || !formData.email || !formData.contactNumber) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare data for API (map frontend fields to backend fields)
      const apiData = {
        name: formData.fullName,
        email: formData.email,
        contact_number: formData.contactNumber,
        subject: formData.questions || 'General Inquiry', // Use questions as subject or default
        message: formData.message,
        questions: formData.questions
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        // Reset form after 3 seconds
        setTimeout(() => {
          handleCancelForm();
          setSubmitStatus(null);
        }, 3000);
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        {!showForm && (
          <section className="py-24 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-light text-gray-800 mb-6">
                <b>General Inquiry</b> <span className="italic">Contact Form</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                For all general inquiries and questions for VS middle east, submit a form by clicking the button below
              </p>
              <button 
                onClick={handleOpenForm}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 transition-all duration-300 hover:-translate-y-1"
              >
                Open form
              </button>
            </div>
          </section>
        )}

        {/* Contact Form Section */}
        {showForm && (
          <section className="py-16 px-4 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-medium text-gray-800 mb-8">General Inquiry Contact Form</h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="form-field">
                    <label className="block mb-2 font-medium text-gray-600" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border-2 border-gray-300 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                      required
                    />
                  </div>
                  
                  <div className="form-field">
                    <label className="block mb-2 font-medium text-gray-600" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border-2 border-gray-300 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                      required
                    />
                  </div>
                  
                  <div className="form-field">
                    <label className="block mb-2 font-medium text-gray-600" htmlFor="contactNumber">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border-2 border-gray-300 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                      required
                    />
                  </div>
                  
                  <div className="form-field">
                    <label className="block mb-2 font-medium text-gray-600" htmlFor="questions">
                      Questions to Spark Your Thinking
                    </label>
                    <input
                      type="text"
                      id="questions"
                      name="questions"
                      value={formData.questions}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border-2 border-gray-300 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  <div className="form-field">
                    <label className="block mb-2 font-medium text-gray-600" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-3 py-3 border-2 border-gray-300 focus:border-yellow-400 focus:outline-none transition-colors duration-300 min-h-32 resize-vertical"
                    />
                  </div>
                  
                  <div className="form-field">
                    <label className="block mb-2 font-medium text-gray-600">
                      Uploads
                    </label>
                    <div className="border-2 border-dashed border-gray-300 hover:border-yellow-400 p-4 text-center cursor-pointer transition-colors duration-300">
                      <input
                        type="file"
                        id="fileUpload"
                        name="fileUpload"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="fileUpload" className="cursor-pointer">
                        {selectedFiles.length > 0 ? (
                          <div className="text-gray-700">
                            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span className="text-sm">{selectedFiles.length} file(s) selected</span>
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            <span className="text-sm">Choose files</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Status Messages */}
                {submitStatus && (
                  <div className="md:col-span-2">
                    {submitStatus === 'success' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-green-700 font-medium">
                            Thank you for your inquiry! We will get back to you soon.
                          </p>
                        </div>
                      </div>
                    )}
                    {submitStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <p className="text-red-700 font-medium">
                            Sorry, there was an error sending your message. Please try again.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Form Actions */}
                <div className="md:col-span-2 flex justify-between items-center pt-6">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    disabled={isSubmitting}
                    className="bg-transparent border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-black font-semibold px-8 py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting && (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
} 