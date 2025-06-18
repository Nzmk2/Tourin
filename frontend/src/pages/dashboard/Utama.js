import React, { useState } from 'react';

import Header from './Header.js'; 
import Hero from './Hero.js';     
import Popular from './Popular.js';  
import Packages from './Packages.js';  
import Gallery from './Gallery.js';   
import useLayoutEffects from './LayoutEffect.js';

function Utama() {
  useLayoutEffects();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Popular />
        <Packages />
        <Gallery />
      </main>
      <a href="#top" className="go-top button is-primary is-rounded is-large is-fixed-bottom is-fixed-right m-4 has-shadow" data-go-top>
        <ion-icon name="chevron-up-outline"></ion-icon>
      </a>
    </>
  );
}

export default Utama;