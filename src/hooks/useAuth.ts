
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        
        // First check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            setNeedsOnboarding(false);
            setLoading(false);
          }
          return;
        }

        // If no session, user is not authenticated
        if (!session?.user) {
          console.log('No active session found');
          if (mounted) {
            setIsAuthenticated(false);
            setNeedsOnboarding(false);
            setLoading(false);
          }
          return;
        }

        console.log('Active session found for user:', session.user.id);
        
        // User has valid session
        if (mounted) {
          setIsAuthenticated(true);
        }
        
        // Check onboarding status with proper error handling
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .maybeSingle(); // Use maybeSingle to avoid errors when no profile exists

          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" which is okay
            console.error('Profile fetch error:', profileError);
            // If we can't fetch profile, assume onboarding is needed
            if (mounted) {
              setNeedsOnboarding(true);
              setLoading(false);
            }
            return;
          }

          if (mounted) {
            const needsOnboardingStatus = !profile || !profile.onboarding_completed;
            console.log('Onboarding check:', { profile, needsOnboardingStatus });
            setNeedsOnboarding(needsOnboardingStatus);
            setLoading(false);
          }
        } catch (profileCheckError) {
          console.error('Profile check failed:', profileCheckError);
          if (mounted) {
            setNeedsOnboarding(true);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setNeedsOnboarding(false);
          setLoading(false);
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event);

      try {
        if (event === 'SIGNED_OUT' || !session?.user) {
          console.log('User signed out or session ended');
          setIsAuthenticated(false);
          setNeedsOnboarding(false);
          setLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('User signed in or token refreshed');
          setIsAuthenticated(true);
          
          // Check onboarding status for signed in user
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('onboarding_completed')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Profile fetch error on auth change:', profileError);
              setNeedsOnboarding(true);
            } else {
              const needsOnboardingStatus = !profile || !profile.onboarding_completed;
              console.log('Onboarding status on auth change:', { profile, needsOnboardingStatus });
              setNeedsOnboarding(needsOnboardingStatus);
            }
          } catch (profileError) {
            console.error('Profile check failed on auth change:', profileError);
            setNeedsOnboarding(true);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setIsAuthenticated(false);
        setNeedsOnboarding(false);
        setLoading(false);
      }
    });

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth check timeout - defaulting to unauthenticated');
        setIsAuthenticated(false);
        setNeedsOnboarding(false);
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  return { isAuthenticated, needsOnboarding, loading };
};
