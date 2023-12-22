import React, { useEffect } from 'react';
import { useState } from 'react';
import './Articles.css';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Link } from "react-router-dom";

const Articles = () => {
    const [articles, setArticles] = useState([]);
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchAllArticles = async () => {
            try {
                const res = await axios.get('http://localhost:3009/articles');
                setArticles(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchAllArticles();
    }, []);

    return (
        <div className="Articles">
            <Helmet>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Articles</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                <link href="https://fonts.googleapis.com/css2?family=Catamaran:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"/>
                <script src="https://kit.fontawesome.com/957263c2c4.js" crossorigin="anonymous"></script>
            </Helmet>
            <body>
                <header>
                    <h1>About Pet Health & Care</h1>
                </header>

                <main>
                    {articles.map(article => (

                        <div className="article" key={article.articleID}>
                            {article.petType && <h2>{article.title}</h2>}

                            <img src={article.articlePfp} alt="" />
                            <p>{article.description}</p>
                            <Link to={`${article.articleLink}`} style={{ textDecoration: 'none' }}><a class="read-more">Read More</a></Link>
                        </div>

                    ))}

                    
                </main>

                <nav class="navigate">
                    <Link to="/articles"><a href="#"><i class="fa-solid fa-book-open fa-2x"></i></a></Link>
                    <Link to="/home"><a href="#"><i class="fa-solid fa-house fa-2x"></i></a></Link>
                    <Link to="/calendar"><a href="#"><i class="fa-regular fa-calendar-days fa-2x"></i></a></Link>
                </nav>
            </body>

        </div>
    )
}

export default Articles;