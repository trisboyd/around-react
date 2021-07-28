import React from 'react';
import Header from './Header';
import Main from './Main';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeletePopup from './ConfirmDeletePopup';
import ImagePopup from './ImagePopup';
import Footer from './Footer';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import '../index.css';


function App() {

    // Retrieve User info in object______________________________________________________________________________________
    const [currentUser, setCurrentUser] = React.useState({
        name: '',
        about: '',
        avatar: '',
        id: ''
    });

    const retrieveUserInfo = () => {
        api.getProfile().then(res => {
            setUserInfo(res);
        })
        .catch(err => {console.log(err)})
    }

    const setUserInfo= (data) => {
            setCurrentUser(
                {name: data.name,
                about: data.about,
                avatar: data.avatar,
                id: data._id,
                })
    }

    React.useEffect(() => {
        retrieveUserInfo();
    }, []);


    // State Variables for Popups
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState();


    // Popup functions for opening and closing
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleConfirmDeleteClick() {
        setIsConfirmDeletePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function closeAllPopups() {
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsConfirmDeletePopupOpen(false);
        setSelectedCard();
    }

    // function for changing user info in the API based on inputs
    function handleUpdateUser(data) {
        api.changeProfile(data).then(res => {
            setUserInfo(data);
            closeAllPopups();
        })
        .catch(err => {console.log(err)})
    }

// CARDS____________________________________________________________________________________________________________

    // Cards state variable
    const [cards, setCards] = React.useState([]);

    // function that fetches cards
    function addCards() {
        api.getCardList().then(res => {
            setCards([...cards, ...res]);
        })
            .catch(err => { console.log(err) })
    }

    // call cards and profile using hook's "useEffect"
    React.useEffect(() => {
        addCards();
    }, []);

    // function for sending card likes or unlikes to API and resetting the status accordingly
    function handleCardLike(card) {
        const isLiked = card.likes.some(cardLike => cardLike._id === currentUser.id);
        api.changeLikeCardStatus(card._id, isLiked).then((likedCard) => {
            setCards(cards.map((cardItem) => cardItem._id === card._id ? likedCard : cardItem));
        })
            .catch(err => { console.log(err) });
    }


    // function for deleting a card
    function handleCardDelete(card) {
        api.deleteCard(card._id).then(res => {
            setCards(cards.filter((cardItem) => cardItem._id !== card._id))
        }) 
        .catch(err => { console.log(err) });
    }

    // function for adding a card
    function addCardHandler(cardData) {
        api.addCard(cardData).then(res => {
            setCards([...cards, res])
            closeAllPopups();
        })
        .catch(err => { console.log(err) });
    }

    // Components
    return (

        <div>
            <CurrentUserContext.Provider value={currentUser}>
            <Header />
            <Main onEditAvatarClick={handleEditAvatarClick} onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick} onCardClick={handleCardClick} deleteClick={handleConfirmDeleteClick} 
                cards={cards} handleCardLike={handleCardLike} handleCardDelete={handleCardDelete}/>
            <Footer />
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddCard={addCardHandler}/>
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            <ConfirmDeletePopup isOpen={isConfirmDeletePopupOpen} onClose={closeAllPopups} />
            </CurrentUserContext.Provider>
        </div>
    );
}

export default App;