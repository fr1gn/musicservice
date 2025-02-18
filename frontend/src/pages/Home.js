import React, { useEffect, useState } from "react";
import { fetchKazakhSongs } from "../api/api";
import "../styles/main.css";

export default function Home() {
    return (
        <div className="home-container">
            {/* Main Content */}
            <main className="content">
                {/* Hero Section */}
                <section className="hero">
                    <h1>Discover the Music</h1>
                    <p>Explore a world of music tailored just for you. Join now to start your musical journey.</p>
                    <div className="cta-buttons">
                        <a href="/register" className="cta-btn">Register</a>
                        <a href="/login" className="cta-btn">Login</a>
                    </div>
                </section>
            </main>
        </div>
    );
}
