import AchievementEnhancer from '../../../components/resume/AchievementEnhancer'
import PhoneInput from '../../../components/PhoneInput'
import { FieldError } from '../utils/uiHelpers'

export default function PersonalStep({
  personal,
  updatePersonal,
  personalErrors,
  setPersonalErrors,
  targetRole,
  setTargetRole,
  phoneCode,
  setPhoneCode,
  phoneDigits,
  setPhoneDigits,
  inputCls,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            className={inputCls('name')}
            value={personal.name}
            onChange={e => updatePersonal('name', e.target.value)}
            placeholder="John Doe"
            aria-invalid={!!personalErrors.name}
            aria-describedby={personalErrors.name ? 'name-error' : undefined}
          />
          <FieldError msg={personalErrors.name} />
        </div>

        {/* Target Job Role */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="targetRole">
            Target Job Role <span className="text-red-500">*</span>
          </label>
          <input
            id="targetRole"
            type="text"
            className={inputCls('targetRole')}
            value={targetRole}
            onChange={e => {
              setTargetRole(e.target.value)
              if (personalErrors.targetRole) setPersonalErrors(p => ({ ...p, targetRole: '' }))
            }}
            placeholder="Software Engineer"
            aria-invalid={!!personalErrors.targetRole}
          />
          <FieldError msg={personalErrors.targetRole} />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={inputCls('email')}
            value={personal.email}
            onChange={e => updatePersonal('email', e.target.value)}
            placeholder="john@example.com"
            aria-invalid={!!personalErrors.email}
          />
          <FieldError msg={personalErrors.email} />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone-number">
            Phone <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            countryCode={phoneCode}
            onCountryChange={code => {
              setPhoneCode(code)
              if (personalErrors.phone) setPersonalErrors(p => ({ ...p, phone: '' }))
            }}
            digits={phoneDigits}
            onDigitsChange={d => {
              setPhoneDigits(d)
              if (personalErrors.phone) setPersonalErrors(p => ({ ...p, phone: '' }))
            }}
            error={personalErrors.phone}
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="linkedin">LinkedIn URL</label>
          <input
            id="linkedin"
            type="url"
            className={inputCls('linkedin')}
            value={personal.linkedin}
            onChange={e => updatePersonal('linkedin', e.target.value)}
            placeholder="https://www.linkedin.com/in/johndoe"
            aria-invalid={!!personalErrors.linkedin}
          />
          <FieldError msg={personalErrors.linkedin} />
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="github">GitHub URL</label>
          <input
            id="github"
            type="url"
            className={inputCls('github')}
            value={personal.github}
            onChange={e => updatePersonal('github', e.target.value)}
            placeholder="https://github.com/johndoe"
            aria-invalid={!!personalErrors.github}
          />
          <FieldError msg={personalErrors.github} />
        </div>
      </div>

      {/* Portfolio */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Portfolio URL
        </label>

        <input
          type="url"
          className={inputCls('portfolio')}
          value={personal.portfolio}
          onChange={e =>
            updatePersonal('portfolio', e.target.value)
          }
          placeholder="https://yourportfolio.com"
        />
      </div>

      {/* Summary */}
      <div className="pt-2">
        <label className="block text-sm font-medium mb-1" htmlFor="summary">Professional Summary</label>
        <textarea
          id="summary"
          className="w-full bg-muted border border-border rounded-xl px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
          value={personal.summary}
          onChange={e => updatePersonal('summary', e.target.value)}
          placeholder="A brief summary of your professional background..."
        />
        <AchievementEnhancer
          value={personal.summary}
          jobRole={targetRole}
          onApply={(text) => updatePersonal('summary', text)}
        />
      </div>
    </div>
  )
}
