import React from 'react'

export default function Features() {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">❓ Frequently Asked Questions</h2>
      <div className="accordion mb-5" id="faqAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">How do I start learning?</button>
          </h2>
          <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
            <div className="accordion-body">Visit Tutorials and choose your track.</div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">Are projects beginner-friendly?</button>
          </h2>
          <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
            <div className="accordion-body">Yes, projects are categorized by level.</div>
          </div>
        </div>
      </div>
    </div>
  )
}


