'use client';

import { Calendar, Lock, LockOpen, CheckCircle, ChevronRight, FileText, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SubmissionData {
    id: number;
    task_id: number;
    task_no: number;
    task_name: string;
    status: string;
    mentor_feedback?: string;
    feedback?: string;
    submitted_at?: string;
    reviewed_at?: string;
    approved_at?: string;
}


interface ListTask {
    id: number;
    task_no: number;
    title: string;
    status: string;
}

export function UpcomingTask({ upcoming_tasks, isLoading }: { upcoming_tasks: ListTask[], isLoading: boolean }) {
    const router = useRouter();

    const handleTaskClick = (id: number) => {
        router.push(`/submission?page=${id}`);
    };

    return (
        <div className="bg-[#18181b]/60 backdrop-blur-md border border-white/5 p-1 rounded-3xl h-full flex flex-col">
            <div className="p-6 pb-2">
                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-3 mb-4">
                    <span className="p-2 bg-v1-primary-yellow/10 rounded-lg text-v1-primary-yellow">
                        <Calendar size={18} />
                    </span>
                    Upcoming Tasks
                </h3>
            </div>
            
            <div className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto max-h-[400px] scrollbar-hide">
                {isLoading ? (
                    <div className="loader m-auto mt-10"></div>
                ) : upcoming_tasks.length > 0 ? (
                    upcoming_tasks.map((task, idx) => {
                        const isLocked = task.status.includes('🔒');
                        const isNext = idx === 0 && !isLocked;

                        return (
                            <div 
                                key={task.id} 
                                onClick={() => !isLocked && handleTaskClick(task.id)}
                                className={`
                                    p-5 rounded-2xl border transition-all group
                                    ${!isLocked 
                                        ? "bg-white/5 border-v1-primary-yellow/40 hover:bg-white/10 shadow-[0_0_15px_rgba(255,213,79,0.05)] cursor-pointer" 
                                        : "border-transparent opacity-50 cursor-not-allowed"
                                    }
                                `}
                            >
                                {isNext && (
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-v1-primary-yellow text-[10px] font-bold uppercase tracking-widest bg-v1-primary-yellow/10 px-2 py-0.5 rounded border border-v1-primary-yellow/20">Next Up</span>
                                        <LockOpen size={16} className="text-gray-500 group-hover:text-v1-primary-yellow transition-colors" />
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className={!isLocked ? "" : "opacity-50"}>
                                        <h4 className={`font-bold text-sm md:text-base mb-1 ${!isLocked ? "text-white group-hover:text-v1-primary-yellow" : "text-gray-300"}`}>
                                            Task {(task.task_no + 1).toString().padStart(2, '0')}
                                        </h4>
                                        <p className="text-xs text-gray-500 font-medium truncate max-w-[150px]">{task.title}</p>
                                    </div>
                                    {isLocked && <Lock size={18} className="text-gray-600" />}
                                    {!isLocked && !isNext && <ChevronRight size={18} className="text-gray-600 group-hover:text-white" />}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-gray-500 text-center p-8 text-sm">No upcoming tasks pending.</div>
                )}
            </div>
        </div>
    );
}

export function ReviewedTask({ reviewed_tasks, isLoading }: { reviewed_tasks: ListTask[], isLoading: boolean }) {
    const router = useRouter();

    return (
        <div className="bg-[#18181b]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-lg w-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                        <CheckCircle size={18} />
                    </span>
                    History
                </h3>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {reviewed_tasks.length} Completed
                </span>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
                {isLoading ? (
                    <div className="loader m-auto"></div>
                ) : reviewed_tasks.length > 0 ? (
                    reviewed_tasks.map((task) => (
                        <div 
                            key={task.id} 
                            onClick={() => router.push(`/submission?page=${task.id}`)}
                            className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-v1-primary-yellow/10 p-4 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-200 text-sm group-hover:text-v1-primary-yellow transition-colors">
                                        Task {(task.task_no + 1).toString().padStart(2, '0')}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{task.title}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20 hidden sm:block">Approved</span>
                                <ChevronRight size={16} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center py-8 text-sm">No reviewed tasks yet.</div>
                )}
            </div>
        </div>
    );
}

export function FeedbackProvided({ selectedMentee, menteeSubmissions }: {
    selectedMentee: string | null;
    menteeSubmissions: Record<string, SubmissionData[]>;
}) {
    const router = useRouter();

    const getFeedbackTasks = () => {
        if (!selectedMentee || !menteeSubmissions[selectedMentee]) return [];
        return menteeSubmissions[selectedMentee].filter(s => 
            s.mentor_feedback && s.mentor_feedback.trim() !== ''
        );
    };

    const feedbackTasks = getFeedbackTasks();

    return (
        <div className="bg-[#18181b]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl mt-6">
            <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-3 mb-6">
                <span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <FileText size={18} />
                </span>
                Recent Feedback
            </h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide">
                {feedbackTasks.length > 0 ? (
                    feedbackTasks.map((submission) => (
                        <div 
                            key={submission.id} 
                            onClick={() => router.push(`/submission?page=${submission.task_id}`)}
                            className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                        Task {submission.task_no.toString().padStart(2, '0')}
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-blue-400">{submission.task_name}</h4>
                                </div>
                                <span className="text-xs text-blue-400 font-medium">{submission.status}</span>
                            </div>
                            <div className="bg-black/20 rounded-xl p-3 mt-2">
                                <p className="text-xs text-gray-400 leading-relaxed italic">
                                    "{submission.mentor_feedback && submission.mentor_feedback.length > 80 
                                        ? `${submission.mentor_feedback.substring(0, 80)}...` 
                                        : submission.mentor_feedback}"
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertCircle className="text-gray-600 mb-2" size={24} />
                        <p className="text-gray-500 text-xs">No feedback provided yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}