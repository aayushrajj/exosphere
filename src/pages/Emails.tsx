
import { useState } from 'react';
import { Mail, Send, Wand2, Building, TrendingUp } from 'lucide-react';

interface EmailDraft {
  id: string;
  department: string;
  metric: string;
  draft_text: string;
  sent_at?: string;
}

const Emails = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sentEmails, setSentEmails] = useState<EmailDraft[]>([]);

  const departments = [
    { id: 'finance', name: 'Finance' },
    { id: 'sales', name: 'Sales' },
    { id: 'ops', name: 'Operations' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'delivery', name: 'Delivery' }
  ];

  const metricsByDepartment: Record<string, { id: string; name: string }[]> = {
    finance: [
      { id: 'revenue_variance', name: 'Revenue Variance' },
      { id: 'budget_analysis', name: 'Budget Analysis' },
      { id: 'cost_optimization', name: 'Cost Optimization' }
    ],
    sales: [
      { id: 'pipeline_value', name: 'Pipeline Value' },
      { id: 'conversion_rate', name: 'Conversion Rate' },
      { id: 'customer_acquisition', name: 'Customer Acquisition' }
    ],
    ops: [
      { id: 'efficiency_metrics', name: 'Efficiency Metrics' },
      { id: 'process_optimization', name: 'Process Optimization' },
      { id: 'resource_allocation', name: 'Resource Allocation' }
    ],
    hr: [
      { id: 'headcount', name: 'Headcount Analysis' },
      { id: 'retention_rate', name: 'Retention Rate' },
      { id: 'performance_metrics', name: 'Performance Metrics' }
    ],
    delivery: [
      { id: 'delivery_turnaround', name: 'Delivery Turnaround' },
      { id: 'quality_metrics', name: 'Quality Metrics' },
      { id: 'customer_satisfaction', name: 'Customer Satisfaction' }
    ]
  };

  const generateEmailDraft = async () => {
    if (!selectedDepartment || !selectedMetric) return;

    setIsGenerating(true);
    
    // Mock AI generation - in real app this would call Google Gemini
    setTimeout(() => {
      const departmentName = departments.find(d => d.id === selectedDepartment)?.name;
      const metricName = metricsByDepartment[selectedDepartment]?.find(m => m.id === selectedMetric)?.name;
      
      const templates: Record<string, string> = {
        finance_revenue_variance: `Subject: Q3 Revenue Variance Analysis Request

Hi [Head of Finance],

I hope this email finds you well. I'm reaching out to request a comprehensive analysis of our Q3 revenue variance against budget projections.

Could you please provide:
• Detailed variance report by business unit
• Key factors contributing to any significant deviations
• Recommended corrective actions for Q4
• Updated forecasts based on current trends

I'd appreciate having this information by end of week for our upcoming board presentation.

Best regards,
[Your Name]`,

        sales_pipeline_value: `Subject: Pipeline Value Assessment Required

Dear Sales Team Lead,

I need an urgent review of our current sales pipeline value and conversion metrics.

Please include:
• Current pipeline value by stage
• Conversion rates for each sales stage
• Deal velocity analysis
• Q4 forecast confidence levels
• Key opportunities and risks

This information is critical for our quarterly planning session scheduled for next week.

Thank you for your prompt attention to this matter.

Best regards,
[Your Name]`,

        delivery_delivery_turnaround: `Subject: Delivery Performance Metrics Review

Hi [Head of Delivery],

Following recent customer feedback, I need a comprehensive review of our delivery turnaround times and performance metrics.

Required analysis:
• Average delivery times by region
• Performance against SLA commitments
• Bottleneck identification and root causes
• Customer satisfaction correlation
• Improvement action plan

Please schedule a meeting this week to discuss findings and next steps.

Best regards,
[Your Name]`
      };

      const templateKey = `${selectedDepartment}_${selectedMetric}`;
      const defaultTemplate = `Subject: ${metricName} Analysis Request

Hi [Head of ${departmentName}],

I hope you're doing well. I'm writing to request a detailed analysis of our ${metricName?.toLowerCase()} for the current quarter.

Could you please provide:
• Current performance metrics and trends
• Comparison against targets and benchmarks
• Key insights and observations
• Recommended actions for improvement
• Timeline for implementation

I'd appreciate having this information for our upcoming executive review meeting.

Best regards,
[Your Name]`;

      setEmailDraft(templates[templateKey] || defaultTemplate);
      setIsGenerating(false);
    }, 2000);
  };

  const sendEmail = () => {
    if (!emailDraft || !selectedDepartment || !selectedMetric) return;

    const departmentName = departments.find(d => d.id === selectedDepartment)?.name || '';
    const metricName = metricsByDepartment[selectedDepartment]?.find(m => m.id === selectedMetric)?.name || '';

    const newEmail: EmailDraft = {
      id: Date.now().toString(),
      department: departmentName,
      metric: metricName,
      draft_text: emailDraft,
      sent_at: new Date().toISOString()
    };

    setSentEmails([newEmail, ...sentEmails]);
    setEmailDraft('');
    setSelectedDepartment('');
    setSelectedMetric('');
    
    console.log('Email sent:', newEmail);
  };

  const availableMetrics = selectedDepartment ? metricsByDepartment[selectedDepartment] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Composer</h1>
          <p className="text-gray-600 mt-1">Generate AI-powered business emails based on departments and metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Composer */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Wand2 className="h-5 w-5 mr-2 text-blue-600" />
                Generate Email
              </h2>

              {/* Department Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedMetric('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a department...</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {/* Metric Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Metric
                </label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  disabled={!selectedDepartment}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Choose a metric...</option>
                  {availableMetrics.map(metric => (
                    <option key={metric.id} value={metric.id}>{metric.name}</option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateEmailDraft}
                disabled={!selectedDepartment || !selectedMetric || isGenerating}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Email Draft
                  </>
                )}
              </button>
            </div>

            {/* Email Draft Editor */}
            {emailDraft && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Draft</h3>
                <textarea
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Your AI-generated email will appear here..."
                />
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={sendEmail}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </button>
                  <button
                    onClick={() => setEmailDraft('')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Draft
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sent Emails History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-green-600" />
              Sent Emails
            </h2>

            {sentEmails.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">No emails sent yet</p>
                <p className="text-xs text-gray-500">Your sent emails will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sentEmails.map((email) => (
                  <div key={email.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{email.department}</span>
                        <span className="text-gray-400">•</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">{email.metric}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {email.sent_at && new Date(email.sent_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {email.draft_text.split('\n').find(line => line.includes('Subject:')) || 
                       email.draft_text.substring(0, 100) + '...'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emails;
