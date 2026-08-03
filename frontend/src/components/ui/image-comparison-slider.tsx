import React, { useState, useRef, useCallback, useEffect } from 'react';

// This component takes two image URLs (before and after) and creates a slider to compare them.
export const ImageComparison = ({ beforeImage, afterImage, altBefore = 'Before', altAfter = 'After' }) => {
    // State to track the slider's position (from 0 to 100)
    const [sliderPosition, setSliderPosition] = useState(50);
    // State to track if the user is currently dragging the slider
    const [isDragging, setIsDragging] = useState(false);

    // Ref to the main container element to get its dimensions
    const containerRef = useRef(null);

    // Function to handle the slider movement (for both mouse and touch)
    const handleMove = useCallback((clientX) => {
        // If not dragging or no container ref, do nothing
        if (!isDragging || !containerRef.current) return;
        
        // Get the bounding box of the container
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate the new slider position as a percentage
        let newPosition = ((clientX - rect.left) / rect.width) * 100;

        // Clamp the position to be between 0 and 100 to prevent it from going out of bounds
        newPosition = Math.max(0, Math.min(100, newPosition));
        
        setSliderPosition(newPosition);
    }, [isDragging]);

    // Mouse event handlers
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => handleMove(e.clientX);
    
    // Touch event handlers
    const handleTouchStart = () => setIsDragging(true);
    const handleTouchEnd = () => setIsDragging(false);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

    // Effect to add and clean up global event listeners for mouse up/leave
    // This ensures dragging stops even if the cursor leaves the component area
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseUp]);

    return (
        <div 
            ref={containerRef}
            className="relative w-full max-w-4xl mx-auto select-none rounded-xl overflow-hidden shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the container
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* After Image (Top Layer) - Its visibility is controlled by the clip-path */}
            <div
                className="absolute top-0 left-0 h-full w-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                {/* AI Enhancement Effect Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-30 bg-[linear-gradient(180deg,transparent_0%,rgba(59,130,246,0.3)_50%,transparent_100%)] animate-[scanline_3s_linear_infinite]" />
                
                {/* Subtle brightness boost and tint to the 'after' image */}
                <img
                    src={afterImage}
                    alt={altAfter}
                    className="h-full w-full object-cover object-left filter brightness-105 contrast-105 sepia-[0.1] hue-rotate-[190deg]"
                    draggable="false"
                />
            </div>

            {/* Before Image (Bottom Layer) */}
            <img
                src={beforeImage}
                alt={altBefore}
                className="block h-full w-full object-cover object-left"
                draggable="false"
            />

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1.5 bg-white/80 cursor-ew-resize flex items-center justify-center"
                style={{ left: `calc(${sliderPosition}% - 0.375rem)` }} // Center the handle on the line
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className={`bg-white rounded-full h-12 w-12 flex items-center justify-center shadow-md transition-all duration-200 ease-in-out ${isDragging ? 'scale-110 shadow-xl' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                        <line x1="15" y1="18" x2="9" y2="12"></line>
                        <line x1="9" y1="6" x2="15" y2="12"></line>
                    </svg>
                </div>
            </div>
        </div>
    );
};
