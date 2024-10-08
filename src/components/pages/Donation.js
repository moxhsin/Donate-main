import React, { useState, useEffect } from 'react';
import { DollarOutlined } from '@ant-design/icons'; // Ensure you have this icon package installed
import API from './../../utils/API'; // Adjust the import based on your API structure
import styled from 'styled-components';
import { Button, Card } from 'react-bootstrap';
import { color } from 'three/webgpu';

export const Theme = {
    fontPrimary: "'Open Sans', sans-serif",
    fontSecondary: "'Lato', sans-serif",
    fontTertiary: "'Playfair Display', serif",
    primary: '#C9A86A',
    secondary: '#8A7968',
    accent: '#D64C31',
    background: '#0F1419',
    surface: '#1E2328',
    text: '#F2F2F2',
};

const ActionButton = styled(Button)`
  flex: 1;
  margin-top: 10px;
  background-color: ${props => props.primary ? Theme.accent : Theme.surface};
  border-color: ${props => props.primary ? Theme.accent : Theme.primary};
  color: ${Theme.text};
  font-family: ${Theme.fontPrimary}; 
  width: 100%;

  &:hover, &:focus {
    background-color: ${props => props.primary ? Theme.accent : Theme.primary};
    border-color: ${props => props.primary ? Theme.accent : Theme.primary};
    opacity: 0.9;
  }

  svg {
    margin-right: 5px;
  }
`;

const DonationCard = styled(Card)`
  background-color: ${Theme.surface};
  color: ${Theme.text};
  border: none;
  margin-top: 60px;
  padding: 20px; 
  max-width: 600px; 
  width: calc(100% - 40px); /* Adjust width for mobile */
  border-radius: 10px; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.1); 

   @media (max-width :576px) {
      padding :15px; 
      margin :10px; 
      width :calc(100% -20px); // Ensure card fits within screen
      box-shadow:none; // Remove shadow for mobile
      border-radius :5px; // Slightly round corners for mobile
   }
`;

const DonationContainer = styled.div`
  background-color: ${Theme.background}; 
  min-height: calc(100vh - 60px); /* Adjust height to account for navbar */
  padding-top: 60px; /* Add padding to push content below navbar */
  
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputField = styled.input`
    width: calc(100%); /* Ensure input fields take full width of the card */
    padding: 10px; 
    margin-bottom: 10px; 
    margin-right: 100px; /* Add right margin for desktop */
    border-radius: 4px; 
    background-color: rgb(43,48,54); /* Updated background color */
    color: white; /* Updated text color for contrast */
    border: 2px solid rgb(201,168,106); /* Updated border color */
    box-sizing: border-box; /* Include padding and border in width calculation */

    @media (max-width: 576px) {
        margin-right: 0; /* Remove right margin on mobile */
        padding: 8px; 
        width: calc(100% - 20px); /* Adjust for mobile padding */
    }

    &::placeholder {
        color: #ccc; 
    }
`;

const AmountButtonContainer = styled.div`
    display: flex; 
    justify-content: space-between; /* Distribute space evenly */
    margin-bottom: 10px; 

    @media (max-width:576px) {
        justify-content: space-around; /* Center buttons for smaller screens */
        flex-wrap: wrap; /* Allow buttons to wrap on small screens */
    }
`;

const AmountButton = styled(Button)`
    flex-grow: 1; /* Allow buttons to grow equally */
    margin: 0 5px; /* Add horizontal margin for spacing */

    &:first-child {
        margin-left: 0; /* Remove left margin from the first button */
    }

    &:last-child {
        margin-right: 0; /* Remove right margin from the last button */
    }

    background-color: ${Theme.surface}; 
    border-radius: 5px; 
    border-color:${Theme.secondary}; 
    color:${Theme.text}; 

   &:hover {
        background-color:${Theme.accent}; 
        border-color:${Theme.accent}; 
        opacity:.9;
   }

   @media (max-width :576px){
       flex-basis : calc(48%); /* Adjust button width on mobile */
       margin-bottom: 10px; /* Add bottom margin for spacing in mobile view */
   }
`;

const TipSection = styled.div`
    margin-top: 20px;
`;

const Slider = styled.input`
   -webkit-appearance:none;
   width : calc(100% -22px);
   height :12px; /* Increased height for a larger slider */
   width : calc(100%);
   border-radius :5px;
   background:#C9A86A;

   &::-webkit-slider-thumb {
       -webkit-appearance:none;
       appearance:none;
       width :24px; /* Increased thumb size */
       height :24px;
       border-radius :50%;
       background:${Theme.secondary}; /* Thumb color */
       cursor:pointer;
       box-shadow :0px -1px rgba(0,0,0,.4);
   }

   &::-moz-range-thumb {
       width :24px; /* Increased thumb size */
       height :24px;
       border-radius :50%;
       background:${Theme.secondary}; /* Thumb color */
       cursor:pointer;
       box-shadow :0px -1px rgba(0,0,0,.4);
   }
   
   @media (max-width :576px){
       width :calc(100% -10px);
   }
