import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Documentation() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to the Netlify docs site
    window.location.href = `https://jazzy-sunburst-f1a212.netlify.app${location.pathname.replace('/docs', '')}`;
  }, [location]);

  return null;
}