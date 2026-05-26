import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Briefcase, ExternalLink } from 'lucide-react';
import { jobsApi } from '../services/api';
import { SkeletonJobList } from './ui/Skeleton';

export default function SimilarJobs({ targetJob, candidateJobs, onSelectJob }) {
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetJob || !candidateJobs || candidateJobs.length === 0) return;
    
    const fetchSimilar = async () => {
      setLoading(true);
      try {
        const candidates = candidateJobs.filter(j => (j.job_id || j.id) !== (targetJob.job_id || targetJob.id));
        if (candidates.length === 0) {
            setSimilarJobs([]);
            return;
        }
        const res = await jobsApi.getSimilar(targetJob, candidates);
        setSimilarJobs(res.data || []);
      } catch (err) {
        console.error('Failed to fetch similar jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSimilar();
  }, [targetJob, candidateJobs]);

  if (loading) {
    return (
      <div className="sticky top-6">
         <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Similar Jobs
         </h3>
         <SkeletonJobList count={3} />
      </div>
    );
  }

  if (!similarJobs.length) return null;

  return (
    <div className="sticky top-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
         <Briefcase className="w-5 h-5 text-primary" />
         Similar Jobs
      </h3>
      <div className="space-y-4">
        {similarJobs.map((job, idx) => (
           <motion.div 
             key={job.job_id || job.id || idx} 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             className="p-4 border border-border rounded-lg bg-card/50 hover:border-primary/50 hover:bg-card transition-all group"
           >
             <button 
                onClick={() => onSelectJob && onSelectJob(job)}
                className="block text-left w-full"
             >
                 <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">{job.job_title || job.title}</h4>
                 <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Building2 className="w-3 h-3 flex-shrink-0" />
                    <span className="line-clamp-1">{job.employer_name || job.company}</span>
                 </div>
                 <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="line-clamp-1">{job.job_city || job.location?.city || 'Remote'}</span>
                 </div>
                 <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs font-medium text-green-500">
                       {job.job_employment_type || job.employmentType || 'Full-time'}
                    </span>
                    <a 
                       href={job.job_apply_link || job.applyLink} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       onClick={(e) => e.stopPropagation()}
                       className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-md transition-colors"
                    >
                        Apply <ExternalLink className="w-3 h-3" />
                    </a>
                 </div>
             </button>
           </motion.div>
        ))}
      </div>
    </div>
  )
}
