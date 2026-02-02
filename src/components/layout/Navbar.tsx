import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from '@/firebase';
import { login } from '@/auth/login';
import { logout } from '@/auth/logout';
import { Button } from '@/components/ui/button';
import { Bot, History, LogIn, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthenticated = !!user;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <Bot className="h-6 w-6" />
          <span>AI Tools</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/history">
            <Button variant="ghost" size="sm" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Button>
          </Link>

          {!isLoading && (
            isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-medium">{user?.displayName || 'User'}</span>
                  <span className="text-[10px] text-muted-foreground">{user?.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={async () => {
                    try {
                      await logout();
                    } catch (error) {
                      console.error("Logout error:", error);
                    }
                  }}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => {
                  // In a real app, you would open a modal with the AuthForm component
                  alert("In a complete implementation, this would open a login/signup modal");
                }}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
