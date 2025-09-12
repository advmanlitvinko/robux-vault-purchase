import { useEffect } from 'react';

// Content Security Policy configuration
export function CSPConfig() {
  useEffect(() => {
    // Add CSP meta tag for enhanced security
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!existingCSP) {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = `
        default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https: blob:;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
        style-src 'self' 'unsafe-inline' https:;
        img-src 'self' data: https: blob:;
        font-src 'self' https:;
        connect-src 'self' https: wss: ws:;
      `.replace(/\s+/g, ' ').trim();
      document.head.appendChild(meta);
    }

    // Add security headers via meta tags where possible
    const securityHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
    ];

    securityHeaders.forEach(({ name, content }) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (!existing) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  }, []);

  return null;
}