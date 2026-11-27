import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import MessageComposer from '../components/MessageComposer'
import { jobTrackerApi } from '../services/api'

/**
 * MessageComposerPage — the /email-generator and /outreach routes after the
 * fold: one composer with the four templates. Accepts ?template=<key> and
 * ?job=<trackedJobId> (from dashboard/extension deep links) for context.
 */
export default function MessageComposerPage() {
  const [searchParams] = useSearchParams()
  const [job, setJob] = useState(null)
  const template = searchParams.get('template') || 'application'
  const jobId = searchParams.get('job')

  useEffect(() => {
    if (!jobId) return
    jobTrackerApi
      .getAll()
      .then((res) => {
        const found = (res.trackedJobs || []).find((j) => j.id === jobId)
        if (found) setJob(found)
      })
      .catch(() => {})
  }, [jobId])

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="mx-auto max-w-3xl">
          <MessageComposer job={job} initialTemplate={template} variant="page" />
        </div>
      </div>
    </Layout>
  )
}
