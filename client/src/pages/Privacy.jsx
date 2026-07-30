import { Shield } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
        </div>
        <div className="space-y-4 text-gray-600">
          <p>Last updated: July 2026</p>
          <h2 className="text-xl font-semibold text-gray-800">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, including your name, email address, and any recipes or blogs you submit.</p>
          <h2 className="text-xl font-semibold text-gray-800">2. How We Use Your Information</h2>
          <p>Your information is used to provide and improve our recipe recommendation services, personalize your experience, and communicate with you.</p>
          <h2 className="text-xl font-semibold text-gray-800">3. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access or disclosure.</p>
          <h2 className="text-xl font-semibold text-gray-800">4. Contact</h2>
          <p>If you have questions about this policy, please contact us at support@reciperec.com.</p>
        </div>
      </div>
    </div>
  )
}
