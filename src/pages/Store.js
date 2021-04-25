import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Analytics, Auth } from 'aws-amplify';
import "./Store.css"
import Button from '@material-ui/core/Button';
import PizzaItem from '../components/PizzaItem';

const Store = () => {
    const history = useHistory();
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        Auth
            .currentAuthenticatedUser({ bypassCache: false })
            .then(user => setUser(user))
            .catch(err => console.log(err));
    }, []);

    const pizzaCatalogue = [
        {
            name: 'Cheese Pizza',
            price: 18,
            imageURL: "https://pixabay.com/get/ge79c15dc6e6f7e22382f0086f4a71629237f7e40d96466b3565d371364cef403f88364496cf2766c4029dc79292b3161_640.jpg"
        },
        {
            name: 'Garlic Pizza',
            price: 14,
            imageURL: "https://pixabay.com/get/g8a25d643e8b840583661d6b8bf785f0b52b77673cf9e29a44bf9c844c550defb7a5545ff06b6ca9adc4b2f3bdb528d1f_640.jpg"
        },
        {
            name: 'Sausage Pizza',
            price: 20,
            imageURL: "https://pixabay.com/get/gbecd04ab0e7c4890d708c7dcb8fc411d86c677e7032fd2c16af97b5a8ce1e664e9f5688f1e2c8a57d394b2c508ae4bf0_640.jpg"
        }
    ];

    const handleCheckout = (e) => {
        e.preventDefault();
        Analytics.record({
            name: 'Checkout',
            attributes: { purchased: 'Yes' }
        });

        Analytics.updateEndpoint({
            address: user.attributes.email,
            attributes: {
                cart,
                purchased: ['Yes']
            },
            channelType: 'EMAIL',
        });

        history.push('/checkout');
    }

    const addToCart = (e) => {
        e.preventDefault();
        Analytics.record({
            name: 'AddToCart',
            attributes: { purchased: 'No' }
        });

        Analytics.updateEndpoint({
            address: user.attributes.email,
            attributes: {
                cart,
                purchased: ['No']
            },
            channelType: 'EMAIL',
        });
    }

    const selectItem = (e) => {
        const pizzaName = e.target.value;
        if (e.target.checked) {
            setCart([...cart, pizzaName]);
        } else {
            const filteredItems = cart.filter(item => item !== pizzaName);
            setCart(filteredItems);
        }
    }

    return (
        <div className="store">
            <div className="store__body">
                {pizzaCatalogue.map((pizza, index) => (
                    <PizzaItem key={index} pizza={pizza} addToCart={addToCart} selectItem={selectItem} />
                ))}
            </div>
            <div className="store__footer">
                <Button variant="contained" color="default" onClick={(e) => addToCart(e)}>Add To Cart</Button>
                <Button variant="contained" color="primary" onClick={(e) => handleCheckout(e)}>Checkout</Button>
            </div>
        </div>

    )
}

export default Store;