'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../lib/auth-context'
import { authStorage } from '../../../lib/localStorage-utils'
import { useDashboardStats } from '../../../lib/hooks/useDashboard'

const DashboardPage = () => {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin } = useAuth()
  const { data: dashboardData, loading: statsLoading, error: statsError } = useDashboardStats()

  useEffect(() => {
    // Check if user is logged in and is admin using new system
    if (!authStorage.isAuthenticatedAdmin()) {
      console.log('❌ Dashboard page - Not authenticated admin, redirecting...');
      router.replace('/admin/login');
    } else {
      console.log('✅ Dashboard page - User is authenticated admin');
    }
  }, [router])

  // Generate stats from API data
  const stats = [
    {
      icon: 'fas fa-box',
      number: dashboardData?.success ? dashboardData.data.totalProducts?.toString() || '0' : '0',
      label: 'Total Products',
      color: 'rgba(59, 130, 246, 0.1)',
      iconColor: '#3b82f6'
    },
    {
      icon: 'fas fa-shopping-cart',
      number: dashboardData?.success ? dashboardData.data.totalOrders?.toString() || '0' : '0',
      label: 'Total Orders',
      color: 'rgba(16, 185, 129, 0.1)',
      iconColor: '#10b981'
    },
    {
      icon: 'fas fa-dollar-sign',
      number: dashboardData?.success 
        ? `$${dashboardData.data.totalRevenue?.toLocaleString() || '0'}` 
        : '$0',
      label: 'Total Revenue',
      color: 'rgba(245, 158, 11, 0.1)',
      iconColor: '#f59e0b'
    },
    {
      icon: 'fas fa-users',
      number: dashboardData?.success ? dashboardData.data.totalCustomers?.toString() || '0' : '0',
      label: 'Total Customers',
      color: 'rgba(239, 68, 68, 0.1)',
      iconColor: '#ef4444'
    },
    {
      icon: 'fas fa-envelope',
      number: dashboardData?.success ? dashboardData.data.totalMessages?.toString() || '0' : '0',
      label: 'Contact Messages',
      color: 'rgba(139, 92, 246, 0.1)',
      iconColor: '#8b5cf6'
    }
  ]

  // Use recent data from API
  const recentProducts = dashboardData?.success 
    ? (dashboardData.data.recentProducts || []).slice(0, 3)
    : []

  const recentMessages = dashboardData?.success 
    ? (dashboardData.data.recentMessages || []).slice(0, 3)
    : []

  // Show loading state
  if (statsLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading dashboard...</p>
      </div>
    )
  }

  // Show error state
  if (statsError) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        color: '#dc2626'
      }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Error Loading Dashboard</h3>
        <p style={{ margin: 0 }}>{statsError}</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard" style={{ fontFamily: "'Quasimoda', 'Inter', sans-serif" }}>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: '0 0 0.5rem 0'
                }}>
                  {stat.number}
                </p>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  fontSize: '0.875rem'
                }}>
                  {stat.label}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className={stat.icon} style={{
                  fontSize: '1.25rem',
                  color: stat.iconColor
                }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Recent Products */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#111827',
              margin: 0
            }}>
              Recent Products
            </h3>
            <Link href="/admin/products" style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              View All
            </Link>
          </div>
          <div>
            {recentProducts.map((product, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: index < recentProducts.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <div>
                  <p style={{
                    fontWeight: 500,
                    color: '#111827',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {product.name}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {product.date}
                  </p>
                </div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  background: product.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: product.status === 'Active' ? '#10b981' : '#f59e0b'
                }}>
                  {product.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#111827',
              margin: 0
            }}>
              Recent Messages
            </h3>
            <Link href="/admin/contact-messages" style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              View All
            </Link>
          </div>
          <div>
            {recentMessages.map((message, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: index < recentMessages.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <div>
                  <p style={{
                    fontWeight: 500,
                    color: '#111827',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {message.from}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {message.subject}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {message.date}
                  </p>
                </div>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}>
                  Reply
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 


