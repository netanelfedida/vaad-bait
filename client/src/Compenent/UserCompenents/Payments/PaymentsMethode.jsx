import cashImage from '../../../Pictures/Cash-Awards.png';
import bitImage from '../../../Pictures/Bit_logo.svg.png';
import paypalImage from '../../../Pictures/paypal-784403_1280.png';
import '../../../CSS/PaymentsMethods.css';

export default function PaymentMethods({ handleCashPayment }) {
    return (
        <div className="payment-methods-container">
            <div className="payment-option" onClick={handleCashPayment}>
                <img src={cashImage} alt="Cash Payment" className="payment-image enabled-image" />
                <p className="payment-label">מזומן</p>
            </div>

            <div className="payment-option disabled">
                <img src={bitImage} alt="BIT Payment" className="payment-image" />
                <div className="overlay">
                    <span className="coming-soon-text">בקרוב</span>
                </div>
            </div>

            <div className="payment-option disabled">
                <img src={paypalImage} alt="PayPal Payment" className="payment-image" />
                <div className="overlay">
                    <span className="coming-soon-text">בקרוב</span>
                </div>
            </div>
        </div>
    );
}

