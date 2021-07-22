import React from 'react';
import Header from './Header';
import Main from './Main';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeletePopup from './ConfirmDeletePopup';
import ImagePopup from './ImagePopup';
import api from "../utils/api";
import Footer from './Footer';
import '../index.css';


function App() {

    // HOOKS_____________________________________________________________________________

    // Hooks for Popups
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState();

    // Hooks for setting profile and cards
    const [userName, setUserName] = React.useState();
    const [userDescription, setUserDescription] = React.useState();
    const [userAvatar, setUserAvatar] = React.useState();
    const [cards, setCards] = React.useState([]);

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

    // SET PROFILE INFO USING API________________________________________________________________________

    // function that fetches user info
    function retrieveUserInfo() {
        api.getProfile().then(res => {
            setUserName(res.name);
            setUserDescription(res.about);
            setUserAvatar(res.avatar);
        })
            .catch(err => { console.log(err) })
    }

    function addCards() {
        api.getCardList().then(res => {
            setCards([...cards, ...res]);
        })
            .catch(err => { console.log(err) })
    }

    // call function using hook's "useEffect"
    React.useEffect(() => {
        retrieveUserInfo();
        addCards();
    }, []);


    // Components
    return (

        <div className="page">
            <Header />
            <Main name={userName} description={userDescription} avatar={userAvatar} onEditAvatarClick={handleEditAvatarClick} onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick} onCardClick={handleCardClick} cards={cards} deleteClick={handleConfirmDeleteClick} />
            <Footer />
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} />
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            <ConfirmDeletePopup isOpen={isConfirmDeletePopupOpen} onClose={closeAllPopups} />

        </div>
    );
}

export default App;