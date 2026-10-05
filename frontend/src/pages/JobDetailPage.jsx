import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Building2, CalendarDays, Check, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useApplyToJob, useJob } from '../services/queries';
import { applicationSchema, resumeIsValid } from '../types/schemas';
import { Badge, Button, Card, EmptyState, FileDropzone, Input, Modal, Skeleton } from '../components/ui';

export default function JobDetailPage() {
  const { id } = useParams(); const query = useJob(id); const job = query.data; const { user } = useAuth();
  const [open, setOpen] = useState(false); const [resume, setResume] = useState(null); const [fileError, setFileError] = useState('');
  const apply = useApplyToJob(); const form = useForm({ resolver: zodResolver(applicationSchema), defaultValues: { coverLetter: '' } });
  const selectFile = (file) => { setFileError(''); if (!resumeIsValid(file)) { setResume(null); setFileError('Choose a PDF or DOCX file no larger than 5 MB.'); return; } setResume(file); };
  const submit = form.handleSubmit((values) => {
    if (!resume) { setFileError('Please attach your resume to continue.'); return; }
    apply.mutate({ jobId: id, resume, coverLetter: values.coverLetter }, {
      onSuccess: () => { setOpen(false); setResume(null); form.reset(); toast.success('Application submitted! Track it from your dashboard.'); },
      onError: (error) => toast.error(error.response?.data?.error || 'Could not submit your application.'),
    });
  });
  if (query.isLoading) return <main className="content-wrap detail-page"><Skeleton className="skeleton-title"/><Skeleton className="detail-skeleton"/></main>;
  if (query.isError || !job) return <main className="content-wrap"><EmptyState title="We couldn’t find that role" description="It may have been removed, or the link may be out of date." action={<Link to="/jobs"><Button variant="secondary">Back to opportunities</Button></Link>}/></main>;
  return <main className="content-wrap detail-page">
    <Link className="back-link" to="/jobs"><ArrowLeft size={15}/> All opportunities</Link>
    <div className="detail-grid"><article className="detail-article"><div className="detail-company"><span className="company-avatar company-avatar-lg">{job.companyName?.[0]}</span><div><b>{job.companyName}</b><span>Opportunity posted by {job.recruiterName}</span></div></div>
      <h1>{job.title}</h1><div className="detail-badges"><Badge tone="violet"><MapPin size={14}/>{job.location}</Badge><Badge><BriefcaseBusiness size={14}/>{job.jobType.replace('_',' ')}</Badge><Badge><CalendarDays size={14}/>Posted {new Intl.DateTimeFormat('en',{month:'short',day:'numeric'}).format(new Date(job.createdAt))}</Badge></div>
      <div className="article-rule"/><h2>About the opportunity</h2><div className="job-description">{job.description}</div><h2>At a glance</h2><div className="at-glance"><div><Building2 size={17}/><span>Company<strong>{job.companyName}</strong></span></div><div><MapPin size={17}/><span>Location<strong>{job.location}</strong></span></div><div><BriefcaseBusiness size={17}/><span>Compensation<strong>{job.salaryRange || 'Discussed with the team'}</strong></span></div></div>
    </article><aside><Card className="apply-panel"><span className="eyebrow">READY WHEN YOU ARE</span><h2>Could this be your next?</h2><p>Send your resume and start a conversation with the team.</p>{user?.role === 'JOB_SEEKER' ? <Button className="full-width" onClick={() => setOpen(true)}>Apply for this role <ArrowUpRight size={16}/></Button> : user ? <p className="apply-hint">Recruiter accounts can’t apply to roles.</p> : <Link to="/login" state={{ from: `/jobs/${id}` }}><Button className="full-width">Sign in to apply <ArrowUpRight size={16}/></Button></Link>}<div className="apply-secure"><Check size={14}/> Your application is shared directly with the hiring team.</div></Card></aside></div>
    <Modal open={open} onClose={() => !apply.isPending && setOpen(false)} title={`Apply to ${job.companyName}`} description={job.title}><form onSubmit={submit} className="form-stack" noValidate><FileDropzone file={resume} onChange={selectFile} error={fileError}/>{apply.isPending && <div className="upload-progress"><span style={{ width: `${apply.progress || 2}%` }}/></div>}<Input as="textarea" rows="5" label="A note for the team (optional)" placeholder="What caught your eye about this opportunity?" error={form.formState.errors.coverLetter?.message} {...form.register('coverLetter')}/><Button type="submit" className="full-width" loading={apply.isPending}>Send application <ArrowUpRight size={16}/></Button></form></Modal>
  </main>;
}
