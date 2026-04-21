"use client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, Eye, EyeOff } from "lucide-react"

function AdminLoginContent() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/admin'

  useEffect(() => {
    // Check if already has access
    const hasAccess = document.cookie.includes('admin-access=')
    if (hasAccess) {
      router.push(redirectPath)
    }
  }, [router, redirectPath])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // For demo purposes, using a simple password
      // In production, you should verify against a secure backend
      const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "P@ssw0rd_N0rw@y"
      
      if (password === correctPassword) {
        // Set cookie that expires in 24 hours
        document.cookie = `admin-access=${correctPassword}; path=/; max-age=86400`
        
        // Add a small delay before redirect
        setTimeout(() => {
          router.push(redirectPath)
        }, 100)
      } else {
        setError("Incorrect password. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600 mt-2">Enter password to access admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Verifying..." : "Access Admin"}
            </button>
          </form>

    
        </div>
      </div>
    </div>
  )
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLoginContent />
    </Suspense>
  )
}
