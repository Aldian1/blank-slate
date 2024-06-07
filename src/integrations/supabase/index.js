/**
 * Types for Supabase Tables
 * 
 * Table: user_data
 * Columns:
 * - id: bigint (Primary Key)
 * - created_at: timestamp with time zone
 * - user_data: json
 * 
 * Table: tasks
 * Columns:
 * - id: bigint (Primary Key)
 * - created_at: timestamp with time zone
 * - user_id: uuid
 * - task_name: text
 * - task_description: text
 * 
 * Table: user_files
 * Columns:
 * - id: bigint (Primary Key)
 * - created_at: timestamp with time zone
 * - user_id: uuid
 * - file_name: text
 * - file_description: text
 */

import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

// Hooks for UserData table
export const useUserData = () => useQuery({
    queryKey: ['user_data'],
    queryFn: () => fromSupabase(supabase.from('user_data').select('*')),
});

export const useAddUserData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUserData) => fromSupabase(supabase.from('user_data').insert([newUserData])),
        onSuccess: () => {
            queryClient.invalidateQueries('user_data');
        },
    });
};

export const useUpdateUserData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedUserData) => fromSupabase(supabase.from('user_data').update(updatedUserData).eq('id', updatedUserData.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_data');
        },
    });
};

export const useDeleteUserData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_data').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_data');
        },
    });
};

// Hooks for Tasks table
export const useTasks = () => useQuery({
    queryKey: ['tasks'],
    queryFn: () => fromSupabase(supabase.from('tasks').select('*')),
});

export const useAddTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTask) => fromSupabase(supabase.from('tasks').insert([newTask])),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedTask) => fromSupabase(supabase.from('tasks').update(updatedTask).eq('id', updatedTask.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('tasks').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

// Hooks for UserFiles table
export const useUserFiles = () => useQuery({
    queryKey: ['user_files'],
    queryFn: () => fromSupabase(supabase.from('user_files').select('*')),
});

export const useAddUserFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUserFile) => fromSupabase(supabase.from('user_files').insert([newUserFile])),
        onSuccess: () => {
            queryClient.invalidateQueries('user_files');
        },
    });
};

export const useUpdateUserFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedUserFile) => fromSupabase(supabase.from('user_files').update(updatedUserFile).eq('id', updatedUserFile.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_files');
        },
    });
};

export const useDeleteUserFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_files').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_files');
        },
    });
};