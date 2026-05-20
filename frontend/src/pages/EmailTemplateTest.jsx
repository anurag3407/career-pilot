import { useState } from 'react';
import { AlertCircle, CheckCircle, Mail, Eye, Send } from 'lucide-react';
import API from '../services/api';
import './EmailTemplateTest.css';

export default function EmailTemplateTest() {
  const [selectedTemplate, setSelectedTemplate] = useState('verification');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    // Verification
    email: 'test@example.com',
    code: '123456',

    // Job Alert
    userEmail: 'test@example.com',
    userName: 'Test User',
    alertTitle: 'Senior React Developer',

    // Proposal
    studentEmail: 'student@example.com',
    studentName: 'John Student',
    challengeTitle: 'E-commerce Platform Redesign',
    companyName: 'TechStart Inc',
    corporateName: 'Innovation Labs',
    proposedPrice: '50000',
    estimatedDays: '30',
    feedback: 'Great proposal! We love your approach.'
  });

  const templates = {
    verification: {
      name: 'Verification Email',
      color: 'blue',
      fields: ['email', 'code'],
      endpoint: '/test-emails/verification'
    },
    'job-alert': {
      name: 'Job Alert Email',
      color: 'purple',
      fields: ['userEmail', 'userName', 'alertTitle'],
      endpoint: '/test-emails/job-alert'
    },
    'proposal-approval': {
      name: 'Proposal Approval Email',
      color: 'green',
      fields: ['studentEmail', 'studentName', 'challengeTitle', 'companyName', 'corporateName', 'proposedPrice', 'estimatedDays', 'feedback'],
      endpoint: '/test-emails/proposal-approval'
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => {
    const template = templates[selectedTemplate];
    const payload = {};

    template.fields.forEach(field => {
      if (selectedTemplate === 'verification') {
        if (field === 'email') payload.email = formData.email;
        if (field === 'code') payload.code = formData.code;
      } else if (selectedTemplate === 'job-alert') {
        if (field === 'userEmail') payload.userEmail = formData.userEmail;
        if (field === 'userName') payload.userName = formData.userName;
        if (field === 'alertTitle') payload.alertTitle = formData.alertTitle;
      } else if (selectedTemplate === 'proposal-approval') {
        if (field === 'studentEmail') payload.studentEmail = formData.studentEmail;
        if (field === 'studentName') payload.studentName = formData.studentName;
        if (field === 'challengeTitle') payload.challengeTitle = formData.challengeTitle;
        if (field === 'companyName') payload.companyName = formData.companyName;
        if (field === 'corporateName') payload.corporateName = formData.corporateName;
        if (field === 'proposedPrice') payload.proposedPrice = parseInt(formData.proposedPrice);
        if (field === 'estimatedDays') payload.estimatedDays = parseInt(formData.estimatedDays);
        if (field === 'feedback') payload.feedback = formData.feedback;
      }
    });

    return payload;
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const template = templates[selectedTemplate];
      const payload = buildPayload();

      const response = await API.post(template.endpoint, payload);
      setResult({ success: true, data: response });
    } catch (error) {
      setResult({ 
        success: false, 
        error: error.response?.data?.error || error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    try {
      const template = templates[selectedTemplate];
      const payload = buildPayload();

      const response = await API.post(`/test-emails/preview/${selectedTemplate}`, payload);
      setPreviewHtml(response.html);
      setShowPreview(true);
    } catch (error) {
      setResult({ 
        success: false, 
        error: 'Failed to generate preview: ' + (error.response?.data?.error || error.message)
      });
    }
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'border-blue-500 bg-blue-50',
      purple: 'border-purple-500 bg-purple-50',
      green: 'border-green-500 bg-green-50'
    };
    return colorMap[color] || 'border-gray-300 bg-gray-50';
  };

  const getBadgeClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="email-template-test">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📧 Email Template Tester</h1>
          <p className="text-gray-600">Test and preview responsive email templates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Templates</h2>
              <div className="space-y-2">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedTemplate === key
                        ? `${getColorClass(template.color)} border-l-4`
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{template.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getBadgeClass(template.color)}`}>
                        {key === 'verification' ? '🔐' : key === 'job-alert' ? '💼' : '🎉'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form and Results */}
          <div className="lg:col-span-2">
            {/* Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                {templates[selectedTemplate].name} - Configuration
              </h2>

              <form onSubmit={handleSendEmail}>
                <div className="space-y-4">
                  {/* Verification Fields */}
                  {selectedTemplate === 'verification' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="test@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          name="code"
                          value={formData.code}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="123456"
                        />
                      </div>
                    </>
                  )}

                  {/* Job Alert Fields */}
                  {selectedTemplate === 'job-alert' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          User Email
                        </label>
                        <input
                          type="email"
                          name="userEmail"
                          value={formData.userEmail}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="user@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          User Name
                        </label>
                        <input
                          type="text"
                          name="userName"
                          value={formData.userName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alert Title
                        </label>
                        <input
                          type="text"
                          name="alertTitle"
                          value={formData.alertTitle}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Senior React Developer"
                        />
                      </div>
                    </>
                  )}

                  {/* Proposal Fields */}
                  {selectedTemplate === 'proposal-approval' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Student Email
                        </label>
                        <input
                          type="email"
                          name="studentEmail"
                          value={formData.studentEmail}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="student@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Student Name
                        </label>
                        <input
                          type="text"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="John Student"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Challenge Title
                        </label>
                        <input
                          type="text"
                          name="challengeTitle"
                          value={formData.challengeTitle}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="E-commerce Platform"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="TechStart Inc"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Corporate Partner
                        </label>
                        <input
                          type="text"
                          name="corporateName"
                          value={formData.corporateName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Innovation Labs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Proposed Price (₹)
                          </label>
                          <input
                            type="number"
                            name="proposedPrice"
                            value={formData.proposedPrice}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="50000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timeline (Days)
                          </label>
                          <input
                            type="number"
                            name="estimatedDays"
                            value={formData.estimatedDays}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="30"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Feedback Message
                        </label>
                        <textarea
                          name="feedback"
                          value={formData.feedback}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Your feedback here..."
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    <Eye size={18} />
                    Preview
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    <Send size={18} />
                    {loading ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </form>
            </div>

            {/* Result */}
            {result && (
              <div className={`rounded-lg shadow p-6 ${result.success ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  ) : (
                    <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-semibold ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                      {result.success ? 'Email Sent Successfully! ✅' : 'Error Sending Email ❌'}
                    </h3>
                    {result.success && result.data ? (
                      <div className="mt-2 space-y-1 text-sm text-green-800">
                        <p><strong>To:</strong> {result.data.emailTo}</p>
                        <p><strong>Template:</strong> {result.data.template}</p>
                        <p><strong>Message ID:</strong> {result.data.result?.messageId || 'N/A'}</p>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-red-800">{result.error}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Email Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <iframe
                title="email-preview"
                srcDoc={previewHtml}
                sandbox=""
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
