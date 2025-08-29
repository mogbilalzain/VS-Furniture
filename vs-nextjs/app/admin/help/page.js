'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authStorage } from '../../../lib/localStorage-utils'

const HelpPage = () => {
  const router = useRouter()
  const [activeFAQ, setActiveFAQ] = useState(null)

  useEffect(() => {
    // Check for authentication using new system
    if (!authStorage.isAuthenticatedAdmin()) {
      console.log('❌ Help page - Not authenticated admin, redirecting...');
      router.replace('/admin/login');
    } else {
      console.log('✅ Help page - User is authenticated admin');
    }
  }, [router])

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index)
  }

  const faqs = [
    {
      question: 'How do I add a new product?',
      answer: 'To add a new product, go to the Products page and click the "Add Product" button. Fill in all required fields including product name, description, price, and upload an image.'
    },
    {
      question: 'How can I manage orders?',
      answer: 'Navigate to the Orders page to view all customer orders. You can filter by status, search by customer name, and update order status directly from the table.'
    },
    {
      question: 'How do I generate reports?',
      answer: 'Visit the Reports page to access various analytics and reports. You can filter by date range and export reports in different formats.'
    },
    {
      question: 'How do I change my password?',
      answer: 'Go to Settings > Security to change your password. Make sure to use a strong password with at least 8 characters including numbers and special characters.'
    },
    {
      question: 'How do I backup the system?',
      answer: 'Automatic backups are enabled by default. You can also manually create backups from Settings > Backup & Restore. Backups are stored securely and can be restored if needed.'
    }
  ]

  return (
    <div>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            color: '#111827',
            margin: 0
          }}>Help & Support</h1>
          <p style={{
            color: '#6b7280',
            margin: '0.25rem 0 0 0'
          }}>Get help and find answers to common questions</p>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 1rem 0'
        }}>Quick Start Guide</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <i className="fas fa-box" style={{
                color: '#3b82f6',
                fontSize: '1.25rem'
              }}></i>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#111827',
                margin: 0
              }}>Manage Products</h3>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              Add, edit, and organize your product catalog with ease.
            </p>
          </div>
          <div style={{
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <i className="fas fa-shopping-cart" style={{
                color: '#10b981',
                fontSize: '1.25rem'
              }}></i>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#111827',
                margin: 0
              }}>Track Orders</h3>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              Monitor customer orders and update their status in real-time.
            </p>
          </div>
          <div style={{
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <i className="fas fa-chart-bar" style={{
                color: '#f59e0b',
                fontSize: '1.25rem'
              }}></i>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#111827',
                margin: 0
              }}>View Reports</h3>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              Access detailed analytics and insights about your business.
            </p>
          </div>
        </div>
      </div>

      {/* Login Credentials */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 1rem 0'
        }}>Login Credentials</h2>
        <div style={{
          background: '#f9fafb',
          borderRadius: '8px',
          padding: '1rem',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0 0 0.5rem 0'
          }}>
            <strong>Username:</strong> admin
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            <strong>Password:</strong> admin123
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 1rem 0'
        }}>Frequently Asked Questions</h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'white',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                <span style={{
                  fontWeight: 500,
                  color: '#111827'
                }}>
                  {faq.question}
                </span>
                <i className={`fas fa-chevron-${activeFAQ === index ? 'up' : 'down'}`} style={{
                  color: '#6b7280',
                  transition: 'transform 0.3s ease'
                }}></i>
              </button>
              {activeFAQ === index && (
                <div style={{
                  padding: '1rem',
                  background: '#f9fafb',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 1rem 0'
        }}>Contact Support</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <i className="fas fa-envelope" style={{
              color: '#3b82f6',
              fontSize: '1.25rem'
            }}></i>
            <div>
              <p style={{
                fontWeight: 500,
                color: '#111827',
                margin: '0 0 0.25rem 0'
              }}>
                Email Support
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                support@vsfurniture.com
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <i className="fas fa-phone" style={{
              color: '#10b981',
              fontSize: '1.25rem'
            }}></i>
            <div>
              <p style={{
                fontWeight: 500,
                color: '#111827',
                margin: '0 0 0.25rem 0'
              }}>
                Phone Support
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                +971 4 123 4567
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <i className="fas fa-clock" style={{
              color: '#f59e0b',
              fontSize: '1.25rem'
            }}></i>
            <div>
              <p style={{
                fontWeight: 500,
                color: '#111827',
                margin: '0 0 0.25rem 0'
              }}>
                Support Hours
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Mon-Fri: 9AM-6PM GST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage 