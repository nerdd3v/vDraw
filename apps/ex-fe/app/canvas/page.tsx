"use client";
import React, { useEffect, useRef } from "react";

type Shape = {
  type: string;
  x: number;
  y: number;
  height: number;
  width: number;
};

function CanvasDraw() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size for drawing surface
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let existingShapes: Shape[] = [];
    let offsetX = 0;
    let offsetY = 0;

    let isDrawing = false;
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let panStartX = 0;
    let panStartY = 0;

    let canvasRect = canvas.getBoundingClientRect();

    function clearAndRedraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      existingShapes.forEach((shape) => {
        if (shape.type === "rect") {
          ctx.strokeStyle = "white";
          ctx.strokeRect(
            shape.x - offsetX,
            shape.y - offsetY,
            shape.width,
            shape.height
          );
        }
      });
    }

    function getVirtualCoordinates(clientX: number, clientY: number) {
      return {
        x: clientX - canvasRect.left + offsetX,
        y: clientY - canvasRect.top + offsetY,
      };
    }

    function onMouseDown(e: MouseEvent) {
      e.preventDefault();
      canvasRect = canvas.getBoundingClientRect();

      if (e.button === 2) {
        // Right mouse for panning
        isPanning = true;
        panStartX = e.clientX;
        panStartY = e.clientY;
        canvas.style.cursor = "grabbing";
      } else if (e.button === 0) {
        // Left mouse for drawing
        isDrawing = true;
        const pos = getVirtualCoordinates(e.clientX, e.clientY);
        startX = pos.x;
        startY = pos.y;
      }
    }

    function onMouseUp(e: MouseEvent) {
      e.preventDefault();
      if (isPanning && e.button === 2) {
        isPanning = false;
        canvas.style.cursor = "default";
      } else if (isDrawing && e.button === 0) {
        isDrawing = false;
        const pos = getVirtualCoordinates(e.clientX, e.clientY);
        const width = pos.x - startX;
        const height = pos.y - startY;
        existingShapes.push({ type: "rect", x: startX, y: startY, width, height });
        clearAndRedraw();
      }
    }

    function onMouseMove(e: MouseEvent) {
      e.preventDefault();
      if (isPanning) {
        offsetX -= e.clientX - panStartX;
        offsetY -= e.clientY - panStartY;
        panStartX = e.clientX;
        panStartY = e.clientY;
        clearAndRedraw();
        return;
      }

      if (isDrawing) {
        const pos = getVirtualCoordinates(e.clientX, e.clientY);
        const width = pos.x - startX;
        const height = pos.y - startY;
        clearAndRedraw();
        ctx.strokeStyle = "white";
        ctx.strokeRect(startX - offsetX, startY - offsetY, width, height);
      }
    }

    // Prevent context menu on right click for canvas to use right click for panning
    function onContextMenu(e: MouseEvent) {
      e.preventDefault();
    }

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("contextmenu", onContextMenu);

    clearAndRedraw();

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  return (
    <>
    <canvas
      ref={canvasRef}
      style={{ width: "100vw", height: "100vh", display: "block", cursor: "default" }}
      />
     
    </>
  );
}

export default CanvasDraw;
