import React, { useEffect, useRef, useState } from 'react';

const BGMPlayer = ({ musicUrl }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hintVisible, setHintVisible] = useState(true);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setHintVisible(false);
            }).catch((err) => {
                console.log("Audio play blocked: ", err);
            });
        }
    };

    // Attempt autoplay on first interaction with the document
    useEffect(() => {
        const handleFirstInteraction = () => {
            if (audioRef.current && !isPlaying) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                    setHintVisible(false);
                    cleanup();
                }).catch((err) => {
                    console.log("Autoplay on interaction blocked: ", err);
                });
            }
        };

        const cleanup = () => {
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };

        window.addEventListener('click', handleFirstInteraction);
        window.addEventListener('touchstart', handleFirstInteraction);

        return cleanup;
    }, [isPlaying]);

    return (
        <div className="bgm-player-container">
            {hintVisible && (
                <div className="bgm-hint-bubble">
                    Tap to hear music 🎵
                </div>
            )}
            <button 
                onClick={togglePlay} 
                className={`bgm-button ${isPlaying ? 'playing' : ''}`}
                aria-label="Toggle Music"
            >
                <div className="bgm-disc">
                    🎵
                </div>
            </button>
            <audio ref={audioRef} src={musicUrl} loop prelaod="auto" />
        </div>
    );
};

export default BGMPlayer;
