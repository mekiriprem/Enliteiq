import React, { useEffect, useRef, useState } from 'react';

const ImageScrollGallery: React.FC = () => {
  const images = [
    './gallery1.jpg',
    './gallery2.jpg',
    './gallery3.jpg',
    './gallery1.jpg',
    './gallery2.jpg',
    './gallery3.jpg',
  ];

  const height = '350px';
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial scroll position to center the first image
    if (containerRef.current && images.length > 0) {
      const container = containerRef.current;
      const child = container.children[0] as HTMLElement;
      container.scrollTo({
        left: child.offsetLeft - container.offsetWidth / 2 + child.offsetWidth / 2,
        behavior: 'auto',
      });
    }
  }, []);

  useEffect(() => {
    if (images.length === 0) return; // Prevent interval if no images
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length); // Circular scrolling
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (containerRef.current && images.length > 0) {
      const container = containerRef.current;
      const child = container.children[activeIndex] as HTMLElement;
      container.scrollTo({
        left: child.offsetLeft - container.offsetWidth / 2 + child.offsetWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2.5rem 0',
      }}
    >
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
          padding: '1.5rem 3rem', // Increased padding to prevent clipping
          gap: '2.5rem',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}
      >
        {images.length > 0 ? (
          images.map((src, index) => (
            <div
              key={index}
              style={{
                flex: '0 0 auto',
                minWidth: '250px', // Increased to ensure image visibility
                cursor: 'pointer',
              }}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                style={{
                  height,
                  width: 'auto',
                  maxWidth: '100%',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '2px solid #ffffff',
                  background: '#fff',
                  display: 'block',
                }}
              />
            </div>
          ))
        ) : (
          <div style={{ color: '#666', fontSize: '1.2rem' }}>No images available</div>
        )}
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {images.map((_, i) => (
          <span
            key={i}
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: i === activeIndex ? '#1d4ed8' : '#e5e7eb',
              borderRadius: '50%',
              transition: 'background-color 0.3s, transform 0.3s',
              transform: i === activeIndex ? 'scale(1.4)' : 'scale(1)',
              cursor: 'pointer',
              boxShadow: i === activeIndex ? '0 2px 4px rgba(0,0,0,0.15)' : 'none',
            }}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageScrollGallery;