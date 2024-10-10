import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Button, Form, ListGroup, Modal  } from 'react-bootstrap';
import API from './../../utils/API';
import Loading from './../../utils/Loading';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { DollarOutlined, ShareAltOutlined, UserAddOutlined, LineChartOutlined, UserOutlined, StarOutlined } from '@ant-design/icons';
// import { Theme } from './Theme';
import { Audio, RotatingLines } from 'react-loader-spinner';
import { Progress } from 'antd';
import { Link } from 'react-router-dom';
import { color } from 'three/webgpu';
import formatDate from './../../utils/DateFormatter';
import ImageUpload from '../../utils/ImageUpload';
import 'react-image-lightbox/style.css'; // Import the CSS for the lightbox
import Lightbox from 'react-image-lightbox';



export const Theme = {
    fontPrimary: "'Open Sans', sans-serif", // A clean, modern sans-serif font commonly used in fundraising platforms
    fontSecondary: "'Lato', sans-serif", // Another modern sans-serif font for variet
    fontSecondary: "'Playfair Display', serif",
    primary: '#C9A86A', // Muted gold
    secondary: '#8A7968', // Warm taupe
    accent: '#D64C31', // Deep coral
    background: '#0F1419', // Rich dark blue-gray
    surface: '#1E2328', // Slightly lighter blue-gray
    text: '#F2F2F2', // Off-white
    textDark: '#A0A0A0', // Medium gray
};

const StickyBottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${Theme.surface};
  padding: 10px 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(100%)'};

  @media (min-width: 769px) {
    display: none;
  }
`;


const ActionButton = styled(Button)`
  flex: 1;
  margin: 0 10px;
  background-color: ${props => props.primary ? Theme.accent : Theme.primary};
  border-color: ${props => props.primary ? Theme.accent : Theme.primary};
  color: ${Theme.text};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover, &:focus {
    background-color: ${props => props.primary ? Theme.accent : Theme.primary};
    border-color: ${props => props.primary ? Theme.accent : Theme.primary};
    opacity: 0.9;
  }

  svg {
    margin-right: 5px;
  }
`;

const PageContainer = styled.div`
  padding-top: 100px;
  padding:20px;
  @media (max-width: 768px) {
    padding-top:10px;
  }
`;
const ResponsiveContainer = styled(Container)`
    padding:20px;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ResponsiveRow = styled(Row)`
  @media (max-width: 768px) {
    margin-top: 100px;
  }
`;

const ResponsiveCol = styled(Col)`
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.h3`
  font-family: ${Theme.fontSecondary};
  color: ${Theme.primary};
  text-align: left;
`;

const ImageContainer = styled.div`
  width: 600px;
  height: 387px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }
`;

const ResponsiveImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: ${Theme.primary};
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
`;

const CreatorInfo = styled.p`
  margin-top: 30px;
  text-align: left;
  display: flex;
  align-items: center;
  font-family: ${Theme.fontPrimary};
`;

const Divider = styled.hr`
  border: none;
  height: 2px;
  background-color: ${Theme.primary};
  width: 100%;
  margin: 20px 0;
`;

const Description = styled.p`
  margin-bottom: 10px;
  text-align: justify; /* or text-align: left if you prefer */
  color: whitesmoke;
  line-height: 1.5; /* Adjust line height for better readability */
  word-spacing: 0.1em; /* Adjust word spacing for balance */
`;

const DonationCard = styled.div`
  padding: 20px;
  margin-top: 70px;
  border-radius: 12px;
  background-color: rgb(34 39 45);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 300px;
  margin-left: 20px;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-top: 20px;
  }
`;

const ProgressBar = styled.div`
  background-color: black;
  border-radius: 5px;
  overflow: hidden;
  height: 20px;
`;

const ProgressFill = styled.div`
  width: ${props => props.percent}%;
  background-color: ${Theme.secondary};
  height: 100%;
  transition: width 0.5s ease-in-out;
`;

const CommentSection = styled.div`
  margin-top: 40px;
`;

const CommentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const CommentHeader = styled.th`
  border-bottom: 2px solid #ccc;
  padding: 10px;
  text-align: center;
  color: ${Theme.text};
`;

const CommentCell = styled.td`
  padding: 10px;
  color: ${Theme.text};
  border-bottom: 1px solid #ccc;
`;

const StyledForm = styled(Form)`
  .form-control {
    background-color: #2B3036;
    color: ${Theme.text};
    border-color: ${Theme.primary};
  }
`;

const StyledFormLabel = styled(Form.Label)`
  color: ${Theme.text};
  font-weight: 500;
  margin-bottom: 12px;
  font-size: 1.1rem;
  width: 100%;
  text-align:left
`;

const StyledButton = styled(Button)`
  background-color: ${Theme.accent};
  border-color: ${Theme.accent};
`;

const FormContainer = styled.div`
    display: flex; /* Use flexbox */
    align-items: center; /* Center items vertically */
    gap: 10px; /* Space between the label and input */
    margin-top: 20px;
`;

const DonateDetails = ({ match }) => {
    const id = match.params.id;
    const [isLoading, setIsLoading] = useState(false);
    const [campaign, setCampaign] = useState(null);
    const [donorName, setDonorName] = useState('Anonymous');
    const [donationAmount, setDonationAmount] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [topDonor, setTopDonor] = useState(null);
    const [isCommentEnabled, setIsCommentEnabled] = useState(false);
    const [showModalAll, setShowModalAll] = useState(false);
    const [showModalTop, setShowModalTop] = useState(false);
    const [viewAll, setViewAll] = useState('newest'); // State for All Donations view
    const [viewTop, setViewTop] = useState('top'); // State for Top Donors view
    const [isCampaignUserLoggedIn, setIsCampaignUserLoggedIn] = useState('false');
    const [newUpdate, setNewUpdate] = useState('');
    const [images, setImages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentUpdateImages, setCurrentUpdateImages] = useState([]);


    const openLightbox = (index, images) => {
        setCurrentImageIndex(index);
        setCurrentUpdateImages(images); // Store the images of the current update
        setIsOpen(true);
    };

const handleShowAll = () => {
    setViewAll('newest'); // Reset to newest when opening modal
    setShowModalAll(true);
};
const handleCloseAll = () => setShowModalAll(false);

const handleShowTop = () => {
    setViewTop('top'); // Reset to top when opening modal
    setShowModalTop(true);
};
const handleCloseTop = () => setShowModalTop(false);

    useEffect(() => {
        loadCampaignDetails();
        populateDonorName();
        loadComments();
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        setIsCommentEnabled(!!userData);
    }, []);

    const loadCampaignDetails = async () => {
        setIsLoading(true);
        try {
            const res = await API.getCampaignById(id);
            const campaignDetails = res.data;
            if (campaignDetails) {
                setCampaign(campaignDetails);
                const userData = JSON.parse(sessionStorage.getItem('userData'));
                setIsCampaignUserLoggedIn(userData ? userData.email == campaignDetails.createdUserEmail : false);
                const donations = campaignDetails.donations || [];
                const topDonor = donations.reduce((max, donor) =>
                    donor.amount > max.amount ? donor : max,
                    { amount: 0 }
                );
                setTopDonor(topDonor.amount > 0 ? topDonor : null);
            } else {
                console.error('Campaign not found');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const populateDonorName = () => {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData && userData.name) {
            setDonorName(userData.name);
        }
    };

    const loadComments = async () => {
        try {
            const response = await API.getCampaignComments(id);
            setComments(response.data.comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
            alert("There was an error fetching comments. Please try again.");
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
    
        if (newUpdate.trim()) {
            const updateObject = {
                update: newUpdate,
                images: images
            };
    
            try {
                await API.addUpdateInCampaign(id, updateObject);
                setNewUpdate('');
                setImages([]);
                loadCampaignDetails();
            } catch (error) {
                console.error('Error submitting update:', error);
                alert('There was an error submitting your update. Please try again.');
            }
        } else {
            alert('Please enter an update and select at least one image before submitting.');
        }
    };

    // const handleDonate = async () => {
    //     if (!donationAmount || donationAmount <= 0) {
    //         alert("Please enter a valid donation amount greater than zero.");
    //         return;
    //     }

    //     try {
    //         await API.donateToCampaign(id, { donorName, amount: donationAmount });
    //         alert("Thank you for your donation!");
    //         await loadCampaignDetails();
    //         setDonationAmount('');
    //     } catch (error) {
    //         console.error("Error donating:", error);
    //         alert("There was an error processing your donation. Please try again.");
    //     }
    // };
    const [showStickyBar, setShowStickyBar] = useState(true);
    const donateCardRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (donateCardRef.current) {
                const rect = donateCardRef.current.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
                setShowStickyBar(!isVisible);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleImageUpload = (url) => {
        setImages(prevImages => [...prevImages, url]);
    };

    const handleShare = async () => {
        if (!campaign) {
            alert('Campaign data is not available.');
            return;
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: campaign.title,
                    text: `Check out this fundraising campaign: ${campaign.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing the campaign:', error);

            }
        } else {
            alert('Web Share API is not supported in your browser. You can manually copy the URL to share.');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const name = userData ? userData.name : null;

        if (!name) {
            alert("You must be logged in to add a comment.");
            return;
        }

        if (!newComment) {
            alert("Please enter a comment.");
            return;
        }

        try {
            await API.addCommentInCampaign(id, { name, comment: newComment });
            alert("Comment added!");
            setNewComment('');
            loadComments();
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("There was an error adding your comment. Please try again.");
        }
    };

    if (isLoading || !campaign) {
        return (<Loading isLoading={isLoading} />);
    }
    const MobileOnlyComponent = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;
    const NonMobileComponent = styled.div`
 display: block;
  @media (max-width: 768px) {
 display: none;
  }
`;
    return (
        <ResponsiveContainer fluid style={{ backgroundColor: Theme.background, color: Theme.text, padding: '20px' }}>
            <PageContainer>
                <ResponsiveRow className="justify-content-center">
                    <ResponsiveCol md={8}>
                        <FlexContainer>
                            <ContentContainer>
                                <Title>{campaign.title}</Title>
                                <ImageContainer>
                                    {campaign.image && (
                                        <ResponsiveImage src={campaign.image} alt={campaign.title} />
                                    )}
                                </ImageContainer>
                                <CreatorInfo>
                                    <IconWrapper>
                                        <UserAddOutlined />
                                    </IconWrapper>
                                    {campaign.createdUsername} Started this Fundraiser
                                </CreatorInfo>
                                <Divider />
                                <Description>
                                    <strong style={{ color: Theme.primary, fontFamily: Theme.fontPrimary }}>Description:</strong> {campaign.description}
                                </Description>
                                <Divider />
                                {isCampaignUserLoggedIn && (
                                    <>
                                        <h4 style={{ color: Theme.primary, textAlign: 'left' }}>Add New Updates</h4>
                                        <StyledForm onSubmit={handleUpdateSubmit}>
                                            <Form.Group controlId="newUpdate">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    placeholder="Add update..."
                                                    value={newUpdate}
                                                    onChange={(e) => setNewUpdate(e.target.value)}
                                                />
                                            </Form.Group>
                                            <StyledButton type="submit">
                                                Add Update
                                            </StyledButton>
                                        </StyledForm>
                                        <StyledForm>
                                            <FormContainer>
                                                <StyledFormLabel>Upload images for your update</StyledFormLabel>
                                                <ImageUpload onImageUpload={handleImageUpload} />
                                            </FormContainer>
                                            {images.length > 0 && (
                                                <div>
                                                    <h2 style={{ color: Theme.primary, textAlign: 'left' }}>Uploaded Image:</h2>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                        {images.map((image, index) => (
                                                            <div key={index} style={{ width: '150px', height: '150px', overflow: 'hidden' }}>
                                                                <img
                                                                    src={image} // Create a local URL for the image
                                                                    alt={`Uploaded Image ${index + 1}`}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </StyledForm>
                                        <Divider />
                                    </> 
                                )}
                                {campaign.updates.length > 0 && (
                                   <>
            <h4 style={{ color: Theme.primary, textAlign: 'left' }}>Updates</h4>
            {campaign.updates.map((update, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <Description>
                        <strong style={{ color: Theme.primary, fontFamily: Theme.fontPrimary }}>
                            {formatDate(update.createdOn)}:
                        </strong>
                        {update.update}
                    </Description>

                    {/* Check if there are images associated with the update */}
                    {update.images && update.images.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                            {update.images.map((imageUrl, imgIndex) => (
                                <div key={imgIndex} style={{ width: '150px', height: '150px', overflow: 'hidden' }}>
                                    <img
                                        src={imageUrl}
                                        alt={`Update Image ${index + 1}-${imgIndex + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => openLightbox(imgIndex, update.images)} // Open lightbox on click
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <Divider />

            {/* Lightbox Component */}
            {isOpen && currentUpdateImages.length > 0 && (
                <Lightbox
                    mainSrc={currentUpdateImages[currentImageIndex]}
                    nextSrc={currentUpdateImages[(currentImageIndex + 1) % currentUpdateImages.length]}
                    prevSrc={currentUpdateImages[(currentImageIndex + currentUpdateImages.length - 1) % currentUpdateImages.length]}
                    onCloseRequest={() => setIsOpen(false)}
                    onMovePrevRequest={() =>
                        setCurrentImageIndex((currentImageIndex + currentUpdateImages.length - 1) % currentUpdateImages.length)
                    }
                    onMoveNextRequest={() =>
                        setCurrentImageIndex((currentImageIndex + 1) % currentUpdateImages.length)
                    }
                />
            )}
        </>
                                )}
                                <p style={{ textAlign: 'left' }}>
                                    <strong style={{ color: Theme.primary, fontFamily: Theme.fontPrimary }}>Contact The Creator: </strong> {campaign.createdUserEmail}
                                </p>
                            </ContentContainer>

                            <DonationCard ref={donateCardRef}>
                                <div style={{ marginTop: '20px' }}>
                                    {(() => {
                                        const percent = (campaign.amountRaised / campaign.goal) * 100;
                                        return (
                                            <>
                                                <MobileOnlyComponent>

                                                        <Progress
                                                            showInfo={false}
                                                            type="circle"
                                                            strokeWidth={20}
                                                            strokeColor={Theme.primary}
                                                            percent={percent}
                                                            width={60}


                                                        />
<br/>
<br/>
                                                </MobileOnlyComponent>

                                                <NonMobileComponent>
                                                    <ProgressBar>
                                                        <ProgressFill percent={percent} />
                                                    </ProgressBar>
                                                </NonMobileComponent>
                                                <p style={{ color: 'primary', fontFamily: 'fontPrimary', marginTop: '5px' }}>
                                                    ${campaign.amountRaised} raised of ${campaign.goal} goal
                                                </p>
                                            </>
                                        );
                                    })()}
                                </div>

                                <p style={{ textAlign: 'left' }}><strong style={{ color: Theme.primary }}>Amount Raised:</strong> ${campaign.amountRaised}</p>
                                <p style={{ textAlign: 'left' }}><strong style={{ color: Theme.primary }}>Goal:</strong> ${campaign.goal}</p>

                                {topDonor && (
                                    <div style={{ marginBottom: '15px', color: Theme.text, textAlign: 'left' }}>
                                        <strong style={{ color: Theme.primary }}>Top Donor:</strong> {topDonor.donorName} - ${topDonor.amount}
                                    </div>
                                )}

                                <StyledForm>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <Link
            to={`/donation?id=${id}`}
            style={{
                backgroundColor: Theme.accent,
                color: Theme.text,
                padding: '10px 20px',
                textDecoration: 'none',
                borderRadius: '4px',
                fontFamily: Theme.fontPrimary,
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <DollarOutlined style={{ marginRight: '8px', color: Theme.text }} />
            Donate
        </Link>
                                        <ActionButton onClick={handleShare}>
                                            <ShareAltOutlined /> Share
                                        </ActionButton>
                                    </div>

                                    <div style={{ fontFamily: Theme.fontPrimary, backgroundColor: Theme.surface, marginTop: '13px', borderRadius: '14px', color: Theme.text, padding: '20px' }}>
    {/* <h3 style={{ color: Theme.primary }}>Top Donations</h3> */}
    
    {/* Total Donations Display */}
    <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
    <p style={{font:Theme.fontPrimary, color: Theme.primary, textAlign:'left'}}><LineChartOutlined style={{ marginRight: '8px', color: Theme.accent }} /> {campaign.donations.length} people just donated </p>
    </div>

    <ListGroup>
        {campaign.donations.slice(0, 3).map((donation, index) => (
            <ListGroup.Item key={index} style={{ backgroundColor: 'rgb(34 39 45)', color: Theme.primary, textAlign: 'left' }}>
                <UserOutlined style={{ marginRight: '8px', color: Theme.accent }} />
                {donation.donorName}: <span style={{ color: Theme.accent }}>${donation.amount}</span>
            </ListGroup.Item>
        ))}
    </ListGroup>

    {campaign.donations.length > 3 && (
        <>
            <Button variant="primary" onClick={handleShowAll} style={{ marginTop: '10px', backgroundColor: Theme.primary, borderColor: Theme.primary }}>
                See All
            </Button>
            <Button variant="secondary" onClick={handleShowTop} style={{ marginTop: '10px', marginLeft: '10px', backgroundColor: Theme.secondary, borderColor: Theme.secondary }}>
            <StarOutlined />  See Top
            </Button>
        </>
    )}

    {/* Modal for displaying all donations */}
    <Modal show={showModalAll} onHide={handleCloseAll} dialogClassName="modal-90w">
        <Modal.Header closeButton style={{ backgroundColor: Theme.surface }}>
            <Modal.Title style={{ color: Theme.primary }}>Donations: {campaign.donations.length}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: Theme.surface }}>
            <div style={{ marginBottom: '10px' }}>
                <Button style={{backgroundColor:Theme.primary , color: 'white'}} variant="outline-primary" onClick={() => setViewAll('newest')} active={viewAll === 'newest'}>
                    Newest
                </Button>
                <Button variant="outline-primary" onClick={() => setViewAll('top')} active={viewAll === 'top'} style={{ marginLeft: '10px' , backgroundColor: Theme.secondary , color: 'white' }}>
                    Top
                </Button>
            </div>
            <ListGroup>
                {(viewAll === 'newest' ? campaign.donations : campaign.donations.slice().sort((a, b) => b.amount - a.amount)).map((donation, index) => (
                    <ListGroup.Item key={index} style={{ backgroundColor: Theme.surface, color: Theme.primary }}>
                        <UserOutlined style={{ marginRight: '8px', color: Theme.accent }} />
                        {donation.donorName}: <span style={{ color: Theme.accent }}>${donation.amount}</span>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: Theme.surface }}>
            {/* <Button variant="secondary" onClick={handleCloseAll} style={{ backgroundColor: Theme.secondary, borderColor: Theme.secondary }}>
                Close
            </Button> */}
            <Link
    to={`/donation?id=${id}`}
    style={{
        backgroundColor: Theme.accent,
        color: Theme.text,
        padding: '10px 20px',
        textDecoration: 'none',
        borderRadius: '4px',
        fontFamily: Theme.fontPrimary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center the text and icon
        width: '100%', // Set width to 100%
    }}
>
    <DollarOutlined style={{ marginRight: '8px', color: Theme.text }} />
    Donate
</Link>
        </Modal.Footer>
    </Modal>

    {/* Modal for displaying top donations */}
    <Modal show={showModalTop} onHide={handleCloseTop} dialogClassName="modal-90w">
    <Modal.Header closeButton style={{ backgroundColor: Theme.surface }}>
            <Modal.Title style={{ color: Theme.primary }}>Donations: {campaign.donations.length}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: Theme.surface }}>
            <div style={{ marginBottom: '10px' }}>
                <Button style={{backgroundColor:Theme.primary , color: 'white'}} ariant="outline-primary" onClick={() => setViewTop('newest')} active={viewTop === 'newest'}>
                    Newest
                </Button>
                <Button variant="outline-primary" onClick={() => setViewTop('top')} active={viewTop === 'top'} style={{ marginLeft: '10px', backgroundColor: Theme.secondary , color: 'white' }}>
                    Top
                </Button>
            </div>
            <ListGroup>
                {(viewTop === 'newest' ? campaign.donations.slice().sort((a, b) => new Date(b.date) - new Date(a.date)) : campaign.donations.slice().sort((a, b) => b.amount - a.amount)).map((donation, index) => (
                    <ListGroup.Item key={index} style={{ backgroundColor: Theme.surface, color: Theme.primary }}>
                        <UserOutlined style={{ marginRight: '8px', color: Theme.accent }} />
                        {donation.donorName}: <span style={{ color: Theme.accent }}>${donation.amount}</span>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: Theme.surface }}>
            {/* <Button variant="secondary" onClick={handleCloseTop} style={{ backgroundColor: Theme.secondary, borderColor: Theme.secondary }}>
                Close
            </Button> */}
            <Link
    to={`/donation?id=${id}`}
    style={{
        backgroundColor: Theme.accent,
        color: Theme.text,
        padding: '10px 20px',
        textDecoration: 'none',
        borderRadius: '4px',
        fontFamily: Theme.fontPrimary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center the text and icon
        width: '100%', // Set width to 100%
    }}
>
    <DollarOutlined style={{ marginRight: '8px', color: Theme.text }} />
    Donate
</Link>
        </Modal.Footer>
    </Modal>

</div>

                                    


                                </StyledForm>
                            </DonationCard>
                        </FlexContainer>

                        <CommentSection>
                            <h4 style={{ color: Theme.primary, textAlign: 'left' }}>Words of support</h4>
                            <StyledForm onSubmit={handleCommentSubmit}>
                                <Form.Group controlId="newComment">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        disabled={!isCommentEnabled}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                </Form.Group>
                                <StyledButton type="submit" disabled={!isCommentEnabled}>
                                    Submit Comment
                                </StyledButton>
                            </StyledForm>

                            <div style={{ marginTop: '20px' }}>
                                {comments.length > 0 ? (
                                    <CommentTable>
                                        <thead>
                                            <tr>
                                                <CommentHeader>Name</CommentHeader>
                                                <CommentHeader>Comment</CommentHeader>
                                                <CommentHeader>Created On</CommentHeader>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comments.map((comment, index) => (
                                                <tr key={index}>
                                                    <CommentCell>{comment.name}</CommentCell>
                                                    <CommentCell>{comment.comment}</CommentCell>
                                                    <CommentCell>{new Date(comment.createdOn).toLocaleString()}</CommentCell>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </CommentTable>
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                            </div>
                        </CommentSection>
                    </ResponsiveCol>
                </ResponsiveRow></PageContainer>
            <StickyBottomBar show={showStickyBar}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Link
                        to={`/donation?id=${id}`}
                        style={{
                            backgroundColor: Theme.accent,
                            color: Theme.text,
                            padding: '10px 20px',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontFamily: Theme.fontPrimary,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <DollarOutlined style={{ marginRight: '8px', color: Theme.text }} />
                        Donate
                    </Link>
                <ActionButton onClick={handleShare}>
                    <ShareAltOutlined /> Share
                </ActionButton>
                </div>
            </StickyBottomBar>
            
        </ResponsiveContainer>

    );

};

export default withRouter(DonateDetails);
