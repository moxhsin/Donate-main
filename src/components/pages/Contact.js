import React from 'react';
import { Theme } from './Theme';


// Create a functional component
const Contact = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: Theme.background,
            color: Theme.text,
            fontFamily: Theme.fontPrimary,
            textAlign: 'center'
        }}>
            <h1 style={{
                fontSize: '5rem', // Large size for the text
                margin: 0,
                color: '#C9A86A',
                textShadow: `2px 2px ${Theme.secondary}`
            }}>
                Coming Soon...
            </h1>
        </div>
    );
};

export default Contact;
