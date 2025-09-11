import basket_icon from './bag_icon.png'
import logo from './logo-snapdish.png'
import header_img from './header.jpeg'
import search_icon from './search_icon.png'
import offer from './offer.png'
import time from './hourglass.png'
import star from './star.png'
import save from './save.png'
import loading from './loading-bar.png'
import trash from './trash-can.png'
import user from './user.png'
import agent from'./agent-2.png'
import hamburger_icon from './burger.png'
import menu_1 from './biryani.png.avif'
import menu_2 from './fried rice.png.avif'
import menu_3 from './paratha.png.avif'
import menu_4 from './menu_5.png'
import menu_5 from './pizza.png.avif'
import menu_6 from './menu_6.png'
import menu_7 from './menu_7.png'
import menu_8 from './menu_8.png'
import food_1 from './food_1.png'
import food_2 from './food_2.png'
import food_3 from './food_3.png'
import food_4 from './food_4.png'
import food_5 from './food_5.png'
import food_6 from './food_6.png'
import food_7 from './food_7.png'
import food_8 from './food_8.png'
import food_9 from './food_9.png'
import food_10 from './food_10.png'
import food_11 from './food_11.png'
import food_12 from './food_12.png'
import food_13 from './food_13.png'
import food_14 from './food_14.png'
import food_15 from './food_15.png'
import food_16 from './food_16.png'
import food_17 from './food_17.png'
import food_18 from './food_18.png'
import food_19 from './food_19.png'
import food_20 from './food_20.png'
import food_21 from './food_21.png'
import food_22 from './food_22.png'
import add_icon_white from './add_icon_white.png'
import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import app_store from './app_store.png'
import play_store from './play_store.png'
import linkedin_icon from './linkedin_icon.png'
import facebook_icon from './facebook_icon.png'
import twitter_icon from './twitter_icon.png'
import cross_icon from './cross_icon.png'
import selector_icon from './selector_icon.png'
import rating_starts from './rating_starts.png'
import profile_icon from './profile_icon.png'
import bag_icon from './bag_icon.png'
import logout_icon from './logout_icon.png'
import parcel_icon from './parcel_icon.png'
import checked from './checked.png'
import un_checked from './un_checked.png'
import restaurant from './restaurant.png'
import ping from './pin.png'
import heart_solid from './heart_solid.png'
import heart_outline from './heart_outline.png'
import review from './review.png'
// Exported Assets Object
export const assets = {
    logo, save, loading, offer, trash, user, star, time,
    basket_icon, header_img, search_icon, rating_starts,
    add_icon_green, add_icon_white, remove_icon_red,
    app_store, play_store, linkedin_icon, facebook_icon,
    twitter_icon, cross_icon, selector_icon, profile_icon,
    logout_icon, bag_icon, parcel_icon, checked, un_checked,restaurant,hamburger_icon,agent,ping,heart_solid,heart_outline,review
}

// Menu List
export const menu_list = [
    { menu_name: "Salad", menu_image: menu_1 },
    { menu_name: "Rolls", menu_image: menu_2 },
    { menu_name: "Desserts", menu_image: menu_3 },
    { menu_name: "Sandwich", menu_image: menu_4 },
    { menu_name: "Cake", menu_image: menu_5 },
    { menu_name: "Pure Veg", menu_image: menu_6 },
    { menu_name: "Pasta", menu_image: menu_7 },
    { menu_name: "Noodles", menu_image: menu_8 }
]



// Canteen List
export const canteen_list = [
    { _id: "c1", name: "IT Canteen", image: food_11, cuisine: "Indian, Chinese", rating: 4.5, time: "30-40 min", address: "123 Main Street, Downtown", people: 60, price_for_two: 600 },
    { _id: "c2", name: "MBA Canteen", image: food_12, cuisine: "Italian", rating: 4.2, time: "20-30 min", address: "456 Elm Avenue, City Center", people: 45, price_for_two: 800 },
    { _id: "c3", name: "Main Canteen", image: food_13, cuisine: "American", rating: 4.0, time: "25-35 min", address: "789 Oak Road, Riverside", people: 70, price_for_two: 750 }
]

