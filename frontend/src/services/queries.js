import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from './apiClient';

export const queryKeys = {
  jobs: (filters) => ['jobs', filters],
  job: (id) => ['job', id],
  featured: ['jobs', 'featured'],
  myApplications: ['applications', 'me'],
  recruiterJobs: ['jobs', 'recruiter'],
  recruiterApplications: ['applications', 'recruiter'],
  profile: ['profile', 'me'],
};

export function useJobs(filters) {
  return useQuery({ queryKey: queryKeys.jobs(filters), queryFn: async () => { const params=Object.fromEntries(Object.entries(filters).filter(([,value])=>value!==''&&value!==undefined&&value!==null)); return (await api.get('/jobs', { params })).data; }, placeholderData: (previous) => previous });
}
export function useFeaturedJobs() {
  return useQuery({ queryKey: queryKeys.featured, queryFn: async () => (await api.get('/jobs/featured')).data });
}
export function useJob(id) {
  return useQuery({ queryKey: queryKeys.job(id), queryFn: async () => (await api.get(`/jobs/${id}`)).data, enabled: Boolean(id) });
}
export function useMyApplications() {
  return useQuery({ queryKey: queryKeys.myApplications, queryFn: async () => (await api.get('/applications/me')).data });
}
export function useProfile() {
  return useQuery({ queryKey: queryKeys.profile, queryFn: async () => (await api.get('/auth/me')).data });
}
export function useUpdateProfile() {
  const client=useQueryClient();
  return useMutation({mutationFn:async(profile)=>(await api.put('/auth/me',profile)).data,onSuccess:(profile)=>{client.setQueryData(queryKeys.profile,profile);client.invalidateQueries({queryKey:queryKeys.profile});}});
}
export function useRecruiterData() {
  const jobs = useQuery({ queryKey: queryKeys.recruiterJobs, queryFn: async () => (await api.get('/jobs/recruiter/my-jobs')).data });
  const applications = useQuery({ queryKey: queryKeys.recruiterApplications, queryFn: async () => (await api.get('/applications/recruiter')).data });
  return { jobs, applications };
}
export function useApplyToJob() {
  const client = useQueryClient();
  const [progress, setProgress] = useState(0);
  const mutation = useMutation({ mutationFn: async ({ jobId, resume, coverLetter }) => {
    const body = new FormData(); body.append('file', resume);
    setProgress(0);
    const uploaded = await api.post('/uploads/resume', body, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: (event) => setProgress(Math.round((event.loaded * 100) / (event.total || event.loaded))) });
    return (await api.post(`/applications?jobId=${jobId}`, { resumeUrl: uploaded.data.resumeUrl, coverLetter })).data;
  }, onSuccess: () => { setProgress(100); client.invalidateQueries({ queryKey: queryKeys.myApplications }); client.invalidateQueries({ queryKey: queryKeys.recruiterApplications }); } });
  return { ...mutation, progress };
}
export function useCreateJob() {
  const client = useQueryClient();
  return useMutation({ mutationFn: async (job) => (await api.post('/jobs', job)).data, onSuccess: () => { client.invalidateQueries({ queryKey: queryKeys.recruiterJobs }); client.invalidateQueries({ queryKey: ['jobs'] }); client.invalidateQueries({ queryKey: queryKeys.featured }); } });
}
export function useUpdateApplicationStatus() {
  const client = useQueryClient();
  return useMutation({ mutationFn: async ({ id, status }) => (await api.patch(`/applications/${id}/status`, { status })).data, onSuccess: () => { client.invalidateQueries({ queryKey: queryKeys.recruiterApplications }); client.invalidateQueries({ queryKey: queryKeys.myApplications }); } });
}
