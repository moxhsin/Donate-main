import React, { useState } from "react";
import API from "../.././utils/API";
import 'antd/dist/antd.css';
import './test.css';
import { Carousel } from 'antd';
import './style.css'
import styled, { createGlobalStyle } from "styled-components";
import { Theme } from "./Theme";

function SearchNews() {
    const [result, setResults] = useState([]);
    const [search, setSearch] = useState("");

    const handleInputChange = event => {
        setSearch(event.target.value);
    };

    const handleFormSubmit = event => {
        event.preventDefault();
        if (!search) {
            return;
        }

        API.searchnews(search).then(res => {
            if (res.data.length === 0) {
                throw new Error("No results found.");
            }
            if (res.data.status === "error") {
                throw new Error(res.data.message);
            }
            console.log(res.data.articles);
            setResults(res.data.articles);
        });
    };

    function imgLink(newsLink) {
        window.open(newsLink, "_blank")
    }


    const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Playfair+Display:wght@400;700&display=swap');

  body {
    background-color: ${Theme.background};
    color: ${Theme.text};
    font-family: ${Theme.fontPrimary};
  }
`;
    const Title = styled.h1`
  font-family: ${Theme.fontSecondary};
  color: ${Theme.primary};
  margin-bottom: 20px;
`;
    const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${Theme.background};
  color: ${Theme.text};
  border: 1px solid ${Theme.secondary};
  border-radius: 4px;
`;

    const Container = styled.div`
  width: 100%;
  margin: 140px auto;
  padding: 20px;
  box-sizing: border-box;
`;
    return (
        <div>
            <GlobalStyle />
            <Container>
                <div className="page_inner_div_news">
                    <Title>Search Current News</Title>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <Input
                                type="text"
                                value={search}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Corona Virus"
                                autoComplete="off"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-danger"
                            style={{ marginBottom: "20px" }}
                        >
                            Search
                        </button>
                    </form>
                        {result.length > 0 ?
                    <Carousel autoplay>
                       { result.map(reports => (
                            <div style={{ borderRadius: '2rem' }}>
                                <img
                                    style={{ height: '450px', width: '800px', margin: 'auto', }}
                                    key={reports.title}
                                    src={reports.urlToImage}
                                    alt={reports.title}
                                    onClick={() => imgLink(reports.url)}
                                />
                                <h2 style={{ color: "black" }}>{reports.title}</h2>
                            </div>
                        ))}
                    </Carousel>: <h2 style={{ color: Theme.primary }}>No result found</h2>
                        }
                </div>
            </Container>

        </div>
    );
}

export default SearchNews;
