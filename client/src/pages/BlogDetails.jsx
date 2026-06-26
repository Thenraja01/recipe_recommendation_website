import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, Clock, ArrowLeft, BookOpen, ChefHat, History, Edit, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import api from '../lib/api'

export default function BlogDetails() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/blogs/${id}`)
      setBlog(data.blog)
      setRelatedBlogs(data.relatedBlogs || [])
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog?')) return
    
    try {
      await api.delete(`/blogs/${id}`)
      window.location.href = '/blogs'
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Failed to delete blog')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-20 w-20 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Blog not found</h2>
          <Link to="/blogs">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isAuthor = user && user.id === blog.author.id

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header Image */}
      {blog.image && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/blogs">
          <Button variant="ghost" className="mb-6 text-gray-700 hover:text-green-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{blog.author.username}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {formatDate(blog.createdAt)}
                      </div>
                    </div>
                  </div>
                  {isAuthor && (
                    <div className="flex gap-2">
                      <Link to={`/blogs/edit/${blog.id}`}>
                        <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <CardTitle className="text-4xl font-bold text-gray-800 mb-4">
                  {blog.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                {/* Blog Content */}
                <div className="prose prose-lg max-w-none text-gray-700 mb-8">
                  <div className="whitespace-pre-wrap">{blog.content}</div>
                </div>

                {/* Ingredients Section */}
                {blog.ingredients && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ChefHat className="h-6 w-6 text-green-600" />
                      Ingredients
                    </h3>
                    <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-100">
                      <div className="whitespace-pre-wrap text-gray-700">{blog.ingredients}</div>
                    </div>
                  </div>
                )}

                {/* Instructions Section */}
                {blog.instructions && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Clock className="h-6 w-6 text-green-600" />
                      Cooking Instructions
                    </h3>
                    <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
                      <div className="whitespace-pre-wrap text-gray-700">{blog.instructions}</div>
                    </div>
                  </div>
                )}

                {/* Recipe History Section */}
                {blog.recipeHistory && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <History className="h-6 w-6 text-green-600" />
                      Food History & Facts
                    </h3>
                    <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-100">
                      <div className="whitespace-pre-wrap text-gray-700">{blog.recipeHistory}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Related Blogs */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-xl rounded-3xl bg-white sticky top-24">
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold text-gray-800">Related Blogs</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {relatedBlogs.length > 0 ? (
                  <div className="space-y-4">
                    {relatedBlogs.map((relatedBlog) => (
                      <Link key={relatedBlog.id} to={`/blog/${relatedBlog.id}`}>
                        <div className="p-4 rounded-xl hover:bg-green-50 transition-colors cursor-pointer border border-gray-100 hover:border-green-200">
                          {relatedBlog.image && (
                            <img
                              src={relatedBlog.image}
                              alt={relatedBlog.title}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          <h4 className="font-semibold text-gray-800 line-clamp-2 hover:text-green-600 transition-colors">
                            {relatedBlog.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">by {relatedBlog.author.username}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No related blogs yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
