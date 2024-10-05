import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import API from './../../utils/API'; // Adjust the import path as necessary
import Loading from './../../utils/Loading';
import { withRouter } from 'react-router-dom'; // Import withRouter to access route parameters
import styled from 'styled-components';
import { UserAddOutlined} from '@ant-design/icons';

const Theme = {
    fontPrimary: "'Poppins', sans-serif",
    fontSecondary: "'Playfair Display', serif",
    primary: '#C9A86A', // Muted gold
    secondary: '#8A7968', // Warm taupe
    accent: '#D64C31', // Deep coral
    background: '#0F1419', // Rich dark blue-gray
    surface: '#1E2328', // Slightly lighter blue-gray
    text: '#F2F2F2', // Off-white
    textDark: '#A0A0A0', // Medium gray
};

const IconWrapper = styled.div`
   font-size: 2rem;
  color: ${Theme.primary};
  margin-right: 0.5rem; // Add space between icon and text
  display: inline-flex; // Ensure the icon is inline with the text
  align-items: center; // Center the icon vertically
`;

const DonateDetails = ({ match }) => {
    const id = match.params.id; // Get the campaign ID from URL parameters
    const [isLoading, setIsLoading] = useState(false);
    const [campaign, setCampaign] = useState(null);
    const [donorName, setDonorName] = useState('Anonymous'); // Default to 'Anonymous'
    const [donationAmount, setDonationAmount] = useState('');
    const [comments, setComments] = useState([]); // State for comments
    const [newComment, setNewComment] = useState(''); // State for new comment
    const [topDonor, setTopDonor] = useState(null);

    useEffect(() => {
        loadCampaignDetails();
        populateDonorName(); // Populate donor name on component mount
        loadComments(); // Load comments for the campaign
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        setIsCommentEnabled(!!userData);
    }, []); // Load details when component mounts

    const [isCommentEnabled, setIsCommentEnabled] = useState(false);

    const loadCampaignDetails = async () => {
        setIsLoading(true);
        try {
            const res = await API.getAllCampaigns(); // Fetch all campaigns
            const campaignDetails = res.data.find(campaign => campaign._id === id); // Find specific campaign by ID
            if (campaignDetails) {
                setCampaign(campaignDetails);
                const donations = campaignDetails.donations || []; // Ensure donations is an array
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
           setDonorName(userData.name); // Set donor name from userData
       }
   };

   const loadComments = async () => {
    try {
        const response = await API.getCampaignComments(id); // Call your fetch comments API
        setComments(response.data.comments); // Assuming response has a 'comments' property
    } catch (error) {
        console.error("Error fetching comments:", error);
        alert("There was an error fetching comments. Please try again.");
    }
};

   const handleDonate = async () => {
       if (!donationAmount || donationAmount <= 0) {
           alert("Please enter a valid donation amount greater than zero.");
           return;
       }

       try {
           await API.donateToCampaign(id, { donorName, amount: donationAmount });
           alert("Thank you for your donation!");
           await loadCampaignDetails(); // Refresh campaign details after successful donation
           setDonationAmount('');
       } catch (error) {
           console.error("Error donating:", error);
           alert("There was an error processing your donation. Please try again.");
       }
   };

   const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Fetch userData from sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const name = userData ? userData.name : null; // Get the name from userData

    // Check if userData is present
    if (!name) {
        alert("You must be logged in to add a comment.");
        return;
    }

    // Validate the new comment input
    if (!newComment) {
        alert("Please enter a comment.");
        return;
    }

    try {
        // Send new comment to backend with name included
        await API.addCommentInCampaign(id, { name, comment: newComment });
        alert("Comment added!");
        setNewComment(''); // Clear input field after submission
        loadComments(); // Refresh comments after adding a new one
    } catch (error) {
        console.error("Error adding comment:", error);
        alert("There was an error adding your comment. Please try again.");
    }
};

   if (isLoading || !campaign) {
       return <Loading />; // Show loading component if loading or no campaign data
   }

   return (
       <Container fluid style={{ backgroundColor: '#0F1419', color: '#F2F2F2', padding: '20px' }}> {/* Added marginTop */}
           <Row className="justify-content-center" style={{ marginTop: '150px' }}>
           <Col md={8}>
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
    }}>
        {/* Title and Description on the Left */}
        <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#C9A86A', textAlign:'left' }}>{campaign.title}</h3>
            
            {/* Square Box for Image (Increased Size) */}
            <div style={{
                width: '600px', // Increased width by 50%
                height: '387px', // Increased height by 50%
                overflow: 'hidden', // Hide overflow
                borderRadius: '12px', // Optional: rounded corners for the box
                marginBottom: '10px',
                display: 'flex', // Use flexbox to center the image
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                textAlign:'left'
            }}>
                {campaign.image && (
                    <img 
                        src={campaign.image} 
                        alt={campaign.title} 
                        style={{
                            maxWidth: '100%', // Ensure the image does not exceed box width
                            maxHeight: '100%', // Ensure the image does not exceed box height
                            objectFit: 'cover', // Cover the box without distortion
                            borderRadius: '12px' // Curved edges for the image
                        }} 
                    />
                )}
            </div>
            <br></br>
            <p style={{ marginTop: '30px', textAlign: 'left', display: 'flex', alignItems: 'center', fontFamily: "'Poppins', sans-serif"}}>
            <IconWrapper>
                <UserAddOutlined />
            </IconWrapper>
            {campaign.createdUsername} Started this Fundraiser
        </p>
            <div style={{  textAlign:'left' }}>
            <hr style={{
                border: 'none', // Remove default border
                height: '2px', // Set height of the line
                backgroundColor: '#C9A86A', // Set color of the line
                width: '100%', // Set width of the line
                margin: '20px 0' // Add margin above and below the line
            }} />
            
        </div>
            <p style={{ marginBottom: '10px', textAlign:'left', color:'whitesmoke' }}><strong style={{color:'#C9A86A' , fontFamily: "'Poppins', sans-serif"}}>Description:</strong> {campaign.description}</p>
            <div style={{  textAlign:'left' }}>
            <hr style={{
                border: 'none', // Remove default border
                height: '2px', // Set height of the line
                backgroundColor: '#C9A86A', // Set color of the line
                width: '100%', // Set width of the line
                margin: '20px 0' // Add margin above and below the line
            }} />
            <p style={{ textAlign: 'left' }}><strong style={{color:'#C9A86A', fontFamily: "'Poppins', sans-serif"}}>Contact The Creator: </strong> {campaign.createdUserEmail}</p>
        </div>
        </div>
        

      {/* Donation Details Card on the Right */}
