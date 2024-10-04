export const handleFullscreen = (imageRef) => {
    if (imageRef.current) {
      if (imageRef.current.requestFullscreen) {
        imageRef.current.requestFullscreen();
      } else if (imageRef.current.mozRequestFullScreen) { /* Firefox */
        imageRef.current.mozRequestFullScreen();
      } else if (imageRef.current.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        imageRef.current.webkitRequestFullscreen();
      } else if (imageRef.current.msRequestFullscreen) { /* IE/Edge */
        imageRef.current.msRequestFullscreen();
      }
    }
  };