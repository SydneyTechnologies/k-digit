/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";

function Canvas({
  height = null,
  width = null,
  lineWidth = 5,
  lineCap = "round",
  strokeStyle = "black",
  callback = () => {},
}) {
  const [initialize, setInitialize] = useState(false);
  const [frame, setFrame] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({
    width: 600,
    height: 600,
  }); // [width, height
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;

    setCanvasSize({
      width: width || parent.offsetWidth,
      height: height || parent.offsetHeight,
    });

    const startDrawing = (event) => {
      setDrawing(true);

      if (parent && !initialize) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, parent.offsetWidth, parent.offsetHeight);
        console.log("SETUP BLACK CANVAS");
        setInitialize(true);
      }
      const rect = canvas.getBoundingClientRect();

      setFrame({
        top: event.clientY - rect.top,
        left: event.clientX - rect.left,
        right: event.clientX - rect.left,
        bottom: event.clientY - rect.top,
      });

      console.log(
        "START DRAWING",
        event.clientX - rect.left,
        event.clientY - rect.top
      );
      draw(event);
    };

    const draw = (event) => {
      if (!drawing) return;

      ctx.lineWidth = lineWidth;
      ctx.lineCap = lineCap;
      ctx.strokeStyle = strokeStyle;

      let x, y;
      if (event.type.includes("mouse")) {
        const rect = canvas.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      } else if (event.type.includes("touch")) {
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      }

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);

      setFrame((prevFrame) => ({
        top: Math.min(y, prevFrame.top),
        left: Math.min(x, prevFrame.left),
        right: Math.max(x, prevFrame.right),
        bottom: Math.max(y, prevFrame.bottom),
      }));

      // Prevent default behavior for touch events
      if (event.type.includes("touch")) {
        event.preventDefault();
      }
    };

    const stopDrawing = async (event) => {
      event;
      setDrawing(false);
      ctx.beginPath(); // Reset the drawing path
      const rect = canvas.getBoundingClientRect();

      console.log(
        "STOP DRAWING",
        event.clientX - rect.left,
        event.clientY - rect.top
      );

      const displayCanvas = document.createElement("canvas");
      const displayCtx = displayCanvas.getContext("2d");

      // Set canvas dimensions
      displayCanvas.width = frame.right - frame.left + 10;
      displayCanvas.height = frame.bottom - frame.top + 10;
      displayCanvas.style.width = frame.right - frame.left;
      displayCanvas.style.height = frame.bottom - frame.top;

      console.log(displayCanvas.width, displayCanvas.height);

      // Use the image data from the other canvas to draw on the display canvas
      if (!event.type.includes("leave")) {
        try {
          const frameImageData = ctx.getImageData(
            frame.left - 5,
            frame.top - 5,
            frame.right - frame.left + 10,
            frame.bottom - frame.top + 10
          );

          displayCtx.putImageData(frameImageData, 0, 0);
          const base64ImageData = displayCanvas.toDataURL("image/png");

          console.log(base64ImageData);

          await callback({ image: base64ImageData });
        } catch (error) {
          console.error("Error processing image data:", error);
        }
      }
    };

    const handleMouseDown = (event) => startDrawing(event);
    const handleMouseMove = (event) => draw(event);
    const handleMouseUp = (event) => stopDrawing(event);
    const handleMouseLeave = (event) => stopDrawing(event);

    const handleTouchStart = (event) => startDrawing(event);
    const handleTouchMove = (event) => draw(event);
    const handleTouchEnd = (event) => stopDrawing(event);
    const handleTouchCancel = (event) => stopDrawing(event);

    // Attach event listeners
    canvas.addEventListener("mousedown", handleMouseDown, { passive: false });
    canvas.addEventListener("mousemove", handleMouseMove, { passive: false });
    canvas.addEventListener("mouseup", handleMouseUp, { passive: false });
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: false });

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", handleTouchCancel, {
      passive: false,
    });

    // Clean up event listeners on unmount
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);

      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [drawing, height, frame, initialize]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      style={{
        border: "1px solid black",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
      }}
    />
  );
}

export default Canvas;