// Food List (UPDATED to include items from canteens)
// Restaurant List with Reviews
export const restaurant_list = [
    { 
        _id: "1", 
        name: "Paradise Biryani", 
        image: food_1, 
        cuisine: "Hyderabadi, Mughlai", 
        rating: 4.7, 
        time: "35-45 min", 
        address: "Kondapur, Hyderabad", 
        people: 120, 
        price_for_two: 750,
        reviews: [
            { reviewerName: "Arjun", rating: 5, comment: "Authentic Hyderabadi biryani, absolutely delicious!" },
            { reviewerName: "Priya", rating: 4, comment: "Great food, but portion size could be better." }
        ]
    },
    { 
        _id: "2", 
        name: "Saravana Bhavan", 
        image: food_2, 
        cuisine: "South Indian", 
        rating: 4.5, 
        time: "20-30 min", 
        address: "T. Nagar, Chennai", 
        people: 90, 
        price_for_two: 500,
        reviews: [
            { reviewerName: "Ravi", rating: 5, comment: "Best dosa in Chennai, crisp and tasty!" },
            { reviewerName: "Sneha", rating: 4, comment: "Idlis were soft, but chutney could be fresher." }
        ]
    },
    { 
        _id: "3", 
        name: "Haldiram's", 
        image: food_3, 
        cuisine: "North Indian, Street Food", 
        rating: 4.2, 
        time: "25-35 min", 
        address: "Chandni Chowk, Delhi", 
        people: 150, 
        price_for_two: 600,
        reviews: [
            { reviewerName: "Amit", rating: 5, comment: "Chole Bhature was amazing!" },
            { reviewerName: "Neha", rating: 3, comment: "Good taste but too crowded." }
        ]
    },
    { 
        _id: "4", 
        name: "Karim's", 
        image: food_4, 
        cuisine: "Mughlai", 
        rating: 4.6, 
        time: "40-50 min", 
        address: "Jama Masjid, Delhi", 
        people: 80, 
        price_for_two: 1200,
        reviews: [
            { reviewerName: "Rahul", rating: 5, comment: "Authentic Mughlai flavors, rich gravies." },
            { reviewerName: "Fatima", rating: 4, comment: "Loved the kebabs, but seating is tight." }
        ]
    },
    { 
        _id: "5", 
        name: "Anand Stall", 
        image: food_5, 
        cuisine: "Mumbai Street Food", 
        rating: 4.8, 
        time: "15-25 min", 
        address: "Vile Parle, Mumbai", 
        people: 200, 
        price_for_two: 300,
        reviews: [
            { reviewerName: "Karan", rating: 5, comment: "Best vada pav ever! So authentic." },
            { reviewerName: "Meera", rating: 5, comment: "Affordable and tasty, must try." }
        ]
    },
    { 
        _id: "6", 
        name: "Ohri's", 
        image: food_6, 
        cuisine: "Multi-Cuisine", 
        rating: 4.3, 
        time: "30-40 min", 
        address: "Banjara Hills, Hyderabad", 
        people: 75, 
        price_for_two: 1500,
        reviews: [
            { reviewerName: "Sunil", rating: 4, comment: "Good ambience, desserts are fantastic." },
            { reviewerName: "Ritika", rating: 5, comment: "Family-friendly and lots of options." }
        ]
    },
    { 
        _id: "7", 
        name: "Adyar Ananda Bhavan", 
        image: food_7, 
        cuisine: "South Indian, Sweets", 
        rating: 4.4, 
        time: "20-30 min", 
        address: "Adyar, Chennai", 
        people: 110, 
        price_for_two: 450,
        reviews: [
            { reviewerName: "Deepak", rating: 4, comment: "Great sweets, slightly expensive." },
            { reviewerName: "Latha", rating: 5, comment: "Rava kesari is heavenly!" }
        ]
    },
    { 
        _id: "8", 
        name: "KFC", 
        image: food_8, 
        cuisine: "Fast Food", 
        rating: 2.8,  // ⭐ Low rating
        time: "25-35 min", 
        address: "Multiple Locations", 
        people: 180, 
        price_for_two: 550,
        reviews: [
            { reviewerName: "Vikram", rating: 2, comment: "Too oily and not fresh." },
            { reviewerName: "Rohini", rating: 3, comment: "Okay for a quick snack, nothing special." }
        ]
    },
    { 
        _id: "9", 
        name: "Domino's Pizza", 
        image: food_9, 
        cuisine: "Italian, Pizza", 
        rating: 4.0, 
        time: "30-40 min", 
        address: "Multiple Locations", 
        people: 160, 
        price_for_two: 800,
        reviews: [
            { reviewerName: "Anjali", rating: 4, comment: "Cheese burst was amazing!" },
            { reviewerName: "Ramesh", rating: 3, comment: "Delivery took too long." }
        ]
    },
    { 
        _id: "10", 
        name: "Subway", 
        image: food_10, 
        cuisine: "Healthy, Sandwiches", 
        rating: 3.9, 
        time: "15-20 min", 
        address: "Multiple Locations", 
        people: 130, 
        price_for_two: 400,
        reviews: [
            { reviewerName: "Snehal", rating: 4, comment: "Fresh veggies, liked the salad bar." },
            { reviewerName: "Kishore", rating: 3, comment: "Good, but portions are small." }
        ]
    },
    { 
        _id: "11", 
        name: "Wow! Momo", 
        image: food_11, 
        cuisine: "Tibetan, Fast Food", 
        rating: 3.2, 
        time: "20-30 min", 
        address: "Koramangala, Bengaluru", 
        people: 95, 
        price_for_two: 400,
        reviews: [
            { reviewerName: "Anand", rating: 3, comment: "Average taste, not authentic momos." },
            { reviewerName: "Divya", rating: 4, comment: "Cheese momos were nice though." }
        ]
    },
    { 
        _id: "12", 
        name: "Punjabi by Nature", 
        image: food_12, 
        cuisine: "North Indian, Punjabi", 
        rating: 4.5, 
        time: "30-40 min", 
        address: "Sector 29, Gurgaon", 
        people: 110, 
        price_for_two: 1800,
        reviews: [
            { reviewerName: "Harpreet", rating: 5, comment: "Dal makhani and butter naan were amazing!" },
            { reviewerName: "Simran", rating: 4, comment: "Good food, pricey but worth it." }
        ]
    },
    { 
        _id: "13", 
        name: "Bikanervala", 
        image: food_13, 
        cuisine: "Sweets, North Indian", 
        rating: 4.1, 
        time: "20-25 min", 
        address: "Lajpat Nagar, Delhi", 
        people: 130, 
        price_for_two: 500,
        reviews: [
            { reviewerName: "Gaurav", rating: 4, comment: "Great sweets, fresh and tasty." },
            { reviewerName: "Asha", rating: 4, comment: "Loved the kachoris!" }
        ]
    },
    { 
        _id: "14", 
        name: "Burger King", 
        image: food_14, 
        cuisine: "Fast Food, Burgers", 
        rating: 2.9,  // ⭐ Low rating
        time: "25-35 min", 
        address: "Multiple Locations", 
        people: 170, 
        price_for_two: 500,
        reviews: [
            { reviewerName: "Suresh", rating: 3, comment: "Burgers were okay, fries soggy." },
            { reviewerName: "Madhuri", rating: 2, comment: "Not worth the price, McD is better." }
        ]
    },
    { 
        _id: "15", 
        name: "Barbeque Nation", 
        image: food_15, 
        cuisine: "Barbecue, North Indian", 
        rating: 4.9, 
        time: "45-55 min", 
        address: "Jubilee Hills, Hyderabad", 
        people: 250, 
        price_for_two: 2000,
        reviews: [
            { reviewerName: "Rohit", rating: 5, comment: "Unlimited buffet is worth it!" },
            { reviewerName: "Shalini", rating: 5, comment: "Grill experience was amazing, loved it." }
        ]
    },
    { 
        _id: "16", 
        name: "Faasos", 
        image: food_16, 
        cuisine: "Wraps, Rolls", 
        rating: 3.0, 
        time: "15-25 min", 
        address: "Cloud Kitchen", 
        people: 140, 
        price_for_two: 350,
        reviews: [
            { reviewerName: "Ramesh", rating: 3, comment: "Wraps are okay, sometimes inconsistent." },
            { reviewerName: "Kavya", rating: 3, comment: "Good for late-night cravings." }
        ]
    }
];

