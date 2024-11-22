import { AuthButton } from './auth-button';

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-blue-600">Essay Grading System</h1>
          </div>
          <div>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}