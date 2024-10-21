
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllSpotsThunks } from '../../store/spots';
import { Link } from 'react-router-dom';
import './Spots.css';



//icon stuff

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from "@fortawesome/fontawesome-free-solid";



// List of image filenames in your public/images folder
const imageFilenames = [
  'previewImage1.jpg',
  'previewImage2.jpg',
  'previewImage3.jpg',
  'previewImage4.jpg',
  'previewImage5.jpg',
  // Add all your image filenames here
];



 //! --------------------------------------------------------------------
 //*                          Spots Component
 //! --------------------------------------------------------------------

export function Spots() {
  const dispatch = useDispatch();
 
  
  // allSpots is reducer from rootreducer, spots is a key in initialstate (find it in the reducer)
  const spots = useSelector((state) => state.allSpots.allSpots);//-------change over here

 


   // Sort spots by newest first
  //  const sortedSpots = [...spots].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


  useEffect(() => {
    dispatch(setAllSpotsThunks());
  }, [dispatch]);

 //------------------------------------Images Part------------------------------------------ 
  const [spotsWithImages, setSpotsWithImages] = useState([]);

  useEffect(() => {
    if (Object.keys(spots).length > 0) {
      const updatedSpots = Object.values(spots).map((spot, index) => {
        const assignedImage = imageFilenames[index % imageFilenames.length];

        return {
          ...spot,
          previewImage: assignedImage,
          smallImages: [
            imageFilenames[(index + 1) % imageFilenames.length],
            imageFilenames[(index + 2) % imageFilenames.length],
            imageFilenames[(index + 3) % imageFilenames.length],
            imageFilenames[(index + 4) % imageFilenames.length],
          ]
         
        };
      });
      setSpotsWithImages(updatedSpots);
    }
  }, [spots]);

//------------------------------------Images Part------------------------------------------ 





    return (
      <>
        <div className="spots-container">
          {/* bject.values(spots)*/}
          {spotsWithImages.map((spot, i) => (// spots from useSelector

            <Link to={`/spots/${spot.id}`} key={i}>

              <div key={i} className="single-spot-container"
              title={spot.name}// This adds the tooltip
              >
                <div className="spot-placeholder">
                  {/*add some change over here  */}
                <img 
                 src={`/images/${spot.previewImage}`} 
                 alt={spot.name}
                 className="spot-image"
                />
                 {/* <div className='tooltip'>{spot.name}</div> */}
                  <div className="empty-block1">{spot.city},{spot.state}</div>

                  <div className="empty-block2">${spot.price}/night</div>
                  
                  <div className='star-icon'>
                  <FontAwesomeIcon icon={faStar} color='black'/>rating
                  {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}
                  </div>
            

                </div>


              </div>

            </Link>

          ))}
        </div>
      </>
    );
}
