import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * A flexible, draggable, and resizable window component for React.
 * 
 * @param {object} props - Component props
 * @param {number|'auto'|'full'} [props.w='auto'] - Initial width in pixels, or 'auto', or 'full' (100%)
 * @param {number|'auto'|'full'} [props.h='auto'] - Initial height in pixels, or 'auto', or 'full' (100%)
 * @param {number} [props.x=50] - Initial X position
 * @param {number} [props.y=50] - Initial Y position
 * @param {boolean} [props.boundary=false] - If true, restricts dragging and position to within the viewport
 * @param {number} [props.minW=1] - Minimum width in pixels
 * @param {number} [props.minH=1] - Minimum height in pixels
 * @param {number|'viewport'} [props.maxW=Infinity] - Maximum width in pixels, or 'viewport' to constrain to the browser window size
 * @param {number|'viewport'} [props.maxH=Infinity] - Maximum height in pixels, or 'viewport' to constrain to the browser window size
 * @param {string} [props.overflow='auto'] - CSS overflow property
 * @param {string} [props.overflowX='auto'] - CSS overflow-x property
 * @param {string} [props.overflowY='auto'] - CSS overflow-y property
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.windowColor=''] - Background color (format: 'colorname-intensity/opacity')
 * @param {string} [props.windowBorderColor=''] - Border color
 * @param {string} [props.windowBorderRadius=''] - Border radius
 * @param {number} [props.windowBorder=0] - Border width in pixels
 * @param {string} [props.windowShadow=''] - Box shadow
 * @param {string} [props.windowBackgroundBlur=''] - Backdrop blur filter
 * @param {string} [props.windowBackgroundSaturation='100'] - Backdrop saturation
 * @param {number} [props.zIndex=1] - Z-index value
 * @param {React.ReactNode} children - Child components
 */
