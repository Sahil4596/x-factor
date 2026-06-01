import React, { useEffect, useState, useRef } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import HeartCanvas from '../components/HeartCanvas';
import BGMPlayer from '../components/BGMPlayer';
import config from '../data/config.json';

const Proposal = ({ className = '' }) => {
    // Check if configuration matches the current URL or if we are in special mode
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isSpecial = config.enableSpecialMode || (id && id.toLowerCase() === config.targetName.toLowerCase());

    const person = isSpecial ? config.targetName : (id ? id.split('-').join(' ') : 'Special Someone');
    const replyUrl = isSpecial ? config.replyUrl : (searchParams.get('reply') || '');

    // Setup slides list
    const slidesList = isSpecial ? config.slides : [
        { id: "slide-01", image: "/images/image-05.webp", text: "I want to tell you something..." },
        { id: "slide-02", image: "/images/image-03.webp", text: "You have been a source of strength and support for me." },
        { id: "slide-03", image: "/images/image-02.webp", text: "You make me smile so easily. Can you be there, to do it forever?" },
        { id: "slide-04", image: "/images/image-01.webp", text: "I was alone, but when you came, you painted my life with beautiful colors." },
        { id: "slide-05", image: "/images/image-07.webp", text: "Your absence is stronger to me than the presence of thousands of other people." },
        { id: "slide-06", image: "/images/image-06.webp", text: "I fell in love with you not for how you look, just for who you are." },
        { id: "slide-07", image: "/images/image-04.webp", text: "I'm not sure what life could bring. But I'm sure about one thing. I love you." }
    ];

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [saidYes, setSaidYes] = useState(false);
    const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0, isCustom: false });
    const [noHoverCount, setNoHoverCount] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    const currentSlide = slidesList[currentSlideIndex];

    // Page title
    useEffect(() => {
        document.title = `${person} - Be My Valentine`;
    }, [person]);

    // Preload images
    useEffect(() => {
        slidesList.forEach((slide) => {
            const img = new Image();
            img.src = slide.image;
        });
    }, [slidesList]);

    // Handle next slide
    const handleNext = () => {
        if (currentSlideIndex < slidesList.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    // Handle runaway "No" button
    const handleNoHover = (e) => {
        if (e && e.cancelable && e.type === 'touchstart') {
            e.preventDefault();
        }
        setNoHoverCount(prev => prev + 1);
        
        // Use relative dodging instead of absolute viewport coordinates to prevent it from flying off screen
        const jumpRangeX = window.innerWidth < 600 ? 120 : 300; 
        const jumpRangeY = window.innerWidth < 600 ? 80 : 150;
        
        // Random relative offset between -range/2 and +range/2
        const randomOffsetX = (Math.random() - 0.5) * jumpRangeX;
        const randomOffsetY = (Math.random() - 0.5) * jumpRangeY;

        setNoButtonPos({
            x: randomOffsetX,
            y: randomOffsetY,
            isCustom: true
        });
    };

    // Handle "Yes" click
    const handleYes = () => {
        setSaidYes(true);
        setShowConfetti(true);
        // Play an explosion of hearts or trigger WhatsApp redirect after 3 seconds
        setTimeout(() => {
            if (replyUrl) {
                window.location.href = replyUrl;
            }
        }, 3500);
    };

    // Render heart confetti falling
    const renderConfetti = () => {
        if (!showConfetti) return null;
        return (
            <div className="confetti-overlay">
                {[...Array(50)].map((_, i) => {
                    const style = {
                        left: `${Math.random() * 100}vw`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${Math.random() * 3 + 2}s`,
                        fontSize: `${Math.random() * 24 + 16}px`
                    };
                    return (
                        <div key={i} className="confetti-heart" style={style}>
                            💖
                        </div>
                    );
                })}
            </div>
        );
    };

    // Calculate dynamic scaling for the Yes button as she keeps hovering over No
    const yesButtonScale = Math.min(2.5, 1 + noHoverCount * 0.15);

    return (
        <div 
            className={`proposal_page_container ${className}`}
            style={{
                '--current-image': `url(${currentSlide.image})`
            }}
        >
            <HeartCanvas />
            {isSpecial && <BGMPlayer musicUrl={config.musicUrl} />}

            {renderConfetti()}

            <div className="split_background">
                <div className="split_media_side" />
                <div className="split_content_side">
                    <Container className="h-100 d-flex align-items-center justify-content-center">
                        <Row className="w-100 justify-content-center">
                            <Col md={10} lg={8}>
                                {!saidYes ? (
                                    <div className="proposal_card_wrapper glassmorphism_card">
                                        <div className="proposal_progress_bar">
                                            <div 
                                                className="proposal_progress_fill" 
                                                style={{ width: `${((currentSlideIndex + 1) / slidesList.length) * 100}%` }}
                                            />
                                        </div>

                                        <div className="proposal_card_body text-center py-5 px-4">
                                            <h2 className="person_name_heading mb-3">
                                                Hey {person} ✨
                                            </h2>
                                            
                                            <div className="proposal_message_text mb-5">
                                                {currentSlide.text}
                                            </div>

                                            {/* Normal slide navigation */}
                                            {currentSlideIndex < slidesList.length - 1 ? (
                                                <Button 
                                                    variant="rose" 
                                                    className="px-5 py-3 rounded-pill proposal_btn next_btn"
                                                    onClick={handleNext}
                                                >
                                                    Continue 💖
                                                </Button>
                                            ) : (
                                                /* Final slide with decision buttons */
                                                <div className="decision_buttons_area d-flex justify-content-center align-items-center gap-4">
                                                    <Button
                                                        variant="rose"
                                                        className="px-5 py-3 rounded-pill proposal_btn yes_btn"
                                                        style={{ transform: `scale(${yesButtonScale})` }}
                                                        onClick={handleYes}
                                                    >
                                                        Yes! 😍
                                                    </Button>
                                                    <Button
                                                        variant="outline-dark"
                                                        className="px-5 py-3 rounded-pill proposal_btn no_btn"
                                                        style={{
                                                            transform: noButtonPos.isCustom 
                                                                ? `translate(${noButtonPos.x}px, ${noButtonPos.y}px)` 
                                                                : 'none',
                                                            transition: 'transform 0.15s ease-out',
                                                            zIndex: 10
                                                        }}
                                                        onMouseEnter={handleNoHover}
                                                        onTouchStart={handleNoHover}
                                                        onClick={handleNoHover}
                                                    >
                                                        No 😢
                                                    </Button>
                                                </div>
                                            )}

                                            {noHoverCount > 0 && currentSlideIndex === slidesList.length - 1 && (
                                                <p className="funny_warning_text mt-4">
                                                    {noHoverCount >= 5 ? "Okay, now you are just trying to click No! 😂 Only YES allowed!" : "Nice try! Click Yes! 😉"}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* Said YES screen */
                                    <div className="proposal_card_wrapper glassmorphism_card yes_card text-center py-5 px-4 animate_zoom">
                                        <div className="celebration_icon">🎉💖💑</div>
                                        <h2 className="success_heading mt-3 mb-4">
                                            Yay! You said YES!
                                        </h2>
                                        <p className="success_text mb-4">
                                            I am the happiest person alive! I can't wait to live this life with you, my musk melon! 🍈❤️
                                        </p>
                                        <p className="redirecting_text small text-muted">
                                            Redirecting you to message me on WhatsApp...
                                        </p>
                                        {replyUrl && (
                                            <Button 
                                                variant="success" 
                                                href={replyUrl} 
                                                className="px-5 py-3 rounded-pill mt-3 whatsapp_btn"
                                            >
                                                Message me on WhatsApp 💬
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default Proposal;
