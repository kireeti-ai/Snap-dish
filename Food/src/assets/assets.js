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

// Exported Assets Object
export const assets = {
    logo, save, loading, offer, trash, user, star, time,
    basket_icon, header_img, search_icon, rating_starts,
    add_icon_green, add_icon_white, remove_icon_red,
    app_store, play_store, linkedin_icon, facebook_icon,
    twitter_icon, cross_icon, selector_icon, profile_icon,
    logout_icon, bag_icon, parcel_icon, checked, un_checked,restaurant,hamburger_icon,agent,ping
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

// Restaurant List
export const restaurant_list = [
  { _id: "1", name: "Tasty Bites", image: food_11, cuisine: "Indian, Chinese", rating: 4.5, time: "30-40 min", address: "123 Main Street, Downtown", people: 60, price_for_two: 600 },
  { _id: "2", name: "Pizza Planet", image: food_12, cuisine: "Italian", rating: 4.2, time: "20-30 min", address: "456 Elm Avenue, City Center", people: 45, price_for_two: 800 },
  { _id: "3", name: "Urban Diner", image: food_13, cuisine: "American", rating: 4.0, time: "25-35 min", address: "789 Oak Road, Riverside", people: 70, price_for_two: 750 },
  { _id: "4", name: "Curry House", image: food_14, cuisine: "North Indian", rating: 4.3, time: "30-40 min", address: "321 Pine Street, Midtown", people: 50, price_for_two: 550 },
  { _id: "5", name: "Sushi World", image: food_15, cuisine: "Japanese", rating: 4.6, time: "20-30 min", address: "654 Maple Lane, Uptown", people: 40, price_for_two: 1200 },
  { _id: "6", name: "Burger Hub", image: food_16, cuisine: "Fast Food", rating: 4.1, time: "15-25 min", address: "987 Cedar Boulevard, Market Square", people: 80, price_for_two: 400 },
  { _id: "7", name: "Pasta Fiesta", image: food_17, cuisine: "Italian", rating: 4.4, time: "20-30 min", address: "246 Birch Avenue, Greenfield", people: 55, price_for_two: 900 },
  { _id: "8", name: "The Green Bowl", image: food_18, cuisine: "Healthy Food", rating: 4.3, time: "25-35 min", address: "135 Willow Street, Lakeview", people: 35, price_for_two: 700 },
  { _id: "9", name: "Flame Grill", image: food_19, cuisine: "Barbecue", rating: 4.5, time: "30-40 min", address: "579 Spruce Road, West End", people: 65, price_for_two: 950 },
  { _id: "10", name: "Desert Delights", image: food_20, cuisine: "Bakery, Desserts", rating: 4.7, time: "15-20 min", address: "864 Poplar Street, Eastwood", people: 30, price_for_two: 500 },
  { _id: "11", name: "Thai Spice", image: food_21, cuisine: "Thai", rating: 4.4, time: "25 - 35 min", address: "753 Walnut Avenue, Highland Park", people: 50, price_for_two: 850 },
  { _id: "12", name: "Punjabi Rasoi", image: food_22, cuisine: "Punjabi", rating: 4.6, time: "30 - 40 min", address: "159 Chestnut Road, Old Town", people: 75, price_for_two: 650 }
];

// Canteen List
export const canteen_list = [
    { _id: "c1", name: "IT Canteen", image: food_11, cuisine: "Indian, Chinese", rating: 4.5, time: "30-40 min", address: "123 Main Street, Downtown", people: 60, price_for_two: 600 },
    { _id: "c2", name: "MBA Canteen", image: food_12, cuisine: "Italian", rating: 4.2, time: "20-30 min", address: "456 Elm Avenue, City Center", people: 45, price_for_two: 800 },
    { _id: "c3", name: "Main Canteen", image: food_13, cuisine: "American", rating: 4.0, time: "25-35 min", address: "789 Oak Road, Riverside", people: 70, price_for_two: 750 }
]

// Food List (UPDATED to include items from canteens)
export const food_list = [
  { _id: "1", name: "Greek Salad", image: food_1, price: 12, description: "A refreshing mix of fresh vegetables", category: "Salad", type: "Veg", restaurant: "The Green Bowl", restaurant_id: "8", is_top_dish: true },
  // UPDATED: This item is now from "IT Canteen"
  { _id: "2", name: "Veg Salad", image: food_2, price: 18, description: "A healthy and delicious vegetable salad", category: "Salad", type: "Veg", restaurant: "IT Canteen", restaurant_id: "c1" },
  { _id: "3", name: "Clover Salad", image: food_3, price: 16, description: "A special salad with a unique dressing", category: "Salad", type: "Veg", restaurant: "Urban Diner", restaurant_id: "3" },
  { _id: "4", name: "Chicken Salad", image: food_4, price: 24, description: "Grilled chicken strips on a bed of greens", category: "Salad", type: "NonVeg", restaurant: "Flame Grill", restaurant_id: "9", is_top_dish: true },
  { _id: "5", name: "Lasagna Rolls", image: food_5, price: 14, description: "Classic lasagna rolled into perfect bites", category: "Rolls", type: "Veg", restaurant: "Pasta Fiesta", restaurant_id: "7" },
  // UPDATED: This item is now from "Main Canteen"
  { _id: "6", name: "Peri Peri Rolls", image: food_6, price: 12, description: "Spicy peri-peri seasoned rolls", category: "Rolls", type: "Veg", restaurant: "Main Canteen", restaurant_id: "c3" },
  { _id: "7", name: "Chicken Rolls", image: food_7, price: 20, description: "Tender chicken wrapped in a soft roll", category: "Rolls", type: "NonVeg", restaurant: "Burger Hub", restaurant_id: "6", is_top_dish: true },
  // UPDATED: This item is now from "MBA Canteen"
  { _id: "8", name: "Veg Rolls", image: food_8, price: 15, description: "Mixed vegetables in a crispy roll", category: "Rolls", type: "Veg", restaurant: "MBA Canteen", restaurant_id: "c2" },
  { _id: "9", name: "Ripple Ice Cream", image: food_9, price: 14, description: "Creamy ice cream with chocolate ripples", category: "Desserts", type: "Veg", restaurant: "Desert Delights", restaurant_id: "10" },
  { _id: "10", name: "Chocolate Lava Cake", image: food_10, price: 18, description: "Warm chocolate cake with a gooey center", category: "Desserts", type: "Veg", restaurant: "Desert Delights", restaurant_id: "10", is_top_dish: true },
  { _id: "11", name: "Fruit Salad", image: food_11, price: 15, description: "A mix of fresh seasonal fruits", category: "Desserts", type: "Veg", restaurant: "The Green Bowl", restaurant_id: "8" },
  { _id: "12", name: "Margherita Pizza", image: food_12, price: 22, description: "Classic pizza with tomato, mozzarella, and basil", category: "Pizza", type: "Veg", restaurant: "Pizza Planet", restaurant_id: "2", is_top_dish: true },
  { _id: "13", name: "Pepperoni Pizza", image: food_13, price: 26, description: "A meaty pizza with spicy pepperoni", category: "Pizza", type: "NonVeg", restaurant: "Pizza Planet", restaurant_id: "2" },
  { _id: "14", name: "Paneer Tikka Pizza", image: food_14, price: 24, description: "An Indian twist on the classic pizza", category: "Pizza", type: "Veg", restaurant: "Curry House", restaurant_id: "4" },
  { _id: "15", name: "Sushi Platter", image: food_15, price: 35, description: "An assortment of fresh sushi rolls", category: "Sushi", type: "NonVeg", restaurant: "Sushi World", restaurant_id: "5" },
  // UPDATED: This item is now from "Main Canteen"
  { _id: "16", name: "Veggie Burger", image: food_16, price: 10, description: "A delicious and hearty vegetable burger", category: "Burger", type: "Veg", restaurant: "Main Canteen", restaurant_id: "c3" },
  { _id: "17", name: "Spaghetti Carbonara", image: food_17, price: 28, description: "Creamy pasta with bacon and cheese", category: "Pasta", type: "NonVeg", restaurant: "Pasta Fiesta", restaurant_id: "7", is_top_dish: true },
  { _id: "18", name: "Pad Thai", image: food_18, price: 25, description: "Stir-fried rice noodles with shrimp and peanuts", category: "Noodles", type: "NonVeg", restaurant: "Thai Spice", restaurant_id: "11", is_top_dish: true },
  { _id: "19", name: "Butter Chicken", image: food_19, price: 30, description: "Creamy and rich butter chicken curry", category: "Curry", type: "NonVeg", restaurant: "Punjabi Rasoi", restaurant_id: "12", is_top_dish: true },
  { _id: "20", name: "Dal Makhani", image: food_20, price: 20, description: "Slow-cooked black lentils in a creamy sauce", category: "Curry", type: "Veg", restaurant: "Punjabi Rasoi", restaurant_id: "12" }
];