import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

const ConfirmNewEmailPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-tech-light-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center">
          <MailCheck className="h-16 w-16 text-tech-purple" />
        </div>
        <h1 className="text-2xl font-bold text-tech-dark-gray">
          Check your email
        </h1>
        <p className="text-gray-600">
          We've sent a confirmation link to both email addresses. Please click
          both links to update your email.
        </p>

        <div className="pt-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or
          </p>
          <Button variant="default" className="mt-3 px-4 py-2">
            Resend confirmation email
          </Button>
        </div>

        <div className="pt-6">
          <Link to="/login">
            <Button className="px-4 py-2" variant="default">
              Return to sign in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmNewEmailPage;
