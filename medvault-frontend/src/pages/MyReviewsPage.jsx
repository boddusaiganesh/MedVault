// src/pages/MyReviewsPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyDoctorReviews } from '../services/api';
import StarRating from '../components/StarRating'; // Reuse our star component

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getMyDoctorReviews();
                setReviews(data);
            } catch (err) {
                setError(err.message || "Could not fetch your reviews.");
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) return <h2>Loading Patient Feedback...</h2>;

    return (
        <div>
            <h2>Patient Feedback & Reviews</h2>
            <p>Here is the feedback your patients have submitted for completed appointments.</p>
            <hr />
            {error && <p className="message error">{error}</p>}
            {reviews.length > 0 ? (
                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <strong>Patient: {review.patientFirstName}</strong>
                                <span className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="review-rating">
                                <StarRating rating={review.rating} />
                            </div>
                            {review.review && <p className="review-text">"{review.review}"</p>}
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have not received any feedback yet.</p>
            )}
        </div>
    );
};

export default MyReviewsPage;