import { Mail, MessageSquare } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function Contact() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <MessageSquare className="h-16 w-16 mx-auto text-green-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-gray-500 mb-6">
          Have questions, suggestions, or feedback? We'd love to hear from you!
        </p>
        <a href="mailto:support@reciperec.com">
          <Button className="bg-green-600 hover:bg-green-700">
            <Mail className="h-4 w-4 mr-2" /> Email Support
          </Button>
        </a>
      </div>
    </div>
  )
}
