"use client";
import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<any>(null);

  // Scroll to top on route change to prevent locking
  useEffect(() => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  // Disable smooth scroll wrapper on admin routes due to nested overflow layouts
  const isAdmin = pathname?.startsWith('/adminpro');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.08, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}