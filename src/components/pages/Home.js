import React, { useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserAddOutlined, DollarCircleOutlined, BarChartOutlined, HeartOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import video from "../videos/alternate_video2.mp4";
import API from "../../utils/API";

// Import images
import Kids from '../images/kids.png';
import Girl from '../images/girl.png';
import Kids2 from '../images/container.png';
import { Theme } from "./Theme";

gsap.registerPlugin(ScrollTrigger);



const CircularButton = styled.button`
    background-color: ${Theme.primary}; // Use primary color from theme
    color: ${Theme.text}; // Use text color from theme
    border: none;
    border-radius: 50%; // Makes the button circular
    width: 50px; // Set width for the button
    height: 50px; // Set height for the button
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 24px; // Adjust font size for the arrow
    transition: background-color 0.3s;

    &:hover {
        background-color: ${Theme.accent}; // Change background on hover to accent color
    }
`;
const StyledWrapper = styled.div`
  font-family: ${Theme.fontPrimary};
  background-color: ${Theme.background};
  color: ${Theme.text};
`;

const Section = styled.section`
  font-family: ${Theme.fontPrimary};
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
`;

const HeroSection = styled(Section)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, ${Theme.background}, ${Theme.surface});
  position: relative;
`;

const HeroImage = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const Heading = styled.h2`
  font-family: ${Theme.fontSecondary};
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${Theme.primary};
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: ${Theme.textDark};
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

const StyledButton = styled(Link)`
  display: inline-block;
  background-color: ${Theme.accent};
  color: ${Theme.text};
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  &:hover {
    background-color: ${Theme.secondary};
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const IconBox = styled.div`
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background-color: ${Theme.surface};
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: ${Theme.primary};
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const CampaignCard = styled.div`
  background-color: ${Theme.surface};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const CampaignImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CampaignContent = styled.div`
  padding: 1.5rem;
