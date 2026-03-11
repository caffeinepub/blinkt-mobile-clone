import { Link, useNavigate } from '@tanstack/react-router';
import { Search, Bookmark, Menu, X } from 'lucide-react';
import { useState } from 'react';
import SearchBar from './SearchBar';
import LoginButton from './LoginButton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/generated/blinkt-logo.dim_256x256.png" alt="Blinkt" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight text-foreground">Blinkt</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          <SearchBar />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/bookmarks' })}
            className="text-muted-foreground hover:text-foreground"
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          <LoginButton />
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/bookmarks' })}
            className="text-muted-foreground hover:text-foreground"
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 pt-6">
                <SearchBar onSearch={() => setMobileMenuOpen(false)} />
                <LoginButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
