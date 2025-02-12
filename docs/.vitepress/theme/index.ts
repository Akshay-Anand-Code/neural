import DefaultTheme from 'vitepress/theme';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // Handle theme switching
    if (typeof window !== 'undefined') {
      const htmlElement = document.documentElement;
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const updateTheme = (isDark: boolean) => {
        htmlElement.classList.toggle('dark', isDark);
      };
      
      // Initial theme
      updateTheme(darkModeMediaQuery.matches);
      
      // Listen for system theme changes
      darkModeMediaQuery.addEventListener('change', (e) => {
        updateTheme(e.matches);
      });

      // Handle app links
      window.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a');
        if (link?.href === 'https://terminal.illuminatibothiddenticker.com/') {
          e.preventDefault();
          window.location.href = 'https://terminal.illuminatibothiddenticker.com/';
        }
      });

      // Scroll to top on page change
      router.onAfterRouteChanged = () => {
        window.scrollTo(0, 0);
      };
    }
  }
};