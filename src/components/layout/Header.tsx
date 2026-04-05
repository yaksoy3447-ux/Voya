import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { User, LogOut } from 'lucide-react'

export async function Header() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-5 flex justify-between items-center bg-transparent pointer-events-none">
      <Link href="/" className="pointer-events-auto">
        <Image src="/logo.png" alt="Rovago" width={330} height={56} className="h-8 w-auto object-contain brightness-0 invert" />
      </Link>

      <nav className="hidden md:flex items-center gap-8 pointer-events-auto">
        <Link href="/pricing" className="text-sm font-medium text-foreground/60 hover:text-terracotta transition-colors">Pricing</Link>
        <Link href="/about" className="text-sm font-medium text-foreground/60 hover:text-terracotta transition-colors">About</Link>
        <Link href="/blog" className="text-sm font-medium text-foreground/60 hover:text-terracotta transition-colors">Blog</Link>
        <Link href="/contact" className="text-sm font-medium text-foreground/60 hover:text-terracotta transition-colors">Contact</Link>
      </nav>
      
      <div className="flex gap-4 items-center pointer-events-auto">
        {session ? (
            <div className="flex items-center gap-6 glass-card px-6 py-2.5 rounded-full border-glass-border">
               <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                 <User size={16} /> <span>Profile</span>
               </Link>
               <div className="w-px h-4 bg-glass-border"></div>
               <form action="/auth/logout" method="post">
                 <button className="flex items-center gap-2 text-sm font-medium text-terracotta/90 hover:text-terracotta transition-colors">
                   <LogOut size={16} /> <span>Logout</span>
                 </button>
               </form>
            </div>
        ) : (
            <Link href="/login" className="px-6 py-2.5 glass-card rounded-full text-sm font-medium hover:border-terracotta/40 transition-colors shadow-lg shadow-black/20">
               Login
            </Link>
        )}
      </div>
    </header>
  );
}
