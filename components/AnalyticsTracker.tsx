
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This is the global function that Google Analytics script adds to the window
declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event',
            targetId: string,
            config?: any
        ) => void;
    }
}

const AnalyticsTracker: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // Check if the gtag function exists (it's added by the Google Analytics script)
        if (typeof window.gtag === 'function') {
            // =====================================================================
            // ACTION REQUIRED: Replace with your actual Google Analytics ID.
            // =====================================================================
            const measurementId = 'G-8Z2CZM892J'; 

            // Send a page_view event every time the location changes
            window.gtag('config', measurementId, {
                page_path: location.pathname + location.search + location.hash,
                page_title: document.title,
            });
        }
    }, [location]);

    return null; // This component does not render anything
};

export default AnalyticsTracker;