`;

const Divider = styled.hr`
   margin-top :20px;
   margin-bottom :20px;
   border-top :1px solid #C9A86A; /* Light gray line */
`;

const PaymentMethodTitle = styled.h3`
   text-align:center;
`;

const PaymentForm = styled.div`
   display:${props => (props.show ? 'block' : 'none')};
   margin-top :20px;

   @media (max-width :576px) {
       margin-top :10px; // Reduce top margin for mobile
   }
`;

const PaymentInputField = styled(InputField)`
   margin-bottom :10px; /* Space between fields */
`;

const CountrySelect = styled.select`
   width : calc(100% -22px); /* Full width minus padding */
   padding :10px;
   border-radius :4px;
   border:none;
   background-color:${Theme.secondary};
   border-color: '#C9A86A';
   color:white;
   margin-bottom:10px;

   @media (max-width :576px){
      padding :8px;
   }
`;

// Limited list of countries for the dropdown menu.
const countriesList = [
     "USA", "Canada", "India"
];

const CustomTipLink = ({ onClick, children }) => (
    <button onClick={onClick} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
        {children}
    </button>
);

const CustomTipInput = ({ show, ...props }) => {
    if (!show) return null; // Don't render if not shown
    return <input {...props} />;
};

const Donation = (props) => {
    const queryParams = new URLSearchParams(props.location.search);
    const id = queryParams.get('id'); 

    const [donorName, setDonorName] = useState('Anonymous');
    const [donationAmount, setDonationAmount] = useState('');
    const [tip , setTip] = useState(0);
    const [tipPercentage, setTipPercentage] = useState(0);
    const [showCustomTipInput, setShowCustomTipInput] = useState(false);
    const [customTipAmount, setCustomTipAmount] = useState('');
    const [showPaymentForm, setShowPaymentForm] = useState(false); // State to toggle payment form visibility
    const [isAnonymous, setIsAnonymous] = useState(false); // State to manage anonymous option

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData && userData.name) {
            setDonorName(userData.name); 
        }
        
        if (isAnonymous) {
            setDonorName("Anonymous");
        }
        
    }, [isAnonymous]);

    const handleCustomTipAmount = (e) => {
        setCustomTipAmount(e.target.value)
        setTip(e.target.value)
    }

    const handleTipPercentage = (e) => {
      setTipPercentage(e.target.value)  
      setTip(((donationAmount * e.target.value) / 100).toFixed(2))
    } 

    const handleDonate = async () => {
        if (!donationAmount || donationAmount <= 0) {
            alert("Please enter a valid donation amount greater than zero.");
            return;
        }

        try {
            const donationData = { donorName, amount: donationAmount , tip};
            const response = await API.donateToCampaign(id, donationData);

            if (response && response.status === 200) {
                alert("Thank you for your donation!");
                 
                setDonationAmount('');
                setTipPercentage(0); // Reset tip percentage after donation
                setShowPaymentForm(false); // Reset payment form visibility after donation
            } else {
                throw new Error("Failed to process donation");
            }
        } catch (error) {
            console.error("Error donating:", error);
            alert("There was an error processing your donation. Please try again.");
        }
    };

     const predefinedAmounts = [200, 500, 750, 1000, 1250, 2000];

     return (
         <DonationContainer>
             <DonationCard className="donation-container">
                 <Card.Body>
                     <Card.Title style={{textAlign:'left'}}>Enter your Donation</Card.Title>
                     <br></br>
                     {/* Predefined Amount Buttons */}
                     <AmountButtonContainer>
                             {predefinedAmounts.map((amount) => (
                                 <AmountButton key={amount} onClick={() => setDonationAmount(amount)} variant="outline-primary">
                                     ${amount}
                                 </AmountButton>
                             ))}
                         </AmountButtonContainer>
                     <div className="donation-form">
                         <div className='inputs'>
                         <label>
                             Donor Name:
                             <InputField type="text" value={donorName} readOnly />
                         </label>
                         <label>
                             Donation Amount:
                             <InputField type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} placeholder="Enter amount" />
                         </label>
                         </div>        
                         
                        <Divider/>
                        {/* Tip Donation Section */}
<TipSection>
    <p style={{textAlign:'left'}}>Tip Donation services</p>
    <p style={{textAlign:'left'}}>Donation has a 0% platform fee for organizers. Donation will continue offering its services thanks to donors who will leave an optional amount here:</p>
    
    {/* Slider */}
    {!showCustomTipInput && (
        <>
            <Slider 
                type="range" 
                min="0" 
                max="30" 
                value={tipPercentage} 
                onChange={handleTipPercentage} 
            />
            {/* Link to add custom tip */}
            <div>
                <br></br>
            <a 
                onClick={() => setShowCustomTipInput(true)} 
                style={{
                    fontFamily: "'Poppins', sans-serif",
                    color: '#C9A86A', // Muted gold
                    backgroundColor: '#1E2328', // Slightly lighter blue-gray
                    padding: '10px 15px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease, color 0.3s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#D64C31'; // Deep coral
                    e.currentTarget.style.color = '#F2F2F2'; // Off-white
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#1E2328'; // Reset to surface color
                    e.currentTarget.style.color = '#C9A86A'; // Reset to muted gold
                }}
                onMouseDown={(e) => {
                    e.currentTarget.style.backgroundColor = '#C9A86A'; // Muted gold on click
                    e.currentTarget.style.color = '#A0A0A0'; // Medium gray
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.backgroundColor = '#1E2328'; // Reset to surface color
                    e.currentTarget.style.color = '#C9A86A'; // Reset to muted gold
                }}
            >
                Add Custom Tip
            </a>
            
        </div>
        </>
    )}
    
    {/* Custom Tip Input */}
    {showCustomTipInput && (
        <>
            <CustomTipInput
                style={{color:Theme.text, backgroundColor: Theme.surface , borderRadius:'13px', borderColor: Theme.primary, width:'70%', textAlign:'center'}}
                show={setShowCustomTipInput} 
                value={customTipAmount} // Use a separate state for custom tip
                onChange={handleCustomTipAmount} // Update state with entered value
                placeholder="Tip Amount" 
                type="number" 
            />
            <br></br>
            <div>
                <br></br>
            <a 
                onClick={() => setShowCustomTipInput(false)} 
                style={{
                    fontFamily: "'Poppins', sans-serif",
                    color: '#C9A86A', // Muted gold
                    backgroundColor: '#1E2328', // Slightly lighter blue-gray
                    padding: '10px 15px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease, color 0.3s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#D64C31'; // Deep coral
                    e.currentTarget.style.color = '#F2F2F2'; // Off-white
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#1E2328'; // Reset to surface color
                    e.currentTarget.style.color = '#C9A86A'; // Reset to muted gold
                }}
                onMouseDown={(e) => {
                    e.currentTarget.style.backgroundColor = '#C9A86A'; // Muted gold on click
                    e.currentTarget.style.color = '#A0A0A0'; // Medium gray
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.backgroundColor = '#1E2328'; // Reset to surface color
                    e.currentTarget.style.color = '#C9A86A'; // Reset to muted gold
                }}
            >
                Back To Default
            </a>
           
        </div>
        </>
    )}
                        </TipSection>

                         {/* Divider */}
                         <Divider />

                         {/* Payment Method Section */}
                         <PaymentMethodTitle style={{textAlign: "left" , color:Theme.text}}>Payment Method</PaymentMethodTitle>
                         <ActionButton onClick={() => setShowPaymentForm(!showPaymentForm)}>
                             {showPaymentForm ? 'Hide Payment Form' : 'Add Payment Method'}
                         </ActionButton>

                         {/* Payment Form */}
                         <PaymentForm show={showPaymentForm}>
                             <PaymentInputField placeholder="Email Address" type="email" />
                             <PaymentInputField placeholder="First Name" type="text" />
                             <PaymentInputField placeholder="Last Name" type="text" />
                             <PaymentInputField placeholder="Card Number" type="text" />
                             <div style={{ display:'flex', justifyContent:'space-between' }}>
                                 <PaymentInputField placeholder="MM/YY" type="text" style={{ flexBasis:'48%' }} />
                                 <PaymentInputField placeholder="CVV" type="text" style={{ flexBasis:'48%' }} />
                             </div>
                             <PaymentInputField placeholder="Name on Card" type="text" />

                             {/* Country Dropdown */}
                             <CountrySelect>
                                 {countriesList.map((country) => (
                                     <option key={country} value={country}>{country}</option>
                                 ))}
                             </CountrySelect>

                             <PaymentInputField placeholder="Postal Code" type="text" />
                         </PaymentForm>
                        <Divider/>
                         {/* Checkbox for Anonymous Donation */}
                         <label style={{ display:'flex', alignItems:'center', marginTop:'10px' }}>
                             <input
                                 type="checkbox"
                                 checked={isAnonymous}
                                 onChange={() => setIsAnonymous(!isAnonymous)}
                                 style={{ marginRight:'10px' }}
                             />
                             Don't display my name publicly on the fundraiser.
                         </label>

                         {/* Donation Summary Section */}
                         <Divider />
                         <h3 style={{textAlign: "left", color: Theme.text}}>Your Donation</h3>
                         <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
                             <p >Your Donation:</p>
                             <p>${donationAmount || '0.00'}</p> {/* Display $0.00 if no amount is entered */}
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                             <p>Donation Tip:</p>
                             <p>
                                 ${tip || '0.00'}
                             </p>
                         </div>
                         <Divider/>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                             <p>Total Due Today:</p>
                             <p>
                                 ${(
                                     showCustomTipInput
                                         ? (parseFloat(customTipAmount) || 0) + (parseFloat(donationAmount) || 0)
                                         : (parseFloat(donationAmount) || 0) + ((parseFloat(donationAmount) * tipPercentage) / 100 || 0)
                                 ).toFixed(2)}
                             </p>
                         </div>

                         {/* Donate Button */}
                         <ActionButton primary onClick={handleDonate}>
                             <DollarOutlined /> Donate Now
                         </ActionButton>
                     </div>
                 </Card.Body>
             </DonationCard>
         </DonationContainer>
     );
};

export default Donation;