
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <LoginHeader />
        <LoginForm />
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Secure executive platform powered by AI</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
