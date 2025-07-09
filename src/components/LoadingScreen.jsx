import React from 'react';

const LoadingScreen = ({ progress, isVisible, assetCounts }) => {
    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                color: 'white',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    maxWidth: '400px',
                    padding: '20px',
                }}
            >
                <h1
                    style={{
                        fontSize: '2.5rem',
                        marginBottom: '1rem',
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Loading Scene
                </h1>

                <div
                    style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '1rem',
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                            transition: 'width 0.3s ease',
                            borderRadius: '4px',
                        }}
                    />
                </div>

                <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    {progress.toFixed(1)}%
                </div>

                {assetCounts && (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '0.5rem',
                            marginTop: '1rem',
                            fontSize: '0.9rem',
                            opacity: 0.8,
                        }}
                    >
                        <div>🖼️ Textures: {assetCounts.textures || 0}</div>
                        <div>🖼️ Images: {assetCounts.images || 0}</div>
                        <div>🏗️ Models: {assetCounts.models || 0}</div>
                        <div>🎨 SVGs: {assetCounts.svgs || 0}</div>
                    </div>
                )}

                <div
                    style={{
                        marginTop: '2rem',
                        fontSize: '0.8rem',
                        opacity: 0.6,
                        fontStyle: 'italic',
                    }}
                >
                    Preparing your creative experience...
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen; 