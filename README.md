<a id="readme-top"></a>

<p align="center">
  <a href="https://github.com/jcandrews2/vibesbased/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/jcandrews2/vibesbased.svg?style=for-the-badge" alt="Contributors">
  </a>
  <a href="https://github.com/jcandrews2/vibesbased/network/members">
    <img src="https://img.shields.io/github/forks/jcandrews2/vibesbased.svg?style=for-the-badge" alt="Forks">
  </a>
  <a href="https://github.com/jcandrews2/vibesbased/stargazers">
    <img src="https://img.shields.io/github/stars/jcandrews2/vibesbased.svg?style=for-the-badge" alt="Stargazers">
  </a>
  <a href="https://github.com/jcandrews2/vibesbased/issues">
    <img src="https://img.shields.io/github/issues/jcandrews2/vibesbased.svg?style=for-the-badge" alt="Issues">
  </a>
  <a href="https://github.com/jcandrews2/vibesbased/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/jcandrews2/vibesbased.svg?style=for-the-badge" alt="License">
  </a>
</p>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="frontend/src/images/vibesbased-logo.jpg" alt="Vibesbased Logo" width="300" height="auto">
  </a>

  <h1 align="center">Vibesbased</h1>

  <p align="center">
    A music discovery application based on vibes. 
    <br />
    <a href="https://vibesbased.site"><strong>Go to website »</strong></a>
    <br />
    <br />
    <a href="https://github.com/jcandrews2/vibesbased">See Docs</a>
    &middot;
    <a href="https://github.com/jcandrews2/vibesbased/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/jcandrews2/vibesbased/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
<h2>About The Project</h2>

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Vibesbased is a full-stack music discovery web app that takes in plain-text music requests from users and plays personalized song recommendations by combining a host of APIs from Spotify, LastFM, and OpenAI. Users swipe through animated music cards to like and dislike songs building a vibe-driven portfolio over time.

The project is an attempt to offer a more intuitive and mood-aware way to explore music.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h3>Built With</h3>

<h4>APIs & SDKs</h4>
<ul>
  <li>
    <strong>Spotify Web API & Web Playback SDK</strong><br />
    Used to fetch user data and handle music streaming.
  </li>
  <li>
    <strong>Last.fm API</strong><br />
    Pulled songs from endpoints Tag, Track, Album, Artist to recommend.
  </li>
  <li>
    <strong>OpenAI API (Completions endpoint)</strong><br />
    Used to reason for appropriate tags and endpoints given user requests.
  </li>
</ul>

<h4>Technologies</h4>
<ul>
  <li><strong>Frontend:</strong> React, TypeScript, HTML, Tailwind CSS</li>
  <li><strong>Backend:</strong> Java, Spring Boot</li>
  <li><strong>Infrastructure:</strong> Docker, AWS EC2</li>
  <li><strong>Database:</strong> PostgreSQL</li>
</ul>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Markup-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Backend-SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Language-Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/DevOps-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Hosting-AWS%20EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS EC2" />
  <img src="https://img.shields.io/badge/API-OpenAI-black?style=for-the-badge&logo=openai" alt="OpenAI" />
  <img src="https://img.shields.io/badge/API-Spotify-1DB954?style=for-the-badge&logo=spotify" alt="Spotify" />
  <img src="https://img.shields.io/badge/API-Last.fm-D51007?style=for-the-badge&logo=last.fm&logoColor=white" alt="Last.fm" />
</p>


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
<h2>Getting Started</h2>

<p>Follow these steps to set up and run <strong>Vibesbased</strong> locally for development.</p>

<h3>Prerequisites</h3>
<ul>
  <li><a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js</a> (v16 or later) and npm</li>
  <li><a href="https://adoptium.net/" target="_blank" rel="noopener noreferrer">Java JDK</a> (version 11 or later)</li>
  <li>PostgreSQL database (locally installed or accessible remotely)</li>
</ul>

<h3>Installation & Setup</h3>
<ol>
  <li>
    Clone the repository<br />
    <pre><code>git clone https://github.com/jcandrews2/vibesbased.git
cd vibesbased</code></pre>
  </li>
  <li>
    Configure environment variables<br />
    Create a <code>.env</code> file inside the backend directory (<code>/backend</code>) with your API keys and database connection string:<br />
    <pre><code>SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
LASTFM_API_KEY=your_lastfm_api_key
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=jdbc:postgresql://localhost:5432/vibesbaseddb</code></pre>
  </li>
  <li>
    Start your PostgreSQL database<br />
    Ensure your PostgreSQL server is running and you have created a database named <code>vibesbaseddb</code>.
  </li>
  <li>
    Build and run the backend<br />
    <pre><code>cd backend
./mvnw clean install
./mvnw spring-boot:run</code></pre>
  </li>
  <li>
    Install dependencies and start the frontend<br />
    Open a new terminal window and run:<br />
    <pre><code>cd frontend
npm install
npm start</code></pre>
  </li>
  <li>
    Access the app<br />
    Open your browser and go to <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000</a>
  </li>
</ol>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
<h3>License</h3>

<p>Distributed under the MIT License. See <code>LICENSE</code> for more information.</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
<h3>Contact</h3>

<p>James Andrews - <a href="mailto:jcandrews2@icloud.com">jcandrews2@icloud.com</a></p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[product-screenshot]: images/vibesbased-front-page.jpg
