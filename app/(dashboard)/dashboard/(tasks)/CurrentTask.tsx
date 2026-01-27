'use client';

import { useRouter } from 'next/navigation';
import { Timer, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Task {
    track_id: number;
    task_no: number;
    title: string;
    description: string;
    points: number;
    deadline: string | number | null;
    id: number;
}

interface CurrentTaskProps {
    mentor?: boolean;
    task?: Task | null;
    isLoading: boolean;
    status?: string;
}

export default function CurrentTask({ mentor = false, task, status, isLoading }: CurrentTaskProps) {
    const router = useRouter();

    const formatDeadline = (deadline: string | number | null): string => {
        if (!deadline) return "No Limit";
        if (typeof deadline === 'number') return `${deadline} Days Left`;
        return deadline;
    };

    const getButtonText = (): string => {
        if (mentor) return status === 'Submitted' ? "Review Work" : "View Task";
        if (status === 'Reviewed') return "View Feedback";
        if (status === 'Submitted') return "View Submission";
        return "Submit Work";
    };

    const handleTaskClick = () => {
        if (task) {
            router.push(`/submission?page=${task.id}`);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-64 rounded-3xl bg-v1-bg-input animate-pulse flex items-center justify-center border border-white/5">
                <div className="loader"></div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="relative w-full rounded-3xl p-8 md:p-12 overflow-hidden bg-v1-bg-input border border-white/5">
                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-v1-bg-hover flex items-center justify-center">
                        <CheckCircle className="text-v1-text-muted" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">All Caught Up!</h3>
                    <p className="text-v1-text-muted">
                        {mentor ? "No pending reviews for this mentee." : "You have completed all available tasks."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="w-full relative group cursor-pointer" onClick={handleTaskClick}>
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-v1-primary-yellow to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative bg-gradient-to-br from-[#FFD54F] to-[#FFB300] rounded-3xl p-8 md:p-10 overflow-hidden text-gray-900 shadow-lg">
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600 opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
                    <div className="flex-1 max-w-3xl">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/80 text-v1-primary-yellow text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 shadow-lg border border-white/10">
                            {mentor ? "Review Pending" : "Current Task"}
                        </div>
                        <div className="space-y-2 mb-8">
                            <h2 className="text-xl font-bold opacity-70 font-mono tracking-tight">
                                TASK-{(task.task_no + 1).toString().padStart(2, '0')}
                            </h2>
                            <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.9] text-gray-900 drop-shadow-sm uppercase">
                                {task.title}
                            </h3>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between items-start lg:items-end gap-6 min-w-[280px]">
                        <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-5 w-full lg:w-auto border border-black/5">
                            <div className="space-y-3 font-mono text-sm font-medium text-gray-900">
                                <div className="flex justify-between lg:justify-end gap-8 border-b border-black/10 pb-2 mb-2">
                                    <span className="opacity-60 uppercase text-xs tracking-wider">Status</span>
                                    <span className={`font-bold ${status === 'Submitted' ? 'text-blue-900' : 'text-gray-900'}`}>{status || 'Pending'}</span>
                                </div>
                                <div className="flex justify-between lg:justify-end gap-8 text-red-900 font-bold">
                                    <span className="opacity-60 uppercase text-xs tracking-wider text-gray-900">Deadline</span>
                                    <span className="flex items-center gap-1">
                                        <Timer size={16} />
                                        {formatDeadline(task.deadline)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={(e) => { e.stopPropagation(); handleTaskClick(); }}
                            className="group/btn relative px-8 py-4 bg-gray-900 text-white font-bold rounded-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden w-full lg:w-auto text-sm tracking-wide uppercase"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {getButtonText()}
                                <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={18} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}