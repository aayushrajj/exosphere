
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error);
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        if (!session) {
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
        }
        
        // Check if user needs onboarding
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          if (mounted) {
            setNeedsOnboarding(true);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          // If profile exists and onboarding_completed is true, user doesn't need onboarding
          const needsOnboardingStatus = !profile || !profile.onboarding_completed;
          console.log('Onboarding status check:', { profile, needsOnboardingStatus });
          setNeedsOnboarding(needsOnboardingStatus);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setNeedsOnboarding(false);
          setLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, session?.user?.id);

      try {
        if (event === 'SIGNED_OUT' || !session) {
          setIsAuthenticated(false);
          setNeedsOnboarding(false);
          setLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setIsAuthenticated(true);
          
          // Check onboarding status
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Profile fetch error on auth change:', profileError);
            setNeedsOnboarding(true);
          } else {
            // If profile exists and onboarding_completed is true, user doesn't need onboarding
            const needsOnboardingStatus = !profile || !profile.onboarding_completed;
            console.log('Onboarding status on auth change:', { profile, needsOnboardingStatus });
            setNeedsOnboarding(needsOnboardingStatus);
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

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { isAuthenticated, needsOnboarding, loading };
};
