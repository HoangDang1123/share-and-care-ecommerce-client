import Image from 'next/image';
import { MouseEvent, useState } from 'react';

interface ImageMagnifierProps {
  src: string,
  className: string,
  width: number,
  height: number,
  alt: string,
  magnifierHeight: number,
  magnifierWidth: number,
  zoomLevel: number,
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
  src,
  className,
  width,
  height,
  alt,
  magnifierHeight = 150,
  magnifierWidth = 150,
  zoomLevel = 3
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [[x, y], setXY] = useState([0, 0]);

  const mouseEnter = (e: MouseEvent<HTMLImageElement, globalThis.MouseEvent>) => {
    const el = e.currentTarget;

    const { width, height } = el.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  }

  const mouseLeave = (e: MouseEvent<HTMLImageElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    setShowMagnifier(false);
  }

  const mouseMove = (e: MouseEvent<HTMLImageElement, globalThis.MouseEvent>) => {
    const el = e.currentTarget;
    const { top, left } = el.getBoundingClientRect();

    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;

    setXY([x, y]);
  };

  return <div className="relative inline-block">
    <Image
      src={src}
      className={className}
      width={width}
      height={height}
      alt={alt}
      onMouseEnter={(e) => mouseEnter(e)}
      onMouseLeave={(e) => mouseLeave(e)}
      onMouseMove={(e) => mouseMove(e)}
    />
    <div
      style={{
        display: showMagnifier ? '' : 'none',
        position: 'absolute',
        pointerEvents: 'none',
        height: `${magnifierHeight}px`,
        width: `${magnifierWidth}px`,
        opacity: '1',
        border: '2px solid lightgrey',
        backgroundColor: 'white',
        borderRadius: '90px',
        backgroundImage: `url('${src}')`,
        backgroundRepeat: 'no-repeat',
        top: `${y - magnifierHeight / 2}px`,
        left: `${x - magnifierWidth / 2}px`,
        backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
        backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
        backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
      }}
    />
  </div>
};

export default ImageMagnifier;