import { useEffect } from 'react';

const useLayoutEffects = () => {
  useEffect(() => {
    const header = document.querySelector('[data-header]');
    const goTopBtn = document.querySelector('[data-go-top]');
    const overlay = document.querySelector('[data-overlay]');
    const navOpenBtn = document.querySelector('[data-nav-open-btn]');
    const navCloseBtn = document.querySelector('[data-nav-close-btn]');
    const navbarMenu = document.querySelector('[data-navbar-menu]'); // Changed from data-navbar to data-navbar-menu
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const navbarBurger = document.querySelector('.navbar-burger'); // Select the Bulma burger element

    const toggleNavbar = () => {
      navbarMenu?.classList.toggle('is-active'); // Bulma uses 'is-active' for open/close state
      navbarBurger?.classList.toggle('is-active'); // Toggle 'is-active' on the burger itself
      overlay?.classList.toggle('active'); // Retain 'active' for overlay if not managed by Bulma
    };

    navOpenBtn?.addEventListener('click', toggleNavbar);
    navCloseBtn?.addEventListener('click', toggleNavbar);
    overlay?.addEventListener('click', toggleNavbar);
    navLinks?.forEach((link) => link.addEventListener('click', toggleNavbar));

    const handleScroll = () => {
      if (window.scrollY >= 200) {
        header?.classList.add('has-background-dark'); // Use a Bulma background class for "active" header
        header?.classList.add('is-fixed-top'); // Ensure it's fixed
        goTopBtn?.classList.add('is-active'); // Use Bulma's 'is-active' for show/hide
      } else {
        header?.classList.remove('has-background-dark');
        header?.classList.remove('is-fixed-top');
        goTopBtn?.classList.remove('is-active');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

export default useLayoutEffects;