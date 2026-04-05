import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import logo from '../../assets/logo.png';

export const Navbar = () => {
    const [isCoursesOpen, setIsCoursesOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <nav style={{ width: "100%", padding: "1rem 3rem", position: "relative", zIndex: 50 }}>
            <div
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                {/* Logo */}
                <header style={{ display: "flex", justifyContent: "flex-start" }}>
                    <img src={logo} alt="The Academic Hood" style={{ height: "50px", objectFit: "contain" }} />
                </header>

                {/* Navigation Links Removed */}
                <div aria-hidden="true" />

                {/* Empty Spacer to balance the grid */}
                <div aria-hidden="true" />
            </div>
        </nav>
    );
};
