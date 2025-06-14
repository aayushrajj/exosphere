
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();

  const handleOnboardingComplete = () => {
    navigate('/dashboard');
  };

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default Onboarding;