function WindowComponent({
    w = 'auto',
    h = 'auto',
    x = 50,
    y = 50,
    minW = 1,
    minH = 1,
    boundary = false,
    overflow = 'auto',
    overflowY = 'auto',
    overflowX = 'auto',
    maxW = Infinity,
    maxH = Infinity,
    className = '',
    windowColor = '',
    windowBorderColor = '',
    windowBorderRadius = '',
    windowBorder = 0,
    windowShadow = '',
    windowBackgroundBlur = '',
    windowBackgroundSaturation = '100',
    zIndex = 1,
    children
}) {
    // --- State and Refs ---
    const [position, setPosition] = useState({ x, y });
    const [size, setSize] = useState({ w, h });
    const [isInteracting, setIsInteracting] = useState(false);
    const [viewportSize, setViewportSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    const interactionRef = useRef(null);
    const windowRef = useRef(null);

    // --- Event Listeners and Effects ---

    // Effect to listen for global window resize events
    useEffect(() => {
        const handleResize = () => {
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // [CORRECTED] Effect to enforce constraints (size and position) on viewport resize
    useEffect(() => {
        if (!windowRef.current) return;
        const { offsetWidth, offsetHeight } = windowRef.current;
        let newX = position.x;
        let newY = position.y;
        let newW = size.w;
        let newH = size.h;
        let posNeedsUpdate = false;
        let sizeNeedsUpdate = false;

        const effectiveMaxW = maxW === 'viewport' ? viewportSize.width : maxW;
        const effectiveMaxH = maxH === 'viewport' ? viewportSize.height : maxH;
        if (typeof newW === 'number' && newW > effectiveMaxW) {
            newW = effectiveMaxW;
            sizeNeedsUpdate = true;
        }
        if (typeof newH === 'number' && newH > effectiveMaxH) {
            newH = effectiveMaxH;
            sizeNeedsUpdate = true;
        }
        
        if (boundary) {
            if (newX < 0) { newX = 0; posNeedsUpdate = true; }
            if (newY < 0) { newY = 0; posNeedsUpdate = true; }
            if (newX + offsetWidth > viewportSize.width) {
                newX = viewportSize.width - offsetWidth;
                posNeedsUpdate = true;
            }
            if (newY + offsetHeight > viewportSize.height) {
                newY = viewportSize.height - offsetHeight;
                posNeedsUpdate = true;
            }
        }
        
        if (posNeedsUpdate) setPosition({ x: newX, y: newY });
        if (sizeNeedsUpdate) setSize({ w: newW, h: newH });

    }, [viewportSize, boundary, maxW, maxH, size.w, size.h, position.x, position.y]);

    // --- Interaction Handlers ---

    // [CORRECTED] Interaction start handler
    const handleInteractionStart = useCallback((e, type) => {
        if (type === 'drag') {
            const target = e.target;
            const interactiveTags = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'A'];
            if (
                interactiveTags.includes(target.tagName) ||
                target.isContentEditable ||
                target.closest('a[href], button')
            ) {
                return; // Do not start drag on interactive elements
            }
        }
        
        e.preventDefault();
        e.stopPropagation();
        if (!windowRef.current) return;
        const { offsetWidth, offsetHeight } = windowRef.current;

        interactionRef.current = {
            type,
            startX: e.clientX,
            startY: e.clientY,
            initialWidth: offsetWidth,
            initialHeight: offsetHeight,
            initialX: position.x,
            initialY: position.y,
        };
        setIsInteracting(true);
    }, [position]);

    // [CORRECTED] Interaction move handler
    const handleInteractionMove = useCallback((e) => {
        if (!interactionRef.current) return;

        const dx = e.clientX - interactionRef.current.startX;
        const dy = e.clientY - interactionRef.current.startY;
        const { type, initialX, initialY, initialWidth, initialHeight } = interactionRef.current;

        if (type === 'drag') {
            let newX = initialX + dx;
            let newY = initialY + dy;

            if (boundary) {
                newX = Math.max(0, Math.min(newX, viewportSize.width - initialWidth));
                newY = Math.max(0, Math.min(newY, viewportSize.height - initialHeight));
            }
            setPosition({ x: newX, y: newY });

        } else if (type.startsWith('resize')) {
            let newWidth = initialWidth;
            let newHeight = initialHeight;
            let newX = initialX;
            let newY = initialY;

            // Tentatively calculate new size
            if (type.includes('right')) newWidth = initialWidth + dx;
            if (type.includes('left')) newWidth = initialWidth - dx;
            if (type.includes('bottom')) newHeight = initialHeight + dy;
            if (type.includes('top')) newHeight = initialHeight - dy;
            
            // Constrain size by min/max props
            const effectiveMaxW = maxW === 'viewport' ? viewportSize.width : maxW;
            const effectiveMaxH = maxH === 'viewport' ? viewportSize.height : maxH;
            let constrainedW = Math.max(minW, Math.min(newWidth, effectiveMaxW));
            let constrainedH = Math.max(minH, Math.min(newHeight, effectiveMaxH));

            // Adjust position based on size change
            if (type.includes('left')) newX = initialX + (initialWidth - constrainedW);
            if (type.includes('top')) newY = initialY + (initialHeight - constrainedH);
            
            // Apply boundary constraints, re-adjusting size if needed
            if (boundary) {
                if (newX < 0) {
                    constrainedW += newX; // Reduce width by the overflow amount (newX is negative)
                    newX = 0;
                }
                if (newY < 0) {
                    constrainedH += newY; // Reduce height by the overflow amount (newY is negative)
                    newY = 0;
                }
                if(newX + constrainedW > viewportSize.width) {
                    constrainedW = viewportSize.width - newX;
                }
                if(newY + constrainedH > viewportSize.height) {
                    constrainedH = viewportSize.height - newY;
                }

                // Ensure size does not go below min after boundary adjustment
                constrainedW = Math.max(minW, constrainedW);
                constrainedH = Math.max(minH, constrainedH);
            }
            
            // Set final state
            setSize({ w: constrainedW, h: constrainedH });
            setPosition({ x: newX, y: newY });
        }
    }, [minW, minH, maxW, maxH, viewportSize, boundary]);

    const handleInteractionEnd = useCallback(() => {
        interactionRef.current = null;
        setIsInteracting(false);
    }, []);

    // Effect for managing global mouse event listeners during interactions
    useEffect(() => {
        if (isInteracting) {
            window.addEventListener('mousemove', handleInteractionMove);
            window.addEventListener('mouseup', handleInteractionEnd);
            window.addEventListener('mouseleave', handleInteractionEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleInteractionMove);
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('mouseleave', handleInteractionEnd);
        };
    }, [isInteracting, handleInteractionMove, handleInteractionEnd]);

    // --- Utility Functions (UNCHANGED) ---
    const formatCssSize = (value) => {
        if (typeof value === 'number') return `${value}px`;
        if (value === 'full') return '100%';
        return value;
    };

    const getColorValue = (color) => {
        if (!color) return 'rgba(107, 114, 128, 1)';
        const [colorName, opacity = '100'] = color.split('/');
        const colorMap = {
            'red-50': '254 242 242', 'red-100': '254 226 226', 'red-200': '252 165 165', 'red-300': '248 113 113', 'red-400': '239 68 68', 'red-500': '239 68 68', 'red-600': '220 38 38', 'red-700': '185 28 28', 'red-800': '153 27 27', 'red-900': '127 29 29',
            'blue-50': '239 246 255', 'blue-100': '219 234 254', 'blue-200': '191 219 254', 'blue-300': '147 197 253', 'blue-400': '96 165 250', 'blue-500': '59 130 246', 'blue-600': '37 99 235', 'blue-700': '29 78 216', 'blue-800': '30 64 175', 'blue-900': '30 58 138',
            'green-50': '240 253 244', 'green-100': '220 252 231', 'green-200': '187 247 208', 'green-300': '134 239 172', 'green-400': '74 222 128', 'green-500': '34 197 94', 'green-600': '22 163 74', 'green-700': '21 128 61', 'green-800': '22 101 52', 'green-900': '20 83 45',
            'yellow-50': '254 252 232', 'yellow-100': '254 249 195', 'yellow-200': '254 240 138', 'yellow-300': '253 224 71', 'yellow-400': '250 204 21', 'yellow-500': '234 179 8', 'yellow-600': '202 138 4', 'yellow-700': '161 98 7', 'yellow-800': '133 77 14', 'yellow-900': '113 63 18',
            'purple-50': '250 245 255', 'purple-100': '243 232 255', 'purple-200': '233 213 255', 'purple-300': '196 181 253', 'purple-400': '167 139 250', 'purple-500': '139 92 246', 'purple-600': '124 58 237', 'purple-700': '109 40 217', 'purple-800': '91 33 182', 'purple-900': '76 29 149',
            'pink-50': '253 242 248', 'pink-100': '252 231 243', 'pink-200': '251 207 232', 'pink-300': '249 168 212', 'pink-400': '244 114 182', 'pink-500': '236 72 153', 'pink-600': '219 39 119', 'pink-700': '190 24 93', 'pink-800': '157 23 77', 'pink-900': '131 24 67',
            'indigo-50': '238 242 255', 'indigo-100': '224 231 255', 'indigo-200': '199 210 254', 'indigo-300': '165 180 252', 'indigo-400': '129 140 248', 'indigo-500': '99 102 241', 'indigo-600': '79 70 229', 'indigo-700': '67 56 202', 'indigo-800': '55 48 163', 'indigo-900': '49 46 129',
            'gray-50': '249 250 251', 'gray-100': '243 244 246', 'gray-200': '229 231 235', 'gray-300': '209 213 219', 'gray-400': '156 163 175', 'gray-500': '107 114 128', 'gray-600': '75 85 99', 'gray-700': '55 65 81', 'gray-800': '31 41 55', 'gray-900': '17 24 39',
            'slate-50': '248 250 252', 'slate-100': '241 245 249', 'slate-200': '226 232 240', 'slate-300': '203 213 225', 'slate-400': '148 163 184', 'slate-500': '100 116 139', 'slate-600': '71 85 105', 'slate-700': '51 65 85', 'slate-800': '30 41 59', 'slate-900': '15 23 42',
            'zinc-50': '250 250 250', 'zinc-100': '244 244 245', 'zinc-200': '228 228 231', 'zinc-300': '212 212 216', 'zinc-400': '161 161 170', 'zinc-500': '113 113 122', 'zinc-600': '82 82 91', 'zinc-700': '63 63 70', 'zinc-800': '39 39 42', 'zinc-900': '24 24 27',
            'emerald-50': '236 253 245', 'emerald-100': '209 250 229', 'emerald-200': '167 243 208', 'emerald-300': '110 231 183', 'emerald-400': '52 211 153', 'emerald-500': '16 185 129', 'emerald-600': '5 150 105', 'emerald-700': '4 120 87', 'emerald-800': '6 95 70', 'emerald-900': '6 78 59',
        };
        const rgb = colorMap[colorName] || '107 114 128';
        const alpha = parseInt(opacity) / 100;
        return `rgba(${rgb.split(' ').join(', ')}, ${alpha})`;
    };

    const getBorderRadius = (radius) => {
        const radiusMap = {
            'none': '0', 'sm': '0.125rem', '': '0.25rem', 'md': '0.375rem', 'lg': '0.5rem', 'xl': '0.75rem', '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem', '5xl': '2.5rem', '6xl': '3rem', '7xl': '3.5rem', '8xl': '4rem', '9xl': '4.5rem', '10xl': '5rem', '11xl': '5.5rem', '12xl': '6rem', 'full': '9999px'
        };
        return radiusMap[radius] || '0.25rem';
    };

    const getBoxShadow = (shadow) => {
        if (!shadow) return undefined;
        const [shadowSize, opacity = '50'] = shadow.split('/');
        const alpha = parseInt(opacity) / 100;
        const shadowMap = {
            'none': 'none', 'sm': `0 1px 2px 0 rgb(0 0 0 / ${alpha})`, '': `0 1px 3px 0 rgb(0 0 0 / ${alpha}), 0 1px 2px -1px rgb(0 0 0 / ${alpha * 0.1})`, 'md': `0 4px 6px -1px rgb(0 0 0 / ${alpha}), 0 2px 4px -2px rgb(0 0 0 / ${alpha * 0.1})`, 'lg': `0 10px 15px -3px rgb(0 0 0 / ${alpha}), 0 4px 6px -4px rgb(0 0 0 / ${alpha * 0.1})`, 'xl': `0 20px 25px -5px rgb(0 0 0 / ${alpha}), 0 8px 10px -6px rgb(0 0 0 / ${alpha * 0.1})`, '2xl': `0 25px 50px -12px rgb(0 0 0 / ${alpha})`, '3xl': `0 35px 60px -15px rgb(0 0 0 / ${alpha})`, '4xl': `0 45px 70px -20px rgb(0 0 0 / ${alpha})`, '5xl': `0 55px 80px -25px rgb(0 0 0 / ${alpha})`, '6xl': `0 65px 90px -30px rgb(0 0 0 / ${alpha})`, '7xl': `0 75px 100px -35px rgb(0 0 0 / ${alpha})`,
        };
        return shadowMap[shadowSize] || shadowMap[''];
    };

    const getBackdropFilter = (blur, saturation) => {
        const filters = [];
        if (blur) {
            const blurMap = {
                'none': 'none', 'sm': 'blur(4px)', '': 'blur(8px)', 'md': 'blur(12px)', 'lg': 'blur(16px)', 'xl': 'blur(24px)', '2xl': 'blur(40px)', '3xl': 'blur(64px)', '4xl': 'blur(96px)', '5xl': 'blur(128px)', '6xl': 'blur(160px)', '7xl': 'blur(192px)',
            };
            filters.push(blurMap[blur] || 'blur(8px)');
        }
        if (saturation && saturation !== '100') {
            filters.push(`saturate(${saturation}%)`);
        }
        return filters.length > 0 ? filters.join(' ') : undefined;
    };

    // --- Styles (with one correction) ---
    const windowStyle = {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        // [CORRECTED] Allow text selection when not interacting
        userSelect: isInteracting ? 'none' : 'auto', 
        position: 'absolute',
        width: formatCssSize(size.w),
        height: formatCssSize(size.h),
        transform: `translate(${position.x}px, ${position.y}px)`,
        display: 'flex',
        flexDirection: 'column',
        overflow: overflow,
        overflowX: overflowX,
        overflowY: overflowY,
        zIndex: zIndex,
        backgroundColor: getColorValue(windowColor),
        borderColor: getColorValue(windowBorderColor),
        borderWidth: windowBorder ? `${windowBorder}px` : undefined,
        borderStyle: windowBorder ? 'solid' : undefined,
        borderRadius: windowBorderRadius ? getBorderRadius(windowBorderRadius) : undefined,
        boxShadow: getBoxShadow(windowShadow),
        backdropFilter: getBackdropFilter(windowBackgroundBlur, windowBackgroundSaturation),
    };

    // --- Resize Handles (UNCHANGED) ---
    const resizeHandles = [
        { type: 'resize-top', style: { position: 'absolute', height: '8px', width: '100%', top: '0', left: '0', cursor: 'n-resize', zIndex: 10 } },
        { type: 'resize-bottom', style: { position: 'absolute', height: '8px', width: '100%', bottom: '0', left: '0', cursor: 's-resize', zIndex: 10 } },
        { type: 'resize-left', style: { position: 'absolute', width: '8px', height: '100%', top: '0', left: '0', cursor: 'w-resize', zIndex: 10 } },
        { type: 'resize-right', style: { position: 'absolute', width: '8px', height: '100%', top: '0', right: '0', cursor: 'e-resize', zIndex: 10 } },
        { type: 'resize-top-left', style: { position: 'absolute', width: '16px', height: '16px', top: '0', left: '0', cursor: 'nw-resize', zIndex: 10 } },
        { type: 'resize-top-right', style: { position: 'absolute', width: '16px', height: '16px', top: '0', right: '0', cursor: 'ne-resize', zIndex: 10 } },
        { type: 'resize-bottom-left', style: { position: 'absolute', width: '16px', height: '16px', bottom: '0', left: '0', cursor: 'sw-resize', zIndex: 10 } },
        { type: 'resize-bottom-right', style: { position: 'absolute', width: '16px', height: '16px', bottom: '0', right: '0', cursor: 'se-resize', zIndex: 10 } },
    ];

    // --- Render (UNCHANGED) ---
    return (
        <div
            ref={windowRef}
            className={className}
            style={windowStyle}
        >
            <div
                style={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'move'
                }}
                onMouseDown={(e) => handleInteractionStart(e, 'drag')}
            >
                {children}
            </div>
            {resizeHandles.map(handle => (
                <div
                    key={handle.type}
                    style={handle.style}
                    onMouseDown={(e) => handleInteractionStart(e, handle.type)}
                />
            ))}
        </div>
    );
}

export default WindowComponent;