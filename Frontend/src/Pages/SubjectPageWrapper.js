import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import SubPage from './SubPage'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

const SubjectPageWrapper = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { subject: subjectSlug } = useParams()
  
  // Get subject data from navigation state (if available)
  const initialSubject = location.state?.subject
  const [subjectData, setSubjectData] = useState(initialSubject || null)
  const [loading, setLoading] = useState(!initialSubject)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initialSubject) {
      setSubjectData(initialSubject)
      setLoading(false)
      return
    }

    // If navigated directly or refreshed, fetch from backend
    const fetchSubject = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses/${subjectSlug}`)
        if (!response.ok) {
          throw new Error('Subject not found on server')
        }
        const data = await response.json()
        const found = data.course || data.subject
        if (found) {
          setSubjectData(found)
        } else {
          setError('Subject not found')
        }
      } catch (err) {
        console.warn('Backend fetch failed, attempting local fallback:', err.message)
        // Fallback: search through local JSON files
        try {
          const files = ['/Data/freshers.json', '/Data/sems.json', '/Data/commons.json']
          let foundSubject = null
          for (const file of files) {
            const res = await fetch(file)
            if (res.ok) {
              const data = await res.json()
              const match = (data.subjects || []).find((s) => {
                const slug = s.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                return slug === subjectSlug
              })
              if (match) {
                foundSubject = match
                break
              }
            }
          }
          if (foundSubject) {
            setSubjectData(foundSubject)
            return
          }
        } catch (fallbackErr) {
          console.error('Fallback search failed:', fallbackErr)
        }
        setError('Subject not found')
      } finally {
        setLoading(false)
      }
    }

    fetchSubject()
  }, [initialSubject, subjectSlug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative mx-auto mb-6 w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
            <BookOpen className="absolute inset-0 m-auto h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-700 font-semibold">Loading subject...</p>
        </div>
      </div>
    )
  }

  // If no subject data found, show error
  if (error || !subjectData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Subject Not Found</h2>
          <p className="text-gray-600 mb-6">
            The subject you're looking for could not be found. Please navigate back to the academics page and try again.
          </p>
          <button
            onClick={() => navigate('/acads')}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Back to Academics
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Back Button */}
      <div className="fixed top-20 left-4 z-50">
        <button
          onClick={() => navigate('/acads')}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
          title="Back to Academics"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 group-hover:-translate-x-1 transition-all duration-200" />
        </button>
      </div>
      
      {/* Subject Page */}
      <SubPage subject={subjectData} />
    </div>
  )
}

export default SubjectPageWrapper
