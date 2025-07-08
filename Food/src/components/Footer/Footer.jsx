import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo}/>
                <p> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque molestias ipsa, deleniti provident quibusdam voluptate vel eveniet repellat necessitatibus voluptatum eum veniam impedit quod vitae velit est nulla ex. Sunt? </p>
                <div className="social-icon">
                    <img src={assets.linkedin_icon}/>
                    <img src={assets.facebook_icon}/>
                    <img src={assets.twitter_icon }/>
                </div>
            </div>
            <div className="footer-content-center">
                <h2>
                    Company
                </h2>
                <ul>
                    <li>
                        Home
                    </li>
                    <li>Menu</li>
                    <li>
                        delivery
                    </li>
                    <li>
                        privarcy
                    </li>

                </ul>
            </div>
            <div className="footer-content-right">
                <h3>
                    Get in Touch
                </h3>
                <ul>
                    <li>9392509139</li>
                    <li>contact@company.com.in</li>
                </ul>

            </div>
            <hr/>
                <p className="footer-copyright">
                    Copyrights  2020 @ Company -All rights are reserved.
                </p>
        </div>
      
    </div>
  )
}

export default Footer
