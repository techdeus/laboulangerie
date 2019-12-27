import React from 'react';
import '../stylesheets/components/footer.scss';

function Footer() {
    return (
        <div className="footerWrapper">
            <div className="lowerFooter">
                <a href="https://www.laboulangeriesf.com/" target="_blank">
                    <span>Laboulangerie Cafe</span>
                </a>
                <a href="https://www.linkedin.com/in/techdeus/" target="_blank">
                    <span>Powered by TechDeus</span>
                </a>
                <span>Copyright &copy; 2019</span>
            </div>
        </div>
    )
}

export default Footer;