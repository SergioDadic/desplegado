import { useState, useEffect } from 'react';

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
    };

    // Suscribirse al evento resize
    window.addEventListener('resize', handleResize);

    // Desuscribirse al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // El segundo parámetro [] garantiza que este efecto solo se ejecute una vez, equivalente a componentDidMount
  //console.log("widthV:" + windowDimensions.windowWidth);
  return windowDimensions.windowWidth;
};

export default useWindowDimensions;