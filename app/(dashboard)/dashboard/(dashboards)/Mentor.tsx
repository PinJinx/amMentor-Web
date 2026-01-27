'use client';

import { ReviewedTask, FeedbackProvided, UpcomingTask } from "../(tasks)/ListViews";
import CurrentTask from "../(tasks)/CurrentTask";
import PlayerStats from "../(user)/PlayerStats";
import { JSX, useEffect, useMemo, useState, useCallback } from 'react';
import { useMentee } from "@/app/context/menteeContext";
import { fetchTracks as apiFetchTracks, fetchTasks as apiFetchTasks, fetchSubmissions, fetchLeaderboard } from '@/lib/api';
import { normalizeStatus } from '@/lib/status';
import { ChevronDown } from "lucide-react";

interface Task {
    track_id: number;
    task_no: number;
    title: string;
    description: string;
    points: number;
    deadline: number | null;
    id: number;
}
interface TrackData { id: number; title: string; }
interface MenteeDetails { tasks_completed: number; mentee_name: string; total_points: number; position: number; }
interface SubmissionData { id: number; task_id: number; task_no: number; task_name: string; status: string; mentor_feedback?: string; feedback?: string; submitted_at?: string; reviewed_at?: string; approved_at?: string; }

const MentorDashboard = () => {

    const { selectedMentee, mentees, setSelectedMentee, isLoading: menteesLoading } = useMentee();
    const [loading, setLoading] = useState(true);
    const [menteeDetails, setMenteeDetails] = useState<MenteeDetails>({ mentee_name: "temp", total_points: 0, tasks_completed: 0, position: 0 });
    const [tasks, setTasks] = useState<Task[]>([]);
    const [totaltask, settotaltask] = useState(0);
    const [menteeSubmissions, setMenteeSubmissions] = useState<Record<string, Record<number, string>>>({});
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [currentTrack, setCurrentTrack] = useState<{id: number; name: string} | null>(null);
    const [tracks, setTracks] = useState<{id: number; name: string}[]>([]);
    const [menteeFullSubmissions, setMenteeFullSubmissions] = useState<Record<string, SubmissionData[]>>({});

    const menteeOptions = useMemo<JSX.Element[]>(() => {
        if (!mentees || mentees.length === 0) return [<option key="no-mentees" value="">No mentees available</option>];
        return mentees.map((mentee, index) => (<option key={index} value={mentee.name}>{mentee.name}</option>));
    }, [mentees]);

    const fetchTracks = useCallback(async () => {
         try {
            const tracksData: TrackData[] = await apiFetchTracks();
            const formattedTracks = tracksData.map((track: TrackData) => ({ id: track.id, name: track.title }));
            setTracks(formattedTracks);
            const savedTrack = sessionStorage.getItem('mentorCurrentTrack');
            if (savedTrack) {
                const parsed = JSON.parse(savedTrack);
                if (formattedTracks.some(t => t.id === parsed.id)) { setCurrentTrack(parsed); } 
                else { setCurrentTrack(formattedTracks[0]); sessionStorage.setItem('mentorCurrentTrack', JSON.stringify(formattedTracks[0])); }
            } else if (formattedTracks.length > 0) {
                setCurrentTrack(formattedTracks[0]); sessionStorage.setItem('mentorCurrentTrack', JSON.stringify(formattedTracks[0]));
            }
        } catch (error) { console.error(error); }
    }, []);

    const handleTrackChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const trackId = parseInt(event.target.value);
        const selectedTrack = tracks.find(track => track.id === trackId);
        if (selectedTrack) {
            setCurrentTrack(selectedTrack);
            sessionStorage.setItem('mentorCurrentTrack', JSON.stringify(selectedTrack));
            setCurrentTask(null);
            setLoading(true);
        }
    }, [tracks]);

    const getSubmittedTasksCount = useCallback((menteeName: string): number => {
        if (!menteeSubmissions[menteeName]) return 0;
        return Object.values(menteeSubmissions[menteeName]).filter(status => status === 'Submitted' || status === 'Reviewed').length;
    }, [menteeSubmissions]);

    const getCurrentTaskForMentee = useCallback((menteeName: string): Task | null => {
        if (!tasks.length || !menteeSubmissions[menteeName]) return null;
        const submittedTasks = tasks.filter(task => {
            const status = menteeSubmissions[menteeName][task.id];
            return status === 'Submitted';
        });
        return submittedTasks.length > 0 ? submittedTasks[0] : null;
    }, [tasks, menteeSubmissions]);

    const getFormattedTasksForMentee = (menteeName: string) => {
        if (!menteeSubmissions[menteeName]) return [];
        return tasks.map((task) => ({
            id: task.id,
            task_no: task.task_no,
            title: task.title,
            status: menteeSubmissions[menteeName][task.id] || 'Not Started'
        }));
    };

    const getUpcomingMentorTasks = () => {
        if (!selectedMentee) return [];
        return getFormattedTasksForMentee(selectedMentee).filter(task => 
            ['Not Started', 'In Progress', 'Paused'].includes(task.status)
        );
    };

    const getReviewedMentorTasks = () => {
        if (!selectedMentee) return [];
        return getFormattedTasksForMentee(selectedMentee).filter(task => 
            task.status === 'Reviewed'
        );
    };

    const fetchMenteeSubmissions = useCallback(async (menteesList: { name: string; email: string }[], tasksList: Task[]) => {
        const statusResults: Record<string, Record<number, string>> = {};
        const fullSubmissionsResults: Record<string, SubmissionData[]> = {};
        const tasksByTrack: Record<number, Task[]> = {};
        tasksList.forEach(task => { if (!tasksByTrack[task.track_id]) tasksByTrack[task.track_id] = []; tasksByTrack[task.track_id].push(task); });

        for (const mentee of menteesList) {
            statusResults[mentee.name] = {}; fullSubmissionsResults[mentee.name] = [];
            for (const [trackId, tasksInTrack] of Object.entries(tasksByTrack)) {
                try {
                    const submissions: SubmissionData[] = await fetchSubmissions(mentee.email, Number(trackId));
                    fullSubmissionsResults[mentee.name].push(...submissions);
                    tasksInTrack.forEach(task => {
                        const taskSubmission = submissions.find((s: SubmissionData) => s.task_id === task.id);
                        statusResults[mentee.name][task.id] = normalizeStatus(taskSubmission?.status || 'Not Started');
                    });
                } catch (error) { tasksInTrack.forEach(task => { statusResults[mentee.name][task.id] = 'Not Started'; }); }
            }
        }
        setMenteeSubmissions(statusResults);
        setMenteeFullSubmissions(fullSubmissionsResults);
    }, []);

    const fetchMenteeDetails = async (menteeName: string) => {
        try {
            if (!currentTrack) return;
            const response = await fetchLeaderboard(currentTrack.id);
            const leaderboard = response['leaderboard'] as Array<MenteeDetails>;
            const menteeIndex = leaderboard.findIndex(element => element.mentee_name === menteeName);
            if (menteeIndex !== -1) { setMenteeDetails({ ...leaderboard[menteeIndex], position: menteeIndex + 1 }); }
            else { setMenteeDetails({ mentee_name: menteeName, total_points: 0, tasks_completed: 0, position: 0 }); }
        } catch (error) { setMenteeDetails({ mentee_name: menteeName, total_points: 0, tasks_completed: 0, position: 0 }); }
    };

    const fetchTasks = useCallback(async () => {
        try {
            if (!currentTrack?.id) return [];
            const tasksData: Task[] = await apiFetchTasks(currentTrack.id);
            setTasks(tasksData); settotaltask(tasksData.length);
            return tasksData;
        } catch (error) { return []; }
    }, [currentTrack]);

    useEffect(() => { fetchTracks(); }, [fetchTracks]);
    useEffect(() => {
        const initData = async () => {
            if (!menteesLoading && mentees.length > 0 && currentTrack) {
                const fetchedTasks = await fetchTasks();
                if (fetchedTasks.length > 0) { await fetchMenteeSubmissions(mentees, fetchedTasks); }
                setLoading(false);
            }
        };
        setLoading(true); initData();
    }, [menteesLoading, mentees, currentTrack, fetchTasks, fetchMenteeSubmissions]);
    
    useEffect(() => { if (selectedMentee) fetchMenteeDetails(selectedMentee); }, [selectedMentee]);
    useEffect(() => { if (tasks.length > 0 && Object.keys(menteeSubmissions).length > 0 && selectedMentee) {
            setCurrentTask(getCurrentTaskForMentee(selectedMentee));
        }
    }, [tasks, menteeSubmissions, selectedMentee, getCurrentTaskForMentee]);

    if (menteesLoading) { return <div className="text-white flex justify-center items-center h-screen"><div className="loader"></div></div>; }


    return (
        <div className="text-white max-w-[1400px] mx-auto pt-4 pb-12 px-4 md:px-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                        Welcome, <span className="text-v1-primary-yellow">Mentor</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Review submissions and guide your mentees.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group">
                        <select 
                            className="appearance-none bg-[#18181b]/60 backdrop-blur-md border border-white/10 rounded-xl text-white px-4 py-3 pr-10 w-full sm:w-48 focus:outline-none focus:border-v1-primary-yellow/50 transition-colors"
                            value={currentTrack?.id || 1}
                            onChange={handleTrackChange}
                        >
                            {tracks.map(track => <option key={track.id} value={track.id} className="bg-black">{track.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    <div className="relative group">
                        <select 
                            className="appearance-none bg-[#18181b]/60 backdrop-blur-md border border-white/10 rounded-xl text-white px-4 py-3 pr-10 w-full sm:w-48 focus:outline-none focus:border-v1-primary-yellow/50 transition-colors"
                            value={selectedMentee || ''}
                            onChange={(e) => setSelectedMentee(e.target.value)}
                        >
                            {menteeOptions}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </header>

            <div className="mb-10 w-full">
                <CurrentTask
                    isLoading={loading}
                    mentor={true} 
                    task={currentTask}
                    status={currentTask && selectedMentee ? menteeSubmissions[selectedMentee]?.[currentTask.id] : undefined}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                 <div className="lg:col-span-4 flex flex-col gap-8">
                    <PlayerStats rank={menteeDetails.position} points={menteeDetails.total_points} />
                    
                    <div className="bg-[#18181b]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Task Progress</h3>
                        <div className="bg-white/5 rounded-full h-3">
                            <div 
                                className="bg-gradient-to-r from-v1-primary-yellow to-orange-500 rounded-full h-3 transition-all duration-500" 
                                style={{ width: `${totaltask > 0 ? ((selectedMentee ? getSubmittedTasksCount(selectedMentee) : 0) / totaltask) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-mono text-gray-500">
                            <span>{totaltask > 0 ? ((selectedMentee ? getSubmittedTasksCount(selectedMentee) : 0) / totaltask) * 100 : 0}%</span>
                            <span>{selectedMentee ? getSubmittedTasksCount(selectedMentee) : 0}/{totaltask} Completed</span>
                        </div>
                    </div>

                    <UpcomingTask isLoading={loading} upcoming_tasks={getUpcomingMentorTasks()} />
                 </div>

                 <div className="lg:col-span-8 flex flex-col gap-8">
                    <ReviewedTask isLoading={loading} reviewed_tasks={getReviewedMentorTasks()} />
                    <FeedbackProvided 
                        selectedMentee={selectedMentee}
                        menteeSubmissions={menteeFullSubmissions}
                    />
                 </div>
            </div>
        </div>
    );
};

export default MentorDashboard;