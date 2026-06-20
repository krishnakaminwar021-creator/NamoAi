import "./TestimonialsCarsoule.css";

const testimonials = [
  {
    quote:
      "NAMO AI Digital transformed our online presence. Our engagement metrics doubled in just 3 months. Exceptional attention to detail.",
    name: "Rohit Deshmukh",
    role: "Marketing Director",
    company: "TechFlow",
    rating: 5,
  },
  {
    quote:
      "The best agency we've worked with. They delivered a cutting-edge web app on time and their strategic approach was invaluable.",
    name: "Sneha Kulkarni",
    role: "CEO",
    company: "Apex Innovations",
    rating: 5,
  },
  {
    quote:
      "They didn't just build a website; they built a scalable digital platform. The cinematic design aesthetic completely elevated our brand.",
    name: "Akash Patil",
    role: "Founder",
    company: "Lumina Creative",
    rating: 5,
  },
  {
    quote:
      "Working with NAMO AI Digital was a great experience. Their team delivered a modern website and helped us strengthen our digital presence.",
    name: "Ananya Joshi",
    role: "Operations Head",
    company: "Nova Solutions",
    rating: 5,
  },
];

export default function TestimonialsCarsoule() {
  const items = [...testimonials, ...testimonials];

  return (
    <div className="testimonial-carousel">
      {items.map((t, idx) => (
        <article
          key={idx}
          className="testimonial-slide"
          style={{ "--i": idx }}
        >
          <div className="testimonial-stars">
            {"★".repeat(t.rating)}
          </div>

          <p className="testimonial-text">
            "{t.quote}"
          </p>

          <div className="testimonial-user">
            <div className="testimonial-avatar">
              {t.name.charAt(0)}
            </div>

            <div>
              <h4>{t.name}</h4>
              <span>
                {t.role} • {t.company}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}