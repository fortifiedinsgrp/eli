// React Query hooks for LifeOS data
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as lifeos from './lifeos'
import * as firebase from './firebase'

// Companies
export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => lifeos.getCompanies(true),
  })
}

// Tasks
export function useTasks(params = {}) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => lifeos.getTasks(params),
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: lifeos.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }) => lifeos.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useCompleteTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: lifeos.completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: lifeos.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

// Notes
export function useNotes(params = {}) {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => lifeos.getNotes(params),
  })
}

export function useNote(id) {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => lifeos.getNote(id),
    enabled: !!id,
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: lifeos.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useUpdateNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }) => lifeos.updateNote(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: lifeos.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

// Projects
export function useProjects(params = {}) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => lifeos.getProjects(params),
  })
}

// Documents (Firebase Storage)
export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: firebase.listDocuments,
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: firebase.uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: firebase.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}
