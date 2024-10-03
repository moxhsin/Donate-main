import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import API from './../../utils/API'; // Adjust the import path as necessary
import Loading from './../../utils/Loading';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';

const Theme = {
    fontPrimary: "'Poppins', sans-serif",
    fontSecondary: "'Playfair Display', serif",
    primary: '#C9A86A',
    secondary: '#8A7968',
    accent: '#D64C31',
    background: '#0F1419',
    surface: '#1E2328',
    text: '#F2F2F2',
    textDark: '#A0A0A0',
};

const CampaignCard = styled.div`
  cursor: pointer;
  background-color: ${Theme.surface};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  /* Set fixed width and height */
  width: 300px; /* Set your desired width */
  height: 400px; /* Set your desired height */

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const DonateForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [donateForm, setDonateForm] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadCampaigns();
    }, []); // Empty dependency array means this runs once on mount

    const [redirectId, setRedirectId] = useState(null);

    const handleCardClick = (id) => {
        setRedirectId(id);
    };

    if (redirectId) {
        return <Redirect to={`/donate-details/${redirectId}`} />;
    }

    const loadCampaigns = async () => {
        setIsLoading(true);
        try {
            const res = await API.getAllCampaigns();
            setDonateForm(res.data);
            console.log(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false); // Ensure loading is turned off
        }
    };

    const handleClose = () => setShowModal(false);

    return (
        <Container fluid style={{ backgroundColor: Theme.background, color: Theme.text }}>
            {isLoading ? (
                <Loading isLoading={isLoading} /> // Show loading component if loading
            ) : (
                <Row>
                    <Col size="md-6 sm-12">
                        {donateForm.length ? (
                            <div>
                                <h1 style={{ fontWeight: "900", textAlign: "center", margin: "110px 0px 20px", fontFamily: Theme.fontPrimary, color: Theme.primary }}>
                                    All Active Campaigns
                                </h1>
                                    <div className="d-flex flex-wrap justify-content-center">
                                        {donateForm.map(({ _id, title }) => (
                                            <div key={_id} style={{ margin: '10px' }} onClick={() => handleCardClick(_id)}>
                                                <CampaignCard>
                                                    <div style={{ padding: '20px', cursor: 'pointer' }}>
                                                        <h5 style={{
                                                            fontFamily: Theme.fontSecondary,
                                                            fontSize: '1.5rem',
                                                            marginBottom: '1rem',
                                                            color: Theme.primary
                                                        }}>
                                                            {title}
                                                        </h5>
                                                    </div>
                                                </CampaignCard>
                                            </div>
                                        ))}
                                    </div>

                                {/* Modal for Donation Success */}
                                <Modal show={showModal} onHide={handleClose} centered style={{ backgroundColor: Theme.background }}>
                                    <Modal.Body style={{ textAlign: 'center', backgroundColor: Theme.background }}>
                                        <h4 style={{ color: Theme.primary }}>Thanks for your donation!</h4>
                                        <Button variant="outline-dark" onClick={handleClose} style={{ marginTop: '20px' }}>
                                            Close
                                        </Button>
                                    </Modal.Body>
                                </Modal>

                            </div>
                        ) : (
                            <h3>No Results to Display</h3>
                        )}
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default DonateForm;