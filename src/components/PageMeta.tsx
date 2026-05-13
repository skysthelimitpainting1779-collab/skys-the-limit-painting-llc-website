import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
}

export default function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    // Cleanup if needed, but not strictly necessary for an SPA 
    // where every page will set its own meta.
    return () => {
      // Optional: Revert to default title/desc if desired
    };
  }, [title, description]);

  return null;
}
