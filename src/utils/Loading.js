import React from 'react'; // Import React
import styled from 'styled-components';
import { RotatingLines } from 'react-loader-spinner';

export const Theme = {
  fontPrimary: "'Open Sans', sans-serif",
  fontSecondary: "'Lato', sans-serif",
  fontTertiary: "'Playfair Display', serif", // Fixed key name for consistency
  primary: '#C9A86A', // Muted gold
  secondary: '#8A7968', // Warm taupe
  accent: '#D64C31', // Deep coral
  background: '#0F1419', // Rich dark blue-gray
  surface: '#1E2328', // Slightly lighter blue-gray
  text: '#F2F2F2', // Off-white
  textDark: '#A0A0A0', // Medium gray
};

const FullScreenContainer = styled.div`
  position: fixed; /* Fixes the position to the viewport */
  top: 0;
  left: 0;
  width: 100vw; /* Full width */
  height: 100vh; /* Full height */
  background-color: rgba(15, 20, 25, 0.5); /* Semi-transparent dark background */
  backdrop-filter: blur(10px); /* Apply blur effect */
  color: ${Theme.text}; /* Text color */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it appears on top of other elements */
`;

const Loading = ({ isLoading }) => {
    return (
        <>
            {isLoading && ( // Use isLoading prop for conditional rendering
                <FullScreenContainer>
                    <RotatingLines
                        height="40"
                        width="40"
                        radius="9"
                        strokeColor={Theme.primary} // Use strokeColor instead of color
                        ariaLabel="loading"
                    />
                </FullScreenContainer>
            )}
        </>
    );
};

export default Loading;