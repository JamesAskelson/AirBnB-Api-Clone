import './SpotShow.css'
import { getSpotById } from '../../../store/spots'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getReviewById } from '../../../store/reviews'
import OpenModalButton from '../../OpenModalButton'
import { PostReviewModal } from '../../PostReviewModal/PostReview'
import { DeleteReviewModal } from '../../DeleteReviewModal/DeleteReview'


export const SpotShow = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spot = useSelector(state => state.spots.singleSpot)
    const user = useSelector(state => (state.session.user))
    const reviews = useSelector(state => Object.values(state?.reviews?.spotReviews))
    const previewSpotImages = spot?.SpotImages?.filter(img => img.preview === true)
    const otherSpotImages = spot?.SpotImages?.filter(img => img.preview === false)
    // const [hasReviewed, setHasReviewed] = useState(false);
    console.log('user', user)
    console.log('spot', spot)
    console.log('reviews', reviews)

    useEffect(() => {
        dispatch(getSpotById(spotId))
        dispatch(getReviewById(spotId))
    }, [dispatch, spotId])


    const userHasReview = () => {
        const userReview = reviews.find(review => review.userId === user.id)
        console.log('userReview', userReview)
        if(userReview) {
            return true;
        }
        return false;
    }

    // useEffect(() => {
    // }, [reviews])


    // console.log('userReview', userReview)
    // setHasReviewed(userReview);


    const handleClick = () => {
        alert('Feature Coming Soon...');
    };

    const newReviewsText = () => {
        if(reviews.length < 1) {
            return <p>Be the first to post a review</p>
        }
    }

    const formatDate = (createdAtTime) => {
        const date = new Date(createdAtTime);
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric'});
    }

    const reviewInfo = () => {
        console.log('avg-rating', spot?.avgRating)
        console.log(`review count`, spot?.reviewCount)
        if(reviews.length > 1) {
            return `★ ${spot?.avgRating} • ${spot?.reviewCount} reviews`
        } else if (reviews.length === 1) {
            return `★ ${spot?.avgRating} • ${spot?.reviewCount} review`
        } else {
            return 'New'
        }
    }

    // ★ {reviews.length ? `${spot?.avgRating} • ${spot?.reviewCount} reviews` : 'New'}

    if (!spot) return null;

    return (
        <div id='spot-details-container'>
            <div id='spot-name-location'>
                <h2>
                    {spot.name}
                </h2>
                <h3>
                    {spot.city}, {spot.state}, {spot.country}
                </h3>
            </div>
            <div id='spot-all-images'>
                <div className='spot-prev-image'>
                    {previewSpotImages &&
                        <img src={previewSpotImages[0]?.url} alt='preview image'/>
                    }
                </div>
                <div className='spot-other-images'>
                    {otherSpotImages &&
                        otherSpotImages.map((image) => (
                            <div className='spot-image'>
                                 <img src={image.url} alt='other image' key={image.id} />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div id='spot-info'>
                <div className='spot-description'>
                    <h2>
                        Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}
                    </h2>
                    <p>
                        {spot?.description}
                    </p>
                </div>
                <div className='spot-price-rating'>
                    <div className='price-rating'>
                        <div className='price'>
                            <p className='price-number'>
                                ${spot?.price}
                            </p>
                            <p className='price-text'>
                                night
                            </p>
                        </div>
                        <div className='rating'>
                            {reviewInfo()}
                        </div>
                    </div>
                    <div className='reserve-button'>
                        <button onClick={handleClick}>
                            Reserve
                        </button>
                    </div>
                </div>
            </div>
            <hr/>
                <div>
                    <h2>
                    {reviewInfo()}
                    </h2>
                </div>
                {newReviewsText()}
                {user && userHasReview() === false && spot?.Owner?.id !== user.id && (
                    <OpenModalButton
                    buttonText="Post Your Review"
                    modalComponent={<PostReviewModal spotId={spotId}/>}
                  />
                )}
                {reviews?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review) => {
                    console.log('firstName', review?.User?.firstName);
                    console.log('lastName', review?.User?.lastName);
                    console.log(review.userId)
                    return (
                        <div className='individual-review'>
                        <div className='review-name'>
                            {review?.User?.firstName} {review?.User?.lastName}
                        </div>
                        <div className='review-date'>
                            {formatDate(review?.createdAt)}
                        </div>
                        <div className='review'>
                            {review?.review}
                        </div>
                        <div>
                            {user.id === review.userId && (
                                <OpenModalButton
                                buttonText="Delete your Review"
                                modalComponent={<DeleteReviewModal review={review} spotId={review.spotId} />}
                              />
                            )}
                        </div>
                        </div>
                    );
                    })}
        </div>
    )
}
