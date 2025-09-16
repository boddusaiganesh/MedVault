// src/components/FeedbackModal.jsx
import React, { useState } from 'react';
import { submitFeedback } from '../services/api';
// We'll need a star rating component, let's use react-icons for a simple one
import { FaStar } from 'react-icons/fa';

const FeedbackModal = ({ appointment, onClose, onFeedbackSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        try {
            await submitFeedback(appointment.id, { rating, review });
            onFeedbackSubmitted(); // Tell the parent to refresh
            onClose(); // Close the modal
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Leave Feedback for Dr. {appointment.doctorFirstName}</h2>
                <div className="star-rating">
                    {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;
                        return (
                            <label key={index}>
                                <input type="radio" name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} style={{ display: 'none' }} />
                                <FaStar
                                    className="star"
                                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                    size={40}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            </label>
                        );
                    })}
                </div>
                <textarea
                    rows="5"
                    placeholder="Share your experience..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                {error && <p className="message error">{error}</p>}
                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-logout">Cancel</button>
                    <button onClick={handleSubmit} className="btn">Submit Feedback</button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;