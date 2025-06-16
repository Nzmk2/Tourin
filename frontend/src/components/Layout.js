import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar />
      <div className="columns mt-6" style={{ minHeight: '100vh' }}>
        <div className="column is-2">
          <Sidebar />
        </div>
        <div className="column is-10">
          <main className="box p-5" style={{ height: '100%' }}>
            {children}
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;