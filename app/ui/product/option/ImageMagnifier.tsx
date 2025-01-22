import Image from 'next/image';

interface ImageMagnifierProps {
  imgSrc: string;
  imageIndex: number;
  index: number;
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({ imgSrc, imageIndex, index }) => {
  const magnify = (imgID: string, zoom: number) => {
    const img = document.getElementById(imgID) as HTMLImageElement;
    const glass = document.createElement("div");

    glass.setAttribute("className", "img-magnifier-glass")
    img.parentElement?.insertBefore(glass, img);

    glass.style.backgroundImage = `url('${img.src}')`;
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;

    const bw = 3;
    const w = glass.offsetWidth / 2;
    const h = glass.offsetHeight / 2;

    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);

    function moveMagnifier(e: MouseEvent | TouchEvent) {
      e.preventDefault();
      const pos = getCursorPos(e);
      let x = pos.x;
      let y = pos.y;

      if (x > img.width - (w / zoom)) x = img.width - (w / zoom);
      if (x < w / zoom) x = w / zoom;
      if (y > img.height - (h / zoom)) y = img.height - (h / zoom);
      if (y < h / zoom) y = h / zoom;

      glass.style.left = `${x - w}px`;
      glass.style.top = `${y - h}px`;
      glass.style.backgroundPosition = `-${(x * zoom) - w + bw}px -${(y * zoom) - h + bw}px`;
    }

    function getCursorPos(e: MouseEvent | TouchEvent) {
      const a = img.getBoundingClientRect();
      let x = e instanceof MouseEvent ? e.pageX - a.left : (e.touches[0].pageX - a.left);
      let y = e instanceof MouseEvent ? e.pageY - a.top : (e.touches[0].pageY - a.top);
      x = x - window.scrollX;
      y = y - window.scrollY;
      return { x, y };
    }
  };

  return (
    <div className="relative">
      <Image
        id='main-image'
        src={imgSrc}
        alt=""
        width={1920}
        height={1082}
        onLoadingComplete={() => magnify("main-image", 3)}
        aria-hidden={imageIndex !== index}
        className={`${imageIndex === index ? 'block' : 'hidden'} object-cover w-auto`}
      />
      <style jsx>{`
        .img-magnifier-glass {
          position: absolute;
          border: 3px solid #000;
          border-radius: 50%;
          cursor: none;
          width: 100px;
          height: 100px;
        }
      `}</style>
    </div>
  );
};

export default ImageMagnifier;