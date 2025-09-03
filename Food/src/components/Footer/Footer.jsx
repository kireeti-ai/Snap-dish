import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="Logo" />
                <p>SnapDish is your go-to destination for quick, delicious meals delivered right to your doorstep. Our mission is to connect you with the best local restaurants and bring a world of flavor to your table.</p>
                <div className="social-icons">
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><img src={assets.linkedin_icon} alt="LinkedIn"/></a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><img src={assets.facebook_icon} alt="Facebook"/></a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><img src={assets.twitter_icon} alt="Twitter"/></a>
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About us</a></li>
                    <li><a href="/delivery">Delivery</a></li>
                    <li><a href="/privacy">Privacy policy</a></li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91 9392509139</li>
                    <li>contact@snapdish.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <p className="footer-copyright">
            Copyright {new Date().getFullYear()} © SnapDish.com - All Rights Reserved.
        </p>
    </div>
  )
}

export default Footer