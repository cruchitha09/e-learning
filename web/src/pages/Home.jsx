import React from 'react'

export default function Home() {
  return (
    <>
      <section className="bg-light text-dark text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to Staxtech</h1>
          <p className="lead">Empowering students with tutorials, projects, and internships</p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <a href="#" className="btn btn-primary btn-lg">Start Learning</a>
            <a href="#" className="btn btn-outline-dark btn-lg">Browse Projects</a>
          </div>
        </div>
      </section>

      <section className="container my-5">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Search tutorials or projects..." />
          <button className="btn btn-dark">Search</button>
        </div>
      </section>

      <section className="container my-5">
        <h2 className="text-center mb-4">Featured Tutorials</h2>
        <div className="row g-4">
          <div className="col-md-4"><div className="card"><img className="card-img-top" src="https://media.geeksforgeeks.org/wp-content/uploads/20240701150351/HTML-Tutorial-copy.webp" /><div className="card-body"><h5>Learn HTML</h5></div></div></div>
          <div className="col-md-4"><div className="card"><img className="card-img-top" src="https://www.dremendo.com/css-tutorial/images/css-tutorial.jpg" /><div className="card-body"><h5>Master CSS</h5></div></div></div>
          <div className="col-md-4"><div className="card"><img className="card-img-top" src="https://media.geeksforgeeks.org/wp-content/uploads/20240701150350/JavaScript-Tutorial-copy.webp" /><div className="card-body"><h5>JavaScript Essentials</h5></div></div></div>
        </div>
      </section>

      <footer className="bg-dark text-white py-4 text-center">
        <div className="mb-3">
          <a href="#" className="text-white me-3"><i className="bi bi-facebook"></i></a>
          <a href="#" className="text-white me-3"><i className="bi bi-twitter"></i></a>
          <a href="#" className="text-white me-3"><i className="bi bi-instagram"></i></a>
          <a href="#" className="text-white"><i className="bi bi-linkedin"></i></a>
        </div>
        <p className="mb-0">© 2025 Staxtech. All rights reserved.</p>
      </footer>
    </>
  )
}