<div style={{
    padding: '20px',
    marginTop: '70px',
    borderRadius: '12px',
    backgroundColor: '#1E2328',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    width: '300px',
    marginLeft: '20px'
}}>
    {/* Progress Bar Section */}
    <div style={{ marginTop: '20px' }}>
        {/* Calculate the percentage of the goal achieved */}
        {(() => {
            const percent = (campaign.amountRaised / campaign.goal) * 100;

            return (
                <>
                    {/* Progress Bar */}
                    <div style={{
                        backgroundColor: 'black',
                        borderRadius: '5px',
                        overflow: 'hidden',
                        height: '20px'
                    }}>
                        <div style={{
                            width: `${percent}%`,
                            backgroundColor: '#8A7968',
                            height: '100%',
                            transition: 'width 0.5s ease-in-out'
                        }} />
                    </div>
                    {/* Amount raised and goal text */}
                    <p style={{ color:'#C9A86A', fontFamily: "'Poppins', sans-serif", marginTop: '5px' }}>
                        ${campaign.amountRaised} raised of ${campaign.goal} goal
                    </p>
                </>
            );
        })()}
    </div>

    <p style={{ textAlign: 'left' }}><strong style={{color:'#C9A86A'}}>Amount Raised:</strong> ${campaign.amountRaised}</p>
    <p style={{ textAlign: 'left' }}><strong style={{color:'#C9A86A'}}>Goal:</strong> ${campaign.goal}</p>
    
    {topDonor && (
        <div style={{ marginBottom: '15px', color: '#F2F2F2', textAlign: 'left' }}>
            <strong style={{color:'#C9A86A'}}>Top Donor:</strong> {topDonor.donorName} - ${topDonor.amount}
        </div>
    )}

 


            {/* Donor Input Form */}
            <Form>
                <Form.Group controlId="donorName">
                    <Form.Label style={{color:'#C9A86A', fontFamily: "'Poppins', sans-serif"}}>Donor Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter your name" 
                        value={donorName} 
                        readOnly 
                        style={{ backgroundColor: '#2B3036', color: '#F2F2F2', borderColor: '#C9A86A' }}
                    />
                </Form.Group>

                <Form.Group controlId="donationAmount">
                    <Form.Label style={{color:'#C9A86A', fontFamily: "'Poppins', sans-serif"}}>Donation Amount ($)</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Enter amount" 
                        value={donationAmount} 
                        onChange={(e) => setDonationAmount(e.target.value)} 
                        onWheel={(e) => e.preventDefault()} 
                        min="0" 
                        style={{ appearance: 'none', MozAppearance: 'textfield', backgroundColor: '#2B3036', color: '#F2F2F2', borderColor: '#C9A86A' }} 
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleDonate} style={{ backgroundColor: '#D64C31', borderColor: '#D64C31' }}>
                    Donate
                </Button>
            </Form>
        </div>
    </div>

    {/* Comment Section */}
    <div style={{ marginTop: '40px' }}>
        <h4 style={{ color: '#C9A86A' , textAlign:'left' }}>Words of support</h4>
        <Form onSubmit={handleCommentSubmit}>
            <Form.Group controlId="newComment">
                <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Add a comment..." 
                    value={newComment} 
                    disabled={!isCommentEnabled} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    style={{ backgroundColor: '#2B3036', color: '#F2F2F2', borderColor: '#C9A86A' }} 
                />
            </Form.Group>
            <Button variant="secondary" type="submit" disabled={!isCommentEnabled} style={{ backgroundColor: '#D64C31', borderColor: '#D64C31' }}>
                Submit Comment
            </Button>
        </Form>

        {/* Display Comments */}
        <div style={{ marginTop: '20px' }}>
            {comments.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '2px solid #ccc', padding: '10px', textAlign: 'center', color: '#F2F2F2' }}>Name</th>
                            <th style={{ borderBottom: '2px solid #ccc', padding: '10px', textAlign: 'center', color: '#F2F2F2' }}>Comment</th>
                            <th style={{ borderBottom: '2px solid #ccc', padding: '10px', textAlign: 'center', color: '#F2F2F2' }}>Created On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map((comment, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '10px', color: '#F2F2F2' }}>{comment.name}</td>
                                <td style={{ padding: '10px', color: '#F2F2F2' }}>{comment.comment}</td>
                                <td style={{ padding: '10px', color: '#F2F2F2' }}>{new Date(comment.createdOn).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    </div>
</Col>
           </Row>
       </Container>
   );
};

export default withRouter(DonateDetails);