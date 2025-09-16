// src/pages/ManageReviewsPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllReviews, deleteReview } from '../services/api';
import StarRating from '../components/StarRating';

const ManageReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await getAllReviews();
            setReviews(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (ratingId) => {
        // Add a confirmation dialog for safety
        if (window.confirm('Are you sure you want to permanently delete this review?')) {
            try {
                const successMsg = await deleteReview(ratingId);
                setMessage(successMsg);
                // Refresh the list after deleting
                setReviews(prev => prev.filter(r => r.ratingId !== ratingId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <h2>Loading All Reviews...</h2>;

    return (
        <div>
            <h2>Manage Patient Feedback</h2>
            <p>Oversee all patient feedback for quality control and moderation.</p>
            <hr />
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
            {reviews.length > 0 ? (
                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review.ratingId} className="review-card">
                            <div className="review-header">
                                <span>
                                    <strong>Patient:</strong> {review.patientName} ({review.patientEmail})
                                </span>
                                <span className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Reviewed:</strong> {review.doctorName} - <em>{review.doctorSpecialization}</em>
                            </div>
                            <div className="review-rating">
                                <StarRating rating={review.rating} />
                            </div>
                            {review.review && <p className="review-text">"{review.review}"</p>}
                            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                <button onClick={() => handleDelete(review.ratingId)} className="btn btn-cancel">
                                    Delete Review
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No feedback has been submitted in the system yet.</p>
            )}
        </div>
    );
};

export default ManageReviewsPage;