// Food List (Indian Dishes)
export const food_list = [
    { _id: "1", name: "Hyderabadi Chicken Biryani", image: food_1, price: 350, description: "Aromatic basmati rice cooked with succulent chicken and exotic spices.", category: "Biryani", type: "Non-Veg", restaurant: "Paradise Biryani", restaurant_id: "1", is_top_dish: true },
    { _id: "2", name: "Masala Dosa", image: food_2, price: 120, description: "Crispy rice crepe filled with a savory potato filling, served with chutney and sambar.", category: "Dosa", type: "Veg", restaurant: "Saravana Bhavan", restaurant_id: "2", is_top_dish: true },
    { _id: "3", name: "Chole Bhature", image: food_3, price: 180, description: "Spicy chickpea curry served with fluffy, deep-fried bread.", category: "North Indian", type: "Veg", restaurant: "Haldiram's", restaurant_id: "3", is_top_dish: true },
    { _id: "4", name: "Mutton Korma", image: food_4, price: 450, description: "Tender mutton pieces cooked in a rich and creamy gravy.", category: "Mughlai", type: "Non-Veg", restaurant: "Karim's", restaurant_id: "4", is_top_dish: true },
    { _id: "5", name: "Vada Pav", image: food_5, price: 50, description: "The iconic Mumbai street food, a spiced potato fritter in a soft bread roll.", category: "Street Food", type: "Veg", restaurant: "Anand Stall", restaurant_id: "5", is_top_dish: true },
    { _id: "6", name: "Tandoori Platter", image: food_6, price: 650, description: "An assortment of delicious tandoori kebabs and tikkas.", category: "Tandoori", type: "Non-Veg", restaurant: "Ohri's", restaurant_id: "6" },
    { _id: "7", name: "Ghee Podi Idli", image: food_7, price: 90, description: "Soft, steamed rice cakes tossed in ghee and spicy podi masala.", category: "South Indian", type: "Veg", restaurant: "Adyar Ananda Bhavan", restaurant_id: "7" },
    { _id: "8", name: "Zinger Burger", image: food_8, price: 250, description: "Crispy fried chicken fillet in a soft bun with lettuce and mayo.", category: "Fast Food", type: "Non-Veg", restaurant: "KFC", restaurant_id: "8" },
    { _id: "9", name: "Margherita Pizza", image: food_9, price: 300, description: "Classic pizza with fresh mozzarella, tomatoes, and basil.", category: "Pizza", type: "Veg", restaurant: "Domino's Pizza", restaurant_id: "9" },
    { _id: "10", name: "Paneer Tikka Sandwich", image: food_10, price: 180, description: "A healthy and filling sandwich with grilled paneer tikka and fresh veggies.", category: "Sandwiches", type: "Veg", restaurant: "Subway", restaurant_id: "10" }
]