import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Sparkles, Save, Loader2, Wand2, ChevronDown } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import api from '../lib/api'

export default function WriteBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    ingredients: '',
    instructions: '',
    recipeHistory: ''
  })
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiAction, setAiAction] = useState('generateBlog')
  const [showAiPanel, setShowAiPanel] = useState(true)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing) {
        await api.put(`/blogs/${id}`, formData)
      } else {
        await api.post('/blogs', formData)
      }
      navigate('/blogs')
    } catch (error) {
      console.error('Error saving blog:', error)
      alert('Failed to save blog')
    } finally {
      setLoading(false)
    }
  }

  const handleAiAssist = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt for the AI assistant')
      return
    }

    setAiLoading(true)
    try {
      const { data } = await api.post('/blogs/ai-assist', {
        action: aiAction,
        prompt: aiPrompt,
        text: formData.content
      })

      const aiContent = data.result.content || data.result.recipe

      switch (aiAction) {
        case 'generateBlog':
          setFormData({
            ...formData,
            content: aiContent
          })
          break
        case 'expandContent':
          setFormData({
            ...formData,
            content: formData.content + '\n\n' + aiContent
          })
          break
        case 'summarizeContent':
          setFormData({
            ...formData,
            content: aiContent
          })
          break
        case 'rewriteContent':
          setFormData({
            ...formData,
            content: aiContent
          })
          break
        case 'generateRecipeDetails':
          if (aiContent.ingredients) {
            setFormData({
              ...formData,
              ingredients: Array.isArray(aiContent.ingredients) 
                ? aiContent.ingredients.join('\n') 
                : aiContent.ingredients,
              instructions: aiContent.instructions,
              title: formData.title || aiContent.title
            })
          }
          break
        case 'answerRecipeQuestion':
          setFormData({
            ...formData,
            content: formData.content + '\n\n' + aiContent
          })
          break
      }

      setAiPrompt('')
    } catch (error) {
      console.error('AI assist error:', error)
      alert('AI assistance failed. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const insertAiContent = (field, content) => {
    setFormData({
      ...formData,
      [field]: formData[field] ? formData[field] + '\n\n' + content : content
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/blogs')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditing ? 'Edit Blog' : 'Write New Blog'}
            </h1>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? 'Update' : 'Publish'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl rounded-3xl bg-white">
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter an engaging title..."
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image URL</label>
                  <Input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your blog content here..."
                    rows={12}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredients</label>
                  <textarea
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    placeholder="List ingredients (one per line)..."
                    rows={6}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cooking Instructions</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="Step-by-step cooking instructions..."
                    rows={8}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Food History & Facts (Optional)</label>
                  <textarea
                    name="recipeHistory"
                    value={formData.recipeHistory}
                    onChange={handleChange}
                    placeholder="Share interesting history or facts about this dish..."
                    rows={4}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Panel */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-xl rounded-3xl bg-gradient-to-br from-purple-50 to-blue-50 sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-purple-600" />
                    AI Content Assistant
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAiPanel(!showAiPanel)}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAiPanel ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              {showAiPanel && (
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">AI Action</label>
                    <select
                      value={aiAction}
                      onChange={(e) => setAiAction(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="generateBlog">Generate Full Blog</option>
                      <option value="expandContent">Expand Content</option>
                      <option value="summarizeContent">Summarize Content</option>
                      <option value="rewriteContent">Professional Rewrite</option>
                      <option value="generateRecipeDetails">Generate Recipe Details</option>
                      <option value="answerRecipeQuestion">Answer Culinary Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {aiAction === 'generateRecipeDetails' || aiAction === 'answerRecipeQuestion' 
                        ? 'Prompt / Question' 
                        : 'Prompt'}
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder={
                        aiAction === 'generateBlog' 
                          ? 'e.g., "Write a blog about Italian pasta with tomato sauce"'
                          : aiAction === 'expandContent'
                          ? 'The AI will expand your current content'
                          : aiAction === 'summarizeContent'
                          ? 'The AI will summarize your current content'
                          : aiAction === 'rewriteContent'
                          ? 'The AI will professionally rewrite your content'
                          : aiAction === 'generateRecipeDetails'
                          ? 'e.g., "Chicken curry recipe"'
                          : 'e.g., "What is the difference between baking and roasting?"'
                      }
                      rows={4}
                      className="w-full p-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleAiAssist}
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    {aiLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {aiLoading ? 'Generating...' : 'Generate with AI'}
                  </Button>

                  <div className="pt-4 border-t border-purple-200">
                    <p className="text-xs text-gray-600 font-semibold mb-2">QUICK ACTIONS</p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left border-purple-200 hover:bg-purple-50"
                        onClick={() => {
                          setAiAction('generateRecipeDetails')
                          setAiPrompt('Generate a recipe with ingredients and instructions')
                        }}
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Ingredients List
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left border-purple-200 hover:bg-purple-50"
                        onClick={() => {
                          setAiAction('generateRecipeDetails')
                          setAiPrompt('Generate cooking steps for this recipe')
                        }}
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Suggest Cooking Steps
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left border-purple-200 hover:bg-purple-50"
                        onClick={() => {
                          setAiAction('answerRecipeQuestion')
                          setAiPrompt('Explain the nutritional benefits and food facts')
                        }}
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Explain Nutritional Benefits
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
