import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DemoFlow, DemoState } from './components/DemoFlow';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const [demoState, setDemoState] = useState<DemoState>('selection');
  const [showDemo, setShowDemo] = useState(false);

  // Handle scroll to demo section
  const handleDemoClick = () => {
    setShowDemo(true);
    setDemoState('selection');
    setTimeout(() => {
      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prevent body scroll when in demo mode
  useEffect(() => {
    if (showDemo) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showDemo]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar onDemoClick={handleDemoClick} />
      
      <main>
        <Hero onDemoClick={handleDemoClick} />
        
        {showDemo && (
          <ErrorBoundary>
            <DemoFlow 
              demoState={demoState} 
              setDemoState={setDemoState} 
              onClose={handleCloseDemo} 
            />
          </ErrorBoundary>
        )}
        
        <Features />
        <HowItWorks />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
