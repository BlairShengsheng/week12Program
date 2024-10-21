import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setAllSpotsThunks, deleteASpotThunk } from '../../store/spots';
import './ManageSpot.css';

export function ManageSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => state.allSpots.allSpots);
  const sessionUser = useSelector((state) => state.session.user);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spotIdToDelete, setSpotIdToDelete] = useState(null);

  useEffect(() => {
    dispatch(setAllSpotsThunks());
  }, [dispatch]);

  // get all the user spots by matching their ownId and their user Id
  const userSpots = Object.values(spots).filter(
    spot => spot.ownerId === sessionUser?.id
  );

  //! --------------------------------------------------------------------
  //                       Delete Section function
  

  const handleDeleteClick = (spotId) => {
    setShowDeleteModal(true);// To show the modal
    setSpotIdToDelete(spotId); // upate this spot's state
  };

  const handleConfirmDelete = async () => {
    if (spotIdToDelete) {
      await dispatch(deleteASpotThunk(spotIdToDelete));// spotIdToDelete is a state holding spotId
      setShowDeleteModal(false);
      setSpotIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);// To hide the modal
    setSpotIdToDelete(null); // upate this spot's state
  };

  //! -------------------------------------------------------------------- 

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  if (!sessionUser) {
    navigate('/');
    return null;
  }
  const handleImageClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };


  return (
    <div className="manage-spots-container">
      <h1>Manage Your Spots</h1>
      <Link to="/spots/new" className="create-spot-button">
        Create a New Spot
      </Link>

      <div className="spots-grid">
        {userSpots.map((spot) => (
          <div key={spot.id} className="spot-card">

            <img 
              // src={spot.previewImage || '/placeholder-image.jpg'}
              src={'/images/detail1.jpg'}
              alt={spot.name}
              className="spot-image"
              onClick={() => handleImageClick(spot.id)}
              style={{ cursor: 'pointer' }}
            />
            <div className="spot-info">
              <p>{spot.city}, {spot.state}</p>
              <p className="price">${spot.price} night</p>
              {/* <p className="rating">★ {spot.avgRating || 'New'}</p> */}
              <p className="rating">★ {spot.stars || 'New'}</p>
            </div>
            <div className="spot-actions">
              <button onClick={() => handleUpdate(spot.id)} className="update-button">
                Update
              </button>
              <button onClick={() => handleDeleteClick(spot.id)} className="delete-button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* if showDeleteModal is true(pop up), the conditional rendering will happen */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={handleConfirmDelete} className="confirm-delete-button">
              Yes (Delete Spot)
            </button>
            <button onClick={handleCancelDelete} className="cancel-delete-button">
              No (Keep Spot)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
