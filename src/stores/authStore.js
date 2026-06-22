import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      session: null,
      loading: true,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),

      initialize: async () => {
        set({ loading: true })
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          set({ user: session.user, session })
          await get().fetchProfile(session.user.id)
        }
        set({ loading: false })

        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            set({ user: session.user, session })
            await get().fetchProfile(session.user.id)
          } else if (event === 'SIGNED_OUT') {
            set({ user: null, profile: null, session: null })
          } else if (event === 'TOKEN_REFRESHED' && session) {
            set({ session })
          }
        })
      },

      fetchProfile: async (userId) => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

          if (!error && data) {
            set({ profile: data })
          }
        } catch (err) {
          console.error('Failed to fetch profile:', err)
        }
      },

      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, profile: null, session: null })
      },

      isAdmin: () => {
        const { profile } = get()
        return profile?.role === 'admin'
      },
    }),
    {
      name: 'snapcut-auth',
      partialize: (state) => ({ user: state.user, profile: state.profile }),
    }
  )
)