`;

const CampaignTitle = styled.h3`
  font-family: ${Theme.fontSecondary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${Theme.primary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${Theme.background};
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const Progress = styled.div`
  width: ${props => props.percent}%;
  height: 100%;
  background-color: ${Theme.secondary};
`;

const H3 = styled.h3`
  font-family: ${Theme.fontSecondary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #E0C9A6; // Soft gold color
`;
const Home = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [recipientType, setRecipientType] = useState('Education'); // Default selection

    const heroRef = useRef(null);
    const headingRef = useRef(null);
    const paragraphRef = useRef(null);
    const buttonRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;

    const totalPages = Math.ceil(campaigns.length / itemsPerPage);

    // Get the current campaigns to display based on the current page
    const displayedCampaigns = campaigns.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const userData = JSON.parse(sessionStorage.getItem('userData'));

    // Fetch campaigns based on selected recipient type
    const fetchCampaigns = async (type) => {
        try {
            const response = await API.getFilteredCampaigns(type);
            setCampaigns(response.data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        }
    };

    // Effect to fetch campaigns when component mounts or recipientType changes
    useEffect(() => {
        fetchCampaigns(recipientType);
    }, [recipientType]);

    useEffect(() => {
        const tl = gsap.timeline();

        // Hero section animations
        tl.from(headingRef.current, {
            opacity: 0,
            y: 50,
            duration: 1
        })
            .from(paragraphRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.3
            }, "-=0.5")
            .from(buttonRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.5
            }, "-=0.3");

        // Scroll-triggered animations
        gsap.utils.toArray('.fade-in').forEach((element) => {
            gsap.from(element, {
                opacity: 0,
                y: 50,
                duration: 0.5,
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Parallax effect for images
        gsap.utils.toArray('.parallax-image').forEach(img => {
            gsap.to(img, {
                yPercent: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: img,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Staggered animation for grid items
        gsap.utils.toArray('.grid-item').forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Progress bar animation
        gsap.utils.toArray('.progress-bar').forEach(bar => {
            gsap.to(bar.querySelector('.progress'), {
                width: bar.dataset.progress + '%',
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bar,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    return (
        <StyledWrapper>
            <HeroSection ref={heroRef}>
                <HeroImage
            autoPlay
            loop
            muted
            playsInline
          // poster="https://www.pexels.com/assets/videos/free-videos-7daa2ef41a140f70c757ce91913a4ecb90570b7d7cd2b401bae868350e02c83a.jpg"
          >
            <source src={video} type="video/mp4"></source>
          </HeroImage>
                <ContentWrapper>
                    <Heading ref={headingRef}>Ignite Change Through Giving</Heading>
                    <Paragraph ref={paragraphRef}>Join our mission to create lasting impact. Together, we can illuminate lives and build a brighter future for all.</Paragraph>
                    <StyledButton to="/donate" ref={buttonRef}>Start Giving</StyledButton>
                </ContentWrapper>
            </HeroSection>

            <Section>
                <ContentWrapper>
                    <Heading className="fade-in">Why Choose Us</Heading>
                    <Grid>
                        <IconBox className="grid-item">
                            <IconWrapper><TeamOutlined /></IconWrapper>
                            <H3>Community</H3>
                            <p>Join a network of compassionate individuals dedicated to making a difference.</p>
                        </IconBox>
                        <IconBox className="grid-item">
                            <IconWrapper><BarChartOutlined /></IconWrapper>
                            <H3>Transparency</H3>
                            <p>We ensure honesty and fairness in all our actions, always doing what's right.</p>
                        </IconBox>
                        <IconBox className="grid-item">
                            <IconWrapper><HeartOutlined /></IconWrapper>
                            <H3>Impact</H3>
                            <p>See the real-world impact of your donations and how they change lives.</p>
                        </IconBox>
                    </Grid>
                </ContentWrapper>
            </Section>

            {/* Featured Campaigns Section with Dropdown */}
            <Section>
    <ContentWrapper>
        <Heading className="fade-in">Featured Campaigns</Heading>
        <div className="fade-in">
        {/* Dropdown for selecting recipient type */}
        <select value={recipientType} onChange={(e) => setRecipientType(e.target.value)} style={{ marginBottom: '20px', padding: '10px', fontSize: '16px', backgroundColor: '#D64C31', color:'#F2F2F2', display: 'flex', borderRadius:'21px', fontFamily: "'Playfair Display', serif" }}>
            <option value="Education">Education</option>
            <option value="Medical">Medical</option>
        </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Previous Button */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {currentPage > 0 && (
                    <CircularButton onClick={() => setCurrentPage(currentPage - 1)} style={{ marginRight: '10px' }}>
                        &lt; {/* Previous arrow */}
                    </CircularButton>
                )}

                {/* Campaign Cards Grid */}
                <Grid style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', flexGrow: 1 }}>
                    {displayedCampaigns.length > 0 ? (
                        displayedCampaigns.map((campaign) => {
                            const { _id, image, title, goal, amountRaised } = campaign;
                            const percent = (amountRaised / goal) * 100;

                            return (
                                <CampaignCard key={_id} className="grid-item" style={{ minWidth: '300px', marginRight: '10px' }}>
                                    {image && <CampaignImage src={image} alt={title} className="parallax-image" />}
                                    <CampaignContent>
                                        <CampaignTitle>{title}</CampaignTitle>
                                        <ProgressBar className="progress-bar" data-progress={percent}>
                                            <Progress percent={percent} />
                                        </ProgressBar>
                                        <Paragraph>${amountRaised} raised of ${goal} goal</Paragraph>
                                        <StyledButton to={`/donate-details/${_id}`}>Donate Now</StyledButton>
                                    </CampaignContent>
                                </CampaignCard>
                            );
                        })
                    ) : (
                        <Paragraph>No campaigns available for this category.</Paragraph>
                    )}
                </Grid>

                {currentPage < totalPages - 1 && (
                    <CircularButton onClick={() => setCurrentPage(currentPage + 1)} style={{ marginLeft: '10px' }}>
                        &gt; {/* Next arrow */}
                    </CircularButton>
                )}
            </div>
        </div>
    </ContentWrapper>
</Section>

            <Section>
                <ContentWrapper>
                    <Heading className="fade-in">How It Works</Heading>
                    <Grid>
                        <IconBox className="grid-item">
                            <IconWrapper><UserAddOutlined /></IconWrapper>
                            <H3>Choose a Cause</H3>
                            <p>Browse our campaigns and find a cause that resonates with you.</p>
                        </IconBox>
                        <IconBox className="grid-item">
                            <IconWrapper><DollarCircleOutlined /></IconWrapper>
                            <H3>Make a Donation</H3>
                            <p>Contribute any amount you're comfortable with, securely and easily.</p>
                        </IconBox>
                        <IconBox className="grid-item">
                            <IconWrapper><BarChartOutlined /></IconWrapper>
                            <H3>Share & Inspire</H3>
                            <p>Spread the word and inspire others to join the movement.</p>
                        </IconBox>
                    </Grid>
                </ContentWrapper>
            </Section>

            <Section>
                <ContentWrapper>
                    <Heading className="fade-in">Start Your Own Fundraiser</Heading>
                    <Paragraph>Have a cause you're passionate about? Start your own fundraising campaign and make a difference today.</Paragraph>
                    <StyledButton to="/create-campaign">Create Campaign</StyledButton>
                </ContentWrapper>
            </Section>

            <Section>
            {!userData && (
                <ContentWrapper>
                    <Heading className="fade-in">Join Our Community</Heading>
                    <Paragraph>Connect with like-minded individuals, share your experiences, and amplify your impact.</Paragraph>
                    <StyledButton to="/sign-up">Become a Member</StyledButton> {/* Specified "to" property */}
                </ContentWrapper>
            )}
        </Section>
        </StyledWrapper>
    );
};

export default Home;
